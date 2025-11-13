---
type: permanent
created: 2025-01-08 19:45
tags:
  - permanent
  - réseau
  - cisco
  - vlan
---

# Sous-interfaces Cisco

> [!abstract] Concept
> Les sous-interfaces permettent de diviser une interface physique en plusieurs interfaces logiques, chacune avec sa propre configuration IP et encapsulation VLAN.

## Explication

Une sous-interface est une interface logique créée sur une interface physique. Principalement utilisée pour le routage inter-VLAN (Router on a stick).

**Format de nommage** : `InterfacePhysique.NuméroVLAN`

Exemples :
- `GigabitEthernet0/0.10` → Sous-interface pour VLAN 10
- `GigabitEthernet0/0.20` → Sous-interface pour VLAN 20
- `FastEthernet0/1.100` → Sous-interface pour VLAN 100

**Caractéristiques** :
- Chaque sous-interface a sa propre adresse IP
- Encapsulation 802.1Q obligatoire
- Numéro de sous-interface ≠ numéro de VLAN (mais conventionnellement identiques)

## Configuration Cisco

```cisco
interface GigabitEthernet0/0
 no shutdown  ! Activer l'interface physique

interface GigabitEthernet0/0.10
 description VLAN 10 - Administration
 encapsulation dot1Q 10
 ip address 192.168.10.254 255.255.255.0

interface GigabitEthernet0/0.20
 description VLAN 20 - Users
 encapsulation dot1Q 20
 ip address 192.168.20.254 255.255.255.0
```

**Points importants** :
- L'interface physique doit être `no shutdown`
- L'interface physique n'a généralement pas d'IP
- Chaque sous-interface agit comme passerelle de son VLAN

## Vérification

```cisco
show ip interface brief        ! Voir toutes les interfaces
show interfaces Gi0/0.10       ! Détails d'une sous-interface
show vlans                     ! VLANs configurés sur le routeur
```

## Connexions

- [[VLAN - router on a stick]] - Architecture utilisant les sous-interfaces
- [[802.1Q - tagging VLAN]] - Protocole d'encapsulation nécessaire
- [[VLAN - Virtual LAN]] - Concept de base
- [[VLAN Cisco - Router on a stick]] - Configuration complète

---
**Sources** : [[J2 - Formation Réseau|Formation Réseau - Jour 2]], Cisco IOS Documentation
