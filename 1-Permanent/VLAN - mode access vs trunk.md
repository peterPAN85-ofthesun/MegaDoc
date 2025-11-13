---
type: permanent
created: 2025-01-08 02:00
tags:
  - permanent
  - réseau
  - vlan
  - switch
---

# Mode access vs trunk

> [!abstract] Concept
> Les ports d'un switch peuvent être en mode **access** (1 seul VLAN) ou **trunk** (plusieurs VLANs).

## Mode Access

**Usage** : Port connecté à un équipement final

**Caractéristiques** :
- Appartient à **1 seul VLAN**
- Trames **non taguées** (switch gère le tagging)
- Équipement final ne voit pas les VLANs

**Exemples** : PC, imprimante, serveur, téléphone IP

## Mode Trunk

**Usage** : Liaison entre switches ou switch-routeur

**Caractéristiques** :
- Transporte **plusieurs VLANs** simultanément
- Trames **taguées** avec 802.1Q
- Permet la communication inter-switches

**Exemples** : Liaison switch ↔ switch, switch ↔ routeur

## Comparaison

| Aspect | Access | Trunk |
|--------|--------|-------|
| **VLANs** | 1 seul | Plusieurs |
| **Tagging** | Non | Oui (802.1Q) |
| **Connexion** | Équipement final | Switch/Routeur |
| **Config** | Simple | Plus complexe |

## Exemple

```
[PC VLAN 10] ──(access)── [Switch 1] ──(trunk)── [Switch 2] ──(access)── [PC VLAN 20]
  Pas de tag              Tag ajouté   Tag transporté  Tag retiré    Pas de tag
```

## VLANs autorisés sur trunk

Sur un trunk, on peut limiter les VLANs transportés :
```cisco
switchport trunk allowed vlan 10,20,30
```

Évite de transporter des VLANs inutiles.

## Connexions

- [[VLAN - Virtual LAN]] - Concept de base
- [[802.1Q - tagging VLAN]] - Protocole de tagging sur trunk
- [[VLAN - natif untagged]] - VLAN sans tag sur trunk

**Configuration** :
- [[MOC - Réseau]]

---
**Sources** : Fiche VLANs
