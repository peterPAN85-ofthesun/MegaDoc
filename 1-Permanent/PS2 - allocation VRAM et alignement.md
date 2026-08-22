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
