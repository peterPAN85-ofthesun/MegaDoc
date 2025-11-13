---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - outil
  - recherche
  - ripgrep
---

# CLAUDE CODE : [Grep] - recherche ripgrep

L'outil Grep de [[CLAUDE CODE - interface CLI|Claude Code]] effectue des recherches puissantes basées sur ripgrep (pas grep standard). Il supporte les regex complètes, le filtrage par type de fichier (`type: "py"`, `"js"`), par glob (`glob: "*.tsx"`), la recherche insensible à la casse (`-i: true`), et le mode multiline pour patterns sur plusieurs lignes.

Les résultats peuvent être affichés selon trois modes : `files_with_matches` (chemins uniquement, défaut), `content` (lignes correspondantes avec numéros), ou `count` (nombre de correspondances par fichier). Le mode content supporte l'affichage de contexte avant/après les correspondances via `-A`, `-B`, `-C`.

## Exemples

**Recherche simple** :
```python
Grep(pattern="async", type="py")  # Fichiers Python contenant "async"
```

**Avec contexte** (3 lignes avant/après) :
```python
Grep(pattern="TODO", output_mode="content", -C=3)
```

**Recherche multiline** :
```python
Grep(pattern="struct \\{[\\s\\S]*?field", multiline=true)
```

**Note** : Syntaxe ripgrep, pas grep. Les accolades littérales nécessitent échappement.

## Liens connexes

- [[CLAUDE CODE : [Glob] - recherche fichiers pattern]] - Recherche par nom de fichier
- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
