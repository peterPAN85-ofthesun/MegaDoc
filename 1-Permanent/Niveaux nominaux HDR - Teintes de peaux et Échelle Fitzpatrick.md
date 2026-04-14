---
type: permanent
created: 2026-04-08 11:00
tags:
  - permanent
  - uhd-hdr
  - production
  - colorimétrie
---

# Niveaux nominaux HDR - Teintes de peaux et Échelle Fitzpatrick

> [!abstract] Concept
> ITU-R BT.2408 définit des plages de niveaux indicatifs pour les teintes de peaux en production HDR (PQ et HLG), basées sur l'échelle Fitzpatrick, permettant une vérification objective des chairs à l'étalonage.

## Explication

L'**échelle de Fitzpatrick** est une classification dermatologique créée en 1975 par Thomas B. Fitzpatrick pour catégoriser les types de peau humaine selon leur réaction au soleil. Elle définit 6 types (I à VI) allant de la peau très claire (Type I) à la peau noire (Type VI).

En production HDR, BT.2408 réutilise cette échelle pour définir des **plages de signal de référence** pour chaque type de peau, en PQ et en HLG. Ces valeurs servent de repères lors de l'étalonnage ou du contrôle de qualité d'une image HDR.

### Tableau (Source : ITU-R BT.2408, Table 2)

| Type de peau (Fitzpatrick) | Luminance réflectance | %PQ | %HLG (1000 cd/m²) |
|---|---|---|---|
| Type 1-2 — Peau claire / blanche pâle | 65–110 réfl. | 45–55 | 55–65 |
| Type 3-4 — Peau medium / brun clair | 40–85 réfl. | 40–50 | 45–60 |
| Type 5-6 — Peau foncée / brun-noir | 10–40 réfl. | 30–40 | 25–45 |
| Herbe | 30–65 réfl. | 40–45 | 40–55 |

> Ces valeurs sont indicatives. La réflectance réelle varie selon l'éclairage, la texture et l'humidité de la peau.

### L'échelle Fitzpatrick en détail

| Type | Score | Description |
|---|---|---|
| Type I | 0–6 | Peau blanche pâle, brûle toujours |
| Type II | 7–13 | Peau blanche, brûle facilement |
| Type III | 14–20 | Peau brun clair, bronze légèrement |
| Type IV | 21–27 | Peau modérément brune |
| Type V | 28–34 | Peau brun foncé |
| Type VI | 35+ | Peau brun foncé à noire |

## Cas d'usage

- Vérification objective des niveaux de chair lors de l'étalonnage HDR
- Contrôle qualité automatisé sur des scènes avec visages
- Évaluation de la qualité d'une conversion SDR→HDR (teintes préservées ?)

## Connexions

### Notes liées
- [[ITU-R BT.2408 - Niveaux nominaux et bonnes pratiques production HDR]] — norme source de ces valeurs
- [[Conditions d'observation de référence HDR - BT.2100-3]] — l'environnement d'observation influe sur la perception des teintes
- [[HLG - Hybrid Log Gamma]] — les niveaux HLG s'appliquent à un display de référence 1000 cd/m²
- [[PQ - Perceptual Quantizer]] — les niveaux PQ sont référencés à 1000 cd/m² également

### Contexte
La teinte de peau est l'un des indicateurs visuels les plus sensibles pour l'œil humain. En HDR, les niveaux sont différents du SDR (où le blanc diffus était à 100%). Avoir des valeurs de référence Fitzpatrick permet de s'assurer que les chairs ne sont ni brûlées ni sous-exposées après une conversion ou un étalonnage.

## Source

- ITU-R BT.2408 Table 2 — *Indicative ranges of levels for common objects in PQ and HLG production*
- Formation IIFA / Média 180, 2026-04-08 — [[0-Inbox/Formation UHD - HDR J2]]

---

**Tags thématiques** : `#uhd-hdr` `#colorimétrie` `#production` `#teintes-de-peaux` `#fitzpatrick`
