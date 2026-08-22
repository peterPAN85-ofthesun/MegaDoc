---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - build
  - linkage
---

# PS2SDK - en-têtes header-only sans archive

> [!abstract] Concept
> Une partie du PS2SDK ne contient que des `#define` et des `typedef` entièrement résolus à la compilation : ces en-têtes n'ont **aucune archive** à lier, et ajouter un `-l` par réflexe pour chacun produit un `cannot find -l…` trompeur.

## Explication

C'est l'instanciation PS2 du principe général [[C - en-tête et bibliothèque (déclarer vs définir)]] : un en-tête déclare, une archive définit, et les deux sont indépendants. Quand un fichier ne contient que des macros, tout est résolu par le préprocesseur — il n'y a **rien à lier**, donc pas d'archive correspondante et jamais eu.

Le message d'erreur est particulièrement trompeur : `ld: have you installed the static version of the gif_tags library ?` laisse croire à une installation incomplète, alors que la bibliothèque n'a jamais existé. Le réflexe correct est de vérifier l'existence de l'archive avec `ls $PS2SDK/ee/lib/lib*.a` avant d'ajouter un `-l`.

Un cas mixte mérite attention : `draw_types.h` ne définit que des types (`framebuffer_t`, `zbuffer_t`…), mais ces types sont consommés par des fonctions de `libdraw`. C'est le `#include <draw.h>` qui l'amène et `-ldraw` qui fournit le code — le `-l` existe donc, mais il ne correspond pas à cet en-tête-là.

## Exemples

### Inventaire des en-têtes sans archive

| En-tête | Contenu | `-l` |
|---|---|---|
| `common/include/gs_gp.h` | 120 defines — registres GS, macros `GS_SET_*` | **aucun** |
| `common/include/gif_tags.h` | 42 defines — `GIF_SET_TAG`, `GIF_REG_*` | **aucun** |
| `ee/include/dma_tags.h` | 21 defines — DMAtags | **aucun** |
| `common/include/gs_psm.h` | 19 defines — `GS_PSM_*` | **aucun** |
| `common/include/tamtypes.h` | 35 typedefs — `u8`/`u32`/`u128`… | **aucun** |
| `ee/include/draw_types.h` | 7 typedefs — `framebuffer_t`… | via `libdraw` |

### L'erreur produite par un `-l` de trop

```
ld: cannot find -lgif_tags: Aucun fichier ou dossier de ce nom
ld: have you installed the static version of the gif_tags library ?
```

Correction : retirer le `-l`, **garder** le `#include`.

## Cas d'usage

- **Diagnostiquer un `cannot find -l…`** : vérifier d'abord si l'en-tête est header-only.
- **Écrire un `EE_LIBS` minimal** : ne lister que les archives réellement existantes.
- **Comprendre `PACK_GIFTAG`** : c'est une macro, pas une fonction à lier.

## Avantages et inconvénients

✅ **Avantages** :
- Zéro coût à l'exécution : tout est résolu à la compilation.
- Aucune dépendance de lien à gérer.

❌ **Inconvénients** / Limites :
- Le message d'erreur de `ld` oriente vers une fausse piste.
- Le nom des fichiers (`dma_tags.h`) suggère une archive `libdma_tags.a` qui n'existe pas.

## Connexions

### Notes liées
- [[C - en-tête et bibliothèque (déclarer vs définir)]] - Le principe générique
- [[PS2SDK - emplacement des en-têtes et bibliothèques]] - Où vérifier l'existence d'une archive
- [[PS2 - paquet GIF et GIFtag]] - Les macros de `gif_tags.h`
- [[PS2SDK - Makefile d'un projet EE]] - Où se pose le problème

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 2)

---
**Tags thématiques** : #ps2sdk #linkage #build #header-only
