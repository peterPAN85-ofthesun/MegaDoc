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
