---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - concepts
  - workflow
---

# GIT - cycle de vie fichiers

Le cycle de vie des fichiers Git décrit quatre états possibles : **untracked** (nouveau fichier non suivi), **unmodified** (suivi mais non modifié), **modified** (modifié mais pas stagé), et **staged** (préparé pour commit). Les fichiers "tracked" regroupent les états unmodified, modified et staged.

Un fichier passe de untracked à staged via [[GIT : [git add] - ajouter fichiers staging|git add]], puis à unmodified après [[GIT : [git commit] - valider changements|commit]]. Toute modification d'un fichier unmodified le fait passer à modified. Le staging avec git add le ramène à staged. Ce cycle permet un contrôle granulaire des versions.

## Exemples

**États des fichiers** :
```
Untracked → [git add] → Staged → [git commit] → Unmodified
                ↑                                      ↓
                |                                 [modify]
                |                                      ↓
                +────────── [git add] ←──── Modified
```

**Vérifier l'état** :
```bash
git status
# Changes to be committed:     (staged)
# Changes not staged:           (modified)
# Untracked files:              (untracked)
```

**Cycle complet** :
```bash
# Nouveau fichier (untracked)
touch newfile.txt

# Staging (staged)
git add newfile.txt

# Commit (unmodified)
git commit -m "Add newfile"

# Modification (modified)
echo "content" >> newfile.txt

# Re-staging (staged)
git add newfile.txt

# Commit (unmodified)
git commit -m "Update newfile"
```

## Liens connexes

- [[GIT : [git status] - vérifier état fichiers]] - Voir état de chaque fichier
- [[GIT : [git add] - ajouter fichiers staging]] - untracked/modified → staged
- [[GIT : [git commit] - valider changements]] - staged → unmodified
- [[MOC - Git & Versionning]] - Map of Content
