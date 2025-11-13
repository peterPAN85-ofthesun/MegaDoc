---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - agents
  - zettelkasten
  - obsidian
---

# CLAUDE CODE - Agents Zettelkasten

Le [[CLAUDE CODE - système agents Task|système d'agents]] inclut trois agents spécialisés pour la gestion de vaults Zettelkasten dans Obsidian : **zettelkasten-archiver** (archivage notes traitées), **obsidian-link-repairer** (réparation liens cassés), et **zettelkasten-note-normalizer** (normalisation nomenclature).

Ces agents s'intègrent dans le workflow Zettelkasten : l'archiver déplace les notes sources après transformation en notes permanentes, le link-repairer se déclenche automatiquement après renommage/déplacement de fichiers, et le normalizer standardise les noms selon les conventions définies (ex: "vlan setup" → "VLAN - Virtual LAN Setup").

## Exemples

**zettelkasten-archiver** :
- Déclenché après création de notes permanentes depuis Inbox
- Archive les sources originales en préservant structure

**obsidian-link-repairer** :
- Déclenchement automatique après `mv` ou renommage
- Scanne vault et répare tous les liens cassés
- Workflow : `1. Renommer → 2. Réparer liens → 3. Confirmer`

**zettelkasten-note-normalizer** :
- Après création note permanente
- Vérifie conformité nomenclature
- Suggère renommage si nécessaire

**Exemples de normalisation** :
- `cd command` → `cd - Change Directory Command`
- `nat configuration` → `NAT - Network Address Translation`

## Liens connexes

- [[CLAUDE CODE - système agents Task]] - Architecture agents
- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
- Méthode Zettelkasten : atomicité et liens
