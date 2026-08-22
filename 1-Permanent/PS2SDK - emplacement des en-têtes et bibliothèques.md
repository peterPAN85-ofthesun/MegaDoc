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
