---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - colorimétrie
  - signal-vidéo
---

# Encodage couleur vidéo - RGB vs YCbCr

> [!abstract] Concept
> La couleur vidéo peut être encodée selon deux paradigmes : RGB (synthèse additive directe) ou YCbCr (séparation luminance/chrominance), chacun adapté à des usages différents dans la chaîne de production.

## Explication

En vidéo numérique, deux grandes familles d'encodage coexistent. Le **RGB** représente la couleur comme une combinaison de trois composantes primaires (Rouge, Vert, Bleu) avec la même résolution pour chacune. C'est le format natif des écrans et des capteurs, idéal pour le traitement en post-production et la compositing, car il ne compromet aucune information chromatique.

Le **YCbCr** (ou YUV dans sa version analogique) sépare la luminance (Y) de la chrominance (Cb = B−Y et Cr = R−Y). Cette décomposition exploite une propriété de la vision humaine : l'œil est bien plus sensible aux variations de luminosité qu'aux variations de teinte. La luminance Y est calculée selon une pondération perceptuelle : `Y = 0,6×V + 0,3×R + 0,1×B`. En conséquence, il est possible de réduire la résolution spatiale des composantes Cb et Cr (sous-échantillonnage) sans dégradation perceptible majeure.

La norme **sRGB** (8 bits) est l'espace couleur standard des moniteurs grand public et du web. La norme **Rec.709** (10 bits) est l'espace de référence pour la diffusion HD professionnelle. Les deux utilisent les mêmes primaires couleur mais diffèrent par leur profondeur de bits et leur gamma nominal.

## Exemples

### Exemple 1 — RGB en post-production
Un projet DaVinci Resolve travaille en RGB 16 bits flottants : chaque pixel est défini par trois valeurs indépendantes, permettant des corrections colorimétriques sans artefacts de compression. Aucune information n'est sacrifiée.

### Exemple 2 — YCbCr en diffusion
Un signal SDI 1080i50 transporté en 4:2:2 YCbCr 10 bits : Y est samplé à pleine résolution horizontale (1920 samples), tandis que Cb et Cr sont samplés à la moitié (960 samples). Le débit est réduit sans impact visible pour le téléspectateur.

## Cas d'usage

- **RGB** : Post-production, compositing, étalonnage, exports masters
- **YCbCr 4:4:4** : Masterisation haute qualité, effets visuels, chrominance critique
- **YCbCr 4:2:2** : Diffusion broadcast SD/HD/UHD, acquisition caméra professionnelle
- **YCbCr 4:2:0** : Compression pour distribution (HEVC, H.264), streaming, acquisition caméra grand public

## Avantages et inconvénients

✅ **Avantages de YCbCr** :
- Compatibilité avec les systèmes de compression (sous-échantillonnage possible)
- Meilleure efficacité de débit pour la diffusion
- Héritage historique : compatibilité avec les systèmes analogiques (Y = signal luminance)

❌ **Inconvénients de YCbCr** :
- Conversion RGB→YCbCr→RGB introduit des erreurs d'arrondi
- Réduction de résolution chromatique (en 4:2:0 notamment)
- Moins adapté aux opérations de compositing

## Connexions

### Notes liées
- [[Sous-échantillonnage chromatique - 4:2:2 4:4:4 4:2:0]] — le sous-échantillonnage est rendu possible par la séparation Y/CbCr
- [[Gamma vidéo - OETF et EOTF]] — les courbes gamma s'appliquent sur le signal Y (luminance)
- [[Rec.2020 - Espace colorimétrique UHD]] — Rec.2020 utilise également YCbCr, avec des primaires couleur étendues

### Dans le contexte de
- [[Transition HD vers UHD]] — le passage à l'UHD introduit Rec.2020, qui étend l'espace couleur
- [[MOC - UHD & HDR]] — fondamental à comprendre pour la chaîne de production UHD-HDR

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]]
- Norme : sRGB (IEC 61966-2-1), Rec.709 (ITU-R BT.709)

---

**Tags thématiques** : `#colorimétrie` `#signal-vidéo` `#uhd-hdr` `#rgb` `#ycbcr`
