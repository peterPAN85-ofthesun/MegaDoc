---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - build
  - makefile
---

# PS2SDK - Makefile d'un projet EE

> [!abstract] Concept
> Un projet EE définit seulement trois variables contractuelles (`EE_BIN`, `EE_OBJS`, `EE_LIB`) plus ses bibliothèques et flags, puis inclut `Makefile.pref` et `Makefile.eeglobal` qui fournissent tout le reste — à condition de déclarer `all:` **avant** les `include`.

## Explication

`Makefile.eeglobal` annonce lui-même son contrat en commentaire : `# Externally defined variables: EE_BIN, EE_OBJS, EE_LIB`. Tout le reste a une valeur par défaut. Le projet ajoute en pratique `EE_LIBS` (les `-l…` applicatifs), `EE_CFLAGS` (en `+=`) et parfois `EE_LDFLAGS`. Attention au piège de nommage : `EE_LIB` au singulier sert à produire une archive `.a`, `EE_LIBS` au pluriel liste les bibliothèques à lier — ce sont deux variables différentes.

Le piège le plus coûteux concerne l'ordre des directives. GNU Make construit `.DEFAULT_GOAL`, c'est-à-dire la **première cible explicite rencontrée**, `include` compris. Comme `Makefile.eeglobal` définit `$(EE_BIN): $(EE_OBJS)`, l'inclure avant `all:` en fait le but par défaut : un `make` nu construit l'ELF **sans jamais fabriquer l'ISO**, silencieusement. Le mécanisme générique est décrit dans [[MAKE - but par défaut DEFAULT_GOAL]].

Deux redondances fréquentes valent d'être connues : `-L$(PS2SDK)/ee/lib` est déjà posé par `Makefile.eeglobal`, et `-lkernel` figure déjà dans le groupe injecté par les specs GCC. Enfin `EE_LDFLAGS` se déclare avec `=` (expansion différée) pour pouvoir référencer `$(PS2SDK)` avant son affectation.

## Exemples

### Makefile complet produisant un ELF puis une ISO

```makefile
EE_BIN=test.elf
EE_OBJS=main.o

EE_LIBS=-ldma -lgraph -ldraw -lkernel -ldebug -lpacket

EE_CFLAGS += -Wall --std=c99
EE_LDFLAGS =

PS2SDK=/usr/local/ps2dev/ps2sdk
ISO_TGT=test.iso

all: $(ISO_TGT)          # AVANT les include, sinon le but par défaut est volé

include $(PS2SDK)/samples/Makefile.eeglobal
include $(PS2SDK)/samples/Makefile.pref

$(ISO_TGT): $(EE_BIN)
	mkisofs -l -o $(ISO_TGT) $(EE_BIN) SYSTEM.CNF

.PHONY: clean
clean:
	rm -rf $(ISO_TGT) $(EE_BIN) $(EE_OBJS)
```

### Vérifier quel but sera construit

```bash
make -p -n | grep '^\.DEFAULT_GOAL'
```

## Cas d'usage

- **Tout projet homebrew EE** : c'est le squelette de build standard.
- **Ajouter une bibliothèque** : une ligne dans `EE_LIBS`, jamais de `-L` supplémentaire.
- **Produire une ISO bootable** : règle `mkisofs` combinant l'ELF et `SYSTEM.CNF`.

## Avantages et inconvénients

✅ **Avantages** :
- Très peu de lignes à écrire : le SDK fournit règles implicites et flags.
- Toutes les variables du SDK sont surchargeables.

❌ **Inconvénients** / Limites :
- L'ordre `all:` / `include` est une source d'erreur silencieuse.
- Un `-l` ajouté par réflexe pour un en-tête *header-only* casse le link.

## Connexions

### Notes liées
- [[PS2SDK - hiérarchie des Makefile du SDK]] - Qui définit quoi dans les quatre fichiers
- [[MAKE - but par défaut DEFAULT_GOAL]] - Le mécanisme générique du piège d'ordre
- [[PS2SDK - en-têtes header-only sans archive]] - Pourquoi tout `#include` n'a pas son `-l`
- [[PS2 - SYSTEM.CNF et démarrage d'un ELF]] - Le second fichier de l'ISO
- [[Makefile - automatisation compilation C]] - Les bases de Make

- [[ELF - Executable and Linkable Format]] - Le format de l'artefact nommé par `EE_BIN`

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 2 - Sdk)

---
**Tags thématiques** : #ps2sdk #makefile #build #ee
