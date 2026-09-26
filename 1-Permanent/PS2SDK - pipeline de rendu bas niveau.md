---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - graphisme
  - rendu
---

# PS2SDK - pipeline de rendu bas niveau

> [!abstract] Concept
> Afficher une primitive avec `libgraph` + `libdraw` suit six étapes invariables : init du canal DMA, allocation VRAM, `graph_initialize`, construction du paquet GIF, envoi par DMA, puis double synchronisation `draw_wait_finish()` / `graph_wait_vsync()`.

## Explication

Ce chemin est délibérément bas niveau : on construit les GIFtags à la main, sans couche intermédiaire. L'EE remplit un `packet_t` en RAM, le contrôleur DMA le transfère vers le GIF, le GIF traduit son contenu en écritures de registres du GS. Le point essentiel est que `dma_channel_send_normal` **ne bloque pas** : le transfert se déroule en tâche de fond pendant que l'EE continue.

Cela impose deux points de synchronisation explicites, que le programmeur place lui-même et qui n'ont rien à voir l'un avec l'autre. `draw_wait_finish()` attend que le GS ait traité la primitive **FINISH** ajoutée en fin de paquet par `draw_finish(q)` — sans ce `draw_finish(q)` avant l'envoi, il n'y a aucun évènement à attendre et l'attente n'a plus de sens. `graph_wait_vsync()` attend le prochain VBlank (~60 Hz NTSC, 50 Hz PAL) pour cadencer l'affichage et éviter le tearing, indépendamment de l'état du GS.

Pour un vrai projet, **gsKit** (`gsKit.h`, `gsVU1.h`) fait exactement ce travail de construction de paquets à la place du développeur et fournit des fonctions de dessin haut niveau (sprites, primitives, textures). Le chemin bas niveau reste indispensable pour comprendre ce qui se passe réellement — et pour tout ce que gsKit ne couvre pas.

<svg viewBox="0 0 450 275" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Les six étapes du pipeline de rendu bas niveau du PS2SDK">
<defs><marker id="pla" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text x="16" y="26" font-size="12" fill="currentColor">six étapes invariables — libgraph + libdraw, sans couche intermédiaire</text>
<rect x="16" y="38" width="128" height="40" rx="5" fill="#4c9aff" fill-opacity="0.1" stroke="#4c9aff" stroke-width="1.3"/>
<text x="24" y="54" font-size="9.5" fill="#4c9aff">1 · init canal DMA</text>
<text x="24" y="70" font-size="8.5" fill="#4c9aff" opacity="0.85">dma_channel_initialize</text>
<line x1="144" y1="58" x2="162" y2="58" stroke="currentColor" stroke-width="1.5" marker-end="url(#pla)"/>
<rect x="164" y="38" width="128" height="40" rx="5" fill="#4c9aff" fill-opacity="0.1" stroke="#4c9aff" stroke-width="1.3"/>
<text x="172" y="54" font-size="9.5" fill="#4c9aff">2 · allocation VRAM</text>
<text x="172" y="70" font-size="8.5" fill="#4c9aff" opacity="0.85">framebuffer + Z-buffer</text>
<line x1="292" y1="58" x2="310" y2="58" stroke="currentColor" stroke-width="1.5" marker-end="url(#pla)"/>
<rect x="312" y="38" width="122" height="40" rx="5" fill="#4c9aff" fill-opacity="0.1" stroke="#4c9aff" stroke-width="1.3"/>
<text x="320" y="54" font-size="9.5" fill="#4c9aff">3 · graph_initialize</text>
<text x="320" y="70" font-size="8.5" fill="#4c9aff" opacity="0.85">mode vidéo</text>
<line x1="373" y1="78" x2="373" y2="96" stroke="currentColor" stroke-width="1.5" marker-end="url(#pla)"/>
<rect x="312" y="96" width="122" height="40" rx="5" fill="#27ae60" fill-opacity="0.1" stroke="#27ae60" stroke-width="1.3"/>
<text x="320" y="112" font-size="9.5" fill="#27ae60">4 · paquet GIF</text>
<text x="320" y="128" font-size="8.5" fill="#27ae60" opacity="0.85">GIFtags à la main</text>
<line x1="312" y1="116" x2="294" y2="116" stroke="currentColor" stroke-width="1.5" marker-end="url(#pla)"/>
<rect x="164" y="96" width="128" height="40" rx="5" fill="#27ae60" fill-opacity="0.1" stroke="#27ae60" stroke-width="1.3"/>
<text x="172" y="112" font-size="9.5" fill="#27ae60">5 · envoi DMA</text>
<text x="172" y="128" font-size="8.5" fill="#27ae60" opacity="0.85">send_normal — NE BLOQUE PAS</text>
<line x1="164" y1="116" x2="146" y2="116" stroke="currentColor" stroke-width="1.5" marker-end="url(#pla)"/>
<rect x="16" y="96" width="128" height="40" rx="5" fill="#f2994a" fill-opacity="0.1" stroke="#f2994a" stroke-width="1.3"/>
<text x="24" y="112" font-size="9.5" fill="#f2994a">6 · double sync</text>
<text x="24" y="128" font-size="8.5" fill="#f2994a" opacity="0.85">finish + vsync</text>
<rect x="16" y="152" width="418" height="56" rx="5" fill="#f2994a" fill-opacity="0.06" stroke="#f2994a" stroke-width="1.2"/>
<text x="26" y="170" font-size="10" fill="#f2994a">les deux synchronisations n'ont rien à voir l'une avec l'autre</text>
<text x="26" y="186" font-size="9" fill="#f2994a" opacity="0.95">draw_wait_finish() → attend la primitive FINISH ajoutée par draw_finish(q) avant l'envoi</text>
<text x="26" y="200" font-size="9" fill="#f2994a" opacity="0.95">graph_wait_vsync() → attend le VBlank (~60 Hz NTSC / 50 Hz PAL), évite le tearing</text>
<rect x="16" y="220" width="418" height="44" rx="5" fill="none" stroke="currentColor" stroke-width="1.1" stroke-dasharray="4 3"/>
<text x="26" y="238" font-size="9.5" fill="currentColor">EE remplit le packet_t → DMA transfère → GIF traduit → registres GS</text>
<text x="26" y="254" font-size="9" fill="currentColor" opacity="0.8">gsKit fait ce travail à votre place ; ce chemin reste indispensable pour comprendre</text>
</svg>

## Exemples

### Synoptique des échanges entre processeurs

Chemin bas niveau de `graph.c` — pas de VU1 ici, l'EE construit et envoie le paquet directement :

```
        EE                                DMA (canal GIF)                       GS
  ┌──────────────┐                    ┌────────────────────┐              ┌──────────────┐
  │ construit le  │  dma_channel_      │  copie RAM → GS     │   paquet     │  exécute le   │
  │ paquet GIF    │─ send_normal() ──► │  en tâche de fond    │─ GIF ──────► │  dessin des   │
  │ en RAM        │  (non bloquant,    │  (l'EE continue      │              │  primitives   │
  │ (packet_t)    │   l'EE est libre)  │   son thread)        │              │  (triangles)  │
  └──────┬────────┘                    └──────────┬──────────┘              └──────┬───────┘
         │                                          │                                │
         │  draw_wait_finish() ◄── interruption fin de transfert DMA ────────────────┘
         │  (attend que le DMA ait fini d'envoyer)
         │
         │  graph_wait_vsync() ◄── interruption VBLANK (retour vertical écran, 50/60 Hz)
         │  (attend le rafraîchissement pour éviter le tearing)
         ▼
   boucle suivante (frame suivante)
```


### Les six étapes

```c
dma_channel_initialize(DMA_CHANNEL_GIF, NULL, 0);                       // 1
frame.address = graph_vram_allocate(w, h, GS_PSM_32, GRAPH_ALIGN_PAGE); // 2
graph_initialize(frame.address, w, h, frame.psm, 0, 0);                 // 3
/* 4. construction du paquet : PACK_GIFTAG + GIF_SET_* */
dma_channel_send_normal(DMA_CHANNEL_GIF, packet->data, q - packet->data, 0, 0); // 5
draw_wait_finish();                                                     // 6
graph_wait_vsync();
```

### Le cycle de rendu d'une frame

```c
void render(packet_t *packet, framebuffer_t *frame)
{
    qword_t *q;

    dma_wait_fast();                    // le DMA a-t-il fini de lire le paquet précédent ?

    q = packet->data;
    q = draw_clear(q, 0, 0, 0, frame->width, frame->height, 0, 0, 0);
    q = draw_finish(q);                 // ajoute la primitive FINISH

    dma_channel_send_normal(DMA_CHANNEL_GIF, packet->data, q - packet->data, 0, 0);
    draw_wait_finish();                 // le GS a-t-il traité FINISH ?
    graph_wait_vsync();                 // cadencer sur le balayage écran
}
```

### Les bibliothèques à lier

```makefile
EE_LIBS = -lpacket -ldma -lgraph -ldraw -lc
```

## Cas d'usage

- **Comprendre le rendu PS2** avant de passer à gsKit.
- **Écrire un moteur 2D minimal** sans dépendance externe.
- **Déboguer un écran noir** : vérifier étape par étape lequel des six maillons manque.

## Avantages et inconvénients

✅ **Avantages** :
- Contrôle total sur chaque registre du GS.
- Aucune surcouche : le coût est exactement celui du paquet envoyé.

❌ **Inconvénients** / Limites :
- Verbeux : chaque primitive demande plusieurs qwords écrits à la main.
- Oublier `draw_finish(q)` rend `draw_wait_finish()` inopérant.

## Connexions

### Notes liées
- [[PS2 - paquet GIF et GIFtag]] - Ce qu'on construit à l'étape 4
- [[PS2 - synchronisation CPU et DMA]] - Les deux attentes de l'étape 6
- [[PS2SDK : [packet_t] - buffer DMA de construction des paquets]] - Le buffer utilisé
- [[PS2 - allocation VRAM et alignement]] - L'étape 2 en détail
- [[PS2 - GS Graphics Synthesizer]] - La cible finale du pipeline

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 3b, `samples/graph/graph.c`)

---
**Tags thématiques** : #ps2sdk #graphisme #rendu #dma #gs
