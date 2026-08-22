---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - hardware
  - iop
  - irx
---

# PS2 - IOP et modules IRX

> [!abstract] Concept
> L'IOP est le second processeur de la PS2 (MIPS I hérité de la PS1, 2 Mo de RAM) dédié aux entrées-sorties ; ses pilotes sont des modules `.irx` chargés au runtime, jamais disponibles d'office comme sur un OS classique.

## Explication

L'IOP est un processeur modeste mais indispensable : c'est **lui seul** qui parle aux périphériques — manettes, cartes mémoire, CD/DVD, USB, réseau, son. L'EE ne peut atteindre aucun de ces matériels directement ; il émet des requêtes RPC vers l'IOP à travers le bus SIF. Sa faiblesse (MIPS I, 2 Mo) impose une règle absolue : aucun calcul lourd ni rendu de son côté, uniquement de l'I/O.

Le code IOP est packagé en **modules IRX** (`.irx`), chargeables et reliés au runtime par `LOADCORE`. Le PS2SDK fournit 212 modules précompilés dans `ps2sdk/iop/irx`. Un module expose des fonctions à d'autres modules et, pour ceux qui sont des serveurs RPC, à l'EE.

Il existe deux façons de charger un module, selon qu'il est présent ou non dans la ROM de la console. `SifLoadModule("rom0:PADMAN", 0, NULL)` charge un module de la ROM (SIO2MAN, PADMAN, MCMAN, MCSERV…). Pour un module absent de la ROM (iomanX, fileXio), on l'embarque dans l'ELF au build avec `bin2c`, puis on le charge avec `SifExecModuleBuffer`. C'est pourquoi presque tout programme PS2 comporte une étape explicite `loadModules()` avant de pouvoir utiliser le moindre périphérique.

## Exemples

### Charger deux modules de la ROM

```c
sceSifInitRpc(0);
SifLoadModule("rom0:SIO2MAN", 0, NULL);
SifLoadModule("rom0:PADMAN", 0, NULL);
padInit(0);
```

### Charger un module embarqué dans l'ELF

```c
extern unsigned char fileXio_irx[] __attribute__((aligned(16)));
extern unsigned int size_fileXio_irx;

SifExecModuleBuffer(&fileXio_irx, size_fileXio_irx, 0, NULL, NULL);
```

## Cas d'usage

- **Manette** : `SIO2MAN` + `PADMAN` avant tout `padRead`.
- **Carte mémoire** : `SIO2MAN` + `MCMAN` + `MCSERV`.
- **Système de fichiers étendu** : `iomanX.irx` + `fileXio.irx` embarqués.

## Avantages et inconvénients

✅ **Avantages** :
- Modularité : on ne charge que les pilotes réellement utilisés, dans 2 Mo de RAM.
- Réimplémentations libres possibles (`freepad`, `freesio2`).

❌ **Inconvénients** / Limites :
- Rien n'est disponible par défaut : oublier un module donne un échec silencieux ou un retour négatif.
- L'ordre de chargement compte (SIO2MAN avant PADMAN/MCMAN).

## Connexions

### Notes liées
- [[PS2 - hiérarchie des modules IOP]] - Comment ces modules s'empilent
- [[PS2 - SIF pont RPC entre EE et IOP]] - Le canal qui porte les requêtes
- [[PS2SDK - embarquer un module IRX avec bin2c]] - Charger un module hors ROM
- [[PS2 - SIO2MAN bus partagé pad et carte mémoire]] - Cas concret d'empilement
- [[PS2 - architecture multiprocesseur]] - Sa place dans le système

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitres 1, 2 et 6)

---
**Tags thématiques** : #ps2 #iop #irx #modules #rpc
