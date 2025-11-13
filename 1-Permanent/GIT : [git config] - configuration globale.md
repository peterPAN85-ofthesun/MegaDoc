---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - configuration
  - commande
---

# GIT : [git config] - configuration globale

La commande `git config` permet de configurer Git au niveau global (utilisateur), local (repository), ou système. L'option `--global` enregistre la configuration dans `~/.gitconfig` pour tous les projets de l'utilisateur, tandis que `--local` (défaut) configure uniquement le repository courant.

Pour consulter toute la configuration active, utiliser `git config --list`. Pour vérifier une clé spécifique, utiliser `git config <clé>` (ex: `git config user.name`). Les configurations locales écrasent les globales, qui elles-mêmes écrasent les configurations système.

## Exemples

**Lister toute la configuration** :
```bash
git config --list
```

**Vérifier une valeur spécifique** :
```bash
git config user.name
# Sortie : John Doe
```

**Niveaux de configuration** :
- `--system` : Tous les utilisateurs du système
- `--global` : Tous les repositories de l'utilisateur
- `--local` : Repository courant uniquement (défaut)

## Liens connexes

- [[GIT - configuration utilisateur]] - Configurer nom et email
- [[GIT - configuration éditeur]] - Définir éditeur par défaut
- [[GIT - configuration branche défaut]] - Nom branche principale
- [[MOC - Git & Versionning]] - Map of Content
