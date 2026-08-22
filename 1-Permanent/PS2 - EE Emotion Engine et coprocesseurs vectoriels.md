---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - hardware
  - ee
---

# PS2 - EE Emotion Engine et coprocesseurs vectoriels

> [!abstract] Concept
> L'Emotion Engine est le CPU principal de la PS2 (MIPS III, cœur R5900, 64 bits) ; il exécute le code applicatif et pilote deux coprocesseurs vectoriels VU0 et VU1, une scratchpad RAM de 16 Ko et un contrôleur DMA à 10 canaux.

## Explication

L'EE est le processeur sur lequel tourne l'ELF du homebrew. Son cœur R5900 est un MIPS III 64 bits (utilisé surtout en 32 bits en pratique) accompagné d'une FPU. C'est lui que cible le toolchain `mips64r5900el-ps2-elf-*` et pour lequel sont compilés les en-têtes de `ee/include`. Le programme y tourne **bare metal** : pas d'OS, pas de chargeur dynamique, pas de protection mémoire.

Deux coprocesseurs vectoriels lui sont attachés, programmables en microcode VU (assembleurs `openvcl`, `masp`). **VU0** est généralement utilisé comme un coprocesseur classique de l'EE, pour accélérer des calculs vectoriels dans le flux d'exécution. **VU1** est quasi toujours dédié à la transformation géométrique : il reçoit les données par le canal DMA VIF1, les transforme, et envoie le résultat directement au GIF sans repasser par l'EE.

Deux ressources complètent l'ensemble. La **scratchpad RAM** (16 Ko) est une mémoire ultra-rapide adressable directement, alimentée par les canaux DMA `fromSPR`/`toSPR` — utile pour des buffers de travail sans passer par le bus mémoire principal. Le **contrôleur DMA** à 10 canaux déplace les données entre RAM, VU, GIF, IPU et SIF sans bloquer le CPU.

## Exemples

### Ce que le toolchain EE nomme

```bash
mips64r5900el-ps2-elf-gcc      # compilateur EE (aucun alias "ee-gcc" n'existe)
mips64r5900el-ps2-elf-objdump
mips64r5900el-ps2-elf-gdb
```

### Allouer un packet en scratchpad plutôt qu'en RAM

```c
packet_t *packet = packet_init(50, PACKET_SPR);  // au lieu de PACKET_NORMAL
```

## Cas d'usage

- **Code applicatif** : toute la logique du jeu/homebrew tourne sur l'EE.
- **VU1 pour la géométrie 3D** : décharger les transformations de matrices dans un moteur réel.
- **Scratchpad** : buffers DMA à très faible latence.

## Avantages et inconvénients

✅ **Avantages** :
- Puissance de calcul vectoriel importante pour l'époque.
- Le DMA autorise un vrai recouvrement calcul/transfert.

❌ **Inconvénients** / Limites :
- Programmer les VU exige de l'assembleur VU, hors de portée du C standard.
- Pas de protection mémoire : un dépassement de buffer corrompt silencieusement.

## Connexions

### Notes liées
- [[PS2 - architecture multiprocesseur]] - L'EE dans l'ensemble du système
- [[PS2 - canaux DMA de l'EE]] - Le contrôleur DMA piloté depuis l'EE
- [[PS2SDK - squelette d'un programme EE]] - La forme du code qui y tourne
- [[PS2 - gestionnaire d'exceptions Level 1 et Level 2]] - Les exceptions du R5900

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 1)

---
**Tags thématiques** : #ps2 #ee #mips #hardware
