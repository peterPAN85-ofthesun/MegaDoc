---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - nettoyage
---

# GIT : [git clean] - nettoyer fichiers non-trackés

La commande `git clean` supprime les fichiers untracked (non suivis par Git) du répertoire de travail. C'est utile pour nettoyer les fichiers de build, temporaires, ou générés qu'on ne veut pas commiter. Par défaut, clean ne fait rien sans options `-f` (force), `-d` (dossiers), ou `-n` (dry-run).

**ATTENTION** : Commande destructive ! Les fichiers supprimés ne peuvent pas être récupérés. Toujours utiliser `-n` d'abord pour simuler et vérifier ce qui sera supprimé.

## Exemples

**Simulation** (dry-run, recommandé) :
```bash
git clean -n
# Would remove build/
# Would remove temp.txt
# Would remove *.o
```

**Supprimer fichiers untracked** :
```bash
git clean -f
# Supprime fichiers untracked (pas dossiers)
```

**Supprimer fichiers ET dossiers** :
```bash
git clean -fd
# -f = force
# -d = dossiers inclus
```

**Supprimer fichiers ignorés aussi** (gitignore) :
```bash
git clean -fdx
# -x = inclut fichiers gitignorés
```

**Interactive** (sélection manuelle) :
```bash
git clean -i
# Demande confirmation pour chaque fichier
```

**Exemple workflow** :
```bash
# 1. Voir ce qui serait supprimé
git clean -n

# 2. Si OK, nettoyer
git clean -fd
```

## Liens connexes

- [[GIT : [git status] - vérifier état fichiers]] - Voir fichiers untracked
- [[GIT : [git rm] - supprimer fichiers]] - Supprimer fichiers trackés
- [[GIT - cycle de vie fichiers]] - État untracked
- [[MOC - Git & Versionning]] - Map of Content
