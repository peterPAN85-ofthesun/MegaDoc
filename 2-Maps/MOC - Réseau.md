---
type: moc
created: 2025-01-08 18:00
tags:
  - moc
  - réseau
  - index
---

# MOC - Réseau

> [!note] Vue d'ensemble
> Carte de contenu complète sur le réseau informatique, couvrant les protocoles, configurations Cisco et Linux, et architectures de la couche 2 (liaison) à la couche 3 (réseau).

---

## 1. Protocoles fondamentaux

### Couche 2 (Liaison de données)
- [[ARP - Address Resolution Protocol]] - Résolution IP → MAC

### Couche 3 (Réseau)
- [[ICMP - Internet Control Message Protocol]] - Ping, traceroute, diagnostics
- [[TTL - Time To Live]] - Durée de vie des paquets, détection boucles
- [[IGMP - Internet Group Management Protocol]] - Gestion multicast
- [[RFC 1918 - adressage IP privé]] - Plages privées (10.x, 172.16.x, 192.168.x)

### Services applicatifs
- [[DNS - Domain Name System]] - Résolution de noms de domaine

---

## 2. DHCP (Dynamic Host Configuration Protocol)

### Concepts fondamentaux
- [[DHCP - Dynamic Host Configuration]] - Protocole, processus DORA, fonctionnement

### Configuration Cisco IOS

#### Configuration de base

| Configuration | Description |
|---------------|-------------|
| [[DHCP Cisco - Configuration de base]] | Pool, passerelle, DNS, exclusions |
| [[DHCP Cisco - Réservations MAC]] | IP fixes par MAC |
| [[DHCP Cisco - Multi-VLAN]] | Pools multiples pour plusieurs réseaux |
| [[DHCP Cisco - Relay Agent]] | Relayer vers serveur distant (ip helper-address) |

#### Gestion et dépannage

| Configuration | Description |
|---------------|-------------|
| [[DHCP Cisco - Vérification et dépannage]] | show commands, debug |

### Configuration Linux (isc-dhcp-server)

#### Configuration de base

| Configuration | Description |
|---------------|-------------|
| [[DHCP Linux - Installation et configuration]] | Installation, pools, multi-VLAN |
| [[DHCP Linux - Réservations MAC]] | IP fixes par MAC |
| [[DHCP Linux - DHCP Relay]] | Relayer vers serveur distant (dhcrelay) |

#### Client et gestion

| Configuration | Description |
|---------------|-------------|
| [[DHCP Linux - Client DHCP]] | Configuration client (dhclient, NetworkManager) |
| [[DHCP Linux - Vérification et dépannage]] | Logs, baux actifs, debug |

### Sécurité
- [[DHCP - snooping protection]] - Protection Layer 2 contre serveurs pirates

---

## 3. VLAN (Virtual Local Area Network)

### Concepts fondamentaux
- [[VLAN - Virtual LAN]] - Segmentation réseau Layer 2
- [[802.1Q - tagging VLAN]] - Protocole d'encapsulation VLAN
- [[VLAN - mode access vs trunk]] - Différence entre les modes de port
- [[VLAN - router on a stick]] - Routage inter-VLAN

### Configuration Cisco

#### Switch Layer 2

| Configuration | Description |
|---------------|-------------|
| [[VLAN Cisco - Configuration switch]] | Créer VLANs, ports access |
| [[VLAN Cisco - Port trunk et 802.1Q]] | Transport multi-VLAN |

#### Routage inter-VLAN

| Configuration | Description |
|---------------|-------------|
| [[VLAN Cisco - Router on a stick]] | Routage via sous-interfaces 802.1Q |
| [[VLAN Cisco - Switch Layer 3]] | Routage matériel avec SVI |

#### Sécurité et maintenance

| Configuration | Description |
|---------------|-------------|
| [[VLAN Cisco - Sécurisation]] | VLAN natif, DTP, port security |
| [[VLAN Cisco - Vérification et dépannage]] | show commands, debug |

### Configuration Linux

#### Configuration et routage

| Configuration | Description |
|---------------|-------------|
| [[VLAN Linux - Configuration interfaces]] | Sous-interfaces VLAN (eth0.10, .20) |
| [[VLAN Linux - Routage inter-VLAN]] | IP forwarding, firewall |

---

## 4. NAT (Network Address Translation)

### Concepts fondamentaux
- [[NAT - Network Address Translation]] - Translation d'adresses, types de NAT
- [[PAT - Port Address Translation]] - Partage d'IP publique (overload)
- [[NAT - port forwarding]] - Redirection de ports (DNAT)

### Configuration Cisco IOS

#### Configuration de base

| Configuration | Description |
|---------------|-------------|
| [[NAT Cisco - Configuration interfaces]] | Définir inside/outside |

#### Types de NAT

| Configuration | Description |
|---------------|-------------|
| [[NAT Cisco - NAT statique]] | Translation 1:1 permanente |
| [[NAT Cisco - PAT et NAT Overload]] | Partage d'IP publique (overload) |
| [[NAT Cisco - Port forwarding]] | Redirection ports spécifiques |

#### Gestion et dépannage

| Configuration | Description |
|---------------|-------------|
| [[NAT Cisco - Vérification et dépannage]] | show commands, timeouts, debug |

### Configuration Linux (iptables)

#### Configuration

| Configuration | Description |
|---------------|-------------|
| [[NAT Linux - iptables et NAT]] | SNAT, MASQUERADE, IP forwarding |
| [[NAT Linux - Port forwarding]] | DNAT pour redirection ports |

---

## 5. Routage IP

### Concepts fondamentaux
- [[ROUTAGE - statique]] - Principe du routage, table de routage

### Configuration Cisco IOS

#### Configuration de base

| Configuration | Description |
|---------------|-------------|
| [[Routage Cisco - Configuration de base]] | Routes statiques, next-hop, route par défaut |

#### Techniques avancées

| Configuration | Description |
|---------------|-------------|
| [[Routage Cisco - Routes statiques avancées]] | Floating static, load balancing, routes NULL |
| [[Routage Cisco - Distance administrative]] | Priorité entre sources de routage |

#### Gestion et dépannage

| Configuration | Description |
|---------------|-------------|
| [[Routage Cisco - Vérification et dépannage]] | show commands, ping, traceroute |

---

## Architecture et topologies

### Topologies courantes

#### PME / Petite entreprise
```
Internet
   |
[Routeur - NAT/PAT + DHCP]
   |
[Switch L2 - VLANs]
   |
LAN segmenté (VLAN Admin, Users, Invités)
```

**Composants** :
- Routeur : [[NAT - Network Address Translation]], [[DHCP - Dynamic Host Configuration]]
- Switch : [[VLAN - Virtual LAN]], [[VLAN - mode access vs trunk]]

#### Entreprise moyenne avec DMZ
```
Internet
   |
[Routeur WAN - NAT]
   |
   +--- DMZ (serveurs publics - NAT statique)
   |
[Switch L3 - Routage inter-VLAN]
   |
LAN multi-VLAN (Admin, Users, VoIP, IoT)
```

**Composants** :
- NAT : [[NAT Cisco - NAT statique]] pour DMZ, [[NAT Cisco - PAT et NAT Overload]] pour LAN
- Switch L3 : [[VLAN Cisco - Switch Layer 3]]
- DHCP multi-VLAN : [[DHCP Cisco - Multi-VLAN]]

#### Router on a stick
```
[Switch L2 avec VLANs]
        |
    (trunk)
        |
[Routeur avec sous-interfaces 802.1Q]
```

**Configuration** :
- Switch : [[VLAN Cisco - Port trunk et 802.1Q]]
- Routeur : [[VLAN Cisco - Router on a stick]]

---

## Comparaison des implémentations

### Cisco vs Linux

| Fonction | Cisco IOS | Linux |
|----------|-----------|-------|
| **DHCP Server** | `ip dhcp pool` | isc-dhcp-server |
| **DHCP Relay** | `ip helper-address` | dhcrelay |
| **VLAN** | Natif (switch) | 802.1Q kernel module |
| **NAT** | `ip nat inside/outside` | iptables -t nat |
| **Routage** | `ip route` | `ip route` |
| **Performance** | Matériel (ASIC) | Logiciel (CPU) |
| **Coût** | Élevé (licences) | Gratuit (open-source) |
| **Scalabilité** | Excellente | Bonne |
| **Flexibilité** | Limitée | Très élevée |

### Types de NAT

| Type | IP publiques | Connexions | Utilisation | Notes |
|------|--------------|------------|-------------|-------|
| **NAT statique** | 1 par serveur | ∞ | Serveurs publics | [[NAT Cisco - NAT statique]] |
| **PAT/Overload** | 1 partagée | ~65000 | PME, particuliers | [[NAT Cisco - PAT et NAT Overload]] |
| **Port forwarding** | 1 partagée | Par port | Services spécifiques | [[NAT - port forwarding]] |

### Routage inter-VLAN

| Méthode | Équipement | Performance | Coût | Notes |
|---------|------------|-------------|------|-------|
| **Router on a stick** | Routeur + Switch L2 | Moyenne | Économique | [[VLAN - router on a stick]] |
| **Switch Layer 3** | Switch L3 | Élevée | Moyen/Élevé | [[VLAN Cisco - Switch Layer 3]] |
| **Serveur Linux** | Serveur + Switch L2 | Variable | Économique | [[VLAN Linux - Routage inter-VLAN]] |

---

## Progression d'apprentissage recommandée

### Niveau 1 - Fondamentaux
1. [[RFC 1918 - adressage IP privé]] - Plages IP privées
2. [[ARP - Address Resolution Protocol]] - Résolution IP/MAC
3. [[ICMP - Internet Control Message Protocol]] - Ping et diagnostics
4. [[DNS - Domain Name System]] - Résolution de noms
5. [[TTL - Time To Live]] - Durée de vie des paquets

### Niveau 2 - Services de base
1. [[DHCP - Dynamic Host Configuration]] - Concept général
2. [[DHCP Cisco - Configuration de base]] - Serveur DHCP Cisco
3. [[DHCP Linux - Installation et configuration]] - Serveur DHCP Linux

### Niveau 3 - Segmentation (VLAN)
1. [[VLAN - Virtual LAN]] - Concept général
2. [[802.1Q - tagging VLAN]] - Protocole d'encapsulation
3. [[VLAN - mode access vs trunk]] - Modes de port
4. [[VLAN Cisco - Configuration switch]] - Configuration pratique
5. [[VLAN Cisco - Port trunk et 802.1Q]] - Trunking

### Niveau 4 - Routage inter-VLAN
1. [[ROUTAGE - statique]] - Principe du routage
2. [[VLAN - router on a stick]] - Routage inter-VLAN économique
3. [[VLAN Cisco - Router on a stick]] - Configuration Cisco
4. [[VLAN Cisco - Switch Layer 3]] - Alternative performante
5. [[Routage Cisco - Configuration de base]] - Routes statiques

### Niveau 5 - Translation d'adresses (NAT)
1. [[NAT - Network Address Translation]] - Concept général
2. [[NAT Cisco - Configuration interfaces]] - Inside/Outside
3. [[NAT Cisco - PAT et NAT Overload]] - Partage d'IP
4. [[NAT Cisco - NAT statique]] - Translation 1:1
5. [[NAT - port forwarding]] - Redirection de ports

### Niveau 6 - Configurations avancées
1. [[DHCP Cisco - Multi-VLAN]] - DHCP pour plusieurs VLANs
2. [[DHCP Cisco - Relay Agent]] - Serveur DHCP centralisé
3. [[Routage Cisco - Routes statiques avancées]] - Floating routes, load balancing
4. [[Routage Cisco - Distance administrative]] - Priorité de routes
5. [[VLAN Cisco - Sécurisation]] - Sécurité VLAN

### Niveau 7 - Sécurité et dépannage
1. [[DHCP - snooping protection]] - Sécurité Layer 2
2. [[VLAN Cisco - Vérification et dépannage]] - Debug VLAN
3. [[NAT Cisco - Vérification et dépannage]] - Debug NAT
4. [[Routage Cisco - Vérification et dépannage]] - Debug routage

---

## Ressources externes

### Standards et RFCs
- RFC 791 - Internet Protocol (IP)
- RFC 1918 - Address Allocation for Private Internets
- RFC 2131 - Dynamic Host Configuration Protocol
- RFC 3022 - Traditional IP Network Address Translator
- IEEE 802.1Q - Virtual LANs

### Documentation
- Cisco IOS Configuration Guides
- Linux Network Administrator's Guide
- ISC DHCP Documentation
- iptables/nftables Documentation

### Outils de diagnostic et simulation
- **Wireshark** - Analyse de paquets réseau
- **Packet Tracer** - Simulation réseau Cisco
- **GNS3 / EVE-NG** - Émulation réseau avancée
- **tcpdump** - Capture de paquets en ligne de commande
- **ping/traceroute** - Diagnostics de base

---

## Index par plateforme

### Toutes les notes Cisco
**DHCP** : [[DHCP Cisco - Configuration de base]] · [[DHCP Cisco - Réservations MAC]] · [[DHCP Cisco - Multi-VLAN]] · [[DHCP Cisco - Relay Agent]] · [[DHCP Cisco - Vérification et dépannage]]

**VLAN** : [[VLAN Cisco - Configuration switch]] · [[VLAN Cisco - Port trunk et 802.1Q]] · [[VLAN Cisco - Router on a stick]] · [[VLAN Cisco - Switch Layer 3]] · [[VLAN Cisco - Sécurisation]] · [[VLAN Cisco - Vérification et dépannage]]

**NAT** : [[NAT Cisco - Configuration interfaces]] · [[NAT Cisco - NAT statique]] · [[NAT Cisco - PAT et NAT Overload]] · [[NAT Cisco - Port forwarding]] · [[NAT Cisco - Vérification et dépannage]]

**Routage** : [[Routage Cisco - Configuration de base]] · [[Routage Cisco - Routes statiques avancées]] · [[Routage Cisco - Distance administrative]] · [[Routage Cisco - Vérification et dépannage]]

### Toutes les notes Linux
**DHCP** : [[DHCP Linux - Installation et configuration]] · [[DHCP Linux - Réservations MAC]] · [[DHCP Linux - DHCP Relay]] · [[DHCP Linux - Client DHCP]] · [[DHCP Linux - Vérification et dépannage]]

**VLAN** : [[VLAN Linux - Configuration interfaces]] · [[VLAN Linux - Routage inter-VLAN]]

**NAT** : [[NAT Linux - iptables et NAT]] · [[NAT Linux - Port forwarding]]

---

**Dernière mise à jour** : 2025-01-08

**Note** : Ce MOC remplace les anciens MOCs spécialisés (MOC - DHCP, MOC - VLAN, MOC - NAT, MOC - Routage) pour centraliser toute la documentation réseau en un seul endroit.
