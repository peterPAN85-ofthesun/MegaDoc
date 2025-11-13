---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - remote
  - synchronisation
---

# GIT : [git push] - pousser vers remote

La commande `git push` envoie les commits locaux vers un repository distant ([[GIT : [git remote] - gérer dépôts distants|remote]]), synchronisant la branche locale avec sa contrepartie distante. L'option `-u` (ou `--set-upstream`) configure le tracking entre branche locale et distante pour les futurs push/pull.

Le push échoue si la branche distante a des commits que la locale n'a pas (nécessite [[GIT : [git pull] - récupérer et fusionner|pull]] d'abord). L'option `--force` ou `-f` force le push en écrasant l'historique distant (DANGEREUX, éviter sur branches partagées).

## Exemples

**Push vers origin/main** :
```bash
git push
# Ou explicite :
git push origin main
```

**Premier push avec tracking** :
```bash
git push -u origin feature-login
# Configure origin/feature-login comme upstream
# Les prochains push : juste "git push"
```

**Créer branche distante** :
```bash
git checkout -b new-feature
git commit -m "Initial work"
git push -u origin new-feature
# Crée new-feature sur le remote
```

**Supprimer branche distante** :
```bash
git push -d origin old-feature
# Ou
git push origin --delete old-feature
```

**Force push** (ATTENTION ⚠️) :
```bash
git push --force
# Écrase l'historique distant !
# Ne JAMAIS faire sur main/master partagé
```

## Liens connexes

- [[GIT : [git pull] - récupérer et fusionner]] - Opération inverse
- [[GIT : [git remote] - gérer dépôts distants]] - Configuration remotes
- [[GIT - stockage credentials]] - Authentification pour push
- [[GIT : [git commit] - valider changements]] - Créer commits avant push
- [[MOC - Git & Versionning]] - Map of Content
