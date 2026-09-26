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

<svg viewBox="0 0 450 250" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Répartition très inégale des 491 fonctions publiques entre les six archives EE">
<text x="16" y="24" font-size="11.5" fill="currentColor">491 fonctions publiques, très inégalement réparties</text>
<text x="16" y="48" font-size="9" fill="currentColor">libkernel</text>
<rect x="86" y="36" width="330" height="18" rx="2" fill="#e05252" fill-opacity="0.35" stroke="#e05252" stroke-width="1"/>
<text x="422" y="49" font-size="9" fill="#e05252">352</text>
<text x="16" y="72" font-size="9" fill="currentColor">libdebug</text>
<rect x="86" y="60" width="56" height="18" rx="2" fill="#4c9aff" fill-opacity="0.3" stroke="#4c9aff" stroke-width="1"/>
<text x="148" y="73" font-size="9" fill="#4c9aff">~60</text>
<text x="16" y="96" font-size="9" fill="currentColor">libdraw</text>
<rect x="86" y="84" width="38" height="18" rx="2" fill="#27ae60" fill-opacity="0.3" stroke="#27ae60" stroke-width="1"/>
<text x="130" y="97" font-size="9" fill="#27ae60">~40</text>
<text x="16" y="120" font-size="9" fill="currentColor">libgraph</text>
<rect x="86" y="108" width="22" height="18" rx="2" fill="#27ae60" fill-opacity="0.3" stroke="#27ae60" stroke-width="1"/>
<text x="114" y="121" font-size="9" fill="#27ae60">~23</text>
<text x="16" y="144" font-size="9" fill="currentColor">libdma</text>
<rect x="86" y="132" width="13" height="18" rx="2" fill="#f2994a" fill-opacity="0.35" stroke="#f2994a" stroke-width="1"/>
<text x="105" y="145" font-size="9" fill="#f2994a">13</text>
<text x="16" y="168" font-size="9" fill="currentColor">libpacket</text>
<rect x="86" y="156" width="4" height="18" rx="1" fill="#f2994a" fill-opacity="0.35" stroke="#f2994a" stroke-width="1"/>
<text x="96" y="169" font-size="9" fill="#f2994a">3</text>
<text x="86" y="186" font-size="8.5" fill="currentColor" opacity="0.75">les bibliothèques graphiques sont petites ; libkernel est un système complet</text>
<rect x="16" y="196" width="418" height="46" rx="5" fill="#27ae60" fill-opacity="0.07" stroke="#27ae60" stroke-width="1.2"/>
<text x="26" y="214" font-size="9.5" fill="#27ae60">l'API publique n'exporte quasiment aucune variable globale</text>
<text x="26" y="230" font-size="8.5" fill="#27ae60" opacity="0.9">tout passe par des pointeurs de structures : framebuffer_t*, zbuffer_t*, packet_t*</text>
</svg>

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
