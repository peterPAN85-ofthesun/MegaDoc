---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - configuration
  - branches
---

# GIT - configuration branche défaut

La configuration `init.defaultBranch` définit le nom de la branche principale créée automatiquement lors d'un [[GIT : [git init] - initialiser repository|git init]]. Historiquement nommée `master`, la convention moderne privilégie `main` pour des raisons d'inclusivité et d'alignement avec les standards GitHub/GitLab.

Cette configuration affecte uniquement les nouveaux repositories initialisés après le changement. Les repositories existants conservent leur branche principale actuelle, qu'il faut renommer manuellement si désiré.

## Exemples

**Configurer "main" comme branche par défaut** :
```bash
git config --global init.defaultBranch main
```

**Vérification** :
```bash
git config init.defaultBranch
# Sortie : main
```

**Renommer branche existante** (master → main) :
```bash
git branch -m master main
git push -u origin main
```

## Liens connexes

- [[GIT : [git config] - configuration globale]] - Commande de base
- [[GIT : [git init] - initialiser repository]] - Crée la branche par défaut
- [[GIT : [git branch] - gestion branches]] - Gestion des branches
- [[MOC - Git & Versionning]] - Map of Content
