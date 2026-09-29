---
type: permanent
created: 2026-09-29 16:48
tags:
  - permanent
  - gcc
  - makefile
  - build
  - compilation
---

# GCC : [-MMD -MP] - génération des fichiers de dépendances

> [!abstract] Concept
> `-MMD` fait écrire au compilateur, pendant la compilation, un fichier `.d` listant tous les en-têtes réellement inclus par un `.c` ; inclus dans le Makefile, il complète les règles pour que la modification d'un en-tête déclenche les bonnes recompilations. `-MP` en est le complément indispensable.

## Explication

`make` décide quoi recompiler en comparant les dates de la cible et de ses prérequis. Or une règle ordinaire `build/%.o: src/%.c` ne mentionne que le `.c` : **jamais les en-têtes**. Modifier `include/foo/list.h` ne rajeunit aucun prérequis déclaré, `make` conclut qu'il n'y a rien à faire, et le build produit des objets incohérents — un `.o` compilé contre l'ancienne définition d'une structure, lié à un autre compilé contre la nouvelle. Les symptômes sont des corruptions inexplicables qu'un `make fclean` fait disparaître.

La parade consiste à laisser le compilateur écrire lui-même la liste, puisqu'il est le seul à la connaître exactement après préprocessing. `-MMD` produit, à côté de chaque `.o`, un fichier `.d` contenant une règle Make en bonne et due forme. Un `-include $(DEPS)` en fin de Makefile les charge tous : les prérequis de chaque objet se trouvent ainsi complétés, sans qu'aucune liste ne soit maintenue à la main. Le `-` de `-include` évite l'erreur au tout premier build, quand aucun `.d` n'existe encore.

Les quatre variantes se croisent sur deux critères : inclure ou non les en-têtes système, et compiler ou non au passage. `-M` et `-MM` écrivent la règle sur la sortie standard **sans compiler** — l'ancienne méthode, qui imposait une passe de préprocesseur séparée et doublait le travail ; `-MD` et `-MMD` l'ont remplacée en produisant le `.d` comme effet de bord de la compilation normale. On préfère les variantes `MM`, qui excluent `<stdio.h>` et consorts : ces en-têtes ne changent pas et n'alourdissent inutilement les fichiers.

`-MP` traite le cas de la suppression. Sans lui, un `.d` continue de citer un en-tête supprimé ou renommé, que `make` cherche alors à fabriquer : `No rule to make target 'src/old.h', needed by 'build/foo.o'`, et le build est bloqué jusqu'à un nettoyage manuel. `-MP` ajoute une règle vide pour chaque en-tête, ce qui rend sa disparition inoffensive.

## Exemples

### Le tableau des variantes

| Mode | *En-têtes système* inclus | *En-têtes système* exclus |
|---|---|---|
| **Sans compilation**, règle sur la sortie standard | `-M` | `-MM` |
| **Avec compilation**, règle dans un fichier `.d` | `-MD` | `-MMD` |

### Le fichier produit

```Makefile
# build/list.d
build/list.o: src/list.c include/foo/list.h src/list_internal.h
```

### Le câblage dans le Makefile

```Makefile
CPPFLAGS += -I$(INC_DIR) -I$(SRC_DIR) -MMD -MP
DEPS     := $(OBJS:.o=.d)

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c
	@mkdir -p $(dir $@)
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@

-include $(DEPS)        # en fin de fichier
```

### Ce qu'ajoute `-MP`

```Makefile
build/list.o: src/list.c include/foo/list.h src/list_internal.h

include/foo/list.h:      # règle vide : la disparition du fichier ne bloque plus
src/list_internal.h:
```

## Cas d'usage

- **Tout projet multi-fichiers** : c'est le mécanisme standard, il n'y a pas de raison de s'en passer.
- **Supprimer ou renommer un en-tête** : `-MP` évite le `No rule to make target` qui forcerait un `make fclean`.
- **Diagnostiquer une inclusion parasite** : `gcc -MM src/foo.c` affiche l'arbre réel des en-têtes tirés par un fichier.

## Avantages et inconvénients

✅ **Avantages** :
- **Correction** : modifier un en-tête recompile exactement les objets qui l'incluent.
- **Rapidité** : seuls ces objets sont recompilés, pas tout le projet.
- **Aucune maintenance** : les listes suivent automatiquement l'ajout ou le retrait d'un `#include`.

❌ **Inconvénients** / Limites :
- Un `.d` par objet à nettoyer (`rm -rf build/` s'en charge).
- Le `-include` doit être placé **en fin** de Makefile, sinon la première règle chargée devient le but par défaut.
- `-MMD` ignore les en-têtes système : une mise à jour de la libc ne déclenche pas de recompilation.

## Connexions

### Notes liées
- [[Makefile - automatisation compilation C]] - Le mécanisme de dépendances que ces fichiers complètent
- [[MAKE - but par défaut DEFAULT_GOAL]] - Pourquoi `-include $(DEPS)` se place en dernier
- [[C - Makefile de bibliothèque]] - Le Makefile qui les câble
- [[C - compilation et linkage]] - `-MMD` est une option du préprocesseur, pas du compilateur
- [[C - directives préprocesseur (define include)]] - Les `#include` que ces fichiers tracent

### Dans le contexte de
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/Créer sa librairie en C-C++.md` (chapitre 3c)

---
**Tags thématiques** : #gcc #makefile #build #dependances #preprocesseur
