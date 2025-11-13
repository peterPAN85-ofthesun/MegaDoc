---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - configuration
  - identité
---

# GIT - configuration utilisateur

La configuration utilisateur Git définit l'identité qui apparaîtra dans les commits via `user.name` (nom) et `user.email` (email). Ces informations sont essentielles car elles identifient l'auteur de chaque commit et sont utilisées par les plateformes comme GitHub, GitLab pour associer les contributions.

La configuration se fait généralement au niveau global (`--global`) pour s'appliquer à tous les projets. Sans cette configuration, Git refusera de créer des commits. Les valeurs peuvent être différentes par projet en utilisant la configuration locale.

## Exemples

**Configuration globale** :
```bash
git config --global user.name "John Doe"
git config --global user.email "johndoe@example.com"
```

**Vérification** :
```bash
git config user.name
git config user.email
```

**Configuration locale** (pour un projet spécifique) :
```bash
git config user.email "john.pro@company.com"
```

## Liens connexes

- [[GIT : [git config] - configuration globale]] - Commande de base
- [[GIT : [git commit] - valider changements]] - Utilise ces informations
- [[MOC - Git & Versionning]] - Map of Content
