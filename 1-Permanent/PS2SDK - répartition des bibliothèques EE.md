---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - bibliotheques
  - ee
---

# PS2SDK - répartition des bibliothèques EE

> [!abstract] Concept
> Les six archives d'un projet graphique EE totalisent 491 fonctions publiques très inégalement réparties : `libpacket` en expose 3, `libdma` 13, et `libkernel` à elle seule 352.

## Explication

Le relevé, fait en croisant `nm -g --defined-only` sur chaque archive avec les identifiants déclarés dans les en-têtes, montre une hiérarchie très marquée. Les bibliothèques graphiques sont petites et faciles à embrasser ; `libkernel` est une bibliothèque système complète qui concentre les syscalls, les threads, les sémaphores, les interruptions, la TLB et le pont SIF.

Un point est structurant pour lire les exemples du SDK : **l'API publique n'exporte pratiquement aucune variable globale**. Tout passe par des fonctions et des structures transmises par pointeur (`framebuffer_t *`, `zbuffer_t *`, `packet_t *`). Les rares symboles de données publics sont soit des métadonnées ERL (`erl_id`, `erl_dependancies`, présents dans toutes les archives), soit la fonte bitmap `msx` de `libdebug`, soit de l'état interne non documenté de `libkernel` (`_fio_cd`, `_sif_rpc_data`, `g_Timer`…) à ne jamais toucher.

Autre observation utile : plusieurs symboles sont exportés sans être déclarés dans le moindre en-tête — `graph_get_field` dans `libgraph`, cinq fonctions dans `libdebug`, 29 symboles dans `libkernel` dont cinq nommés `RFU009`, `RFU059`… (*Reserved for Future Use*, emplacements de syscalls jamais attribués par Sony). Ils sont utilisables en les déclarant soi-même, mais hors contrat.

## Exemples

### Vue d'ensemble des six archives

| Archive | `#include` de tête | En-têtes servis | Fonctions |
|---|---|---|---|
| `libpacket.a` | `packet.h` | 1 | 3 |
| `libdma.a` | `dma.h` | 1 | 13 |
| `libgraph.a` | `graph.h` | 3 | 29 |
| `libdebug.a` | `debug.h` | 3 | 41 |
| `libdraw.a` | `draw.h` | 12 | 53 |
| `libkernel.a` | `kernel.h` | 21 | 352 |

### `draw.h` est un chapeau, pas une API

```c
#include <tamtypes.h>
#include <draw_blending.h>   #include <draw_buffers.h>
#include <draw_dithering.h>  #include <draw_fog.h>
#include <draw_masking.h>    #include <draw_primitives.h>
#include <draw_sampling.h>   #include <draw_tests.h>
#include <draw_types.h>      #include <draw2d.h>
#include <draw3d.h>
```

Un seul `#include <draw.h>` amène les douze en-têtes. Les six fonctions de `draw.h` en propre (`draw_setup_environment`, `draw_clear`, `draw_finish`, `draw_wait_finish`, `draw_texture_transfer`, `draw_texture_flush`) sont exactement celles du squelette de rendu ; le reste est du confort.

### Les familles de `libkernel`

Threads (`CreateThread`, `SleepThread`…), sémaphores (`CreateSema`, `WaitSema`…), interruptions (`AddIntcHandler`, `EnableDmac`…), cache/mémoire (`FlushCache`, `GetMemorySize`…), TLB, alarmes, SIF (`sceSifSetDma`…), exécution système (`ExecPS2`, `Exit`…), GS côté noyau (`SetGsCrt`…).

## Cas d'usage

- **Choisir la bonne archive** pour une fonction donnée avant de l'ajouter à `EE_LIBS`.
- **Explorer une API inconnue** : partir de l'en-tête chapeau, pas de la liste de symboles.
- **Éviter les faux amis** : `DelayThread` est dans `delaythread.h`, pas dans `kernel.h` — cause classique d'`implicit declaration`.

## Avantages et inconvénients

✅ **Avantages** :
- API purement fonctionnelle, sans état global exposé : facile à raisonner.
- Découpage clair par domaine.

❌ **Inconvénients** / Limites :
- Des symboles exportés hors en-tête créent des zones grises.
- `libkernel` est un fourre-tout de 1,3 Mo difficile à cartographier.

## Connexions

### Notes liées
- [[PS2SDK - convention de préfixe i et underscore]] - La règle de nommage interne de `libkernel`
- [[PS2SDK - emplacement des en-têtes et bibliothèques]] - Où trouver ces archives
- [[PS2SDK - pipeline de rendu bas niveau]] - Usage concret de `libdraw`/`libgraph`
- [[PS2SDK - console de debug libdebug]] - Détail de `libdebug`

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 2, « Que contient chaque bibliothèque »)

---
**Tags thématiques** : #ps2sdk #bibliotheques #api #ee
