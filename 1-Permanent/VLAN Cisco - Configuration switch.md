---
type: permanent
created: 2025-01-08 15:45
tags:
  - permanent
  - réseau
  - vlan
  - cisco
  - switch
---

# VLAN Cisco - Configuration switch

> [!abstract] Concept
> Créer des VLANs sur switch Cisco et affecter les ports en mode access (un seul VLAN par port)

## Explication

La configuration VLAN sur switch Layer 2 nécessite :
1. **Créer les VLANs** avec ID et nom descriptif
2. **Affecter les ports en mode access** à un VLAN spécifique
3. **Vérifier** l'affectation des ports et VLANs actifs

**Mode access** : le port appartient à **un seul VLAN**, utilisé pour connecter équipements finaux (PC, imprimantes, serveurs).

## Exemples

### Créer les VLANs

```cisco
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

### Affecter un port en mode access

```cisco
# Port Fa0/1 → VLAN 10
Switch(config)# interface fastEthernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
Switch(config-if)# exit

# Port Fa0/2 → VLAN 20
Switch(config)# interface fastEthernet 0/2
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 20
Switch(config-if)# exit
```

### Affecter plusieurs ports simultanément

```cisco
Switch(config)# interface range fastEthernet 0/5-10
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 20
Switch(config-if-range)# exit
```

### Vérification

```cisco
# Voir tous les VLANs et ports associés
Switch# show vlan brief

# VLAN spécifique
Switch# show vlan id 10

# État des ports
Switch# show interfaces status

# Table MAC par VLAN
Switch# show mac address-table vlan 10
```

### Supprimer un VLAN

```cisco
Switch(config)# no vlan 30
```

**Attention** : les ports du VLAN supprimé deviennent inactifs jusqu'à réaffectation.

## Connexions

### Notes liées
- [[VLAN - Virtual LAN]] - Concept de segmentation Layer 2
- [[VLAN - mode access vs trunk]] - Différence entre les deux modes
- [[VLAN Cisco - Port trunk et 802.1Q]] - Transport multi-VLAN
- [[802.1Q - tagging VLAN]] - Protocole d'encapsulation

### Contexte
Configuration de base pour segmenter un réseau d'entreprise. Les VLANs isolent les domaines de broadcast et améliorent la sécurité. À combiner avec le mode trunk pour interconnecter les switches.

## Sources
- Formation Réseau - Configuration VLANs Cisco
- Cisco VLAN Configuration Guide

---
**Tags thématiques** : #vlan #switch #access-mode #layer2
