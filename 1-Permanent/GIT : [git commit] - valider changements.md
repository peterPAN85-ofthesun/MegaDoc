---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - commit
---

# GIT : [git commit] - valider changements

La commande `git commit` crée un nouveau commit (snapshot) contenant tous les fichiers actuellement en staging. Chaque commit enregistre l'état du projet à un instant T avec un message descriptif, un auteur (issu de [[GIT - configuration utilisateur|user.name/email]]), un timestamp, et un hash SHA-1 unique.

Le flag `-m` permet de fournir le message en ligne de commande. Sans `-m`, Git ouvre l'[[GIT - configuration éditeur|éditeur configuré]] pour saisir un message multi-lignes. Un bon message de commit explique le "pourquoi" du changement, pas seulement le "quoi".

## Exemples

**Commit avec message** :
```bash
git commit -m "Add user authentication feature"
```

**Commit avec message multi-lignes** :
```bash
git commit -m "Fix login bug

The authentication token was expiring too quickly.
Increased timeout from 1h to 24h."
```

**Commit de tous les fichiers modifiés** (skip staging) :
```bash
git commit -am "Quick fix typo"
# -a = add automatique des fichiers trackés modifiés
```

**Ouvrir éditeur pour message long** :
```bash
git commit
# Ouvre l'éditeur configuré
```

## Liens connexes

- [[GIT : [git add] - ajouter fichiers staging]] - Préparer fichiers avant commit
- [[GIT : [git status] - vérifier état fichiers]] - Vérifier ce qui sera commité
- [[GIT : [git push] - pousser vers remote]] - Envoyer commits vers serveur
- [[GIT - configuration utilisateur]] - Identité dans commits
- [[MOC - Git & Versionning]] - Map of Content
