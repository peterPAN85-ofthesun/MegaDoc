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
