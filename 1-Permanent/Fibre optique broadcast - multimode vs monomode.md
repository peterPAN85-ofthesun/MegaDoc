---
type: permanent
created: 2025-12-18 14:30
tags:
  - permanent
  - réseau
  - broadcast
  - infrastructure
  - smpte
---

# Fibre optique broadcast - multimode vs monomode

> [!abstract] Concept
> En production broadcast, le choix entre fibre multimode et monomode dépend du compromis distance/coût, la multimode étant économique pour courtes distances tandis que la monomode permet des liaisons longues.

## Explication

Dans les infrastructures **SMPTE 2110** et broadcast IP, la fibre optique remplace progressivement le cuivre pour transporter les flux vidéo/audio haute résolution. Deux types de fibres coexistent :

### Fibre multimode (MMF)

**Caractéristiques** :
- **Longueur d'onde** : 850 nm (infrarouge proche)
- **Distance maximale** : ~300 mètres
- **Coût** : Moins cher (câbles et transceivers)
- **Principe** : Plusieurs modes de diffusion de la lumière dans le cœur de fibre

**Fonctionnement** : Le signal lumineux se propage selon plusieurs chemins (modes) dans le cœur large (50-62,5 µm), provoquant une dispersion modale limitant la distance.

### Fibre monomode (SMF)

**Caractéristiques** :
- **Longueur d'onde** : 1310 nm ou 1550 nm (infrarouge)
- **Distance maximale** : 10+ km (jusqu'à 80 km selon équipements)
- **Coût** : Plus cher (transceivers laser précis)
- **Principe** : Un seul mode de propagation dans cœur très fin (9 µm)

**Fonctionnement** : Le signal suit un chemin unique, éliminant la dispersion modale, permettant longues distances sans régénération.

## Exemples

### Cas d'usage multimode
**Studio TV compact** :
- Distances : 50-200 mètres
- Budget serré
- Débit : 10/25 Gbps suffisant
- **Choix** : Fibre multimode OM3/OM4

### Cas d'usage monomode
**Événementiel outdoor** :
- Caméras distantes de 5 km du car régie
- Besoin 4K/UHD (haute bande passante)
- Distances variables
- **Choix** : Fibre monomode OS2

### Comparaison pratique

| Critère | Multimode (OM4) | Monomode (OS2) |
|---------|-----------------|----------------|
| Distance 10G | 400 m | 10+ km |
| Distance 25G | 100 m | 10+ km |
| Coût transceiver | ~200€ | ~800€ |
| Coût câble/m | ~1€ | ~0,80€ |
| Usage broadcast | Studios, régie | Liaisons longues, campus |

## Connexions

### Notes liées
- [[SMPTE 2110 - transport multimédia par IP]] - Infrastructure réseau broadcast
- [[Topologie Spine-Leaf]] - Architecture nécessitant liaisons fibre
- [[SMPTE 2022-7 - redondance réseau]] - Double liaison fibre (rouge/bleu)

### Contexte

Le choix multimode/monomode impacte directement :
- **Budget infrastructure** : Transceivers représentent 70% du coût
- **Évolutivité** : Monomode permet upgrade vers 100G sans rechâbler
- **Fiabilité** : Longues distances monomode plus sensibles aux connecteurs sales

**Règle pratique** : Multimode pour distances < 300 m et budget contraint, monomode pour toute liaison > 500 m ou anticipation croissance débits.

## Sources
- Formation Réseau - 2110 (J2)
- Fiber Optic Association (FOA) - Broadcast Applications

---
**Tags thématiques** : #infrastructure #fibre #broadcast #smpte
