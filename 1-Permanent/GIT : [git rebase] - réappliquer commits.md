---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - rebase
  - historique
---

# GIT : [git rebase] - réappliquer commits

La commande `git rebase` réapplique les commits de la branche courante au-dessus d'une autre branche, réécrivant l'historique pour créer une séquence linéaire. Contrairement à [[GIT : [git merge] - fusionner branches|merge]] qui crée un commit de fusion, rebase déplace les commits comme s'ils avaient été créés après ceux de la branche cible.

**ATTENTION** : Ne JAMAIS rebaser une branche déjà partagée/poussée vers un remote, car cela réécrit l'historique et crée des conflits pour les collaborateurs. Rebaser uniquement les branches locales non poussées.

## Exemples

**Rebase standard** :
```bash
git checkout feature
git rebase main
# Réapplique les commits de feature au-dessus de main
```

Avant rebase :
```
A---B---C       (main)
     \
      D---E     (feature)
```

Après rebase :
```
A---B---C---D'---E'  (feature)
```
(D' et E' sont de nouveaux commits avec même contenu mais hash différent)

**Rebase vs Merge** :

Merge (préserve historique) :
```
A---B---C-------M    (main)
         \     /
          D---E      (feature)
```

Rebase (historique linéaire) :
```
A---B---C---D'---E'  (feature rébasée sur main)
```

**Rebase interactif** (réorganiser/fusionner commits) :
```bash
git rebase -i HEAD~3
# Ouvre éditeur pour modifier les 3 derniers commits
```

## Liens connexes

- [[GIT : [git merge] - fusionner branches]] - Alternative préservant historique
- [[GIT : [git pull] - récupérer et fusionner]] - Peut utiliser rebase
- [[GIT : [git push] - pousser vers remote]] - ATTENTION après rebase
- [[MOC - Git & Versionning]] - Map of Content
