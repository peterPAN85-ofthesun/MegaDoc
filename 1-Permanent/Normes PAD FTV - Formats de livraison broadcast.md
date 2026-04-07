---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - broadcast
  - livraison
  - ftv
---

# Normes PAD FTV - Formats de livraison broadcast

> [!abstract] Concept
> Les normes PAD (Programme Availability Data) FTV définissent les spécifications techniques de livraison de fichiers vidéo pour France Télévisions, incluant les formats UHD-HDR avec leurs codecs, débits, espaces couleur et wrappers acceptés.

## Explication

France Télévisions (FTV) publie ses **spécifications PAD** (Programme Availability Data) qui définissent précisément les formats acceptés pour la livraison de contenus. Ces specs sont un document de référence pour les producteurs, post-productions et prestataires travaillant avec le groupe.

**Formats acceptés selon les spécifications FTV (source : FTV PAD UHD - Spécifications V0.9, octobre 2024) :**

| Format | Résolution | Scan | Espace couleur | Échantillonnage | HDR | Référence CST | Codec livrable | Débit |
|--------|------------|------|----------------|-----------------|-----|---------------|----------------|-------|
| 1080i50 SDR | 1920×1080 | 50i | Rec.709 | 8 bits | Non | RT-040 | MXF Op1a / SMPTE RDD 9 / AS-10 / XDCAM | 50 Mbps |
| 2160p25 HDR | 3840×2160 | 25p | Rec.2020 | 10 bits | Oui (BT.2100 HLG) | Work In Progress | MXF Op1a / SMPTE RDD 32 / XAVC Class 300 CBG | 250 Mbps |
| 2160p50 HDR | 3840×2160 | 50p | Rec.2020 | 10 bits | Oui (BT.2100 HLG) | Work In Progress | MXF Op1a / SMPTE RDD 32 / XAVC Class 300 CBG | 500 Mbps |
| 1080p25 HDR | 1920×1080 | 25p | Rec.2020 | 10 bits | Oui (BT.2100 HLG) | Work In Progress | MXF Op1a / SMPTE RDD 32 / XAVC Class 100 CBG | 112 Mbps |
| 1080p50 HDR | 1920×1080 | 50p | Rec.2020 | 10 bits | Oui (BT.2100 HLG) | Work In Progress | MXF Op1a / SMPTE RDD 32 / XAVC Class 100 CBG | 223 Mbps |

**Points clés :**
- Le format 1080i50 SDR reste le standard établi (RT-040)
- Les formats HDR utilisent tous **HLG** (pas PQ) — choix cohérent avec la rétro-compatibilité broadcast
- Le wrapper est systématiquement **MXF Op1a** (standard broadcast)
- Les codecs HDR utilisent **XAVC Class 300** (UHD) ou **Class 100** (HD) en CBG (Constant Bit Rate mode Group)
- Les formats MGA (audio multi-groupe) et les formats 1080p HDR sont mentionnés comme "Démarrage en stéréo uniquement"

## Exemples

### Exemple 1 — Livraison documentaire UHD 25p
Spec: MXF Op1a, SMPTE RDD 32, XAVC Class 300 CBG, Rec.2020 10 bits, HLG, 250 Mbps. Un fichier de 52 minutes pèse ~97 Go.

### Exemple 2 — Livraison direct sport UHD 50p
Spec: 500 Mbps, XAVC Class 300 CBG. Un match de 90 minutes = ~337 Go.

## Cas d'usage

- **Post-production travaillant pour FTV** : Guide de configuration des exports et livraisons
- **Choix codec caméra** : XAVC est le codec de référence FTV → favoriser Sony XAVC-I
- **Dimensionnement stockage** : Calculer l'espace disque nécessaire selon le format choisi

## Avantages et inconvénients

✅ **Avantages des specs PAD** :
- Interopérabilité garantie entre producteurs et diffuseurs
- Un seul fichier master suffisant (HLG rétro-compatible SDR)
- Débits bien définis pour le dimensionnement infrastructure

❌ **Inconvénients** :
- Certaines specs UHD-HDR encore "Work In Progress" (no référence CST définitive)
- Débits très élevés en UHD 50p (500 Mbps) → stockage et transfert coûteux
- Exclusivement XAVC → dépendance à l'écosystème Sony

## Connexions

### Notes liées
- [[CODECs UHD-HDR 10 bits compatibles]] — les codecs acceptés par FTV
- [[HLG - Hybrid Log Gamma]] — choix HDR de FTV pour ses livraisons
- [[Rec.2020 - Espace colorimétrique UHD]] — espace couleur requis pour les livraisons UHD HDR

### Dans le contexte de
- [[Transition HD vers UHD - Quatre axes d'amélioration]] — les specs PAD FTV illustrent concrètement la transition
- [[MOC - UHD & HDR]] — référence pratique pour les livrables

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]] (image 20260407_115641.jpg — tableau Normes PAD FTV)
- Document : FTV PAD UHD - Spécifications V0.9, octobre 2024 (IIFA / Média 180)

---

**Tags thématiques** : `#ftv` `#broadcast` `#livraison` `#uhd-hdr` `#pad` `#xavc`

## Images sources

![[20260407_115641.jpg]]
