---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - build
  - makefile
---

# PS2SDK - hiérarchie des Makefile du SDK

> [!abstract] Concept
> Quatre fichiers interviennent dans un build EE — le Makefile du projet, `Makefile.pref` (noms des outils), `Makefile.eeglobal` (flags et règles) et `Defs.make` (réservé à la compilation du SDK lui-même) — et savoir lequel définit quoi évite de chercher une variable au mauvais endroit.

## Explication

`samples/Makefile.pref` regroupe **28 variables, toutes en `?=`**, qui nomment les outils : `EE_TOOL_PREFIX ?= mips64r5900el-ps2-elf-` puis `EE_CC ?= $(EE_TOOL_PREFIX)gcc` et ses dérivés, la même chose côté IOP avec `IOP_TOOL_PREFIX ?= mipsel-none-elf-`, six variables pour le compilateur **de l'hôte** (`CC ?= cc`, pour les outils comme `bin2c` qui tournent sur le PC) et cinq utilitaires shell. Étant en `?=`, toutes sont surchargeables : `make EE_CC=ma-version-de-gcc`.

`samples/Makefile.eeglobal` porte les 16 variables de flags et les règles implicites `.c → .o → .elf`. C'est sa ligne `EE_INCS := -I$(PS2SDK)/ee/include -I$(PS2SDK)/common/include -I. $(EE_INCS)` qui rend `#include <draw.h>` possible sans rien déclarer dans le projet.

Toutes ces variables suivent le motif **`X := <défauts SDK> $(X)`**, à double conséquence. L'expansion immédiate `:=` capture ce que le projet a défini **avant** l'`include`, ce qui explique qu'un `EE_CFLAGS += -Wall` placé plus haut fonctionne. Et comme nos flags atterrissent en fin de ligne, ils **l'emportent** en cas de conflit (chez gcc, le dernier flag gagne) : `EE_OPTFLAGS = -O0` écrase bien le `-O2` du SDK.

`$PS2SDK/Defs.make` reprend à l'identique les 28 variables de `Makefile.pref` (plus `EE_PKG_CONFIG`) mais sert à construire **le SDK lui-même**. C'est le piège de la recherche : un `grep -r 'EE_CC' $PS2SDK` remonte deux définitions, seule celle de `samples/Makefile.pref` s'applique à un projet.

## Exemples

### Les principales valeurs de `Makefile.eeglobal`

```makefile
EE_INCS         := -I$(PS2SDK)/ee/include -I$(PS2SDK)/common/include -I. $(EE_INCS)
EE_OPTFLAGS     ?= -O2
EE_WARNFLAGS    ?= -Wall
EE_CFLAGS       := -D_EE -G0 $(EE_OPTFLAGS) $(EE_WARNFLAGS) $(EE_DBGINFOFLAGS) $(EE_CFLAGS)
EE_LDFLAGS      := -L$(PS2SDK)/ee/lib -Wl,-zmax-page-size=128 $(EE_LDFLAGS)
EE_LINKFILE     := $(PS2SDK)/ee/startup/linkfile
```

### Les deux seules macros qui atteignent le code C

| Flag | Nature | Effet |
|---|---|---|
| `-D_EE` | vraie macro préprocesseur | identifie la cible EE, testable par `#ifdef _EE` — c'est ainsi que `common/include/` se compile différemment côté EE et IOP |
| `-G0` | flag MIPS, pas un define | seuil de *small data section* à 0, mécanisme désactivé |

### Réduire la taille de l'ELF avec la libc allégée

```makefile
NEWLIB_NANO = 1   # bascule sur -lc_nano / -lm_nano et reconstruit EXTRA_LDFLAGS
```

## Cas d'usage

- **Trouver quel compilateur est réellement appelé** : `Makefile.pref`, pas `Defs.make`.
- **Surcharger un flag** : le poser dans le projet, il gagne parce qu'il est concaténé en dernier.
- **Alléger le binaire** : `NEWLIB_NANO = 1`.

## Avantages et inconvénients

✅ **Avantages** :
- Séparation nette outils / flags / règles.
- Tout est surchargeable sans patcher le SDK.

❌ **Inconvénients** / Limites :
- La duplication `Defs.make` / `Makefile.pref` induit en erreur lors d'une recherche.
- Le motif `X := défauts $(X)` est peu intuitif tant qu'on ne l'a pas vu.

## Connexions

### Notes liées
- [[PS2SDK - Makefile d'un projet EE]] - Ce que le projet doit définir de son côté
- [[PS2SDK - emplacement des en-têtes et bibliothèques]] - Ce qu'injecte `EE_INCS`
- [[PS2SDK - bibliothèques injectées par les specs GCC]] - Ce qui s'ajoute au link
- [[Makefile - automatisation compilation C]] - Les bases de Make

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 2, « Les variables des Makefile du SDK »)

---
**Tags thématiques** : #ps2sdk #makefile #build #toolchain
