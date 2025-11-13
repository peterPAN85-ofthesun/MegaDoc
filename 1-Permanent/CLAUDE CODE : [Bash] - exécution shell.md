---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - outil
  - shell
  - bash
---

# CLAUDE CODE : [Bash] - exécution shell

L'outil Bash de [[CLAUDE CODE - interface CLI|Claude Code]] exécute des commandes shell dans une session persistante. Il supporte un timeout configurable (max 10 min, défaut 2 min), l'exécution en arrière-plan (`run_in_background: true`), et le chaînage de commandes (`&&`, `||`, `;`).

Bash ne doit PAS être utilisé pour `find`, `grep`, `cat`, `head`, `tail`, `sed`, `awk` : des outils spécialisés ([[CLAUDE CODE : [Grep] - recherche ripgrep|Grep]], [[CLAUDE CODE : [Glob] - recherche fichiers pattern|Glob]], [[CLAUDE CODE : [Read] - lecture fichiers multimédia|Read]]) existent pour ces tâches. Les chemins avec espaces nécessitent des guillemets doubles. Privilégier chemins absolus au lieu de `cd`.

## Exemples

**Commande simple** :
```bash
Bash(command="git status", description="Show git status")
```

**Commandes chaînées** (séquentielles dépendantes) :
```bash
Bash(command="git add . && git commit -m 'message' && git push")
```

**Exécution en arrière-plan** :
```bash
Bash(command="npm run dev", run_in_background=true)
```

**Git workflow** : Commits avec HEREDOC, signature `🤖 Generated with Claude Code`

## Liens connexes

- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
- Documentation Git : workflows commits et PR
