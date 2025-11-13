---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - branches
---

# GIT : [git branch] - gestion branches

La commande `git branch` gère les branches Git : création, listage, renommage, et suppression. Une branche est un pointeur mobile vers un commit, permettant de développer des fonctionnalités isolément sans affecter la branche principale. Sans arguments, `git branch` liste toutes les branches locales.

Créer une branche ne switch pas automatiquement dessus : utiliser [[GIT : [git checkout] - changer branche|git checkout]] ou `git switch` pour changer de branche active. L'option `-d` supprime une branche locale, `-D` force la suppression même si non mergée.

## Exemples

**Lister les branches** :
```bash
git branch
# * main
#   feature-login
#   bugfix-auth
```

**Créer une nouvelle branche** :
```bash
git branch feature-payment
# Crée la branche mais reste sur branche actuelle
```

**Créer et switcher** (en une commande) :
```bash
git checkout -b feature-payment
# Ou avec Git récent
git switch -c feature-payment
```

**Supprimer une branche** (mergée) :
```bash
git branch -d feature-login
```

**Forcer suppression** (non mergée) :
```bash
git branch -D experimental-feature
```

**Supprimer branche distante** :
```bash
git push -d origin feature-old
# Ou
git push origin --delete feature-old
```

## Liens connexes

- [[GIT : [git checkout] - changer branche]] - Switcher de branche
- [[GIT : [git merge] - fusionner branches]] - Fusionner branches
- [[GIT - configuration branche défaut]] - Nom branche principale
- [[MOC - Git & Versionning]] - Map of Content
