---
type: permanent
created: 2025-11-15 00:00
tags:
  - permanent
  - réseau
  - dhcp
  - relay
---

# DHCP Relay Agent

> [!abstract] Concept
> Un DHCP Relay Agent est un service réseau qui transmet les requêtes DHCP entre des clients et un serveur DHCP situés sur des segments réseau différents.

## Explication

Lorsqu'un client DHCP envoie une requête DISCOVER en broadcast, celle-ci ne traverse pas les routeurs par défaut (les broadcasts sont limités au réseau local). Le DHCP Relay Agent résout ce problème en interceptant ces requêtes broadcast, les convertit en messages unicast, et les transmet au serveur DHCP distant. Il agit comme intermédiaire entre le client et le serveur.

Le relay agent ajoute l'information du sous-réseau d'origine (via le champ `giaddr` - Gateway IP Address) pour que le serveur DHCP sache quelle plage d'adresses attribuer. Ainsi, un seul serveur DHCP peut gérer plusieurs sous-réseaux via des relay agents positionnés sur chaque segment.

## Exemples

### Configuration schématique typique

```
┌─────────────────────┐              ┌──────────────────────┐              ┌─────────────────────┐
│  Réseau A           │              │   Routeur/Relay      │              │  Réseau B           │
│  192.168.1.0/24     │              │                      │              │  192.168.2.0/24     │
├─────────────────────┤              ├──────────────────────┤              ├─────────────────────┤
│                     │              │                      │              │                     │
│ Client DHCP         │◄────────────►│  eth0: 192.168.1.1   │◄────────────►│ Serveur DHCP        │
│ (sans IP)           │  BROADCAST   │  eth1: 192.168.2.1   │   UNICAST    │ 192.168.2.10        │
│                     │              │                      │              │                     │
│                     │              │  Relay Agent actif   │              │ Pools configurés:   │
│                     │              │  sur eth0            │              │ - 192.168.1.0/24    │
│                     │              │                      │              │ - 192.168.2.0/24    │
└─────────────────────┘              └──────────────────────┘              └─────────────────────┘
```

### Flux de communication détaillé

```
Étape 1 - DHCP DISCOVER (Client → Relay)
┌─────────────┐
│ Client      │  Broadcast: 255.255.255.255
│ 0.0.0.0     │  "Je cherche un serveur DHCP"
└──────┬──────┘
       │ BROADCAST
       ▼
┌─────────────┐
│ Relay Agent │  Reçoit sur eth0
│ 192.168.1.1 │
└─────────────┘

Étape 2 - RELAY FORWARD (Relay → Serveur)
┌─────────────┐
│ Relay Agent │  Convertit en UNICAST
│ 192.168.1.1 │  Ajoute giaddr=192.168.1.1
└──────┬──────┘  "Client sur mon réseau 192.168.1.0/24"
       │ UNICAST
       ▼
┌─────────────┐
│ Serveur DHCP│  Reçoit la requête
│ 192.168.2.10│  Consulte le pool 192.168.1.0/24
└─────────────┘

Étape 3 - DHCP OFFER (Serveur → Relay)
┌─────────────┐
│ Serveur DHCP│  Unicast vers giaddr
│ 192.168.2.10│  "Propose 192.168.1.100"
└──────┬──────┘
       │ UNICAST
       ▼
┌─────────────┐
│ Relay Agent │  Reçoit l'OFFER
│ 192.168.1.1 │
└─────────────┘

Étape 4 - RELAY REPLY (Relay → Client)
┌─────────────┐
│ Relay Agent │  Transmet au client
│ 192.168.1.1 │  (broadcast ou unicast)
└──────┬──────┘
       │ BROADCAST/UNICAST
       ▼
┌─────────────┐
│ Client      │  Reçoit 192.168.1.100
│ 0.0.0.0     │
└─────────────┘
```

### Architecture multi-VLAN avec relay centralisé

```
                                    ┌──────────────────────┐
                                    │  Serveur DHCP        │
                                    │  10.0.0.5            │
                                    │                      │
                                    │  Pools:              │
                                    │  - VLAN 10           │
                                    │  - VLAN 20           │
                                    │  - VLAN 30           │
                                    └──────────┬───────────┘
                                               │
                                               │ UNICAST
                                               │
                              ┌────────────────┴────────────────┐
                              │  Routeur/Switch L3              │
                              │                                 │
                              │  Relay configuré sur:           │
                              │  - VLAN 10 (192.168.10.254)     │
                              │  - VLAN 20 (192.168.20.254)     │
                              │  - VLAN 30 (192.168.30.254)     │
                              └┬────────────┬──────────────┬───┘
                               │            │              │
                  BROADCAST    │            │              │    BROADCAST
                               │            │              │
                    ┌──────────▼──┐  ┌─────▼──────┐  ┌───▼─────────┐
                    │ VLAN 10     │  │ VLAN 20    │  │ VLAN 30     │
                    │ 192.168.10  │  │ 192.168.20 │  │ 192.168.30  │
                    │             │  │            │  │             │
                    │ Clients     │  │ Clients    │  │ Clients     │
                    └─────────────┘  └────────────┘  └─────────────┘
```

### Détail des champs modifiés par le relay

**Paquet DHCP DISCOVER original (client)** :
```
Source IP: 0.0.0.0
Dest IP: 255.255.255.255 (broadcast)
giaddr: 0.0.0.0
```

**Paquet relayé (relay → serveur)** :
```
Source IP: 192.168.1.1 (relay)
Dest IP: 192.168.2.10 (serveur)
giaddr: 192.168.1.1 ← AJOUTÉ PAR LE RELAY
```

Le serveur utilise `giaddr` pour savoir :
- Quel pool d'adresses utiliser (192.168.1.0/24)
- Où renvoyer la réponse (vers le relay à 192.168.1.1)

### Comparaison Relay vs Serveur Local

| Critère | Relay Agent | Serveur DHCP Local |
|---------|-------------|-------------------|
| **Architecture** | Serveur centralisé | Serveur sur chaque réseau |
| **Gestion** | Centralisée | Décentralisée |
| **Maintenance** | Simple | Complexe |
| **Failover** | Point unique de défaillance | Redondant |
| **Trafic réseau** | Traversée WAN possible | Local uniquement |
| **Cas d'usage** | Entreprise, multi-sites | PME, réseaux isolés |

## Connexions

### Notes liées
- [[DHCP - Dynamic Host Configuration]] - Protocole parent et processus DORA
- [[DHCP Cisco - Relay Agent]] - Implémentation Cisco (ip helper-address)
- [[DHCP Linux - DHCP Relay]] - Implémentation Linux (isc-dhcp-relay)
- [[VLAN - Virtual LAN]] - Cas d'usage typique avec VLANs
- [[ROUTAGE - statique]] - Routage nécessaire entre segments

### Contexte

Le DHCP Relay Agent est essentiel dans les architectures réseau modernes avec plusieurs VLANs ou sous-réseaux. Il permet de centraliser la gestion DHCP sur un seul serveur (Windows Server, Linux, appliance) plutôt que de déployer un serveur par segment réseau. Cela simplifie l'administration, la maintenance, le monitoring et assure une cohérence de configuration. C'est une configuration standard dans les environnements d'entreprise et les infrastructures segmentées.

## Sources
- RFC 1542 - Clarifications and Extensions for the Bootstrap Protocol
- RFC 2131 - Dynamic Host Configuration Protocol

---
**Tags thématiques** : #dhcp #relay #agent-relais #infrastructure-réseau #broadcast #unicast #giaddr
