---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - signal-vidéo
  - codage
---

# Narrow Range vs Full Range - Plages de codage vidéo

> [!abstract] Concept
> En vidéo numérique, la plage Narrow Range (ou Legal Range) réserve des valeurs aux extrêmes du codage pour des signaux techniques, tandis que le Full Range utilise l'intégralité de la plage disponible — un écart qui cause des erreurs de teintes si ignoré.

## Explication

En vidéo SD et HD, les signaux numériques YCbCr sont traditionnellement encodés en **Narrow Range** (aussi appelé Legal Range ou Studio Swing). Sur une plage de 10 bits (0 à 1023) :
- **Luminance Y** : 64 à 940 (le blanc pur vaut 940, le noir pur vaut 64)
- **Chrominance Cb/Cr** : 64 à 960 (centré sur 512)
- **Valeurs réservées** : 0 à 3 et 1020 à 1023 sont réservés pour la synchronisation et les codes d'identification de trame (SAV/EAV)

Le **Full Range** utilise l'intégralité 0 à 1023 (ou 0 à 255 en 8 bits). C'est la convention utilisée par les fichiers informatiques (PNG, TIFF), les espaces RGB en post-production, et les flux HDMI grand public.

La différence est invisible à l'œil, mais critique pour la chaîne de traitement. Si un signal Narrow Range est interprété comme Full Range, les noirs seront écrêtés et légèrement verdâtres. Dans le sens inverse, l'image apparaîtra fade avec des gris à la place des noirs et blancs purs.

## Exemples

### Exemple 1 — Narrow Range en broadcast SDR
Un signal SDI 1080i50 en Rec.709 : le blanc de référence (100% IRE) est encodé à 940 sur 10 bits. Les valeurs 941-1019 sont dites "super-white" — utilisables pour certains highlights mais hors standard de diffusion.

### Exemple 2 — Confusion sur un encodeur
Un opérateur exporte un fichier ProRes en Full Range mais l'encode en H.264 sans corriger : le décodeur reçoit un fichier codé "Legal" mais contenant des valeurs Full Range → les noirs apparaissent grisâtres sur la diffusion.

## Cas d'usage

- **Narrow Range** : Diffusion broadcast (SDI, HDMI broadcast), monitoring de référence, tous les signaux SDR standard
- **Full Range** : Fichiers de post-production, RGB en compositing, contenus pour le web/streaming (YouTube, Netflix)
- **Transition** : Les convertisseurs de format doivent systématiquement vérifier et corriger la plage lors des conversions

## Avantages et inconvénients

✅ **Avantages du Narrow Range** :
- Réservation de valeurs pour la signalisation technique (SAV/EAV)
- Standard broadcast universel depuis l'ère analogique
- Marges de sécurité pour les erreurs mineures de niveau

❌ **Inconvénients** :
- Gaspillage de ~12% de la plage dynamique disponible
- Source de confusion fréquente dans les workflows mixtes broadcast/informatique
- Erreurs subtiles difficiles à détecter visuellement

## Connexions

### Notes liées
- [[SDI - Débits et interfaces 1.5G 3G 12G]] — les signaux SDI transportent des données en Narrow Range
- [[Encodage couleur vidéo - RGB vs YCbCr]] — le Narrow Range s'applique au YCbCr, le Full Range est natif au RGB
- [[CODECs UHD-HDR 10 bits compatibles]] — chaque codec a des spécifications de plage précises

### Dans le contexte de
- [[Transition HD vers UHD]] — l'UHD hérite du Narrow Range SDR et l'étend avec 10 bits
- [[MOC - UHD & HDR]] — paramètre fondamental à surveiller dans tout workflow UHD

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]]
- Norme : SMPTE ST 292 (SD), SMPTE ST 274 (HD), ITU-R BT.2082 (UHD)

---

**Tags thématiques** : `#signal-vidéo` `#uhd-hdr` `#narrow-range` `#full-range` `#codage`
