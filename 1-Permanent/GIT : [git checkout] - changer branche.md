---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - branches
---

# GIT : [git checkout] - changer branche

La commande `git checkout` change la branche active (HEAD), mettant à jour le répertoire de travail pour refléter l'état de la branche cible. Elle peut aussi créer une nouvelle branche avec `-b` et switcher dessus immédiatement. Git récent offre `git switch` comme alternative plus claire pour le changement de branche.

Le checkout échoue si des modifications non commitées seraient écrasées. Sauvegarder (commit ou stash) avant de changer de branche. Checkout peut aussi restaurer des fichiers d'un commit spécifique.

## Exemples

**Changer de branche** :
```bash
git checkout feature-login
# Switched to branch 'feature-login'
```

**Créer et changer** (en une commande) :
```bash
git checkout -b new-feature
# Équivalent à :
# git branch new-feature
# git checkout new-feature
```

**Alternative moderne** (Git ≥ 2.23) :
```bash
git switch feature-login
git switch -c new-feature  # Créer et switcher
```

**Retourner à la branche précédente** :
```bash
git checkout -
# Comme "cd -" en bash
```

**Restaurer un fichier d'un autre commit** :
```bash
git checkout abc123 -- src/main.c
# Restaure main.c depuis le commit abc123
```

## Liens connexes

- [[GIT : [git branch] - gestion branches]] - Créer/lister branches
- [[GIT : [git merge] - fusionner branches]] - Fusionner après développement
- [[GIT : [git restore] - restaurer fichiers]] - Alternative pour restaurer fichiers
- [[MOC - Git & Versionning]] - Map of Content
