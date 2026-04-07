---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - broadcast
  - sdi
  - transport
---

# SDI - Débits et interfaces 1.5G 3G 12G

> [!abstract] Concept
> Le SDI (Serial Digital Interface) est le standard de transport de signal vidéo non compressé en broadcast professionnel. Il existe en plusieurs variantes de débit (1,5G, 3G, 12G) pour accommoder les formats de HD à UHD.

## Explication

Le **SDI** est défini par la famille de normes SMPTE. Le signal est transporté sur câble coaxial 75Ω (BNC) ou fibre optique. La fréquence de ligne détermine le débit maximal supportable.

**HD-SDI (1,5G — SMPTE ST 292)** : supporte 1080i50, 1080p25, 720p50. Le débit brut est de 1,485 Gbps (≈ 1,5G). C'est le standard dominant des infrastructures HD. Un câble coaxial standard peut transporter ce signal sur plusieurs dizaines de mètres.

**3G-SDI (SMPTE ST 424)** : supporte 1080p50. Deux sous-variantes :
- **3G-A** : signal unique 3G transporté sur un câble (équivaut à un seul lien 1,5G restructuré)
- **3G-B** : deux signaux 1,5G multiplexés dans un câble 3G — plus économique en câblage

**12G-SDI (SMPTE ST 2082)** : supporte UHD 50p (3840×2160p50) sur un seul câble. Equivalent à 8× la HD-SDI de base. Nécessite des connecteurs BNC et câbles de qualité supérieure, avec des contraintes de distance plus strictes.

L'UHD 50p peut aussi être transporté sur 4 câbles 3G ou 4 câbles HD-SDI, selon la méthode SQD ou 2SI (voir note dédiée).

## Exemples

### Exemple 1 — Calcul de débit UHD 50p
```
3840 × 2160 × 50 fps × 10 bits × 2 (Y+CbCr en 4:2:2)
= 3840 × 2160 × 50 × 20 bits
≈ 8,3 Gbps débit actif → ~12G avec overhead
```

### Exemple 2 — Infrastructure régie
Une régie HD dispose de 50 câbles BNC 1,5G. Pour passer à l'UHD :
- Option économique : utiliser 4 câbles 3G existants en mode SQD ou 2SI
- Option moderne : remplacer par des câbles 12G (investissement plus important mais câblage simplifié)

## Cas d'usage

- **HD-SDI 1,5G** : Tout environnement HD broadcast classique, caméras, mélangeurs, moniteurs HD
- **3G-SDI** : Régie Full HD progressive (1080p), caméras UHD raccordées sur 4 liens 3G
- **12G-SDI** : Studio full UHD nouvelle génération, connexions caméras UHD directes

## Avantages et inconvénients

✅ **Avantages du SDI** :
- Signal non compressé = qualité maximale sans latence de décompression
- Robustesse éprouvée sur câble coaxial
- Interopérabilité universelle entre équipements broadcast

❌ **Inconvénients** :
- Câblage physique lourd (coaxial rigide) vs IP (Ethernet léger)
- Distance limitée (100-200m en 3G, moins en 12G sans répéteur)
- Infrastructure 12G coûteuse à déployer sur des régies existantes

## Connexions

### Notes liées
- [[Transport UHD multi-câbles - SQD vs 2SI]] — méthodes de transport UHD sur plusieurs câbles 3G
- [[Transition HD vers UHD - Quatre axes d'amélioration]] — les débits découlent directement des nouveaux formats
- [[VPID - Signalisation du signal vidéo SDI]] — chaque signal SDI embarque un identifiant de type

### Dans le contexte de
- [[MOC - SMPTE 2110 & Broadcast IP]] — le SDI est l'alternative à la distribution IP
- [[MOC - UHD & HDR]] — infrastructure physique de transport UHD

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]]
- Normes : SMPTE ST 292 (HD), SMPTE ST 424 (3G), SMPTE ST 2082 (12G)

---

**Tags thématiques** : `#sdi` `#broadcast` `#transport` `#uhd-hdr` `#infrastructure`
