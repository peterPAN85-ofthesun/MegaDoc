---
type: permanent
created: 2026-04-08 11:00
tags:
  - permanent
  - uhd-hdr
  - monitoring
  - normes
---

# Conditions d'observation de référence HDR - BT.2100-3

> [!abstract] Concept
> La Rec. UIT-R BT.2100-3 définit l'environnement d'observation normalisé pour l'évaluation critique du contenu HDR : luminance d'écran, éclairage ambiant, distance de visionnage.

## Explication

Pour garantir une évaluation cohérente du contenu HDR entre différents sites de production, la recommandation UIT-R BT.2100-3 (Tableau 3) fixe des conditions d'observation de référence strictes. Ces conditions sont différentes de celles du SDR car le HDR exploite une plage de luminance bien plus grande.

L'environnement doit être sombre et neutre : la zone périphérique à l'écran doit être éclairée à 5 cd/m² en gris neutre D65, et aucun éclairage direct de l'écran n'est toléré. Le moniteur de référence doit atteindre au moins 1 000 cd/m² en crête et descendre sous 0,005 cd/m² dans les noirs.

La distance d'observation dépend de la résolution :
- **FHD (1920×1080)** : 3,2 hauteurs d'image
- **4K (3840×2160)** : 1,6 à 3,2 hauteurs d'image
- **8K (7680×4320)** : 0,8 à 3,2 hauteurs d'image

## Tableau de référence (BT.2100-3)

| Paramètre | Valeurs |
|---|---|
| Zone environnante et zone périphérique | Gris neutre à D65 |
| Luminance de la zone environnante | 5 cd/m² |
| Luminance de la zone périphérique | ≤ 5 cd/m² |
| Éclairage ambiant | Éviter l'éclairage direct de l'écran |
| Distance d'observation FHD | 3,2 h |
| Distance d'observation 4K | 1,6 à 3,2 h |
| Distance d'observation 8K | 0,8 à 3,2 h |
| Luminance de crête (peak white) | ≥ 1 000 cd/m² |
| Luminance minimale (niveau noir) | ≤ 0,005 cd/m² |

## Cas d'usage

- Étalonnage et vérification d'un programme HDR en salle de post-production
- Calibration d'un moniteur de référence HDR en régie
- Validation de la livraison d'un master HDR

## Connexions

### Notes liées
- [[ITU-R BT.2408 - Niveaux nominaux et bonnes pratiques production HDR]] — complète BT.2100-3 avec les niveaux de signal nominaux
- [[ITU-R BT.2100 - Norme HDR]] — norme cadre dont BT.2100-3 est une recommandation dérivée
- [[HLG - Hybrid Log Gamma]] — courbe HDR broadcast dont la luminance de crête est 1 000 cd/m²
- [[PQ - Perceptual Quantizer]] — courbe HDR cinéma dont la plage va jusqu'à 10 000 cd/m²

### Contexte
Ces conditions garantissent que ce que le coloriste voit sur son moniteur correspond à ce que l'audience verra sur un téléviseur HDR de référence. Sans ces conditions normalisées, un même fichier peut sembler très différent d'un écran à l'autre.

## Source

- Rec. UIT-R BT.2100-3 (Tableau 3)
- Formation IIFA / Média 180, 2026-04-08 — [[0-Inbox/Formation UHD - HDR J2]]

---

**Tags thématiques** : `#uhd-hdr` `#monitoring` `#normes` `#bt2100`
