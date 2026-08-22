---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - dma
  - synchronisation
---

# PS2 - synchronisation CPU et DMA

> [!abstract] Concept
> `dma_channel_send_normal` rend la main immédiatement : trois attentes distinctes existent pour éviter les corruptions — `dma_wait_fast()` pour le transport DMA, `draw_wait_finish()` pour le traitement par le GS, `graph_wait_vsync()` pour le balayage écran.

## Explication

Le transfert DMA est asynchrone : le contrôleur copie les quadwords vers le GIF en tâche de fond pendant que l'EE exécute la suite. La conséquence est une **race condition classique producteur/consommateur** : l'EE ne doit pas réécrire un `packet_t` tant que le DMA n'a pas fini de le lire, sinon le GS reçoit un mélange de l'ancienne et de la nouvelle frame.

`dma_wait_fast()` résout ce problème en bloquant l'EE jusqu'à la fin du transfert en cours. Pour qu'il sache quel canal surveiller sans qu'on le repasse à chaque appel, on l'enregistre une seule fois à l'initialisation avec `dma_channel_fast_waits(channel)`. C'est ce qui distingue le « fast mode » d'une attente générique par canal.

Ces attentes ne sont pas redondantes mais **complémentaires**, chacune à un étage différent. `dma_wait_fast()` porte sur la couche transport — les octets sont-ils partis ? `draw_wait_finish()` porte sur la couche rendu — le GS a-t-il traité la primitive FINISH ajoutée en fin de paquet par `draw_finish(q)` ? `graph_wait_vsync()` porte sur l'affichage — le balayage vertical est-il revenu ? Les trois s'utilisent à des endroits différents du cycle de rendu.

## Exemples

### Enregistrement à l'initialisation

```c
dma_channel_initialize(DMA_CHANNEL_GIF, NULL, 0);
dma_channel_fast_waits(DMA_CHANNEL_GIF);   // une seule fois
```

### Le pattern d'une frame

```c
void render(packet_t *packet, framebuffer_t *frame)
{
    qword_t *q;

    dma_wait_fast();                    // le paquet précédent est-il consommé ?

    q = packet->data;
    q = draw_clear(q, 0, 0, 0, frame->width, frame->height, 0, 0, 0);
    q = draw_finish(q);                 // ajoute la primitive FINISH

    dma_channel_send_normal(DMA_CHANNEL_GIF, packet->data, q - packet->data, 0, 0);
    draw_wait_finish();                 // le GS a-t-il fini de dessiner ?
    graph_wait_vsync();                 // cadencer sur l'écran
}
```

### Les trois niveaux d'attente

| Fonction | Couche | Attend quoi |
|---|---|---|
| `dma_wait_fast()` | transport | fin du transfert DMA vers le GIF |
| `draw_wait_finish()` | rendu | traitement par le GS de la primitive FINISH |
| `graph_wait_vsync()` | affichage | prochain VBlank (~60 Hz NTSC, 50 Hz PAL) |

## Cas d'usage

- **Avant de reconstruire un paquet** : `dma_wait_fast()`.
- **Avant de lire le framebuffer** (capture d'écran) : `draw_wait_finish()`.
- **Cadencer l'animation** et éviter le tearing : `graph_wait_vsync()`.

## Avantages et inconvénients

✅ **Avantages** :
- Les points de synchronisation sont explicites : on choisit où payer l'attente.
- Le recouvrement calcul/transfert reste possible entre deux attentes.

❌ **Inconvénients** / Limites :
- Attentes actives (poll) : le CPU est bloqué sans rien faire.
- Oublier `draw_finish(q)` rend `draw_wait_finish()` inopérant, sans erreur visible.

## Connexions

### Notes liées
- [[PS2SDK : [packet_t] - buffer DMA de construction des paquets]] - La ressource à protéger
- [[PS2 - canaux DMA de l'EE]] - Le canal enregistré par `dma_channel_fast_waits`
- [[PS2SDK - pipeline de rendu bas niveau]] - Le cycle complet d'une frame
- [[PS2 - GS Graphics Synthesizer]] - Le consommateur final des données

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitres 3b et 3m) — `ee/include/dma.h`, `ee/include/draw.h`

---
**Tags thématiques** : #ps2 #dma #synchronisation #vsync #graphisme
