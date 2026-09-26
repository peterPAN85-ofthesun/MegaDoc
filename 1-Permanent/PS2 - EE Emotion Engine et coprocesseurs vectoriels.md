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

<svg viewBox="0 0 450 265" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Emotion Engine : cœur R5900, VU0, VU1, scratchpad et DMAC">
<defs><marker id="eea" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>
<marker id="eeb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#27ae60"/></marker></defs>
<rect x="16" y="40" width="300" height="180" rx="8" fill="#4c9aff" fill-opacity="0.05" stroke="#4c9aff" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="26" y="58" font-size="11" fill="#4c9aff">EE — bare metal : pas d'OS, pas de protection mémoire</text>
<rect x="30" y="68" width="130" height="52" rx="6" fill="none" stroke="currentColor" stroke-width="1.7"/>
<text x="44" y="88" font-size="11.5" fill="currentColor">Cœur R5900</text>
<text x="40" y="106" font-size="9.5" fill="currentColor" opacity="0.8">MIPS III 64 bits + FPU</text>
<rect x="30" y="132" width="130" height="30" rx="5" fill="none" stroke="currentColor" stroke-width="1.3"/>
<text x="38" y="152" font-size="10" fill="currentColor">VU0 — coproc. de l'EE</text>
<rect x="30" y="172" width="130" height="34" rx="5" fill="#27ae60" fill-opacity="0.1" stroke="#27ae60" stroke-width="1.4"/>
<text x="38" y="186" font-size="10" fill="#27ae60">VU1 — géométrie</text>
<text x="38" y="200" font-size="9" fill="#27ae60" opacity="0.85">microcode VU (openvcl)</text>
<rect x="186" y="68" width="116" height="34" rx="5" fill="none" stroke="currentColor" stroke-width="1.3"/>
<text x="194" y="82" font-size="10" fill="currentColor">Scratchpad RAM</text>
<text x="194" y="96" font-size="9" fill="currentColor" opacity="0.8">16 Ko — fromSPR/toSPR</text>
<rect x="186" y="116" width="116" height="90" rx="5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="3 2"/>
<text x="194" y="134" font-size="10.5" fill="currentColor">DMAC</text>
<text x="194" y="150" font-size="9" fill="currentColor" opacity="0.8">10 canaux</text>
<text x="194" y="168" font-size="9" fill="currentColor" opacity="0.8">RAM ↔ VU ↔ GIF</text>
<text x="194" y="182" font-size="9" fill="currentColor" opacity="0.8">↔ IPU ↔ SIF</text>
<text x="194" y="198" font-size="9" fill="#27ae60">sans bloquer le CPU</text>
<line x1="160" y1="94" x2="184" y2="94" stroke="currentColor" stroke-width="1.3"/>
<line x1="160" y1="147" x2="184" y2="147" stroke="currentColor" stroke-width="1.3"/>
<line x1="160" y1="189" x2="184" y2="170" stroke="#27ae60" stroke-width="1.6"/>
<text x="330" y="176" font-size="10" fill="#27ae60">VIF1</text>
<line x1="302" y1="160" x2="372" y2="160" stroke="#27ae60" stroke-width="2" marker-end="url(#eeb)"/>
<rect x="356" y="120" width="86" height="34" rx="5" fill="#27ae60" fill-opacity="0.12" stroke="#27ae60" stroke-width="1.4"/>
<text x="382" y="141" font-size="11" fill="#27ae60">GIF</text>
<line x1="399" y1="120" x2="399" y2="98" stroke="#27ae60" stroke-width="2" marker-end="url(#eeb)"/>
<rect x="356" y="64" width="86" height="34" rx="5" fill="none" stroke="#27ae60" stroke-width="1.4"/>
<text x="384" y="85" font-size="11" fill="#27ae60">GS</text>
<text x="322" y="196" font-size="9.5" fill="#27ae60">VU1 envoie au GIF</text>
<text x="322" y="209" font-size="9.5" fill="#27ae60">sans repasser par l'EE</text>
<text x="16" y="28" font-size="12" fill="currentColor">le CPU sur lequel tourne l'ELF, et les unités qu'il pilote</text>
<text x="16" y="240" font-size="10.5" fill="currentColor" opacity="0.8">chemin géométrique rapide : RAM → VIF1 → VU1 → GIF → GS, l'EE n'est plus dans la boucle</text>
</svg>

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
