---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - agents
  - exploration
  - codebase
---

# CLAUDE CODE - Agent Explore

L'agent Explore du [[CLAUDE CODE - système agents Task|système d'agents]] est spécialisé dans l'exploration rapide de codebases. Il excelle pour trouver des fichiers par patterns, rechercher des mots-clés dans le code, comprendre l'architecture d'un projet, ou répondre à "comment fonctionne X?".

Trois niveaux de profondeur sont disponibles : `quick` (recherche basique), `medium` (exploration modérée), `very thorough` (analyse exhaustive). Utiliser haiku comme modèle pour maximiser rapidité et réduire coûts. Préférer Explore à des recherches manuelles directes pour questions ouvertes nécessitant plusieurs rounds d'exploration.

## Exemples

**Exploration architecture** :
```python
Task(
    subagent_type="Explore",
    description="Find authentication implementation",
    prompt="How is authentication implemented? Search thoroughly.",
    model="haiku"
)
```

**Quand l'utiliser** :
- Questions sur architecture ("où est géré X?")
- Recherche de patterns dans le code
- Compréhension de flux de données
- Identification de conventions utilisées

**Quand NE PAS l'utiliser** :
- Requête précise pour fichier/classe spécifique → utiliser [[CLAUDE CODE : [Grep] - recherche ripgrep|Grep]] ou [[CLAUDE CODE : [Glob] - recherche fichiers pattern|Glob]] directement

## Liens connexes

- [[CLAUDE CODE - système agents Task]] - Architecture agents
- [[CLAUDE CODE - Agent general-purpose]] - Tâches polyvalentes
- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
