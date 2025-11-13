---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - agents
  - task
  - automation
---

# CLAUDE CODE - système agents Task

Le système d'agents de [[CLAUDE CODE - interface CLI|Claude Code]] permet de déléguer des tâches complexes multi-étapes à des sous-processus autonomes spécialisés. Chaque agent est lancé via l'outil Task avec un `subagent_type`, un prompt détaillé, et optionnellement un modèle spécifique (haiku pour rapidité/économie).

Les agents sont stateless et autonomes : ils reçoivent un prompt unique et retournent un résultat final. Ils ne peuvent pas communiquer itérativement. Lancer plusieurs agents en parallèle (dans un seul message) maximise les performances. Le prompt doit spécifier clairement si l'agent doit faire de la recherche OU écrire du code, et quel résultat retourner.

## Exemples

**Agents disponibles** :
- [[CLAUDE CODE - Agent general-purpose]] : Tâches complexes polyvalentes
- [[CLAUDE CODE - Agent Explore]] : Exploration rapide de codebases
- [[CLAUDE CODE - Agents Zettelkasten]] : Archivage, normalisation, réparation liens

**Lancement d'agent** :
```python
Task(
    subagent_type="Explore",
    description="Find API endpoints",
    prompt="Search codebase for all API endpoints...",
    model="haiku"  # Optionnel
)
```

**Agents parallèles** (un seul message avec plusieurs Task) :
```python
[Task(...), Task(...), Task(...)]
```

## Liens connexes

- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
- [[MOC - Claude Code & IA]] - Map of Content
