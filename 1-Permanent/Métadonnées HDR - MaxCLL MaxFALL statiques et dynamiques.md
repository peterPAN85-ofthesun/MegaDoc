---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - hdr
  - métadonnées
---

# Métadonnées HDR - MaxCLL MaxFALL statiques et dynamiques

> [!abstract] Concept
> Les métadonnées HDR décrivent les caractéristiques de luminance d'un contenu pour permettre aux écrans de s'adapter. Elles sont statiques (valeurs fixes pour tout le programme : MaxCLL, MaxFALL, espace couleur) ou dynamiques (valeurs par scène ou par image : HDR10+, Dolby Vision, HDRvivid).

## Explication

Les métadonnées HDR permettent aux afficheurs de réaliser un **tone mapping optimal** : adapter le contenu maîtrisé pour un écran de référence (ex: 1000 nits) à l'écran de lecture (ex: 600 nits), en préservant au mieux l'intention artistique.

### Métadonnées statiques (HDR10)

**MaxCLL** (Maximum Content Light Level) : niveau de luminance maximum d'un pixel sur l'ensemble du contenu, exprimé en nits. Aide à dimensionner le tone mapping. Exemple : MaxCLL = 1000 nits.

**MaxFALL** (Maximum Frame Average Light Level) : luminance moyenne maximale sur une image de l'ensemble du contenu. Indicateur de la "densité" globale de lumière. En général significativement inférieur à MaxCLL.

**Espace couleur et primaires** : Rec.2020, point blanc D65, gamma PQ — inclus dans les métadonnées statiques (SMPTE ST 2086 — "Mastering Display Color Volume").

Les métadonnées statiques sont **figées pour l'ensemble du programme** — elles s'adaptent mal aux contenus à grande variété de scènes (nuit/jour).

### Métadonnées dynamiques

Les métadonnées dynamiques permettent d'ajuster les paramètres de tone mapping **scène par scène** (voire image par image) :

- **HDR10+** (Samsung, Amazon) : ouvert, par scène
- **Dolby Vision** (Dolby) : propriétaire, par image, avec profils d'écran (Dolby Vision = PQ + métadonnées dynamiques Dolby)
- **HDR Vivid** (UHD Alliance/Chine)
- **SL-HDR** (ETSI)

Les métadonnées dynamiques sont particulièrement utiles pour les contenus longs métrages ou documentaires avec de grandes variations de luminance.

> [!note]
> En live broadcast (HLG), les métadonnées statiques ne sont généralement **pas nécessaires** — HLG est rétro-compatible par nature. C'est pour PQ que les métadonnées sont critiques.

## Exemples

### Exemple 1 — Workflow HDR10 statique
```
Master PQ 1000 nits
MaxCLL = 950 nits
MaxFALL = 400 nits
→ TV 600 nits : tone map en appliquant MaxCLL pour réduire proportionnellement les hautes lumières
→ TV 1500 nits : contenu affiché tel quel (dans la plage)
```

### Exemple 2 — Dolby Vision dynamique
Un film passe d'une scène de nuit (MaxCLL scène = 150 nits) à une explosion (MaxCLL scène = 3000 nits) :
- HDR10 statique : MaxCLL global = 3000 → la scène de nuit est sur-tone-mappée (trop sombre)
- Dolby Vision dynamique : chaque scène a ses propres paramètres → rendu optimal dans les deux cas

## Cas d'usage

- **Livraison broadcast (HLG)** : Métadonnées statiques minimales (espace couleur, norme)
- **Distribution streaming (PQ)** : HDR10 statique obligatoire (MaxCLL/MaxFALL)
- **Distribution premium (Dolby Vision)** : Métadonnées dynamiques par image — plateforme Apple TV+, Netflix Dolby

## Avantages et inconvénients

✅ **Métadonnées dynamiques** :
- Tone mapping optimal scène par scène
- Meilleure fidélité sur tous les types d'écrans

❌ **Inconvénients** :
- Dolby Vision = licence propriétaire et coûteuse
- Complexité de workflow (génération et transport des métadonnées)
- HDR10+ moins adopté que Dolby Vision

## Connexions

### Notes liées
- [[PQ - Perceptual Quantizer]] — les métadonnées statiques sont essentielles pour le tone mapping PQ
- [[HLG - Hybrid Log Gamma]] — HLG nécessite peu de métadonnées
- [[ITU-R BT.2100 - Norme HDR]] — les métadonnées font partie du framework BT.2100

### Dans le contexte de
- [[HDR - Définition et deux dimensions]] — les métadonnées gèrent la dimension dynamique du HDR
- [[MOC - UHD & HDR]] — composant technique de la chaîne HDR

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]]
- Normes : SMPTE ST 2086 (MaxCLL/MaxFALL), SMPTE ST 2094 (dynamiques), ITU-R BT.2100

---

**Tags thématiques** : `#métadonnées` `#hdr` `#maxcll` `#dolby-vision` `#uhd-hdr`
