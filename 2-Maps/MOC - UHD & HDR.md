---
type: moc
created: 2026-04-07 14:00
updated: 2026-04-07 14:00
tags:
  - moc
  - index
  - uhd-hdr
  - broadcast
  - colorimétrie
  - hdr
---

# MOC - UHD & HDR

> [!note] Vue d'ensemble
> Domaine couvrant la transition broadcast de la HD vers l'UHD et le HDR : fondamentaux colorimétrie, courbes de transfert (HLG/PQ), espaces couleur (Rec.709/Rec.2020), transport SDI, et normes de livraison.

---

## 🎨 Colorimétrie et encodage

### Fondamentaux
- [[Encodage couleur vidéo - RGB vs YCbCr]] — deux paradigmes de représentation couleur
- [[Sous-échantillonnage chromatique - 4:2:2 4:4:4 4:2:0]] — répartition Cb/Cr dans l'image
- [[Gamma vidéo - OETF et EOTF]] — courbes de transfert capteur↔écran
- [[OOTF - Fonction de transfert opto-optique HLG]] — OOTF HLG : lumière de scène → luminance d'affichage
- [[Narrow Range vs Full Range - Plages de codage vidéo]] — plages de codage SDR (64-940 vs 0-1023)
- [[Dynamique en image - Stops et Nits]] — mesure de la dynamique en stops et en nits

### Espaces colorimétriques
- [[Rec.2020 - Espace colorimétrique UHD]] — espace cible UHD (~75,8% CIE xy)

---

## 📺 Transition HD → UHD

- [[Transition HD vers UHD - Quatre axes d'amélioration]] — résolution, scan, bits, espace couleur
- [[HDR - Définition et deux dimensions]] — dynamique étendue + WCG, deux dimensions indépendantes

---

## 🔆 Courbes de transfert HDR

- [[HLG - Hybrid Log Gamma]] — rétro-compatible SDR, référence broadcast live (BBC/NHK)
- [[PQ - Perceptual Quantizer]] — luminance absolue, cinéma/premium (Dolby/SMPTE ST 2084)
- [[ITU-R BT.2100 - Norme HDR]] — norme cadre unifiant HLG, PQ, Rec.2020
- [[Métadonnées HDR - MaxCLL MaxFALL statiques et dynamiques]] — MaxCLL/MaxFALL, HDR10+, Dolby Vision

## 📋 Normes et niveaux de production HDR

- [[ITU-R BT.2408 - Niveaux nominaux et bonnes pratiques production HDR]] — niveaux nominaux, Reference White 203 nits PQ / 75% HLG
- [[Conditions d'observation de référence HDR - BT.2100-3]] — environnement monitoring (luminance, distance, ambiant)
- [[Niveaux nominaux HDR - Teintes de peaux et Échelle Fitzpatrick]] — plages PQ/HLG par type de peau (Fitzpatrick I–VI)

## 🔄 Conversions HDR-SDR

- [[Conversions HDR-SDR - Tone Mapping Inverse TM Direct Mapping]] — TM, ITM, Direct Mapping, Hard Clipping
- [[Display Light vs Scene Light - Conversion SDR vers HDR]] — deux approches : colorimétrie moniteur vs signal capteur
- [[Transcoding HDR - PQ vers HLG via Display Light]] — passage obligatoire par le display light comme référence commune

## 🧮 LUTs HDR

- [[LUT broadcast HDR - Types BBC et interpolation]] — Types I/II/III, 3D 33×33×33, Tetrahedral, IMAGINE SNP

## 🎬 Workflow HDR

- [[Workflow production simultanée HDR-SDR]] — HDR-focused camera shading, BT.2408-8 §7.2

---

## 📡 Transport SDI

- [[SDI - Débits et interfaces 1.5G 3G 12G]] — standards de transport SDI selon le format
- [[Transport UHD multi-câbles - SQD vs 2SI]] — 4 câbles 3G : quad spatial vs pixel interleave
- [[VPID - Signalisation du signal vidéo SDI]] — SMPTE ST352, identification type signal (4 valeurs HDR)

---

## 🎬 Codecs et livraison

- [[CODECs UHD-HDR 10 bits compatibles]] — ProRes, DNxHR, XAVC, HEVC — tableau comparatif
- [[Normes PAD FTV - Formats de livraison broadcast]] — specs France Télévisions (PAD V0.9, oct.2024)

---

## 🔗 Notes connexes

- [[MOC - SMPTE 2110 & Broadcast IP]] — transport vidéo sur IP (complémentaire au SDI)
- [[MOC - Sony MLS-X1]] — équipement broadcast Sony

---

## 📚 Ressources

- Source J1 : [[0-Inbox/Archive/Formation UHD - HDR]] (formation IIFA / Média 180, 2026-04-07)
- Source J2 : [[0-Inbox/Formation UHD - HDR J2]] (formation IIFA / Média 180, 2026-04-08)
- Document de référence : FTV PAD UHD - Spécifications V0.9, octobre 2024
- Norme centrale : ITU-R BT.2100 (2018)
- Standard EBU broadcast HDR : R137 (HLG recommandé pour le live)

---

## 🚧 À développer

- [ ] Workflow étalonnage HDR (DaVinci Resolve)
- [ ] S-Log / Log curves propriétaires Sony/ARRI
- [ ] Dolby Vision workflow détaillé
- [ ] JPEG XS pour transport UHD compressé (SMPTE 2110-22)

---

**Dernière mise à jour** : 2026-04-08
**Nombre de notes** : 25
