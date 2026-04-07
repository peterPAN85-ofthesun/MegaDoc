---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - broadcast
  - signal-vidéo
---

# Transition HD vers UHD - Quatre axes d'amélioration

> [!abstract] Concept
> Le passage de la HD à l'UHD ne se limite pas à une augmentation de résolution : il s'opère simultanément sur quatre dimensions — résolution, fréquence d'images, profondeur de bits et espace colorimétrique.

## Explication

La diffusion HD (1080i50, Rec.709) est le standard broadcast depuis les années 2000. La transition vers l'UHD (Ultra High Definition) représente un bond qualitatif multidimensionnel défini par quatre changements fondamentaux :

**1. Résolution : HD (1920×1080) → UHD (3840×2160)**
La résolution quadruple. Le pixel est deux fois plus petit en horizontal et vertical. L'amélioration perceptuelle n'est cependant visible qu'en dessous de 3× la hauteur d'écran (distance de visionnage critique).

**2. Scan : 50i (entrelacé) → 50p (progressif)**
La HD était souvent diffusée en entrelacé (deux demi-trames alternées). L'UHD adopte le progressif, ce qui élimine les artefacts d'entrelacement (peigne) sur les mouvements rapides et simplifie le traitement.

**3. Profondeur : 8 bits → 10 bits**
Le passage à 10 bits multiplie par 4 le nombre de niveaux (1024 → 4096 pour la luminance). Cela est indispensable pour éviter le bandage (posterisation) dans les gradients, particulièrement visible en HDR où la plage dynamique est étendue.

**4. Espace colorimétrique : Rec.709 → Rec.2020**
Rec.2020 couvre un espace de couleurs beaucoup plus large (environ 75,8% du diagramme CIE xy contre 35,9% pour Rec.709), permettant d'afficher des couleurs saturées impossibles à reproduire en Rec.709.

## Exemples

### Exemple 1 — Débits comparatifs
| Résolution | Scan   | Débit SDI |
|------------|--------|-----------|
| 1080       | 50i    | 1,5 G     |
| 1080       | 25p    | 1,5 G     |
| 1080       | 50p    | 3 G       |
| UHD        | 25p    | 6 G       |
| UHD        | 50p    | 12 G      |

### Exemple 2 — Distance de visionnage
Pour un écran 65" (165 cm de diagonale, hauteur ~82 cm) : la différence UHD/HD est visible à moins de 82×3 = 246 cm. En salle de presse à 3 m d'un moniteur 32", la différence est quasiment imperceptible.

## Cas d'usage

- **Production directe UHD 50p** : Événements sportifs, concerts — mouvement fluide critique
- **Production UHD 25p** : Documentaires, fiction — qualité colorimétrique prioritaire
- **1080p HDR** : Transition progressive — HDR sans nécessiter toute l'infrastructure UHD
- **UHD SDR** : Amélioration de résolution sans investir dans le workflow HDR complet

## Avantages et inconvénients

✅ **Avantages de l'UHD** :
- Résolution 4× supérieure pour une immersion renforcée
- Progressif natif : meilleure gestion du mouvement
- 10 bits : gradients lisses, HDR possible
- Rec.2020 : couverture colorimétrique future-proof

❌ **Inconvénients / Défis** :
- Débits 8× plus élevés qu'en HD (12G vs 1,5G) → infrastructure plus complexe et coûteuse
- Mise à jour complète de la chaîne (câbles, switchs, encodeurs, moniteurs)
- La différence de résolution n'est pas toujours perceptible au téléspectateur standard

## Connexions

### Notes liées
- [[SDI - Débits et interfaces 1.5G 3G 12G]] — l'UHD 50p nécessite une interface 12G
- [[Transport UHD multi-câbles - SQD vs 2SI]] — transport de l'UHD sur 4 câbles 3G
- [[Rec.2020 - Espace colorimétrique UHD]] — le nouvel espace couleur cible

### Dans le contexte de
- [[HDR - Définition et deux dimensions]] — HDR est complémentaire à l'UHD, mais indépendant
- [[MOC - UHD & HDR]] — vue d'ensemble de la transition broadcast

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]]
- Norme : ITU-R BT.2020, SMPTE ST 425-5

---

**Tags thématiques** : `#uhd-hdr` `#broadcast` `#résolution` `#rec2020`
