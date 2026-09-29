
Il est important d'avoir une bonne base pour créer sa propre librairie en C et C++ : 
- Savoir organiser son arborescence de fichier
- Systématiser les outils de compilations
- Packager son projet pour pouvoir le diffuser correctement à d'autres utilisateurs


# 1 - Librairies satic ou partagées

## Static (*.a*)

Le code de la bibliothèque est copié dans l'exécutable au moment de l'édition de liens.

**Avantages :**
- L'exécutable est autonome : pas besoin de dépendances
- Aucun problème d'ABI (*Applicatiion Binary Interface*) : le programme embarque directement la bonne version de la librairie

**Inconvénients :**
- Pour chaque changement dans le code source, il faut recompiler chaque programme
- L'exécutable est plus lourd  car il contient la librairie

## Partagées (.so)

Le programme contient seulement une référence, et le système charge la bibliothèque au lancement

**Avantages :**
- Mise à jour centralisée : pas besoin de recompiler tous les programmes qui dépendent de la libraires, il suffit de mettre à jour la librairie
- une seule copie en mémoire dans le système, pas une  copie par exécutable donc moins lourd

**Inconvénients :**
- Surveiller l'**ABI** : ne jamais exposé ses structures notamment directement à l'utilisateur
- Il faut à chaque fois s'assurer que la librairie est installée sur le système pour pouvoir l'utilisée

## Conclusion :

On préférera les librairie partagée pour tout ce qui relève d'un projet au niveau d'un système d'exploitation. Pour des projets plus petits, on  choisira la librairie statique.
# 2 - Arborescence recommandée

```
libfoo/
├── include/
│   └── foo/              ← en-têtes PUBLICS (installés chez l'utilisateur)
│       ├── foo.h         ← en-tête « parapluie » qui inclut les autres
│       ├── string.h
│       └── list.h
├── src/                  ← implémentation + en-têtes PRIVÉS
│   ├── internal.h        ← privé, jamais installé
│   ├── string/
│   │   ├── foo_strlen.c
│   │   └── foo_strdup.c
│   └── list/
│       ├── list_internal.h
│       └── foo_list_push.c
├── tests/
│   └── test_string.c
├── examples/
├── build/                ← généré (objets, dépendances), dans .gitignore
├── Makefile
├── README.md
└── LICENSE
```

Le sous-dossier `include/foo/` est important : l'utilisateur écrira `#include <foo/string.h>`, ce qui évite toute collision avec le `<string.h>` standard ou avec une autre bibliothèque.

## a) Distinguer header Public et Privé

Tout se qui se trouve dans le dossier `include/` est **"public"**, accessible à l'utilisateur
Tout se qui se trouve dans le dossier `src/` est **"privé"** et *"disparaît"* à la compilation

Un header **public** contient uniquement ce dont l'utilisateur a besoin : prototypes, types opaques, constantes, macros d'API

```c
/* include/foo/list.h */
#ifndef FOO_LIST_H
#define FOO_LIST_H

#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct foo_list foo_list_t;   /* type OPAQUE : structure cachée */

foo_list_t *foo_list_new(void);
int         foo_list_push(foo_list_t *list, void *data);
size_t      foo_list_size(const foo_list_t *list);
void        foo_list_free(foo_list_t *list);

#ifdef __cplusplus
}
#endif
#endif /* FOO_LIST_H */
```

>[!Note]
>Dans cet exemple, on a fait un header compatible C et C++, en ajoutant la condition `#ifdef __cplusplus` et en encapsulant l'ensemble du header dans `exter "C" {}`.
>>La variable `__cplusplus` est défini automatiquement par tous les compilateurs C++. La différence entre le prototypage en C et le C++ est que le C++ autorise le surcharge d'une fonction, permettant ainsi de la redéfinir plusieurs fois en y ajoutant des paramètres, ce que le C ne peut pas faire.
>
>Sans cet ajout, la bibliothèque écrite en ne peux pas être utilisée en C++. L'inverse n'est pas vrai car le C++ hérite lui même du C


Un en-tête privé contient la définition réelle des structures et les fonctions utilitaires internes :

```c
/* src/list/list_internal.h */
#ifndef FOO_LIST_INTERNAL_H
#define FOO_LIST_INTERNAL_H

#include "foo/list.h"

struct foo_list {
    struct node *head;
    size_t       size;
};

void foo__list_node_free(struct node *n);   /* double underscore = interne */

#endif
```

## b) Utiliser des types opaque

Dans le cas d'une librairie partagée, il sera essentiel de séparer ce qui relève de la compilation de la librairie et la compilation des projets qui en dépendent. Pour ce faire, il faut impérativement empêcher l'usage des types/structs directement par l'utilisateur : rendre les **types opaques**.

### Problème d'un type visible

Prenons l'exemple d'une structure déclarée dans un `list.h` dans notre librairie

```c
/* include/foo/list.h — version 1.0 */
struct foo_list {
    void   *head;
    size_t  size;
};
```

L'utilisateur utilise cette structure directement dans son code :

```c
struct foo_list list;        /* allouée sur SA pile */
foo_list_init(&list);
printf("%zu\n", list.size);  /* accès direct au champ */
```

À la compilation du programme de l'utilisateur, le compilateur à besoin de savoir deux choses :
- La taille d'une structure
- Où retrouver (à quel octet) les champs `head` ou `size` dans la structure

Mettons qu'après avoir écris son programme, on vient à faire une update de `list.h` pour la passer à la version 1.1. On y a alors ajouter un champ à notre structure :

```c
struct foo_list {
    void   *head;
    void   *tail;    /* nouveau */
    size_t  size;
};
```

Comme le programme de l'utilisateur ne recompile pas après notre mise à jour (principe de la librairie partagée), celui-ci vient non seulement pocher la variable `size` à la place de l'actuel `tail`, mais surtout la  création d'une nouvelle structure viendra écraser le dernier élément, ne s'attendant pas à trouver 3 champs au lieu de 2.

### La solution : le type opaque

Dans le header public à disposition de l'utilisateur, on déclare la structure sans la définir :
```c
/* include/foo/list.h */
typedef struct foo_list foo_list_t;   /* « ça existe », sans plus */

foo_list_t *foo_list_new(void);
size_t      foo_list_size(const foo_list_t *list);
void        foo_list_free(foo_list_t *list);
```

La définition réelle vit dans un header *privé* ou dans un `.c`

```c
/* src/list/list.c */
struct foo_list {
    void   *head;
    size_t  size;
};

foo_list_t *foo_list_new(void)
{
    return calloc(1, sizeof(struct foo_list));
}

size_t foo_list_size(const foo_list_t *list)
{
    return list->size;
}
```

De son côté, l’utilisateur n'a qu'à utiliser les fonctions mis à disposition (grossièrement : **constructeur et destructeur**) sans avoir à recompiler son programme. Il est cependant contraint à n'utiliser la structure que sous la forme de pointeurs.

```c
foo_list_t *list = foo_list_new();      /* OK */
printf("%zu\n", foo_list_size(list));   /* OK */

foo_list_t list;        /* ERREUR : taille inconnue */
list->size;             /* ERREUR : contenu inconnu */
```


# 3 - Automatiser correctement la compilation

## a) Makefile

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

## b) Les options de GCC

**Optimisation :**
- `O`: 
>`-O1` `--optimize`
>> Optimiser la compilation prend un peu plus de temps et beaucoup plus de mémoire pour une fonction très grande. Avec `-O`, le compilateur va tenter de réduire la taille du code ainsi que son temps d'exécution, sans trop affecter le temps de compilation. C'est le réglage recommandé pour un bon équilibre entre temps de compilation et optimisation du code.
>
>`-O2`
>>Optimise encore plus, augmente nécessairement le temps de compilation
>
>`-O3`
>>Optimise ENCORE PLUS !
>
>`-O0` ou `-Og`
>>Réduit le temps de compilation et s'assure que le résultat du débugage produit le résultat attendu. (Désactive la plupart des flags d'optimisation)
>
>`-Os`
>>Optimise pour la taille, plutôt que pour le temps d'exécution (`-Oz` encore plus agressif)

**Debug :**
- `-g` = `-g2`
>- `-g0` : pas de debogage
> - `-g1` : le minimum d'info (description des fonctions, *external variables*, **AUNCUNES INFOS SUR LES VARIABLES LOCALES**)
> - `-g2`: level par défaut, donne des infos sur les variables locales, typedefs, namespace, class et template fonctions
> - `-g3` : ajoute les définitions de macro
- `fsanitize=`
> - `-fsanitize=address` : Détecteur d'erreur d'accès mémoire, notamment les *out-of-bounds* et les `use-after-free` bugs. Doit être compilé avec `-g`.
> - `-fsanitize=leak` :  Détecteur de fuite de mémoire
> - `-fsanitize=undefined` : Détecte tous les comportements indéfinis (*expliqué [[#`-fsanitize=undefined`|plus bas]]*)

**Dépendance :**
- `-M` ([[#c) Les dépendances|Voir plus bas]])
>- `-M` : Créé une dépendance dans la sortie standard **avec** les headers système
>- `-MD` : Créé une dépendance dans la sortie standard **sans** les headers systèmes
>- `-MM` : Créé une dépendance dans un fichier `.d` **avec** les headers système
>- `-MMD` : Créé une dépendance dans un fichier `.d` **sans** les headers système
>- `-MP` : ajoute une règle vide pour prévenir des headers supprimés (à combiner avec `-M`, `-MM`, `-MD` et `-MMD`)

**Gestion de la mémoire (librairies partagées)**
- `-fPIC` (PIC - *Position Independent Code*) : on s'assure que le code n'utilise aucunes adresses *absolues*

**Gestion de l'accès aux fonctions par des programmes extérieurs**
- `-fvisibility=`
> - `-fvisibility=default`
>>Tous les symboles sont **publiques** et **interposables** (on peut le remplacer)
>
>- `-fvisibility=internal`
>> Les symboles sont **publiques** mais pas **interposables**
>
>- `-fvisibility=hidden`
>>Tous les symboles sont cachés. Pour les rendre public, il faut les désigner un à un ([[#`-fvisibility=hidden`|Voir Exemple]])
>
>- `-fvisibility=protected`
>> Comme `-fvisibility=hidden` mais avec une garantie supplémentaire : protège d'une utilisation d'une fonction à l'aide d'un pointeur de fonction.

>[!Note]
>**Rôle de l'interposition :**
>>On peut se demander à quoi cela peut-il bien servir de remplacer une fonction par une autre. On peut cependant y voir plusieurs applications :
>>- Compter le nombre d'appels de la fonction
>>- Enregistrer les informations et les arguments passés en paramètre de la fonction
>>- Détecter les fuites de mémoires : en remplaçant `malloc()` et garder une traces des allocations de mémoires
>>- Ajouter nos propres sécurités...

##### `-fsanitize=undefined`
```c
int a = INT_MAX;
a + 1;                 /* dépassement d'entier signé */

int x = 1 << 32;       /* décalage >= largeur du type */
int y = 1 << -1;       /* décalage négatif */

int z = 10 / 0;        /* division entière par zéro */
INT_MIN / -1;          /* dépassement lors d'une division */

int *p = NULL;
*p;                    /* déréférencement d'un pointeur nul */

char buf[8];
int *q = (int *)(buf + 1);
*q;                    /* accès mal aligné */

int t[4];
t[5] = 0;              /* index hors limites d'un tableau à taille connue */

int f(void) { }        /* fonction non-void qui ne renvoie rien (en C++) */

bool b; *(char *)&b = 2;
if (b) ...;            /* valeur invalide pour un booléen ou un enum */
```

##### `-fvisibility=hidden`
Si on utilise cette option dans `gcc`, pour rendre un symbole public par un programme extérieur il faut le désigner manuellement.

*Exemple `.h` :*
```c
#define PUBLIC_API __attribute__ ((visibility("default")))

PUBLIC_API void print_HelloWord(void);
```


## c) Les dépendances

Pour repérer quels fichier compiler, `make` va repérer les quels fichiers à été modifier après la dernières compilation en fonction des règles établies dans le `Makefile`. Or, jamais les headers ne figurent dans ces règles. On va donc chercher à créer une règle sous la forme d'un fichier `.d` (*dépendances*) écris par le compilateur qui liste tous les en-têtes réellement inclus par un `.c`

```Makefile
build/list.o: src/list.c include/foo/list.h src/list_internal.h
```

Inclus dans le Makefile avec `-include $(DEPS)`, ils complètent la règle de compilation:
- **Correction :** modifier un en-tête recompile les objets qui l'incluent
- **Rapidité :** seuls ces objets sont recompilés
- **Aucune maintenance :** les listes suivent automatiquement l'ajout ou le retrait d'un `#include`

Elles se croisent selon deux critères :
- **Inclure** ou non les headers système (`<stdio.h>`, `<stdlib.h>` ...)
- **Compiler** ou non

| Mode                                               | *Header système* inclus | *Header systèùe* exclus |
| -------------------------------------------------- | ----------------------- | ----------------------- |
| **Sans compilation**, règle sur la sortie standard | `-M`                    | `-MM`                   |
| **Avec Compilation**, règle dans un fichier `-d`   | `-MD`                   | `-MMD`                  |

>[!Note]
>`-M` et `-MM` correspondent à l'ancienne méthode qui demandait une étape séparée avant la compilation et doublait donc le travail du préprocesseur. `-MD` et `-MMD` l'ont remplacée.

**Le complément indispensable : `-MP`**
>A combiner avec `-MD` ou `-MMD`. Il ajoute une règle vide pour chaque header, afin que la suppression ou le renommage d'un header ne bloque pas `make` avec `No rule to make target`

# 3 - `.gitignore`

```.gitignore
# ---- Artefacts de compilation ----------------------------------------
build/
*.o
*.d
*.a
*.so
*.so.*
*.dylib
*.dll
*.lib
*.obj
*.exe
*.out

# ---- Binaires de tests / exemples ------------------------------------
tests/run_tests
examples/*
!examples/*.c
!examples/*.h
!examples/Makefile

# ---- Débogage / profilage / couverture -------------------------------
*.dSYM/
core
core.*
vgcore.*
*.gcno
*.gcda
*.gcov
gmon.out
compile_commands.json

# ---- Documentation générée (Doxygen) ---------------------------------
docs/html/
docs/latex/

# ---- Éditeurs / IDE --------------------------------------------------
.vscode/
.idea/
*.swp
*.swo
*~
\#*\#
.#*

# ---- Systèmes d'exploitation -----------------------------------------
.DS_Store
Thumbs.db
```

