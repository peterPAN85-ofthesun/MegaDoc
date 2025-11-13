---
type: permanent
created: 2025-01-08 15:40
tags:
  - permanent
  - réseau
  - dhcp
  - sécurité
  - snooping
  - cisco
---

# DHCP Snooping - Protection contre attaques

> [!abstract] Concept
> Mécanisme de sécurité sur switch qui filtre les messages DHCP pour bloquer les serveurs DHCP pirates

## Explication

**DHCP Snooping** est une fonctionnalité de sécurité Layer 2 qui :
- Filtre les messages DHCP non autorisés
- Construit une table de binding (IP ↔ MAC ↔ Port ↔ VLAN)
- Bloque les **rogue DHCP servers** (serveurs pirates)
- Protège contre les attaques DHCP Starvation et Spoofing

**Principe** :
- Ports **trusted** : autorisés à envoyer des messages DHCP serveur (uplink vers vrai serveur)
- Ports **untrusted** : uniquement messages clients (DISCOVER, REQUEST)

Tout message serveur (OFFER, ACK) venant d'un port untrusted est **bloqué**.

## Exemples

### Configuration DHCP Snooping

```
# Activer DHCP Snooping globalement
Switch(config)# ip dhcp snooping
Switch(config)# ip dhcp snooping vlan 10,20,30

# Port trusted (vers le vrai serveur DHCP)
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# ip dhcp snooping trust
Switch(config-if)# exit

# Ports untrusted (clients) - limite de débit
Switch(config)# interface range FastEthernet0/1-24
Switch(config-if-range)# ip dhcp snooping limit rate 10
Switch(config-if-range)# exit
```

**Limite de débit** : max 10 paquets DHCP/sec (protection contre DHCP Starvation)

### Activer Option 82 (DHCP Relay Information)

```
Switch(config)# ip dhcp snooping information option
```

Option 82 insère des infos sur le switch/port dans la requête DHCP (traçabilité).

### Vérification DHCP Snooping

```
Switch# show ip dhcp snooping
Switch# show ip dhcp snooping binding
```

**Binding table** :
```
MacAddress          IpAddress        Lease(sec)  Type           VLAN  Interface
------------------  ---------------  ----------  -------------  ----  --------------------
00:11:22:33:44:55   192.168.1.100    86400       dhcp-snooping  10    FastEthernet0/5
aa:bb:cc:dd:ee:ff   192.168.1.101    86400       dhcp-snooping  10    FastEthernet0/12
```

### Attaques DHCP courantes

| Attaque | Description | Protection |
|---------|-------------|------------|
| **DHCP Starvation** | Épuisement du pool DHCP (requêtes massives avec fausses MAC) | DHCP Snooping + limite de débit |
| **Rogue DHCP Server** | Serveur DHCP pirate sur le réseau (attaque MitM) | DHCP Snooping (trusted ports) |
| **DHCP Spoofing** | Usurpation de serveur DHCP pour rediriger le trafic | DHCP Snooping + DAI |

### Compléter avec Dynamic ARP Inspection (DAI)

DHCP Snooping fournit la base de données pour **DAI** (Dynamic ARP Inspection) qui valide les paquets ARP.

```
Switch(config)# ip arp inspection vlan 10,20,30
Switch(config)# ip arp inspection validate src-mac dst-mac ip
```

DAI s'appuie sur la binding table DHCP Snooping.

## Connexions

### Notes liées
- [[DHCP - Dynamic Host Configuration]] - Processus DORA
- [[ARP - Address Resolution Protocol]] - Lien avec DAI
- [[VLAN - Virtual LAN]] - Snooping par VLAN
- [[VLAN - mode access vs trunk]] - Configuration ports switch

### Contexte
Sécurité essentielle en entreprise pour empêcher qu'un utilisateur malveillant (ou appareil compromis) ne devienne serveur DHCP et redirige le trafic. Première ligne de défense Layer 2.

## Sources
- Formation Réseau - Sécurité DHCP
- Cisco DHCP Snooping Configuration Guide

---
**Tags thématiques** : #sécurité #dhcp-snooping #switch #attaques #layer2
