---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - configuration
  - éditeur
---

# GIT - configuration éditeur

La configuration de l'éditeur par défaut (`core.editor`) détermine quel éditeur Git ouvrira pour saisir les messages de commit, résoudre les conflits, ou éditer les rebases interactifs. Par défaut, Git utilise l'éditeur système (souvent Vi/Vim), mais on peut le changer pour Emacs, Nano, VS Code, ou tout autre éditeur.

Sur Windows, le chemin complet vers l'exécutable est nécessaire, avec échappement des espaces et options de lancement. La configuration se fait généralement au niveau global pour s'appliquer à tous les projets.

## Exemples

**Configurer Emacs** :
```bash
git config --global core.editor emacs
```

**Configurer Nano** :
```bash
git config --global core.editor nano
```

**Configurer VS Code** :
```bash
git config --global core.editor "code --wait"
```

**Configurer Notepad++ (Windows)** :
```bash
git config --global core.editor "'C:/Program Files/Notepad++/notepad++.exe' -multiInst -notabbar -nosession -noPlugin"
```

## Liens connexes

- [[GIT : [git config] - configuration globale]] - Commande de base
- [[GIT : [git commit] - valider changements]] - Utilise l'éditeur configuré
- [[MOC - Git & Versionning]] - Map of Content
