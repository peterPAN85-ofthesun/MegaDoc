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

<svg viewBox="0 0 450 265" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Contrat du Makefile d'un projet EE et piège de l'ordre des include">
<defs><marker id="mka" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text x="16" y="24" font-size="11.5" fill="currentColor">le projet ne définit que trois variables contractuelles</text>
<rect x="16" y="34" width="200" height="82" rx="5" fill="#27ae60" fill-opacity="0.08" stroke="#27ae60" stroke-width="1.4"/>
<text x="26" y="52" font-size="9.5" fill="#27ae60">votre Makefile</text>
<text x="26" y="68" font-size="9" fill="#27ae60" opacity="0.95">EE_BIN · EE_OBJS · EE_LIB</text>
<text x="26" y="84" font-size="8.5" fill="#27ae60" opacity="0.85">+ EE_LIBS · EE_CFLAGS (+=) · EE_LDFLAGS (=)</text>
<text x="26" y="104" font-size="8.5" fill="#e05252">⚠ EE_LIB (archive .a) ≠ EE_LIBS (les -l…)</text>
<line x1="216" y1="75" x2="236" y2="75" stroke="currentColor" stroke-width="1.5" marker-end="url(#mka)"/>
<rect x="238" y="34" width="196" height="82" rx="5" fill="#4c9aff" fill-opacity="0.08" stroke="#4c9aff" stroke-width="1.4"/>
<text x="248" y="52" font-size="9.5" fill="#4c9aff">fournissent tout le reste</text>
<text x="248" y="70" font-size="9" fill="#4c9aff" opacity="0.95">include Makefile.pref</text>
<text x="248" y="86" font-size="9" fill="#4c9aff" opacity="0.95">include Makefile.eeglobal</text>
<text x="248" y="104" font-size="8.5" fill="#4c9aff" opacity="0.8">flags, règles .c → .o → .elf</text>
<rect x="16" y="128" width="418" height="76" rx="5" fill="#e05252" fill-opacity="0.07" stroke="#e05252" stroke-width="1.4"/>
<text x="26" y="146" font-size="10" fill="#e05252">⚠ le piège le plus coûteux : l'ordre des directives</text>
<rect x="26" y="154" width="180" height="40" rx="3" fill="none" stroke="#e05252" stroke-width="1.1"/>
<text x="34" y="169" font-size="8.5" fill="#e05252">include AVANT all:</text>
<text x="34" y="184" font-size="8" fill="#e05252" opacity="0.9">$(EE_BIN) devient le but par défaut</text>
<line x1="206" y1="174" x2="224" y2="174" stroke="#e05252" stroke-width="1.3" marker-end="url(#mka)"/>
<rect x="226" y="154" width="200" height="40" rx="3" fill="#e05252" fill-opacity="0.12" stroke="#e05252" stroke-width="1.2"/>
<text x="234" y="169" font-size="8.5" fill="#e05252">make nu construit l'ELF…</text>
<text x="234" y="184" font-size="8.5" fill="#e05252">…sans jamais fabriquer l'ISO, en silence</text>
<rect x="16" y="214" width="418" height="44" rx="5" fill="none" stroke="currentColor" stroke-width="1.1" stroke-dasharray="4 3"/>
<text x="26" y="232" font-size="9" fill="currentColor">redondances fréquentes : -L$(PS2SDK)/ee/lib est déjà posé par Makefile.eeglobal</text>
<text x="26" y="248" font-size="9" fill="currentColor" opacity="0.85">et -lkernel figure déjà dans le groupe injecté par les specs GCC</text>
</svg>

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
