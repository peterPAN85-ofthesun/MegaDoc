---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - clone
  - collaboration
---

# GIT : [git clone] - cloner repository

La commande `git clone` crée une copie locale complète d'un repository distant (GitHub, GitLab, serveur Git), incluant tout l'historique, toutes les branches, et tous les commits. Elle crée automatiquement un [[GIT : [git remote] - gérer dépôts distants|remote]] nommé "origin" pointant vers la source.

Contrairement à [[GIT : [git init] - initialiser repository|git init]] qui crée un repository vide, clone récupère un projet existant avec son contenu. Le clone peut être renommé en fournissant un second argument.

## Exemples

**Cloner un repository** :
```bash
git clone https://github.com/libgit2/libgit2
# Crée le dossier "libgit2/" avec le contenu
```

**Cloner avec nom personnalisé** :
```bash
git clone https://github.com/libgit2/libgit2 mylibgit
# Crée le dossier "mylibgit/" au lieu de "libgit2/"
```

**Cloner via SSH** :
```bash
git clone git@github.com:user/MonProjet.git
```

**Vérifier le remote créé** :
```bash
cd libgit2
git remote -v
# origin  https://github.com/libgit2/libgit2 (fetch)
# origin  https://github.com/libgit2/libgit2 (push)
```

## Liens connexes

- [[GIT : [git init] - initialiser repository]] - Alternative pour nouveau projet
- [[GIT : [git remote] - gérer dépôts distants]] - Remote "origin" créé automatiquement
- [[GIT : [git pull] - récupérer et fusionner]] - Mettre à jour après clone
- [[MOC - Git & Versionning]] - Map of Content
