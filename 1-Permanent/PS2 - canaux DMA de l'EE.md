---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - dma
  - hardware
---

# PS2 - canaux DMA de l'EE

> [!abstract] Concept
> Le contrôleur DMA de l'EE expose 10 canaux numérotés, chacun câblé à une destination précise — VU0/VU1 via VIF, le GIF, l'IPU, le bus SIF vers l'IOP et la scratchpad RAM — et le choix du canal détermine à lui seul le chemin des données.

## Explication

Un canal DMA n'est pas générique : il relie une source et une destination fixées par le matériel. Écrire `DMA_CHANNEL_GIF` signifie littéralement « RAM vers le GIF », il n'y a pas de paramètre de destination à fournir. Les constantes sont définies dans `ee/include/dma.h`.

Trois familles se dégagent. Les canaux **graphiques** VIF0, VIF1 et GIF portent le chemin de rendu typique : RAM → VIF1 → VU1 (transformation de la géométrie) → GIF → GS. Les canaux **SIF** (`fromSIF0`, `toSIF1`, plus un `SIF2` bidirectionnel peu utilisé) forment le pont vers l'IOP, utilisés implicitement par `sceSifInitRpc`, `SifLoadModule` et tous les appels RPC. Les canaux **scratchpad** (`fromSPR`, `toSPR`) déchargent du travail vers les 16 Ko de mémoire rapide de l'EE sans passer par le bus principal.

Restent `fromIPU`/`toIPU`, réservés au décodage MPEG/vidéo par l'IPU, qui ne servent que dans les projets de lecture vidéo.

## Exemples

### Les 10 canaux

| Constante | Valeur | Rôle |
|---|---|---|
| `DMA_CHANNEL_VIF0` | 0x00 | RAM → VU0 (via VIF0) |
| `DMA_CHANNEL_VIF1` | 0x01 | RAM → VU1 (via VIF1) — géométrie et microcode |
| `DMA_CHANNEL_GIF` | 0x02 | RAM (ou VU1) → GS via le GIF |
| `DMA_CHANNEL_fromIPU` | 0x03 | IPU → RAM |
| `DMA_CHANNEL_toIPU` | 0x04 | RAM → IPU |
| `DMA_CHANNEL_fromSIF0` | 0x05 | IOP → EE (réception RPC) |
| `DMA_CHANNEL_toSIF1` | 0x06 | EE → IOP (envoi RPC) |
| `DMA_CHANNEL_SIF2` | 0x07 | canal SIF bidirectionnel, peu utilisé |
| `DMA_CHANNEL_fromSPR` | 0x08 | Scratchpad → RAM |
| `DMA_CHANNEL_toSPR` | 0x09 | RAM → Scratchpad |

### L'API DMA tient en 13 fonctions

```
dma_channel_initialize   dma_channel_shutdown   dma_reset
dma_channel_send_normal  dma_channel_send_normal_ucab
dma_channel_send_chain   dma_channel_send_chain_ucab
dma_channel_receive_normal  dma_channel_receive_chain
dma_channel_send_packet2 dma_channel_wait
dma_channel_fast_waits   dma_wait_fast
```

Trois axes : le sens (`send`/`receive`), le mode (`normal`/`chain`) et l'attente (`wait`/`fast_waits`). Le suffixe `_ucab` désigne les variantes *UnCached Accelerated*, qui contournent le cache pour écrire directement en mémoire.

### Ouvrir puis fermer le canal GIF

```c
dma_channel_initialize(DMA_CHANNEL_GIF, NULL, 0);
dma_channel_fast_waits(DMA_CHANNEL_GIF);
/* ... */
dma_channel_shutdown(DMA_CHANNEL_GIF, 0);
```

## Cas d'usage

- **Rendu graphique** : canal GIF pour tous les paquets de dessin.
- **Moteur 3D** : canal VIF1 pour alimenter VU1 en géométrie.
- **Optimisation mémoire** : canaux SPR pour des buffers de travail rapides.

## Avantages et inconvénients

✅ **Avantages** :
- Transferts en parallèle du calcul CPU : recouvrement réel.
- Le câblage fixe rend le chemin des données prévisible.

❌ **Inconvénients** / Limites :
- Chaque canal doit être initialisé et fermé explicitement.
- L'asynchronisme impose une discipline de synchronisation stricte.

## Connexions

### Notes liées
- [[PS2 - DMAtag et mode chaîné]] - Le mode avancé de ces canaux
- [[PS2 - synchronisation CPU et DMA]] - Attendre la fin d'un transfert
- [[PS2 - SIF pont RPC entre EE et IOP]] - Les canaux fromSIF0 / toSIF1
- [[PS2SDK - pipeline de rendu bas niveau]] - L'usage du canal GIF
- [[PS2 - EE Emotion Engine et coprocesseurs vectoriels]] - Le processeur qui les pilote

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 3d) — `ee/include/dma.h`

---
**Tags thématiques** : #ps2 #dma #ee #canaux
