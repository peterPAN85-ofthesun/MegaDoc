---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - hdr
  - courbe-transfert
---

# PQ - Perceptual Quantizer

> [!abstract] Concept
> PQ (Perceptual Quantizer, SMPTE ST 2084) est une courbe de transfert HDR développée par Dolby qui encode la luminance en valeur absolue (nits), basée sur le modèle de vision humaine de Barten, permettant une représentation précise de 0,0001 à 10 000 nits.

## Explication

**PQ** (aussi appelé PQ2084 ou HDR10) est la courbe de transfert définie par **SMPTE ST 2084** et normalisée dans **ITU-R BT.2100**. Contrairement à HLG dont l'échelle est relative, PQ est **référencé en luminance absolue** : chaque valeur de code correspond à une luminance précise en cd/m² (nits).

**Fonctionnement de la courbe :**
La courbe PQ est conçue pour maximiser l'efficacité de codage en 10 ou 12 bits en accord avec le modèle de sensibilité de contraste de l'œil humain (modèle de Barten). Les basses lumières (où l'œil est le plus sensible) reçoivent plus de niveaux de quantification. La plage couverte est :
- **Minimum** : ~0,0001 nit (noir quasi-absolu)
- **Maximum** : 10 000 nits (luminance théorique maximale)

En pratique, les contenus maîtrisés pour PQ ciblent souvent **1000 nits** (SDR→HDR) ou **4000 nits** (salles de cinéma premium).

**"Display referenced" vs "Scene referenced" :**
PQ est **display referenced** : les valeurs encodées décrivent la luminance que doit émettre l'écran, pas la luminance de la scène capturée. Cela implique que le contenu PQ est maîtrisé pour un écran cible précis. Un moniteur de 1000 nits ne peut pas reproduire fidèlement un master 4000 nits → nécessite un tone mapping.

**PQ et Dolby Vision :**
Dolby Vision = PQ2084 + métadonnées dynamiques propriétaires Dolby (per-scene ou per-frame). L'EOTF reste PQ mais le signal est accompagné d'instructions d'adaptation pour chaque type d'écran.

**Normes associées :** SMPTE 2084 (EOTF), ITU-R BT.2100, ITU-R BT.2020

## Exemples

### Exemple 1 — Chaîne de distribution PQ
Un master cinéma 4K en PQ 4000 nits → encodé HEVC → distribué sur plateforme streaming → décodé sur TV consumer 1000 nits → tone mapping automatique vers 1000 nits. Chaque étape préserve l'intention créative grâce aux métadonnées MaxCLL/MaxFALL.

### Exemple 2 — France 2 en continu PQ
France 2 diffuse en PQ comme cité en formation. Le pic de luminance est dimensionné pour 1000 nits (standard diffusion broadcast HDR). Les téléviseurs SDR reçoivent une version convertie par tone mapping.

## Cas d'usage

- **Cinéma et distribution premium** : Netflix, Apple TV+, Disney+ — qualité maximale sur contenus maîtrisés
- **Diffusion broadcast HDR** : France 2 (continu), chaînes satellite UHD
- **Production post** : Étalonnage HDR haut de gamme, DIT sur plateau

## Avantages et inconvénients

✅ **Avantages PQ** :
- Codage le plus efficace perceptuellement (courbe de Barten)
- Luminance maximale très élevée (10 000 nits théoriques)
- Référence absolue : reproductibilité parfaite entre systèmes calibrés

❌ **Inconvénients PQ** :
- **Aucune rétro-compatibilité SDR** : affichage incorrect sur écran sans décodage HDR
- Nécessite des métadonnées (MaxCLL/MaxFALL) pour le tone mapping
- Maîtrise liée à un écran de référence — rendu variable selon le display

## Connexions

### Notes liées
- [[HLG - Hybrid Log Gamma]] — l'alternative HDR rétro-compatible à comparer avec PQ
- [[Dynamique en image - Stops et Nits]] — PQ encode de 0,0001 à 10 000 nits
- [[Métadonnées HDR - MaxCLL MaxFALL statiques et dynamiques]] — essentielles pour le tone mapping PQ
- [[VPID - Signalisation du signal vidéo SDI]] — valeur `10` dans le Byte 2 VPID

### Dans le contexte de
- [[ITU-R BT.2100 - Norme HDR]] — PQ est l'une des deux EOTF de BT.2100
- [[MOC - UHD & HDR]] — standard de référence cinéma/premium

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]]
- Normes : SMPTE ST 2084, ITU-R BT.2100

---

**Tags thématiques** : `#pq` `#hdr` `#courbe-transfert` `#uhd-hdr` `#dolby`

## Images sources

![[20260407_162008.jpg]]
