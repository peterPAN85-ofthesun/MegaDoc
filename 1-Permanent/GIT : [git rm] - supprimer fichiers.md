---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - gestion-fichiers
---

# GIT : [git rm] - supprimer fichiers

La commande `git rm` supprime un fichier du repository Git ET du système de fichiers, préparant cette suppression pour le prochain [[GIT : [git commit] - valider changements|commit]]. Elle est équivalente à supprimer le fichier manuellement puis faire [[GIT : [git add] - ajouter fichiers staging|git add]] sur la suppression.

L'option `--cached` supprime uniquement du tracking Git sans supprimer le fichier physique, utile pour désindexer des fichiers qu'on veut garder localement (ex: secrets accidentellement ajoutés).

## Exemples

**Supprimer un fichier** :
```bash
git rm PROJECTS.md
# Supprime le fichier ET le stage pour commit
```

**Supprimer du tracking sans supprimer le fichier** :
```bash
git rm --cached secrets.txt
# Le fichier reste sur disque mais ne sera plus tracké
```

**Supprimer un dossier récursivement** :
```bash
git rm -r old_folder/
```

**Forcer la suppression** (fichier modifié non commité) :
```bash
git rm -f modified_file.txt
```

**Workflow typique** :
```bash
git rm unused.txt
git commit -m "Remove unused file"
```

## Liens connexes

- [[GIT : [git add] - ajouter fichiers staging]] - Inverse de rm
- [[GIT : [git mv] - renommer fichiers]] - Renommer au lieu de supprimer
- [[GIT : [git commit] - valider changements]] - Valider suppression
- [[MOC - Git & Versionning]] - Map of Content
