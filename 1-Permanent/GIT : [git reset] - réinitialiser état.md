---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - avancé
  - annulation
---

# GIT : [git reset] - réinitialiser état

La commande `git reset` déplace le pointeur HEAD (et optionnellement l'index et le répertoire de travail) vers un commit spécifique, annulant effectivement des commits ou unstaging des fichiers. Trois modes existent : `--soft` (déplace HEAD uniquement), `--mixed` (HEAD + index, défaut), `--hard` (HEAD + index + working directory).

**ATTENTION** : `--hard` est destructif et efface les modifications non commitées. Utiliser avec précaution. Reset est idéal pour annuler des commits locaux non poussés, mais éviter sur commits déjà partagés (utiliser [[GIT : [git rebase] - réappliquer commits|revert]] à la place).

## Exemples

**Reset --soft** (garde index et fichiers) :
```bash
git reset --soft HEAD~1
# Annule le dernier commit mais garde fichiers stagés
# Utile pour refaire un commit avec message différent
```

**Reset --mixed** (garde fichiers, désindexe) :
```bash
git reset HEAD~1
# Ou explicite :
git reset --mixed HEAD~1
# Annule commit + unstage, mais fichiers modifiés gardés
```

**Reset --hard** (⚠️ destructif) :
```bash
git reset --hard HEAD~1
# Annule commit + unstage + supprime modifications
# ATTENTION : Perte définitive des changements !
```

**Unstage un fichier** :
```bash
git reset fichier.txt
# Équivalent à :
git restore --staged fichier.txt
```

**Reset vers commit spécifique** :
```bash
git reset --hard abc123
# Retour à l'état du commit abc123
```

## Liens connexes

- [[GIT : [git restore] - restaurer fichiers]] - Alternative moderne pour unstage
- [[GIT : [git rebase] - réappliquer commits]] - Pour réorganiser historique
- [[GIT : [git commit] - valider changements]] - Créer commits avant reset
- [[MOC - Git & Versionning]] - Map of Content
