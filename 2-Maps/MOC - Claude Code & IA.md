---
type: moc
created: 2025-11-13 03:30
tags:
  - moc
  - index
  - claude
  - ia
  - claude-code
---

# MOC - Claude Code & IA

Map of Content pour l'écosystème Claude : assistant IA conversationnel et son interface CLI Claude Code avec tous ses outils, agents, et systèmes d'automatisation.

---

## 🤖 Vue d'ensemble

### Fondamentaux
- [[CLAUDE - assistant IA Anthropic]] - Assistant IA conversationnel (Sonnet 4.5)
- [[CLAUDE CODE - interface CLI]] - Interface en ligne de commande officielle

---

## 🛠️ Outils Claude Code

### Manipulation de fichiers

| Commande | Description |
|----------|-------------|
| [[CLAUDE CODE : [Read] - lecture fichiers multimédia]] | Lecture texte, images, PDF, Jupyter |
| [[CLAUDE CODE : [Write] - écriture fichiers]] | Création/écrasement fichiers |
| [[CLAUDE CODE : [Edit] - remplacement chaînes]] | Modification par remplacement exact |

### Recherche et navigation

| Commande | Description |
|----------|-------------|
| [[CLAUDE CODE : [Grep] - recherche ripgrep]] | Recherche contenu (regex, filtres) |
| [[CLAUDE CODE : [Glob] - recherche fichiers pattern]] | Recherche par nom/pattern |

### Système et exécution

| Commande | Description |
|----------|-------------|
| [[CLAUDE CODE : [Bash] - exécution shell]] | Commandes shell, Git, workflows |

### Web et informations

| Commande | Description |
|----------|-------------|
| [[CLAUDE CODE : [WebFetch] - récupération web]] | Récupération et analyse contenu web |
| [[CLAUDE CODE : [WebSearch] - recherche temps réel]] | Recherche web post-cutoff |

### Organisation et interaction

| Commande | Description |
|----------|-------------|
| [[CLAUDE CODE : [TodoWrite] - gestion tâches]] | Suivi progression tâches complexes |
| [[CLAUDE CODE : [AskUserQuestion] - questions interactives]] | Questions multi-options |

---

## 🤝 Système d'agents

### Architecture
- [[CLAUDE CODE - système agents Task]] - Architecture générale agents autonomes

### Agents spécialisés
- [[CLAUDE CODE - Agent general-purpose]] - Agent polyvalent tâches complexes
- [[CLAUDE CODE - Agent Explore]] - Exploration rapide codebases (quick/medium/thorough)
- [[CLAUDE CODE - Agents Zettelkasten]] - Archivage, normalisation, réparation liens

---

## ⚙️ Automatisation

### Workflows personnalisés
- [[CLAUDE CODE - Slash Commands]] - Commandes personnalisées (`.claude/commands/`)
- [[CLAUDE CODE - Hooks personnalisés]] - Scripts événementiels automatiques

### Extensions
- [[CLAUDE CODE - MCP Servers]] - Model Context Protocol (outils `mcp__*`)

---

## 📋 Slash Commands disponibles

Commandes définies dans ce vault :
- `/audit` - Auditer qualité note Zettelkasten
- `/atomize` - Extraire concepts atomiques
- `/process-current-note` - Traiter note courante
- `/update-moc` - Mettre à jour Map of Content
- `/find-links` - Trouver connexions entre notes
- `/process-inbox` - Traiter contenu 0-Inbox/
- `/create-note` - Créer note permanente atomique

---

## 🔗 Ressources externes

- **Documentation Claude** : https://docs.anthropic.com
- **Claude Code docs** : https://docs.claude.com/en/docs/claude-code/
- **API Anthropic** : https://www.anthropic.com/api
- **Console** : https://console.anthropic.com

---

## 🎯 Philosophie d'utilisation

### Principes
1. **Outils spécialisés > Bash** : Toujours préférer Read/Write/Edit/Grep/Glob à leurs équivalents bash
2. **Agents pour exploration** : Utiliser agents Explore pour questions ouvertes multi-rounds
3. **Atomicité** : Une tâche = un outil, workflows complexes = agents
4. **Automatisation** : Slash Commands pour workflows récurrents

### Workflow type
1. **Lecture** : Read pour analyser existant
2. **Recherche** : Grep/Glob pour localiser code
3. **Modification** : Edit pour changements précis, Write pour nouveaux fichiers
4. **Organisation** : TodoWrite pour suivi, AskUserQuestion pour clarifications
5. **Automatisation** : Slash Commands + Hooks pour workflows répétitifs

---

## 📊 Statistiques du vault

**Notes permanentes** : 19 notes sur Claude Code/IA
**Dernière mise à jour** : 2025-11-13
**Couverture** : Outils complets, agents, automatisation

---

## Voir aussi

- [[MOC - Linux Administration]] - Commandes système
- [[MOC - Programmation C]] - Développement logiciel
- [[INDEX]] - Point d'entrée du vault
