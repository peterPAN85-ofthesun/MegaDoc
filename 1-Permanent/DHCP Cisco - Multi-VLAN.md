---
type: permanent
created: 2025-01-08 15:34
tags:
  - permanent
  - réseau
  - dhcp
  - vlan
  - cisco
---

# DHCP Cisco - Multi-VLAN

> [!abstract] Concept
> Configuration de pools DHCP multiples pour servir plusieurs VLANs/réseaux depuis un seul routeur

## Explication

Chaque VLAN nécessite son **propre pool DHCP** avec :
- Réseau et masque spécifiques
- Passerelle dédiée (interface VLAN du routeur)
- Durée de bail adaptée à l'usage
- Plages d'exclusions distinctes

Le routeur agit comme serveur DHCP pour tous les VLANs configurés. Architecture commune : **Router-on-a-stick** ou routeur L3.

## Exemples

### Configuration 3 VLANs (Admin / Users / Guests)

```
# VLAN 10 - Administration (bail 7 jours)
Router(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.50
Router(config)# ip dhcp pool VLAN10
Router(dhcp-config)# network 192.168.10.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.10.254
Router(dhcp-config)# dns-server 192.168.10.1 8.8.8.8
Router(dhcp-config)# lease 7
Router(dhcp-config)# exit

# VLAN 20 - Utilisateurs (bail 1 jour)
Router(config)# ip dhcp excluded-address 192.168.20.1 192.168.20.50
Router(config)# ip dhcp pool VLAN20
Router(dhcp-config)# network 192.168.20.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.20.254
Router(dhcp-config)# dns-server 192.168.10.1 8.8.8.8
Router(dhcp-config)# lease 1
Router(dhcp-config)# exit

# VLAN 30 - Invités WiFi (bail 2 heures)
Router(config)# ip dhcp excluded-address 192.168.30.1 192.168.30.10
Router(config)# ip dhcp pool VLAN30
Router(dhcp-config)# network 192.168.30.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.30.254
Router(dhcp-config)# dns-server 8.8.8.8 1.1.1.1
Router(dhcp-config)# lease 0 2
```

### Bonnes pratiques par type de réseau

| Type VLAN | Durée bail | Plage exclusion | DNS |
|-----------|------------|-----------------|-----|
| Administration | 7 jours | .1-.50 | Interne + Public |
| Utilisateurs | 1-2 jours | .1-.20 | Interne + Public |
| Invités/WiFi | 2-4 heures | .1-.10 | Public uniquement |
| IoT/Caméras | 7 jours | .1-.30 | Interne |

### Vérification par pool

```
Router# show ip dhcp pool VLAN10
Router# show ip dhcp binding
Router# show ip dhcp statistics
```

## Connexions

### Notes liées
- [[VLAN - Virtual LAN]] - Concept de segmentation réseau
- [[VLAN - router on a stick]] - Architecture inter-VLAN
- [[DHCP Cisco - Configuration de base]] - Pool DHCP simple
- [[DHCP Cisco - Relay Agent]] - DHCP sur réseau distant

### Contexte
Architecture standard en entreprise pour segmenter les utilisateurs, invités, administration et IoT. Chaque VLAN a sa politique de sécurité et durée de bail adaptée.

## Sources
- Formation Réseau - Multi-VLAN DHCP
- Cisco IOS Multi-Pool DHCP Configuration

---
**Tags thématiques** : #dhcp #vlan #multi-réseau #segmentation
