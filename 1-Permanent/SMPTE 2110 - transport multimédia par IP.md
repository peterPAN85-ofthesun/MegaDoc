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
- **2110-30** : Audio PCM non compressé (basé sur AES67)
- **2110-31** : Audio AES3 (compressé)
- **2110-40/41/43** : Métadonnées, sous-titrage (TTML)

### Détails SMPTE 2110-30 (Audio PCM)

**Base** : Standard AES67 (audio sur IP)
**Format** : PCM non compressé
**Taille paquet** : 1460 octets

**Trois profils standardisés** :

| Profil | Latence | Fréquence | Canaux | Usage typique |
|--------|---------|-----------|--------|---------------|
| **A** | 1 ms | 48 kHz | 8 canaux | Production standard |
| **B** | 1 ms | 48 kHz | 16 canaux | Multi-canaux étendu |
| **C** | 125 µs | 48 kHz | 64 canaux | Ultra-faible latence |

**Principe** : Pour augmenter le nombre de canaux, on réduit la latence entre paquets, ce qui augmente le débit global.

### Détails SMPTE 2110-20 (Vidéo non compressée)

**Formats supportés** :
- Définitions : jusqu'à 32K × 32K pixels
- Espaces colorimétriques : YCbCr, RGB, XYZ, ICtCp
- Échantillonnages : 4:2:2/10, 4:2:2/12, 4:4:4/16, 4:2:0/12, KEY/16

**Particularité** : Seule la **partie active de l'image** est transmise (pas les blanking horizontaux/verticaux).

**Calcul débit vidéo HD 4:2:2** :
```
1920 × 1080 px × 25 fps × 10 bits × (1 + 0.5 + 0.5) = 1.037 Gbps
```

### Détails SMPTE 2110-22 (Vidéo JPEG XS)

**Compression légère** : JPEG XS (ISO/IEC 21122)
- Taux compression : 2:1 à 10:1
- Latence : < 1 ligne (ultra-faible)
- Qualité : Visuellement sans perte

**Avantage** : Réduit bande passante (4K → 1-2 Gbps au lieu de 12 Gbps) tout en gardant qualité broadcast.

### Détails SMPTE 2110-31 (Audio AES3 compressé)

**Format** : Audio AES3 (Audio Engineering Society)
- Données audio compressées ou non-compressées
- Compatible avec équipements AES3 legacy

**Différence avec 2110-30** :
- 2110-30 = PCM pur (non compressé)
- 2110-31 = AES3 (peut inclure compression)

### Détails SMPTE 2110-40/41/43 (Métadonnées)

**2110-40** : Ancillary Data (métadonnées SDI embarquées)
- Timecode, closed captions, tally
- Format hérité du SDI (VANC/HANC)

**2110-41** : Fast Metadata
- Métadonnées temps réel rapides
- Signalisation, contrôle

**2110-43** : Sous-titrage TTML (Timed Text Markup Language)
- Basé sur XML
- Meilleure indexation que closed captions traditionnels
- Support multi-langues, styling avancé

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

## SDI vs IP - Tableau comparatif

| SDI | Réseau IP (SMPTE 2110) |
|-----|------------------------|
| **Commutation de circuit** | **Commutation de paquets** |
| Connexions statiques | Connexions dynamiques (routage) |
| Bande passante garantie | "Best Effort" (nécessite QoS) |
| Déterministe | Probabiliste |
| Mono signal unidirectionnel | Multi-signaux |
| Synchrone | Asynchrone (nécessite PTP) |
| Temps réel | Non temps réel / Jitter / Reordering |
| Basse latence (~0 ms) | Latence variable (dépend utilisation) |
| Pas (très peu) d'erreur (BER faible) | Perte paquets / FEC / Re-Tx |
| Point à Point | "Any to any" |

**Débit SDI HD** : 1.485 Gbps (tout inclus : vidéo + 16 audio + métadonnées)

**Équipement transition** : **Gateway** (conversion SDI ↔ IP)

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
