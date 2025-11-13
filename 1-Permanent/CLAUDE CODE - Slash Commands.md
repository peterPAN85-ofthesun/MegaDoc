---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - automation
  - slash-commands
  - workflow
---

# CLAUDE CODE - Slash Commands

Les Slash Commands de [[CLAUDE CODE - interface CLI|Claude Code]] sont des commandes personnalisées définies par l'utilisateur pour automatiser des workflows récurrents. Chaque commande est définie dans un fichier `.claude/commands/nom.md` contenant le prompt à exécuter. Invoquée via `/nom` ou l'outil SlashCommand, la commande expanse son prompt qui est ensuite exécuté par Claude.

Les Slash Commands ne doivent PAS être utilisés pour des commandes CLI built-in (`/help`, `/clear`). Elles sont idéales pour créer des workflows métier spécifiques : traitement de notes Zettelkasten, revue de code, génération de documentation, ou toute tâche répétitive avec variations de contexte.

## Exemples

**Commandes disponibles dans ce vault** :
- `/audit` : Auditer qualité note Zettelkasten
- `/atomize` : Extraire concepts atomiques d'une source
- `/process-current-note` : Traiter note courante complète
- `/update-moc` : Mettre à jour Map of Content
- `/find-links` : Trouver connexions entre notes
- `/process-inbox` : Traiter contenu 0-Inbox/
- `/create-note` : Créer note permanente atomique

**Invocation** :
```python
SlashCommand(command="/process-inbox")
SlashCommand(command="/update-moc Réseau")  # Avec argument
```

**Création** : Fichier `.claude/commands/ma-commande.md` avec prompt à exécuter

## Liens connexes

- [[CLAUDE CODE - Hooks personnalisés]] - Scripts événementiels
- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
