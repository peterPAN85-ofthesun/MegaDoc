---
type: permanent
created: 2025-01-08 19:50
tags:
  - permanent
  - réseau
  - routage
  - protocole
---

# OSPF - Open Shortest Path First

> [!abstract] Concept
> OSPF est un protocole de routage dynamique à état de liens (link-state) qui calcule les meilleurs chemins en utilisant l'algorithme de Dijkstra et la bande passante comme métrique.

## Explication

OSPF permet aux routeurs de découvrir automatiquement les routes et de s'adapter aux changements de topologie réseau.

**Type** : Link-state (état de liens)
**Standard** : Ouvert (RFC 2328)
**Métrique** : Coût basé sur la bande passante
**Distance administrative** : 110

**Différence avec protocoles distance-vector (RIP)** :
- Connaissance complète de la topologie
- Convergence très rapide
- Scalable (grandes entreprises)
- Pas de limitation de sauts

## Principe de fonctionnement

1. **Découverte des voisins** : Envoi de paquets Hello
2. **Échange de LSDB** : Base de données d'état de liens
3. **Calcul SPF** : Algorithme Dijkstra pour trouver chemin optimal
4. **Mise à jour routing table** : Insertion des meilleures routes

**Convergence** :
- Événement réseau (lien tombe)
- Envoi LSA (Link State Advertisement) à tous les routeurs
- Recalcul SPF
- Convergence en quelques secondes

## Concepts clés

### Aires (Areas)
OSPF utilise des **aires** pour la scalabilité :
- **Area 0** : Backbone (obligatoire)
- **Areas 1, 2, 3...** : Aires périphériques

Toutes les aires doivent se connecter à l'Area 0.

### Types de routeurs
- **Internal Router** : Tous interfaces dans même aire
- **ABR** (Area Border Router) : Connecte plusieurs aires
- **ASBR** (Autonomous System Boundary Router) : Redistribue routes externes
- **Backbone Router** : Au moins 1 interface dans Area 0

### Métrique (Coût)
```
Coût = 100 000 000 / Bande passante (bps)
```

Exemples :
- FastEthernet (100 Mbps) : Coût = 1
- GigabitEthernet (1 Gbps) : Coût = 1
- Serial (1.544 Mbps) : Coût = 64

## Configuration Cisco (base)

```cisco
! Activer OSPF (process ID = 1)
router ospf 1
 router-id 1.1.1.1                          ! ID unique du routeur
 network 192.168.1.0 0.0.0.255 area 0       ! Annoncer réseau dans Area 0
 network 10.0.0.0 0.255.255.255 area 1      ! Annoncer réseau dans Area 1

! Sur une interface spécifique
interface GigabitEthernet0/0
 ip ospf 1 area 0                           ! Alternative à network
```

**Router ID** : Identifiant unique (format IP)
- Défini manuellement (recommandé)
- Sinon : IP la plus haute des loopbacks
- Sinon : IP la plus haute des interfaces physiques

## Vérification

```cisco
show ip ospf neighbor              ! Voisins OSPF
show ip ospf database              ! Base de données LSDB
show ip ospf interface             ! Interfaces OSPF
show ip route ospf                 ! Routes OSPF dans table de routage
show ip protocols                  ! Protocoles de routage actifs
```

## Types de réseaux OSPF

**Broadcast** (Ethernet) :
- Élection DR/BDR
- Hello : 10s, Dead : 40s

**Point-to-Point** (Serial) :
- Pas de DR/BDR
- Hello : 10s, Dead : 40s

**NBMA** (Frame Relay) :
- Configuration manuelle voisins

## DR et BDR

Sur réseaux **broadcast** (Ethernet), OSPF élit :
- **DR** (Designated Router) : Gère adjacences
- **BDR** (Backup DR) : Backup du DR

**Avantage** : Réduit le nombre d'adjacences (n routeurs = n adjacences au lieu de n²)

**Élection** :
1. Priorité la plus haute (0-255, défaut 1)
2. Si égalité : Router ID le plus élevé

## Avantages / Inconvénients

✅ **Convergence rapide** (secondes)
✅ **Scalable** (grandes entreprises)
✅ **Métrique intelligente** (bande passante)
✅ **Standard ouvert** (multi-vendeurs)
✅ **Support VLSM et CIDR**

❌ **Complexe** à configurer et déboguer
❌ **Consommation CPU/RAM** (calcul SPF)
❌ **Configuration aires** nécessaire pour grandes topologies

## Comparaison avec autres protocoles

| Protocole | Type | AD | Métrique | Convergence | Usage |
|-----------|------|----|---------|--------------| ------|
| **OSPF** | Link-state | 110 | Bande passante | Très rapide | Moyennes/Grandes entreprises |
| **RIP** | Distance-vector | 120 | Hop count | Lente | Petits réseaux (obsolète) |
| **EIGRP** | Hybride | 90 | Composite | Très rapide | Réseaux Cisco |
| **BGP** | Path-vector | 20/200 | Path attributes | Variable | Internet (AS) |

## Connexions

- [[ROUTAGE - statique]] - Alternative manuelle
- [[Routage Cisco - Distance administrative]] - Priorité OSPF (110)
- [[RIP - Routing Information Protocol]] - Protocole concurrent
- [[EIGRP - Enhanced Interior Gateway Routing Protocol]] - Protocole Cisco
- [[BGP - Border Gateway Protocol]] - Routage inter-AS

---
**Sources** : RFC 2328, Cisco OSPF Configuration Guide, CCNA Routing & Switching
