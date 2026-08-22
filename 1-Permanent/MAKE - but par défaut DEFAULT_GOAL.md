---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - make
  - build
  - makefile
---

# MAKE - but par défaut DEFAULT_GOAL

> [!abstract] Concept
> Invoqué sans argument, `make` ne construit pas `all` mais `.DEFAULT_GOAL`, c'est-à-dire la **première cible explicite rencontrée en lisant le fichier, `include` compris** — un `include` mal placé peut donc voler le but par défaut sans le moindre message.

## Explication

La règle est simple mais son effet est silencieux. `make` lit le fichier de haut en bas, `include` inclus dans l'ordre de lecture, et retient la première cible explicite — non-implicite, non-pattern — qu'il rencontre. C'est elle qui sera construite en l'absence d'argument.

Le piège apparaît dès qu'un `include` précède la première règle du fichier. Si le fichier inclus définit lui-même une cible, celle-ci devient le but par défaut, et le `all:` écrit plus bas ne sert plus à rien. Aucune erreur n'est émise : `make` construit simplement autre chose que ce qu'on croit, ce qui peut passer inaperçu longtemps.

Trois protections existent. La plus robuste est de poser explicitement `.DEFAULT_GOAL := all`, qui fonctionne quel que soit l'ordre. Sinon, déclarer `all:` **avant** tout `include`, ou invoquer `make all` systématiquement. En cas de doute, `make -p -n | grep '^\.DEFAULT_GOAL'` donne la réponse.

## Exemples

### Le piège

```makefile
include regles.mk      # si regles.mk définit une cible, elle devient le but par défaut
all: monprog           # ← n'est PLUS le but par défaut
```

### Les trois protections

```makefile
.DEFAULT_GOAL := all   # explicite, robuste quel que soit l'ordre
```

```makefile
all: monprog           # ou bien : déclarer all AVANT tout include
include regles.mk
```

```bash
make all               # ou bien : nommer le but explicitement
```

### Diagnostic

```bash
make -p -n | grep '^\.DEFAULT_GOAL'
```

## Cas d'usage

- **Projet utilisant un Makefile de SDK** qui définit ses propres cibles.
- **Build qui produit le mauvais artefact** sans erreur apparente.
- **Écrire un Makefile robuste** destiné à être inclus ou étendu.

## Avantages et inconvénients

✅ **Avantages** :
- `.DEFAULT_GOAL` rend l'intention explicite et insensible à l'ordre.
- La règle est cohérente et facile à vérifier une fois connue.

❌ **Inconvénients** / Limites :
- L'échec est silencieux : rien ne signale que le but a changé.
- La convention `all` est si répandue qu'on la croit garantie par Make.

## Connexions

### Notes liées
- [[Makefile - automatisation compilation C]] - Les bases de Make
- [[PS2SDK - Makefile d'un projet EE]] - Une manifestation concrète du piège
- [[C - compilation et linkage]] - Ce que ces règles orchestrent
- [[GCC - driver et non compilateur]] - Les commandes lancées par les règles

### Dans le contexte de
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 7g)

---
**Tags thématiques** : #make #makefile #build #defaultgoal
