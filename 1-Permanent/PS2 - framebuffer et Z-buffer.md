---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - graphisme
  - vram
---

# PS2 - framebuffer et Z-buffer

> [!abstract] Concept
> Framebuffer et Z-buffer sont deux buffers VRAM distincts décrits par deux structures séparées : le premier porte la couleur affichée et existe toujours, le second porte la profondeur et se désactive par un simple champ `enable`.

## Explication

Le framebuffer contient la couleur de chaque pixel — c'est ce qui est réellement affiché, relié aux circuits de sortie par `graph_initialize`. Le Z-buffer contient la distance à la caméra de chaque pixel et sert au test d'occlusion : ne conserver, sur un pixel donné, que la primitive la plus proche.

Les deux sont décrits par des structures distinctes dans `ee/include/draw_buffers.h`, chacune avec son propre format de pixel — `psm` pour le framebuffer, `zsm` pour le Z-buffer, et ces deux champs n'utilisent pas les mêmes constantes. Le Z-buffer possède en plus un champ `enable` et un champ `method` (la fonction de comparaison).

Quand `z->enable = 0`, cas de tous les samples 2D, le test de profondeur est désactivé : les primitives s'écrivent dans le framebuffer strictement **dans leur ordre d'envoi**, la dernière écrasant la précédente. Il n'y a alors aucune notion de profondeur 3D — ce qui est parfaitement suffisant pour du sprite et de l'interface, et économise l'allocation VRAM correspondante.

<svg viewBox="0 0 450 240" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Framebuffer et Z-buffer, deux buffers VRAM distincts">
<rect x="16" y="40" width="200" height="96" rx="6" fill="#4c9aff" fill-opacity="0.08" stroke="#4c9aff" stroke-width="1.5"/>
<text x="26" y="58" font-size="11" fill="#4c9aff">FRAMEBUFFER — la couleur</text>
<text x="26" y="76" font-size="9" fill="#4c9aff" opacity="0.9">ce qui est réellement affiché</text>
<text x="26" y="92" font-size="9" fill="#4c9aff" opacity="0.9">relié à la sortie par graph_initialize</text>
<text x="26" y="110" font-size="9" fill="#4c9aff">champ psm · existe toujours</text>
<text x="26" y="126" font-size="9" fill="#4c9aff" opacity="0.75">struct framebuffer_t</text>
<rect x="234" y="40" width="200" height="96" rx="6" fill="#f2994a" fill-opacity="0.08" stroke="#f2994a" stroke-width="1.5"/>
<text x="244" y="58" font-size="11" fill="#f2994a">Z-BUFFER — la profondeur</text>
<text x="244" y="76" font-size="9" fill="#f2994a" opacity="0.9">distance à la caméra par pixel</text>
<text x="244" y="92" font-size="9" fill="#f2994a" opacity="0.9">test d'occlusion : garde le plus proche</text>
<text x="244" y="110" font-size="9" fill="#f2994a">champ zsm (≠ psm) · enable · method</text>
<text x="244" y="126" font-size="9" fill="#f2994a" opacity="0.75">struct zbuffer_t</text>
<text x="16" y="26" font-size="12" fill="currentColor">deux structures séparées dans ee/include/draw_buffers.h — et deux jeux de constantes</text>
<rect x="16" y="150" width="200" height="76" rx="5" fill="none" stroke="#27ae60" stroke-width="1.3"/>
<text x="26" y="168" font-size="10" fill="#27ae60">z->enable = 1 — rendu 3D</text>
<polygon points="40,206 90,180 130,206" fill="#27ae60" fill-opacity="0.35" stroke="#27ae60" stroke-width="1"/>
<polygon points="90,214 140,188 180,214" fill="#4c9aff" fill-opacity="0.2" stroke="#4c9aff" stroke-width="1" stroke-dasharray="3 2"/>
<text x="140" y="178" font-size="8.5" fill="#27ae60">le plus proche gagne</text>
<rect x="234" y="150" width="200" height="76" rx="5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-dasharray="4 3"/>
<text x="244" y="168" font-size="10" fill="currentColor">z->enable = 0 — 2D, tous les samples</text>
<polygon points="258,206 308,180 348,206" fill="#27ae60" fill-opacity="0.3" stroke="#27ae60" stroke-width="1"/>
<polygon points="300,214 350,188 390,214" fill="#4c9aff" fill-opacity="0.5" stroke="#4c9aff" stroke-width="1"/>
<text x="244" y="234" font-size="8.5" fill="currentColor" opacity="0.8">ordre d'envoi strict : la dernière écrase — et pas d'allocation VRAM pour le Z</text>
</svg>

## Exemples

### Les deux structures

```c
typedef struct {
    unsigned int address;
    unsigned int width;
    unsigned int height;
    unsigned int psm;
    unsigned int mask;
} framebuffer_t;

typedef struct {
    unsigned int enable;
    unsigned int method;
    unsigned int address;
    unsigned int zsm;
    unsigned int mask;
} zbuffer_t;
```

### Initialisation 2D, Z-buffer désactivé

```c
frame->width  = 512;
frame->height = 512;
frame->mask   = 0;
frame->psm    = GS_PSM_32;
frame->address = graph_vram_allocate(frame->width, frame->height,
                                     frame->psm, GRAPH_ALIGN_PAGE);

z->enable  = 0;      // pas de test de profondeur
z->address = 0;
z->mask    = 0;
z->zsm     = 0;

graph_initialize(frame->address, frame->width, frame->height, frame->psm, 0, 0);
```

### Comparaison

| | Framebuffer | Z-buffer |
|---|---|---|
| Contenu | Couleur de chaque pixel | Profondeur de chaque pixel |
| Rôle | Relié à l'affichage via `graph_initialize` | Test d'occlusion |
| Activation | Toujours actif | `enable` (0/1), désactivable |
| Format | `psm` (`GS_PSM_*`) | `zsm` (`GS_PSMZ_*`) |

## Cas d'usage

- **Rendu 2D** : Z-buffer désactivé, ordre d'envoi = ordre d'empilement.
- **Rendu 3D** : Z-buffer activé et alloué en VRAM comme le framebuffer.
- **Économie de VRAM** : ne pas allouer de Z-buffer quand il est inutile.

## Avantages et inconvénients

✅ **Avantages** :
- Le Z-buffer est optionnel : on ne paie que ce qu'on utilise.
- Structures simples, transmises par pointeur aux fonctions `draw_*`.

❌ **Inconvénients** / Limites :
- Les deux buffers se partagent 4 Mo de VRAM avec les textures.
- `psm` et `zsm` utilisent des constantes différentes, source de confusion.

## Connexions

### Notes liées
- [[PS2 - PSM format de stockage des pixels]] - Les formats de ces deux buffers
- [[PS2 - allocation VRAM et alignement]] - Comment les placer en VRAM
- [[PS2 - contextes de dessin du GS]] - `FRAME`/`ZBUF` dupliqués par contexte
- [[PS2SDK - pipeline de rendu bas niveau]] - Leur initialisation dans le pipeline

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 3f) — `ee/include/draw_buffers.h`

---
**Tags thématiques** : #ps2 #framebuffer #zbuffer #vram #graphisme
