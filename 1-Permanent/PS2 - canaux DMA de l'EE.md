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

<svg viewBox="0 0 450 285" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Les 10 canaux DMA de l'EE répartis en quatre familles">
<defs><marker id="dca" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#27ae60"/></marker></defs>
<rect x="16" y="52" width="76" height="180" rx="6" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="34" y="138" font-size="11" fill="currentColor">RAM EE</text>
<text x="26" y="154" font-size="9" fill="currentColor" opacity="0.75">source unique</text>
<rect x="128" y="46" width="306" height="58" rx="6" fill="#27ae60" fill-opacity="0.07" stroke="#27ae60" stroke-width="1.5"/>
<text x="138" y="62" font-size="10" fill="#27ae60">GRAPHIQUE — le chemin de rendu</text>
<rect x="138" y="70" width="56" height="22" rx="3" fill="none" stroke="#27ae60" stroke-width="1.1"/>
<text x="150" y="85" font-size="9" fill="#27ae60">VIF0</text>
<rect x="200" y="70" width="56" height="22" rx="3" fill="#27ae60" fill-opacity="0.15" stroke="#27ae60" stroke-width="1.3"/>
<text x="212" y="85" font-size="9" fill="#27ae60">VIF1</text>
<rect x="262" y="70" width="56" height="22" rx="3" fill="#27ae60" fill-opacity="0.15" stroke="#27ae60" stroke-width="1.3"/>
<text x="278" y="85" font-size="9" fill="#27ae60">GIF</text>
<text x="330" y="85" font-size="9" fill="#27ae60" opacity="0.85">→ VU1 → GS</text>
<rect x="128" y="112" width="306" height="52" rx="6" fill="#f2994a" fill-opacity="0.07" stroke="#f2994a" stroke-width="1.5"/>
<text x="138" y="128" font-size="10" fill="#f2994a">SIF — le pont vers l'IOP</text>
<rect x="138" y="134" width="80" height="22" rx="3" fill="none" stroke="#f2994a" stroke-width="1.1"/>
<text x="144" y="149" font-size="8.5" fill="#f2994a">fromSIF0</text>
<rect x="224" y="134" width="80" height="22" rx="3" fill="none" stroke="#f2994a" stroke-width="1.1"/>
<text x="232" y="149" font-size="8.5" fill="#f2994a">toSIF1</text>
<rect x="310" y="134" width="60" height="22" rx="3" fill="none" stroke="#f2994a" stroke-width="1" stroke-dasharray="3 2"/>
<text x="318" y="149" font-size="8.5" fill="#f2994a" opacity="0.8">SIF2</text>
<text x="376" y="149" font-size="8.5" fill="#f2994a" opacity="0.75">RPC</text>
<rect x="128" y="172" width="150" height="52" rx="6" fill="#4c9aff" fill-opacity="0.07" stroke="#4c9aff" stroke-width="1.5"/>
<text x="138" y="188" font-size="10" fill="#4c9aff">SCRATCHPAD (16 Ko)</text>
<rect x="138" y="194" width="62" height="22" rx="3" fill="none" stroke="#4c9aff" stroke-width="1.1"/>
<text x="144" y="209" font-size="8.5" fill="#4c9aff">fromSPR</text>
<rect x="206" y="194" width="62" height="22" rx="3" fill="none" stroke="#4c9aff" stroke-width="1.1"/>
<text x="214" y="209" font-size="8.5" fill="#4c9aff">toSPR</text>
<rect x="288" y="172" width="146" height="52" rx="6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-dasharray="4 3"/>
<text x="298" y="188" font-size="10" fill="currentColor" opacity="0.85">IPU — vidéo MPEG</text>
<text x="298" y="210" font-size="8.5" fill="currentColor" opacity="0.75">fromIPU · toIPU</text>
<line x1="92" y1="82" x2="126" y2="82" stroke="#27ae60" stroke-width="1.8" marker-end="url(#dca)"/>
<line x1="92" y1="138" x2="126" y2="138" stroke="#f2994a" stroke-width="1.4"/>
<line x1="92" y1="198" x2="126" y2="198" stroke="#4c9aff" stroke-width="1.4"/>
<text x="16" y="28" font-size="12" fill="currentColor">un canal n'est pas générique : sa destination est câblée en dur</text>
<text x="16" y="42" font-size="10" fill="currentColor" opacity="0.75">DMA_CHANNEL_GIF signifie littéralement « RAM → GIF » : aucun paramètre de destination</text>
<text x="16" y="256" font-size="10.5" fill="#27ae60">chemin de rendu typique : RAM → VIF1 → VU1 (géométrie) → GIF → GS</text>
<text x="16" y="274" font-size="10" fill="currentColor" opacity="0.75">constantes définies dans ee/include/dma.h</text>
</svg>

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
