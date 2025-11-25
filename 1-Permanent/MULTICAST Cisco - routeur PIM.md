---
type: permanent
created: 2025-11-25 17:20
tags:
  - permanent
  - réseau
  - multicast
  - cisco
  - routeur
  - pim
---

# MULTICAST Cisco - routeur PIM

> [!abstract] Concept
> Configuration d'un routeur Cisco avec PIM (Protocol Independent Multicast) pour router les flux multicast entre sous-réseaux.

## Explication

Un **routeur multicast** forward le trafic multicast entre différents sous-réseaux en utilisant le protocole **PIM** (Protocol Independent Multicast).

**Différence avec switch L2** :
- **Switch L2** : Distribue multicast au sein d'un VLAN (IGMP Snooping)
- **Routeur L3** : Route multicast entre VLANs/sous-réseaux (PIM)

**Mode PIM recommandé** : **Sparse Mode (PIM-SM)** - Suppose que les clients sont dispersés et n'envoie le flux que là où il y a des abonnés.

## Architecture typique

```
   [Source 10.1.1.100]
         |
   [Routeur A] ← PIM-SM
         |
    [Internet]
         |
   [Routeur B] ← PIM-SM (RP)
         |
   [Clients 10.2.1.0/24]
```

**Rendezvous Point (RP)** : Point de rendez-vous où sources et clients se retrouvent dans PIM Sparse Mode.

## Configuration de base

### 1. Activer multicast routing globalement

```cisco
Router(config)# ip multicast-routing
```

Cette commande active le routage multicast sur tout le routeur.

### 2. Activer PIM Sparse Mode sur interfaces

```cisco
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip pim sparse-mode
Router(config-if)# exit

Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip pim sparse-mode
Router(config-if)# exit
```

**Alternative (range)** :
```cisco
Router(config)# interface range GigabitEthernet0/0-1
Router(config-if-range)# ip pim sparse-mode
Router(config-if-range)# exit
```

### 3. Définir le Rendezvous Point (RP) statique

```cisco
Router(config)# ip pim rp-address 10.0.0.1
```

**Explication** : Tous les routeurs PIM du domaine doivent pointer vers le même RP.

## Configuration RP

### RP statique (recommandé pour petits réseaux)

```cisco
! Sur tous les routeurs
Router(config)# ip pim rp-address 10.0.0.1
```

**Avantages** :
- Simple et déterministe
- Pas de dépendance à un protocole supplémentaire

**Inconvénients** :
- Pas de redondance automatique
- Configuration manuelle sur chaque routeur

### RP dynamique : Auto-RP (méthode Cisco propriétaire)

**Sur le routeur RP** :
```cisco
Router(config)# ip pim send-rp-announce Loopback0 scope 10
```

**Sur le Mapping Agent** :
```cisco
Router(config)# ip pim send-rp-discovery Loopback0 scope 10
```

**Scope** : TTL des annonces (nombre de sauts).

### RP dynamique : BSR (Bootstrap Router) - Standard

**Sur le routeur BSR candidat** :
```cisco
Router(config)# ip pim bsr-candidate Loopback0 0
```

**Sur le routeur RP candidat** :
```cisco
Router(config)# ip pim rp-candidate Loopback0
```

**Avantages BSR** :
- Standard (RFC 5059)
- Redondance automatique
- Élection automatique du RP

## Configuration IGMP

### Modifier version IGMP sur interface

```cisco
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip igmp version 3
```

**Versions** :
- **IGMPv2** : Par défaut, supporte Join/Leave
- **IGMPv3** : Support SSM (Source-Specific Multicast)

### Configurer IGMP querier

Si le routeur doit interroger les clients (en l'absence d'autre querier).

```cisco
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip igmp query-interval 30
Router(config-if)# ip igmp query-max-response-time 10
```

**Paramètres** :
- `query-interval` : Intervalle entre queries (secondes)
- `query-max-response-time` : Temps de réponse max clients (secondes)

### Joindre groupe statiquement

Forcer l'interface à rejoindre un groupe (utile pour tests).

```cisco
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip igmp join-group 239.1.1.1
```

## Vérification

### Voir les voisins PIM

```cisco
Router# show ip pim neighbor

PIM Neighbor Table
Interface          Neighbor         Uptime/Expires    Ver   DR
Gi0/0              10.1.1.2         00:15:23/00:01:37 v2    10.1.1.2
Gi0/1              10.2.1.3         00:10:15/00:01:45 v2    10.2.1.1
```

**Colonnes** :
- **Neighbor** : IP du voisin PIM
- **Ver** : Version PIM
- **DR** : Designated Router (élu sur segment multi-accès)

### Voir la table de routage multicast (mroute)

```cisco
Router# show ip mroute

IP Multicast Routing Table
Flags: D - Dense, S - Sparse, B - Bidir Group, s - SSM Group

(*, 239.1.1.1), 00:15:42/00:02:47, RP 10.0.0.1, flags: S
  Incoming interface: GigabitEthernet0/0, RPF nbr 10.0.0.1
  Outgoing interface list:
    GigabitEthernet0/1, Forward/Sparse, 00:15:42/00:02:47

(10.1.1.100, 239.1.1.1), 00:05:12/00:02:47, flags: T
  Incoming interface: GigabitEthernet0/0, RPF nbr 10.1.1.100
  Outgoing interface list:
    GigabitEthernet0/1, Forward/Sparse, 00:05:12/00:02:47
```

**Interprétation** :
- `(*, 239.1.1.1)` : **Shared Tree** - Flux via RP (toutes sources)
- `(10.1.1.100, 239.1.1.1)` : **Source Tree (SPT)** - Flux direct de la source
- `Incoming` : Interface recevant le flux
- `Outgoing` : Interfaces distribuant le flux
- `RPF nbr` : Reverse Path Forwarding neighbor

### Voir les groupes IGMP

```cisco
Router# show ip igmp groups

IGMP Connected Group Membership
Group Address    Interface           Uptime    Expires   Last Reporter
239.1.1.1        GigabitEthernet0/1  00:10:23  00:02:37  10.2.1.50
239.1.1.2        GigabitEthernet0/1  00:05:12  00:02:45  10.2.1.51
```

### Voir l'état du RP

```cisco
Router# show ip pim rp mapping

PIM Group-to-RP Mappings

Group(s): 224.0.0.0/4
  RP: 10.0.0.1 (?)
    Info source: 10.0.0.1 (?), elected via Auto-RP
         Uptime: 01:15:23, expires: 00:02:37
```

### Voir configuration PIM par interface

```cisco
Router# show ip pim interface

Address          Interface                Ver/   Nbr    Query  DR
                                          Mode   Count  Intvl
10.1.1.1         GigabitEthernet0/0       v2/S   1      30     10.1.1.1
10.2.1.1         GigabitEthernet0/1       v2/S   0      30     10.2.1.1
```

**Colonnes** :
- **Ver/Mode** : Version PIM / Mode (S=Sparse, D=Dense)
- **Nbr Count** : Nombre de voisins PIM
- **DR** : Designated Router

### Voir statistiques multicast

```cisco
Router# show ip mroute count

IP Multicast Statistics
3 routes using 2412 bytes of memory
2 groups, 0.50 average sources per group
Forwarding Counts: Pkt Count/Pkts per second/Avg Pkt Size/Kilobits per second
```

## Configuration avancée

### SPT Threshold (basculement Shared → Source Tree)

Par défaut, après le premier paquet, le routeur bascule du **Shared Tree** (via RP) au **Source Tree** (direct).

```cisco
! Toujours utiliser Shared Tree (via RP)
Router(config)# ip pim spt-threshold infinity

! Basculer après X kbps
Router(config)# ip pim spt-threshold 100
```

### SSM (Source-Specific Multicast)

Activer SSM pour la plage 232.0.0.0/8 (RFC 4607).

```cisco
Router(config)# ip pim ssm default
```

**Plage SSM** : 232.0.0.0/8

**Avantage** : Clients s'abonnent à `(Source, Groupe)` au lieu de `(*, Groupe)`, éliminant besoin de RP.

### Multicast Boundary (filtrage)

Empêcher certains groupes multicast de traverser une interface.

```cisco
! Créer ACL
Router(config)# access-list 10 deny 239.255.0.0 0.0.255.255
Router(config)# access-list 10 permit any

! Appliquer sur interface
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip multicast boundary 10
```

### Limiter débit multicast

```cisco
Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip multicast rate-limit in 10000
Router(config-if)# ip multicast rate-limit out 10000
```

**Unité** : kbps (kilobits par seconde)

## Configuration SMPTE 2110 (Broadcast IP)

### Routeur Spine (L3) pour broadcast IP

```cisco
hostname Spine-Broadcast

! 1. Activer multicast routing
ip multicast-routing

! 2. Configuration interfaces vers Leafs
interface range TenGigabitEthernet1/0/1-10
 description Downlink to Leaf switches
 ip address 192.168.X.1 255.255.255.0
 ip pim sparse-mode
 no shutdown

! 3. RP statique
ip pim rp-address 192.168.10.1

! 4. PTP Boundary Clock (synchronisation)
ptp mode boundary-clock
ptp domain 0
ptp priority1 100

! GPS Master upstream (slave port)
interface TenGigabitEthernet1/0/1
 ptp role slave

! Leafs downstream (master ports)
interface range TenGigabitEthernet1/0/2-10
 ptp role master

! 5. QoS pour flux vidéo/audio
class-map match-all VIDEO-2110
 match ip dscp ef

policy-map QOS-2110
 class VIDEO-2110
  priority percent 70

interface range TenGigabitEthernet1/0/1-10
 service-policy output QOS-2110

! 6. MTU 9000 (jumbo frames)
interface range TenGigabitEthernet1/0/1-10
 mtu 9000
```

### Vérifications spécifiques SMPTE 2110

```cisco
! Vérifier routes multicast (flux 2110)
show ip mroute 239.100.0.0/16

! Vérifier groupes IGMP
show ip igmp groups | include 239.100

! Vérifier PTP
show ptp clock
show ptp port
show ptp corrections

! Statistiques trafic
show interface TenGigabitEthernet1/0/1 | include rate
```

## Troubleshooting

### Problème : Pas de voisins PIM

**Vérification** :
```cisco
show ip pim neighbor
! Vide ?
```

**Causes possibles** :
1. PIM pas activé sur interface
2. Interface down
3. Problème réseau (pas de connectivité)

**Solution** :
```cisco
! Vérifier config interface
show run interface GigabitEthernet0/0
! Doit contenir "ip pim sparse-mode"

! Debug PIM
debug ip pim
```

### Problème : Pas de routes multicast (mroute vide)

**Vérification** :
```cisco
show ip mroute
! Table vide ?
```

**Causes** :
1. Pas de groupes IGMP souscrits
2. RP non configuré ou inaccessible
3. Multicast routing pas activé

**Solution** :
```cisco
! Vérifier multicast routing
show ip pim rp mapping

! Vérifier groupes IGMP
show ip igmp groups

! Forcer membership
interface GigabitEthernet0/0
 ip igmp join-group 239.1.1.1
```

### Problème : Flux ne traverse pas le routeur

**Vérification** :
```cisco
show ip mroute 239.1.1.1

! Vérifier Incoming et Outgoing interfaces
```

**Causes** :
1. RPF (Reverse Path Forwarding) check fail
2. Pas d'abonnés downstream
3. ACL bloquant multicast

**Solution** :
```cisco
! Vérifier RPF
show ip rpf 10.1.1.100

! Debug mroute
debug ip mpacket
```

### Problème : Pertes de paquets multicast

**Solutions** :
1. Augmenter buffers
2. Activer QoS
3. Vérifier oversubscription

```cisco
! Vérifier drops
show interface GigabitEthernet0/1 | include drops

! Augmenter buffers (selon modèle)
interface GigabitEthernet0/1
 hold-queue 4096 in
 hold-queue 4096 out
```

## Commandes debug

```cisco
! Debug PIM (attention en production !)
debug ip pim
debug ip pim auto-rp
debug ip pim bsr

! Debug IGMP
debug ip igmp

! Debug mroute
debug ip mpacket
debug ip mrouting

! Désactiver tous les debugs
undebug all
```

## Comparaison modes PIM

| Mode | Description | Cas d'usage |
|------|-------------|-------------|
| **Sparse Mode** | Abonnement explicite (Join) | Internet, WAN, réseaux dispersés |
| **Dense Mode** | Flood & Prune | LAN local, forte densité clients |
| **Sparse-Dense** | Hybride | Transition |
| **SSM** | Source-Specific | IPTV, broadcast IP |

**Recommandation** : **Sparse Mode** pour 99% des cas.

## Best practices

### Pour production

1. **Utiliser Sparse Mode** : Économie bande passante
2. **RP redondant** : Utiliser Auto-RP ou BSR
3. **SSM si possible** : Élimine dépendance au RP
4. **Monitoring** : Surveiller `show ip mroute count`
5. **QoS** : Prioriser trafic multicast critique

### Pour SMPTE 2110

1. **PIM-SM obligatoire** : Sparse Mode
2. **RP stable** : Adresse Loopback sur Spine
3. **PTP Boundary Clock** : Synchronisation nanoseconde
4. **MTU 9000** : Jumbo frames
5. **QoS DSCP EF** : Priorité maximale flux vidéo
6. **Monitoring PTP** : Vérifier précision < 1 µs

### Sécurité

```cisco
! Filtrer groupes multicast sensibles
access-list 100 deny ip any 239.255.0.0 0.0.255.255
access-list 100 permit ip any any

interface GigabitEthernet0/0
 ip multicast boundary 100

! Limiter débit
interface GigabitEthernet0/1
 ip multicast rate-limit in 50000
```

## Cas d'usage

- **Studio TV** : Routeur Spine pour SMPTE 2110
- **Campus** : Routage multicast inter-bâtiments
- **IPTV** : Distribution chaînes TV multicast
- **Datacenter** : Architecture Spine-Leaf multicast

## Connexions

- [[MULTICAST - diffusion groupe]] - Concept général
- [[PIM - Protocol Independent Multicast]] - Protocole détaillé
- [[IGMP - Internet Group Management Protocol]] - Communication clients-routeur
- [[MULTICAST Linux - routeur PIM]] - Équivalent Linux
- [[MULTICAST Cisco - switch IGMP snooping]] - Switch L2 Cisco
- [[MULTICAST Linux - client réception flux]] - Client multicast
- [[SMPTE 2110 - transport multimédia par IP]] - Cas d'usage broadcast IP
- [[Topologie Spine-Leaf - architecture réseau]] - Architecture moderne

---
**Sources** : Cisco Multicast Configuration Guide, RFC 4601 (PIM-SM), SMPTE 2110 Best Practices
