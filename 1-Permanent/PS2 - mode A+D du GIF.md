---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - graphisme
  - gif
---

# PS2 - mode A+D du GIF

> [!abstract] Concept
> `GIF_REG_AD` (0x0E) est le seul format PACKED générique : chaque quadword y porte sa propre adresse de registre GS dans `dw[1]`, ce qui permet d'atteindre les registres de setup (`FRAME`, `ZBUF`, `XYOFFSET`, `SCISSOR`, `BITBLTBUF`…) qui n'ont aucun code dédié.

## Explication

En mode PACKED normal, chaque quadword de données est décrit par un descripteur de 4 bits dans le GIFtag, et le registre GS destinataire est **implicite** : le GIF sait par construction qu'un descripteur `0x05` signifie XYZ2 et connaît d'avance le format de la donnée. Ce raccourci ne couvre que les codes 0x0 à 0xD, tous orientés flux de sommets — PRIM, RGBAQ, ST, UV, XYZ2, XYZF2, TEX0, CLAMP, FOG.

Le mode **A+D** abandonne ce raccourci. La structure du quadword change : `dw[0]` porte la **valeur** à écrire, `dw[1]` (dont seul l'octet bas compte) porte l'**adresse** du registre GS ciblé, une constante `GS_REG_*` de `common/include/gs_gp.h`. C'est un mécanisme d'écriture générique, et donc le seul moyen d'atteindre les registres de configuration du GS.

Un point prête à confusion : deux tables de « registres » cohabitent. Les constantes `GIF_REG_*` décrivent le **format** d'un quadword en mode PACKED ; les constantes `GS_REG_*` sont les **adresses réelles** des registres privilégiés du GS. Que `GIF_REG_PRIM`, `GIF_REG_RGBAQ` et `GIF_REG_XYZ2` (0x00/0x01/0x05) coïncident numériquement avec `GS_REG_PRIM`, `GS_REG_RGBAQ` et `GS_REG_XYZ2` est une **coïncidence pratique, pas une règle** : pour les registres de setup, il faut impérativement utiliser les vraies constantes `GS_REG_*`.

## Exemples

### Structure d'un quadword en A+D

| `dw` | Contenu |
|---|---|
| `dw[0]` (64 bits bas) | **DATA** — la valeur à écrire dans le registre GS |
| `dw[1]` (64 bits hauts, octet bas) | **ADDRESS** — l'adresse du registre GS ciblé (`GS_REG_*`) |

### Registres accessibles uniquement via A+D

| Constante | Adresse | Rôle |
|---|---|---|
| `GS_REG_XYOFFSET_1`/`_2` | 0x18/0x19 | Offset des coordonnées XYZ avant rasterization |
| `GS_REG_SCISSOR_1`/`_2` | 0x40/0x41 | Zone de découpe du rendu |
| `GS_REG_TEST_1`/`_2` | 0x47/0x48 | Tests par pixel (alpha, depth) |
| `GS_REG_FRAME_1`/`_2` | 0x4C/0x4D | Framebuffer (adresse VRAM, largeur, PSM, masque) |
| `GS_REG_ZBUF_1`/`_2` | 0x4E/0x4F | Configuration du Z-buffer |
| `GS_REG_BITBLTBUF` | 0x50 | Transfert VRAM↔VRAM ou RAM↔VRAM |
| `GS_REG_TRXPOS`/`TRXREG`/`TRXDIR` | 0x51/0x52/0x53 | Position/taille/déclenchement du transfert |

### Poser un XYOFFSET explicitement

```c
PACK_GIFTAG(q, GS_SET_XYOFFSET(2048 << 4, 2048 << 4), GS_REG_XYOFFSET_1);
q++;
```

### La table complète des codes de format PACKED

| Code | Constante | Rôle |
|---|---|---|
| 0x0-0x5 | `GIF_REG_PRIM`, `RGBAQ`, `ST`, `UV`, `XYZF2`, `XYZ2` | flux de sommets |
| 0x6-0xB | `TEX0_1/_2`, `CLAMP_1/_2`, `FOG` | texture et fog |
| 0xC-0xD | `XYZF3`, `XYZ3` | sommet sans draw kick |
| 0x0E | `GIF_REG_AD` | adresse+donnée générique |
| 0x0F | `GIF_REG_NOP` | quadword ignoré (padding) |

## Cas d'usage

- **Initialiser l'environnement de dessin** : c'est ce que fait `draw_setup_environment` en interne.
- **Uploader une texture** : écrire `BITBLTBUF`/`TRXPOS`/`TRXREG`/`TRXDIR`.
- **Changer une zone de clipping** en cours de frame.

## Avantages et inconvénients

✅ **Avantages** :
- Un seul mécanisme atteint n'importe quel registre du GS.
- Mélange librement setup et primitives dans un même paquet.

❌ **Inconvénients** / Limites :
- Un quadword complet par registre écrit : moins compact que les formats dédiés.
- La coïncidence numérique entre les deux tables encourage une erreur difficile à repérer.

## Connexions

### Notes liées
- [[PS2 - paquet GIF et GIFtag]] - Le format dans lequel A+D s'inscrit
- [[PS2 - registre XYOFFSET]] - Un registre accessible uniquement par A+D
- [[PS2 - framebuffer et Z-buffer]] - Configurés via `FRAME`/`ZBUF` en A+D
- [[PS2 - contextes de dessin du GS]] - Pourquoi ces registres existent en deux exemplaires
- [[PS2 - GS Graphics Synthesizer]] - Le destinataire de ces écritures

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 3c) — `common/include/gif_tags.h`, `common/include/gs_gp.h`

---
**Tags thématiques** : #ps2 #gif #gs #registres #graphisme
