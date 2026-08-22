---
type: moc
created: 2026-08-21 23:43
tags:
  - moc
  - index
  - ps2
  - ps2sdk
  - homebrew
---

# 🗺️ MOC - PS2 Homebrew

> [!note] Vue d'ensemble
> Développement homebrew sur PlayStation 2 avec le PS2SDK et le toolchain ps2dev : architecture matérielle multiprocesseur, chaîne de build EE, pipeline graphique GS/GIF/DMA, périphériques via modules IOP.

## 🧩 Architecture matérielle

La PS2 n'a pas un CPU mais plusieurs processeurs spécialisés, et tout le SDK découle de ce découpage.

- [[PS2 - architecture multiprocesseur]] - Vue d'ensemble : EE, GS, IOP, VU0/VU1, IPU
- [[PS2 - EE Emotion Engine et coprocesseurs vectoriels]] - Le CPU principal (MIPS III R5900)
- [[PS2 - GS Graphics Synthesizer]] - Le rasterizer sans shaders, 4 Mo de VRAM
- [[PS2 - IOP et modules IRX]] - Le processeur d'I/O et ses pilotes chargeables
- [[PS2 - SIF pont RPC entre EE et IOP]] - Le bus qui relie les deux CPU

## 🔨 Chaîne de build

- [[PS2SDK - Makefile d'un projet EE]] - Le squelette de build et le piège de l'ordre `all:` / `include`
- [[PS2SDK - hiérarchie des Makefile du SDK]] - Qui définit quoi entre `pref`, `eeglobal` et `Defs.make`
- [[PS2SDK - emplacement des en-têtes et bibliothèques]] - Les trois répertoires à connaître
- [[PS2SDK - répartition des bibliothèques EE]] - Ce que contient chacune des six archives
- [[PS2SDK - en-têtes header-only sans archive]] - Pourquoi tout `#include` n'a pas son `-l`
- [[PS2SDK - bibliothèques injectées par les specs GCC]] - Ce que le toolchain ajoute d'office
- [[PS2SDK - convention de préfixe i et underscore]] - Les variantes interruption de `libkernel`
- [[PS2SDK - configuration du LSP (bear et clangd)]] - Faire fonctionner l'éditeur
- [[PS2 - SYSTEM.CNF et démarrage d'un ELF]] - Produire une ISO bootable
- [[ELF - Executable and Linkable Format]] - Le format du binaire produit par le SDK

## 🚀 Structure d'un programme

- [[PS2SDK - squelette d'un programme EE]] - `sceSifInitRpc` → modules → init → boucle → `SleepThread`
- [[PS2SDK - embarquer un module IRX avec bin2c]] - Charger un module absent de la ROM

## 🎨 Pipeline graphique

### Vue d'ensemble
- [[PS2SDK - pipeline de rendu bas niveau]] - Les six étapes, de l'init du DMA au vsync
- [[PS2 - synchronisation CPU et DMA]] - `dma_wait_fast`, `draw_wait_finish`, `graph_wait_vsync`

### Paquets et transport
- [[PS2 - paquet GIF et GIFtag]] - Le seul langage compris par le GS
- [[PS2 - mode A+D du GIF]] - Atteindre n'importe quel registre du GS
- [[PS2SDK : [packet_t] - buffer DMA de construction des paquets]] - Le buffer aligné 64 octets
- [[PS2 - canaux DMA de l'EE]] - Les 10 canaux et leurs destinations
- [[PS2 - DMAtag et mode chaîné]] - Le langage de chaînage du contrôleur DMA

### Registres du GS
- [[PS2 - registre PRIM]] - Type de primitive et drapeaux de rendu
- [[PS2 - registre RGBAQ]] - Couleur, alpha et le champ flottant `Q`
- [[PS2 - registre XYOFFSET]] - L'origine des coordonnées
- [[PS2 - contextes de dessin du GS]] - Les registres dupliqués `_1` / `_2`

### Mémoire et formats
- [[PS2 - PSM format de stockage des pixels]] - Deux nomenclatures pour un même concept
- [[PS2 - framebuffer et Z-buffer]] - Les deux buffers principaux
- [[PS2 - allocation VRAM et alignement]] - Page vs bloc
- [[PS2 - fixed-point 12.4 des coordonnées]] - Le `<< 4` obligatoire

## 🐞 Debug

- [[PS2SDK - console de debug libdebug]] - `scr_printf` et `DEBUG_BGCOLOR`
- [[PS2SDK - breakpoints matériels libeedebug]] - Breakpoints COP0 sur adresse et sur valeur
- [[PS2 - gestionnaire d'exceptions Level 1 et Level 2]] - Les deux étages du handler EE

## 🎮 Périphériques

- [[PS2SDK - lecture de la manette avec libpad]] - Modules, alignement, bits inversés
- [[PS2SDK - carte mémoire avec libmc]] - API asynchrone et devices `mc0:` / `mc1:`
- [[PS2SDK - accès disque avec fileXio]] - Accès POSIX au device `cdrom0:`

## 🔌 Modules IOP

- [[PS2 - hiérarchie des modules IOP]] - Driver → serveur → client RPC
- [[PS2 - SIO2MAN bus partagé pad et carte mémoire]] - Le bus SIO2 et ses deux branches
- [[PS2 - IOMAN IOMANX et fileXio]] - La confusion la plus fréquente du SDK
- [[PS2 - variantes de modules IOP]] - Préfixes `X`, suffixes numériques, préfixe `free`

## 🔗 Notes connexes

Les mécanismes de compilation utilisés par le SDK n'ont rien de spécifique à la PS2 :

- [[GCC - driver et non compilateur]] - Les quatre étapes et le rôle du driver
- [[C - en-tête et bibliothèque (déclarer vs définir)]] - La distinction clé du build C
- [[C - convention -lfoo et recherche des archives]] - Comment `ld` trouve une bibliothèque
- [[C - ordre de résolution des archives au link]] - Objets d'abord, bibliothèques ensuite
- [[MAKE - but par défaut DEFAULT_GOAL]] - Le piège de l'`include` avant `all:`
- [[IEEE-754 - simple précision 32 bits]] - Pourquoi `0x3F800000` vaut `1.0f`
- [[MOC - Programmation C]] - Le domaine parent côté langage

## 📖 Ressources

- Dépôt : https://github.com/ps2dev/ps2sdk
- Démarrage : https://ps2dev.github.io/#getting-started
- Documentation matérielle : https://www.psdevwiki.com/ps2/Main_Page
- Vidéos de présentation : https://www.youtube.com/watch?v=kX_JpzxR2Qg&list=PLFZsvEE0TWOsFhZr-9KwLED3Rzlwra_Rm
- Note source : `0-Inbox/PS2SDK.md` (document vivant, enrichi par l'agent `ps2sdk-notes`)

## 🚧 À développer

- [ ] gsKit : l'API graphique haut niveau, alternative à `libdraw`/`libgraph`
- [ ] Microcode VU1 : transformation géométrique et double-buffering
- [ ] Textures : `draw_texture_transfer`, CLUT, `BITBLTBUF`
- [ ] Audio : `libsd` et `AUDSRV`
- [ ] Réseau : `SMAP`, `NETMAN`, `PS2IP`
- [ ] IPU : décodage MPEG et lecture vidéo
- [ ] Modules ERL relocatables

---

**Dernière mise à jour** : 2026-08-22
**Nombre de notes** : 41 notes PS2 + 7 notes génériques connexes
