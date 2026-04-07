---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - colorimétrie
  - signal-vidéo
---

# Sous-échantillonnage chromatique - 4:2:2 4:4:4 4:2:0

> [!abstract] Concept
> Le sous-échantillonnage chromatique est un système d'encodage YCbCr qui réduit la résolution spatiale des composantes Cb et Cr par rapport à Y, en exploitant la moindre sensibilité de l'œil aux détails de couleur.

## Explication

La notation **J:a:b** décrit comment les composantes Cb et Cr sont réparties par rapport à Y sur une zone de J pixels de large sur 2 lignes :
- **J** : résolution horizontale de référence (généralement 4)
- **a** : nombre de samples Cb/Cr sur la 1ère ligne
- **b** : nombre de samples Cb/Cr sur la 2ème ligne

**4:4:4** : Aucun sous-échantillonnage. Chaque pixel a sa propre valeur Y, Cb et Cr. La résolution chromatique est identique à la résolution de luminance. Utilisé en masterisation haute qualité et en compositing.

**4:2:2** : Les composantes Cb et Cr sont échantillonnées une fois pour deux pixels horizontaux (demi-résolution horizontale). C'est le standard professionnel broadcast : le débit est réduit de 33% par rapport au 4:4:4 avec un impact visuel quasi nul sur des contenus naturels.

**4:2:0** : Sous-échantillonnage en horizontal ET en vertical — une valeur Cb/Cr pour un bloc de 2×2 pixels. Le débit est réduit de 50% par rapport au 4:4:4. Très utilisé en compression grand public (H.264, HEVC), moins adapté aux contenus à chrominance critique.

## Exemples

### Exemple 1 — 4:2:2 en diffusion SDI
Un signal 1080i50 SDI en YCbCr 4:2:2 10 bits : 1920 samples Y + 960 samples Cb + 960 samples Cr = 2940 samples/ligne contre 5760 en 4:4:4. Cela permet le transport sur un câble 1.5G.

### Exemple 2 — 4:2:0 en HEVC
Une caméra Sony XAVC-L enregistre en 4:2:0 : économie de stockage significative, adapté pour une utilisation en ligne ou dans les médias sociaux, mais à éviter pour un usage en étalonnage ou compositing.

## Cas d'usage

- **4:4:4** : Masterisation, étalonnage, VFX, effets spéciaux, acquisition haut de gamme (ARRI, RED)
- **4:2:2** : Standard broadcast professionnel (SDI, MXF), caméras pro (Sony XAVC-I, Apple ProRes 422)
- **4:2:0** : Streaming, distribution grand public, enregistrement compact (Panasonic HEVC UHD)

## Avantages et inconvénients

✅ **Avantages du sous-échantillonnage** :
- Réduction significative du débit de données
- Transparence visuelle pour les contenus naturels
- Compatibilité avec les standards broadcast (4:2:2)

❌ **Inconvénients** :
- Artefacts de chrominance sur les contours à fort contraste coloré
- Non adapté au compositing sur fond vert (chroma key)
- Conversions répétées dégradent la qualité

## Connexions

### Notes liées
- [[Encodage couleur vidéo - RGB vs YCbCr]] — le sous-échantillonnage n'est applicable que dans l'espace YCbCr
- [[CODECs UHD-HDR 10 bits compatibles]] — chaque codec a son propre sampling par défaut
- [[SDI - Débits et interfaces 1.5G 3G 12G]] — le sampling impacte directement le débit nécessaire

### Dans le contexte de
- [[Transition HD vers UHD]] — le passage à l'UHD maintient le 4:2:2 comme standard minimal
- [[MOC - UHD & HDR]] — fondamental pour comprendre les débits et la qualité des signaux

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]]
- Norme : ITU-R BT.601 (SD), ITU-R BT.709 (HD), ITU-R BT.2020 (UHD)

---

**Tags thématiques** : `#colorimétrie` `#signal-vidéo` `#uhd-hdr` `#chroma-subsampling`
