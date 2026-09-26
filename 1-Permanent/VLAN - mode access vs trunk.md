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

<svg viewBox="0 0 440 240" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ports access non tagués et lien trunk tagué entre deux switches">
<rect x="30" y="100" width="130" height="32" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="68" y="121" font-size="12" fill="currentColor">SWITCH 1</text>
<rect x="280" y="100" width="130" height="32" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="318" y="121" font-size="12" fill="currentColor">SWITCH 2</text>
<line x1="160" y1="116" x2="280" y2="116" stroke="currentColor" stroke-width="4"/>
<rect x="176" y="72" width="88" height="24" rx="4" fill="#27ae60" fill-opacity="0.15" stroke="#27ae60" stroke-width="1.2"/>
<text x="184" y="89" font-size="11" fill="#27ae60">TRUNK 802.1Q</text>
<line x1="220" y1="96" x2="220" y2="112" stroke="#27ae60" stroke-width="1.2" stroke-dasharray="3 2"/>
<text x="166" y="140" font-size="10" fill="#4c9aff">[tag 10]</text>
<text x="222" y="140" font-size="10" fill="#f2994a">[tag 20]</text>
<text x="166" y="154" font-size="10" fill="currentColor" opacity="0.75">trames taguées : plusieurs VLAN sur un seul câble</text>
<line x1="60" y1="132" x2="60" y2="176" stroke="#4c9aff" stroke-width="1.6"/>
<line x1="120" y1="132" x2="120" y2="176" stroke="#f2994a" stroke-width="1.6"/>
<line x1="320" y1="132" x2="320" y2="176" stroke="#4c9aff" stroke-width="1.6"/>
<line x1="380" y1="132" x2="380" y2="176" stroke="#f2994a" stroke-width="1.6"/>
<rect x="34" y="176" width="52" height="26" rx="4" fill="none" stroke="#4c9aff" stroke-width="1.4"/>
<text x="46" y="193" font-size="11" fill="#4c9aff">PC v10</text>
<rect x="94" y="176" width="52" height="26" rx="4" fill="none" stroke="#f2994a" stroke-width="1.4"/>
<text x="106" y="193" font-size="11" fill="#f2994a">PC v20</text>
<rect x="294" y="176" width="52" height="26" rx="4" fill="none" stroke="#4c9aff" stroke-width="1.4"/>
<text x="306" y="193" font-size="11" fill="#4c9aff">PC v10</text>
<rect x="354" y="176" width="52" height="26" rx="4" fill="none" stroke="#f2994a" stroke-width="1.4"/>
<text x="366" y="193" font-size="11" fill="#f2994a">PC v20</text>
<text x="30" y="222" font-size="11" fill="currentColor" opacity="0.8">ports ACCESS : 1 seul VLAN, trames NON taguées — l'équipement final ignore les VLAN</text>
<text x="16" y="22" font-size="12" fill="currentColor">access = feuille du réseau · trunk = artère entre équipements</text>
</svg>

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
