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

<svg viewBox="0 0 440 250" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Un switch physique portant deux VLAN isolés, reliés par un routeur">
<rect x="110" y="120" width="220" height="34" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="150" y="142" font-size="12" fill="currentColor">SWITCH — une seule infrastructure physique</text>
<rect x="150" y="34" width="140" height="30" rx="5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="4 3"/>
<text x="176" y="54" font-size="12" fill="currentColor">ROUTEUR (inter-VLAN)</text>
<line x1="220" y1="120" x2="220" y2="64" stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 3"/>
<text x="228" y="98" font-size="10" fill="currentColor" opacity="0.75">seul chemin entre VLAN</text>
<rect x="128" y="126" width="16" height="22" rx="2" fill="#4c9aff" fill-opacity="0.35" stroke="#4c9aff"/>
<rect x="160" y="126" width="16" height="22" rx="2" fill="#4c9aff" fill-opacity="0.35" stroke="#4c9aff"/>
<rect x="264" y="126" width="16" height="22" rx="2" fill="#f2994a" fill-opacity="0.35" stroke="#f2994a"/>
<rect x="296" y="126" width="16" height="22" rx="2" fill="#f2994a" fill-opacity="0.35" stroke="#f2994a"/>
<line x1="136" y1="148" x2="136" y2="192" stroke="#4c9aff" stroke-width="1.6"/>
<line x1="168" y1="148" x2="168" y2="192" stroke="#4c9aff" stroke-width="1.6"/>
<line x1="272" y1="148" x2="272" y2="192" stroke="#f2994a" stroke-width="1.6"/>
<line x1="304" y1="148" x2="304" y2="192" stroke="#f2994a" stroke-width="1.6"/>
<rect x="112" y="192" width="48" height="26" rx="4" fill="none" stroke="#4c9aff" stroke-width="1.4"/>
<text x="126" y="209" font-size="11" fill="#4c9aff">PC A</text>
<rect x="164" y="192" width="48" height="26" rx="4" fill="none" stroke="#4c9aff" stroke-width="1.4"/>
<text x="178" y="209" font-size="11" fill="#4c9aff">PC B</text>
<rect x="248" y="192" width="48" height="26" rx="4" fill="none" stroke="#f2994a" stroke-width="1.4"/>
<text x="262" y="209" font-size="11" fill="#f2994a">PC C</text>
<rect x="300" y="192" width="48" height="26" rx="4" fill="none" stroke="#f2994a" stroke-width="1.4"/>
<text x="314" y="209" font-size="11" fill="#f2994a">PC D</text>
<rect x="104" y="184" width="116" height="42" rx="8" fill="#4c9aff" fill-opacity="0.08" stroke="#4c9aff" stroke-width="1" stroke-dasharray="4 3"/>
<rect x="240" y="184" width="116" height="42" rx="8" fill="#f2994a" fill-opacity="0.08" stroke="#f2994a" stroke-width="1" stroke-dasharray="4 3"/>
<text x="120" y="242" font-size="11" fill="#4c9aff">VLAN 10 — domaine de broadcast</text>
<text x="256" y="242" font-size="11" fill="#f2994a">VLAN 20 — domaine de broadcast</text>
<text x="16" y="22" font-size="12" fill="currentColor">un switch, deux réseaux logiques : le broadcast d'un VLAN n'atteint jamais l'autre</text>
</svg>

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
