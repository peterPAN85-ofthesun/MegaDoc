---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - annulation
---

# GIT : [git restore] - restaurer fichiers

La commande `git restore` (Git ≥ 2.23) restaure des fichiers à leur état dans un commit spécifique, annulant des modifications ou unstaging des fichiers. C'est une alternative moderne et plus claire à certains usages de `git checkout` et [[GIT : [git reset] - réinitialiser état|git reset]].

Sans options, restore annule les modifications d'un fichier (retour à l'état du dernier commit). L'option `--staged` unstage un fichier sans modifier le working directory. `--source` spécifie le commit source de restauration.

## Exemples

**Restaurer fichier modifié** (annuler modifications) :
```bash
git restore fichier.txt
# Retour à l'état du dernier commit (HEAD)
# ATTENTION : Modifications perdues !
```

**Unstage un fichier** :
```bash
git restore --staged fichier.txt
# Enlève du staging, garde modifications dans working directory
```

**Restaurer tous les fichiers modifiés** :
```bash
git restore .
# Annule toutes les modifications non commitées
```

**Unstage tous les fichiers** :
```bash
git restore --staged .
# Équivalent à : git reset
```

**Restaurer depuis commit spécifique** :
```bash
git restore --source=abc123 fichier.txt
# Restaure fichier depuis commit abc123
```

**Restaurer ET unstage** :
```bash
git restore --staged --worktree fichier.txt
# Unstage + annule modifications
```

## Liens connexes

- [[GIT : [git reset] - réinitialiser état]] - Alternative pour unstage
- [[GIT : [git checkout] - changer branche]] - Ancienne méthode de restauration
- [[GIT : [git add] - ajouter fichiers staging]] - Opération inverse
- [[MOC - Git & Versionning]] - Map of Content
