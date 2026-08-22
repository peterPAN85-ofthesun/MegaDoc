---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - dma
  - graphisme
---

# PS2 - DMAtag et mode chaîné

> [!abstract] Concept
> Le DMAtag est un mini-langage de chaînage mémoire lu par le contrôleur DMA lui-même — il répond à « quel bloc envoyer, et où continuer ensuite ? » — à ne pas confondre avec le GIFtag, lu par le GIF une fois les données arrivées.

## Explication

Il y a deux langages de tags à deux étages différents du pipeline, et ils ne sont pas lus par le même matériel. Le **DMAtag** (`ee/include/dma_tags.h`) est interprété par le contrôleur DMA qui parcourt la RAM ; le **GIFtag** (`common/include/gif_tags.h`) est interprété par le GIF quand les données lui parviennent. Le DMA ne comprend rien au contenu GIF, et le GIF ignore par quel chemin il a été acheminé : deux couches indépendantes, empilées.

Le DMAtag n'existe que dans le **mode chaîné** (`dma_channel_send_chain`). Le mode normal (`dma_channel_send_normal`) envoie un bloc fixe de quadwords sans aucun tag — c'est ce qu'utilisent les samples simples, où `dma_tags.h` est inclus sans jamais vraiment servir. Le chaînage devient utile pour enchaîner plusieurs paquets sans repasser par l'EE entre chaque bloc, ce que gsKit fait en interne pour le double-buffering VU1.

Ses opcodes se lisent comme des instructions d'assembleur : `CNT` continue séquentiellement, `NEXT` saute à une adresse (`jmp`), `REF` lit un bloc situé ailleurs, `CALL` empile une adresse de retour et `RET` la dépile. On peut donc écrire un véritable petit programme de transfert que le DMA exécute seul.

## Exemples

### Format brut du tag

```c
#define DMATAG(QWC,PCE,ID,IRQ,ADDR,SPR) \
    (u64)((QWC)  & 0x0000FFFF) <<  0 | (u64)((PCE) & 0x00000003) << 26 | \
    (u64)((ID)   & 0x00000007) << 28 | (u64)((IRQ) & 0x00000001) << 31 | \
    (u64)((ADDR) & 0x7FFFFFFF) << 32 | (u64)((SPR) & 0x00000001) << 63
```

| Champ | Bits | Rôle |
|---|---|---|
| `QWC` | 0-15 | Nombre de quadwords du bloc qui suit |
| `PCE` | 26-27 | Contrôle de priorité (rare) |
| `ID` | 28-30 | L'opcode — quel `DMA_TAG_*` |
| `IRQ` | 31 | Déclenche une interruption après ce tag |
| `ADDR` | 32-62 | Adresse (suivant à lire ou cible d'un saut) |
| `SPR` | 63 | 1 = l'adresse vise la Scratchpad RAM |

### Les opcodes

| Constante | Valeur | Effet |
|---|---|---|
| `DMA_TAG_REFE` | 0x00 | Comme `REF`, mais dernier bloc de la chaîne |
| `DMA_TAG_CNT` | 0x01 | Bloc de `QWC` qwords, puis continue juste après |
| `DMA_TAG_NEXT` | 0x02 | Bloc de `QWC` qwords, puis saute à `ADDR` (`jmp`) |
| `DMA_TAG_REF`/`REFS` | 0x03/0x04 | Le bloc est ailleurs, à `ADDR` (`REFS` ajoute un contrôle de stall) |
| `DMA_TAG_CALL` | 0x05 | Empile l'adresse de retour puis saute à `ADDR` (`call`) |
| `DMA_TAG_RET` | 0x06 | Dépile et reprend (`ret`) ; pile vide → fin |
| `DMA_TAG_END` | 0x07 | Bloc de `QWC` qwords, puis fin de transfert |

### Le pipeline à deux étages

```
   EE (RAM)                    Contrôleur DMA                    GIF                    GS
┌────────────┐   lit le      ┌────────────────┐   transfère   ┌──────────┐   dessine  ┌────┐
│ données +   │──DMAtag──────►│ décide QUOI     │──les qwords──►│ lit le   │───────────►│    │
│ DMAtags +   │   (optionnel) │ lire et OÙ      │   au GIF       │ GIFtag   │            │    │
│ GIFtags     │               │ aller ensuite   │                │ qui suit │            │    │
└────────────┘               └────────────────┘                └──────────┘            └────┘
```

Le DMA ne comprend rien au contenu GIF, et le GIF ne sait pas comment il a été acheminé : deux couches indépendantes, empilées.

## Cas d'usage

- **Double-buffering VU1** : enchaîner deux buffers sans intervention de l'EE.
- **Listes d'affichage** : construire une chaîne réutilisable de blocs.
- **Interruption en cours de chaîne** : poser `IRQ` sur un tag précis.

## Avantages et inconvénients

✅ **Avantages** :
- Le DMA travaille seul sur une séquence entière : l'EE est libéré.
- Permet de réutiliser des blocs sans les recopier (`REF`).

❌ **Inconvénients** / Limites :
- Bien plus complexe à déboguer qu'un `send_normal`.
- Une adresse erronée fait partir le DMA dans une zone mémoire arbitraire.

## Connexions

### Notes liées
- [[PS2 - paquet GIF et GIFtag]] - L'autre langage de tags, à l'étage supérieur
- [[PS2 - canaux DMA de l'EE]] - Les canaux sur lesquels le mode chaîné s'applique
- [[PS2 - synchronisation CPU et DMA]] - Attendre la fin d'une chaîne
- [[PS2SDK : [packet_t] - buffer DMA de construction des paquets]] - Le buffer qui les contient

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 3e) — `ee/include/dma_tags.h`

---
**Tags thématiques** : #ps2 #dma #dmatag #chainage
