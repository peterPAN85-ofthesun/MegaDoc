---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - hardware
  - graphisme
  - gs
---

# PS2 - GS Graphics Synthesizer

> [!abstract] Concept
> Le GS est le processeur graphique de la PS2 : un rasterizer à registres, sans aucun shader programmable, doté de 4 Mo de VRAM, que l'on pilote exclusivement en lui envoyant des paquets GIF construits par l'EE ou VU1.

## Explication

Le GS n'est pas un GPU au sens moderne : il ne fait tourner aucun programme. C'est une machine à états dont on écrit les **registres** — `PRIM` pour le type de primitive, `RGBAQ` pour la couleur, `XYZ2` pour un sommet, `FRAME`/`ZBUF`/`SCISSOR`/`TEST` pour l'environnement de dessin. Écrire dans certains registres (`XYZ2`) déclenche le dessin : c'est le *draw kick*.

Ces écritures n'arrivent pas par accès mémoire direct mais par le **GIF** (Graphics Interface), qui lit des paquets structurés en GIFtags. Le chemin normal est donc : l'EE (ou VU1) construit un paquet en RAM, le contrôleur DMA le transfère au GIF, et le GIF traduit son contenu en écritures de registres GS.

Sa mémoire embarquée est de **4 Mo de VRAM**, partagée entre framebuffer, Z-buffer, textures et CLUT. C'est la ressource la plus contrainte du système : le choix du format de pixel ([[PS2 - PSM format de stockage des pixels]]) a un impact direct sur ce qui tient en mémoire. L'espace de coordonnées interne du rasterizer est un espace **non signé de 12 bits** (0 à 4095), d'où le recours au registre XYOFFSET pour placer une origine logique.

## Exemples

### Écrire un registre GS depuis un paquet GIF

```c
PACK_GIFTAG(q, GIF_SET_PRIM(6, 0, 0, 0, 0, 0, 0, 0, 0), GIF_REG_PRIM);
q++;
PACK_GIFTAG(q, GIF_SET_RGBAQ(255, 0, 0, 0x80, 0x3F800000), GIF_REG_RGBAQ);
q++;
```

### Registre GS memory-mappé accessible directement depuis l'EE

```c
#define DEBUG_BGCOLOR(col) *((u64 *) 0x120000e0) = (u64) (col)
```

## Cas d'usage

- **Rendu 2D/3D** : toute la sortie visuelle passe par lui.
- **Blits VRAM** : transferts texture via `BITBLTBUF`/`TRXPOS`/`TRXDIR`.
- **Debug visuel** : changer la couleur de fond pour localiser un plantage.

## Avantages et inconvénients

✅ **Avantages** :
- Fill rate élevé pour l'époque, très efficace en 2D et sprites.
- Modèle simple à comprendre : des registres et des primitives.

❌ **Inconvénients** / Limites :
- Aucun shader : tout effet doit être obtenu par passes multiples et blending.
- 4 Mo de VRAM seulement, textures comprises.

## Connexions

### Notes liées
- [[PS2 - paquet GIF et GIFtag]] - Le seul langage compris par le GS
- [[PS2 - registre PRIM]] - Le registre qui décrit la primitive
- [[PS2 - framebuffer et Z-buffer]] - Les deux buffers principaux en VRAM
- [[PS2 - contextes de dessin du GS]] - Les registres dupliqués en deux exemplaires
- [[PS2 - architecture multiprocesseur]] - Sa place dans le système

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitres 1 et 3)

---
**Tags thématiques** : #ps2 #gs #graphisme #vram #rasterizer
