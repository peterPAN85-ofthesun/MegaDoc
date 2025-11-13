---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - merge
  - fusion
---

# GIT : [git merge] - fusionner branches

La commande `git merge` fusionne une branche dans la branche courante en créant un commit de merge (si nécessaire) qui combine les historiques. Par défaut, Git utilise fast-forward si possible (déplacement simple du pointeur), sinon crée un vrai merge commit avec deux parents.

L'option `--ff-only` force le fast-forward et échoue si impossible. `--no-ff` force toujours un merge commit même si fast-forward possible, utile pour préserver l'historique de la branche. En cas de conflits, Git marque les fichiers et laisse l'utilisateur résoudre manuellement.

## Exemples

**Merge standard** :
```bash
git checkout main
git merge feature-login
# Fusionne feature-login dans main
```

Graphe résultant (avec merge commit) :
```
A---B---C-------M   (main)
         \     /
          D---E     (feature-login)
```

**Fast-forward** (si possible) :
```bash
git merge --ff feature-simple
# A---B---C---D---E  (main déplacé vers E)
```

**Forcer merge commit** (pas de fast-forward) :
```bash
git merge --no-ff feature-login
# Crée toujours un commit M même si fast-forward possible
```

**Résoudre conflits** :
```bash
git merge feature-conflict
# CONFLICT (content): Merge conflict in file.txt
# Automatic merge failed; fix conflicts and then commit.

# 1. Éditer fichiers en conflit
# 2. Marquer comme résolu
git add file.txt
# 3. Finaliser merge
git commit
```

## Liens connexes

- [[GIT : [git rebase] - réappliquer commits]] - Alternative au merge
- [[GIT : [git branch] - gestion branches]] - Créer branches à merger
- [[GIT : [git checkout] - changer branche]] - Changer de branche avant merge
- [[MOC - Git & Versionning]] - Map of Content
