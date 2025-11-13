---
type: permanent
created: 2025-01-08 19:50
tags:
  - permanent
  - réseau
  - multicast
  - protocole
---

# PIM - Protocol Independent Multicast

> [!abstract] Concept
> PIM est un protocole de routage multicast qui permet la distribution efficace de flux de données d'une source vers plusieurs destinataires simultanément, sans dépendre d'un protocole de routage unicast spécifique.

## Explication

Le **multicast** envoie un flux unique vers plusieurs destinataires (contrairement à l'unicast 1:1 ou broadcast 1:tous).

**Cas d'usage** :
- Streaming vidéo (IPTV)
- Visioconférence
- Cotations boursières temps réel
- Mise à jour logicielles

**PIM** gère la distribution multicast sans dépendre du protocole de routage unicast (OSPF, EIGRP, RIP) → **Protocol Independent**.

## Modes PIM

### PIM Dense Mode (PIM-DM)
**Principe** : Flood and Prune
- Envoie trafic partout (flood)
- Branches sans abonnés envoient "Prune" (élagage)

**Usage** : Réseaux où la plupart des destinataires veulent le flux
**Problème** : Gaspille bande passante (flood initial)

### PIM Sparse Mode (PIM-SM)
**Principe** : Explicit Join
- Aucun trafic par défaut
- Destinataires envoient "Join" au RP (Rendezvous Point)
- Trafic uniquement vers demandeurs

**Usage** : Réseaux où peu de destinataires (Internet, entreprises)
**Avantage** : Efficace, scalable (le plus utilisé)

### PIM Sparse-Dense Mode
Mode hybride (Sparse par défaut, Dense si pas de RP).

## Concepts clés

### RP (Rendezvous Point)
Routeur central où :
- Sources enregistrent leur flux
- Destinataires demandent flux

**Configuration statique** :
```cisco
ip pim rp-address 10.0.0.1
```

### Shared Tree (*,G)
Arbre partagé centré sur le RP :
- `*` : Toute source
- `G` : Groupe multicast

### Source Tree (S,G)
Arbre optimisé source → destinataires :
- `S` : Source spécifique
- `G` : Groupe multicast

**Évolution** : Commence en Shared Tree, puis bascule vers Source Tree (plus court).

### Multicast Groups
Adresses IP **224.0.0.0 à 239.255.255.255** (classe D)

Groupes réservés :
- `224.0.0.1` : Tous les hôtes du subnet
- `224.0.0.2` : Tous les routeurs
- `224.0.0.5` : OSPF
- `224.0.0.9` : RIPv2
- `224.0.0.13` : PIM

## Configuration Cisco (PIM-SM)

**Activer multicast routing** :
```cisco
ip multicast-routing
```

**Activer PIM sur interfaces** :
```cisco
interface GigabitEthernet0/0
 ip pim sparse-mode
```

**Configurer RP** (statique) :
```cisco
ip pim rp-address 10.0.0.1
```

**Ou RP dynamique (Auto-RP ou BSR)** :
```cisco
! Candidat RP
ip pim send-rp-announce Loopback0 scope 10

! Mapping Agent
ip pim send-rp-discovery Loopback0 scope 10
```

## Vérification

```cisco
show ip mroute                  ! Table de routage multicast
show ip pim neighbor            ! Voisins PIM
show ip pim rp                  ! RP configurés
show ip pim interface           ! Interfaces PIM
show ip igmp groups             ! Groupes multicast souscrits
```

**Exemple mroute** :
```
(*,239.1.1.1), 00:05:23, RP 10.0.0.1
  Incoming interface: GigabitEthernet0/0
  Outgoing interface list:
    GigabitEthernet0/1, Forward/Sparse, 00:05:23
```

## IGMP (relation avec PIM)

**IGMP** (Internet Group Management Protocol) : Protocole entre hôtes et routeur local
- Hôtes s'abonnent à groupes multicast via IGMP
- Routeur utilise PIM pour distribuer aux autres routeurs

**Workflow** :
1. Client envoie **IGMP Join** au routeur local
2. Routeur envoie **PIM Join** vers RP
3. RP route le flux multicast

## Avantages / Inconvénients

✅ **Efficace** : 1 flux pour N destinataires (économie bande passante)
✅ **Scalable** : Supporte milliers de destinataires
✅ **Protocol Independent** : Fonctionne avec tout IGP
✅ **PIM-SM** : Pas de gaspillage (trafic seulement vers abonnés)

❌ **Complexité** : Configuration avancée
❌ **Support limité** : Tous équipements ne supportent pas
❌ **Débogage difficile** : Problèmes multicast complexes à diagnostiquer
❌ **RP SPOF** : Si RP tombe, plus de multicast (solution : Anycast RP)

## Modes de livraison

| Mode | Description | Bande passante |
|------|-------------|----------------|
| **Unicast** | 1 source → 1 destinataire | N flux pour N clients |
| **Broadcast** | 1 source → Tous | 1 flux mais inefficace |
| **Multicast** | 1 source → N abonnés | 1 flux optimisé |

**Exemple (vidéo 10 Mbps, 100 clients)** :
- Unicast : 10 Mbps × 100 = **1 Gbps**
- Multicast : **10 Mbps** (économie 99%)

## Variantes PIM

### PIM-SSM (Source-Specific Multicast)
- Client spécifie source ET groupe : (S,G)
- Pas besoin de RP
- Plus simple, plus sécurisé
- Range : 232.0.0.0/8

```cisco
ip pim ssm default  ! Active SSM pour 232.0.0.0/8
```

### PIM Bidirectional
- Trafic bidirectionnel via RP
- Optimal pour many-to-many
- Complexe à configurer

## Connexions

- [[IGMP - Internet Group Management Protocol]] - Protocole hôte-routeur
- [[MULTICAST - diffusion groupe]] - Concept général
- [[OSPF - Open Shortest Path First]] - IGP utilisé par PIM
- [[EIGRP - Enhanced Interior Gateway Routing Protocol]] - IGP utilisé par PIM

---
**Sources** : RFC 4601 (PIM-SM), RFC 7761, Cisco Multicast Configuration Guide
