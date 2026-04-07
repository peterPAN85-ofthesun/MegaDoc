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

- Source principale : [[0-Inbox/Archive/Formation UHD - HDR]] (formation IIFA / Média 180, 2026-04-07)
- Document de référence : FTV PAD UHD - Spécifications V0.9, octobre 2024
- Norme centrale : ITU-R BT.2100 (2018)
- Standard EBU broadcast HDR : R137 (HLG recommandé pour le live)

---

## 🚧 À développer

- [ ] Workflow étalonnage HDR (DaVinci Resolve)
- [ ] Monitoring de référence HDR (calibration moniteurs)
- [ ] Tone mapping SDR↔HDR
- [ ] S-Log / Log curves propriétaires Sony/ARRI
- [ ] Dolby Vision workflow détaillé
- [ ] JPEG XS pour transport UHD compressé (SMPTE 2110-22)

---

**Dernière mise à jour** : 2026-04-07
**Nombre de notes** : 16
