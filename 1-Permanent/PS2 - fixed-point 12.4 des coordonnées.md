---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - graphisme
  - gs
---

# PS2 - fixed-point 12.4 des coordonnées

> [!abstract] Concept
> Le GS attend les coordonnées X et Y des sommets en virgule fixe 12.4 — 12 bits d'entier plus 4 bits de fraction — ce qui impose d'envoyer `x << 4` pour une position pixel `x`, sous peine d'obtenir une primitive 16 fois trop petite.

## Explication

Dans un paquet GIF, les positions de sommets ne sont pas de simples entiers pixel. Les champs X et Y du registre `XYZ2` occupent 16 bits chacun, dont 12 servent de partie entière (plage 0 à 4095) et 4 de partie fractionnaire (0 à 15/16). Cette précision au 1/16ᵉ de pixel sert à l'interpolation et à l'antialiasing du rasterizer, qui peut placer un bord de triangle entre deux pixels.

La macro `GIF_SET_XYZ(X, Y, Z)` ne connaît rien à ce format : elle empile simplement X et Y sur 16 bits et Z sur 32. C'est au programmeur de fournir des valeurs déjà décalées, d'où les `<< 4` omniprésents dans le code de rendu. Une position envoyée sans décalage est interprétée seize fois trop petite : la primitive devient minuscule et collée à l'origine, ce qui la rend en pratique invisible.

Le champ Z fait exception : il reste un entier simple sur 32 bits, sans partie fractionnaire. Seuls X et Y portent le format fixed-point.

## Exemples

### La macro et le format

```c
#define GIF_SET_XYZ(X, Y, Z)                                   \
    (u64)((X)&0x0000FFFF) << 0 | (u64)((Y)&0x0000FFFF) << 16 | \
        (u64)((Z)&0xFFFFFFFF) << 32
```

| Champ | Bits | Format | Précision |
|---|---|---|---|
| X | 0-15 | 12.4 fixed-point | 1/16ᵉ de pixel |
| Y | 16-31 | 12.4 fixed-point | 1/16ᵉ de pixel |
| Z | 32-63 | entier | profondeur brute |

### Envoyer un sommet à une position pixel

```c
// position logique (x, y) en pixels, offset par défaut de 2048 compensé
PACK_GIFTAG(q, GIF_SET_XYZ((x << 4) + (2048 << 4),
                           (y << 4) + (2048 << 4), 0), GIF_REG_XYZ2);
```

### Depuis un flottant

```c
int fx = (int)(x_float * 16.0f);   // équivalent d'un << 4 avec sous-pixel conservé
```

## Cas d'usage

- **Dessiner une primitive** à une position pixel exacte.
- **Animation fluide** : exploiter les 4 bits de fraction pour un déplacement sous-pixel.
- **Diagnostiquer une primitive invisible** : vérifier la présence du `<< 4`.

## Avantages et inconvénients

✅ **Avantages** :
- Précision sous-pixel gratuite pour l'antialiasing et les mouvements lents.
- Format compact : deux coordonnées dans 32 bits.

❌ **Inconvénients** / Limites :
- Le décalage est entièrement à la charge du programmeur, sans garde-fou.
- La plage entière est limitée à 0-4095, ce qui impose un offset.

## Connexions

### Notes liées
- [[PS2 - registre XYOFFSET]] - Pourquoi on ajoute `2048 << 4` à chaque coordonnée
- [[PS2 - paquet GIF et GIFtag]] - Le contexte d'envoi de ces coordonnées
- [[PS2 - registre PRIM]] - Le registre qui décrit la primitive dessinée
- [[PS2 - GS Graphics Synthesizer]] - L'espace de coordonnées 12 bits du rasterizer

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 3g) — `common/include/gif_tags.h`

---
**Tags thématiques** : #ps2 #gs #coordonnees #fixedpoint #graphisme
