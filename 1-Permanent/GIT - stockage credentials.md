---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - configuration
  - authentification
  - sécurité
---

# GIT - stockage credentials

Le stockage des credentials Git (`credential.helper`) permet de mémoriser les identifiants (nom d'utilisateur et mot de passe/token) pour éviter de les ressaisir à chaque opération avec un dépôt distant. L'option `store` enregistre les credentials en texte clair dans `~/.git-credentials`, tandis que d'autres helpers plus sécurisés existent (cache, manager système).

Après activation, la première opération nécessitant authentification (push, pull, clone privé) demandera les credentials une fois, puis les mémorisera. Sur GitHub/GitLab, utiliser un Personal Access Token plutôt qu'un mot de passe pour plus de sécurité.

## Exemples

**Activer le stockage** :
```bash
git config --global credential.helper store
```

**Première utilisation** (demande credentials) :
```bash
git pull
# Username: johndoe
# Password: ghp_xxxxxxxxxxxx (token GitHub)
```

**Utilisations suivantes** : Automatique, pas de saisie

**Alternatives plus sécurisées** :
```bash
# Cache temporaire (15 min par défaut)
git config --global credential.helper cache

# Manager système (Linux)
git config --global credential.helper libsecret

# Manager système (macOS)
git config --global credential.helper osxkeychain

# Manager système (Windows)
git config --global credential.helper wincred
```

## Liens connexes

- [[GIT : [git config] - configuration globale]] - Commande de base
- [[GIT : [git push] - pousser vers remote]] - Nécessite authentification
- [[GIT : [git pull] - récupérer et fusionner]] - Nécessite authentification
- [[MOC - Git & Versionning]] - Map of Content
