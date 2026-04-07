---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - colorimétrie
  - gamma
---

# Gamma vidéo - OETF et EOTF

> [!abstract] Concept
> Le gamma est une courbe de transfert non linéaire qui compense la réponse logarithmique de l'œil humain à la lumière. En vidéo, deux fonctions symétriques s'appliquent : l'OETF en entrée (capteur→signal) et l'EOTF en sortie (signal→écran).

## Explication

L'œil humain perçoit la luminosité de manière non linéaire : il est plus sensible aux variations dans les basses lumières qu'en hautes lumières. Si une caméra enregistrait une image avec une réponse linéaire, les zones sombres seraient sous-représentées et les clairs surreprésentés dans la plage de bits disponible.

La **correction gamma** (γ) est une puissance appliquée au signal pour optimiser l'encodage perceptuel. Historiquement, les tubes cathodiques avaient une réponse naturelle de γ = 2,2. Pour compenser, les caméras encodaient le signal avec γ = 1/2,2 ≈ 0,45. La valeur actuelle des écrans est de **γ = 2,4** (norme ITU-R BT.1886 pour les moniteurs de référence).

Deux fonctions normalisées encadrent la chaîne :
- **OETF** (Optical to Electronic Transfer Function) : appliquée par la caméra, transforme la lumière physique capturée en signal électrique encodé. En HD : norme **Rec.709** (ITU-R BT.709).
- **EOTF** (Electronic to Optical Transfer Function) : appliquée par l'écran, transforme le signal électrique reçu en lumière émise. En HD : norme **BT.1886** (ITU-R BT.1886).

> [!warning]
> OETF et EOTF ne sont pas parfaitement symétriques mais s'annulent "presque" — la combinaison des deux reconstitue une reproduction fidèle de la scène originale avec une légère déviation dans les noirs.

## Exemples

### Exemple 1 — Chaîne SDR standard
`Scène → OETF Rec.709 (caméra) → Signal 10 bits → EOTF BT.1886 (écran) → Image vue`
La caméra applique γ = 0,45 à l'encodage, l'écran applique γ = 2,4 à l'affichage. Le résultat est une image avec une réponse proche de la scène originale.

### Exemple 2 — Impact en pratique
Un moniteur calibré à γ = 2,4 affiche correctement les gradients. Un moniteur grand public à γ = 2,2 affichera les tons moyens légèrement plus clairs — d'où l'importance du monitoring de référence en diffusion.

## Cas d'usage

- **OETF Rec.709** : Encodage signal caméra en diffusion HD standard
- **EOTF BT.1886** : Moniteurs de référence broadcast en HD/SDR
- **OETF HLG** : Encodage signal caméra en diffusion HDR rétro-compatible
- **EOTF PQ (ST 2084)** : Écrans HDR haut de gamme (cinéma, TV premium)

## Avantages et inconvénients

✅ **Avantages de la correction gamma** :
- Meilleure utilisation de la plage dynamique de codage
- Reproduction perceptuellement optimale
- Standard universel garantissant l'interopérabilité

❌ **Inconvénients** :
- La non-symétrie OETF/EOTF introduit un écart dans les noirs
- Les standards HDR (HLG, PQ) ajoutent de la complexité à la chaîne
- Les erreurs de monitoring (mauvais gamma d'écran) sont difficiles à détecter visuellement

## Connexions

### Notes liées
- [[HLG - Hybrid Log Gamma]] — HLG étend la courbe gamma SDR pour le HDR
- [[PQ - Perceptual Quantizer]] — PQ remplace complètement le gamma par une courbe basée sur la vision humaine
- [[Encodage couleur vidéo - RGB vs YCbCr]] — le gamma s'applique sur la composante Y de luminance

### Dans le contexte de
- [[ITU-R BT.2100 - Norme HDR]] — BT.2100 définit les nouvelles OETF/EOTF pour le HDR
- [[MOC - UHD & HDR]] — la chaîne gamma est le cœur de la gestion HDR

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]]
- Normes : ITU-R BT.709 (OETF HD), ITU-R BT.1886 (EOTF HD)

---

**Tags thématiques** : `#gamma` `#colorimétrie` `#uhd-hdr` `#oetf` `#eotf`
