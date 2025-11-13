---
type: permanent
created: 2025-01-08 19:50
tags:
  - permanent
  - réseau
  - routage
  - protocole
  - internet
---

# BGP - Border Gateway Protocol

> [!abstract] Concept
> BGP est le protocole de routage utilisé sur Internet pour échanger les routes entre systèmes autonomes (AS), permettant l'interconnexion mondiale des réseaux.

## Explication

BGP est le **protocole de routage d'Internet**. Contrairement à OSPF/EIGRP (IGP - Interior Gateway Protocol), BGP est un EGP (Exterior Gateway Protocol) conçu pour connecter des AS différents.

**Type** : Path-vector
**Standard** : Ouvert (RFC 4271 - BGPv4)
**Métrique** : Path attributes (AS-PATH, LOCAL_PREF, MED, etc.)
**Distance administrative** :
- **eBGP** (External BGP) : 20
- **iBGP** (Internal BGP) : 200

## Système Autonome (AS)

Un **AS** (Autonomous System) est un réseau ou groupe de réseaux sous une administration unique.

**Exemples** :
- AS 15169 : Google
- AS 32934 : Meta (Facebook)
- AS 16509 : Amazon AWS
- AS 8075 : Microsoft Azure

**Numérotation** :
- 1 - 64511 : AS publics
- 64512 - 65535 : AS privés (usage interne)

## eBGP vs iBGP

### eBGP (External BGP)
- Entre AS différents
- Adjacence directe (voisins connectés)
- TTL = 1 (par défaut)
- Incrémente AS-PATH

### iBGP (Internal BGP)
- Même AS
- Peut être non-adjacent (multi-hop)
- TTL = 255
- N'incrémente PAS AS-PATH
- **Full mesh requis** (tous routeurs iBGP interconnectés) ou Route Reflector

## Attributs BGP

BGP utilise des **attributs** pour sélectionner les routes :

### AS-PATH
Liste des AS traversés. Plus court = meilleur.
```
192.168.1.0/24 via AS 100 → 200 → 300
192.168.1.0/24 via AS 100 → 200        (préféré, plus court)
```

### LOCAL_PREF
Préférence locale (iBGP). Plus élevé = meilleur.
```
Route A : LOCAL_PREF 150
Route B : LOCAL_PREF 100    (Route A préférée)
```

### MED (Multi-Exit Discriminator)
Suggère point d'entrée préféré. Plus bas = meilleur.

### NEXT_HOP
Prochain saut pour atteindre le réseau.

### WEIGHT (Cisco)
Propriétaire Cisco. Plus élevé = meilleur. Local au routeur.

## Sélection de route (Best Path)

Ordre de préférence :
1. **WEIGHT** (Cisco)
2. **LOCAL_PREF** (plus élevé)
3. **Locally originated** (routes injectées localement)
4. **AS-PATH** (plus court)
5. **ORIGIN** (IGP > EGP > Incomplete)
6. **MED** (plus bas)
7. **eBGP > iBGP**
8. **IGP metric** (plus bas)
9. **Router ID** (plus bas)

## Configuration Cisco

**eBGP simple** :
```cisco
router bgp 65001                        ! AS local
 bgp router-id 1.1.1.1
 neighbor 203.0.113.2 remote-as 65002   ! Voisin eBGP (AS différent)
 network 192.168.1.0 mask 255.255.255.0 ! Annoncer réseau
```

**iBGP** :
```cisco
router bgp 65001
 neighbor 10.0.0.2 remote-as 65001      ! Voisin iBGP (même AS)
 neighbor 10.0.0.2 update-source Loopback0
```

**Route Reflector** (éviter full mesh iBGP) :
```cisco
router bgp 65001
 neighbor 10.0.0.2 remote-as 65001
 neighbor 10.0.0.2 route-reflector-client
```

## Vérification

```cisco
show ip bgp                             ! Table BGP
show ip bgp summary                     ! État voisins BGP
show ip bgp neighbors                   ! Détails voisins
show ip route bgp                       ! Routes BGP dans table de routage
show ip bgp 192.168.1.0                 ! Détails route spécifique
```

**États voisins BGP** :
- **Idle** : Pas d'adjacence
- **Connect** : TCP en cours
- **OpenSent** : Message OPEN envoyé
- **OpenConfirm** : Message OPEN reçu
- **Established** : Adjacence active ✅

## Problèmes courants

### Split Brain
Réseau annoncé simultanément par plusieurs AS → Instabilité

**Solution** : Filtrage, agrégation

### Route Flapping
Routes qui oscillent (up/down) rapidement

**Solution** : Route dampening
```cisco
router bgp 65001
 bgp dampening
```

### Full Mesh iBGP
n routeurs iBGP = n(n-1)/2 adjacences

**Solution** : Route Reflector ou Confederation

## Sécurité BGP

⚠️ **Hijacking BGP** : Annoncer des préfixes qu'on ne possède pas

**Protections** :
- **Filtrage** : Autoriser uniquement préfixes attendus
- **RPKI** : Resource Public Key Infrastructure (validation origine)
- **BGPsec** : Signature cryptographique des annonces
- **Max-prefix** : Limite nombre de routes acceptées

```cisco
neighbor 203.0.113.2 maximum-prefix 1000
```

## Agrégation de routes

Réduire nombre de routes annoncées :
```cisco
router bgp 65001
 aggregate-address 192.168.0.0 255.255.0.0 summary-only
```

Annonce `192.168.0.0/16` au lieu de multiples `/24`.

## Cas d'usage

**BGP est utilisé pour** :
- ✅ Interconnexion ISP (Internet)
- ✅ Multi-homing (plusieurs fournisseurs Internet)
- ✅ Très grands réseaux d'entreprise (data centers)
- ✅ Cloud providers (AWS, Azure, GCP)

**BGP N'est PAS pour** :
- ❌ PME/Petites entreprises (utiliser IGP : OSPF/EIGRP)
- ❌ Réseaux internes (préférer OSPF)

## Avantages / Inconvénients

✅ **Scalabilité** : Supporte des millions de routes (Internet)
✅ **Flexibilité** : Contrôle fin via attributs
✅ **Redondance** : Multi-homing, failover
✅ **Standard** : Universel (tous équipements réseau)

❌ **Complexité** : Configuration très complexe
❌ **Convergence lente** : Minutes (pas secondes)
❌ **Consommation** : Haute mémoire/CPU
❌ **Sécurité** : Vulnérable aux hijacks (sans RPKI)

## Connexions

- [[OSPF - Open Shortest Path First]] - IGP complémentaire
- [[EIGRP - Enhanced Interior Gateway Routing Protocol]] - IGP complémentaire
- [[Routage Cisco - Distance administrative]] - Priorité BGP (20/200)
- [[ROUTAGE - statique]] - Peut être redistribué dans BGP

---
**Sources** : RFC 4271 (BGPv4), Cisco BGP Configuration Guide, CCNP ROUTE
