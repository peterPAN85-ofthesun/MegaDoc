---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - initialisation
---

# GIT : [git init] - initialiser repository

La commande `git init` initialise un nouveau repository Git dans le répertoire courant en créant le dossier caché `.git/` qui contient toute la structure de données Git (objets, références, configuration locale). Cette commande transforme un dossier ordinaire en projet versionné.

Après initialisation, le repository est vide (aucun commit) et sur la branche par défaut (définie par [[GIT - configuration branche défaut|init.defaultBranch]]). Les fichiers existants restent "untracked" jusqu'à utilisation de [[GIT : [git add] - ajouter fichiers staging|git add]].

## Exemples

**Initialiser dans le répertoire courant** :
```bash
cd /home/user/my_project
git init
# Sortie : Initialized empty Git repository in /home/user/my_project/.git/
```

**Vérifier l'initialisation** :
```bash
ls -la
# On voit le dossier .git/
```

**État après init** :
```bash
git status
# On branch main (ou master)
# No commits yet
# Untracked files: ...
```

## Liens connexes

- [[GIT : [git add] - ajouter fichiers staging]] - Étape suivante
- [[GIT : [git commit] - valider changements]] - Créer premier commit
- [[GIT : [git clone] - cloner repository]] - Alternative pour projets existants
- [[GIT - configuration branche défaut]] - Nom branche créée
- [[MOC - Git & Versionning]] - Map of Content
