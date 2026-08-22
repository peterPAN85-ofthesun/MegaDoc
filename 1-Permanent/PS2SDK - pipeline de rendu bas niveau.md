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
