---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - diagnostic
---

# GIT : [git diff] - voir différences

La commande `git diff` affiche les différences ligne par ligne entre versions de fichiers. Par défaut, elle montre les changements non stagés (modified mais pas staged). Avec `--staged` ou `--cached`, elle montre les changements stagés prêts à être commités.

Le format de sortie utilise le format unifié diff : lignes précédées de `-` (supprimées) et `+` (ajoutées). On peut aussi comparer deux commits, branches, ou tags spécifiques en fournissant leurs références.

## Exemples

**Différences non stagées** (modified) :
```bash
git diff
```

**Différences stagées** (prêtes à commit) :
```bash
git diff --staged
# Ou
git diff --cached
```

**Différences d'un fichier spécifique** :
```bash
git diff src/main.c
```

**Comparer deux branches** :
```bash
git diff main feature-branch
```

**Comparer deux commits** :
```bash
git diff abc123 def456
```

**Statistiques uniquement** (sans détails) :
```bash
git diff --stat
# src/main.c  | 15 +++++++++------
# README.md   |  3 +--
# 2 files changed, 10 insertions(+), 8 deletions(-)
```

## Liens connexes

- [[GIT : [git status] - vérifier état fichiers]] - Vue d'ensemble état
- [[GIT : [git add] - ajouter fichiers staging]] - Stager modifications
- [[GIT - cycle de vie fichiers]] - États modified vs staged
- [[MOC - Git & Versionning]] - Map of Content
