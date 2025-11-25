---
type: permanent
created: 2025-11-25 15:30
tags:
  - permanent
  - réseau
  - broadcast
  - smpte
  - vidéo
source: "Formation Réseau - 2110"
---

# SMPTE 2110 - transport multimédia par IP

> [!abstract] Concept
> SMPTE 2110 est une norme de transport de flux vidéo, audio et métadonnées professionnels sur réseau IP, remplaçant progressivement les connexions SDI traditionnelles en production audiovisuelle.

## Explication

La **norme SMPTE 2110** permet le transport de contenus multimédia broadcast (vidéo, audio, métadonnées) sur infrastructure réseau IP standard, en remplacement des câbles SDI coaxiaux.

**Publié par** : SMPTE (Society of Motion Picture and Television Engineers)
**Status** : Open source, standardisé

## Principe fondamental

**Séparation des essences** :
- Contrairement au SDI (tout dans un câble), SMPTE 2110 sépare :
  - **Vidéo** → flux multicast distinct
  - **Audio** (16+ canaux) → flux multicast distinct
  - **Métadonnées** (timecode, sous-titres) → flux multicast distinct

**Avantage** : Flexibilité totale (un équipement peut s'abonner uniquement à l'audio, ou seulement à la vidéo).

## Infrastructure réseau typique

### Topologie Spine-Leaf
```
        [Spine Core]
       /    |    \
   [Leaf] [Leaf] [Leaf]
    |      |       |
  Cam1   Mix1    Enreg1
```

### Trois réseaux séparés
1. **Control LAN** : Administration, orchestration (VSM, Cerebrum)
2. **Media LAN Rouge** : Transport flux primaire
3. **Media LAN Bleu** : Transport flux redondant (SMPTE 2022-7)

## Transport réseau

**Encapsulation** :
- **Couche 7** : Flux essences (vidéo/audio brut)
- **Couche 5** : RTP (Real-time Transport Protocol)
- **Couche 4** : UDP (pas de contrôle, latence minimale)
- **Couche 3** : IP Multicast (239.x.x.x)

**Débits** (vidéo HD 1080p 4:2:2 10 bits) :
```
1920 × 1080 × 25 fps × 10 bits × (Y + Cb + Cr) = ~1.037 Gbps
```

**Audio** (24 bits, 48 kHz) : ~1.152 Mbps par canal

## Standards associés

### Famille SMPTE 2110
- **2110-10** : Timing et synchronisation
- **2110-20** : Vidéo non compressée
- **2110-21** : Gestion du trafic (NL, N, W)
- **2110-22** : Vidéo JPEG XS (compression légère)
- **2110-30** : Audio PCM (basé sur AES67)
- **2110-31** : Audio AES3 (compressé)
- **2110-40/41/43** : Métadonnées, sous-titrage (TTML)

### Dépendances
- **SMPTE 2022-7** : Redondance réseau rouge/bleu
- **SMPTE 2059 (PTP)** : Synchronisation nanoseconde
- **NMOS (IS-04/IS-05)** : Découverte et orchestration équipements

## Caractéristiques techniques

### Synchronisation (critique)
- **PTP (Precision Time Protocol)** : IEEE 1588, précision nanoseconde
- Tous les équipements synchronisés sur horloge maître
- Nécessaire pour commutation "seamless"
- compatible uniquement PTPv2 (pas compatible avec PTPv1)

### Commutation
**No seamless** : Désabonnement → abonnement (coupure brève)
**Seamless** : Abonnement nouveau flux → désabonnement ancien (latence accrue, mais sans coupure)

### IGMP Snooping (obligatoire)
Sur switches L2, activer IGMP snooping pour éviter flood multicast :
```cisco
ip igmp snooping
```

## Cas d'usage

### Production TV en direct
- Caméras → Mélangeurs → Enregistreurs
- Chaque équipement s'abonne aux flux nécessaires
- Flexibilité totale de routage (matrice virtuelle)

### Post-production
- Plusieurs monteurs accèdent aux mêmes rushes
- Pas de duplication de fichiers
- Collaboration temps réel

### Événementiel
- Déploiement rapide (câbles Ethernet vs SDI)
- Longues distances (fibre optique)
- Évolutivité (ajout d'équipements sans rewiring)

## Avantages vs SDI

✅ **Flexibilité** : Routage dynamique par software
✅ **Scalabilité** : Infrastructure standard (switches Ethernet)
✅ **Économie** : Câbles moins chers, distances longues (fibre)
✅ **Interopérabilité** : Standard ouvert
✅ **Séparation essences** : Granularité fine

## Défis

❌ **Complexité réseau** : Configuration avancée requise
❌ **Synchronisation** : PTP obligatoire, configuration délicate
❌ **Latence variable** : Contrairement au SDI déterministe
❌ **Jitter / Perte paquets** : Nécessite FEC (Forward Error Correction)
❌ **Coût initial** : Switches 10/25/100 Gbps, formation équipes

## Connexions

### Notes liées
- [[SDI vs IP - comparaison broadcast]] - Différences fondamentales
- [[PTP - Precision Time Protocol]] - Synchronisation nanoseconde
- [[NMOS - découverte équipements broadcast]] - Orchestration
- [[RTP - Real-time Transport Protocol]] - Encapsulation temps réel
- [[SMPTE 2022-7 - redondance réseau]] - Haute disponibilité
- [[MULTICAST - diffusion groupe]] - Transport réseau
- [[IGMP - Internet Group Management Protocol]] - Abonnement flux

### Maps of Content
- [[MOC - SMPTE 2110 & Broadcast IP]] - Guide complet du domaine
- [[MOC - Réseau]] - Section Broadcast IP

---
**Sources** : Formation Réseau - 2110, SMPTE Standards
