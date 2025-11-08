---
type: moc
created: 2025-01-08 01:45
tags:
  - moc
  - cisco
  - vlan
  - configuration
---

# 🗺️ MOC - Configuration VLAN Cisco

> [!note] Guide de référence
> Configuration complète des VLANs sur switches et routeurs Cisco IOS.

## 📚 Concept

Voir [[VLAN - Virtual LAN]] pour le concept général.

---

## Configuration du Switch (Layer 2)

### Créer les VLANs

```cisco
Switch> enable
Switch# configure terminal

Switch(config)# vlan 10
Switch(config-vlan)# name VLAN_ADMIN
Switch(config-vlan)# exit

Switch(config)# vlan 20
Switch(config-vlan)# name VLAN_USERS
Switch(config-vlan)# exit

Switch(config)# vlan 30
Switch(config-vlan)# name VLAN_SERVEURS
Switch(config-vlan)# exit
```

---

### Ports en Mode Access

```cisco
# Port pour VLAN 10
Switch(config)# interface fastEthernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
Switch(config-if)# exit

# Port pour VLAN 20
Switch(config)# interface fastEthernet 0/2
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 20
Switch(config-if)# exit
```

>[!note]
>**Mode Access** = 1 seul VLAN par port (équipements finaux).

---

### Port en Mode Trunk

```cisco
Switch(config)# interface fastEthernet 0/24
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30
Switch(config-if)# exit

Switch(config)# end
Switch# write memory
```

>[!note]
>**Mode Trunk** = Transporte plusieurs VLANs (tagging 802.1Q).

---

### Vérification

```cisco
# Voir tous les VLANs
Switch# show vlan brief

# Voir les trunks
Switch# show interfaces trunk

# VLAN spécifique
Switch# show vlan id 10

# Table MAC par VLAN
Switch# show mac address-table vlan 10
```

---

## Configuration du Routeur (Router on a Stick)

### Activer l'interface physique

```cisco
Router(config)# interface gigabitEthernet 0/0
Router(config-if)# no shutdown
Router(config-if)# exit
```

>[!important]
>Interface physique doit être UP même sans IP.

---

### Créer les sous-interfaces

```cisco
# VLAN 10
Router(config)# interface gigabitEthernet 0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 192.168.10.254 255.255.255.0
Router(config-subif)# exit

# VLAN 20
Router(config)# interface gigabitEthernet 0/0.20
Router(config-subif)# encapsulation dot1Q 20
Router(config-subif)# ip address 192.168.20.254 255.255.255.0
Router(config-subif)# exit

# VLAN 30
Router(config)# interface gigabitEthernet 0/0.30
Router(config-subif)# encapsulation dot1Q 30
Router(config-subif)# ip address 192.168.30.254 255.255.255.0
Router(config-subif)# exit

Router(config)# end
Router# write memory
```

>[!note]
>**Encapsulation dot1Q** : Le numéro = ID du VLAN.

---

### Vérification

```cisco
# Interfaces et sous-interfaces
Router# show ip interface brief

# Détails sous-interface
Router# show interfaces gigabitEthernet 0/0.10

# Routage
Router# show ip route
```

---

## Exemple Complet

| VLAN | Nom | Réseau | Passerelle | Interface |
|------|-----|--------|------------|-----------|
| 10 | ADMIN | 192.168.10.0/24 | 192.168.10.254 | Gi0/0.10 |
| 20 | USERS | 192.168.20.0/24 | 192.168.20.254 | Gi0/0.20 |
| 30 | SERVEURS | 192.168.30.0/24 | 192.168.30.254 | Gi0/0.30 |

**Topologie** :
```
[PC VLAN 10] ─┐
              │
[PC VLAN 20] ─┼─ [Switch L2] ─(trunk)─ [Routeur]
              │                         Gi0/0.10/20/30
[PC VLAN 30] ─┘
```

---

## Flux Inter-VLAN

PC VLAN 10 → PC VLAN 20 :

1. PC → passerelle 192.168.10.254
2. Switch (access) → Switch (trunk)
3. Routeur Gi0/0.10 reçoit
4. Routeur route vers Gi0/0.20
5. Switch (trunk) → Switch (access)
6. PC VLAN 20 reçoit

---

## Switch Layer 3 (Alternative)

```cisco
# Activer routage
Switch(config)# ip routing

# VLANs
Switch(config)# vlan 10
Switch(config-vlan)# exit

# SVI (Switch Virtual Interface)
Switch(config)# interface vlan 10
Switch(config-if)# ip address 192.168.10.254 255.255.255.0
Switch(config-if)# no shutdown
Switch(config-if)# exit

Switch(config)# interface vlan 20
Switch(config-if)# ip address 192.168.20.254 255.255.255.0
Switch(config-if)# no shutdown
```

>[!tip]
>**Switch L3** plus performant que Router on a Stick.

---

## Sécurisation

### Changer VLAN natif

```cisco
# Éviter VLAN 1 (sécurité)
Switch(config)# interface fastEthernet 0/24
Switch(config-if)# switchport trunk native vlan 99
```

### Désactiver DTP

```cisco
Switch(config)# interface fastEthernet 0/24
Switch(config-if)# switchport nonegotiate
```

### Désactiver ports inutilisés

```cisco
Switch(config)# interface range fastEthernet 0/10-23
Switch(config-if-range)# shutdown
Switch(config-if-range)# switchport access vlan 999  # VLAN parking
```

---

## Dépannage

### Commandes

```cisco
# État des ports
Switch# show interfaces status

# VLANs actifs
Switch# show vlan brief

# Trunks
Switch# show interfaces trunk

# Debug (ATTENTION!)
Switch# debug dot1q
```

---

### Problèmes courants

| Problème | Solution |
|----------|----------|
| Port access KO | Vérifier `switchport mode access` et VLAN existe |
| Trunk ne passe pas | Vérifier `switchport trunk allowed vlan` |
| Pas de comm inter-VLAN | Vérifier routeur/sous-interfaces |
| Interface down | `no shutdown` sur interface physique |

---

## Connexions

### Concepts
- [[VLAN - Virtual LAN]]
- [[Mode access vs trunk]]
- [[802.1Q tagging]]
- [[Router on a stick]]

### Configuration Linux équivalente
- [[MOC - Configuration VLAN Linux]]

### Voir aussi
- Canvas : ![[TP1.canvas]]

---

**Sources** : Fiche VLANs, [[Formation Réseau - Jour 2]]
