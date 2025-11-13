---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - diagnostic
---

# GIT : [git status] - vérifier état fichiers

La commande `git status` affiche l'état courant du repository : branche active, fichiers modifiés, fichiers stagés, fichiers untracked, et synchronisation avec le remote. C'est la commande de diagnostic la plus utilisée pour comprendre où on en est dans le [[GIT - cycle de vie fichiers|cycle de vie]].

Les fichiers sont organisés en trois sections : "Changes to be committed" (staged), "Changes not staged for commit" (modified), et "Untracked files" (nouveaux fichiers). La commande suggère aussi les actions possibles (git add, git restore, etc.).

## Exemples

**Status standard** :
```bash
git status
```

Sortie typique :
```
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   README.md

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes)
        modified:   src/main.c

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        newfile.txt
```

**Status court** (format condensé) :
```bash
git status -s
# M README.md       (modifié et stagé)
# M src/main.c      (modifié, pas stagé)
# ?? newfile.txt    (untracked)
```

## Liens connexes

- [[GIT - cycle de vie fichiers]] - Comprendre les états
- [[GIT : [git add] - ajouter fichiers staging]] - Stager fichiers
- [[GIT : [git diff] - voir différences]] - Détails des modifications
- [[MOC - Git & Versionning]] - Map of Content
