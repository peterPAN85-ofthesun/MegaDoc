---
type: inbox
created: 2025-11-13 00:00
tags:
  - ia
  - claude
  - outils
---

# Claude - Présentation des Fonctionnalités

## Vue d'ensemble

Claude est un assistant IA développé par Anthropic, conçu pour être utile, inoffensif et honnête. Il excelle dans les tâches de raisonnement, d'analyse et de création de contenu.

## Capacités principales

### 1. Compréhension et analyse
- **Analyse de texte**: Comprend et analyse des documents longs (jusqu'à des centaines de pages)
- **Raisonnement complexe**: Capable de décomposer des problèmes complexes en étapes logiques
- **Contexte étendu**: Fenêtre de contexte de 200K tokens (environ 150 000 mots)
- **Multilingue**: Maîtrise de nombreuses langues dont le français et l'anglais

### 2. Programmation et développement
- **Multiples langages**: Python, JavaScript, C, C++, Rust, Go, Java, etc.
- **Debugging**: Identification et correction d'erreurs dans le code
- **Refactoring**: Amélioration de la structure et de la qualité du code
- **Documentation**: Génération de commentaires et documentation technique
- **CLI (Claude Code)**: Version en ligne de commande pour l'automatisation

### 3. Rédaction et création
- **Rédaction technique**: Documentation, guides, tutoriels
- **Contenu créatif**: Articles, synthèses, résumés
- **Reformulation**: Adaptation du ton et du style selon le contexte
- **Traduction**: Traduction entre langues avec contexte préservé

### 4. Recherche et apprentissage
- **Explication de concepts**: Vulgarisation de sujets complexes
- **Synthèse d'information**: Résumés de documents longs
- **Recherche web**: Accès à des informations à jour (via WebSearch)
- **Analyse comparative**: Comparaison de concepts, technologies, approches

## Claude Code (CLI)

### Fonctionnalités spécifiques
- **Édition de fichiers**: Lecture, écriture, modification directe de fichiers
- **Exécution de commandes**: Intégration avec bash, git, npm, etc.
- **Gestion de projets**: Navigation dans les codebases, recherche de patterns
- **Agents spécialisés**: Tâches complexes déléguées à des sous-agents
- **Hooks personnalisés**: Automatisation via scripts shell

### Outils de manipulation de fichiers

#### Read
Lecture de fichiers avec support multimédia étendu.

**Capacités**:
- Lecture de fichiers texte avec numérotation de lignes
- Support des images (PNG, JPG) - analyse visuelle
- Support des PDF - extraction de texte et contenu visuel
- Support des notebooks Jupyter (.ipynb)
- Lecture partielle: offset et limit pour grands fichiers
- Troncature automatique des lignes longues (>2000 chars)

**Usage**:
```python
# Lire un fichier complet
Read(file_path="/path/to/file.py")

# Lire partiellement (lignes 100-200)
Read(file_path="/path/to/large_file.py", offset=100, limit=100)
```

#### Write
Écriture ou écrasement complet de fichiers.

**Caractéristiques**:
- Crée ou écrase le fichier existant
- Requiert lecture préalable si le fichier existe
- Préférer Edit pour modifier un fichier existant
- Chemins absolus uniquement

**Règles**:
- TOUJOURS préférer éditer plutôt que créer
- Ne JAMAIS créer de documentation non demandée
- Pas d'emojis sauf demande explicite

#### Edit
Remplacement de chaînes exactes dans des fichiers.

**Fonctionnement**:
- Remplacement de chaîne exact (`old_string` → `new_string`)
- Doit lire le fichier avant d'éditer (obligation)
- Échec si `old_string` n'est pas unique
- Option `replace_all` pour remplacements multiples

**Usage**:
```python
# Remplacement simple
Edit(
    file_path="/path/to/file.py",
    old_string="def old_function():",
    new_string="def new_function():"
)

# Renommage global d'une variable
Edit(
    file_path="/path/to/file.py",
    old_string="oldVar",
    new_string="newVar",
    replace_all=true
)
```

**Attention**: Préserver l'indentation exacte du fichier original.

#### NotebookEdit
Édition de cellules Jupyter notebooks.

**Modes**:
- `replace`: Remplacer le contenu d'une cellule
- `insert`: Insérer une nouvelle cellule
- `delete`: Supprimer une cellule

**Paramètres**:
- `cell_id`: ID de la cellule à modifier
- `cell_type`: `code` ou `markdown`
- `new_source`: Nouveau contenu

### Outils de recherche

#### Grep
Recherche puissante basée sur ripgrep.

**Capacités**:
- Recherche par regex complète
- Filtrage par type de fichier (`type: "py"`, `"js"`, `"rust"`)
- Filtrage par glob (`glob: "*.tsx"`, `"**/*.md"`)
- Recherche insensible à la casse (`-i: true`)
- Support multiline (`multiline: true`)
- Contexte avant/après (`-A`, `-B`, `-C`)

**Modes de sortie**:
- `files_with_matches`: Seulement les chemins de fichiers (défaut)
- `content`: Lignes correspondantes avec numéros
- `count`: Nombre de correspondances par fichier

**Usage**:
```python
# Trouver tous les fichiers Python contenant "async"
Grep(pattern="async", type="py")

# Recherche avec contexte (3 lignes avant/après)
Grep(
    pattern="TODO",
    output_mode="content",
    -C=3
)

# Recherche multiline (patterns sur plusieurs lignes)
Grep(
    pattern="struct \\{[\\s\\S]*?field",
    multiline=true
)
```

**Note**: Utilise la syntaxe ripgrep, pas grep standard.

#### Glob
Recherche de fichiers par patterns.

**Caractéristiques**:
- Patterns glob standards (`**/*.js`, `src/**/*.tsx`)
- Résultats triés par date de modification
- Rapide sur tous types de codebases
- Recherches parallèles recommandées

**Usage**:
```python
# Trouver tous les fichiers TypeScript
Glob(pattern="**/*.ts")

# Fichiers dans un dossier spécifique
Glob(pattern="src/components/*.tsx", path="/project/root")
```

### Outils système et exécution

#### Bash
Exécution de commandes shell dans une session persistante.

**Capacités**:
- Session shell persistante
- Timeout configurable (max 10 minutes, défaut 2 minutes)
- Exécution en arrière-plan (`run_in_background: true`)
- Support des commandes chaînées (`&&`, `||`, `;`)

**Règles importantes**:
- NE PAS utiliser pour `find`, `grep`, `cat`, `head`, `tail`, `sed`, `awk`
- Toujours utiliser les outils spécialisés à la place
- Guillemets obligatoires pour chemins avec espaces
- Préférer chemins absolus au lieu de `cd`

**Usage**:
```bash
# Commande simple
Bash(command="git status", description="Show git status")

# Commandes chaînées (dépendantes)
Bash(command="git add . && git commit -m 'message' && git push")

# Exécution en arrière-plan
Bash(
    command="npm run dev",
    run_in_background=true,
    description="Start dev server"
)

# Chemins avec espaces (IMPORTANT)
Bash(command='cd "/path/with spaces/folder"')
```

**Git workflow**:
- Commits: Toujours avec HEREDOC pour formatage
- Ne JAMAIS modifier git config
- Ne JAMAIS force push sur main/master
- Vérifier authorship avant amend
- Ajouter signature: `🤖 Generated with Claude Code`

**Pull Requests**:
- Utiliser `gh pr create` via Bash
- Analyser TOUS les commits (pas seulement le dernier)
- Créer résumé et test plan
- Format avec HEREDOC

#### BashOutput
Récupération de sortie d'un shell en arrière-plan.

**Usage**:
```python
# Lire la sortie d'un shell
BashOutput(bash_id="shell_123")

# Filtrer avec regex
BashOutput(bash_id="shell_123", filter="ERROR|WARNING")
```

#### KillShell
Terminer un shell en arrière-plan.

```python
KillShell(shell_id="shell_123")
```

### Outils web

#### WebFetch
Récupération et analyse de contenu web.

**Fonctionnement**:
- Fetch URL + conversion HTML → Markdown
- Analyse par IA avec prompt fourni
- Cache automatique de 15 minutes
- Upgrade HTTP → HTTPS automatique

**Usage**:
```python
WebFetch(
    url="https://docs.example.com/api",
    prompt="Extraire la liste des endpoints API disponibles"
)
```

**Note**: Préférer les outils MCP (`mcp__*`) s'ils sont disponibles.

#### WebSearch
Recherche web en temps réel.

**Caractéristiques**:
- Recherche avec résultats formatés
- Filtrage par domaines (allowed/blocked)
- Informations à jour (post-cutoff)
- Disponible uniquement aux USA

**Usage**:
```python
# Recherche simple
WebSearch(query="Claude Code latest features 2025")

# Filtrage de domaines
WebSearch(
    query="Python async best practices",
    allowed_domains=["docs.python.org", "realpython.com"]
)
```

### Agents spécialisés (Task Tool)

Les agents sont des sous-processus autonomes qui gèrent des tâches complexes multi-étapes.

#### Types d'agents disponibles

##### 1. general-purpose
Agent polyvalent pour tâches complexes.
- Recherche de questions complexes
- Recherche de code
- Tâches multi-étapes
- Accès à tous les outils

##### 2. Explore
**Spécialiste**: Exploration rapide de codebases.

**Quand l'utiliser**:
- Trouver fichiers par patterns
- Rechercher mots-clés dans le code
- Comprendre l'architecture d'un projet
- Questions sur "comment fonctionne X?"

**Niveaux de profondeur**:
- `quick`: Recherche basique
- `medium`: Exploration modérée
- `very thorough`: Analyse exhaustive

**Exemples**:
```python
# Explorer l'architecture
Task(
    subagent_type="Explore",
    description="Explore codebase structure",
    prompt="How is authentication implemented? Search thoroughly.",
    model="haiku"  # Rapide et économique
)
```

##### 3. Plan
Agent de planification rapide (similaire à Explore).

##### 4. zettelkasten-archiver
**Spécialiste**: Archivage de notes Zettelkasten.

**Quand l'utiliser**:
- Après avoir traité des notes de l'inbox
- Notes transformées en notes permanentes
- Besoin d'archiver les sources originales

**Contexte**: Automatique après workflow Zettelkasten.

##### 5. obsidian-link-repairer
**Spécialiste**: Réparation de liens Obsidian.

**Déclenchement automatique**:
- Après renommage de fichier
- Après déplacement de fichier
- Après réorganisation du vault
- Détection de liens cassés

**Exemple de workflow**:
```
1. Utilisateur: "Rename file X to Y"
2. Claude: Renomme le fichier
3. Claude: Lance automatiquement obsidian-link-repairer
4. Agent: Répare tous les liens cassés dans le vault
```

##### 6. zettelkasten-note-normalizer
**Spécialiste**: Normalisation des noms de notes.

**Quand l'utiliser**:
- Après création de note permanente
- Migration de notes anciennes
- Standardisation de la nomenclature
- Vérification de conventions

**Exemples**:
```
- "vlan setup" → "VLAN - Virtual LAN Setup"
- "cd command" → "cd - Change Directory Command"
```

#### Utilisation des agents

**Règles**:
- Lancer plusieurs agents en parallèle si possible
- Prompt détaillé (agent autonome, une seule réponse)
- Spécifier quel modèle utiliser (haiku pour rapidité)
- Indiquer clairement: recherche OU écriture de code

**Exemple d'usage**:
```python
# Agent unique
Task(
    subagent_type="Explore",
    description="Find API endpoints",
    prompt="""
    Search the codebase to find all API endpoints.
    List them with their HTTP methods and purposes.
    Focus on REST endpoints in the /api routes.
    Return a structured list.
    """,
    model="haiku"
)

# Agents parallèles (un seul message)
[
    Task(subagent_type="Explore", ...),
    Task(subagent_type="general-purpose", ...),
]
```

### Gestion de tâches (TodoWrite)

Outil de liste de tâches pour organisation et suivi.

**Quand l'utiliser**:
- Tâches complexes (3+ étapes)
- Tâches non-triviales
- Demande explicite de l'utilisateur
- Liste de tâches multiples

**États des tâches**:
- `pending`: Pas encore commencé
- `in_progress`: En cours (UNE SEULE à la fois)
- `completed`: Terminé avec succès

**Format des tâches**:
```python
{
    "content": "Run tests",  # Forme impérative
    "activeForm": "Running tests",  # Forme continue
    "status": "pending"
}
```

**Règles strictes**:
- UNE SEULE tâche `in_progress` à la fois
- Marquer `completed` IMMÉDIATEMENT après achèvement
- NE PAS marquer completed si:
  - Tests en échec
  - Implémentation partielle
  - Erreurs non résolues
  - Blocages rencontrés

**Usage**:
```python
TodoWrite(todos=[
    {
        "content": "Search for authentication code",
        "activeForm": "Searching for authentication code",
        "status": "in_progress"
    },
    {
        "content": "Implement OAuth login",
        "activeForm": "Implementing OAuth login",
        "status": "pending"
    },
    {
        "content": "Write tests for auth flow",
        "activeForm": "Writing tests for auth flow",
        "status": "pending"
    }
])
```

### Questions utilisateur (AskUserQuestion)

Poser des questions pendant l'exécution.

**Quand l'utiliser**:
- Clarifier des instructions ambiguës
- Obtenir préférences utilisateur
- Choix d'implémentation
- Décisions sur la direction à prendre

**Caractéristiques**:
- 1 à 4 questions par appel
- 2 à 4 options par question
- Option "Autre" ajoutée automatiquement
- Support multi-sélection

**Usage**:
```python
AskUserQuestion(questions=[
    {
        "question": "Which authentication method should we use?",
        "header": "Auth method",
        "multiSelect": false,
        "options": [
            {
                "label": "OAuth 2.0",
                "description": "Industry standard, requires external provider"
            },
            {
                "label": "JWT tokens",
                "description": "Self-contained, stateless authentication"
            },
            {
                "label": "Session-based",
                "description": "Traditional, requires server-side storage"
            }
        ]
    }
])
```

### Slash Commands personnalisés

Commandes définies par l'utilisateur pour automatisation.

**Comment ça fonctionne**:
1. Définir commande dans `.claude/commands/nom.md`
2. Invoquer avec `/nom` ou via SlashCommand tool
3. Le prompt dans le fichier est expansé
4. Claude exécute le prompt

**Commandes disponibles dans ce projet**:
- `/audit`: Auditer qualité d'une note Zettelkasten
- `/atomize`: Extraire concepts atomiques d'une source
- `/process-current-note`: Traiter note courante complète
- `/update-moc`: Mettre à jour Map of Content
- `/find-links`: Trouver connexions entre notes
- `/process-inbox`: Traiter contenu 0-Inbox/
- `/create-note`: Créer note permanente atomique

**Usage**:
```python
# Invoquer une commande
SlashCommand(command="/process-inbox")

# Avec arguments
SlashCommand(command="/update-moc Réseau")
```

**Note**: Ne PAS utiliser pour commandes CLI built-in (`/help`, `/clear`).

### Hooks personnalisés

Scripts shell exécutés en réponse à des événements.

**Types de hooks**:
- `user-prompt-submit-hook`: Avant traitement de message utilisateur
- `tool-call-hook`: Avant/après appel d'outil
- Autres événements configurables

**Configuration**: Dans settings de Claude Code.

**Feedback**: Traiter feedback des hooks comme venant de l'utilisateur.

### Skills

Capacités spécialisées avec connaissances de domaine.

**Usage**:
```python
# Invoquer un skill
Skill(skill="pdf")  # Traitement PDF
Skill(skill="xlsx")  # Traitement Excel
```

**Note**: Pas de skills disponibles dans le projet actuel.

### MCP Servers (Model Context Protocol)

Serveurs externes fournissant outils additionnels.

**Caractéristiques**:
- Préfixe `mcp__*` pour tous les outils MCP
- Accès à services externes
- Extensions personnalisées possibles

**Exemple**: `mcp__web_fetch` (préféré à WebFetch standard)

## Forces distinctives

### 1. Précision et fiabilité
- Vérifie ses sources et reconnaît ses limites
- Évite la sur-confiance et les hallucinations
- Corrige ses erreurs quand elles sont identifiées

### 2. Raisonnement approfondi
- Décompose les problèmes complexes
- Analyse multi-étapes
- Considère plusieurs perspectives

### 3. Sécurité et éthique
- Refuse les tâches dangereuses ou nuisibles
- Protège la vie privée et les données sensibles
- Transparence sur ses capacités et limitations

## Limitations

### Ce que Claude ne peut PAS faire
- Accéder à Internet en temps réel (sauf via WebSearch/WebFetch)
- Se souvenir des conversations précédentes (sans contexte fourni)
- Exécuter du code directement (mais peut le générer)
- Accéder à des systèmes externes sans outils appropriés
- Apprendre de manière continue (modèle fixe)

### Connaissances
- **Date de coupure**: Janvier 2025
- Les événements après cette date ne sont pas connus (sauf via recherche web)

## Cas d'usage typiques

### Développement logiciel
- Génération de code
- Revue de code et debugging
- Écriture de tests
- Migration de code
- Documentation technique

### Gestion de connaissances
- Organisation de notes (Zettelkasten, Obsidian)
- Création de documentation
- Synthèse de recherches
- Structuration d'informations

### Apprentissage
- Explication de concepts techniques
- Création de guides d'apprentissage
- Réponses à des questions complexes
- Exercices et exemples pratiques

## Versions de Claude

### Claude Sonnet 4.5 (actuel)
- **Modèle ID**: `claude-sonnet-4-5-20250929`
- Équilibre entre performance et rapidité
- Idéal pour la plupart des tâches

### Autres versions
- **Opus**: Plus puissant, plus lent, plus coûteux
- **Haiku**: Plus rapide, moins coûteux, tâches simples

## Intégration avec Obsidian

Claude peut aider avec:
- Création de notes structurées
- Atomisation de contenu
- Génération de liens entre notes
- Création de Maps of Content (MOCs)
- Migration de vaults
- Automatisation via slash commands

## Ressources

- **Documentation officielle**: https://docs.anthropic.com
- **Claude Code docs**: https://docs.claude.com/en/docs/claude-code/
- **API**: https://www.anthropic.com/api
- **Console**: https://console.anthropic.com

## Notes personnelles

- Version utilisée: Claude Sonnet 4.5
- Contexte: Gestion de vault Zettelkasten
- Date de création: 2025-11-13

---

## Liens connexes
- [[INDEX]] - Point d'entrée du vault
- Voir aussi: Documentation en ligne de Claude
