---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - hardware
  - graphisme
  - gs
---

# PS2 - GS Graphics Synthesizer

> [!abstract] Concept
> Le GS est le processeur graphique de la PS2 : un rasterizer à registres, sans aucun shader programmable, doté de 4 Mo de VRAM, que l'on pilote exclusivement en lui envoyant des paquets GIF construits par l'EE ou VU1.

## Explication

Le GS n'est pas un GPU au sens moderne : il ne fait tourner aucun programme. C'est une machine à états dont on écrit les **registres** — `PRIM` pour le type de primitive, `RGBAQ` pour la couleur, `XYZ2` pour un sommet, `FRAME`/`ZBUF`/`SCISSOR`/`TEST` pour l'environnement de dessin. Écrire dans certains registres (`XYZ2`) déclenche le dessin : c'est le *draw kick*.

Ces écritures n'arrivent pas par accès mémoire direct mais par le **GIF** (Graphics Interface), qui lit des paquets structurés en GIFtags. Le chemin normal est donc : l'EE (ou VU1) construit un paquet en RAM, le contrôleur DMA le transfère au GIF, et le GIF traduit son contenu en écritures de registres GS.

Sa mémoire embarquée est de **4 Mo de VRAM**, partagée entre framebuffer, Z-buffer, textures et CLUT. C'est la ressource la plus contrainte du système : le choix du format de pixel ([[PS2 - PSM format de stockage des pixels]]) a un impact direct sur ce qui tient en mémoire. L'espace de coordonnées interne du rasterizer est un espace **non signé de 12 bits** (0 à 4095), d'où le recours au registre XYOFFSET pour placer une origine logique.

<svg viewBox="0 0 450 275" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chemin de données vers le GS : paquet GIF, registres, rasterizer, VRAM">
<defs><marker id="gsa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<rect x="16" y="44" width="92" height="46" rx="5" fill="none" stroke="#4c9aff" stroke-width="1.5"/>
<text x="30" y="64" font-size="10.5" fill="#4c9aff">EE ou VU1</text>
<text x="24" y="80" font-size="9" fill="#4c9aff" opacity="0.85">construit le paquet</text>
<line x1="108" y1="66" x2="140" y2="66" stroke="currentColor" stroke-width="1.8" marker-end="url(#gsa)"/>
<rect x="142" y="44" width="92" height="46" rx="5" fill="none" stroke="currentColor" stroke-width="1.4"/>
<text x="152" y="64" font-size="10.5" fill="currentColor">paquet en RAM</text>
<text x="160" y="80" font-size="9" fill="currentColor" opacity="0.8">GIFtag + données</text>
<line x1="234" y1="66" x2="266" y2="66" stroke="currentColor" stroke-width="1.8" marker-end="url(#gsa)"/>
<text x="228" y="36" font-size="9.5" fill="currentColor" opacity="0.8">DMA</text>
<rect x="268" y="44" width="80" height="46" rx="5" fill="#f2994a" fill-opacity="0.12" stroke="#f2994a" stroke-width="1.5"/>
<text x="292" y="64" font-size="11" fill="#f2994a">GIF</text>
<text x="274" y="80" font-size="9" fill="#f2994a" opacity="0.9">traduit en écritures</text>
<line x1="308" y1="90" x2="308" y2="112" stroke="currentColor" stroke-width="1.8" marker-end="url(#gsa)"/>
<rect x="150" y="112" width="290" height="74" rx="6" fill="#27ae60" fill-opacity="0.07" stroke="#27ae60" stroke-width="1.6"/>
<text x="160" y="130" font-size="11" fill="#27ae60">GS — machine à états, aucun programme</text>
<rect x="160" y="138" width="56" height="20" rx="3" fill="none" stroke="#27ae60" stroke-width="1.1"/>
<text x="170" y="152" font-size="9" fill="#27ae60">PRIM</text>
<rect x="222" y="138" width="60" height="20" rx="3" fill="none" stroke="#27ae60" stroke-width="1.1"/>
<text x="230" y="152" font-size="9" fill="#27ae60">RGBAQ</text>
<rect x="288" y="138" width="56" height="20" rx="3" fill="#e05252" fill-opacity="0.18" stroke="#e05252" stroke-width="1.3"/>
<text x="298" y="152" font-size="9" fill="#e05252">XYZ2</text>
<rect x="350" y="138" width="80" height="20" rx="3" fill="none" stroke="#27ae60" stroke-width="1.1"/>
<text x="354" y="152" font-size="8.5" fill="#27ae60">FRAME/ZBUF…</text>
<text x="288" y="176" font-size="9" fill="#e05252">écrire XYZ2 déclenche le dessin : draw kick</text>
<line x1="295" y1="186" x2="295" y2="204" stroke="currentColor" stroke-width="1.8" marker-end="url(#gsa)"/>
<rect x="150" y="204" width="290" height="56" rx="6" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="160" y="222" font-size="11" fill="currentColor">VRAM — 4 Mo (la ressource la plus contrainte)</text>
<rect x="160" y="230" width="66" height="22" rx="3" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff" stroke-width="1"/>
<text x="172" y="245" font-size="9" fill="#4c9aff">framebuffer</text>
<rect x="232" y="230" width="60" height="22" rx="3" fill="#f2994a" fill-opacity="0.15" stroke="#f2994a" stroke-width="1"/>
<text x="246" y="245" font-size="9" fill="#f2994a">Z-buffer</text>
<rect x="298" y="230" width="66" height="22" rx="3" fill="#27ae60" fill-opacity="0.15" stroke="#27ae60" stroke-width="1"/>
<text x="312" y="245" font-size="9" fill="#27ae60">textures</text>
<rect x="370" y="230" width="60" height="22" rx="3" fill="none" stroke="currentColor" stroke-width="1"/>
<text x="386" y="245" font-size="9" fill="currentColor">CLUT</text>
<text x="16" y="28" font-size="12" fill="currentColor">on ne « programme » pas le GS : on lui écrit des registres via des paquets</text>
<text x="16" y="112" font-size="9.5" fill="currentColor" opacity="0.75">espace de</text>
<text x="16" y="126" font-size="9.5" fill="currentColor" opacity="0.75">coordonnées</text>
<text x="16" y="140" font-size="9.5" fill="currentColor" opacity="0.75">non signé</text>
<text x="16" y="154" font-size="9.5" fill="currentColor" opacity="0.75">12 bits</text>
<text x="16" y="168" font-size="9.5" fill="currentColor" opacity="0.75">(0–4095)</text>
</svg>

## Exemples

### Écrire un registre GS depuis un paquet GIF

```c
PACK_GIFTAG(q, GIF_SET_PRIM(6, 0, 0, 0, 0, 0, 0, 0, 0), GIF_REG_PRIM);
q++;
PACK_GIFTAG(q, GIF_SET_RGBAQ(255, 0, 0, 0x80, 0x3F800000), GIF_REG_RGBAQ);
q++;
```

### Registre GS memory-mappé accessible directement depuis l'EE

```c
#define DEBUG_BGCOLOR(col) *((u64 *) 0x120000e0) = (u64) (col)
```

## Cas d'usage

- **Rendu 2D/3D** : toute la sortie visuelle passe par lui.
- **Blits VRAM** : transferts texture via `BITBLTBUF`/`TRXPOS`/`TRXDIR`.
- **Debug visuel** : changer la couleur de fond pour localiser un plantage.

## Avantages et inconvénients

✅ **Avantages** :
- Fill rate élevé pour l'époque, très efficace en 2D et sprites.
- Modèle simple à comprendre : des registres et des primitives.

❌ **Inconvénients** / Limites :
- Aucun shader : tout effet doit être obtenu par passes multiples et blending.
- 4 Mo de VRAM seulement, textures comprises.

## Connexions

### Notes liées
- [[PS2 - paquet GIF et GIFtag]] - Le seul langage compris par le GS
- [[PS2 - registre PRIM]] - Le registre qui décrit la primitive
- [[PS2 - framebuffer et Z-buffer]] - Les deux buffers principaux en VRAM
- [[PS2 - contextes de dessin du GS]] - Les registres dupliqués en deux exemplaires
- [[PS2 - architecture multiprocesseur]] - Sa place dans le système

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitres 1 et 3)

---
**Tags thématiques** : #ps2 #gs #graphisme #vram #rasterizer
