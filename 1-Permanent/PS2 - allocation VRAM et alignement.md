---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - graphisme
  - vram
---

# PS2 - allocation VRAM et alignement

> [!abstract] Concept
> `graph_vram_allocate` répond à « où le buffer est physiquement placé en VRAM » et exige un alignement (page ou bloc) parce que les registres du GS codent les adresses en unités de pages, jamais en octets — question totalement distincte de celle réglée par XYOFFSET.

## Explication

La VRAM n'est pas adressée à l'octet près par les registres de setup du GS. `GS_SET_FRAME(FBA, FBW, PSM, FMSK)` code l'adresse du framebuffer sur 9 bits en unités de **pages** de VRAM, et il en va de même pour `ZBA` dans `GS_SET_ZBUF`. Un buffer doit donc être placé sur une frontière compatible avec cette granularité matérielle, d'où le paramètre `alignment` de `graph_vram_allocate(width, height, psm, alignment)`.

Deux constantes couvrent tous les cas : `GRAPH_ALIGN_PAGE` (2048) pour les framebuffers et Z-buffers, `GRAPH_ALIGN_BLOCK` (64) pour les buffers de texture et les CLUT, plus petits et donc alignés plus finement.

La confusion à éviter absolument est celle avec **XYOFFSET**. L'allocation VRAM place un buffer en mémoire et retourne une adresse ; XYOFFSET, lui, ne touche à aucune mémoire — c'est un registre de contexte qui décale les coordonnées des sommets avant rasterization. Les deux sont complémentaires et non substituables : changer l'alignement ne déplace pas un pixel dessiné en `(0,0)`, et changer XYOFFSET ne déplace pas le framebuffer en VRAM.

<svg viewBox="0 0 450 250" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Allocation en VRAM : granularité page et bloc">
<text x="16" y="26" font-size="12" fill="currentColor">les registres du GS codent les adresses en PAGES, jamais en octets</text>
<rect x="16" y="38" width="418" height="56" rx="5" fill="none" stroke="currentColor" stroke-width="1.4"/>
<text x="20" y="34" font-size="9" fill="currentColor" opacity="0.7">VRAM — 4 Mo</text>
<rect x="18" y="40" width="120" height="52" rx="2" fill="#4c9aff" fill-opacity="0.2" stroke="#4c9aff" stroke-width="1.2"/>
<text x="38" y="62" font-size="9.5" fill="#4c9aff">framebuffer</text>
<text x="30" y="78" font-size="8.5" fill="#4c9aff">GRAPH_ALIGN_PAGE (2048)</text>
<rect x="140" y="40" width="110" height="52" rx="2" fill="#f2994a" fill-opacity="0.2" stroke="#f2994a" stroke-width="1.2"/>
<text x="164" y="62" font-size="9.5" fill="#f2994a">Z-buffer</text>
<text x="150" y="78" font-size="8.5" fill="#f2994a">ALIGN_PAGE aussi</text>
<rect x="252" y="40" width="60" height="52" rx="2" fill="#27ae60" fill-opacity="0.2" stroke="#27ae60" stroke-width="1.2"/>
<text x="262" y="62" font-size="9" fill="#27ae60">texture</text>
<text x="256" y="78" font-size="8" fill="#27ae60">BLOCK (64)</text>
<rect x="314" y="40" width="40" height="52" rx="2" fill="#27ae60" fill-opacity="0.12" stroke="#27ae60" stroke-width="1"/>
<text x="322" y="66" font-size="8.5" fill="#27ae60">CLUT</text>
<line x1="18" y1="100" x2="18" y2="108" stroke="currentColor" stroke-width="1" opacity="0.6"/>
<line x1="138" y1="100" x2="138" y2="108" stroke="currentColor" stroke-width="1" opacity="0.6"/>
<line x1="250" y1="100" x2="250" y2="108" stroke="currentColor" stroke-width="1" opacity="0.6"/>
<text x="40" y="120" font-size="8.5" fill="currentColor" opacity="0.7">frontières de page</text>
<rect x="16" y="132" width="418" height="44" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>
<text x="26" y="150" font-size="9.5" fill="currentColor">graph_vram_allocate(width, height, psm, alignment) → retourne une adresse</text>
<text x="26" y="166" font-size="9" fill="currentColor" opacity="0.8">GS_SET_FRAME(FBA, FBW, PSM, FMSK) : FBA sur 9 bits, en unités de pages</text>
<rect x="16" y="188" width="418" height="52" rx="5" fill="#e05252" fill-opacity="0.07" stroke="#e05252" stroke-width="1.3"/>
<text x="26" y="206" font-size="10" fill="#e05252">⚠ à ne pas confondre avec XYOFFSET</text>
<text x="26" y="222" font-size="9" fill="#e05252" opacity="0.95">allocation = OÙ le buffer vit en mémoire · XYOFFSET = décalage des coordonnées avant rasterization</text>
<text x="26" y="234" font-size="9" fill="#e05252" opacity="0.85">changer l'alignement ne déplace aucun pixel ; changer XYOFFSET ne déplace pas le buffer</text>
</svg>

## Exemples

### Les deux alignements

| Constante | Valeur | Usage |
|---|---|---|
| `GRAPH_ALIGN_PAGE` | 2048 | Framebuffer et Z-buffer |
| `GRAPH_ALIGN_BLOCK` | 64 | Texture buffer et CLUT buffer |

### Allouer puis relier un framebuffer

```c
frame->address = graph_vram_allocate(frame->width, frame->height,
                                     frame->psm, GRAPH_ALIGN_PAGE);
graph_initialize(frame->address, frame->width, frame->height, frame->psm, 0, 0);
/* ... */
graph_vram_free(frame.address);
```

### Allouer une texture

```c
texbuf.address = graph_vram_allocate(tex_w, tex_h, GS_PSM_32, GRAPH_ALIGN_BLOCK);
```

## Cas d'usage

- **Créer un framebuffer** au démarrage d'un programme graphique.
- **Charger une texture en VRAM** avant `draw_texture_transfer`.
- **Double-buffering manuel** : allouer deux framebuffers et alterner les contextes.

## Avantages et inconvénients

✅ **Avantages** :
- L'allocateur gère la contrainte d'alignement matérielle à notre place.
- `graph_vram_size` et `graph_vram_free` permettent un suivi simple de l'occupation.

❌ **Inconvénients** / Limites :
- 4 Mo seulement, partagés entre tous les buffers.
- Un mauvais alignement ne produit pas d'erreur nette, seulement un affichage incohérent.

## Connexions

### Notes liées
- [[PS2 - registre XYOFFSET]] - Le mécanisme à ne pas confondre avec l'allocation
- [[PS2 - framebuffer et Z-buffer]] - Ce qu'on alloue le plus souvent
- [[PS2 - PSM format de stockage des pixels]] - Le format qui détermine la taille occupée
- [[PS2 - GS Graphics Synthesizer]] - Le propriétaire de cette VRAM

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 3f) — `ee/include/graph_vram.h`, `common/include/gs_gp.h`

---
**Tags thématiques** : #ps2 #vram #allocation #alignement #gs
