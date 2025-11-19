const { Plugin, ItemView, WorkspaceLeaf, MarkdownRenderer, Setting, Notice } = require('obsidian');
const { exec, spawn } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const os = require('os');

const execAsync = promisify(exec);

// ==================== CONFIGURATION ====================

const VIEW_TYPE_CLAUDE = 'claude-chat-view';

const DEFAULT_SETTINGS = {
    claudeCommand: 'claude',
    maxContextNotes: 50,
    includeVaultContext: true,
    claudePlan: 'pro' // 'pro', 'max5', or 'max20'
};

// Token limits per 5-hour window for different plans
const PLAN_LIMITS = {
    'pro': 44000,      // ~44k tokens per 5h
    'max5': 88000,     // ~88k tokens per 5h
    'max20': 220000    // ~220k tokens per 5h
};

// ==================== CLAUDE CODE CLI CLIENT ====================

class ClaudeCLIClient {
    constructor(settings) {
        this.settings = settings;
        this.claudeCommand = settings.claudeCommand || 'claude';
    }

    async checkInstalled() {
        try {
            const { stdout } = await execAsync(`which ${this.claudeCommand}`);
            return stdout.trim().length > 0;
        } catch (error) {
            return false;
        }
    }

    async sendMessage(prompt, systemContext = '') {
        return new Promise((resolve, reject) => {
            try {
                // Construire le prompt complet
                let fullPrompt = prompt;

                if (systemContext) {
                    fullPrompt = `${systemContext}\n\n---\n\n${prompt}`;
                }

                // Lancer Claude CLI avec spawn pour utiliser stdin
                const claudeProcess = spawn(this.claudeCommand, [], {
                    shell: true
                });

                let output = '';
                let errorOutput = '';

                // Envoyer le prompt via stdin (pas d'échappement nécessaire)
                claudeProcess.stdin.write(fullPrompt);
                claudeProcess.stdin.end();

                // Recevoir la sortie
                claudeProcess.stdout.on('data', (data) => {
                    output += data.toString();
                });

                claudeProcess.stderr.on('data', (data) => {
                    errorOutput += data.toString();
                });

                claudeProcess.on('close', (code) => {
                    if (code !== 0 && errorOutput) {
                        if (errorOutput.includes('not found') || code === 127) {
                            reject(new Error('Claude Code CLI non trouvé. Assurez-vous que Claude Code est installé et dans votre PATH.'));
                        } else if (errorOutput.includes('not authenticated')) {
                            reject(new Error('Claude Code non authentifié. Lancez "claude auth login" dans votre terminal.'));
                        } else {
                            reject(new Error(`Claude CLI Error: ${errorOutput}`));
                        }
                    } else {
                        resolve(output.trim());
                    }
                });

                claudeProcess.on('error', (error) => {
                    console.error('Erreur Claude CLI:', error);
                    reject(error);
                });

            } catch (error) {
                console.error('Erreur Claude CLI:', error);
                reject(error);
            }
        });
    }

    async sendMessageStreaming(prompt, systemContext, onChunk) {
        return new Promise((resolve, reject) => {
            try {
                // Construire le prompt complet
                let fullPrompt = prompt;

                if (systemContext) {
                    fullPrompt = `${systemContext}\n\n---\n\n${prompt}`;
                }

                // Lancer Claude en mode streaming
                const claudeProcess = spawn(this.claudeCommand, [], {
                    shell: true
                });

                let output = '';
                let errorOutput = '';

                // Envoyer le prompt
                claudeProcess.stdin.write(fullPrompt);
                claudeProcess.stdin.end();

                // Recevoir la sortie en streaming
                claudeProcess.stdout.on('data', (data) => {
                    const chunk = data.toString();
                    output += chunk;
                    if (onChunk) {
                        onChunk(chunk);
                    }
                });

                claudeProcess.stderr.on('data', (data) => {
                    errorOutput += data.toString();
                });

                claudeProcess.on('close', (code) => {
                    if (code !== 0 && errorOutput) {
                        reject(new Error(`Claude CLI Error: ${errorOutput}`));
                    } else {
                        resolve(output.trim());
                    }
                });

                claudeProcess.on('error', (error) => {
                    reject(error);
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    async sendMessageWithImages(prompt, systemContext, images) {
        // Note: Claude Code CLI ne supporte pas encore l'envoi d'images via stdin
        // Cette méthode est préparée pour le support futur

        const imageNames = images.map(img => img.name).join(', ');
        const imageCount = images.length;

        let warningMessage = `⚠️ **Analyse d'images non disponible**

${imageCount > 1 ? 'Images reçues' : 'Image reçue'} : ${imageNames}

L'analyse d'images n'est pas encore supportée par Claude Code CLI via ce plugin.

**Solutions alternatives :**
1. 📱 Utiliser l'interface web [Claude.ai](https://claude.ai)
2. 💻 Utiliser directement Claude Code CLI dans votre terminal
3. ⏳ Attendre la prochaine mise à jour du plugin (API directe)

`;

        // Si pas de texte, retourner juste le message d'avertissement
        if (!prompt || prompt.trim() === '') {
            return warningMessage + `💡 **Astuce** : Vous pouvez ajouter du texte à votre message pour que je puisse vous aider même sans l'image.`;
        }

        // Si du texte est présent, traiter aussi le texte
        warningMessage += `📝 En attendant, je vais répondre à votre question textuelle...\n\n---\n`;

        try {
            const textResponse = await this.sendMessage(prompt, systemContext);
            return `${warningMessage}\n**Votre question :** "${prompt}"\n\n**Réponse :**\n${textResponse}`;
        } catch (error) {
            return warningMessage + `\n❌ Erreur lors du traitement du texte : ${error.message}`;
        }
    }
}

// ==================== CLAUDE CHAT VIEW ====================

class ClaudeView extends ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.conversationHistory = [];
        this.currentVaultContext = '';
        this.attachedImages = []; // Stockage des images attachées
        this.usagePercentage = 0; // Pourcentage d'usage
        this.usageInfo = null; // Informations détaillées sur l'usage
    }

    getViewType() {
        return VIEW_TYPE_CLAUDE;
    }

    getDisplayText() {
        return 'Claude Client';
    }

    getIcon() {
        return 'message-circle';
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        container.addClass('claude-client-container');

        // Header avec options
        const headerDiv = container.createDiv({ cls: 'claude-header' });

        const titleDiv = headerDiv.createDiv({ cls: 'claude-title' });
        titleDiv.createEl('h3', { text: 'Claude Assistant' });
        titleDiv.createEl('small', {
            text: 'via Claude Code CLI',
            cls: 'claude-subtitle'
        });

        // Barre de progression d'usage
        const usageContainer = titleDiv.createDiv({ cls: 'claude-usage-container' });

        this.usageLabelEl = usageContainer.createEl('span', {
            text: 'Usage (5h):',
            cls: 'claude-usage-label'
        });

        const usageBarWrapper = usageContainer.createDiv({ cls: 'claude-usage-bar-wrapper' });
        this.usageBarEl = usageBarWrapper.createDiv({ cls: 'claude-usage-bar' });

        this.usagePercentageEl = usageContainer.createEl('span', {
            text: 'N/A',
            cls: 'claude-usage-percentage'
        });

        const actionsDiv = headerDiv.createDiv({ cls: 'claude-actions' });

        // Bouton pour analyser la note courante
        const analyzeBtn = actionsDiv.createEl('button', {
            text: '📝 Analyser note',
            cls: 'claude-action-btn'
        });
        analyzeBtn.addEventListener('click', () => this.analyzeCurrentNote());

        // Bouton pour charger le contexte du vault
        const contextBtn = actionsDiv.createEl('button', {
            text: '📚 Charger vault',
            cls: 'claude-action-btn'
        });
        contextBtn.addEventListener('click', () => this.loadVaultContext());

        // Bouton pour nettoyer la conversation
        const clearBtn = actionsDiv.createEl('button', {
            text: '🗑️ Effacer',
            cls: 'claude-action-btn'
        });
        clearBtn.addEventListener('click', () => this.clearConversation());

        // Zone de messages
        this.messagesDiv = container.createDiv({ cls: 'claude-messages' });

        // Vérifier que Claude Code est installé
        await this.checkClaudeInstallation();

        // Zone de saisie
        const inputContainer = container.createDiv({ cls: 'claude-input-container' });

        // Zone de prévisualisation des images
        this.imagePreviewDiv = inputContainer.createDiv({ cls: 'claude-image-preview' });

        // Wrapper pour textarea + button
        const inputWrapper = inputContainer.createDiv({ cls: 'claude-input-wrapper' });

        this.inputArea = inputWrapper.createEl('textarea', {
            cls: 'claude-input',
            attr: {
                placeholder: 'Posez votre question à Claude... (Glissez-déposez des images ici)',
                rows: 3
            }
        });

        const sendBtn = inputWrapper.createEl('button', {
            text: 'Envoyer',
            cls: 'claude-send-btn mod-cta'
        });

        // Ajouter le drag & drop pour les images
        this.setupImageDragAndDrop(inputContainer);

        // Gestion de l'envoi
        const sendMessage = () => this.handleSendMessage();

        sendBtn.addEventListener('click', sendMessage);

        this.inputArea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    async checkClaudeInstallation() {
        const client = new ClaudeCLIClient(this.plugin.settings);
        const isInstalled = await client.checkInstalled();

        if (!isInstalled) {
            this.addSystemMessage('⚠️ Claude Code CLI non détecté.\n\nAssurez-vous que Claude Code est installé et accessible dans votre PATH.\n\nPour vérifier, ouvrez un terminal et tapez: claude --version');
        } else {
            this.addSystemMessage('✅ Claude Code CLI détecté\n\nBonjour ! Je peux vous aider avec votre Zettelkasten :\n\n- Analyser vos notes\n- Suggérer des connexions\n- Générer du contenu\n- Répondre à vos questions\n\nUtilisez les boutons ci-dessus ou posez-moi une question.');

            // Récupérer les stats d'usage au démarrage
            await this.fetchUsageStats();
        }
    }

    addSystemMessage(text) {
        const messageDiv = this.messagesDiv.createDiv({ cls: 'claude-message system' });
        messageDiv.createEl('div', { text: text, cls: 'message-content' });
        this.scrollToBottom();
    }

    addUserMessage(text, images = []) {
        const messageDiv = this.messagesDiv.createDiv({ cls: 'claude-message user' });
        const contentDiv = messageDiv.createEl('div', { cls: 'message-content' });
        contentDiv.createEl('strong', { text: 'Vous: ' });

        // Afficher les images si présentes
        if (images.length > 0) {
            const imagesContainer = contentDiv.createDiv({ cls: 'message-images' });
            images.forEach(imageData => {
                const imgEl = imagesContainer.createEl('img', {
                    cls: 'message-image',
                    attr: {
                        src: `data:${imageData.type};base64,${imageData.base64}`,
                        alt: imageData.name,
                        title: imageData.name
                    }
                });
            });
        }

        contentDiv.createEl('span', { text: text });
        this.scrollToBottom();
    }

    parseActions(text) {
        const actions = [];
        let processedText = text;
        let hasActions = false;

        // Pattern pour détecter les blocs de code avec actions
        // Format: ```bash:execute ou ```command:
        const actionPattern = /```(bash|command):([^\n]*)\n([\s\S]*?)```/g;

        let match;
        while ((match = actionPattern.exec(text)) !== null) {
            hasActions = true;
            const [fullMatch, actionType, actionTarget, actionContent] = match;

            const actionId = `action_${Date.now()}_${actions.length}`;

            actions.push({
                id: actionId,
                type: actionType,
                target: actionTarget.trim(),
                content: actionContent.trim(),
                fullMatch: fullMatch,
                executed: false
            });

            // Remplacer le bloc par un placeholder
            processedText = processedText.replace(fullMatch, `{{ACTION:${actionId}}}`);
        }

        return {
            hasActions,
            text: processedText,
            actions
        };
    }

    async renderMessageWithActions(container, parsedContent) {
        const { text, actions } = parsedContent;

        // Split le texte par les placeholders d'action
        const parts = text.split(/(\{\{ACTION:.*?\}\})/g);

        // Obtenir le sourcePath pour résoudre les wiki-links
        const sourcePath = this.getSourcePath();

        for (const part of parts) {
            const actionMatch = part.match(/\{\{ACTION:(.*?)\}\}/);

            if (actionMatch) {
                // C'est un placeholder d'action
                const actionId = actionMatch[1];
                const action = actions.find(a => a.id === actionId);

                if (action) {
                    await this.renderActionBlock(container, action);
                }
            } else if (part.trim()) {
                // C'est du texte normal
                const textDiv = container.createDiv({ cls: 'message-text-part' });
                await MarkdownRenderer.renderMarkdown(part, textDiv, sourcePath, this);
            }
        }
    }

    async renderActionBlock(container, action) {
        const actionDiv = container.createDiv({ cls: 'claude-action-block' });

        // En-tête de l'action
        const headerDiv = actionDiv.createDiv({ cls: 'action-header' });

        const typeIcon = action.type === 'edit' ? '📝' : '⚡';
        const typeLabel = action.type === 'edit' ? 'Édition de fichier' : 'Commande';

        headerDiv.createEl('span', {
            text: `${typeIcon} ${typeLabel}`,
            cls: 'action-type'
        });

        if (action.target) {
            headerDiv.createEl('span', {
                text: action.target,
                cls: 'action-target'
            });
        }

        // Contenu de l'action (code)
        const codeDiv = actionDiv.createDiv({ cls: 'action-content' });
        const codeBlock = codeDiv.createEl('pre');
        const codeEl = codeBlock.createEl('code');
        codeEl.textContent = action.content;

        // Boutons d'action
        const buttonsDiv = actionDiv.createDiv({ cls: 'action-buttons' });

        const confirmBtn = buttonsDiv.createEl('button', {
            text: '✓ Confirmer et exécuter',
            cls: 'action-btn confirm-btn mod-cta'
        });

        const rejectBtn = buttonsDiv.createEl('button', {
            text: '✗ Ignorer',
            cls: 'action-btn reject-btn'
        });

        const statusDiv = actionDiv.createDiv({ cls: 'action-status' });

        // Gestion des clics
        confirmBtn.addEventListener('click', async () => {
            confirmBtn.disabled = true;
            rejectBtn.disabled = true;
            statusDiv.textContent = '⏳ Exécution...';
            statusDiv.className = 'action-status executing';

            try {
                await this.executeAction(action);
                action.executed = true;
                statusDiv.textContent = '✓ Exécuté avec succès';
                statusDiv.className = 'action-status success';
                confirmBtn.remove();
                rejectBtn.remove();
            } catch (error) {
                statusDiv.textContent = `✗ Erreur: ${error.message}`;
                statusDiv.className = 'action-status error';
                confirmBtn.disabled = false;
                rejectBtn.disabled = false;
            }
        });

        rejectBtn.addEventListener('click', () => {
            actionDiv.addClass('rejected');
            statusDiv.textContent = '⊘ Ignoré';
            statusDiv.className = 'action-status rejected';
            confirmBtn.remove();
            rejectBtn.remove();
        });
    }

    async executeAction(action) {
        if (action.type === 'bash' || action.type === 'command') {
            return await this.executeCommandAction(action);
        } else {
            throw new Error(`Type d'action inconnu: ${action.type}`);
        }
    }

    async executeCommandAction(action) {
        const command = action.content;

        return new Promise((resolve, reject) => {
            const { exec } = require('child_process');

            exec(command, { cwd: this.app.vault.adapter.basePath }, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`Erreur d'exécution: ${stderr || error.message}`));
                    return;
                }

                new Notice(`✓ Commande exécutée`);

                if (stdout) {
                    console.log('Sortie de la commande:', stdout);
                }

                resolve(stdout);
            });
        });
    }

    async addAssistantMessage(text) {
        const messageDiv = this.messagesDiv.createDiv({ cls: 'claude-message assistant' });
        const contentDiv = messageDiv.createEl('div', { cls: 'message-content' });
        contentDiv.createEl('strong', { text: 'Claude: ' });

        const textDiv = contentDiv.createEl('div', { cls: 'message-text' });

        // Parser les actions avant de rendre le markdown
        const parsedContent = this.parseActions(text);

        if (parsedContent.hasActions) {
            // Afficher le texte avec les actions remplacées par des boutons
            await this.renderMessageWithActions(textDiv, parsedContent);
        } else {
            // Render markdown normalement avec un sourcePath valide pour résoudre les wiki-links
            const sourcePath = this.getSourcePath();
            await MarkdownRenderer.renderMarkdown(text, textDiv, sourcePath, this);
        }

        this.scrollToBottom();
    }

    getSourcePath() {
        // Retourner un chemin de fichier valide pour résoudre les wiki-links
        // On utilise le fichier actif si disponible, sinon un chemin dans le vault
        const activeFile = this.app.workspace.getActiveFile();
        if (activeFile) {
            return activeFile.path;
        }

        // Fallback : utiliser un fichier markdown du vault
        const markdownFiles = this.app.vault.getMarkdownFiles();
        if (markdownFiles.length > 0) {
            return markdownFiles[0].path;
        }

        // Fallback final : chemin virtuel dans 1-Permanent/
        return '1-Permanent/index.md';
    }

    addLoadingMessage() {
        const messageDiv = this.messagesDiv.createDiv({ cls: 'claude-message assistant loading' });
        messageDiv.createEl('div', { text: 'Claude réfléchit...', cls: 'message-content' });
        this.scrollToBottom();
        return messageDiv;
    }

    removeLoadingMessage(loadingDiv) {
        if (loadingDiv && loadingDiv.parentNode) {
            loadingDiv.remove();
        }
    }

    scrollToBottom() {
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
    }

    async handleSendMessage() {
        const userMessage = this.inputArea.value.trim();
        const hasImages = this.attachedImages.length > 0;

        if (!userMessage && !hasImages) return;

        // Copier les images pour ce message
        const messageCopy = userMessage || "(message avec images)";
        const imagesCopy = [...this.attachedImages];

        // Afficher le message utilisateur avec images
        this.addUserMessage(messageCopy, imagesCopy);
        this.inputArea.value = '';

        // Ajouter à l'historique
        let historyContent = userMessage;
        if (hasImages) {
            // Note : Les images ne sont pas encore supportées par Claude CLI
            // On ajoute une note dans l'historique pour informer
            const imagesList = imagesCopy.map(img => `[Image: ${img.name}]`).join(', ');
            historyContent = `${userMessage}\n\n${imagesList}\n\nNote: L'analyse d'images nécessite Claude Code CLI avec support d'images (en cours de développement).`;
        }

        this.conversationHistory.push({
            role: 'user',
            content: historyContent,
            images: imagesCopy // Stocké pour usage futur
        });

        // Vider les images attachées
        this.attachedImages = [];
        this.updateImagePreview();

        // Afficher le loading
        const loadingDiv = this.addLoadingMessage();

        try {
            const client = new ClaudeCLIClient(this.plugin.settings);

            // Construire le contexte système
            let systemContext = this.buildSystemPrompt();

            // Ajouter l'historique de conversation au prompt
            let fullPrompt = userMessage;

            if (this.conversationHistory.length > 1) {
                // Inclure les derniers messages pour le contexte
                const recentHistory = this.conversationHistory.slice(-6); // Garder les 6 derniers messages
                const historyText = recentHistory.slice(0, -1).map(msg => {
                    return `${msg.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content}`;
                }).join('\n\n');

                fullPrompt = `Historique de conversation:\n${historyText}\n\n---\n\nQuestion actuelle: ${userMessage}`;
            }

            // Si des images sont présentes, tenter de les envoyer (support futur)
            let response;
            if (imagesCopy.length > 0) {
                response = await client.sendMessageWithImages(fullPrompt, systemContext, imagesCopy);
            } else {
                response = await client.sendMessage(fullPrompt, systemContext);
            }

            // Ajouter la réponse à l'historique
            this.conversationHistory.push({
                role: 'assistant',
                content: response
            });

            this.removeLoadingMessage(loadingDiv);
            await this.addAssistantMessage(response);

            // Mettre à jour les stats d'usage
            await this.fetchUsageStats();

        } catch (error) {
            this.removeLoadingMessage(loadingDiv);
            new Notice(`Erreur: ${error.message}`);
            this.addSystemMessage(`❌ Erreur: ${error.message}`);
        }
    }

    buildSystemPrompt() {
        let prompt = `Tu es un assistant spécialisé dans la méthode Zettelkasten, intégré à Obsidian via Claude Code CLI.

# Ta mission

Aider l'utilisateur à gérer son vault de notes selon les principes Zettelkasten stricts.

# Principes Zettelkasten (FONDAMENTAUX)

- ✅ **Atomicité** : Une seule idée par note
- ✅ **Autonomie** : Note compréhensible indépendamment
- ✅ **Connexions** : Minimum 2 liens bidirectionnels vers autres notes
- ✅ **Concision** : 1-3 paragraphes maximum
- ✅ **Propres mots** : Reformuler, jamais copier-coller

# Structure du vault

- **0-Inbox/** : Notes non traitées, captures rapides, cours (temporaire)
- **1-Permanent/** : Notes permanentes atomiques (CŒUR du système)
- **2-Maps/** : Maps of Content (MOCs) - index thématiques
- **Templates/** : Modèles de notes

# Tes responsabilités

## 1. Répondre aux questions (PRIORITÉ : vault d'abord)

**TOUJOURS** chercher d'abord dans les notes permanentes :

1. **Scanner 1-Permanent/** pour trouver notes pertinentes
2. **Citer explicitement** les notes utilisées : "D'après votre note [[Note Title]], ..."
3. **Synthétiser** plusieurs notes si applicable
4. **Suggérer connexions** : "Vous pourriez aussi consulter [[Related Note]]"

**Si notes insuffisantes** :
- État ce qui existe : "Vos notes permanentes couvrent [aspect X]..."
- Compléter avec info générale (clairement identifiée)
- Suggérer : "Vous pourriez créer une note sur [sujet] pour enrichir votre base"

**Si aucune note** :
- Être transparent : "Je n'ai pas trouvé de notes permanentes sur ce sujet"
- Proposer aide générale
- Encourager capture : "Souhaitez-vous créer une note sur ce sujet ?"

## 2. Suggérer des améliorations

- Analyser qualité selon critères Zettelkasten
- Identifier notes orphelines (< 2 liens)
- Suggérer atomisation si note trop large
- Proposer connexions manquantes

## 3. Aider à créer du contenu

**RÈGLE D'OR : ENRICHIR AVANT CRÉER**

Avant de suggérer une nouvelle note :

1. **🔍 VÉRIFICATION OBLIGATOIRE** : Scanner 1-Permanent/ pour notes existantes
   - Chercher par titre, mots-clés, tags
   - Lire notes candidates

2. **Décider de l'action** :
   - ✅ **Enrichir** : Si note existante sur même concept → suggérer ajout contenu
   - ✅ **Créer** : Si concept distinct et atomique
   - ✅ **Atomiser** : Si note existante trop large

3. **Proposer contenu** avec :
   - Frontmatter correct (type, created, tags)
   - Titre descriptif
   - Contenu atomique (1-3 paragraphes)
   - Section Connexions avec liens
   - Suggestions de tags

4. **DEMANDER VALIDATION** : Ne JAMAIS créer sans confirmation

## 4. Respecter le workflow

- **Scanner** avant d'agir
- **Proposer** des solutions
- **Demander** validation
- **Citer** sources (notes existantes)
- **Suggérer** connexions

# Format des actions

## Commandes bash (avec confirmation)

Pour lister, chercher, ou diagnostiquer :

\`\`\`bash:execute
ls -la 1-Permanent/ | grep VLAN
\`\`\`

ou

\`\`\`command:
find 1-Permanent/ -name "*.md" | wc -l
\`\`\`

Ces commandes s'afficheront avec boutons "Confirmer" / "Ignorer".

## Suggestion de contenu (sans exécution automatique)

Pour proposer une note :

\`\`\`markdown
---
type: permanent
created: 2025-11-16 15:00
tags:
  - réseau
  - tcp
---

# TCP Three-Way Handshake

Le handshake TCP établit une connexion fiable en 3 étapes...

## Connexions

- [[TCP - Transmission Control Protocol]]
- [[Port réseau]]
\`\`\`

**Important** : Toujours précéder de :
- "🔍 J'ai vérifié dans 1-Permanent/ : aucune note existante sur ce concept"
- OU "🔍 Note existante trouvée : [[Note]]. Je suggère d'enrichir plutôt que créer"

# Qualité des réponses

## Critères d'excellence

1. **Transparence** : Distinguer clairement connaissance du vault vs générale
2. **Citations** : Toujours référencer notes utilisées
3. **Connexions** : Suggérer liens pertinents
4. **Respect atomicité** : Ne jamais mélanger concepts
5. **Validation** : Demander confirmation avant action

## Exemple de bonne réponse

\`\`\`
🔍 Recherche dans vos notes permanentes...

D'après votre note [[VLAN - Virtual LAN]], un VLAN permet de
segmenter logiquement un réseau physique.

Votre note [[VLAN - mode access vs trunk]] explique que les ports
trunk transportent plusieurs VLANs via le tagging 802.1Q.

En combinant ces concepts avec [[VLAN Cisco - Configuration switch]],
vous pouvez configurer...

📚 Notes connexes à consulter :
- [[802.1Q - tagging VLAN]]
- [[Types d'Encapsulation VLAN]]

💡 Suggestion : Vous pourriez créer une note sur "VLAN Inter-Switch
Link" pour compléter cette thématique.
\`\`\`

# Langue et style

- **Langue primaire** : Français
- **Termes techniques** : Anglais si standard
- **Ton** : Professionnel mais accessible
- **Citations** : Format Obsidian [[Note Title]]

# Ce que tu NE PEUX PAS faire

❌ Créer ou modifier fichiers directement
❌ Exécuter commandes sans confirmation
❌ Inventer contenu de notes
❌ Mélanger plusieurs concepts atomiques
❌ Créer notes sans vérifier l'existant

# Ce que tu DOIS faire

✅ Chercher dans 1-Permanent/ d'abord
✅ Citer notes existantes explicitement
✅ Proposer enrichissement avant création
✅ Demander validation
✅ Suggérer connexions
✅ Respecter atomicité`;

        if (this.currentVaultContext && this.plugin.settings.includeVaultContext) {
            prompt += `\n\n=== CONTEXTE DU VAULT ===\n${this.currentVaultContext}`;
        }

        return prompt;
    }

    async analyzeCurrentNote() {
        const activeFile = this.app.workspace.getActiveFile();

        if (!activeFile) {
            new Notice('Aucune note active');
            return;
        }

        const content = await this.app.vault.read(activeFile);

        const analysisPrompt = `🔍 AUDIT DE QUALITÉ ZETTELKASTEN

Analyse cette note selon les principes Zettelkasten et fournis un rapport détaillé.

**Note à auditer** : ${activeFile.basename}
**Emplacement** : ${activeFile.parent.path}

# Critères d'évaluation

## 1. Atomicité (30 points)
- La note couvre-t-elle UN seul concept ?
- Peut-on la diviser en plusieurs notes ?
- Le titre reflète-t-il exactement le contenu ?

## 2. Clarté (25 points)
- Compréhensible sans contexte externe ?
- Concept expliqué clairement ?
- Y a-t-il des exemples concrets ?

## 3. Connexions (25 points)
- Combien de liens vers d'autres notes ?
- Les liens sont-ils pertinents ?
- Liens bidirectionnels établis ?
- Appartient-elle à un MOC ?

## 4. Autonomie (10 points)
- Peut-on comprendre la note seule ?
- Contexte suffisant ?
- Termes techniques expliqués ?

## 5. Concision (10 points)
- 1-3 paragraphes, direct et dense ?
- Contenu superflu ?
- Informations importantes manquantes ?

# Instructions

1. **Évaluer** chaque critère avec score et commentaire
2. **Calculer** score global /100
3. **Lister** problèmes identifiés (🔴 Critique, 🟡 Important, 🟢 Mineur)
4. **Proposer** actions concrètes prioritaires
5. **Suggérer** connexions manquantes (vérifier dans 1-Permanent/ d'abord)
6. **Identifier** concepts à extraire en notes séparées si nécessaire

# Format attendu

- Score global : X/100
- Détail par critère avec évaluation
- Liste problèmes
- Actions recommandées (Priorité 1, 2, 3)
- Suggestions de connexions avec notes existantes

# Contenu de la note

---
${content}
---

**Important** : Avant de suggérer de nouvelles notes ou connexions, vérifie si elles existent déjà dans le contexte du vault.`;

        this.inputArea.value = analysisPrompt;
        await this.handleSendMessage();
    }

    async loadVaultContext() {
        new Notice('Chargement du contexte du vault...');

        const permanentNotes = this.app.vault.getMarkdownFiles()
            .filter(f => f.path.startsWith('1-Permanent/'));

        const mocs = this.app.vault.getMarkdownFiles()
            .filter(f => f.path.startsWith('2-Maps/'));

        const inboxNotes = this.app.vault.getMarkdownFiles()
            .filter(f => f.path.startsWith('0-Inbox/'));

        let context = `=== STRUCTURE DU VAULT ===\n\n`;

        context += `📌 NOTES PERMANENTES (${permanentNotes.length}):\n`;
        const notesToShow = permanentNotes.slice(0, this.plugin.settings.maxContextNotes);
        for (const note of notesToShow) {
            context += `- ${note.basename}\n`;
        }
        if (permanentNotes.length > this.plugin.settings.maxContextNotes) {
            context += `... et ${permanentNotes.length - this.plugin.settings.maxContextNotes} autres\n`;
        }

        context += `\n🗺️ MAPS OF CONTENT (${mocs.length}):\n`;
        for (const moc of mocs) {
            context += `- ${moc.basename}\n`;
        }

        context += `\n📥 INBOX (${inboxNotes.length} notes à traiter)\n`;

        this.currentVaultContext = context;

        new Notice(`Contexte chargé: ${permanentNotes.length} notes permanentes, ${mocs.length} MOCs`);
        this.addSystemMessage(`✅ Contexte vault chargé:\n- ${permanentNotes.length} notes permanentes\n- ${mocs.length} MOCs\n- ${inboxNotes.length} notes inbox`);
    }

    clearConversation() {
        this.conversationHistory = [];
        this.messagesDiv.empty();
        this.addSystemMessage('✨ Conversation effacée. Comment puis-je vous aider ?');
    }

    setupImageDragAndDrop(container) {
        // Prévenir le comportement par défaut seulement si des fichiers sont droppés
        ['dragenter', 'dragover'].forEach(eventName => {
            container.addEventListener(eventName, (e) => {
                // Vérifier si des fichiers sont présents
                if (e.dataTransfer && e.dataTransfer.types && e.dataTransfer.types.includes('Files')) {
                    e.preventDefault();
                    e.stopPropagation();
                    container.addClass('drag-over');
                }
            }, false);
        });

        ['dragleave'].forEach(eventName => {
            container.addEventListener(eventName, (e) => {
                // Vérifier si on quitte vraiment le container
                if (e.target === container) {
                    container.removeClass('drag-over');
                }
            }, false);
        });

        // Gérer le drop
        container.addEventListener('drop', async (e) => {
            // Vérifier si des fichiers sont présents
            if (!e.dataTransfer || !e.dataTransfer.files || e.dataTransfer.files.length === 0) {
                return; // Pas de fichiers, laisser le comportement par défaut
            }

            e.preventDefault();
            e.stopPropagation();
            container.removeClass('drag-over');

            const files = Array.from(e.dataTransfer.files);
            const imageFiles = files.filter(file => file.type.startsWith('image/'));

            if (imageFiles.length === 0) {
                new Notice('Aucune image détectée. Seules les images sont supportées.');
                return;
            }

            for (const file of imageFiles) {
                await this.addImage(file);
            }
        }, false);

        // Supporter aussi l'input file classique (optionnel)
        const fileInput = container.createEl('input', {
            type: 'file',
            cls: 'claude-file-input',
            attr: {
                accept: 'image/*',
                multiple: true,
                style: 'display: none;'
            }
        });

        fileInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            for (const file of files) {
                await this.addImage(file);
            }
            fileInput.value = ''; // Reset input
        });
    }

    async addImage(file) {
        try {
            // Lire le fichier comme base64
            const base64 = await this.fileToBase64(file);

            // Créer un objet image
            const imageData = {
                name: file.name,
                type: file.type,
                base64: base64,
                size: file.size
            };

            // Ajouter à la liste des images
            this.attachedImages.push(imageData);

            // Afficher la prévisualisation
            this.updateImagePreview();

            new Notice(`Image ajoutée: ${file.name}`);

        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'image:', error);
            new Notice(`Erreur: Impossible d'ajouter l'image ${file.name}`);
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Extraire seulement la partie base64 (sans le préfixe data:image/...)
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    updateImagePreview() {
        this.imagePreviewDiv.empty();

        if (this.attachedImages.length === 0) {
            return;
        }

        this.imagePreviewDiv.addClass('has-images');

        this.attachedImages.forEach((imageData, index) => {
            const previewItem = this.imagePreviewDiv.createDiv({ cls: 'image-preview-item' });

            // Thumbnail de l'image
            const img = previewItem.createEl('img', {
                cls: 'preview-thumbnail',
                attr: {
                    src: `data:${imageData.type};base64,${imageData.base64}`,
                    alt: imageData.name
                }
            });

            // Nom de l'image
            const nameDiv = previewItem.createDiv({ cls: 'image-name' });
            nameDiv.textContent = imageData.name;

            // Bouton pour retirer l'image
            const removeBtn = previewItem.createEl('button', {
                text: '×',
                cls: 'image-remove-btn'
            });

            removeBtn.addEventListener('click', () => {
                this.removeImage(index);
            });
        });
    }

    removeImage(index) {
        this.attachedImages.splice(index, 1);
        this.updateImagePreview();
        new Notice('Image retirée');
    }

    updateUsageBar(percentage, used, limit) {
        if (!this.usageBarEl || !this.usagePercentageEl) return;

        this.usagePercentage = percentage;

        // Mettre à jour la largeur de la barre
        this.usageBarEl.style.width = `${percentage}%`;

        // Mettre à jour la classe pour la couleur
        this.usageBarEl.removeClass('low', 'medium', 'high');
        if (percentage < 70) {
            this.usageBarEl.addClass('low');
        } else if (percentage < 85) {
            this.usageBarEl.addClass('medium');
        } else {
            this.usageBarEl.addClass('high');
        }

        // Mettre à jour le texte du pourcentage
        if (used !== undefined && limit !== undefined) {
            this.usagePercentageEl.textContent = `${percentage.toFixed(1)}%`;

            // Formater les nombres pour l'affichage
            const formatNumber = (num) => {
                if (num >= 1000) {
                    return (num / 1000).toFixed(1) + 'k';
                }
                return num.toString();
            };

            this.usageLabelEl.textContent = `${formatNumber(used)}/${formatNumber(limit)} tokens`;
        } else {
            this.usagePercentageEl.textContent = `${percentage.toFixed(1)}%`;
        }
    }

    async getClaudeUsageFromLogs() {
        try {
            const homeDir = os.homedir();
            const claudeDir = path.join(homeDir, '.claude', 'projects');

            // Trouver tous les fichiers JSONL
            if (!fs.existsSync(claudeDir)) {
                return null;
            }

            const projectDirs = fs.readdirSync(claudeDir);
            let totalTokens = 0;
            const fiveHoursAgo = Date.now() - (5 * 60 * 60 * 1000);

            for (const projectDir of projectDirs) {
                const projectPath = path.join(claudeDir, projectDir);
                if (!fs.statSync(projectPath).isDirectory()) continue;

                const files = fs.readdirSync(projectPath).filter(f => f.endsWith('.jsonl'));

                for (const file of files) {
                    const filePath = path.join(projectPath, file);
                    const content = fs.readFileSync(filePath, 'utf-8');
                    const lines = content.split('\n').filter(l => l.trim());

                    for (const line of lines) {
                        try {
                            const entry = JSON.parse(line);

                            // Vérifier si l'entrée est dans la fenêtre de 5 heures
                            if (entry.timestamp) {
                                const entryTime = new Date(entry.timestamp).getTime();
                                if (entryTime < fiveHoursAgo) continue;
                            }

                            // Extraire les tokens utilisés
                            if (entry.message && entry.message.usage) {
                                const usage = entry.message.usage;

                                // Tokens d'entrée (non cachés)
                                const inputTokens = usage.input_tokens || 0;

                                // Tokens de sortie
                                const outputTokens = usage.output_tokens || 0;

                                // Cache creation tokens (comptent comme input)
                                const cacheCreationTokens = usage.cache_creation_input_tokens || 0;

                                // Note: cache_read_input_tokens ne comptent généralement pas
                                // dans la limite car ils sont servis depuis le cache

                                totalTokens += inputTokens + outputTokens + cacheCreationTokens;
                            }
                        } catch (e) {
                            // Ignorer les lignes mal formatées
                            continue;
                        }
                    }
                }
            }

            return totalTokens;

        } catch (error) {
            console.error('Erreur lors de la lecture des logs Claude:', error);
            return null;
        }
    }

    async fetchUsageStats() {
        try {
            // Récupérer l'usage depuis les logs JSONL
            const tokensUsed = await this.getClaudeUsageFromLogs();

            if (tokensUsed === null) {
                // Impossible de lire les logs, afficher N/A
                if (this.usagePercentageEl) {
                    this.usagePercentageEl.textContent = 'N/A';
                }
                return;
            }

            // Obtenir la limite selon le plan
            const plan = this.plugin.settings.claudePlan || 'pro';
            const limit = PLAN_LIMITS[plan];

            // Calculer le pourcentage
            const percentage = Math.min((tokensUsed / limit) * 100, 100);

            // Mettre à jour la barre
            this.updateUsageBar(percentage, tokensUsed, limit);

        } catch (error) {
            console.error('Impossible de récupérer les stats d\'usage:', error);
            // Garder N/A si l'erreur se produit
            if (this.usagePercentageEl) {
                this.usagePercentageEl.textContent = 'N/A';
            }
        }
    }

    async onClose() {
        // Cleanup si nécessaire
    }
}

// ==================== SETTINGS ====================

class ClaudeSettingTab extends require('obsidian').PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Configuration Claude Client' });

        containerEl.createEl('p', {
            text: '✅ Ce plugin utilise votre abonnement Claude Code existant. Aucune clé API nécessaire !',
            cls: 'setting-item-description'
        });

        // Commande Claude
        new Setting(containerEl)
            .setName('Commande Claude CLI')
            .setDesc('Commande pour lancer Claude Code (par défaut: "claude")')
            .addText(text => text
                .setPlaceholder('claude')
                .setValue(this.plugin.settings.claudeCommand)
                .onChange(async (value) => {
                    this.plugin.settings.claudeCommand = value || 'claude';
                    await this.plugin.saveSettings();
                }));

        // Inclure le contexte du vault
        new Setting(containerEl)
            .setName('Inclure le contexte du vault')
            .setDesc('Envoyer automatiquement la liste des notes au système prompt')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.includeVaultContext)
                .onChange(async (value) => {
                    this.plugin.settings.includeVaultContext = value;
                    await this.plugin.saveSettings();
                }));

        // Nombre max de notes dans le contexte
        new Setting(containerEl)
            .setName('Notes max dans le contexte')
            .setDesc('Nombre maximum de notes permanentes à inclure dans le contexte')
            .addText(text => text
                .setPlaceholder('50')
                .setValue(String(this.plugin.settings.maxContextNotes))
                .onChange(async (value) => {
                    const numValue = parseInt(value);
                    if (!isNaN(numValue) && numValue > 0) {
                        this.plugin.settings.maxContextNotes = numValue;
                        await this.plugin.saveSettings();
                    }
                }));

        // Type de plan Claude
        new Setting(containerEl)
            .setName('Plan Claude')
            .setDesc('Votre plan d\'abonnement Claude (pour le calcul de la limite d\'usage)')
            .addDropdown(dropdown => dropdown
                .addOption('pro', 'Pro (~44k tokens/5h)')
                .addOption('max5', 'Max 5 (~88k tokens/5h)')
                .addOption('max20', 'Max 20 (~220k tokens/5h)')
                .setValue(this.plugin.settings.claudePlan || 'pro')
                .onChange(async (value) => {
                    this.plugin.settings.claudePlan = value;
                    await this.plugin.saveSettings();
                }));

        // Info
        containerEl.createEl('h3', { text: 'Installation Claude Code CLI' });

        const infoDiv = containerEl.createDiv({ cls: 'setting-item-description' });
        infoDiv.createEl('p', {
            text: 'Pour utiliser ce plugin, vous devez avoir Claude Code CLI installé et authentifié.'
        });

        infoDiv.createEl('p', {
            text: '1. Installer Claude Code depuis claude.ai/code'
        });

        infoDiv.createEl('p', {
            text: '2. Authentifier avec: claude auth login'
        });

        infoDiv.createEl('p', {
            text: '3. Vérifier l\'installation: claude --version'
        });
    }
}

// ==================== PLUGIN PRINCIPAL ====================

class ClaudeClientPlugin extends Plugin {
    async onload() {
        console.log('Chargement du plugin Claude Client (CLI)');

        await this.loadSettings();

        // Ajouter la commande pour ouvrir la vue
        this.addCommand({
            id: 'open-claude-client',
            name: 'Ouvrir Claude Client',
            callback: () => this.activateView()
        });

        // Enregistrer la vue
        this.registerView(
            VIEW_TYPE_CLAUDE,
            (leaf) => new ClaudeView(leaf, this)
        );

        // Ajouter un ribbon icon
        this.addRibbonIcon('message-circle', 'Ouvrir Claude Client', () => {
            this.activateView();
        });

        // Ajouter le tab de settings
        this.addSettingTab(new ClaudeSettingTab(this.app, this));
    }

    async activateView() {
        const { workspace } = this.app;

        let leaf = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_CLAUDE);

        if (leaves.length > 0) {
            // Vue déjà ouverte, la révéler
            leaf = leaves[0];
        } else {
            // Créer une nouvelle vue à droite
            leaf = workspace.getRightLeaf(false);
            await leaf.setViewState({
                type: VIEW_TYPE_CLAUDE,
                active: true
            });
        }

        workspace.revealLeaf(leaf);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    onunload() {
        console.log('Déchargement du plugin Claude Client (CLI)');
    }
}

module.exports = ClaudeClientPlugin;
