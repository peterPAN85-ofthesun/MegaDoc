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

<svg viewBox="0 0 450 255" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Champs du registre PRIM du GS">
<text x="16" y="26" font-size="12" fill="currentColor">toute la configuration du rendu d'une primitive dans un seul registre 64 bits</text>
<rect x="16" y="38" width="84" height="36" rx="4" fill="#27ae60" fill-opacity="0.2" stroke="#27ae60" stroke-width="1.5"/>
<text x="26" y="54" font-size="9.5" fill="#27ae60">PRIM 3 bits</text>
<text x="26" y="68" font-size="8" fill="#27ae60">type de primitive</text>
<rect x="104" y="38" width="40" height="36" rx="3" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff" stroke-width="1.1"/>
<text x="114" y="60" font-size="9" fill="#4c9aff">IIP</text>
<rect x="148" y="38" width="40" height="36" rx="3" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff" stroke-width="1.1"/>
<text x="156" y="60" font-size="9" fill="#4c9aff">TME</text>
<rect x="192" y="38" width="40" height="36" rx="3" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff" stroke-width="1.1"/>
<text x="200" y="60" font-size="9" fill="#4c9aff">FGE</text>
<rect x="236" y="38" width="40" height="36" rx="3" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff" stroke-width="1.1"/>
<text x="244" y="60" font-size="9" fill="#4c9aff">ABE</text>
<rect x="280" y="38" width="40" height="36" rx="3" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff" stroke-width="1.1"/>
<text x="288" y="60" font-size="9" fill="#4c9aff">AA1</text>
<rect x="324" y="38" width="40" height="36" rx="3" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff" stroke-width="1.1"/>
<text x="332" y="60" font-size="9" fill="#4c9aff">FST</text>
<rect x="368" y="38" width="34" height="36" rx="3" fill="#f2994a" fill-opacity="0.2" stroke="#f2994a" stroke-width="1.2"/>
<text x="372" y="60" font-size="9" fill="#f2994a">CTXT</text>
<rect x="406" y="38" width="28" height="36" rx="3" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff" stroke-width="1.1"/>
<text x="410" y="60" font-size="9" fill="#4c9aff">FIX</text>
<text x="104" y="88" font-size="8.5" fill="#4c9aff" opacity="0.8">huit interrupteurs d'un bit</text>
<text x="16" y="112" font-size="10.5" fill="#27ae60">les sept primitives</text>
<rect x="16" y="120" width="418" height="44" rx="5" fill="#27ae60" fill-opacity="0.06" stroke="#27ae60" stroke-width="1.2"/>
<text x="26" y="138" font-size="9" fill="#27ae60">0 point · 1 ligne · 2 line strip · 3 triangle · 4 triangle strip · 5 triangle fan · 6 SPRITE</text>
<text x="26" y="154" font-size="9" fill="#27ae60" opacity="0.9">le sprite (6) ne demande que 2 sommets : coin haut-gauche et coin bas-droit — roi de la 2D</text>
<rect x="16" y="176" width="418" height="66" rx="5" fill="none" stroke="currentColor" stroke-width="1.1" stroke-dasharray="4 3"/>
<text x="26" y="194" font-size="9" fill="currentColor">IIP — plat ou Gouraud · TME — texture · FGE — fog · ABE — alpha blending · AA1 — antialiasing</text>
<text x="26" y="210" font-size="9" fill="currentColor">FST — coordonnées STQ (perspective-correct) ou UV (linéaire)</text>
<text x="26" y="226" font-size="9" fill="currentColor">CTXT — contexte de dessin · FIX — décimales de fog</text>
<text x="26" y="240" font-size="8.5" fill="currentColor" opacity="0.75">tous les drapeaux à zéro = couleur unie, sans texture ni transparence</text>
</svg>

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
