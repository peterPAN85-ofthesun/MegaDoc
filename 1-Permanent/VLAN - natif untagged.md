---
type: permanent
created: 2025-01-08 19:45
tags:
  - permanent
  - réseau
  - vlan
  - sécurité
---

# VLAN natif

> [!abstract] Concept
> Le VLAN natif est le VLAN dont les trames ne sont PAS taguées sur un port trunk, permettant la compatibilité avec équipements ne supportant pas 802.1Q.

## Explication

Sur un port trunk 802.1Q, toutes les trames sont normalement taguées avec leur ID de VLAN. Le VLAN natif est l'exception : ses trames circulent sans tag.

**Comportement** :
```
VLAN 10 → Trame taguée [802.1Q tag: 10]
VLAN 20 → Trame taguée [802.1Q tag: 20]
VLAN 1  → Trame NON taguée (si VLAN natif = 1)
```

**Par défaut sur Cisco** : VLAN natif = VLAN 1

<svg viewBox="0 0 440 215" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="VLAN natif : trames non taguées sur un lien trunk">
<rect x="20" y="88" width="90" height="34" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="44" y="110" font-size="12" fill="currentColor">SWITCH</text>
<rect x="330" y="88" width="90" height="34" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="354" y="110" font-size="12" fill="currentColor">SWITCH</text>
<line x1="110" y1="105" x2="330" y2="105" stroke="currentColor" stroke-width="4"/>
<text x="186" y="98" font-size="11" fill="currentColor">lien TRUNK</text>
<rect x="128" y="36" width="90" height="24" rx="4" fill="#4c9aff" fill-opacity="0.18" stroke="#4c9aff" stroke-width="1.2"/>
<text x="136" y="52" font-size="10.5" fill="#4c9aff">[tag 10] VLAN 10</text>
<rect x="128" y="62" width="90" height="24" rx="4" fill="#f2994a" fill-opacity="0.18" stroke="#f2994a" stroke-width="1.2"/>
<text x="136" y="78" font-size="10.5" fill="#f2994a">[tag 20] VLAN 20</text>
<rect x="232" y="128" width="130" height="26" rx="4" fill="#27ae60" fill-opacity="0.18" stroke="#27ae60" stroke-width="1.4" stroke-dasharray="4 3"/>
<text x="240" y="145" font-size="10.5" fill="#27ae60">VLAN 1 — SANS tag</text>
<line x1="220" y1="105" x2="232" y2="132" stroke="#27ae60" stroke-width="1.2" stroke-dasharray="3 2"/>
<text x="232" y="170" font-size="10.5" fill="#27ae60">VLAN natif : CDP, VTP, DTP, vieux matériels</text>
<text x="20" y="196" font-size="11" fill="#f2994a" opacity="0.95">⚠ risque : double tagging — l'attaquant place un faux tag sous le tag natif absent</text>
<text x="16" y="22" font-size="12" fill="currentColor">sur un trunk, un seul VLAN circule en clair : le VLAN natif</text>
</svg>

## Pourquoi un VLAN natif ?

**Historiquement** : Compatibilité avec équipements anciens ne supportant pas 802.1Q

**Aujourd'hui** : Principalement pour :
- Trames de management (CDP, VTP, DTP)
- Trafic de contrôle switch

## Risque de sécurité : VLAN Hopping

**Attaque double tagging** :
1. Attaquant dans VLAN natif (ex: VLAN 1)
2. Envoie trame avec double tag : [tag externe: 1] [tag interne: 10]
3. Premier switch retire tag externe (VLAN natif)
4. Trame arrive au second switch avec tag 10 → accès au VLAN 10

**Protection** :
```cisco
! Changer le VLAN natif sur tous les trunks
interface GigabitEthernet0/1
 switchport trunk native vlan 999

! Utiliser un VLAN inutilisé (999, 1000, etc.)
! Le configurer identiquement sur TOUS les switches
```

## Configuration Cisco

**Voir le VLAN natif** :
```cisco
show interfaces trunk
```

**Modifier le VLAN natif** :
```cisco
interface GigabitEthernet0/1
 switchport mode trunk
 switchport trunk native vlan 999
```

**Alerte mismatch** :
Si deux switches ont des VLANs natifs différents sur le même trunk :
```
%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch
```

## Bonnes pratiques

✅ **Changer le VLAN natif** de VLAN 1 vers VLAN inutilisé
✅ **Cohérence** : même VLAN natif sur les deux côtés du trunk
✅ **Ne jamais utiliser** le VLAN natif pour du trafic utilisateur
✅ **Désactiver** le VLAN natif si non nécessaire (trunk 802.1Q pur)

## Connexions

- [[802.1Q - tagging VLAN]] - Protocole de tagging VLAN
- [[VLAN - mode access vs trunk]] - Ports trunk
- [[VLAN - Virtual LAN]] - Concept de base
- [[VLAN Cisco - Sécurisation]] - Protection contre attaques

---
**Sources** : [[J2 - Formation Réseau|Formation Réseau - Jour 2]], Cisco VLAN Security Best Practices
