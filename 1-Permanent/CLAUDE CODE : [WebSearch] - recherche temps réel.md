---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - outil
  - web
  - recherche
---

# CLAUDE CODE : [WebSearch] - recherche temps réel

L'outil WebSearch de [[CLAUDE CODE - interface CLI|Claude Code]] effectue des recherches web en temps réel, retournant des résultats formatés avec informations à jour (post-cutoff de connaissances de Claude). Il supporte le filtrage par domaines autorisés (`allowed_domains`) ou bloqués (`blocked_domains`).

Contrairement à [[CLAUDE CODE : [WebFetch] - récupération web|WebFetch]] qui cible une URL spécifique, WebSearch interroge un moteur de recherche. Actuellement disponible uniquement aux USA. Utile pour accéder à des informations récentes, documentation mise à jour, ou tendances actuelles non présentes dans les connaissances de Claude (cutoff janvier 2025).

## Exemples

**Recherche simple** :
```python
WebSearch(query="Claude Code latest features 2025")
```

**Filtrage de domaines** :
```python
WebSearch(
    query="Python async best practices",
    allowed_domains=["docs.python.org", "realpython.com"]
)
```

**Bloquer des domaines** :
```python
WebSearch(
    query="React hooks tutorial",
    blocked_domains=["stackoverflow.com"]
)
```

**Disponibilité** : USA uniquement

## Liens connexes

- [[CLAUDE CODE : [WebFetch] - récupération web]] - Fetch URL spécifique
- [[CLAUDE - assistant IA Anthropic]] - Date de cutoff connaissances
- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
