---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - outil
  - organisation
  - tâches
---

# CLAUDE CODE : [TodoWrite] - gestion tâches

L'outil TodoWrite de [[CLAUDE CODE - interface CLI|Claude Code]] crée et gère une liste de tâches structurée pour suivre la progression des travaux complexes. Chaque tâche a deux formes (impérative `content` et continue `activeForm`) et trois états possibles : `pending`, `in_progress`, `completed`.

La règle stricte est : UNE SEULE tâche `in_progress` à la fois. Une tâche ne doit être marquée `completed` que si elle est totalement achevée (pas d'erreurs, tests passants, implémentation complète). TodoWrite est utilisé proactivement pour tâches ≥3 étapes, tâches non-triviales, ou listes multiples. Ne PAS l'utiliser pour tâches simples uniques.

## Exemples

**Format de tâche** :
```python
{
    "content": "Run tests",        # Forme impérative
    "activeForm": "Running tests",  # Forme continue
    "status": "in_progress"
}
```

**Usage** :
```python
TodoWrite(todos=[
    {"content": "Search auth code", "activeForm": "Searching auth code", "status": "in_progress"},
    {"content": "Implement OAuth", "activeForm": "Implementing OAuth", "status": "pending"},
    {"content": "Write tests", "activeForm": "Writing tests", "status": "pending"}
])
```

**Règle** : Marquer `completed` IMMÉDIATEMENT après achèvement, jamais en batch.

## Liens connexes

- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
