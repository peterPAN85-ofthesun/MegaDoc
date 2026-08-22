---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - graphisme
  - vram
---

# PS2 - PSM format de stockage des pixels

> [!abstract] Concept
> Le PSM (*Pixel Storage Method*) est le format d'encodage des pixels d'un framebuffer, d'une texture ou d'un Z-buffer en VRAM, et il existe **deux jeux de constantes différents** pour le désigner selon qu'on utilise le ps2sdk bas niveau ou gsKit.

## Explication

Le PSM décrit la profondeur de couleur, la présence d'alpha et le caractère indexé ou non d'un buffer. C'est le champ `frame->psm` et `z->zsm` passés à `graph_vram_allocate` et `graph_initialize`, ou `gsGlobal->PSM` côté gsKit. Comme le GS ne dispose que de 4 Mo de VRAM, ce choix a un impact direct sur ce qui tient en mémoire.

Le piège majeur est la **coexistence de deux nomenclatures**. `common/include/gs_psm.h` (ps2sdk, utilisé par `libgraph`/`libdraw`) définit `GS_PSM_*` pour la couleur et `GS_PSMZ_*` pour le Z-buffer avec des **valeurs différentes** (offset `+0x30`). `gsKit/include/gsInit.h` définit `GS_PSM_CT*`/`GS_PSM_T*` pour la couleur et des `GS_PSMZ_*` qui reprennent **les mêmes valeurs numériques que la couleur**, le contexte étant donné par le registre `ZBUF`. Mélanger les deux produit un buffer illisible sans erreur de compilation.

Le compromis pratique est simple : `CT32` donne l'alpha complet mais consomme le plus, `CT24` économise en perdant l'alpha, `CT16`/`CT16S` divisent la taille par deux au prix de la précision (5 bits par canal, 1 bit d'alpha), et `T8`/`T4` sont réservés aux textures indexées avec palette CLUT.

## Exemples

### Formats couleur et texture

| Valeur | ps2sdk (`gs_psm.h`) | gsKit (`gsInit.h`) | Description |
|---|---|---|---|
| 0x00 | `GS_PSM_32` | `GS_PSM_CT32` | RGBA 32 bits (8:8:8:8) |
| 0x01 | `GS_PSM_24` | `GS_PSM_CT24` | RGB 24 bits, pas d'alpha |
| 0x02 | `GS_PSM_16` | `GS_PSM_CT16` | RGBA 16 bits (5:5:5:1) |
| 0x0A | `GS_PSM_16S` | `GS_PSM_CT16S` | RGBA 16 bits, stockage alterné |
| 0x13 | `GS_PSM_8` | `GS_PSM_T8` | Indexé 8 bits (CLUT) |
| 0x14 | `GS_PSM_4` | `GS_PSM_T4` | Indexé 4 bits (CLUT) |

### Formats Z-buffer — valeurs différentes selon la bibliothèque

| Profondeur | ps2sdk `GS_PSMZ_*` | gsKit `GS_PSMZ_*` |
|---|---|---|
| 32 bits | 0x30 | 0x00 |
| 24 bits | 0x31 | 0x01 |
| 16 bits | 0x32 | 0x02 |
| 16 bits (S) | 0x3A | 0x0A |

### Choix d'un framebuffer 32 bits

```c
frame->psm = GS_PSM_32;
frame->address = graph_vram_allocate(frame->width, frame->height,
                                     frame->psm, GRAPH_ALIGN_PAGE);
```

## Cas d'usage

- **Économiser la VRAM** : passer un buffer de textures en `CT16` ou `T8`.
- **Rendu sans transparence** : `CT24` suffit et libère un octet par pixel.
- **Debug d'un affichage corrompu** : vérifier la cohérence du PSM entre allocation, `graph_initialize` et registre `FRAME`.

## Avantages et inconvénients

✅ **Avantages** :
- Large éventail de compromis taille/qualité.
- Le même champ décrit framebuffer, texture et Z-buffer.

❌ **Inconvénients** / Limites :
- Deux nomenclatures concurrentes pour la même notion.
- Les valeurs Z-buffer diffèrent entre ps2sdk et gsKit, sans garde-fou.

## Connexions

### Notes liées
- [[PS2 - framebuffer et Z-buffer]] - Les deux buffers auxquels s'applique le PSM
- [[PS2 - allocation VRAM et alignement]] - Où le PSM intervient à l'allocation
- [[PS2 - GS Graphics Synthesizer]] - La VRAM de 4 Mo à gérer
- [[PS2 - mode A+D du GIF]] - Comment le registre `FRAME` reçoit ce PSM

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 3f) — `common/include/gs_psm.h`, `gsKit/include/gsInit.h`

---
**Tags thématiques** : #ps2 #psm #vram #graphisme #gs
