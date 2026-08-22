---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - graphisme
  - gif
---

# PS2 - paquet GIF et GIFtag

> [!abstract] Concept
> Un paquet GIF est un GIFtag (en-tête de 128 bits décrivant ce qui suit) suivi de N quadwords de données ; c'est le seul langage par lequel le GS reçoit des ordres, et `PACK_GIFTAG` n'est que la macro qui écrit un quadword en mémoire.

## Explication

`PACK_GIFTAG(Q, D0, D1)` est la primitive la plus basse du dessin : elle pose `D0` dans les 64 bits bas et `D1` dans les 64 bits hauts d'un quadword. Elle ne connaît rien au GIF — c'est un simple « pack 2×64 → 128 bits ». Tout le sens vient des valeurs qu'on y met, produites par les macros `GIF_SET_*` de `common/include/gif_tags.h`.

Le GIFtag lui-même est construit par `GIF_SET_TAG(nloop, eop, pre, prim, flg, nreg)`. `NLOOP` annonce combien de quadwords de données suivent, `EOP` marque la fin du paquet, `FLG` choisit le mode et `NREG` le nombre de descripteurs de registres. Trois modes existent : **PACKED** (le plus courant, données alignées sur 128 bits), **REGLIST** (données compactées sur 64 bits, sans padding) et **IMAGE** (transfert brut vers la VRAM, typiquement l'upload de texture).

Chaque macro `GIF_SET_*` fonctionne comme un **encodeur d'instruction** : elle place des valeurs à des offsets de bits précis dans un mot de 64 bits, exactement comme un assembleur encode opcode et opérandes. `PACK_GIFTAG` est le « store » qui écrit ce mot en mémoire. La méthode pour décoder un tag à la main est donc toujours la même : prendre la définition bit à bit dans le header, appliquer `(valeur & masque) << décalage` pour chaque champ, puis faire le OR de tous les champs.

## Exemples

### La macro elle-même

```c
#define PACK_GIFTAG(Q, D0, D1) \
    Q->dw[0] = (u64)(D0),      \
    Q->dw[1] = (u64)(D1)
```

### Un paquet complet : un tag puis quatre données

```c
PACK_GIFTAG(q, GIF_SET_TAG(4, 1, 0, 0, 0, 1), GIF_REG_AD);   // NLOOP=4, EOP=1, PACKED, A+D
q++;
PACK_GIFTAG(q, GIF_SET_PRIM(6, 0,0,0,0,0,0,0,0), GIF_REG_PRIM);
q++;
PACK_GIFTAG(q, GIF_SET_RGBAQ(255, 0, 0, 0x80, 0x3F800000), GIF_REG_RGBAQ);
q++;
PACK_GIFTAG(q, GIF_SET_XYZ(x << 4, y << 4, 0), GIF_REG_XYZ2);
q++;
```

### Décodage bit à bit du GIFtag ci-dessus

| Champ | Bits | Valeur | Sens |
|---|---|---|---|
| `NLOOP` | 0-14 | 4 | 4 qwords de données suivent |
| `EOP` | 15 | 1 | fin de paquet |
| `PRE` | 46 | 0 | ne force pas de PRIM depuis le tag |
| `PRIM` | 47-57 | 0 | ignoré puisque `PRE=0` |
| `FLG` | 58-59 | 0 | mode PACKED |
| `NREG` | 60-63 | 1 | un seul descripteur de registre |

```
NLOOP=4        → 0x0000000000000004
EOP=1 (bit 15) → 0x0000000000008000
NREG=1 (bit60) → 0x1000000000000000
                 -------------------
                 0x1000000000008004   ← valeur exacte de Q->dw[0]
```

## Cas d'usage

- **Dessiner une primitive** sans passer par gsKit.
- **Uploader une texture** avec un GIFtag en mode IMAGE.
- **Lire un dump mémoire** de paquet et le décoder champ par champ.

## Avantages et inconvénients

✅ **Avantages** :
- Format compact et très proche du matériel.
- Un même mécanisme couvre primitives, registres et transferts d'image.

❌ **Inconvénients** / Limites :
- `NLOOP` doit correspondre exactement au nombre de qwords écrits, sans aucune vérification.
- Écrire les tags à la main est verbeux et sujet aux erreurs de décalage.

## Connexions

### Notes liées
- [[PS2 - mode A+D du GIF]] - Le format générique le plus utilisé
- [[PS2 - registre PRIM]] - Le premier registre écrit dans presque tout paquet
- [[PS2 - registre RGBAQ]] - La couleur des sommets
- [[PS2 - DMAtag et mode chaîné]] - L'autre langage de tags, à un étage inférieur
- [[PS2 - GS Graphics Synthesizer]] - Le destinataire du paquet

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 3c) — `common/include/gif_tags.h`

---
**Tags thématiques** : #ps2 #gif #giftag #graphisme #gs
