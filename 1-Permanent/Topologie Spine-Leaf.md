---
type: permanent
created: 2025-11-25 16:30
tags:
  - permanent
  - réseau
  - architecture
  - datacenter
  - redondance
---

# Topologie Spine-Leaf

> [!abstract] Concept
> Architecture réseau en deux couches (Spine et Leaf) où chaque switch Leaf est connecté à tous les switches Spine, offrant une latence prévisible, une bande passante élevée et une redondance complète.

## Explication

La topologie **Spine-Leaf** (épine-feuille) est une architecture réseau moderne utilisée dans les **datacenters** et les environnements **broadcast** IP pour remplacer l'architecture hiérarchique classique (core/aggregation/access).

### Structure en deux couches

**Couche Spine (épine dorsale)** :
- Switches de **cœur de réseau**
- Gèrent uniquement le **routage inter-Leaf**
- Ne connectent jamais d'équipements finaux
- Typiquement : 2 à 4 switches Spine

**Couche Leaf (feuilles)** :
- Switches d'**accès**
- Connectent les **équipements finaux** (serveurs, caméras, encodeurs)
- Chaque Leaf est connecté à **tous les Spine**
- Scalabilité horizontale : ajout de Leaf selon besoin

### Principe de connexion

```
      [Spine 1]    [Spine 2]
         |  \    /  |  \    /
         |   \  /   |   \  /
         |    \/    |    \/
         |    /\    |    /\
         |   /  \   |   /  \
      [Leaf 1]  [Leaf 2]  [Leaf 3]
         |         |         |
     [Serveurs] [Caméras] [Encodeurs]
```

**Règle d'or** : Chaque Leaf se connecte à **chaque Spine**, mais les Leaf ne se connectent **jamais entre eux** directement.

## Avantages

### Latence prévisible
- **Tout trafic = 2 sauts maximum** (Leaf → Spine → Leaf)
- Contrairement à l'architecture hiérarchique (jusqu'à 6 sauts)
- Essentiel pour le **broadcast temps réel** (SMPTE 2110)

### Bande passante élevée
- **Plusieurs chemins** entre deux Leaf (via différents Spine)
- Load balancing via **ECMP** (Equal-Cost Multi-Path)
- Pas de goulot d'étranglement unique

### Redondance native
- **Aucun SPOF** (Single Point of Failure)
- Si un Spine tombe → trafic bascule sur les autres Spine
- Si un lien tombe → autres liens disponibles
- Compatible avec **SMPTE 2022-7** (redondance applicative)

### Scalabilité horizontale
- Ajouter de la capacité = ajouter des **Leaf**
- Pas de refonte d'architecture
- Croissance linéaire

## Inconvénients

❌ **Coût** : Nombre élevé de ports (chaque Leaf connecté à tous les Spine)
❌ **Câblage** : Complexité physique (nombreux liens Leaf-Spine)
❌ **Oversubscription** : Possible si dimensionnement insuffisant des liens Spine

## Dimensionnement typique

### Exemple datacenter broadcast (SMPTE 2110)

**Spine** :
- 2 switches Spine (redondance)
- 32 ports 100G chacun
- Agrégation : 6,4 Tbps par Spine

**Leaf** :
- 16 switches Leaf
- 48 ports 10G (équipements) + 4 ports 100G (uplink Spine)
- Chaque Leaf : 2× uplinks 100G (1 vers chaque Spine)

**Capacité totale** : 768 ports 10G pour équipements finaux

## Cas d'usage

### Datacenters modernes
- Cloud computing
- Virtualisation massive
- Trafic est-ouest élevé (serveur à serveur)

### Broadcast IP (SMPTE 2110)
- Production TV en direct
- Flux vidéo/audio non compressés
- Latence critique (<1ms)
- Redondance obligatoire

### Environnements à haute disponibilité
- Services financiers
- Télécommunications
- Services critiques

## Configuration réseau

### Adressage Leaf-Spine (exemple)

**Liens Spine** :
- Spine 1 : `10.1.0.0/16`
- Spine 2 : `10.2.0.0/16`

**Liens Leaf** :
- Leaf 1 → Spine 1 : `10.1.1.0/31`
- Leaf 1 → Spine 2 : `10.2.1.0/31`
- Leaf 2 → Spine 1 : `10.1.2.0/31`
- Leaf 2 → Spine 2 : `10.2.2.0/31`

**Protocoles de routage** :
- **BGP** : Standard pour Spine-Leaf (EVPN, VXLANs)
- **OSPF** : Alternative (underlay routing)

## Différence avec architecture hiérarchique

| Aspect | **Spine-Leaf** | **Hiérarchique (3 tiers)** |
|--------|----------------|---------------------------|
| **Sauts maximum** | 2 (prévisible) | 6 (variable) |
| **Redondance** | Native (tous chemins actifs) | Nécessite STP (chemins bloqués) |
| **Scalabilité** | Horizontale (ajout Leaf) | Verticale (upgrade core) |
| **Latence** | Constante | Variable selon chemin |
| **Coût** | Élevé (nombreux ports) | Moyen |
| **Complexité câblage** | Élevée | Moyenne |

## Connexions

- [[SMPTE 2022-7 - redondance réseau]] - Utilise Spine-Leaf pour haute disponibilité
- [[SMPTE 2110 - transport multimédia par IP]] - Architecture réseau recommandée
- [[BGP - Border Gateway Protocol]] - Protocole de routage Spine-Leaf

---
**Sources** : Formation Réseau - Architectures datacenter, SMPTE 2110 Best Practices
