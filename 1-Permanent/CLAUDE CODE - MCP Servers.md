---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - mcp
  - model-context-protocol
  - extensions
---

# CLAUDE CODE - MCP Servers

MCP (Model Context Protocol) Servers sont des serveurs externes qui fournissent des outils additionnels à [[CLAUDE CODE - interface CLI|Claude Code]]. Tous les outils MCP sont préfixés par `mcp__*` pour les distinguer des outils natifs. Ils permettent d'étendre les capacités de Claude Code avec des intégrations personnalisées : accès à bases de données, APIs externes, services cloud, ou outils métier spécifiques.

Les outils MCP doivent être préférés aux outils natifs équivalents quand disponibles, car ils peuvent avoir moins de restrictions ou des fonctionnalités spécialisées. Par exemple, `mcp__web_fetch` peut être préféré à [[CLAUDE CODE : [WebFetch] - récupération web|WebFetch]] standard selon la configuration.

## Exemples

**Convention de nommage** : Préfixe `mcp__*` obligatoire
- `mcp__web_fetch` : Récupération web via MCP
- `mcp__database_query` : Requêtes bases de données
- `mcp__slack_notify` : Notifications Slack
- `mcp__custom_tool` : Outils métier personnalisés

**Avantages** :
- Accès à services externes
- Extensions personnalisées possibles
- Intégrations métier spécifiques
- Peut avoir moins de restrictions que outils natifs

**Configuration** : Via Model Context Protocol servers

## Liens connexes

- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
- [[CLAUDE CODE : [WebFetch] - récupération web]] - Outil natif équivalent
- Documentation MCP : Model Context Protocol
