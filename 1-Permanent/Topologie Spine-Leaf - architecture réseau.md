---
type: permanent
created: 2025-11-25 16:15
tags:
  - permanent
  - réseau
  - architecture
  - datacenter
  - broadcast
source: "Formation Réseau - 2110"
---

# Topologie Spine-Leaf - architecture réseau

> [!abstract] Concept
> La topologie Spine-Leaf est une architecture réseau à deux niveaux hiérarchiques (spine = cœur, leaf = accès) où chaque leaf est connecté à tous les spines, offrant une latence prévisible, une haute disponibilité et une grande scalabilité.

## Explication

La topologie **Spine-Leaf** remplace l'architecture **hiérarchique traditionnelle** (core/distribution/access) dans les datacenters et infrastructures broadcast IP modernes.

**Principe** : Deux niveaux seulement
- **Spine** : Switches cœur (backbone)
- **Leaf** : Switches d'accès (connexion équipements)

## Architecture

### Structure
```
        [Spine 1]     [Spine 2]     [Spine 3]
           |  \  \  /  /  |  \  \  /  /  |
           |   \  \/  /   |   \  \/  /   |
           |    /\  \/    |    /\  \/    |
           |   /  \/  \   |   /  \/  \   |
           |  /  /  \  \  |  /  /  \  \  |
        [Leaf1]  [Leaf2]  [Leaf3]  [Leaf4]
          |  |     |  |     |  |     |  |
        [Cam1,2] [Mix1,2] [Rec1,2] [Mon1,2]
```

### Règles de câblage
1. **Chaque Leaf connecté à TOUS les Spines**
2. **Aucune interconnexion Leaf ↔ Leaf**
3. **Aucune interconnexion Spine ↔ Spine**
4. **Équipements finaux connectés aux Leaf uniquement**

## Principe de routage

### Tout le trafic passe par Spine
```
Cam1 (Leaf1) → Spine1 → Leaf3 → Mix1
```

**Nombre de sauts** : Toujours **3 hops** maximum
- Leaf source → Spine → Leaf destination

### Comparaison avec architecture traditionnelle

#### Traditionnelle (Core/Distribution/Access)
```
Cam1 (Access) → Distribution → Core → Distribution → Access → Mix1
```
**5 hops**, latence variable selon emplacement.

#### Spine-Leaf
```
Cam1 (Leaf) → Spine → Leaf → Mix1
```
**3 hops** constants, latence prévisible.

## Avantages

### 1. Latence prévisible
✅ **Toujours 3 hops** entre deux équipements
✅ Critique pour broadcast IP (SMPTE 2110) : synchronisation PTP

### 2. Redondance native
✅ Plusieurs chemins entre Leaf
- Exemple : Leaf1 → Spine1 → Leaf2
- Ou : Leaf1 → Spine2 → Leaf2
✅ Si un Spine tombe, trafic redirigé automatiquement

### 3. Bande passante élevée
✅ Trafic distribué sur tous les Spines (ECMP - Equal-Cost Multi-Path)
✅ Pas de goulot d'étranglement unique

### 4. Scalabilité horizontale
✅ Ajouter capacité = ajouter Leaf (connecté à tous les Spines)
✅ Ajouter bande passante backbone = ajouter Spine

### 5. Simplicité de câblage
✅ Câblage structuré, prévisible
✅ Facilite dépannage et documentation

## Dimensionnement

### Règle de base
**Oversubscription ratio** : 3:1 ou moins recommandé

**Calcul** :
```
Leaf ports downstream : 32 ports × 10 Gbps = 320 Gbps
Leaf ports upstream   : 4 × 100 Gbps = 400 Gbps
Oversubscription      : 320 / 400 = 0.8:1 ✅ (parfait)
```

Si oversubscription > 3:1 → risque de congestion.

### Exemple datacenter
- **Spines** : 4 switches × 32 ports 100G
- **Leafs** : 20 switches × 48 ports 10G downstream + 4 ports 100G upstream
- **Capacité totale** : 960 ports 10G pour équipements

## Protocoles de routage

### OSPF
- Chaque Leaf et Spine = routeur
- **Area 0** (backbone) pour toute la topologie
- ECMP pour répartir charge

### BGP
- **Spine** = AS distinct
- **Leaf** = AS distinct
- eBGP entre Leaf et Spine
- Préféré dans datacenters modernes (plus flexible)

### VXLAN + EVPN
- Overlay pour segmentation L2 sur infrastructure L3
- Populaire dans datacenters virtualisés

## Configuration broadcast IP (SMPTE 2110)

### Multicast
Chaque Leaf doit :
- Supporter **PIM Sparse Mode**
- Activer **IGMP Snooping**

```cisco
ip multicast-routing
ip pim rp-address 10.0.0.1

interface range GigabitEthernet1/0/1-48
 ip pim sparse-mode
 ip igmp snooping
```

### PTP (Precision Time Protocol)
**Recommandation** :
- **Spine** : Boundary Clock
  - Se synchronise sur GPS Master
  - Devient Master pour tous les Leaf
- **Leaf** : Transparent Clock
  - Corrige latence pour équipements finaux

```
[GPS Master]
     |
[Spine - Boundary Clock]
  /    |    \
[Leaf] [Leaf] [Leaf]
(Transparent Clock)
```

### Redondance SMPTE 2022-7
- **Réseau Rouge** : Spine1 + Leafs rouges
- **Réseau Bleu** : Spine2 + Leafs bleus
- Infrastructures physiquement séparées

## Inconvénients

❌ **Coût initial élevé** : Switches haute densité 100G
❌ **Câblage intensif** : Leaf × Spine liens (beaucoup de fibres)
❌ **Complexité IP** : Routing L3 sur tous les switches
❌ **Overkill pour petits réseaux** : < 50 équipements, architecture simple suffit

## Cas d'usage

### Broadcast IP (SMPTE 2110)
- Studios TV modernes
- Régies de production
- Datacenters vidéo

**Raisons** :
- Latence prévisible (PTP)
- Multicast efficace
- Haute disponibilité (redondance native)

### Datacenters
- Cloud providers (AWS, Azure, Google)
- Entreprises (serveurs, virtualisation)

**Raisons** :
- Scalabilité (milliers de serveurs)
- Trafic est-ouest élevé

### Pas adapté pour :
- Réseaux campus (bâtiments distants)
- Petites infrastructures (< 50 équipements)
- Réseaux WAN (latence géographique)

## Évolution : Fat-Tree

**Fat-Tree** = Extension Spine-Leaf à 3+ niveaux
```
         [Core]
       /   |    \
   [Spine] [Spine] [Spine]
     /|\     /|\     /|\
   [Leaf] [Leaf] [Leaf] ...
```

Pour datacenters massifs (>10,000 serveurs).

## Comparaison avec autres topologies

| Topologie | Latence | Redondance | Scalabilité | Coût |
|-----------|---------|------------|-------------|------|
| **Spine-Leaf** | ⭐⭐⭐ Prévisible | ⭐⭐⭐ Native | ⭐⭐⭐ Excellente | 💰💰💰 Élevé |
| **Hiérarchique** | ⭐⭐ Variable | ⭐⭐ Limitée | ⭐⭐ Moyenne | 💰💰 Moyen |
| **Mesh complet** | ⭐⭐⭐ Minimale | ⭐⭐⭐ Maximale | ⭐ Très limitée | 💰💰💰💰 Prohibitif |
| **Ring** | ⭐ Variable | ⭐⭐ Moyenne | ⭐ Faible | 💰 Faible |

## Vérification

### Vérifier connectivité Spine ↔ Leaf
```cisco
show cdp neighbors  ! Cisco
show lldp neighbors ! Standard
```

Chaque Leaf doit voir tous les Spines.

### Vérifier routage multicast
```cisco
show ip mroute
show ip pim neighbor
```

Tous les Spines doivent être voisins PIM de tous les Leafs.

### Tester latence
```bash
ping -c 100 <IP_destination>
```

Vérifier que latence est constante (~1-2 ms en 10G).

## Connexions

- [[SMPTE 2110 - transport multimédia par IP]] - Architecture typique
- [[PTP Clock modes - Ordinary Transparent Boundary]] - Boundary sur Spine
- [[MULTICAST - diffusion groupe]] - Routage sur Spine-Leaf
- [[SMPTE 2022-7 - redondance réseau]] - Deux infrastructures Spine-Leaf

---
**Sources** : Formation Réseau - 2110, Datacenter Network Design
