---
type: permanent
created: 2025-11-25 15:50
tags:
  - permanent
  - réseau
  - ptp
  - synchronisation
  - switch
source: "Formation Réseau - 2110"
---

# PTP Clock modes - Ordinary Transparent Boundary

> [!abstract] Concept
> Les switches réseau peuvent gérer le trafic PTP selon trois modes : Ordinary Clock (transparent au PTP), Transparent Clock (correction de latence), ou Boundary Clock (synchronisation hiérarchique), chacun offrant un compromis différent entre précision et complexité.

## Explication

Les **switches** introduisent de la **latence variable** lors du traitement des trames PTP. Cette latence dégrade la précision de synchronisation. Les trois modes PTP permettent de gérer cette problématique différemment.

## 1. Ordinary Clock (par défaut)

### Principe
Le switch **ne participe PAS au PTP** :
- Les trames PTP traversent le switch comme des données normales
- Aucun traitement spécial
- Aucune modification des trames

### Architecture
```
[MASTER] --PTP--> [Switch Ordinary] --PTP--> [FOLLOWER]
                   (transparent)
```

Le FOLLOWER reçoit les trames PTP directement du MASTER, mais avec une **latence variable** introduite par le switch.

### Caractéristiques

✅ **Simplicité** : Aucune configuration requise
✅ **Compatibilité** : Fonctionne avec tout équipement
✅ **Bas coût** : Pas besoin de switch PTP-aware

❌ **Précision limitée** : Latence switch non compensée (~µs à ms)
❌ **Jitter** : Variation de latence selon charge réseau

### Configuration
**Par défaut sur la plupart des switches.**

Aucune configuration nécessaire (ou explicitement) :
```cisco
! Mode par défaut (pas de commande spécifique)
```

### Cas d'usage
- Réseaux avec switches standard (non PTP-aware)
- Applications peu exigeantes (précision ~100 µs acceptable)
- Broadcast IP avec switches d'accès

---

## 2. Transparent Clock

### Principe
Le switch **mesure son délai interne** et **corrige les trames PTP** :
- Mesure le temps de traitement de la trame (residence time)
- Incrémente le champ `correctionField` dans les messages PTP
- Le FOLLOWER ajuste automatiquement ses calculs

### Architecture
```
[MASTER] --PTP--> [Switch Transparent] --PTP corrigé--> [FOLLOWER]
                   (mesure + corrige)
```

**Mécanisme** :
1. Trame PTP entre dans le switch à `t_in`
2. Trame sort du switch à `t_out`
3. Switch calcule `residence_time = t_out - t_in`
4. Switch ajoute `residence_time` au champ `correctionField`
5. FOLLOWER lit le `correctionField` et compense

### Types

#### One-Step Transparent Clock
- Correction appliquée immédiatement dans le paquet Sync

#### Two-Step Transparent Clock
- Correction envoyée dans le message Follow_Up

### Caractéristiques

✅ **Meilleure précision** : Latence switch compensée (~10-100 ns)
✅ **Simple pour FOLLOWER** : Correction automatique
✅ **Scalable** : Fonctionne en cascade

❌ **Trames modifiées** : Ne peut pas sortir du domaine PTP (problème si routage externe)
❌ **Coût switch** : Nécessite hardware PTP (timestamping)

### Configuration Cisco
```cisco
ptp mode transparent
```

### Cas d'usage
- Réseaux broadcast IP entièrement PTP-aware
- Précision élevée requise (< 1 µs)
- Réseau fermé (pas d'interconnexion externe)

---

## 3. Boundary Clock

### Principe
Le switch **se synchronise comme FOLLOWER** sur une interface, puis **devient MASTER** sur les autres :
- Port upstream : rôle FOLLOWER (se synchronise sur MASTER)
- Ports downstream : rôle MASTER (distribue synchronisation)

### Architecture
```
[MASTER] --PTP--> [Switch Boundary] --PTP--> [FOLLOWER 1]
                   |  (SLAVE)  (MASTER)  |
                   +--------------------> [FOLLOWER 2]
```

Le switch crée une **hiérarchie de synchronisation** :
- Chaque port downstream a son propre domaine PTP local
- Isolation des domaines PTP
- Synchronisation hiérarchique

### Caractéristiques

✅ **Meilleure précision** : Chaque segment optimisé indépendamment
✅ **Isolation** : Pannes localisées (une branche ne perturbe pas les autres)
✅ **Scalable** : Hiérarchie multi-niveaux possible
✅ **Interconnexion** : Peut sortir du réseau PTP (trames non modifiées)

❌ **Complexité config** : Chaque port doit être configuré (MASTER/SLAVE)
❌ **Convergence** : Cascade de synchronisations (latence accumulée)
❌ **Coût** : Nécessite switch PTP haute performance

### Configuration Cisco
```cisco
! Port upstream (vers MASTER)
interface GigabitEthernet0/1
 ptp role slave

! Ports downstream (vers FOLLOWERS)
interface GigabitEthernet0/2
 ptp role master

interface GigabitEthernet0/3
 ptp role master
```

### Cas d'usage
- Réseaux broadcast IP multi-sites
- Topologies Spine-Leaf (Spine = Boundary Clock)
- Interconnexion de domaines PTP distincts
- Haute disponibilité (isolation des pannes)

---

## Comparaison

| Mode | Précision | Complexité | Coût | Modifie trames | Scalabilité |
|------|-----------|------------|------|----------------|-------------|
| **Ordinary** | ~100 µs | ⭐ Faible | 💰 Bas | ❌ Non | ⚠️ Limitée |
| **Transparent** | ~100 ns | ⭐⭐ Moyenne | 💰💰 Moyen | ✅ Oui | ✅ Élevée |
| **Boundary** | ~10 ns | ⭐⭐⭐ Élevée | 💰💰💰 Élevé | ❌ Non | ✅ Très élevée |

## Choix du mode

### Ordinary Clock si :
- Budget limité (switches standard)
- Précision ~100 µs acceptable
- Réseau simple (peu de switches en cascade)

### Transparent Clock si :
- Précision élevée requise (< 1 µs)
- Réseau broadcast IP fermé
- Pas d'interconnexion externe

### Boundary Clock si :
- Précision maximale (< 100 ns)
- Réseau complexe multi-sites
- Haute disponibilité critique
- Interconnexion de domaines PTP

## Architecture typique broadcast IP

```
                   [GPS MASTER]
                        |
              [Spine - Boundary Clock]
              /        |         \
         [Leaf]     [Leaf]     [Leaf]
       (Transp.)  (Transp.)  (Transp.)
          |          |           |
        [Cam]      [Mix]       [Enreg]
      (Follower) (Follower)  (Follower)
```

**Recommandation SMPTE 2110** :
- **Spine** : Boundary Clock (isolation)
- **Leaf** : Transparent Clock (précision)
- **Équipements finaux** : Follower

## Vérification

```cisco
show ptp clock
show ptp port
```

**Exemple Boundary Clock** :
```
Interface GigabitEthernet0/1
  PTP Port Role: Slave
  PTP Port State: SLAVE

Interface GigabitEthernet0/2
  PTP Port Role: Master
  PTP Port State: MASTER
```

## Connexions

- [[PTP - Precision Time Protocol]] - Protocole de synchronisation
- [[SMPTE 2110 - transport multimédia par IP]] - Utilise PTP
- [[Topologie Spine-Leaf]] - Architecture avec Boundary Clocks

---
**Sources** : Formation Réseau - 2110, IEEE 1588
