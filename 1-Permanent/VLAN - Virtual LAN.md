---
type: permanent
created: 2025-01-08 01:42
tags:
  - permanent
  - réseau
  - vlan
  - segmentation
---

# VLAN - Virtual LAN

> [!abstract] Concept
> Un VLAN segmente logiquement un réseau physique en plusieurs réseaux virtuels isolés.

## Explication

Les VLANs créent plusieurs réseaux locaux virtuels sur une même infrastructure physique. Chaque VLAN est un **domaine de broadcast séparé**.

**Principe** :
- Un switch gère plusieurs VLANs
- Chaque port appartient à un VLAN
- Les machines d'un VLAN communiquent uniquement entre elles
- Communication inter-VLAN nécessite un routeur

## Modes de port

**Mode Access** : Port pour équipement final (PC, serveur)
- Appartient à **1 seul VLAN**
- Trames non taguées

**Mode Trunk** : Port transportant **plusieurs VLANs**
- Liaison switch-switch ou switch-routeur
- Trames taguées avec 802.1Q

## Protocole 802.1Q

Standard IEEE pour le **tagging VLAN** :
- Ajoute 4 octets dans la trame Ethernet
- ID du VLAN (12 bits → 4096 VLANs max)

## Avantages

✅ Sécurité : isolation entre départements
✅ Performance : réduction des broadcasts
✅ Flexibilité : organisation logique

## Communication inter-VLAN

VLANs isolés par défaut. Pour communiquer :
- **Router on a stick** : Routeur avec sous-interfaces
- **Switch Layer 3** : Switch avec SVI (plus performant)
- **Serveur Linux** : Module 8021q + IP forwarding

## Connexions

- [[802.1Q - tagging VLAN]] - Protocole de tagging
- [[VLAN - mode access vs trunk]] - Différences
- [[VLAN - router on a stick]] - Architecture routage

**Configuration** :
- [[MOC - Réseau]]

**Voir aussi** : ![[Assets/Reseau/Pasted image 20251107200218.png]]

---
**Sources** : [[J2 - Formation Réseau|Formation Réseau - Jour 2]], IEEE 802.1Q
