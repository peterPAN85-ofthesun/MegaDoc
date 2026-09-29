---
type: permanent
created: 2026-09-29 16:36
tags:
  - permanent
  - c
  - makefile
  - build
  - bibliotheque
---

# C - Makefile de bibliothèque (cibles install et uninstall)

> [!abstract] Concept
> Le Makefile d'une bibliothèque se distingue de celui d'un exécutable par trois traits : il archive (`ar rcs`) ou lie en partagé (`-shared`) au lieu de produire un binaire, il expose des cibles `install`/`uninstall` paramétrées par `PREFIX` et `DESTDIR`, et il découvre ses sources récursivement.

## Explication

La cible principale ne produit pas un exécutable mais une archive : `ar rcs libfoo.a $(OBJS)` (`r` remplace, `c` crée sans avertir, `s` écrit l'index des symboles). La variante partagée réutilise les mêmes règles mais exige des objets compilés en [[GCC : [-fPIC] - code indépendant de la position|PIC]] — d'où la *target-specific variable* `$(SHARED): CFLAGS += $(PICFLAGS)`, qui n'étend `CFLAGS` que pour les prérequis de cette cible.

Les cibles `install` et `uninstall` sont ce qui rend le projet diffusable. `PREFIX ?= /usr/local` fixe la racine d'installation et reste surchargeable par l'utilisateur ([[Makefile - automatisation compilation C|opérateur `?=`]]), tandis que `DESTDIR` préfixe tous les chemins sans être défini par défaut : c'est le point d'entrée des packagers, qui installent dans une racine temporaire avant d'empaqueter. L'installation copie l'archive vers `$(PREFIX)/lib` et **l'intégralité du dossier `include/foo`** vers `$(PREFIX)/include` — ce qui n'est possible proprement que grâce à l'[[C - arborescence d'un projet de bibliothèque|arborescence]] qui isole la surface publique.

Le reste relève de l'outillage de développement : `debug` redéfinit `CFLAGS` pour l'instrumentation puis réenchaîne sur `re`, `test` compile `tests/*.c` contre la bibliothèque fraîchement produite comme le ferait un utilisateur, et `-include $(DEPS)` tire les [[GCC : [-MMD -MP] - génération des fichiers de dépendances|fichiers de dépendances]] pour que la modification d'un en-tête déclenche les recompilations nécessaires.

## Exemples

### Makefile de référence

```Makefile
# ---- Configuration -----------------------------------------------------
NAME      := libfoo.a
SHARED    := libfoo.so
CC        ?= cc
AR        ?= ar
PREFIX    ?= /usr/local

SRC_DIR   := src
INC_DIR   := include
BUILD_DIR := build

CFLAGS    ?= -O2
CFLAGS    += -Wall -Wextra -Werror -std=c99 -pedantic
CPPFLAGS  += -I$(INC_DIR) -I$(SRC_DIR) -MMD -MP
PICFLAGS  := -fPIC -fvisibility=hidden

# ---- Sources -----------------------------------------------------------
SRCS := $(shell find $(SRC_DIR) -name '*.c')
OBJS := $(SRCS:$(SRC_DIR)/%.c=$(BUILD_DIR)/%.o)
DEPS := $(OBJS:.o=.d)

# ---- Règles ------------------------------------------------------------
.PHONY: all clean fclean re install uninstall test debug

all: $(NAME)

$(NAME): $(OBJS)
	$(AR) rcs $@ $^

$(SHARED): CFLAGS += $(PICFLAGS)
$(SHARED): $(OBJS)
	$(CC) -shared -o $@ $^ $(LDFLAGS)

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c
	@mkdir -p $(dir $@)
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@

debug: CFLAGS := -g3 -O0 -fsanitize=address,undefined
debug: LDFLAGS += -fsanitize=address,undefined
debug: re

test: $(NAME)
	$(CC) $(CPPFLAGS) $(CFLAGS) tests/*.c -L. -lfoo -o $(BUILD_DIR)/run_tests
	./$(BUILD_DIR)/run_tests

install: $(NAME)
	install -d $(DESTDIR)$(PREFIX)/lib $(DESTDIR)$(PREFIX)/include
	install -m 644 $(NAME) $(DESTDIR)$(PREFIX)/lib/
	cp -r $(INC_DIR)/foo $(DESTDIR)$(PREFIX)/include/

uninstall:
	rm -f  $(DESTDIR)$(PREFIX)/lib/$(NAME)
	rm -rf $(DESTDIR)$(PREFIX)/include/foo

clean:
	rm -rf $(BUILD_DIR)

fclean: clean
	rm -f $(NAME) $(SHARED)

re: fclean all

-include $(DEPS)
```

### Les deux variables d'installation

```bash
make install                              # → /usr/local/lib, /usr/local/include
make install PREFIX=$HOME/.local          # installation utilisateur
make install DESTDIR=/tmp/pkg             # → /tmp/pkg/usr/local/... (packaging)
```

### Reproduire l'arborescence source dans `build/`

```Makefile
OBJS := $(SRCS:$(SRC_DIR)/%.c=$(BUILD_DIR)/%.o)   # src/list/push.c → build/list/push.o
```

Le `@mkdir -p $(dir $@)` de la règle de compilation crée les sous-dossiers manquants à la volée — sans lui, `find` récursif et `build/` plat ne cohabitent pas.

## Cas d'usage

- **Diffuser la bibliothèque** : `make && sudo make install` suffit à l'utilisateur, `make uninstall` annule proprement.
- **Empaqueter** : un packager appelle `make install DESTDIR=$pkgdir` sans jamais toucher au système réel.
- **Chasser un bug mémoire** : `make debug` reconstruit tout avec `-g3 -O0 -fsanitize=address,undefined`.

## Avantages et inconvénients

✅ **Avantages** :
- `PREFIX`/`DESTDIR` sont la convention GNU attendue par tous les outils de packaging.
- Les mêmes objets servent l'archive et le partagé, sans duplication de règles.
- `install -m 644` pose des permissions correctes, contrairement à un `cp`.

❌ **Inconvénients** / Limites :
- `$(shell find ...)` s'évalue une fois au chargement : un fichier ajouté en cours de build est ignoré.
- Les objets sont partagés entre cible statique et partagée alors que seul `$(SHARED)` ajoute `-fPIC` — il faut un `make fclean` entre les deux pour éviter d'archiver des objets PIC ou l'inverse.
- Pas de gestion du `soname` ni du versionnage `libfoo.so.1` : à ajouter pour une vraie diffusion système.

## Connexions

### Notes liées
- [[Makefile - automatisation compilation C]] - La syntaxe Make générale (variables, `?=`, `$@`, `$^`)
- [[C - arborescence d'un projet de bibliothèque]] - La structure que ce Makefile suppose
- [[GCC : [-MMD -MP] - génération des fichiers de dépendances]] - Le `-include $(DEPS)` final
- [[GCC : [-fPIC] - code indépendant de la position]] - Ce que `PICFLAGS` apporte
- [[MAKE - but par défaut DEFAULT_GOAL]] - Pourquoi `-include` se place en fin de fichier
- [[PS2SDK - Makefile d'un projet EE]] - Le même schéma en cross-compilation

### Dans le contexte de
- [[C - bibliothèque statique vs bibliothèque partagée]] - Les deux cibles que ce Makefile produit
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/Créer sa librairie en C-C++.md` (chapitre 3a)

---
**Tags thématiques** : #c #makefile #build #bibliotheque #install
