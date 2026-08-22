---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - graphisme
  - gs
---

# PS2 - contextes de dessin du GS

> [!abstract] Concept
> Le GS duplique en deux exemplaires indépendants tous les registres qui définissent où et comment une primitive est rasterisée ; le bit `CTXT` du registre `PRIM` choisit lequel utiliser, rendant le changement de contexte instantané.

## Explication

Cinq registres existent en double, suffixés `_1` et `_2` : `XYOFFSET`, `SCISSOR`, `FRAME`, `ZBUF` et `TEST`. Ensemble, ils forment un **contexte de dessin** — la description complète de la cible et des règles de rasterization.

Chaque primitive envoyée porte un bit `CTXT` (bit 9 de `PRIM`) qui sélectionne le jeu de registres à utiliser. Basculer d'un contexte à l'autre ne coûte donc **rien** : c'est un bit posé sur la primitive suivante, au lieu de retransmettre par DMA tout un lot de registres entre deux dessins.

L'intérêt pratique est de dessiner alternativement vers deux zones VRAM distinctes — un double-buffering géré à la main plutôt que par le vsync — ou vers deux fenêtres de clipping et d'offset différentes, sans jamais reconfigurer l'environnement du GS. Les samples simples n'utilisent qu'un seul contexte, celui désigné par le `0` passé en premier argument de `draw_setup_environment(q, 0, frame, z)`.

## Exemples

### Les registres dupliqués

| Registre | Rôle |
|---|---|
| `XYOFFSET_1` / `_2` | Offset appliqué aux coordonnées avant rasterization |
| `SCISSOR_1` / `_2` | Rectangle de clipping |
| `FRAME_1` / `_2` | Framebuffer cible (adresse VRAM, largeur, PSM) |
| `ZBUF_1` / `_2` | Z-buffer associé |
| `TEST_1` / `_2` | Tests par pixel (alpha test, depth test) |

### Choisir le contexte sur une primitive

```c
// CTXT = 0 → contexte 1
PACK_GIFTAG(q, GIF_SET_PRIM(6, 0, 0, 0, 0, 0, 0, 0, 0), GIF_REG_PRIM);

// CTXT = 1 → contexte 2, tout le reste identique
PACK_GIFTAG(q, GIF_SET_PRIM(6, 0, 0, 0, 0, 0, 0, 1, 0), GIF_REG_PRIM);
```

### Configurer deux contextes

```c
q = draw_setup_environment(q, 0, &frame0, &z);   // contexte 1
q = draw_setup_environment(q, 1, &frame1, &z);   // contexte 2
```

## Cas d'usage

- **Double-buffering manuel** : deux framebuffers, un par contexte.
- **Split screen** : deux fenêtres de scissor et d'offset simultanées.
- **Rendu vers texture** : un contexte visant la VRAM de texture, l'autre l'écran.

## Avantages et inconvénients

✅ **Avantages** :
- Bascule à coût nul : un bit, aucune retransmission de registres.
- Deux configurations complètes disponibles en permanence.

❌ **Inconvénients** / Limites :
- Deux contextes seulement, pas davantage.
- Le bit `CTXT` est facile à oublier dans les neuf arguments de `GIF_SET_PRIM`.

## Connexions

### Notes liées
- [[PS2 - registre PRIM]] - Le registre qui porte le bit `CTXT`
- [[PS2 - registre XYOFFSET]] - Un des registres dupliqués
- [[PS2 - framebuffer et Z-buffer]] - `FRAME`/`ZBUF`, également dupliqués
- [[PS2 - mode A+D du GIF]] - Comment ces registres sont écrits
- [[PS2 - GS Graphics Synthesizer]] - Le matériel concerné

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 3i) — `common/include/gs_gp.h`

---
**Tags thématiques** : #ps2 #gs #contexte #graphisme #registres
