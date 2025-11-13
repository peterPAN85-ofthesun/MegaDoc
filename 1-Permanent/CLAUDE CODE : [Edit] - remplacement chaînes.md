---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - outil
  - fichiers
---

# CLAUDE CODE : [Edit] - remplacement chaînes

L'outil Edit de [[CLAUDE CODE - interface CLI|Claude Code]] effectue des remplacements de chaînes exactes dans des fichiers existants (`old_string` → `new_string`). Il requiert une lecture préalable du fichier via [[CLAUDE CODE : [Read] - lecture fichiers multimédia|Read]] et échoue si `old_string` n'est pas unique dans le fichier, sauf utilisation du mode `replace_all`.

L'indentation exacte doit être préservée : Edit travaille sur le contenu réel du fichier, sans les préfixes de numérotation de lignes ajoutés par Read. Le mode `replace_all: true` permet de remplacer toutes les occurrences d'une chaîne, utile pour renommer des variables ou fonctions globalement dans un fichier.

## Exemples

**Remplacement simple** :
```python
Edit(
    file_path="/path/to/file.py",
    old_string="def old_function():",
    new_string="def new_function():"
)
```

**Renommage global** (toutes occurrences) :
```python
Edit(
    file_path="/path/to/file.py",
    old_string="oldVariable",
    new_string="newVariable",
    replace_all=true
)
```

**Attention** : Préserver l'indentation exacte (espaces/tabs) du fichier original.

## Liens connexes

- [[CLAUDE CODE : [Read] - lecture fichiers multimédia]] - Lecture préalable requise
- [[CLAUDE CODE : [Write] - écriture fichiers]] - Créer nouveaux fichiers
- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
