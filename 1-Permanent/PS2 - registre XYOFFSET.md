---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - graphisme
  - gs
---

# PS2 - registre XYOFFSET

> [!abstract] Concept
> L'espace de coordonnées du GS étant non signé (0 à 4095), le registre XYOFFSET décale toutes les coordonnées des sommets avant rasterization ; `draw_setup_environment` le pose par défaut à (2048, 2048), ce qui oblige à ajouter `2048 << 4` à chaque sommet — sauf à le redéfinir avec `draw_primitive_xyoffset`.

## Explication

Le rasterizer du GS ne connaît pas de coordonnées négatives : son espace interne est un espace non signé de 12 bits entiers. Pour pouvoir raisonner en positions relatives à une origine placée « au milieu », le GS offre un registre XYOFFSET par contexte de dessin (`GS_REG_XYOFFSET_1`/`_2` = 0x18/0x19), lui aussi exprimé en 12.4 fixed-point.

`draw_setup_environment(q, 0, frame, z)` configure tout l'environnement du contexte — `FRAME`, `ZBUF`, `SCISSOR`, `TEST` — et pose au passage `XYOFFSET_1` à la valeur par défaut **(2048, 2048)**, soit le centre exact de l'espace 0-4095. Conséquence : chaque sommet envoyé ensuite doit compenser cet offset par un `+ (2048 << 4)`, faute de quoi la primitive part vers le coin de l'espace GS, hors de la zone visible après application du scissor.

Deux approches coexistent donc. Garder l'offset par défaut et compenser manuellement à chaque `GIF_SET_XYZ` — ce que font les samples les plus simples. Ou bien appeler **`draw_primitive_xyoffset`**, qui construit le même GIFtag A+D à notre place et accepte directement des pixels flottants non décalés (le `<< 4` est fait en interne), pour recentrer l'offset une bonne fois selon la taille réelle du framebuffer ; plus aucun ajout par sommet n'est alors nécessaire.

## Exemples

### Le référentiel posé par `draw_setup_environment`

<svg viewBox="0 0 640 380" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:sans-serif;">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--text-accent)"/>
    </marker>
  </defs>
  <rect x="40" y="40" width="256" height="256" fill="none" stroke="var(--text-normal)" stroke-width="1.5"/>
  <text x="90" y="20" font-size="12" fill="var(--text-normal)" font-weight="bold">Espace de coordonnées du GS (12 bits non signés, 0..4095)</text>
  <text x="40" y="32" font-size="11" fill="var(--text-muted)">X=0 →</text>
  <text x="255" y="32" font-size="11" fill="var(--text-muted)">X=4095</text>
  <text x="4" y="50" font-size="11" fill="var(--text-muted)">Y=0</text>
  <text x="0" y="300" font-size="11" fill="var(--text-muted)">↓ Y=4095</text>
  <circle cx="40" cy="40" r="3" fill="var(--text-normal)"/>
  <text x="46" y="55" font-size="10" fill="var(--text-muted)">origine (0,0) de l'espace GS</text>
  <line x1="40" y1="40" x2="168" y2="168" stroke="var(--text-accent)" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrow)"/>
  <text x="45" y="118" font-size="11" fill="var(--text-accent)">XYOFFSET_1 = (2048,2048)</text>
  <text x="45" y="131" font-size="11" fill="var(--text-accent)">= centre de l'espace GS</text>
  <text x="45" y="144" font-size="10" fill="var(--text-muted)">posé par draw_setup_environment()</text>
  <circle cx="168" cy="168" r="4" fill="var(--text-accent)"/>
  <rect x="168" y="168" width="32" height="32" fill="var(--interactive-accent)" fill-opacity="0.15" stroke="var(--interactive-accent)" stroke-width="1.5"/>
  <text x="168" y="215" font-size="9" fill="var(--text-normal)">Framebuffer 512×512</text>
  <text x="168" y="226" font-size="9" fill="var(--text-muted)">(0,0) logique = coin haut-gauche</text>
  <text x="340" y="60" font-size="12" fill="var(--text-normal)" font-weight="bold">Formule</text>
  <text x="340" y="80" font-size="11" fill="var(--text-normal)">X_envoyé (XYZ2) = X_pixel_logique + XYOFFSET_X</text>
  <text x="340" y="96" font-size="11" fill="var(--text-normal)">Y_envoyé (XYZ2) = Y_pixel_logique + XYOFFSET_Y</text>
  <text x="340" y="118" font-size="11" fill="var(--text-muted)">Le GS calcule en interne :</text>
  <text x="340" y="134" font-size="11" fill="var(--text-normal)">X_écran = X_envoyé − XYOFFSET_X</text>
  <text x="340" y="150" font-size="11" fill="var(--text-normal)">Y_écran = Y_envoyé − XYOFFSET_Y</text>
  <text x="340" y="180" font-size="11" fill="var(--text-muted)">Avec XYOFFSET_1 = (2048,2048) :</text>
  <text x="340" y="196" font-size="11" fill="var(--text-normal)">(0,0) logique tombe exactement</text>
  <text x="340" y="212" font-size="11" fill="var(--text-normal)">au centre de l'espace GS 0..4095,</text>
  <text x="340" y="228" font-size="11" fill="var(--text-normal)">soit le coin haut-gauche du framebuffer.</text>
</svg>

Le grand carré est l'espace de coordonnées du GS (12 bits non signés, 0..4095). Le point en pointillé est `XYOFFSET_1`, par défaut `(2048,2048)` — exactement le centre de cet espace. Le petit carré bleu est le framebuffer 512×512, dont le coin `(0,0)` logique coïncide avec cet offset.

### La macro du registre

```c
#define GS_SET_XYOFFSET(X, Y) \
    (u64)((X)&0x0000FFFF) << 0 | (u64)((Y)&0x0000FFFF) << 32
```

### Approche 1 — garder le défaut et compenser à chaque sommet

```c
q = draw_setup_environment(q, 0, frame, z);   // pose XYOFFSET_1 = (2048, 2048)
/* ... */
PACK_GIFTAG(q, GIF_SET_XYZ((x << 4) + (2048 << 4),
                           (y << 4) + (2048 << 4), 0), GIF_REG_XYZ2);
```

### Approche 2 — recentrer une fois selon le framebuffer (`cube.c`, 640×512)

```c
q = draw_setup_environment(q, 0, frame, z);              // défaut (2048, 2048)
q = draw_primitive_xyoffset(q, 0, (2048 - 320), (2048 - 256));  // recentre
// plus besoin d'ajouter 2048 << 4 aux sommets
```

### Le calcul effectué par le GS

```
X_écran = X_envoyé − XYOFFSET_X
Y_écran = Y_envoyé − XYOFFSET_Y
```

Avec `XYOFFSET = (2048, 2048)`, l'origine logique `(0,0)` tombe au centre de l'espace GS, c'est-à-dire au coin haut-gauche du framebuffer.

## Cas d'usage

- **Placer l'origine du rendu** au coin haut-gauche du framebuffer.
- **Simuler des coordonnées négatives** autour d'un centre logique.
- **Scrolling** : déplacer toute la scène en modifiant un seul registre.

## Avantages et inconvénients

✅ **Avantages** :
- Un seul registre décale toute la scène, sans retoucher les sommets.
- Deux contextes permettent deux origines simultanées.

❌ **Inconvénients** / Limites :
- La valeur par défaut de `draw_setup_environment` est implicite et surprend.
- Oublier la compensation fait disparaître le rendu sans message d'erreur.

## Connexions

### Notes liées
- [[PS2 - fixed-point 12.4 des coordonnées]] - Le format dans lequel l'offset est exprimé
- [[PS2 - allocation VRAM et alignement]] - Le mécanisme complémentaire à ne pas confondre
- [[PS2 - contextes de dessin du GS]] - Pourquoi XYOFFSET existe en deux exemplaires
- [[PS2 - mode A+D du GIF]] - Le seul moyen d'écrire ce registre
- [[PS2SDK - pipeline de rendu bas niveau]] - Où `draw_setup_environment` intervient

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitres 3g et 3h) — `common/include/gs_gp.h`, `ee/include/draw_primitives.h`

---
**Tags thématiques** : #ps2 #gs #xyoffset #coordonnees #graphisme
