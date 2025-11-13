---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - remote
  - synchronisation
---

# GIT : [git pull] - récupérer et fusionner

La commande `git pull` récupère les changements depuis un [[GIT : [git remote] - gérer dépôts distants|remote]] et les fusionne automatiquement dans la branche courante. Elle combine en réalité deux opérations : `git fetch` (téléchargement) suivi de `git merge` (fusion).

Par défaut, pull crée un merge commit si nécessaire. L'option `--rebase` utilise [[GIT : [git rebase] - réappliquer commits|rebase]] au lieu de merge, créant un historique linéaire. C'est équivalent à `git fetch` puis `git rebase origin/main`.

## Exemples

**Pull standard** (fetch + merge) :
```bash
git pull
# Équivalent à :
# git fetch origin
# git merge origin/main
```

Graphe résultant (avec merge commit M) :
```
A---B---C-------M    (local main)
         \     /
          D---E      (origin/main récupéré)
```

**Pull avec rebase** (historique linéaire) :
```bash
git pull --rebase
# Équivalent à :
# git fetch origin
# git rebase origin/main
```

Graphe résultant :
```
A---B---C---D'---E'  (local main réappliqué)
```

**Pull depuis remote/branche spécifique** :
```bash
git pull origin feature-branch
```

**Configurer rebase par défaut** :
```bash
git config pull.rebase true
# Tous les pulls utiliseront rebase
```

## Liens connexes

- [[GIT : [git push] - pousser vers remote]] - Opération inverse
- [[GIT : [git merge] - fusionner branches]] - Utilisé par pull standard
- [[GIT : [git rebase] - réappliquer commits]] - Utilisé par pull --rebase
- [[GIT : [git remote] - gérer dépôts distants]] - Configuration remotes
- [[MOC - Git & Versionning]] - Map of Content
