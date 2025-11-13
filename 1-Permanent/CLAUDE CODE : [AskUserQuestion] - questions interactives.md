---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - outil
  - interaction
  - questions
---

# CLAUDE CODE : [AskUserQuestion] - questions interactives

L'outil AskUserQuestion de [[CLAUDE CODE - interface CLI|Claude Code]] permet de poser 1 à 4 questions à l'utilisateur pendant l'exécution, avec 2 à 4 options par question. Une option "Autre" est ajoutée automatiquement pour permettre une réponse personnalisée. Le mode `multiSelect: true` autorise la sélection multiple d'options.

Utiliser cet outil pour clarifier des instructions ambiguës, obtenir des préférences utilisateur, ou faire des choix d'implémentation. Chaque question nécessite un `header` court (≤12 caractères) affiché comme tag, et une `question` complète claire terminant par "?". Les options doivent inclure `label` et `description` explicative.

## Exemples

**Question simple** :
```python
AskUserQuestion(questions=[{
    "question": "Which authentication method should we use?",
    "header": "Auth method",
    "multiSelect": false,
    "options": [
        {"label": "OAuth 2.0", "description": "Industry standard, external provider"},
        {"label": "JWT tokens", "description": "Self-contained, stateless"},
        {"label": "Session-based", "description": "Traditional, server storage"}
    ]
}])
```

**Multi-sélection** :
```python
{"multiSelect": true}  # Permet sélection de plusieurs options
```

## Liens connexes

- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
