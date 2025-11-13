---
type: permanent
created: 2025-01-08 15:55
tags:
  - permanent
  - réseau
  - vlan
  - cisco
  - troubleshooting
---

# VLAN Cisco - Vérification et dépannage

> [!abstract] Concept
> Commandes essentielles pour diagnostiquer et résoudre les problèmes de configuration VLAN

## Explication

Le dépannage VLAN nécessite de vérifier :
1. **VLANs créés** : existence et nommage
2. **Affectation des ports** : mode access/trunk, VLAN assigné
3. **État des interfaces** : up/down, speed/duplex
4. **Trunk** : VLANs autorisés, VLAN natif
5. **Table MAC** : apprentissage des adresses par VLAN
6. **Routage inter-VLAN** : sous-interfaces ou SVI

## Exemples

### Vérifier les VLANs créés

```cisco
# Tous les VLANs et ports associés
Switch# show vlan brief

# VLAN spécifique
Switch# show vlan id 10

# VLANs avec détails complets
Switch# show vlan
```

**Sortie utile** : ID, nom, status, ports membres

### Vérifier l'état des ports

```cisco
# État de tous les ports
Switch# show interfaces status

# Interface spécifique
Switch# show interfaces fastEthernet 0/1 switchport
```

**Chercher** :
- **Administrative Mode** : access/trunk
- **Access Mode VLAN** : VLAN assigné
- **Operational Mode** : mode actuel

### Vérifier les trunks

```cisco
# Tous les trunks actifs
Switch# show interfaces trunk

# Trunk spécifique
Switch# show interfaces fastEthernet 0/24 trunk
```

**Colonnes importantes** :
- **VLANs allowed** : VLANs autorisés à transiter
- **VLANs active** : VLANs existants et actifs
- **Native VLAN** : VLAN natif (non tagué)

### Vérifier la table MAC

```cisco
# Toutes les entrées MAC
Switch# show mac address-table

# Par VLAN
Switch# show mac address-table vlan 10

# Par interface
Switch# show mac address-table interface fastEthernet 0/5
```

### Vérifier les sous-interfaces (Router on a stick)

```cisco
# Toutes les interfaces
Router# show ip interface brief

# Sous-interface spécifique
Router# show interfaces gigabitEthernet 0/0.10

# Table de routage
Router# show ip route
```

### Vérifier les SVI (Switch L3)

```cisco
# Interfaces VLAN
Switch# show ip interface brief

# Routage activé ?
Switch# show ip protocols

# Interface VLAN détaillée
Switch# show interfaces vlan 10
```

### Debug VLAN (attention à la charge)

```cisco
# Debug tagging 802.1Q
Switch# debug dot1q

# Arrêter le debug
Switch# undebug all
```

### Problèmes courants

| Symptôme | Cause probable | Vérification |
|----------|----------------|--------------|
| Port en VLAN 1 alors que configuré | VLAN n'existe pas | `show vlan brief` |
| Pas de comm inter-VLAN | Routage non configuré | `show ip route` (routeur/SVI) |
| Trunk ne fonctionne pas | VLANs non autorisés | `show interfaces trunk` |
| Interface down | Port shutdown ou câble | `show interfaces status` |
| PC sans réseau | Mauvais VLAN assigné | `show vlan brief` + `show mac address-table` |

### Réinitialiser la config VLAN

```cisco
# Supprimer tous les VLANs (sauf VLAN 1)
Switch# delete flash:vlan.dat
Switch# reload
```

**Attention** : efface TOUTE la config VLAN.

### Effacer la table MAC

```cisco
# Toutes les entrées dynamiques
Switch# clear mac address-table dynamic

# Par VLAN
Switch# clear mac address-table dynamic vlan 10

# Par interface
Switch# clear mac address-table dynamic interface fastEthernet 0/5
```

## Connexions

### Notes liées
- [[VLAN Cisco - Configuration switch]] - Créer VLANs et affecter ports
- [[VLAN Cisco - Port trunk et 802.1Q]] - Configuration trunk
- [[VLAN Cisco - Router on a stick]] - Routage inter-VLAN
- [[VLAN Cisco - Switch Layer 3]] - SVI et routage L3

### Contexte
Commandes indispensables pour diagnostiquer les problèmes de connectivité liés aux VLANs. À utiliser systématiquement lors de la mise en service ou du dépannage d'un réseau segmenté.

## Sources
- Formation Réseau - Dépannage VLAN
- Cisco VLAN Troubleshooting Guide

---
**Tags thématiques** : #troubleshooting #show-commands #vlan #diagnostic
