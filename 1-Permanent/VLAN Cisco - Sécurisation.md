---
type: permanent
created: 2025-01-08 15:53
tags:
  - permanent
  - réseau
  - vlan
  - cisco
  - sécurité
---

# VLAN Cisco - Sécurisation

> [!abstract] Concept
> Bonnes pratiques de sécurité pour les VLANs : VLAN natif, DTP, port security, ports inutilisés

## Explication

Les VLANs mal configurés exposent à plusieurs attaques :
- **VLAN hopping** : accéder à un VLAN non autorisé via double tagging
- **DTP exploitation** : forcer un port en mode trunk
- **MAC flooding** : saturer la table MAC du switch

**Mesures de sécurité** :
1. Changer le VLAN natif (éviter VLAN 1)
2. Désactiver DTP (Dynamic Trunking Protocol)
3. Désactiver les ports inutilisés
4. Mettre les ports inutilisés dans un VLAN parking

## Exemples

### Changer le VLAN natif sur trunk

```cisco
Switch(config)# interface fastEthernet 0/24
Switch(config-if)# switchport trunk native vlan 99
Switch(config-if)# exit
```

**Raison** : VLAN 1 est utilisé par défaut pour le trafic de management (CDP, VTP, DTP). Le changer limite les attaques de type VLAN hopping.

**VLAN natif** : VLAN dont les trames transitent **sans tag** sur le trunk.

### Désactiver DTP

```cisco
Switch(config)# interface fastEthernet 0/24
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport nonegotiate
Switch(config-if)# exit
```

**DTP** : protocole Cisco qui négocie automatiquement le mode trunk. **Risque** : attaquant peut forcer un port en trunk pour accéder à tous les VLANs.

### Désactiver les ports inutilisés

```cisco
Switch(config)# interface range fastEthernet 0/10-23
Switch(config-if-range)# shutdown
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 999  # VLAN parking
Switch(config-if-range)# exit
```

**VLAN parking** : VLAN inutilisé (ex: 999) pour isoler les ports désactivés.

### Limiter les VLANs sur trunk

```cisco
# Autoriser uniquement VLANs 10,20,30
Switch(config-if)# switchport trunk allowed vlan 10,20,30
```

**Ne jamais utiliser** `allowed vlan all` en production.

### Port Security (protection MAC spoofing)

```cisco
Switch(config)# interface fastEthernet 0/5
Switch(config-if)# switchport mode access
Switch(config-if)# switchport port-security
Switch(config-if)# switchport port-security maximum 2
Switch(config-if)# switchport port-security violation restrict
Switch(config-if)# switchport port-security mac-address sticky
Switch(config-if)# exit
```

**Actions** :
- `maximum 2` : max 2 adresses MAC autorisées
- `violation restrict` : bloque le trafic non autorisé + log
- `mac-address sticky` : apprend les MAC automatiquement

### Désactiver VLAN 1 (management)

```cisco
# Créer VLAN dédié au management
Switch(config)# vlan 100
Switch(config-vlan)# name MANAGEMENT
Switch(config-vlan)# exit

# Interface VLAN pour management
Switch(config)# interface vlan 100
Switch(config-if)# ip address 10.0.0.10 255.255.255.0
Switch(config-if)# no shutdown

# Ne plus utiliser VLAN 1
Switch(config)# no interface vlan 1
```

### Vérification sécurité

```cisco
# Voir port security
Switch# show port-security interface fastEthernet 0/5

# Voir trunk et VLAN natif
Switch# show interfaces trunk

# Voir DTP
Switch# show dtp interface fastEthernet 0/24
```

## Connexions

### Notes liées
- [[VLAN Cisco - Port trunk et 802.1Q]] - Configuration trunk
- [[802.1Q - tagging VLAN]] - VLAN natif et double tagging
- [[VLAN - Virtual LAN]] - Concept de segmentation
- [[DHCP - snooping protection]] - Sécurité Layer 2 complémentaire

### Contexte
La sécurisation des VLANs est critique en entreprise. Un switch mal configuré permet à un attaquant d'accéder aux VLANs sensibles (administration, serveurs). Ces mesures font partie du "hardening" de l'infrastructure réseau.

## Sources
- Formation Réseau - Sécurité VLAN
- Cisco VLAN Security Best Practices

---
**Tags thématiques** : #sécurité #vlan-hopping #dtp #port-security #hardening
