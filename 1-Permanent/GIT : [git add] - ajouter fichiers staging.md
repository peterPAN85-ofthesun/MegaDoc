---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - staging
---

# GIT : [git add] - ajouter fichiers staging

La commande `git add` ajoute des fichiers à la zone de staging (index), les marquant pour inclusion dans le prochain [[GIT : [git commit] - valider changements|commit]]. Elle fonctionne aussi bien pour les nouveaux fichiers (untracked) que pour les fichiers modifiés (modified).

Le staging permet de préparer sélectivement quels changements seront inclus dans le commit suivant, offrant un contrôle granulaire. Les fichiers stagés passent à l'état "staged" dans le [[GIT - cycle de vie fichiers|cycle de vie Git]].

## Exemples

**Ajouter un fichier spécifique** :
```bash
git add README.md
```

**Ajouter plusieurs fichiers par pattern** :
```bash
git add *.c
git add *.h
```

**Ajouter tous les fichiers modifiés et nouveaux** :
```bash
git add .
# Ou
git add --all
```

**Ajouter interactivement** (sélection manuelle) :
```bash
git add -p
# Propose chaque modification une par une
```

## Liens connexes

- [[GIT : [git status] - vérifier état fichiers]] - Voir fichiers stagés
- [[GIT : [git commit] - valider changements]] - Valider fichiers stagés
- [[GIT : [git restore] - restaurer fichiers]] - Annuler staging
- [[GIT - cycle de vie fichiers]] - Comprendre états des fichiers
- [[MOC - Git & Versionning]] - Map of Content
