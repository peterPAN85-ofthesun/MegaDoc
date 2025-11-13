---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - outil
  - recherche
  - glob
---

# CLAUDE CODE : [Glob] - recherche fichiers pattern

L'outil Glob de [[CLAUDE CODE - interface CLI|Claude Code]] recherche des fichiers par patterns glob standards (`**/*.js`, `src/**/*.tsx`). Il fonctionne rapidement sur toutes tailles de codebases et retourne les résultats triés par date de modification (plus récents en premier).

Contrairement à [[CLAUDE CODE : [Grep] - recherche ripgrep|Grep]] qui recherche dans le contenu, Glob recherche uniquement par nom/chemin de fichier. Les recherches parallèles sont recommandées : si plusieurs patterns sont potentiellement utiles, les exécuter simultanément dans un seul message optimise la performance.

## Exemples

**Tous les fichiers TypeScript** :
```python
Glob(pattern="**/*.ts")
```

**Fichiers dans dossier spécifique** :
```python
Glob(pattern="src/components/*.tsx", path="/project/root")
```

**Patterns courants** :
- `**/*.md` : Tous les markdown récursivement
- `src/**/*.{ts,tsx}` : TypeScript/TSX dans src/
- `**/test_*.py` : Fichiers de test Python

## Liens connexes

- [[CLAUDE CODE : [Grep] - recherche ripgrep]] - Recherche dans contenu
- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
