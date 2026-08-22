---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - graphisme
  - gs
---

# PS2 - registre PRIM

> [!abstract] Concept
> `GIF_SET_PRIM` construit la valeur du registre GS `PRIM` : trois bits pour le type de primitive et huit drapeaux d'un bit qui activent shading, texture, fog, blending, antialiasing, mode de coordonnées de texture et choix du contexte.

## Explication

`PRIM` est le registre qui décrit **quoi** dessiner et **comment** le rasteriser. Ses trois premiers bits choisissent parmi sept primitives : point, ligne, line strip, triangle, triangle strip, triangle fan et sprite. Le sprite (valeur 6) est particulier et très utilisé en 2D : il se définit par deux sommets seulement, le coin haut-gauche et le coin bas-droit d'un rectangle plein.

Les huit champs suivants sont des interrupteurs d'un bit. `IIP` choisit entre shading plat et Gouraud, `TME` active le texture mapping, `FGE` le fog, `ABE` l'alpha blending, `AA1` l'antialiasing une passe. `FST` détermine si les coordonnées de texture sont interprétées en STQ (perspective-correct) ou en UV (linéaire). `CTXT` sélectionne le contexte de dessin, et `FIX` fixe les décimales de fog.

Toute la configuration du rendu d'une primitive tient donc dans un seul registre de 64 bits, réécrit aussi souvent que nécessaire dans un paquet GIF. Un `PRIM` à zéro sur tous les drapeaux donne le rendu le plus simple possible : une couleur unie, sans texture ni transparence.

## Exemples

### La macro

```c
#define GIF_SET_PRIM(PRIM, IIP, TME, FGE, ABE, AA1, FST, CTXT, FIX)    \
    (u64)((PRIM)&0x00000007) << 0 | (u64)((IIP)&0x00000001) << 3 |     \
        (u64)((TME)&0x00000001) << 4 | (u64)((FGE)&0x00000001) << 5 |  \
        (u64)((ABE)&0x00000001) << 6 | (u64)((AA1)&0x00000001) << 7 |  \
        (u64)((FST)&0x00000001) << 8 | (u64)((CTXT)&0x00000001) << 9 | \
        (u64)((FIX)&0x00000001) << 10
```

### Les champs

| Champ | Bits | Rôle |
|---|---|---|
| `PRIM` | 0-2 | 0=point, 1=ligne, 2=line strip, 3=triangle, 4=triangle strip, 5=triangle fan, 6=sprite |
| `IIP` | 3 | 0=flat, 1=Gouraud |
| `TME` | 4 | texture mapping |
| `FGE` | 5 | fog |
| `ABE` | 6 | alpha blending |
| `AA1` | 7 | antialiasing 1 passe |
| `FST` | 8 | 0=STQ (perspective-correct), 1=UV (linéaire) |
| `CTXT` | 9 | 0=contexte 1, 1=contexte 2 |
| `FIX` | 10 | décimales de fog fixées |

### Un sprite plein, sans aucune option

```c
PACK_GIFTAG(q, GIF_SET_PRIM(6, 0, 0, 0, 0, 0, 0, 0, 0), GIF_REG_PRIM);
q++;
// suivi de deux GIF_SET_XYZ : coin haut-gauche puis coin bas-droit
```

### Un triangle texturé avec blending

```c
PACK_GIFTAG(q, GIF_SET_PRIM(3, 0, 1, 0, 1, 0, 1, 0, 0), GIF_REG_PRIM);
//                          │     │     │     │
//                          │     TME   ABE   FST=UV
//                          triangle
```

## Cas d'usage

- **Dessiner un rectangle plein** : `PRIM=6`, tout le reste à zéro.
- **Rendu 3D texturé** : `PRIM=3` ou 4 avec `TME=1` et `FST=0`.
- **Interface semi-transparente** : `ABE=1` avec une valeur d'alpha dans RGBAQ.

## Avantages et inconvénients

✅ **Avantages** :
- Toute la configuration de rendu dans un registre unique.
- Modifiable primitive par primitive, sans reconfiguration globale.

❌ **Inconvénients** / Limites :
- Neuf arguments positionnels sans nom : très facile d'en décaler un.
- Le sprite ne supporte pas le Gouraud shading.

## Connexions

### Notes liées
- [[PS2 - paquet GIF et GIFtag]] - Le paquet qui transporte ce registre
- [[PS2 - contextes de dessin du GS]] - Le bit `CTXT`
- [[PS2 - registre RGBAQ]] - La couleur appliquée à la primitive
- [[PS2 - fixed-point 12.4 des coordonnées]] - Les sommets qui suivent
- [[PS2 - GS Graphics Synthesizer]] - Le rasterizer concerné

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 3j) — `common/include/gif_tags.h`, `common/include/gs_gp.h`

---
**Tags thématiques** : #ps2 #gs #prim #primitives #graphisme
