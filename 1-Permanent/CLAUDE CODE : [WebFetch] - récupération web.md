---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - outil
  - web
  - http
---

# CLAUDE CODE : [WebFetch] - récupération web

L'outil WebFetch de [[CLAUDE CODE - interface CLI|Claude Code]] récupère du contenu web, le convertit de HTML vers Markdown, puis l'analyse avec un modèle IA selon le prompt fourni. Il inclut un cache automatique de 15 minutes pour réutiliser les résultats récents et upgrade automatiquement HTTP vers HTTPS.

Contrairement à [[CLAUDE CODE : [WebSearch] - recherche temps réel|WebSearch]] qui effectue des recherches, WebFetch cible une URL spécifique. Si un outil MCP web est disponible (`mcp__*`), il doit être préféré car il peut avoir moins de restrictions. WebFetch est idéal pour extraire des informations spécifiques de documentation ou pages web structurées.

## Exemples

**Extraction d'informations** :
```python
WebFetch(
    url="https://docs.example.com/api",
    prompt="Extraire la liste des endpoints API disponibles"
)
```

**Analyse de documentation** :
```python
WebFetch(
    url="https://docs.python.org/3/library/asyncio.html",
    prompt="Résumer les concepts principaux d'asyncio"
)
```

**Cache** : 15 minutes de rétention automatique

## Liens connexes

- [[CLAUDE CODE : [WebSearch] - recherche temps réel]] - Recherche web
- [[CLAUDE CODE - MCP Servers]] - Préférer MCP si disponible
- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
