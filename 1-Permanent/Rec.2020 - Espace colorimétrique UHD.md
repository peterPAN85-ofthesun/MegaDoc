---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - colorimétrie
  - rec2020
---

# Rec.2020 - Espace colorimétrique UHD

> [!abstract] Concept
> Rec.2020 (ITU-R BT.2020) est l'espace colorimétrique de référence pour l'UHD qui couvre ~75,8% du diagramme CIE xy — plus du double de Rec.709 (~35,9%) — permettant de représenter des couleurs très saturées impossibles en HD standard.

## Explication

**Rec.709** est l'espace colorimétrique de la diffusion HD standard depuis les années 1990. Ses primaires (rouge, vert, bleu) sont définies pour correspondre aux phosphores des tubes cathodiques de l'époque. Il couvre environ 35,9% du diagramme de chromaticité CIE 1931.

**Rec.2020** (ITU-R BT.2020, 2012) est l'espace de référence pour l'UHD. Ses primaires sont étendues vers les spectres purs de chaque couleur primaire :
- **Rouge** : primaire plus saturée (x=0.708, y=0.292)
- **Vert** : primaire plus saturée (x=0.170, y=0.797)
- **Bleu** : primaire plus saturée (x=0.131, y=0.046)

La couverture atteint ~75,8% du CIE xy, couvrant la grande majorité des couleurs perceptibles par l'œil humain. L'espace DCI-P3 (~54% CIE xy), utilisé par le cinéma numérique, est un intermédiaire pratique entre Rec.709 et Rec.2020 — la majorité des TV HDR grand public atteignent 90%+ de P3 mais seulement 60-70% de Rec.2020.

**En pratique :** peu de capteurs et d'écrans couvrent réellement 100% de Rec.2020 aujourd'hui. La chaîne de production cible Rec.2020 comme espace de travail ("conteneur") pour la pérennité, tout en sachant que la reproduction complète est progressive avec l'évolution des technologies d'affichage.

## Exemples

### Exemple 1 — Comparaison espaces couleur
| Espace | % CIE xy | Usage |
|--------|----------|-------|
| sRGB / Rec.709 | ~35,9% | Web, HD broadcast |
| DCI-P3 | ~53,6% | Cinéma numérique |
| Adobe RGB | ~52,1% | Photo pro |
| Rec.2020 | ~75,8% | UHD broadcast référence |
| Œil humain | 100% | - |

### Exemple 2 — Vert impossible en Rec.709
La couleur d'un pré vert sous soleil d'été peut dépasser le gamut Rec.709 → apparaît désaturée. En Rec.2020, cette couleur est correctement représentée et un écran compatible peut l'afficher fidèlement.

## Cas d'usage

- **Production UHD HDR** : Espace de travail en étalonnage, garantit la pérennité du master
- **Diffusion UHD** : EBU Rec.2020 comme espace cible pour les livraisons UHD-HDR
- **Normes de livraison** : Les specs PAD FTV UHD exigent Rec.2020 comme espace couleur

## Avantages et inconvénients

✅ **Avantages Rec.2020** :
- Couverture très large — pérenne pour les futures technologies d'affichage
- Espace de référence standard pour le workflow UHD
- Permet des couleurs très saturées fidèles à la nature

❌ **Inconvénients** :
- Aucun écran actuel ne reproduit 100% de Rec.2020
- Conversions fréquentes nécessaires (Rec.2020 → DCI-P3 → Rec.709) selon le destinataire
- Gestion du gamut mapping nécessaire pour éviter des couleurs "out of gamut"

## Connexions

### Notes liées
- [[HDR - Définition et deux dimensions]] — Rec.2020 est la dimension WCG du HDR
- [[ITU-R BT.2100 - Norme HDR]] — BT.2100 utilise Rec.2020 comme espace colorimétrique
- [[Encodage couleur vidéo - RGB vs YCbCr]] — Rec.2020 utilise également YCbCr avec des primaires étendues
- [[Normes PAD FTV - Formats de livraison broadcast]] — Rec.2020 est requis pour la livraison UHD

### Dans le contexte de
- [[Transition HD vers UHD - Quatre axes d'amélioration]] — Rec.2020 remplace Rec.709 comme 4ème axe
- [[MOC - UHD & HDR]] — espace colorimétrique de référence UHD

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]]
- Norme : ITU-R BT.2020

---

**Tags thématiques** : `#rec2020` `#colorimétrie` `#uhd-hdr` `#gamut` `#wcg`

## Images sources

![[20260407_164851.jpg]]
