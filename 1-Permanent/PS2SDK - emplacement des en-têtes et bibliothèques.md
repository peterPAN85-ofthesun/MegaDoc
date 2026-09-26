---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - build
  - toolchain
---

# PS2SDK - emplacement des en-têtes et bibliothèques

> [!abstract] Concept
> Trois répertoires sous `$PS2SDK` suffisent à situer tout le SDK côté EE : `ee/include/` (en-têtes spécifiques EE), `common/include/` (en-têtes partagés EE/IOP) et `ee/lib/` qui contient **toutes** les archives `.a`.

## Explication

L'installation pose `PS2DEV=/usr/local/ps2dev` et `PS2SDK=/usr/local/ps2dev/ps2sdk`, avec `$PS2DEV/{bin,ee/bin,iop/bin,dvp/bin,ps2sdk/bin}` déjà dans le `PATH`. Les outils s'appellent donc sans chemin absolu, mais **sous leur nom complet** : le compilateur EE est `mips64r5900el-ps2-elf-gcc`, et il n'existe **aucun alias `ee-gcc`** contrairement à ce que suggèrent de vieux tutoriels ps2dev.

Les deux répertoires d'en-têtes sont injectés d'office par `EE_INCS`, ce qui explique qu'un `#include <draw.h>` fonctionne sans rien déclarer. `ee/include/` contient ce qui est propre à l'EE (`dma.h`, `draw.h`, `graph.h`, `kernel.h`, `packet.h`, `debug.h`, `dma_tags.h`) ; `common/include/` ce qui est partagé avec l'IOP et se compile différemment selon `#ifdef _EE` (`tamtypes.h`, `gif_tags.h`, `gs_gp.h`, `gs_psm.h`).

Toutes les archives vivent dans **un seul** répertoire, `ee/lib/`, déjà couvert par le `-L` de `Makefile.eeglobal`. Un `-L` supplémentaire n'est utile que pour un port compilé à la main. Attention : `ee/common/lib` **n'existe pas** — c'est un `-L` mort qu'on trouve encore dans des exemples et qui provoque un `cannot find -l…` trompeur.

<svg viewBox="0 0 450 245" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Les trois répertoires du PS2SDK côté EE">
<text x="16" y="24" font-size="11.5" fill="currentColor">trois répertoires suffisent à situer tout le SDK côté EE</text>
<rect x="16" y="34" width="418" height="22" rx="3" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="26" y="49" font-size="9" fill="currentColor">$PS2SDK = /usr/local/ps2dev/ps2sdk</text>
<rect x="36" y="64" width="398" height="46" rx="4" fill="#4c9aff" fill-opacity="0.1" stroke="#4c9aff" stroke-width="1.3"/>
<text x="46" y="82" font-size="9.5" fill="#4c9aff">ee/include/ — propre à l'EE</text>
<text x="46" y="98" font-size="8.5" fill="#4c9aff" opacity="0.9">dma.h · draw.h · graph.h · kernel.h · packet.h · debug.h · dma_tags.h</text>
<rect x="36" y="116" width="398" height="46" rx="4" fill="#27ae60" fill-opacity="0.1" stroke="#27ae60" stroke-width="1.3"/>
<text x="46" y="134" font-size="9.5" fill="#27ae60">common/include/ — partagé EE et IOP, compilé selon #ifdef _EE</text>
<text x="46" y="150" font-size="8.5" fill="#27ae60" opacity="0.9">tamtypes.h · gif_tags.h · gs_gp.h · gs_psm.h</text>
<rect x="36" y="168" width="398" height="42" rx="4" fill="#f2994a" fill-opacity="0.1" stroke="#f2994a" stroke-width="1.3"/>
<text x="46" y="186" font-size="9.5" fill="#f2994a">ee/lib/ — TOUTES les archives .a, un seul répertoire</text>
<text x="46" y="202" font-size="8.5" fill="#f2994a" opacity="0.9">déjà couvert par le -L de Makefile.eeglobal</text>
<text x="46" y="60" font-size="8" fill="currentColor" opacity="0.7">les deux dossiers d'en-têtes sont injectés d'office par EE_INCS</text>
<rect x="16" y="216" width="418" height="26" rx="4" fill="#e05252" fill-opacity="0.08" stroke="#e05252" stroke-width="1.2"/>
<text x="26" y="233" font-size="8.5" fill="#e05252">⚠ ee/common/lib N'EXISTE PAS · aucun alias ee-gcc : c'est mips64r5900el-ps2-elf-gcc</text>
</svg>

## Exemples

### Le réflexe avant d'ajouter un `-l`

```bash
ls $PS2SDK/ee/lib/lib*.a
```

### Poids indicatif des archives d'un projet graphique

```
libdma.a      49 Ko      libdebug.a   108 Ko
libpacket.a   23 Ko      libgraph.a   111 Ko
libdraw.a    172 Ko      libkernel.a  1,3 Mo
```

`libkernel` écrase tout le reste : elle embarque les syscalls et la gestion de threads.

## Cas d'usage

- **Localiser un prototype** : `grep -r nom_de_fonction $PS2SDK/ee/include $PS2SDK/common/include`.
- **Vérifier qu'une bibliothèque existe** avant de l'ajouter à `EE_LIBS`.
- **Configurer un LSP** : ce sont exactement les deux `-I` à fournir à clangd.

## Avantages et inconvénients

✅ **Avantages** :
- Arborescence plate et prévisible, tout est trouvable en deux commandes.
- Les chemins sont injectés automatiquement par le SDK.

❌ **Inconvénients** / Limites :
- Des `-L` obsolètes circulent dans les exemples en ligne.
- Le nom des outils, long et sans alias, surprend au premier abord.

## Connexions

### Notes liées
- [[PS2SDK - en-têtes header-only sans archive]] - Les en-têtes sans `-l` correspondant
- [[PS2SDK - répartition des bibliothèques EE]] - Ce que contient chaque archive
- [[PS2SDK - hiérarchie des Makefile du SDK]] - Le `EE_INCS` qui injecte ces chemins
- [[PS2SDK - configuration du LSP (bear et clangd)]] - Réutiliser ces chemins dans l'éditeur

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 2, « Où vivent les en-têtes et les bibliothèques »)

---
**Tags thématiques** : #ps2sdk #toolchain #build #include
