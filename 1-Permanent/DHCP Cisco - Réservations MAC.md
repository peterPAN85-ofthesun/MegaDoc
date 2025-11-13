---
type: permanent
created: 2025-01-08 15:32
tags:
  - permanent
  - réseau
  - dhcp
  - cisco
  - réservation
---

# DHCP Cisco - Réservations MAC

> [!abstract] Concept
> Attribution d'une IP fixe à un équipement basée sur son adresse MAC via DHCP

## Explication

Les réservations DHCP permettent d'attribuer **toujours la même IP** à un équipement spécifique (serveur, imprimante, caméra) tout en gardant la gestion centralisée DHCP.

Deux méthodes sur Cisco :
- **`client-identifier`** : Utilise le préfixe `01` + MAC (méthode standard)
- **`hardware-address`** : Spécifie directement la MAC (méthode Cisco)

Format MAC Cisco : `aabb.ccdd.eeff` (blocs de 4 caractères hexadécimaux)

## Exemples

### Méthode 1 : Client-identifier

```
Router(config)# ip dhcp pool SERVEUR_WEB
Router(dhcp-config)# host 192.168.1.10 255.255.255.0
Router(dhcp-config)# client-identifier 01aa.bbcc.ddee.ff
Router(dhcp-config)# default-router 192.168.1.254
Router(dhcp-config)# dns-server 8.8.8.8
```

**Format** : `01` + adresse MAC en notation Cisco

### Méthode 2 : Hardware-address (recommandée)

```
Router(config)# ip dhcp pool IMPRIMANTE
Router(dhcp-config)# host 192.168.1.20 255.255.255.0
Router(dhcp-config)# hardware-address aabb.ccdd.eeff
Router(dhcp-config)# default-router 192.168.1.254
```

**Plus simple** : pas de préfixe `01` nécessaire

### Exemple complet : Serveur DNS + Imprimante

```
# Serveur DNS/AD - IP fixe 192.168.10.1
Router(config)# ip dhcp pool DNS_SERVER
Router(dhcp-config)# host 192.168.10.1 255.255.255.0
Router(dhcp-config)# hardware-address 0011.2233.4455
Router(dhcp-config)# default-router 192.168.10.254
Router(dhcp-config)# exit

# Imprimante réseau - IP fixe 192.168.20.10
Router(config)# ip dhcp pool PRINTER
Router(dhcp-config)# host 192.168.20.10 255.255.255.0
Router(dhcp-config)# hardware-address aabb.ccdd.eeff
Router(dhcp-config)# default-router 192.168.20.254
```

### Vérification

```
Router# show ip dhcp binding
```

Les réservations apparaissent comme **Manual** (vs Automatic pour les baux normaux).

## Connexions

### Notes liées
- [[DHCP - Dynamic Host Configuration]] - Principe DHCP
- [[DHCP Cisco - Configuration de base]] - Pool DHCP standard
- [[DHCP Cisco - Vérification et dépannage]] - Vérifier les attributions
- [[ARP - Address Resolution Protocol]] - Lien MAC ↔ IP

### Contexte
Essentiel pour les équipements d'infrastructure (serveurs, imprimantes, caméras) qui nécessitent une IP stable mais bénéficient de la gestion centralisée DHCP (vs IP statique configurée localement).

## Sources
- Formation Réseau - DHCP Cisco
- Cisco IOS DHCP Manual Bindings

---
**Tags thématiques** : #dhcp #réservation #mac-address #ip-fixe
