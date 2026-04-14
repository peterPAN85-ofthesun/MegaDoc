---
type: permanent
created: 2026-04-08 11:00
tags:
  - permanent
  - uhd-hdr
  - conversion
  - colorimétrie
---

# Display Light vs Scene Light - Conversion SDR vers HDR

> [!abstract] Concept
> Pour convertir un signal SDR en HDR, deux approches s'opposent : Display Light (qui préserve ce que le moniteur SDR affichait) et Scene Light (qui préserve le signal sortant du capteur caméra). Le choix dépend de l'objectif : préserver l'étalonnage ou aligner des caméras mixtes.

## Explication

Lors d'une conversion SDR→HDR (Inverse Tone Mapping ou Direct Mapping), la question centrale est : **quelle est la référence à préserver ?**

### Conversion Display Light (Display Referred)

La conversion passe par la **luminance d'affichage du moniteur SDR** comme référence intermédiaire.

Chaîne de traitement :
```
SDR BT.709 → BT.1886 EOTF (Lw=100 cd/m²) → BT.709→BT.2020 Colour
→ [brightness adj.] → [highlight expansion] → Inverse HLG EOTF (Lw=1000 cd/m²) → HDR HLG
```

**Ce qui est préservé** : l'apparence visuelle telle qu'elle était sur le moniteur SDR à 100 cd/m². Les couleurs et les contrastes vus sur l'écran SDR restent identiques sur l'écran HDR.

**Usage** : contenus préalablement étalonnés (graphiques, archives SDR, programmes SDR existants inclus dans un flux HDR).

### Conversion Scene Light (Scene Referred)

La conversion part du **signal tel qu'il sort du capteur de la caméra** (avant tout affichage).

Chaîne de traitement :
```
SDR BT.709 → BT.709 Inverse OETF → BT.709→BT.2020 Colour
→ Gain BT.2408 levels → [highlight expansion] → BT.2100 HLG OETF → HDR HLG
```

**Ce qui est préservé** : le signal d'origine du capteur (balance des blancs, traitements "artistiques" caméra). Ne fait pas référence à un moniteur SDR.

**Usage** : **mélange de caméras SDR natives et HDR** dans un même programme live. Les caméras SDR et HDR sont ainsi alignées sur le même référentiel "scène".

### Différence de rendu

Sur le graphe comparatif (Comparison of scene-light and display-light direct-mapping) :
- **Scene-Light** produit un signal HLG légèrement **plus lumineux** que Display-Light pour le même signal SDR d'entrée
- À 100% SDR : Scene-Light ≈ 75% HLG vs Display-Light ≈ 70% HLG
- La différence s'explique : Display-Light est "plafonnée" par la luminance du moniteur SDR à 100 cd/m²

### Pour la conversion HDR→SDR

Les deux méthodes existent mais on préfère **Display Light** car on maintient le look de l'image HDR. La méthode Scene-Light altère notamment les graphiques et les teintes.

## Connexions

### Notes liées
- [[Conversions HDR-SDR - Tone Mapping Inverse TM Direct Mapping]] — contexte général des conversions
- [[OOTF - Fonction de transfert opto-optique HLG]] — l'OOTF intervient dans la chaîne Scene Light
- [[Gamma vidéo - OETF et EOTF]] — OETF et EOTF sont les blocs fondamentaux des deux chaînes
- [[Workflow production simultanée HDR-SDR]] — utilise Scene Light pour les caméras et Display Light pour les sorties
- [[ITU-R BT.2408 - Niveaux nominaux et bonnes pratiques production HDR]] — source des recommandations
- [[HLG - Hybrid Log Gamma]] — courbe cible HDR des deux chaînes dans ce contexte

### Contexte
Le choix Display/Scene Light est l'une des décisions techniques les plus importantes en production HDR. Une confusion entre les deux peut entraîner des incohérences colorimétriques entre les sources d'un même programme — notamment entre les caméras live et les graphiques.

## Source

- ITU-R BT.2408 (Source : BBC)
- Formation IIFA / Média 180, 2026-04-08 — [[0-Inbox/Formation UHD - HDR J2]]

---

**Tags thématiques** : `#uhd-hdr` `#conversion` `#display-light` `#scene-light` `#colorimétrie`
