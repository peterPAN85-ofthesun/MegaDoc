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

<svg viewBox="0 0 440 215" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="DHCP Relay Agent entre deux sous-réseaux">
<defs><marker id="drA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="drB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#27ae60"/></marker>
<marker id="drX" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#e05252"/></marker></defs>
<rect x="16" y="60" width="110" height="76" rx="8" fill="#4c9aff" fill-opacity="0.06" stroke="#4c9aff" stroke-width="1.2" stroke-dasharray="4 3"/>
<text x="24" y="78" font-size="10.5" fill="#4c9aff">Réseau A — 192.168.1.0/24</text>
<rect x="30" y="90" width="80" height="30" rx="4" fill="none" stroke="#4c9aff" stroke-width="1.4"/>
<text x="46" y="110" font-size="11" fill="#4c9aff">Client</text>
<rect x="168" y="70" width="104" height="58" rx="6" fill="none" stroke="currentColor" stroke-width="1.8"/>
<text x="180" y="92" font-size="11.5" fill="currentColor">ROUTEUR</text>
<text x="176" y="108" font-size="11" fill="#f2994a">Relay Agent</text>
<text x="180" y="122" font-size="9.5" fill="#f2994a">ajoute giaddr</text>
<rect x="314" y="60" width="110" height="76" rx="8" fill="#27ae60" fill-opacity="0.06" stroke="#27ae60" stroke-width="1.2" stroke-dasharray="4 3"/>
<text x="322" y="78" font-size="10.5" fill="#27ae60">Réseau B — 192.168.2.0/24</text>
<rect x="330" y="90" width="86" height="30" rx="4" fill="none" stroke="#27ae60" stroke-width="1.4"/>
<text x="340" y="110" font-size="11" fill="#27ae60">Serveur DHCP</text>
<line x1="110" y1="96" x2="166" y2="88" stroke="#4c9aff" stroke-width="1.8" marker-end="url(#drA)"/>
<text x="106" y="76" font-size="9.5" fill="#4c9aff">DISCOVER (broadcast)</text>
<line x1="272" y1="88" x2="328" y2="96" stroke="#27ae60" stroke-width="1.8" marker-end="url(#drB)"/>
<text x="278" y="76" font-size="9.5" fill="#27ae60">unicast + giaddr</text>
<line x1="328" y1="118" x2="274" y2="118" stroke="#27ae60" stroke-width="1.4" stroke-dasharray="4 3" marker-end="url(#drB)"/>
<line x1="166" y1="118" x2="112" y2="118" stroke="#4c9aff" stroke-width="1.4" stroke-dasharray="4 3" marker-end="url(#drA)"/>
<path d="M 140 160 L 300 160" stroke="#e05252" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#drX)"/>
<line x1="212" y1="150" x2="228" y2="170" stroke="#e05252" stroke-width="2"/>
<line x1="228" y1="150" x2="212" y2="170" stroke="#e05252" stroke-width="2"/>
<text x="112" y="182" font-size="10.5" fill="#e05252">un broadcast ne franchit jamais un routeur : d'où le relais</text>
<text x="16" y="22" font-size="12" fill="currentColor">un seul serveur DHCP pour N sous-réseaux, grâce au relais</text>
<text x="16" y="206" font-size="11" fill="currentColor" opacity="0.8">le champ giaddr indique au serveur depuis quel sous-réseau vient la demande</text>
</svg>

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
