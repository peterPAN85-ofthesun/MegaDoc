---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - automation
  - hooks
  - events
---

# CLAUDE CODE - Hooks personnalisés

Les Hooks de [[CLAUDE CODE - interface CLI|Claude Code]] sont des scripts shell exécutés automatiquement en réponse à des événements spécifiques : avant traitement d'un message utilisateur (`user-prompt-submit-hook`), avant/après appel d'outil (`tool-call-hook`), ou autres événements configurables selon les settings.

Le feedback provenant d'un hook doit être traité comme provenant de l'utilisateur lui-même. Si un hook bloque une opération, Claude doit déterminer s'il peut ajuster ses actions ou si l'utilisateur doit modifier sa configuration de hooks. Les hooks permettent d'implémenter des validations, logging, ou transformations automatiques des entrées/sorties.

## Exemples

**Types de hooks** :
- `user-prompt-submit-hook` : Avant chaque message utilisateur
- `tool-call-hook` : Avant/après utilisation d'outils
- Autres hooks configurables

**Cas d'usage** :
- Validation automatique de code avant commit
- Logging des opérations effectuées
- Transformation des entrées utilisateur
- Notifications externes (Slack, email)
- Backup automatique avant modifications

**Configuration** : Dans settings de Claude Code

**Gestion des blocages** : Si un hook bloque, ajuster actions OU demander à l'utilisateur de vérifier hooks

## Liens connexes

- [[CLAUDE CODE - Slash Commands]] - Commandes personnalisées
- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
