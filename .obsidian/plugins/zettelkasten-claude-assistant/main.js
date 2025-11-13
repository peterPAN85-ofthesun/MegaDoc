const { Plugin, Modal, Notice, TFile, TFolder, PluginSettingTab, Setting } = require('obsidian');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Settings par défaut
const DEFAULT_SETTINGS = {
    executionMode: 'terminal', // 'clipboard' ou 'terminal'
    preferredTerminal: 'auto' // 'auto', 'gnome-terminal', 'konsole', 'xterm', etc.
};

class ZettelkastenClaudePlugin extends Plugin {
    async onload() {
        console.log('Loading Zettelkasten Claude Assistant plugin');

        // Charger les settings
        await this.loadSettings();

        // Ajouter l'onglet de settings
        this.addSettingTab(new ZettelkastenSettingTab(this.app, this));

        // Command: Create Note
        this.addCommand({
            id: 'create-note',
            name: 'Créer une note permanente',
            callback: () => {
                new CreateNoteModal(this.app, this).open();
            }
        });

        // Command: Atomize
        this.addCommand({
            id: 'atomize-note',
            name: 'Atomiser une note (extraire concepts)',
            callback: () => {
                new AtomizeModal(this.app, this).open();
            }
        });

        // Command: Find Links
        this.addCommand({
            id: 'find-links',
            name: 'Trouver des liens pour la note active',
            editorCallback: (editor, view) => {
                const file = view.file;
                if (file) {
                    new FindLinksModal(this.app, this, file).open();
                } else {
                    new Notice('Aucun fichier actif');
                }
            }
        });

        // Command: Process Inbox
        this.addCommand({
            id: 'process-inbox',
            name: 'Traiter l\'Inbox (0-Inbox/)',
            callback: () => {
                new ProcessInboxModal(this.app, this).open();
            }
        });

        // Command: Update MOC
        this.addCommand({
            id: 'update-moc',
            name: 'Mettre à jour un Map of Content (MOC)',
            callback: () => {
                new UpdateMOCModal(this.app, this).open();
            }
        });

        // Command: Audit Note
        this.addCommand({
            id: 'audit-note',
            name: 'Auditer la qualité de la note active',
            editorCallback: (editor, view) => {
                const file = view.file;
                if (file) {
                    new AuditModal(this.app, this, file).open();
                } else {
                    new Notice('Aucun fichier actif');
                }
            }
        });

        // Command: Process Current Note
        this.addCommand({
            id: 'process-current-note',
            name: 'Traiter la note courante (atomiser + compléter + MOC)',
            editorCallback: (editor, view) => {
                const file = view.file;
                if (file) {
                    new ProcessCurrentNoteModal(this.app, this, file).open();
                } else {
                    new Notice('Aucun fichier actif');
                }
            }
        });

        // Command: Quick Workflow Guide
        this.addCommand({
            id: 'workflow-guide',
            name: 'Ouvrir le guide des workflows',
            callback: () => {
                this.openWorkflowGuide();
            }
        });
    }

    async openWorkflowGuide() {
        const files = this.app.vault.getMarkdownFiles();
        const workflowFile = files.find(f =>
            f.path === 'WORKFLOW-QUICKSTART.md' || f.path === 'WORKFLOW.md'
        );

        if (workflowFile) {
            await this.app.workspace.getLeaf().openFile(workflowFile);
        } else {
            new Notice('Fichier WORKFLOW non trouvé');
        }
    }

    async executeClaudeCommand(command, args = {}) {
        const vaultPath = this.app.vault.adapter.basePath;
        const prompt = this.buildClaudePrompt(command, args);

        if (this.settings.executionMode === 'terminal') {
            // Mode terminal : Lancer un terminal avec Claude
            try {
                await this.launchTerminalWithClaude(vaultPath, prompt);
                new Notice('Terminal lancé avec la commande Claude');
                return { mode: 'terminal', prompt };
            } catch (error) {
                console.error('Erreur lancement terminal:', error);
                // Fallback sur clipboard
                await navigator.clipboard.writeText(prompt);
                new Notice('Erreur terminal. Prompt copié dans le presse-papiers.');
                return { mode: 'clipboard', prompt };
            }
        } else {
            // Mode clipboard : Copier dans le presse-papiers
            await navigator.clipboard.writeText(prompt);
            new Notice('Prompt copié dans le presse-papiers. Collez-le dans Claude Code.');
            return { mode: 'clipboard', prompt };
        }
    }

    async launchTerminalWithClaude(vaultPath, prompt) {
        const scriptPath = `${vaultPath}/.claude/launch-claude.sh`;

        // Échapper les guillemets dans le prompt
        const escapedPrompt = prompt.replace(/"/g, '\\"').replace(/\$/g, '\\$');

        // Détecter le terminal disponible
        let terminalCommand;

        if (this.settings.preferredTerminal !== 'auto') {
            // Utiliser le terminal préféré
            terminalCommand = this.getTerminalCommand(this.settings.preferredTerminal, scriptPath, vaultPath, escapedPrompt);
        } else {
            // Auto-détection
            const terminals = [
                'gnome-terminal',
                'konsole',
                'xfce4-terminal',
                'alacritty',
                'kitty',
                'terminator',
                'xterm'
            ];

            for (const term of terminals) {
                try {
                    await execAsync(`which ${term}`);
                    terminalCommand = this.getTerminalCommand(term, scriptPath, vaultPath, escapedPrompt);
                    break;
                } catch (e) {
                    // Terminal non trouvé, continuer
                }
            }
        }

        if (!terminalCommand) {
            throw new Error('Aucun terminal trouvé');
        }

        // Lancer le terminal
        exec(terminalCommand, (error) => {
            if (error) {
                console.error('Erreur lancement terminal:', error);
            }
        });
    }

    getTerminalCommand(terminal, scriptPath, vaultPath, prompt) {
        switch (terminal) {
            case 'gnome-terminal':
                return `gnome-terminal --working-directory="${vaultPath}" -- bash -c '${scriptPath} "${vaultPath}" "${prompt}"; exec bash'`;

            case 'konsole':
                return `konsole --workdir "${vaultPath}" -e bash -c '${scriptPath} "${vaultPath}" "${prompt}"; exec bash'`;

            case 'xfce4-terminal':
                return `xfce4-terminal --working-directory="${vaultPath}" -e 'bash -c "${scriptPath} \\"${vaultPath}\\" \\"${prompt}\\"; exec bash"'`;

            case 'alacritty':
                return `alacritty --working-directory "${vaultPath}" -e bash -c '${scriptPath} "${vaultPath}" "${prompt}"; exec bash'`;

            case 'kitty':
                return `kitty --directory "${vaultPath}" bash -c '${scriptPath} "${vaultPath}" "${prompt}"; exec bash'`;

            case 'terminator':
                return `terminator --working-directory="${vaultPath}" -e 'bash -c "${scriptPath} \\"${vaultPath}\\" \\"${prompt}\\"; exec bash"'`;

            case 'xterm':
                return `xterm -e 'cd "${vaultPath}" && ${scriptPath} "${vaultPath}" "${prompt}"; exec bash'`;

            default:
                return null;
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    buildClaudePrompt(command, args) {
        switch (command) {
            case 'create-note':
                return `Je veux créer une note permanente sur : ${args.concept}

${args.content ? `Voici le contenu/contexte :\n${args.content}` : ''}

Utilise la commande /create-note pour créer cette note dans 1-Permanent/.`;

            case 'atomize':
                return `Je veux atomiser le fichier : ${args.filePath}

Extrais tous les concepts atomiques et crée une note permanente pour chacun.
Utilise /atomize ${args.filePath}`;

            case 'find-links':
                return `Trouve des liens pertinents pour la note : ${args.noteName}

Analyse mon vault et suggère des connexions.
Utilise /find-links ${args.noteName}`;

            case 'process-inbox':
                return `Aide-moi à traiter le contenu de 0-Inbox/

Analyse tous les fichiers et propose un plan de traitement.
Utilise /process-inbox`;

            case 'update-moc':
                return `Mets à jour le MOC : ${args.mocName}

Recherche toutes les notes liées et organise-les.
Utilise /update-moc ${args.mocName}`;

            case 'audit':
                return `Audite la qualité de ma note : ${args.noteName}

Vérifie l'atomicité, les connexions, la clarté.
Utilise /audit ${args.noteName}`;

            case 'process-current-note':
                let mocInstruction = '';
                if (args.mocAction === 'create') {
                    mocInstruction = `\n\nCrée un nouveau MOC nommé : ${args.mocName}`;
                } else if (args.mocAction === 'update') {
                    mocInstruction = `\n\nMets à jour le MOC existant : ${args.mocName}`;
                } else if (args.mocAction === 'none') {
                    mocInstruction = '\n\nNe crée pas de MOC.';
                } else {
                    mocInstruction = '\n\nDemande-moi quel MOC créer/mettre à jour après analyse.';
                }

                return `Je veux traiter complètement la note : ${args.filePath}

TRAITEMENT COMPLET :
1. Analyse le contenu
2. Atomise en concepts distincts
3. Crée des notes permanentes COMPLÈTES pour chaque concept dans 1-Permanent/
4. Établis les connexions entre toutes les notes
5. Gère le MOC selon instruction${mocInstruction}

IMPORTANT : Chaque note permanente créée doit être COMPLÈTE avec :
- Explication détaillée (2-3 paragraphes)
- Au moins 1 exemple concret
- Minimum 3 liens vers autres notes
- Avantages et inconvénients si applicable
- Tous les champs remplis (pas de sections vides)

Utilise /process-current-note`;

            default:
                return `Commande Claude : ${command}`;
        }
    }

    async tryExecuteClaudeCLI(command, args, vaultPath) {
        // Tenter d'exécuter Claude CLI si disponible
        // Ceci nécessite que Claude CLI soit installé et accessible

        const claudeCommands = {
            'create-note': `/create-note ${args.concept}`,
            'atomize': `/atomize ${args.filePath}`,
            'find-links': `/find-links ${args.noteName}`,
            'process-inbox': `/process-inbox`,
            'update-moc': `/update-moc ${args.mocName}`,
            'audit': `/audit ${args.noteName}`
        };

        const cmd = claudeCommands[command];

        // Note: Ceci nécessite une configuration spécifique de Claude CLI
        // Pour l'instant, nous utilisons le mode clipboard
        throw new Error('Claude CLI pas encore configuré, utilisation du presse-papiers');
    }

    onunload() {
        console.log('Unloading Zettelkasten Claude Assistant plugin');
    }
}

// Modal: Create Note
class CreateNoteModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        contentEl.createEl('h2', { text: 'Créer une note permanente' });

        // Concept input
        contentEl.createEl('label', { text: 'Concept :' });
        const conceptInput = contentEl.createEl('input', {
            type: 'text',
            placeholder: 'Ex: TCP Three-Way Handshake'
        });
        conceptInput.style.width = '100%';
        conceptInput.style.marginBottom = '15px';

        // Content textarea
        contentEl.createEl('label', { text: 'Contenu/Contexte (optionnel) :' });
        const contentTextarea = contentEl.createEl('textarea', {
            placeholder: 'Notes brutes, source, informations...'
        });
        contentTextarea.style.width = '100%';
        contentTextarea.style.height = '150px';
        contentTextarea.style.marginBottom = '15px';

        // Buttons
        const buttonDiv = contentEl.createDiv();
        buttonDiv.style.textAlign = 'right';

        const cancelBtn = buttonDiv.createEl('button', { text: 'Annuler' });
        cancelBtn.style.marginRight = '10px';
        cancelBtn.onclick = () => this.close();

        const createBtn = buttonDiv.createEl('button', {
            text: 'Créer avec Claude',
            cls: 'mod-cta'
        });
        createBtn.onclick = async () => {
            const concept = conceptInput.value.trim();
            if (!concept) {
                new Notice('Veuillez entrer un concept');
                return;
            }

            await this.plugin.executeClaudeCommand('create-note', {
                concept: concept,
                content: contentTextarea.value.trim()
            });

            this.close();
        };
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

// Modal: Atomize
class AtomizeModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        contentEl.createEl('h2', { text: 'Atomiser une note' });

        contentEl.createEl('p', {
            text: 'Sélectionnez un fichier dans 0-Inbox/ à atomiser en plusieurs notes permanentes.'
        });

        // File selector
        contentEl.createEl('label', { text: 'Fichier à atomiser :' });
        const fileSelect = contentEl.createEl('select');
        fileSelect.style.width = '100%';
        fileSelect.style.marginBottom = '15px';

        // Populate with files from 0-Inbox
        const inboxFiles = this.app.vault.getMarkdownFiles()
            .filter(f => f.path.startsWith('0-Inbox/'));

        if (inboxFiles.length === 0) {
            contentEl.createEl('p', {
                text: 'Aucun fichier trouvé dans 0-Inbox/',
                cls: 'mod-warning'
            });
            return;
        }

        inboxFiles.forEach(file => {
            const option = fileSelect.createEl('option', {
                text: file.path,
                value: file.path
            });
        });

        // Buttons
        const buttonDiv = contentEl.createDiv();
        buttonDiv.style.textAlign = 'right';

        const cancelBtn = buttonDiv.createEl('button', { text: 'Annuler' });
        cancelBtn.style.marginRight = '10px';
        cancelBtn.onclick = () => this.close();

        const atomizeBtn = buttonDiv.createEl('button', {
            text: 'Atomiser avec Claude',
            cls: 'mod-cta'
        });
        atomizeBtn.onclick = async () => {
            const filePath = fileSelect.value;

            await this.plugin.executeClaudeCommand('atomize', {
                filePath: filePath
            });

            this.close();
        };
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

// Modal: Find Links
class FindLinksModal extends Modal {
    constructor(app, plugin, file) {
        super(app);
        this.plugin = plugin;
        this.file = file;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        contentEl.createEl('h2', { text: 'Trouver des liens' });

        contentEl.createEl('p', {
            text: `Rechercher des connexions pour : ${this.file.basename}`
        });

        contentEl.createEl('p', {
            text: 'Claude va analyser votre vault et suggérer des liens pertinents.',
            cls: 'mod-muted'
        });

        // Buttons
        const buttonDiv = contentEl.createDiv();
        buttonDiv.style.textAlign = 'right';

        const cancelBtn = buttonDiv.createEl('button', { text: 'Annuler' });
        cancelBtn.style.marginRight = '10px';
        cancelBtn.onclick = () => this.close();

        const findBtn = buttonDiv.createEl('button', {
            text: 'Trouver avec Claude',
            cls: 'mod-cta'
        });
        findBtn.onclick = async () => {
            await this.plugin.executeClaudeCommand('find-links', {
                noteName: this.file.basename
            });

            this.close();
        };
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

// Modal: Process Inbox
class ProcessInboxModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        contentEl.createEl('h2', { text: 'Traiter l\'Inbox' });

        // Count files in inbox
        const inboxFiles = this.app.vault.getMarkdownFiles()
            .filter(f => f.path.startsWith('0-Inbox/'));

        contentEl.createEl('p', {
            text: `${inboxFiles.length} fichier(s) trouvé(s) dans 0-Inbox/`
        });

        if (inboxFiles.length === 0) {
            contentEl.createEl('p', {
                text: '✅ Votre inbox est vide !',
                cls: 'mod-success'
            });

            const closeBtn = contentEl.createEl('button', {
                text: 'Fermer',
                cls: 'mod-cta'
            });
            closeBtn.onclick = () => this.close();
            return;
        }

        contentEl.createEl('p', {
            text: 'Claude va analyser tous les fichiers et proposer un plan de traitement.',
            cls: 'mod-muted'
        });

        // Buttons
        const buttonDiv = contentEl.createDiv();
        buttonDiv.style.textAlign = 'right';

        const cancelBtn = buttonDiv.createEl('button', { text: 'Annuler' });
        cancelBtn.style.marginRight = '10px';
        cancelBtn.onclick = () => this.close();

        const processBtn = buttonDiv.createEl('button', {
            text: 'Traiter avec Claude',
            cls: 'mod-cta'
        });
        processBtn.onclick = async () => {
            await this.plugin.executeClaudeCommand('process-inbox', {});
            this.close();
        };
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

// Modal: Update MOC
class UpdateMOCModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        contentEl.createEl('h2', { text: 'Mettre à jour un MOC' });

        contentEl.createEl('label', { text: 'Nom du MOC :' });
        const mocSelect = contentEl.createEl('select');
        mocSelect.style.width = '100%';
        mocSelect.style.marginBottom = '15px';

        // Populate with existing MOCs
        const mocFiles = this.app.vault.getMarkdownFiles()
            .filter(f => f.path.startsWith('2-Maps/') && f.basename.startsWith('MOC'));

        if (mocFiles.length === 0) {
            contentEl.createEl('p', {
                text: 'Aucun MOC trouvé dans 2-Maps/',
                cls: 'mod-warning'
            });
        } else {
            mocFiles.forEach(file => {
                mocSelect.createEl('option', {
                    text: file.basename,
                    value: file.basename
                });
            });
        }

        // Option to create new MOC
        const newMocOption = contentEl.createDiv();
        newMocOption.style.marginTop = '10px';

        const newMocCheckbox = newMocOption.createEl('input', { type: 'checkbox' });
        newMocCheckbox.id = 'new-moc-checkbox';
        newMocOption.createEl('label', {
            text: ' Créer un nouveau MOC',
            attr: { for: 'new-moc-checkbox' }
        });

        const newMocInput = contentEl.createEl('input', {
            type: 'text',
            placeholder: 'Ex: MOC - Programmation'
        });
        newMocInput.style.width = '100%';
        newMocInput.style.marginTop = '10px';
        newMocInput.style.display = 'none';

        newMocCheckbox.onchange = () => {
            if (newMocCheckbox.checked) {
                mocSelect.disabled = true;
                newMocInput.style.display = 'block';
            } else {
                mocSelect.disabled = false;
                newMocInput.style.display = 'none';
            }
        };

        // Buttons
        const buttonDiv = contentEl.createDiv();
        buttonDiv.style.marginTop = '20px';
        buttonDiv.style.textAlign = 'right';

        const cancelBtn = buttonDiv.createEl('button', { text: 'Annuler' });
        cancelBtn.style.marginRight = '10px';
        cancelBtn.onclick = () => this.close();

        const updateBtn = buttonDiv.createEl('button', {
            text: 'Mettre à jour avec Claude',
            cls: 'mod-cta'
        });
        updateBtn.onclick = async () => {
            let mocName;

            if (newMocCheckbox.checked) {
                mocName = newMocInput.value.trim();
                if (!mocName) {
                    new Notice('Veuillez entrer un nom de MOC');
                    return;
                }
            } else {
                mocName = mocSelect.value;
            }

            await this.plugin.executeClaudeCommand('update-moc', {
                mocName: mocName
            });

            this.close();
        };
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

// Modal: Audit
class AuditModal extends Modal {
    constructor(app, plugin, file) {
        super(app);
        this.plugin = plugin;
        this.file = file;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        contentEl.createEl('h2', { text: 'Auditer la note' });

        contentEl.createEl('p', {
            text: `Note à auditer : ${this.file.basename}`
        });

        contentEl.createEl('p', {
            text: 'Claude va évaluer la qualité de cette note selon les critères Zettelkasten :',
            cls: 'mod-muted'
        });

        const criteriaList = contentEl.createEl('ul');
        criteriaList.style.marginLeft = '20px';
        ['Atomicité', 'Clarté', 'Connexions', 'Autonomie', 'Concision'].forEach(criterion => {
            criteriaList.createEl('li', { text: criterion });
        });

        // Buttons
        const buttonDiv = contentEl.createDiv();
        buttonDiv.style.marginTop = '20px';
        buttonDiv.style.textAlign = 'right';

        const cancelBtn = buttonDiv.createEl('button', { text: 'Annuler' });
        cancelBtn.style.marginRight = '10px';
        cancelBtn.onclick = () => this.close();

        const auditBtn = buttonDiv.createEl('button', {
            text: 'Auditer avec Claude',
            cls: 'mod-cta'
        });
        auditBtn.onclick = async () => {
            await this.plugin.executeClaudeCommand('audit', {
                noteName: this.file.basename
            });

            this.close();
        };
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

// Modal: Process Current Note
class ProcessCurrentNoteModal extends Modal {
    constructor(app, plugin, file) {
        super(app);
        this.plugin = plugin;
        this.file = file;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        contentEl.createEl('h2', { text: 'Traiter la note courante' });

        contentEl.createEl('p', {
            text: `Note à traiter : ${this.file.basename}`
        });

        // Description
        const descDiv = contentEl.createDiv();
        descDiv.style.marginBottom = '20px';
        descDiv.style.padding = '15px';
        descDiv.style.backgroundColor = 'var(--background-secondary)';
        descDiv.style.borderRadius = '5px';

        descDiv.createEl('strong', { text: 'Ce traitement va :' });
        const actionList = descDiv.createEl('ol');
        actionList.style.marginLeft = '20px';
        actionList.style.marginTop = '10px';

        [
            '📊 Analyser le contenu de la note',
            '✂️ Atomiser en concepts distincts',
            '📝 Créer des notes permanentes complètes',
            '🔗 Établir les connexions entre notes',
            '🗺️ Créer ou mettre à jour un MOC (selon votre choix)'
        ].forEach(action => {
            actionList.createEl('li', { text: action });
        });

        // MOC Selection
        contentEl.createEl('h3', { text: 'MOC (Map of Content)' });
        contentEl.createEl('label', { text: 'Que faire avec le MOC ?' });

        const mocSelect = contentEl.createEl('select');
        mocSelect.style.width = '100%';
        mocSelect.style.marginBottom = '15px';

        // Options
        mocSelect.createEl('option', {
            text: 'Demander après analyse',
            value: 'ask'
        });
        mocSelect.createEl('option', {
            text: 'Créer un nouveau MOC',
            value: 'create'
        });
        mocSelect.createEl('option', {
            text: 'Mettre à jour un MOC existant',
            value: 'update'
        });
        mocSelect.createEl('option', {
            text: 'Pas de MOC',
            value: 'none'
        });

        // MOC Name (shown conditionally)
        const mocNameDiv = contentEl.createDiv();
        mocNameDiv.style.display = 'none';
        mocNameDiv.style.marginBottom = '15px';

        mocNameDiv.createEl('label', { text: 'Nom du MOC :' });
        const mocNameInput = mocNameDiv.createEl('input', {
            type: 'text',
            placeholder: 'Ex: MOC - Réseau'
        });
        mocNameInput.style.width = '100%';

        // Existing MOC selector (shown conditionally)
        const existingMocDiv = contentEl.createDiv();
        existingMocDiv.style.display = 'none';
        existingMocDiv.style.marginBottom = '15px';

        existingMocDiv.createEl('label', { text: 'MOC existant :' });
        const existingMocSelect = existingMocDiv.createEl('select');
        existingMocSelect.style.width = '100%';

        const mocFiles = this.app.vault.getMarkdownFiles()
            .filter(f => f.path.startsWith('2-Maps/') && f.basename.startsWith('MOC'));

        if (mocFiles.length > 0) {
            mocFiles.forEach(file => {
                existingMocSelect.createEl('option', {
                    text: file.basename,
                    value: file.basename
                });
            });
        } else {
            existingMocSelect.createEl('option', {
                text: 'Aucun MOC trouvé',
                value: ''
            });
        }

        // Show/hide MOC fields based on selection
        mocSelect.onchange = () => {
            const value = mocSelect.value;

            if (value === 'create') {
                mocNameDiv.style.display = 'block';
                existingMocDiv.style.display = 'none';
            } else if (value === 'update') {
                mocNameDiv.style.display = 'none';
                existingMocDiv.style.display = 'block';
            } else {
                mocNameDiv.style.display = 'none';
                existingMocDiv.style.display = 'none';
            }
        };

        // Info
        const infoDiv = contentEl.createDiv();
        infoDiv.style.marginTop = '15px';
        infoDiv.style.padding = '10px';
        infoDiv.style.backgroundColor = 'var(--background-secondary-alt)';
        infoDiv.style.borderRadius = '5px';
        infoDiv.style.fontSize = '0.9em';
        infoDiv.style.color = 'var(--text-muted)';

        infoDiv.createEl('p', {
            text: '💡 Le prompt sera copié dans votre presse-papiers. Collez-le dans Claude Code pour exécuter le traitement complet.'
        });

        // Buttons
        const buttonDiv = contentEl.createDiv();
        buttonDiv.style.marginTop = '20px';
        buttonDiv.style.textAlign = 'right';

        const cancelBtn = buttonDiv.createEl('button', { text: 'Annuler' });
        cancelBtn.style.marginRight = '10px';
        cancelBtn.onclick = () => this.close();

        const processBtn = buttonDiv.createEl('button', {
            text: 'Traiter avec Claude',
            cls: 'mod-cta'
        });
        processBtn.onclick = async () => {
            const mocAction = mocSelect.value;
            let mocName = '';

            if (mocAction === 'create') {
                mocName = mocNameInput.value.trim();
                if (!mocName) {
                    new Notice('Veuillez entrer un nom de MOC');
                    return;
                }
            } else if (mocAction === 'update') {
                mocName = existingMocSelect.value;
                if (!mocName) {
                    new Notice('Aucun MOC existant sélectionné');
                    return;
                }
            }

            await this.plugin.executeClaudeCommand('process-current-note', {
                noteName: this.file.basename,
                filePath: this.file.path,
                mocAction: mocAction,
                mocName: mocName
            });

            this.close();
        };
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

// Settings Tab
class ZettelkastenSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Zettelkasten Claude Assistant - Configuration' });

        // Mode d'exécution
        new Setting(containerEl)
            .setName('Mode d\'exécution')
            .setDesc('Comment exécuter les commandes Claude')
            .addDropdown(dropdown => dropdown
                .addOption('terminal', '🖥️ Terminal (automatique)')
                .addOption('clipboard', '📋 Presse-papiers (manuel)')
                .setValue(this.plugin.settings.executionMode)
                .onChange(async (value) => {
                    this.plugin.settings.executionMode = value;
                    await this.plugin.saveSettings();
                    new Notice(`Mode changé : ${value === 'terminal' ? 'Terminal automatique' : 'Presse-papiers'}`);
                }));

        // Terminal préféré
        new Setting(containerEl)
            .setName('Terminal préféré')
            .setDesc('Quel terminal utiliser (auto-détection recommandée)')
            .addDropdown(dropdown => dropdown
                .addOption('auto', 'Auto-détection')
                .addOption('gnome-terminal', 'GNOME Terminal')
                .addOption('konsole', 'Konsole (KDE)')
                .addOption('xfce4-terminal', 'XFCE Terminal')
                .addOption('alacritty', 'Alacritty')
                .addOption('kitty', 'Kitty')
                .addOption('terminator', 'Terminator')
                .addOption('xterm', 'XTerm')
                .setValue(this.plugin.settings.preferredTerminal)
                .onChange(async (value) => {
                    this.plugin.settings.preferredTerminal = value;
                    await this.plugin.saveSettings();
                }));

        // Info section
        containerEl.createEl('h3', { text: 'ℹ️ Informations' });

        const infoDiv = containerEl.createDiv();
        infoDiv.style.padding = '15px';
        infoDiv.style.backgroundColor = 'var(--background-secondary)';
        infoDiv.style.borderRadius = '5px';
        infoDiv.style.marginTop = '10px';

        infoDiv.createEl('p', {
            text: '🖥️ Mode Terminal : Lance automatiquement un terminal avec Claude Code'
        });

        infoDiv.createEl('p', {
            text: '📋 Mode Presse-papiers : Copie le prompt, vous le collez manuellement dans Claude'
        });

        infoDiv.createEl('p', {
            text: '💡 Recommandé : Mode Terminal pour un workflow ultra-rapide !'
        });

        // Test section
        containerEl.createEl('h3', { text: '🧪 Test' });

        new Setting(containerEl)
            .setName('Tester le terminal')
            .setDesc('Vérifier que le terminal se lance correctement')
            .addButton(button => button
                .setButtonText('Tester')
                .onClick(async () => {
                    const vaultPath = this.app.vault.adapter.basePath;
                    const testPrompt = 'echo "Test du terminal Zettelkasten Claude Assistant"';

                    try {
                        await this.plugin.launchTerminalWithClaude(vaultPath, testPrompt);
                        new Notice('✅ Terminal lancé avec succès !');
                    } catch (error) {
                        new Notice(`❌ Erreur : ${error.message}`);
                        console.error(error);
                    }
                }));

        // Raccourcis clavier
        containerEl.createEl('h3', { text: '⌨️ Raccourcis clavier' });

        const shortcutsDiv = containerEl.createDiv();
        shortcutsDiv.style.padding = '15px';
        shortcutsDiv.style.backgroundColor = 'var(--background-secondary)';
        shortcutsDiv.style.borderRadius = '5px';
        shortcutsDiv.style.marginTop = '10px';

        shortcutsDiv.createEl('p', {
            text: 'Vous pouvez assigner des raccourcis clavier dans :'
        });

        shortcutsDiv.createEl('p', {
            text: '⚙️ Paramètres → Raccourcis clavier → Rechercher "Zettelkasten"',
            cls: 'mod-muted'
        });

        // Version info
        containerEl.createDiv({
            text: 'Version 1.1.0 | Plugin Zettelkasten Claude Assistant',
            cls: 'mod-muted'
        }).style.marginTop = '30px';
    }
}

module.exports = ZettelkastenClaudePlugin;
