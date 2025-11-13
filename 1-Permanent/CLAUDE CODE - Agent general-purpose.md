---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - agents
  - task
---

# CLAUDE CODE - Agent general-purpose

L'agent general-purpose du [[CLAUDE CODE - système agents Task|système d'agents]] est un agent polyvalent capable de gérer des tâches complexes variées : recherche de questions complexes, recherche de code, exécution de tâches multi-étapes. Il a accès à tous les outils disponibles dans Claude Code.

Utiliser cet agent pour des tâches qui ne correspondent pas aux agents spécialisés ([[CLAUDE CODE - Agent Explore|Explore]], [[CLAUDE CODE - Agents Zettelkasten|Zettelkasten]]), ou qui nécessitent une combinaison d'opérations diverses. Comme tous les agents, il est autonome et stateless : fournir un prompt détaillé avec toutes les informations nécessaires.

## Exemples

**Tâche multi-étapes** :
```python
Task(
    subagent_type="general-purpose",
    description="Analyze and refactor module",
    prompt="""
    1. Read the auth module
    2. Identify code smells and anti-patterns
    3. Propose refactoring suggestions with examples
    4. Explain the benefits of each suggestion
    """
)
```

**Quand l'utiliser** :
- Tâches complexes ne rentrant pas dans d'autres catégories
- Combinaison de recherche, analyse, et génération
- Investigations approfondies

## Liens connexes

- [[CLAUDE CODE - système agents Task]] - Architecture agents
- [[CLAUDE CODE - Agent Explore]] - Spécialisé exploration
- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
