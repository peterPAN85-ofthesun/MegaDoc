---
type: permanent
created: 2025-11-13 00:00
tags:
  - permanent
  - programmation
  - c
  - malloc
  - free
  - mémoire-dynamique
  - libc
---

# C - allocation dynamique (malloc/free)

> [!abstract] Concept
> L'allocation dynamique permet de réserver de la mémoire pendant l'exécution du programme, avec une taille déterminée au runtime. Les fonctions qui la gèrent sont déclarées par `stdlib.h` et définies dans la **libc**, liée automatiquement par `gcc` : aucune bibliothèque à ajouter au link.

## Explication

**Différence statique/dynamique** :
- **Statique** : taille fixe à la compilation (`int tab[10]`)
- **Dynamique** : taille variable à l'exécution (`malloc()`)

**Fonctions principales**, déclarées par l'en-tête `stdlib.h` :
- `malloc(taille)` : alloue `taille` octets, retourne `void*`
- `free(pointeur)` : libère la mémoire allouée
- `sizeof(type)` : opérateur du langage, évalué à la compilation — ni une fonction, ni un élément de `stdlib.h`

`stdlib.h` n'est qu'un **en-tête** : il fournit les prototypes. Le **code** de `malloc`, `calloc`, `realloc` et `free` est compilé dans la **libc** (`libc.so.6` / `libc.a`), la bibliothèque standard C que le pilote `gcc` lie à tout programme sans qu'on le lui demande — d'où l'absence de tout `-l` ici, contrairement à [[C - librairie math.h]] dont les définitions vivent dans `libm` ([[C - en-tête et bibliothèque (déclarer vs définir)]]). Voir [[#Lier depuis un Makefile]].

**Règle d'or** : Tout `malloc()` doit avoir son `free()` correspondant.

## Exemples

### Allocation simple

```c
#include <stdlib.h>
#include <stdio.h>

int main() {
    int *p = NULL;

    // Alloue mémoire pour 1 entier
    p = (int*)malloc(sizeof(int));

    if (p == NULL) {
        printf("Erreur d'allocation\n");
        return 1;
    }

    *p = 42;  // Utilisation
    printf("%d\n", *p);

    free(p);  // Libération obligatoire
    return 0;
}
```

### Tableau dynamique

```c
int *tableau = NULL;
int taille = 10;

// Alloue tableau de 10 entiers
tableau = (int*)malloc(taille * sizeof(int));

if (tableau == NULL) {
    printf("Échec allocation\n");
    return 1;
}

// Utilisation comme tableau normal
for (int i = 0; i < taille; i++) {
    tableau[i] = i * 2;
}

// Affichage
for (int i = 0; i < taille; i++) {
    printf("%d ", tableau[i]);
}

free(tableau);  // Libération
```

### Taille variable (saisie utilisateur)

```c
int nbElements;
printf("Combien d'éléments ? ");
scanf("%d", &nbElements);

int *tab = (int*)malloc(nbElements * sizeof(int));

if (tab != NULL) {
    // Utilisation...
    free(tab);
}
```

### Allocation de structure

```c
typedef struct {
    int x;
    int y;
} Point;

Point *p = (Point*)malloc(sizeof(Point));

if (p != NULL) {
    p->x = 10;
    p->y = 20;
    free(p);
}
```

### Tableau de pointeurs (tableau 2D dynamique)

```c
int lignes = 3, colonnes = 4;
int **matrice = NULL;

// Alloue tableau de pointeurs
matrice = (int**)malloc(lignes * sizeof(int*));

// Alloue chaque ligne
for (int i = 0; i < lignes; i++) {
    matrice[i] = (int*)malloc(colonnes * sizeof(int));
}

// Utilisation
matrice[0][0] = 1;
matrice[1][2] = 5;

// Libération (dans l'ordre inverse)
for (int i = 0; i < lignes; i++) {
    free(matrice[i]);
}
free(matrice);
```

### Fonction calloc (initialise à zéro)

```c
// malloc : mémoire non initialisée
int *tab1 = (int*)malloc(10 * sizeof(int));  // Valeurs aléatoires

// calloc : mémoire initialisée à 0
int *tab2 = (int*)calloc(10, sizeof(int));  // Tous à 0

free(tab1);
free(tab2);
```

### Fonction realloc (redimensionner)

```c
int *tab = (int*)malloc(5 * sizeof(int));

// Agrandir à 10 éléments
tab = (int*)realloc(tab, 10 * sizeof(int));

free(tab);
```

## Lier depuis un Makefile

`stdlib.h` fait partie de la **libc**, que le pilote `gcc` lie déjà de lui-même : `malloc`, `calloc`, `realloc` et `free` ne demandent **aucun `-l`**, et écrire `-lc` serait redondant. Le contre-exemple à connaître est [[C - librairie math.h]], dont les définitions vivent dans une bibliothèque séparée et qui exige donc `-lm`. Un `undefined reference to 'malloc'` ne vient donc jamais d'un `-l` manquant, mais d'un link fait sans la libc (`-nostdlib`, `-ffreestanding`, bare-metal) : dans ce cas c'est l'allocateur lui-même qui est absent, et il faut le fournir.

Trois cas particuliers font malgré tout apparaître une option de link autour de l'allocation :

| Besoin | Option | Étape | Remarque |
|---|---|---|---|
| Détecter fuites et débordements | `-fsanitize=address` | compilation **et** link | à mettre dans `CFLAGS` *et* `LDFLAGS`, pas dans `LDLIBS` ([[GCC : [-fsanitize] - instrumentation à l'exécution]]) |
| Remplacer l'allocateur | `-ljemalloc`, `-ltcmalloc` | link | `LDLIBS`, après les objets |
| Vérifier avec Valgrind | — | — | aucun flag : Valgrind intercepte `malloc` à l'exécution, un simple `-g` suffit à nommer les lignes |

Le réflexe à garder est de savoir **dans quelle variable** poser chaque option, pour le jour où une bibliothèque externe entre dans le projet :

| Variable | Option | Étape | Position sur la ligne de link |
|---|---|---|---|
| `CPPFLAGS` | `-Ichemin` | compilation | — |
| `LDFLAGS` | `-Lchemin` | link | avant les objets |
| `LDLIBS` | `-lfoo` | link | **après** les objets, impérativement |

```Makefile
CC       ?= cc
CFLAGS   ?= -O2 -g
CFLAGS   += -Wall -Wextra -std=c99
CPPFLAGS += -Iinclude     # -I : où trouver les en-têtes
LDFLAGS  += -Lbuild       # -L : où chercher les bibliothèques
LDLIBS   +=               # -l : rien pour stdlib.h (libc) ; -lm pour math.h, -lfoo pour libfoo

prog: main.o alloc.o
	$(CC) $(LDFLAGS) $^ $(LDLIBS) -o $@

%.o: %.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@

# Variante instrumentée : ASan se met dans CFLAGS *et* LDFLAGS
asan: CFLAGS  += -fsanitize=address -fno-omit-frame-pointer
asan: LDFLAGS += -fsanitize=address
asan: prog
```

Les deux variables de link ne sont pas interchangeables : la règle implicite de GNU Make développe `$(LDFLAGS)` **avant** les objets et `$(LDLIBS)` **après** (`LINK.c = $(CC) $(CFLAGS) $(CPPFLAGS) $(LDFLAGS)`, puis `$(LINK.c) $^ $(LOADLIBES) $(LDLIBS) -o $@`), ce qui satisfait gratuitement la contrainte d'ordre du linker. Un `-lfoo` glissé dans `CFLAGS` passerait avant les objets : l'archive serait lue alors qu'aucun symbole n'est encore réclamé, puis ignorée → `undefined reference` ([[C - ordre de résolution des archives au link]]).

## Connexions

### Concepts liés
- [[C - pointeurs (concepts de base)]] - malloc retourne un pointeur
- [[C - tableaux statiques]] - Alternative aux tableaux fixes
- [[C - structures (struct)]] - Allocation de structures
- [[C - en-tête et bibliothèque (déclarer vs définir)]] - `stdlib.h` déclare, la libc définit
- [[C - librairie math.h]] - La librairie standard qui, elle, impose `-lm` au link
- [[GCC : [-l] et [-L] - lier une bibliothèque et son chemin de recherche]] - Le détail des deux options
- [[Makefile - automatisation compilation C]] - Les variables `CFLAGS`, `LDFLAGS`, `LDLIBS`

### Pièges courants
- **Fuite mémoire** (memory leak) : oublier `free()`
- **Double free** : libérer 2 fois la même mémoire
- **Dangling pointer** : utiliser un pointeur après `free()`
- **Ne pas vérifier NULL** : malloc peut échouer

### Bonnes pratiques

```c
// Toujours vérifier
void *ptr = malloc(size);
if (ptr == NULL) {
    // Gestion d'erreur
}

// Libérer et mettre à NULL
free(ptr);
ptr = NULL;  // Évite dangling pointer
```

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 16)

---
**Tags thématiques** : #c #malloc #free #mémoire-dynamique #allocation #heap #libc
