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

<svg viewBox="0 0 450 285" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Deux étages de tags : DMAtag lu par le DMA, GIFtag lu par le GIF">
<defs><marker id="dta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="dtb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker></defs>
<text x="16" y="26" font-size="12" fill="currentColor">deux langages de tags, deux matériels, deux étages indépendants</text>
<rect x="16" y="40" width="418" height="104" rx="7" fill="#4c9aff" fill-opacity="0.05" stroke="#4c9aff" stroke-width="1.4" stroke-dasharray="5 4"/>
<text x="26" y="58" font-size="10.5" fill="#4c9aff">ÉTAGE 1 — DMAtag, lu par le contrôleur DMA qui parcourt la RAM (mode chaîné)</text>
<rect x="30" y="66" width="76" height="30" rx="4" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff" stroke-width="1.2"/>
<text x="46" y="85" font-size="9" fill="#4c9aff">CNT bloc A</text>
<rect x="118" y="66" width="76" height="30" rx="4" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff" stroke-width="1.2"/>
<text x="130" y="85" font-size="9" fill="#4c9aff">NEXT → D</text>
<rect x="206" y="66" width="76" height="30" rx="4" fill="none" stroke="#4c9aff" stroke-width="1" stroke-dasharray="3 2" opacity="0.6"/>
<text x="222" y="85" font-size="9" fill="#4c9aff" opacity="0.6">bloc C</text>
<rect x="294" y="66" width="76" height="30" rx="4" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff" stroke-width="1.2"/>
<text x="312" y="85" font-size="9" fill="#4c9aff">REF / CALL</text>
<line x1="106" y1="81" x2="116" y2="81" stroke="#4c9aff" stroke-width="1.4" marker-end="url(#dta)"/>
<path d="M 156 96 C 180 124 268 124 320 100" fill="none" stroke="#4c9aff" stroke-width="1.4" marker-end="url(#dta)"/>
<text x="196" y="122" font-size="9" fill="#4c9aff">saut (jmp) — le DMA exécute son propre petit programme</text>
<text x="26" y="136" font-size="9" fill="#4c9aff" opacity="0.8">opcodes : CNT (continue) · NEXT (jmp) · REF (bloc ailleurs) · CALL / RET (pile)</text>
<line x1="225" y1="144" x2="225" y2="164" stroke="currentColor" stroke-width="1.8" marker-end="url(#dtb)"/>
<text x="234" y="159" font-size="9.5" fill="currentColor" opacity="0.8">les données arrivent au GIF</text>
<rect x="16" y="166" width="418" height="76" rx="7" fill="#f2994a" fill-opacity="0.05" stroke="#f2994a" stroke-width="1.4" stroke-dasharray="5 4"/>
<text x="26" y="184" font-size="10.5" fill="#f2994a">ÉTAGE 2 — GIFtag, lu par le GIF une fois les données arrivées</text>
<rect x="30" y="194" width="100" height="32" rx="4" fill="#f2994a" fill-opacity="0.18" stroke="#f2994a" stroke-width="1.3"/>
<text x="52" y="214" font-size="9" fill="#f2994a">GIFtag</text>
<rect x="138" y="194" width="70" height="32" rx="4" fill="none" stroke="#f2994a" stroke-width="1.1"/>
<text x="156" y="214" font-size="9" fill="#f2994a">données</text>
<rect x="216" y="194" width="70" height="32" rx="4" fill="none" stroke="#f2994a" stroke-width="1.1"/>
<text x="234" y="214" font-size="9" fill="#f2994a">données</text>
<text x="300" y="214" font-size="9.5" fill="#f2994a" opacity="0.9">→ écritures de registres GS</text>
<text x="16" y="262" font-size="10.5" fill="currentColor" opacity="0.85">le DMA ne comprend rien au contenu GIF ; le GIF ignore par quel chemin il est arrivé</text>
<text x="16" y="278" font-size="10" fill="currentColor" opacity="0.75">mode normal (send_normal) : bloc fixe de quadwords, aucun DMAtag</text>
</svg>

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
