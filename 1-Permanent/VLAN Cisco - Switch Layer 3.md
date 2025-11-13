---
type: permanent
created: 2025-01-08 15:51
tags:
  - permanent
  - réseau
  - vlan
  - cisco
  - layer3
  - switch
---

# VLAN Cisco - Switch Layer 3

> [!abstract] Concept
> Activer le routage inter-VLAN directement sur un switch Layer 3 avec interfaces VLAN (SVI)

## Explication

Un **switch Layer 3** peut router le trafic entre VLANs sans routeur externe, grâce aux **SVI (Switch Virtual Interface)** : interfaces logiques représentant la passerelle de chaque VLAN.

**Avantages vs Router on a stick** :
- ✓ Routage matériel (ASIC) → **beaucoup plus rapide**
- ✓ Pas de lien trunk saturé
- ✓ Meilleure scalabilité (dizaines de VLANs)
- ✗ Switch L3 plus cher

**Prérequis** : switch supportant `ip routing` (ex: Catalyst 3560, 3750, 9300).

## Exemples

### Configuration complète

```cisco
# Activer le routage
Switch(config)# ip routing

# Créer les VLANs
Switch(config)# vlan 10
Switch(config-vlan)# name ADMIN
Switch(config-vlan)# exit

Switch(config)# vlan 20
Switch(config-vlan)# name USERS
Switch(config-vlan)# exit

Switch(config)# vlan 30
Switch(config-vlan)# name SERVEURS
Switch(config-vlan)# exit
```

### Créer les interfaces VLAN (SVI)

```cisco
# VLAN 10
Switch(config)# interface vlan 10
Switch(config-if)# ip address 192.168.10.254 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit

# VLAN 20
Switch(config)# interface vlan 20
Switch(config-if)# ip address 192.168.20.254 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit

# VLAN 30
Switch(config)# interface vlan 30
Switch(config-if)# ip address 192.168.30.254 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit

Switch(config)# end
Switch# write memory
```

### Affecter les ports aux VLANs (mode access)

```cisco
# Ports VLAN 10
Switch(config)# interface range fastEthernet 0/1-8
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 10

# Ports VLAN 20
Switch(config)# interface range fastEthernet 0/9-16
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 20
```

### Vérification

```cisco
# Voir les interfaces VLAN
Switch# show ip interface brief

# Table de routage
Switch# show ip route

# Vérifier le routage activé
Switch# show ip protocols
```

### Routage vers réseau externe

Si connexion vers Internet/autre site via routeur externe :

```cisco
# Route par défaut vers routeur 10.0.0.1
Switch(config)# ip route 0.0.0.0 0.0.0.0 10.0.0.1

# Interface vers routeur externe
Switch(config)# interface gigabitEthernet 0/1
Switch(config-if)# no switchport          # Mode routé (L3)
Switch(config-if)# ip address 10.0.0.2 255.255.255.252
Switch(config-if)# no shutdown
```

### Architecture

```
[PC VLAN 10] ─┐
              │
[PC VLAN 20] ─┼─ [Switch L3] ───(L3 link)─── [Routeur externe]
              │   (routage        10.0.0.2        |
[PC VLAN 30] ─┘    interne)                   [Internet]
```

## Connexions

### Notes liées
- [[VLAN Cisco - Router on a stick]] - Alternative avec routeur externe
- [[VLAN Cisco - Configuration switch]] - Création VLANs de base
- [[ROUTAGE - statique]] - Routes vers réseaux externes
- [[VLAN - Virtual LAN]] - Concept de segmentation

### Contexte
Solution privilégiée en entreprise pour les réseaux moyens/grands. Performances nettement supérieures au Router on a stick. Le switch L3 combine switching (L2) et routage (L3) dans un seul équipement.

## Sources
- Formation Réseau - Switch Layer 3
- Cisco Multilayer Switching Configuration

---
**Tags thématiques** : #switch-layer3 #svi #routage-matériel #inter-vlan
