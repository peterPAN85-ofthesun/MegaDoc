---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - outil
  - fichiers
---

# CLAUDE CODE : [Read] - lecture fichiers multimédia

L'outil Read de [[CLAUDE CODE - interface CLI|Claude Code]] permet de lire des fichiers avec support étendu pour différents formats : texte, images (PNG, JPG), PDF, et notebooks Jupyter (.ipynb). Les fichiers texte sont retournés avec numérotation de lignes (format `cat -n`), facilitant les références précises lors de modifications.

Pour les fichiers volumineux, Read supporte la lecture partielle via les paramètres `offset` et `limit`, permettant de lire uniquement une plage de lignes spécifique. Les lignes dépassant 2000 caractères sont automatiquement tronquées. La lecture d'images et PDF déclenche une analyse visuelle multimodale, extrayant à la fois le texte et le contenu visuel.

## Exemples

**Lecture complète** :
```python
Read(file_path="/path/to/file.py")
```

**Lecture partielle** (lignes 100 à 200) :
```python
Read(file_path="/large_file.py", offset=100, limit=100)
```

**Formats supportés** : `.txt`, `.md`, `.py`, `.js`, `.c`, `.png`, `.jpg`, `.pdf`, `.ipynb`

## Liens connexes

- [[CLAUDE CODE : [Write] - écriture fichiers]] - Créer/écraser fichiers
- [[CLAUDE CODE : [Edit] - remplacement chaînes]] - Modifier fichiers existants
- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
