---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - remote
  - collaboration
---

# GIT : [git remote] - gérer dépôts distants

La commande `git remote` gère les références vers les repositories distants (GitHub, GitLab, serveur Git). Un remote est un alias (comme "origin") pointant vers une URL de repository, permettant de [[GIT : [git push] - pousser vers remote|pousser]] et [[GIT : [git pull] - récupérer et fusionner|récupérer]] des changements.

Le remote le plus courant est "origin", créé automatiquement lors d'un [[GIT : [git clone] - cloner repository|clone]]. On peut avoir plusieurs remotes pour collaborer avec différents serveurs ou forks.

## Exemples

**Ajouter un remote** :
```bash
git remote add origin https://github.com/user/MonProjet.git
```

**Lister les remotes** :
```bash
git remote -v
# origin  https://github.com/user/MonProjet.git (fetch)
# origin  https://github.com/user/MonProjet.git (push)
```

**Ajouter un second remote** (fork) :
```bash
git remote add upstream https://github.com/original/MonProjet.git
```

**Supprimer un remote** :
```bash
git remote remove origin
```

**Renommer un remote** :
```bash
git remote rename origin github
```

## Liens connexes

- [[GIT : [git clone] - cloner repository]] - Crée automatiquement "origin"
- [[GIT : [git push] - pousser vers remote]] - Utilise les remotes
- [[GIT : [git pull] - récupérer et fusionner]] - Récupère depuis remote
- [[GIT - stockage credentials]] - Authentification vers remotes
- [[MOC - Git & Versionning]] - Map of Content
