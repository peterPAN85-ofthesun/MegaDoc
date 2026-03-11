---
type: permanent
created: 2026-03-11
tags:
  - permanent
  - broadcast
  - sony
  - mls-x1
  - frame-memory
  - clip-player
---

# MLS-X1 - Frame Memory vs Clip Player

> [!abstract] Concept
> Le MLS-X1 propose deux systèmes de lecture de contenu : la **Frame Memory (FM)**, intégrée nativement (aucune option requise), et le **Clip Player**, qui nécessite une carte GPU (MKS-X1600) + une licence (MZS-X1800). La FM est plus polyvalente (stills, enregistrement, vitesse variable jusqu'à ×2) ; le Clip Player est optimisé pour les contenus longs.

## Source

User's Guide MLS-X1S/MLS-X1 – Chapitres 10 (Frame Memory, pp.189-199) et 11 (Clip Players, pp.200-206)

---

## Disponibilité et prérequis

| Critère | Frame Memory (FM1–FM16) | Clip Player (Clip1–Clip4) |
|---|---|---|
| **Disponibilité native** | ✅ Aucune carte ni licence requise | ❌ Requiert MKS-X1600 + MZS-X1800 |
| **Carte GPU (MKS-X1600)** | ❌ Non requise | ✅ Obligatoire |
| **Licence logicielle** | ❌ Aucune | ✅ MZS-X1800 Clip Player License |

> Sur MLS-X1S, le GPU est optionnel. Sur MLS-X1, le GPU est intégré mais la licence Clip Player reste nécessaire.

---

## Capacité et canaux

| Critère | Frame Memory | Clip Player |
|---|---|---|
| **Canaux de sortie — HD** | 16 canaux (FM1–FM16) | 4 canaux (Clip 1–4) |
| **Canaux de sortie — 4K** | 6 à 12 canaux selon config box | 2 canaux (Clip 1 et 2 liés) |
| **Mode groupe (V/K)** | ✅ Ex. FM1+FM2 | ✅ Ex. Clip1+Clip2 |
| **Capacité work area** | ~1640 frames (2160P) / ~6500 frames (1080P) | Jusqu'à 1h max à 18 Mbps |
| **Durée maximale** | ⚠ Limitée par frames en work area | ✅ Jusqu'à 1h à 18 Mbps / 30 min à 35 Mbps |

> En 4K, les 2 canaux Clip Player sont **liés** et opèrent ensemble sur tous les box.
> Le Clip Player est plus adapté aux **contenus longs**. La FM est pensée pour des **séquences courtes**.

---

## Formats supportés

| Critère | Frame Memory | Clip Player |
|---|---|---|
| **Import vidéo** | ✅ MOV, MP4 | ✅ MOV, MP4 |
| **Import images fixes** | ✅ TIFF, BMP, TARGA, PNG | ❌ Vidéo uniquement |
| **Import audio** | ✅ WAV (PCM), M4A (AAC) | ✅ WAV (PCM), M4A (AAC) |
| **Formats audio** | 32/44.1/48 kHz, 16/24 bit | 32/44.1/48 kHz, 16/24 bit |
| **Codec vidéo** | MPEG-4 AVC / H.264 | MPEG-4 AVC / H.264 |
| **Sous-échantillonnage couleur** | ✅ 4:2:0 ET 4:2:2 | ⚠ 4:2:0 uniquement |
| **Profondeur de bits vidéo** | ✅ 8 bits et 10 bits | ⚠ 8 bits uniquement |

> La FM supporte la **4:2:2 10 bits**, plus adaptée aux sources broadcast.

---

## Fonctions de lecture

| Critère | Frame Memory | Clip Player |
|---|---|---|
| **Lecture vidéo animée** | ✅ | ✅ |
| **Lecture d'image fixe (still)** | ✅ | ❌ |
| **Point d'entrée / sortie** | ✅ | ✅ |
| **Loop** | ✅ Loop et Ping-Pong | ✅ Loop uniquement |
| **Lecture en sens inverse** | ✅ | ❌ |
| **Vitesse variable** | ✅ 0% à 200% (VAR / JOG / SHUTTLE) | ⚠ 0% à 100% uniquement |
| **Lecture audio** | ✅ (coupé en vitesse variable et sens inverse) | ✅ (coupé en vitesse variable) |
| **Trimming du contenu** | ✅ Supprime définitivement les frames hors plage | ❌ Non disponible |

> La FM peut accélérer jusqu'à **×2**. Le Clip Player ne dépasse pas la vitesse normale.
> La FM propose en plus le mode **Ping-Pong** (aller-retour automatique).

---

## Capture et enregistrement

| Critère | Frame Memory | Clip Player |
|---|---|---|
| **Capture d'image fixe (Freeze depuis bus)** | ✅ Depuis n'importe quel signal du bus source | ❌ Lecture uniquement |
| **Enregistrement vidéo (Record)** | ✅ Depuis programme ou tout signal | ❌ Lecture uniquement |
| **Export vers ordinateur** | ✅ | ✅ |
| **Persistance à l'extinction** | ❌ Work area perdue — sauvegarde nécessaire | ❌ Work area perdue — sauvegarde nécessaire |

---

## Intégration système

| Critère | Frame Memory | Clip Player |
|---|---|---|
| **Assignation sur boutons XPT** | ✅ FM1–FM16 | ✅ Clip1–Clip4 |
| **Source de key (V/K)** | ✅ Mode V/K | ✅ Via contenu combiné |
| **Contrôle via device control block** | ✅ Mode DEV | ✅ Mode DEV |
| **Sauvegarde snapshot / effect timeline** | ✅ Avec restrictions | ⚠ Non mentionné explicitement |
| **Fonctionnement par box** | Canaux liés entre box si même canal assigné | Contenu chargé sur tous les box du switcher |

---

## Liens

- [[MLS-X1 - Référentiel matériel (modèles, cartes, licences)]]
- [[MLS-X1 - Ressources par configuration (4K vs HD)]]
- [[MLS-X1 - Notes importantes et restrictions]]
- [[MOC - Sony MLS-X1]]
