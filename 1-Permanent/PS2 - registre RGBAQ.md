---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - graphisme
  - gs
---

# PS2 - registre RGBAQ

> [!abstract] Concept
> `RGBAQ` porte la couleur et l'alpha appliqués aux prochains sommets sous forme de quatre entiers 8 bits, plus un champ `Q` qui est le **seul champ flottant** du registre et doit être fourni comme pattern binaire IEEE-754, jamais comme un entier.

## Explication

Les quatre premiers champs sont sans surprise : R, G, B et A occupent chacun 8 bits (0 à 255), empaquetés par simple décalage comme tous les autres champs de tag. La valeur d'alpha n'a d'effet que si le bit `ABE` du registre `PRIM` active l'alpha blending.

Le champ `Q` est différent : c'est le coefficient de correction de perspective (1/w) utilisé conjointement avec les coordonnées `ST` quand `FST=0` dans `PRIM`. Il occupe les 32 bits hauts et est interprété comme un **float**.

Le piège est réel : `GIF_SET_RGBAQ` traite son cinquième argument comme un entier 32 bits brut (`(Q)&0xFFFFFFFF`), sans aucune conversion. Écrire `GIF_SET_RGBAQ(r, g, b, a, 1)` est un bug silencieux — cela pose l'entier `1` réinterprété comme float, soit une valeur dénormalisée proche de zéro, et non `1.0f`. La valeur correcte pour « pas de correction de perspective » est `0x3F800000`, le pattern binaire de `1.0f`.

## Exemples

### La macro et ses champs

```c
#define GIF_SET_RGBAQ(R, G, B, A, Q)                                \
    (u64)((R)&0x000000FF) << 0 | (u64)((G)&0x000000FF) << 8 |       \
        (u64)((B)&0x000000FF) << 16 | (u64)((A)&0x000000FF) << 24 | \
        (u64)((Q)&0xFFFFFFFF) << 32
```

| Champ | Bits | Type | Rôle |
|---|---|---|---|
| `R` | 0-7 | `u8` | intensité rouge |
| `G` | 8-15 | `u8` | intensité verte |
| `B` | 16-23 | `u8` | intensité bleue |
| `A` | 24-31 | `u8` | alpha (0x80 ≈ mi-transparent) |
| `Q` | 32-63 | `float32` | correction de perspective (1/w) |

### Un dégradé rouge vers bleu, semi-transparent

```c
PACK_GIFTAG(q, GIF_SET_RGBAQ((i * 10), 0, 255 - (i * 10), 0x80, 0x3F800000),
            GIF_REG_RGBAQ);
```

### Les deux écritures correctes de `Q = 1.0f`

```c
0x3F800000                    // pattern binaire écrit directement
*(u32*)&(float){1.0f}         // cast explicite de l'adresse d'un float

// ❌ jamais : 1, ni (u32)1.0f  — les deux donnent une valeur fausse
```

## Cas d'usage

- **Colorer une primitive unie** : R/G/B fixés, `A=0x80`, `Q=0x3F800000`.
- **Gouraud shading** : un `RGBAQ` différent avant chaque sommet, avec `IIP=1`.
- **Texture perspective-correct** : `Q` calculé par sommet à partir de 1/w.

## Avantages et inconvénients

✅ **Avantages** :
- Couleur et alpha dans un seul registre de 64 bits.
- La couleur peut varier par sommet sans reconfigurer le rendu.

❌ **Inconvénients** / Limites :
- Aucune macro de conversion float→u32 pour `Q` : l'erreur est silencieuse.
- Un `Q` incorrect ne se manifeste qu'avec des textures en perspective.

## Connexions

### Notes liées
- [[IEEE-754 - simple précision 32 bits]] - Pourquoi `0x3F800000` vaut `1.0f`
- [[PS2 - registre PRIM]] - Les bits `ABE`, `IIP` et `FST` qui conditionnent l'effet
- [[PS2 - paquet GIF et GIFtag]] - Le paquet qui transporte ce registre
- [[PS2 - GS Graphics Synthesizer]] - Le rasterizer qui applique la couleur

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 3l) — `common/include/gif_tags.h`

---
**Tags thématiques** : #ps2 #gs #rgbaq #couleur #graphisme
