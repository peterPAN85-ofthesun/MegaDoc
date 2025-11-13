---
type: permanent
created: 2025-01-08 19:50
tags:
  - permanent
  - réseau
  - routage
  - protocole
  - cisco
---

# EIGRP - Enhanced Interior Gateway Routing Protocol

> [!abstract] Concept
> EIGRP est un protocole de routage hybride développé par Cisco, combinant avantages des protocoles distance-vector et link-state, avec convergence très rapide.

## Explication

EIGRP améliore les protocoles distance-vector classiques (RIP) avec des fonctionnalités avancées : convergence rapide, métrique composite, support VLSM.

**Type** : Hybride (distance-vector avancé)
**Origine** : Cisco (propriétaire jusqu'en 2013, puis ouvert)
**Métrique** : Composite (bande passante, délai, fiabilité, charge)
**Distance administrative** : 90 (interne), 170 (externe)
**Limite** : 255 sauts (configurable jusqu'à 255)

## Caractéristiques principales

✅ **Convergence très rapide** : Secondes (routes de secours pré-calculées)
✅ **Métrique avancée** : Bande passante + délai (par défaut)
✅ **Updates incrémentaux** : Seulement les changements (pas toute la table)
✅ **Support VLSM et CIDR**
✅ **Authentification** MD5
✅ **Load balancing** : Inégal (variance)
✅ **Consommation faible** : Moins de CPU que OSPF

## Principe de fonctionnement

### DUAL Algorithm
**DUAL** (Diffusing Update Algorithm) garantit :
- Calcul instantané routes de secours
- Convergence sans boucle
- Backup routes (Feasible Successor)

### Concepts clés

**Successor** : Meilleure route (métrique la plus basse)
**Feasible Successor** : Route de backup pré-calculée
**Feasibility Condition** : Condition pour être FS (AD voisin < FD)

**Exemple** :
```
Routeur A veut joindre 192.168.1.0
- Via B : métrique 1000 (Successor)
- Via C : métrique 1500 (Feasible Successor, si condition respectée)

Si lien A-B tombe → Basculement instantané sur C
```

## Métrique composite

```
Métrique = 256 * [K1*Bande passante + (K2*Bande passante)/(256-Charge) + K3*Délai]
           * [K5/(Fiabilité + K4)]
```

**Par défaut** (K1=1, K2=0, K3=1, K4=0, K5=0) :
```
Métrique = 256 * (Bande passante + Délai)
```

**Bande passante** : 10^7 / bande passante la plus faible (kbps)
**Délai** : Somme des délais / 10

## Configuration Cisco

```cisco
router eigrp 100                    ! AS number (doit correspondre entre voisins)
 network 192.168.1.0 0.0.0.255      ! Annoncer réseaux (wildcard mask)
 network 10.0.0.0 0.255.255.255
 no auto-summary                    ! Désactiver résumé automatique
 eigrp router-id 1.1.1.1            ! ID unique (optionnel)

! Authentification
key chain EIGRP-KEYS
 key 1
  key-string S3cur3P@ss

interface GigabitEthernet0/0
 ip authentication mode eigrp 100 md5
 ip authentication key-chain eigrp 100 EIGRP-KEYS
```

**Interfaces passives** :
```cisco
router eigrp 100
 passive-interface default          ! Toutes passives par défaut
 no passive-interface Gi0/0         ! Activer seulement certaines
```

## Vérification

```cisco
show ip eigrp neighbors            ! Voisins EIGRP
show ip eigrp topology             ! Table topologie (Successors, FS)
show ip route eigrp                ! Routes EIGRP
show ip eigrp interfaces           ! Interfaces EIGRP actives
show ip protocols                  ! Protocoles de routage
```

**Détails topologie** :
```cisco
show ip eigrp topology all-links   ! Tous les chemins (pas seulement meilleurs)
```

## Load Balancing

**Equal-cost** (par défaut) :
```cisco
router eigrp 100
 maximum-paths 4                    ! Max 4 chemins (défaut: 4, max: 32)
```

**Unequal-cost** (variance) :
```cisco
router eigrp 100
 variance 2                         ! Utiliser routes jusqu'à 2x métrique meilleure
```

Exemple :
- Route A : métrique 1000 (Successor)
- Route B : métrique 1500 (utilisée si variance ≥ 1.5)
- Route C : métrique 2500 (pas utilisée car > 2x)

## Types de paquets EIGRP

1. **Hello** : Découverte voisins (5s sur LAN, 60s sur WAN)
2. **Update** : Envoi routes
3. **Query** : Demande route si perte Successor
4. **Reply** : Réponse au Query
5. **Ack** : Accusé réception

## Avantages / Inconvénients

✅ **Convergence ultra-rapide** (pré-calcul FS)
✅ **Efficace** : Updates incrémentaux uniquement
✅ **Flexible** : Load balancing inégal
✅ **Scalable** : Moins de CPU/RAM que OSPF
✅ **Simple** : Configuration plus facile qu'OSPF

❌ **Cisco uniquement** (historiquement, support limité autres vendeurs)
❌ **Métrique complexe** : Difficile à tuner
❌ **AS unique** : Pas de hiérarchie comme OSPF (areas)

## EIGRP Named Mode (moderne)

Depuis IOS 15.0, nouvelle syntaxe :
```cisco
router eigrp MY-EIGRP
 address-family ipv4 unicast autonomous-system 100
  network 192.168.1.0 0.0.0.255
  topology base
  exit-af-topology
 exit-address-family
```

Avantages :
- Support IPv4 et IPv6 simultané
- Configuration plus structurée
- Authentification améliorée

## Comparaison avec autres protocoles

| Protocole | Type | AD | Convergence | Complexité | Vendor |
|-----------|------|----|-------------|------------|--------|
| **EIGRP** | Hybride | 90 | Très rapide | Moyenne | Cisco |
| **OSPF** | Link-state | 110 | Rapide | Élevée | Multi-vendor |
| **RIP** | Distance-vector | 120 | Lente | Faible | Multi-vendor |

**Quand choisir EIGRP ?**
- Réseau 100% Cisco
- Besoin de convergence ultra-rapide
- Load balancing inégal nécessaire

**Quand choisir OSPF ?**
- Réseau multi-vendeurs
- Standard ouvert requis
- Très grande échelle (areas)

## Connexions

- [[ROUTAGE - statique]] - Alternative manuelle
- [[Routage Cisco - Distance administrative]] - Priorité EIGRP (90)
- [[OSPF - Open Shortest Path First]] - Protocole concurrent
- [[RIP - Routing Information Protocol]] - Protocole obsolète

---
**Sources** : RFC 7868, Cisco EIGRP Configuration Guide, CCNP ROUTE
