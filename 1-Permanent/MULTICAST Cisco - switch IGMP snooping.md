---
type: permanent
created: 2025-11-25 17:00
tags:
  - permanent
  - réseau
  - multicast
  - cisco
  - switch
  - igmp
---

# MULTICAST Cisco - switch IGMP snooping

> [!abstract] Concept
> Configuration d'un switch Cisco L2 avec IGMP snooping pour distribuer intelligemment le trafic multicast uniquement vers les ports ayant des clients abonnés.

## Explication

Un **switch L2** sans IGMP snooping traite le trafic multicast comme du **broadcast** : il envoie les flux multicast à tous les ports du VLAN, même ceux sans client abonné.

**IGMP snooping** permet au switch d'écouter les messages IGMP entre clients et routeur, et de construire une table des ports abonnés à chaque groupe multicast.

**Résultat** : Le trafic multicast est envoyé uniquement aux ports concernés, évitant la saturation du réseau.

## Architecture typique

```
         [Routeur L3 avec PIM]
                 |
         [Switch L2] ← IGMP Snooping activé
         /    |    \
      [PC1] [PC2] [PC3]

PC2 s'abonne à 239.1.1.1 via IGMP
→ Switch envoie flux uniquement vers port de PC2
```

## Configuration de base

### 1. Activer IGMP snooping globalement

```cisco
Switch(config)# ip igmp snooping
```

**Par défaut** : IGMP snooping est **activé** sur la plupart des switches Cisco modernes.

### 2. Activer IGMP snooping par VLAN

```cisco
Switch(config)# ip igmp snooping vlan 10
Switch(config)# ip igmp snooping vlan 20
```

### 3. Vérifier la configuration

```cisco
Switch# show ip igmp snooping

Global IGMP Snooping configuration:
-----------------------------------
IGMP snooping                : Enabled
IGMPv3 snooping (minimal)    : Enabled
Report suppression           : Enabled
TCN solicit query            : Disabled
TCN flood query count        : 2
Robustness variable          : 2
Last member query count      : 2
Last member query interval   : 1000
```

## Configuration avancée

### Définir un port mrouter (vers routeur multicast)

Le port connecté au **routeur multicast** doit être marqué comme **mrouter port** pour recevoir tous les IGMP Reports.

```cisco
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# ip igmp snooping mrouter

! Ou globalement par VLAN
Switch(config)# ip igmp snooping vlan 10 mrouter interface GigabitEthernet0/1
```

### Configurer IGMP querier

Si **aucun routeur multicast** n'est présent, le switch peut agir comme **IGMP querier** pour interroger les clients.

```cisco
! Activer querier sur VLAN
Switch(config)# ip igmp snooping vlan 10 querier
Switch(config)# ip igmp snooping vlan 10 querier address 192.168.10.1

! Configurer intervalle des queries
Switch(config)# ip igmp snooping vlan 10 querier query-interval 30

! Configurer version IGMP
Switch(config)# ip igmp snooping vlan 10 querier version 3
```

### Configurer report suppression

**Report suppression** : Le switch n'envoie qu'un seul IGMP Report au routeur même si plusieurs clients rejoignent le même groupe (économise bande passante).

```cisco
! Activer (par défaut activé)
Switch(config)# ip igmp snooping report-suppression

! Désactiver (si problèmes avec certains équipements)
Switch(config)# no ip igmp snooping report-suppression
```

### Configurer static multicast groups

Forcer un port à recevoir un groupe multicast spécifique (utile pour équipements ne supportant pas IGMP).

```cisco
! Port Gi0/5 reçoit groupe 239.1.1.1 sur VLAN 10
Switch(config)# ip igmp snooping vlan 10 static 239.1.1.1 interface GigabitEthernet0/5
```

### Limiter le nombre de groupes par port

Protéger contre attaques DoS (flood de IGMP joins).

```cisco
Switch(config)# interface GigabitEthernet0/10
Switch(config-if)# ip igmp snooping limit 10
```

## Vérification et troubleshooting

### Voir les groupes multicast appris

```cisco
Switch# show ip igmp snooping groups

Vlan      Group          Type        Version     Port List
-------------------------------------------------------------
10        239.1.1.1      igmp        v2          Gi0/5, Gi0/10
10        239.1.1.2      igmp        v3          Gi0/7
20        239.2.1.1      static      ---         Gi0/12
```

**Colonnes** :
- **Type** : `igmp` (appris dynamiquement) ou `static` (configuré manuellement)
- **Version** : Version IGMP (v2 ou v3)
- **Port List** : Ports où sont les clients abonnés

### Voir les mrouter ports

```cisco
Switch# show ip igmp snooping mrouter

Vlan    ports
----    -----
10      Gi0/1(dynamic), Gi0/2(static)
20      Gi0/1(dynamic)
```

**Types** :
- **dynamic** : Appris automatiquement (PIM Hello reçu)
- **static** : Configuré manuellement

### Voir le querier

```cisco
Switch# show ip igmp snooping querier

Vlan      IP Address       IGMP Version   Port
----------------------------------------------------------
10        192.168.10.1     v2             Gi0/1
20        192.168.20.254   v3             Gi0/1
```

### Afficher statistiques par VLAN

```cisco
Switch# show ip igmp snooping statistics vlan 10

Rx:
 Valid IGMP packets: 1523
 Queries: 850
 Reports: 673
 Leaves: 120

Tx:
 Queries: 0 (querier disabled)
 Reports: 673
```

### Debug IGMP snooping

```cisco
! Activer debug (attention en production !)
Switch# debug ip igmp snooping

! Désactiver
Switch# no debug ip igmp snooping
```

## Configuration SMPTE 2110 (Broadcast IP)

Switch Leaf (L2) dans architecture Spine-Leaf pour broadcast IP.

```cisco
! Configuration globale
hostname Leaf-Studio-A
ip igmp snooping

! Configuration VLAN production (vidéo/audio)
vlan 100
 name PRODUCTION-RED
vlan 200
 name PRODUCTION-BLUE

! IGMP Snooping par VLAN
ip igmp snooping vlan 100
ip igmp snooping vlan 200

! Désactiver report suppression (pour monitoring)
ip igmp snooping vlan 100 report-suppression disable
ip igmp snooping vlan 200 report-suppression disable

! Ports uplink vers Spine (mrouter)
interface range GigabitEthernet1/0/1-2
 description Uplink to Spine
 switchport mode trunk
 switchport trunk allowed vlan 100,200
 ip igmp snooping mrouter

! Ports caméras (sources multicast)
interface range GigabitEthernet1/0/10-20
 description Cameras SMPTE 2110
 switchport mode access
 switchport access vlan 100
 spanning-tree portfast

! Ports receivers (mélangeurs, enregistreurs)
interface range GigabitEthernet1/0/21-40
 description Receivers SMPTE 2110
 switchport mode access
 switchport access vlan 100
 spanning-tree portfast

! QoS pour flux 2110 (priorité vidéo/audio)
mls qos
class-map match-all VIDEO-2110
 match ip dscp ef
policy-map QOS-2110
 class VIDEO-2110
  priority percent 70
interface range GigabitEthernet1/0/1-48
 service-policy output QOS-2110

! PTP Transparent Clock (synchronisation)
ptp mode transparent
```

## Troubleshooting

### Problème : Multicast envoyé à tous les ports

**Vérification** :
```cisco
Switch# show ip igmp snooping
! Vérifier "IGMP snooping : Enabled"
```

**Solution** :
```cisco
Switch(config)# ip igmp snooping
Switch(config)# ip igmp snooping vlan 10
```

### Problème : Clients ne reçoivent pas le flux

**Vérification 1** : Mrouter port configuré ?
```cisco
Switch# show ip igmp snooping mrouter
! Le port vers le routeur doit apparaître
```

**Solution** :
```cisco
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# ip igmp snooping mrouter
```

**Vérification 2** : IGMP queries reçues ?
```cisco
Switch# show ip igmp snooping querier
! Un querier doit être présent (routeur ou switch)
```

**Solution** :
```cisco
! Activer querier sur switch
Switch(config)# ip igmp snooping vlan 10 querier
```

**Vérification 3** : Groupes appris ?
```cisco
Switch# show ip igmp snooping groups
! Les groupes des clients doivent apparaître
```

**Solution** : Vérifier que clients envoient IGMP Reports (tcpdump/Wireshark).

### Problème : Flood de trafic multicast après TCN (Topology Change)

Lors d'un **TCN** (Spanning Tree Topology Change), le switch peut flooder temporairement le multicast.

**Solution** :
```cisco
! Désactiver TCN flood
Switch(config)# no ip igmp snooping tcn flood
```

### Problème : Pertes de paquets multicast

**Solutions** :
1. Augmenter buffers du switch (selon modèle)
2. Activer flow control (si supporté)
3. Vérifier oversubscription (débit entrant > sortant)
4. Vérifier QoS : prioriser trafic multicast

```cisco
! Vérifier erreurs sur ports
Switch# show interfaces GigabitEthernet0/5 | include error
```

## Comparaison versions IGMP

| Version | Fonctionnalités | Commande Cisco |
|---------|----------------|----------------|
| **IGMPv1** | Join uniquement (pas de Leave explicite) | `ip igmp snooping vlan X querier version 1` |
| **IGMPv2** | Join + Leave explicite | `ip igmp snooping vlan X querier version 2` |
| **IGMPv3** | Filtrage par source (SSM) | `ip igmp snooping vlan X querier version 3` |

**Recommandation** : Utiliser **IGMPv3** pour broadcast IP (SMPTE 2110) car support SSM.

## Commandes utiles

```cisco
! Voir configuration complète
show ip igmp snooping
show ip igmp snooping vlan 10

! Voir groupes et ports
show ip igmp snooping groups
show ip igmp snooping groups vlan 10

! Voir mrouter ports
show ip igmp snooping mrouter
show ip igmp snooping mrouter vlan 10

! Voir querier
show ip igmp snooping querier
show ip igmp snooping querier vlan 10

! Statistiques
show ip igmp snooping statistics
show ip igmp snooping statistics vlan 10

! Effacer statistiques
clear ip igmp snooping statistics

! Effacer groupes dynamiques
clear ip igmp snooping vlan 10
```

## Best practices

### Pour broadcast IP (SMPTE 2110)

1. **Désactiver report suppression** : Permet monitoring précis
2. **Configurer mrouter ports** : Vers routeur Spine L3
3. **Activer QoS** : Prioriser trafic vidéo/audio (DSCP EF)
4. **MTU 9000** : Jumbo frames pour flux 2110
5. **Désactiver TCN flood** : Éviter disruptions lors TCN
6. **PTP Transparent Clock** : Synchronisation nanoseconde

### Pour IPTV / Streaming

1. **Activer report suppression** : Économiser bande passante
2. **Configurer querier** : Si pas de routeur multicast
3. **Limiter groupes par port** : Protection DoS
4. **Monitoring** : Vérifier statistiques IGMP régulièrement

### Sécurité

```cisco
! Limiter groupes par port
interface GigabitEthernet0/10
 ip igmp snooping limit 20

! Désactiver IGMP sur ports non-fiables
interface range GigabitEthernet0/20-48
 switchport protected
```

## Cas d'usage

- **Studio TV** : Switch Leaf pour flux SMPTE 2110
- **IPTV** : Distribution chaînes TV en multicast
- **Visioconférence** : Salles de réunion avec multicast
- **Campus** : Distribution vidéo/audio multi-bâtiments

## Connexions

- [[MULTICAST - diffusion groupe]] - Concept général
- [[IGMP - Internet Group Management Protocol]] - Protocole écouté par le switch
- [[MULTICAST Linux - bridge IGMP snooping]] - Équivalent Linux
- [[MULTICAST Linux - routeur PIM]] - Routeur Linux avec PIM daemon
- [[MULTICAST Cisco - routeur PIM]] - Routeur Cisco avec PIM Sparse Mode
- [[SMPTE 2110 - transport multimédia par IP]] - Cas d'usage broadcast IP
- [[Topologie Spine-Leaf - architecture réseau]] - Architecture typique

---
**Sources** : Cisco Multicast Configuration Guide, SMPTE 2110 Best Practices
