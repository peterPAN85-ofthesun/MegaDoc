---
type: moc
created: 2025-11-13 04:00
tags:
  - moc
  - index
  - git
  - versionning
  - vcs
---

# MOC - Git & Versionning

Map of Content pour Git : système de contrôle de version distribué pour gérer le code source, l'historique des modifications, et la collaboration sur des projets logiciels.

---

## 🔧 Configuration initiale

### Configuration globale

| Commande | Description |
|----------|-------------|
| [[GIT : [git config] - configuration globale]] | Commande de configuration |
| [[GIT - configuration utilisateur]] | Nom et email (user.name, user.email) |
| [[GIT - configuration éditeur]] | Éditeur par défaut (core.editor) |
| [[GIT - configuration branche défaut]] | Nom branche principale (init.defaultBranch) |
| [[GIT - stockage credentials]] | Mémoriser identifiants (credential.helper) |

---

## 🚀 Initialisation et clonage

### Démarrer un projet

| Commande | Description |
|----------|-------------|
| [[GIT : [git init] - initialiser repository]] | Créer nouveau repository local |
| [[GIT : [git clone] - cloner repository]] | Copier repository existant |
| [[GIT : [git remote] - gérer dépôts distants]] | Configuration remotes (origin) |

---

## 📝 Workflow de base

### Cycle de vie des fichiers
- [[GIT - cycle de vie fichiers]] - États : untracked, modified, staged, unmodified

### Commandes essentielles

| Commande | Description |
|----------|-------------|
| [[GIT : [git status] - vérifier état fichiers]] | Voir état du repository |
| [[GIT : [git add] - ajouter fichiers staging]] | Préparer fichiers pour commit |
| [[GIT : [git commit] - valider changements]] | Créer snapshot/commit |
| [[GIT : [git diff] - voir différences]] | Comparer modifications |

### Gestion des fichiers

| Commande | Description |
|----------|-------------|
| [[GIT : [git rm] - supprimer fichiers]] | Supprimer fichiers du repository |
| [[GIT : [git mv] - renommer fichiers]] | Renommer ou déplacer fichiers |

---

## 🌿 Branches et fusion

### Gestion des branches

| Commande | Description |
|----------|-------------|
| [[GIT : [git branch] - gestion branches]] | Créer, lister, supprimer branches |
| [[GIT : [git checkout] - changer branche]] | Changer de branche active |

### Intégration de changements

| Commande | Description |
|----------|-------------|
| [[GIT : [git merge] - fusionner branches]] | Fusionner branches (merge commit) |
| [[GIT : [git rebase] - réappliquer commits]] | Réappliquer commits (historique linéaire) |

**Merge vs Rebase** :
- **Merge** : Préserve l'historique complet, crée merge commit
- **Rebase** : Historique linéaire, mais réécrit commits (ne pas faire sur branches partagées)

---

## 🌐 Synchronisation avec remotes

### Push et Pull

| Commande | Description |
|----------|-------------|
| [[GIT : [git push] - pousser vers remote]] | Envoyer commits vers serveur |
| [[GIT : [git pull] - récupérer et fusionner]] | Récupérer et fusionner changements |

**Stratégies de pull** :
- `git pull` : fetch + merge (crée merge commit)
- `git pull --rebase` : fetch + rebase (historique linéaire)

---

## 🔄 Annulation et correction

### Annuler des changements

| Commande | Description |
|----------|-------------|
| [[GIT : [git restore] - restaurer fichiers]] | Restaurer fichiers, unstage (Git ≥ 2.23) |
| [[GIT : [git reset] - réinitialiser état]] | Réinitialiser HEAD/index/working dir |
| [[GIT : [git clean] - nettoyer fichiers non-trackés]] | Supprimer fichiers untracked |

**Reset modes** :
- `--soft` : Déplace HEAD uniquement (garde staging et fichiers)
- `--mixed` : Déplace HEAD + unstage (garde fichiers) - défaut
- `--hard` : Déplace HEAD + unstage + supprime fichiers (⚠️ destructif)

---

## 📚 Ressources et liens

### Liens externes
- **Documentation officielle** : https://git-scm.com/doc
- **Pro Git Book** : https://git-scm.com/book/en/v2
- **Git Cheat Sheet** : https://education.github.com/git-cheat-sheet-education.pdf

### MOCs connexes
- [[MOC - Linux Administration]] - Commandes système, bash
- [[MOC - Claude Code & IA]] - Git workflow avec Claude Code

---

## 💡 Bonnes pratiques

### Messages de commit
- Être concis et descriptif
- Format : `<type>: <description>`
- Exemples : `feat: Add user login`, `fix: Correct validation bug`

### Workflow recommandé
1. **Pull** avant de commencer : `git pull --rebase`
2. **Créer branche** pour nouvelle feature : `git checkout -b feature-name`
3. **Commits fréquents** atomiques avec messages clairs
4. **Rebase** sur main avant merge : `git rebase main`
5. **Push** et créer Pull Request
6. **Merge** après revue de code
7. **Supprimer** branche après merge : `git branch -d feature-name`

### Sécurité
- Ne JAMAIS commiter secrets/credentials
- Utiliser `.gitignore` pour exclure fichiers sensibles
- Utiliser tokens d'accès au lieu de mots de passe (GitHub/GitLab)

---

## 🎯 Commandes par cas d'usage

### Démarrer un projet
```bash
git init
git config user.name "John Doe"
git config user.email "john@example.com"
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/user/projet.git
git push -u origin main
```

### Workflow quotidien
```bash
git pull --rebase
git checkout -b feature-xxx
# ... travail ...
git add .
git commit -m "feat: Add feature XXX"
git push -u origin feature-xxx
# Créer Pull Request
```

### Corriger erreurs
```bash
# Unstage un fichier
git restore --staged fichier.txt

# Annuler modifications
git restore fichier.txt

# Annuler dernier commit (garder fichiers)
git reset HEAD~1

# Nettoyer fichiers untracked
git clean -fd
```

---

## 📊 Statistiques du vault

**Notes permanentes** : 24 notes sur Git
**Dernière mise à jour** : 2025-11-13
**Couverture** : Configuration, workflow, branches, remote, annulation

---

## Voir aussi

- [[CLAUDE CODE : [Bash] - exécution shell]] - Exécuter commandes Git
- [[MOC - CMake]] - Build systems
- [[MOC - Programmation C]] - Projets versionnés
- [[INDEX]] - Point d'entrée du vault
