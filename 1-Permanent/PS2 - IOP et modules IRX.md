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

<svg viewBox="0 0 450 280" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IOP : chargement des modules IRX depuis la ROM ou embarqués dans l'ELF">
<defs><marker id="ioa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>
<marker id="iob" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker></defs>
<rect x="16" y="44" width="150" height="76" rx="6" fill="#4c9aff" fill-opacity="0.07" stroke="#4c9aff" stroke-width="1.6"/>
<text x="26" y="62" font-size="11" fill="#4c9aff">EE — votre programme</text>
<rect x="26" y="72" width="130" height="18" rx="3" fill="none" stroke="#4c9aff" stroke-width="1"/>
<text x="32" y="85" font-size="8.5" fill="#4c9aff">SifLoadModule("rom0:PADMAN")</text>
<rect x="26" y="94" width="130" height="18" rx="3" fill="none" stroke="#4c9aff" stroke-width="1"/>
<text x="32" y="107" font-size="8.5" fill="#4c9aff">SifExecModuleBuffer(...)</text>
<line x1="166" y1="82" x2="222" y2="82" stroke="currentColor" stroke-width="2" marker-end="url(#ioa)"/>
<text x="172" y="74" font-size="9" fill="currentColor">SIF RPC</text>
<rect x="224" y="44" width="212" height="112" rx="6" fill="#f2994a" fill-opacity="0.07" stroke="#f2994a" stroke-width="1.6"/>
<text x="234" y="62" font-size="11" fill="#f2994a">IOP — MIPS I · 2 Mo</text>
<rect x="234" y="72" width="192" height="22" rx="4" fill="none" stroke="#f2994a" stroke-width="1.2"/>
<text x="240" y="87" font-size="9" fill="#f2994a">LOADCORE — relie les modules au runtime</text>
<rect x="234" y="100" width="92" height="22" rx="4" fill="none" stroke="currentColor" stroke-width="1"/>
<text x="240" y="115" font-size="8.5" fill="currentColor">SIO2MAN · PADMAN</text>
<rect x="332" y="100" width="94" height="22" rx="4" fill="none" stroke="currentColor" stroke-width="1"/>
<text x="338" y="115" font-size="8.5" fill="currentColor">MCMAN · MCSERV</text>
<rect x="234" y="128" width="192" height="20" rx="4" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2"/>
<text x="240" y="142" font-size="8.5" fill="currentColor" opacity="0.85">iomanX · fileXio — absents de la ROM</text>
<rect x="30" y="180" width="180" height="46" rx="5" fill="none" stroke="currentColor" stroke-width="1.3"/>
<text x="40" y="198" font-size="10" fill="currentColor">rom0: — ROM console</text>
<text x="40" y="214" font-size="9" fill="currentColor" opacity="0.8">212 modules IRX fournis par le SDK</text>
<line x1="210" y1="196" x2="256" y2="160" stroke="currentColor" stroke-width="1.5" marker-end="url(#ioa)"/>
<rect x="250" y="180" width="186" height="46" rx="5" fill="none" stroke="#f2994a" stroke-width="1.3" stroke-dasharray="4 3"/>
<text x="260" y="198" font-size="10" fill="#f2994a">embarqué dans l'ELF (bin2c)</text>
<text x="260" y="214" font-size="9" fill="#f2994a" opacity="0.9">pour tout module hors ROM</text>
<line x1="330" y1="180" x2="330" y2="160" stroke="#f2994a" stroke-width="1.5" marker-end="url(#iob)"/>
<text x="16" y="28" font-size="12" fill="currentColor">aucun pilote n'est disponible d'office : tout se charge explicitement au runtime</text>
<text x="16" y="252" font-size="10.5" fill="currentColor" opacity="0.85">d'où l'étape loadModules() au début de presque tout programme PS2</text>
<text x="16" y="270" font-size="10.5" fill="#e05252" opacity="0.9">l'ordre compte : PADMAN sans SIO2MAN échoue — la couche haute s'appuie sur la basse</text>
</svg>

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
