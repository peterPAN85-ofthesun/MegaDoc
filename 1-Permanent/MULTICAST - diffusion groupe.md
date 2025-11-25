---
type: permanent
created: 2025-01-08 19:50
tags:
  - permanent
  - réseau
  - multicast
  - streaming
---

# Multicast

> [!abstract] Concept
> Le multicast permet d'envoyer un flux de données d'une source vers plusieurs destinataires simultanément, en n'utilisant qu'un seul flux sur le réseau.

## Explication

Le **multicast** est un mode de transmission réseau optimisé pour la distribution **un vers plusieurs** (one-to-many).

**Comparaison** :
```
Unicast (1:1)     : PC1 → PC2 (1 flux)
Broadcast (1:All) : PC1 → Tous (1 flux, reçu par tous)
Multicast (1:N)   : PC1 → Groupe abonnés (1 flux, reçu par abonnés uniquement)
```

## Adresses multicast

**Plage IPv4** : `224.0.0.0` à `239.255.255.255` (classe D)

### Groupes réservés
- `224.0.0.0/24` : Réservé (local link)
  - `224.0.0.1` : Tous les hôtes
  - `224.0.0.2` : Tous les routeurs
  - `224.0.0.5` : OSPF
  - `224.0.0.6` : OSPF DR
  - `224.0.0.9` : RIPv2
  - `224.0.0.13` : PIM
  - `224.0.0.22` : IGMP

- `224.0.1.0/24` : Réservé (global)

- `239.0.0.0/8` : Organisation-local scope (privé)

- `232.0.0.0/8` : SSM (Source-Specific Multicast)

### Groupes publics
Assignés par IANA pour applications :
- `224.0.1.1` : NTP (Network Time Protocol)
- `224.0.0.251` : mDNS (Multicast DNS)

## Fonctionnement

### Abonnement au groupe
1. Client veut recevoir flux multicast `239.1.1.1`
2. Client envoie **IGMP Join** au routeur local
3. Routeur local envoie **PIM Join** vers source
4. Flux multicast route vers client

### Désabonnement
1. Client envoie **IGMP Leave**
2. Si plus d'abonnés, routeur envoie **PIM Prune**
3. Flux s'arrête sur cette branche

## Adresse MAC multicast

Mapping IP multicast → MAC multicast :
```
IP  : 239.1.1.1
MAC : 01:00:5E:01:01:01
```

**Formule** : `01:00:5E` + 23 bits bas de l'IP multicast

⚠️ **Collision possible** : 32 adresses IP peuvent mapper vers même MAC.

## Cas d'usage

### IPTV / Streaming vidéo
```
[Serveur vidéo] → Multicast 239.10.10.1 → [N abonnés]
```
- 1 flux vidéo 10 Mbps
- 1000 clients = **10 Mbps** (au lieu de 10 Gbps en unicast)

### Broadcast IP professionnel (SMPTE 2110)
**Contexte** : Production audiovisuelle (studios TV, régies)
```
[Caméra SDI] → [Gateway] → Multicast 239.1.1.1 → [Mélangeurs, Enregistreurs, Moniteurs]
```

**Caractéristiques** :
- Flux vidéo HD non compressé : **~1 Gbps par flux**
- Séparation des essences : vidéo, audio (16 canaux), métadonnées
- Transport RTP sur UDP
- Redondance réseau rouge/bleu (SMPTE 2022-7)
- Synchronisation PTP (nanoseconde)

**Avantages du multicast pour le broadcast** :
- Une caméra diffuse vers 10+ équipements (mélangeurs, enregistreurs)
- Sans multicast : 10 Gbps (1 Gbps × 10 destinations)
- Avec multicast : **1 Gbps** total

**Exigence critique** : IGMP snooping obligatoire (éviter saturation réseau)

### Visioconférence
- 1 personne parle → tous reçoivent
- Économie bande passante

### Cotations boursières
- Serveur envoie cours en temps réel
- Milliers de traders reçoivent simultanément

### Mise à jour logicielles
- Distribution OS/firmware vers N équipements
- Économie bande passante WAN

### Protocoles utilisant multicast
- **OSPF** : 224.0.0.5 (communication voisins)
- **EIGRP** : 224.0.0.10
- **VRRP** : 224.0.0.18
- **mDNS** : 224.0.0.251 (Bonjour, Avahi)

## Protocoles multicast

### IGMP (Internet Group Management Protocol)
Communication hôte ↔ routeur local :
- **IGMPv2** : Join, Leave, Query
- **IGMPv3** : Source filtering (SSM)

### PIM (Protocol Independent Multicast)
Routage multicast entre routeurs :
- **PIM-SM** : Sparse Mode (le plus utilisé)
- **PIM-DM** : Dense Mode
- **PIM-SSM** : Source-Specific Multicast

## Avantages / Inconvénients

✅ **Économie bande passante** : 1 flux pour N destinataires
✅ **Scalabilité** : Supporte des milliers de clients
✅ **Efficacité** : Flux ne circule que là où nécessaire
✅ **Temps réel** : Tous reçoivent simultanément

❌ **Complexité** : Configuration réseau avancée
❌ **Support limité** : Pas tous les équipements/ISP
❌ **Fiabilité** : UDP (pas de retransmission)
❌ **Sécurité** : Pas d'authentification native

## Configuration Cisco (base)

```cisco
! Activer multicast routing
ip multicast-routing

! Activer PIM sur interfaces
interface GigabitEthernet0/0
 ip pim sparse-mode

! Configurer RP (Rendezvous Point)
ip pim rp-address 10.0.0.1
```

## Vérification

```cisco
show ip igmp groups             ! Groupes multicast souscrits
show ip mroute                  ! Table de routage multicast
show ip pim neighbor            ! Voisins PIM
```

**Exemple** :
```
Interface      Group           Uptime      Expires
Gi0/1          239.1.1.1       00:10:23    00:02:37
```

## Multicast sur Internet

❌ **Multicast inter-domaine limité** :
- La plupart des ISP ne supportent pas
- Complexité de routage BGP multicast (MBGP)
- Rarement déployé publiquement

✅ **Alternatives** :
- **CDN** : Content Delivery Networks (Akamai, Cloudflare)
- **Unicast multiple** : Server-side load balancing
- **P2P** : Peer-to-peer (BitTorrent, WebRTC)

## Multicast vs Broadcast

| Aspect | Broadcast | Multicast |
|--------|-----------|-----------|
| **Destinataires** | Tous | Abonnés uniquement |
| **Scope** | Local subnet | Peut traverser routeurs |
| **Efficacité** | Faible (tous reçoivent) | Élevée (seulement abonnés) |
| **Usage** | ARP, DHCP Discovery | IPTV, streaming |

## IPv6 Multicast

**Plage** : `FF00::/8`

**Groupes réservés** :
- `FF02::1` : Tous les nœuds (link-local)
- `FF02::2` : Tous les routeurs
- `FF02::1:2` : DHCPv6

**Avantage** : Pas de broadcast en IPv6 → tout en multicast

## Connexions

- [[IGMP - Internet Group Management Protocol]] - Abonnement groupes
- [[PIM - Protocol Independent Multicast]] - Routage multicast
- [[MULTICAST Linux - client réception flux]] - Configuration client multicast
- [[MULTICAST Linux - bridge IGMP snooping]] - Linux comme switch L2
- [[MULTICAST Linux - routeur PIM]] - Routeur Linux avec PIM daemon
- [[MULTICAST Cisco - switch IGMP snooping]] - Switch Cisco L2 avec IGMP snooping
- [[MULTICAST Cisco - routeur PIM]] - Routeur Cisco avec PIM Sparse Mode
- [[OSPF - Open Shortest Path First]] - Utilise multicast (224.0.0.5)

---
**Sources** : RFC 1112 (IP Multicast), RFC 3376 (IGMPv3), Cisco Multicast Guide
