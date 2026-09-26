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

<svg viewBox="0 0 450 250" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Les deux contextes de dessin du GS sélectionnés par le bit CTXT">
<text x="16" y="26" font-size="12" fill="currentColor">cinq registres existent en double : un bit suffit à basculer</text>
<rect x="16" y="38" width="190" height="130" rx="6" fill="#4c9aff" fill-opacity="0.08" stroke="#4c9aff" stroke-width="1.6"/>
<text x="26" y="56" font-size="11" fill="#4c9aff">CONTEXTE 1 (_1)</text>
<rect x="26" y="64" width="170" height="18" rx="3" fill="none" stroke="#4c9aff" stroke-width="1"/>
<text x="32" y="77" font-size="8.5" fill="#4c9aff">XYOFFSET_1</text>
<rect x="26" y="86" width="170" height="18" rx="3" fill="none" stroke="#4c9aff" stroke-width="1"/>
<text x="32" y="99" font-size="8.5" fill="#4c9aff">SCISSOR_1</text>
<rect x="26" y="108" width="170" height="18" rx="3" fill="none" stroke="#4c9aff" stroke-width="1"/>
<text x="32" y="121" font-size="8.5" fill="#4c9aff">FRAME_1</text>
<rect x="26" y="130" width="82" height="18" rx="3" fill="none" stroke="#4c9aff" stroke-width="1"/>
<text x="32" y="143" font-size="8.5" fill="#4c9aff">ZBUF_1</text>
<rect x="114" y="130" width="82" height="18" rx="3" fill="none" stroke="#4c9aff" stroke-width="1"/>
<text x="120" y="143" font-size="8.5" fill="#4c9aff">TEST_1</text>
<text x="26" y="162" font-size="8.5" fill="#4c9aff" opacity="0.8">draw_setup_environment(q, 0, …)</text>
<rect x="244" y="38" width="190" height="130" rx="6" fill="#f2994a" fill-opacity="0.08" stroke="#f2994a" stroke-width="1.6"/>
<text x="254" y="56" font-size="11" fill="#f2994a">CONTEXTE 2 (_2)</text>
<rect x="254" y="64" width="170" height="18" rx="3" fill="none" stroke="#f2994a" stroke-width="1"/>
<text x="260" y="77" font-size="8.5" fill="#f2994a">XYOFFSET_2</text>
<rect x="254" y="86" width="170" height="18" rx="3" fill="none" stroke="#f2994a" stroke-width="1"/>
<text x="260" y="99" font-size="8.5" fill="#f2994a">SCISSOR_2</text>
<rect x="254" y="108" width="170" height="18" rx="3" fill="none" stroke="#f2994a" stroke-width="1"/>
<text x="260" y="121" font-size="8.5" fill="#f2994a">FRAME_2</text>
<rect x="254" y="130" width="82" height="18" rx="3" fill="none" stroke="#f2994a" stroke-width="1"/>
<text x="260" y="143" font-size="8.5" fill="#f2994a">ZBUF_2</text>
<rect x="342" y="130" width="82" height="18" rx="3" fill="none" stroke="#f2994a" stroke-width="1"/>
<text x="348" y="143" font-size="8.5" fill="#f2994a">TEST_2</text>
<text x="254" y="162" font-size="8.5" fill="#f2994a" opacity="0.8">autre zone VRAM, autre clipping</text>
<rect x="152" y="186" width="146" height="34" rx="5" fill="#27ae60" fill-opacity="0.14" stroke="#27ae60" stroke-width="1.5"/>
<text x="162" y="207" font-size="10" fill="#27ae60">bit CTXT (bit 9 de PRIM)</text>
<line x1="152" y1="196" x2="112" y2="170" stroke="#4c9aff" stroke-width="1.5"/>
<line x1="298" y1="196" x2="338" y2="170" stroke="#f2994a" stroke-width="1.5"/>
<text x="16" y="240" font-size="10" fill="currentColor" opacity="0.85">bascule à coût nul : un bit posé sur la primitive, au lieu de retransmettre tout un lot de registres</text>
</svg>

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
