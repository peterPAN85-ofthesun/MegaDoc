---
type: permanent
created: 2025-01-08 19:50
tags:
  - permanent
  - réseau
  - routage
  - protocole
---

# RIP - Routing Information Protocol

> [!abstract] Concept
> RIP est un protocole de routage dynamique à vecteur de distance (distance-vector) utilisant le nombre de sauts comme métrique, limité à 15 sauts maximum.

## Explication

RIP est l'un des plus anciens protocoles de routage, simple mais limité. Aujourd'hui **obsolète** pour la plupart des réseaux.

**Type** : Distance-vector
**Standard** : Ouvert (RFC 1058 pour RIPv1, RFC 2453 pour RIPv2)
**Métrique** : Hop count (nombre de sauts)
**Distance administrative** : 120
**Limite** : 15 sauts maximum (16 = inaccessible)

## Versions

### RIPv1 (1988)
❌ Classful (pas de VLSM)
❌ Pas d'authentification
❌ Broadcast (255.255.255.255)

### RIPv2 (1994)
✅ Classless (VLSM et CIDR)
✅ Authentification MD5
✅ Multicast (224.0.0.9)

### RIPng (IPv6)
✅ Support IPv6

## Principe de fonctionnement

**Échange de routes** :
1. Chaque routeur envoie sa table de routage complète
2. Toutes les 30 secondes (updates périodiques)
3. Voisins ajoutent +1 au hop count

**Exemple** :
```
Routeur A : Réseau 192.168.1.0 → 0 sauts (directement connecté)
Routeur B reçoit : 192.168.1.0 → 1 saut (via A)
Routeur C reçoit de B : 192.168.1.0 → 2 sauts (via B)
```

**Timers** :
- **Update** : 30s (envoi table complète)
- **Invalid** : 180s (route marquée invalide si pas de mise à jour)
- **Holddown** : 180s (empêche routes instables)
- **Flush** : 240s (suppression route de la table)

## Configuration Cisco

**RIPv2** (recommandé) :
```cisco
router rip
 version 2
 network 192.168.1.0      ! Annoncer réseau classful
 network 10.0.0.0
 no auto-summary          ! Désactiver résumé automatique (important)
 passive-interface Gi0/1  ! Ne pas envoyer updates sur cette interface
```

**Authentification** (sécurité) :
```cisco
! Configuration globale
key chain RIP-KEYS
 key 1
  key-string MyCl3@rP@ssw0rd

! Sur l'interface
interface GigabitEthernet0/0
 ip rip authentication mode md5
 ip rip authentication key-chain RIP-KEYS
```

## Vérification

```cisco
show ip rip database       ! Base de données RIP
show ip route rip          ! Routes RIP dans table de routage
show ip protocols          ! Protocoles de routage actifs
debug ip rip               ! Debug messages RIP (attention CPU)
```

## Mécanismes anti-boucle

RIP utilise plusieurs mécanismes pour éviter les boucles :

### Split Horizon
Ne pas renvoyer une route sur l'interface par laquelle elle a été apprise.

### Poison Reverse
Annoncer une route comme inaccessible (métrique 16) sur l'interface d'origine.

### Hold-down Timer
Ignorer mises à jour pour route tombée pendant un délai (évite flapping).

### Maximum Hop Count
15 sauts max, au-delà = inaccessible (empêche boucles infinies).

## Avantages / Inconvénients

✅ **Simple** : Configuration très facile
✅ **Standard** : Fonctionne sur tous équipements
✅ **Léger** : Faible consommation CPU/RAM

❌ **Lent** : Convergence lente (minutes)
❌ **Limité** : 15 sauts max (petits réseaux uniquement)
❌ **Métrique simple** : Hop count ignore bande passante
❌ **Updates périodiques** : Trafic inutile toutes les 30s
❌ **Scalabilité** : Inadapté aux grandes entreprises
❌ **Obsolète** : Remplacé par OSPF/EIGRP

## Problème du "Count to Infinity"

**Scénario** :
```
[A] ─── [B] ─── [C]
  1 saut   1 saut
```

Réseau X connecté à C :
- A connaît X via B (2 sauts)
- Lien B-C tombe
- B pense encore que A peut joindre X → boucle

**Solution** : Maximum hop count (16), hold-down timers

## Quand utiliser RIP ?

**Cas d'usage rares aujourd'hui** :
- ✅ Très petit réseau (<5 routeurs)
- ✅ Équipements anciens (ne supportent pas OSPF)
- ✅ Test/Lab (apprentissage)

**Préférer OSPF ou EIGRP pour** :
- Production
- Réseaux moyens/grands
- Besoin de convergence rapide

## Configuration Linux (quagga/FRR)

```bash
# Installation
apt install quagga

# Configuration /etc/quagga/ripd.conf
router rip
 version 2
 network 192.168.1.0/24
 network 10.0.0.0/8
```

## Comparaison avec autres protocoles

| Protocole | Type | AD | Métrique | Convergence | Max distance |
|-----------|------|----|---------|--------------| -------------|
| **RIP** | Distance-vector | 120 | Hop count | Lente (minutes) | 15 sauts |
| **OSPF** | Link-state | 110 | Bande passante | Rapide (secondes) | Illimitée |
| **EIGRP** | Hybride | 90 | Composite | Rapide (secondes) | 255 sauts |

## Connexions

- [[ROUTAGE - statique]] - Alternative manuelle
- [[Routage Cisco - Distance administrative]] - Priorité RIP (120)
- [[OSPF - Open Shortest Path First]] - Protocole moderne recommandé
- [[EIGRP - Enhanced Interior Gateway Routing Protocol]] - Protocole Cisco
- [[TTL - Time To Live]] - Similaire au hop count

---
**Sources** : RFC 1058 (RIPv1), RFC 2453 (RIPv2), Cisco RIP Configuration Guide
