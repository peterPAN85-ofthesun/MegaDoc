---
type: permanent
created: 2025-11-13 00:12
tags:
  - permanent
  - programmation
  - c
  - string.h
  - librairie
---

# C - librairie string.h

> [!abstract] Concept
> La librairie string.h fournit des fonctions pour manipuler les chaînes de caractères (longueur, copie, concaténation, comparaison).

## Explication

Fonctions principales :

| Fonction | Description |
|----------|-------------|
| `strlen(s)` | Longueur de la chaîne |
| `strcpy(dest, src)` | Copie src dans dest |
| `strcat(dest, src)` | Concatène src à dest |
| `strcmp(s1, s2)` | Compare s1 et s2 |
| `strchr(s, c)` | Cherche caractère c |
| `strstr(s, sub)` | Cherche sous-chaîne |

## Exemples

```c
#include <string.h>
#include <stdio.h>

int main() {
    char str1[50] = "Hello";
    char str2[] = " World";

    // Longueur
    printf("Longueur: %zu\n", strlen(str1));  // 5

    // Copie
    char copie[50];
    strcpy(copie, str1);  // copie = "Hello"

    // Concaténation
    strcat(str1, str2);  // str1 = "Hello World"

    // Comparaison
    if (strcmp(str1, "Hello World") == 0) {
        printf("Identiques\n");
    }

    return 0;
}
```

## Lier depuis un Makefile

`string.h` fait partie de la **libc**, que le pilote `gcc` lie déjà de lui-même : aucun `-l` n'est nécessaire ici, et écrire `-lc` serait redondant. Le contre-exemple à connaître est [[C - librairie math.h]], dont les définitions vivent dans une bibliothèque séparée et qui exige donc `-lm`.

Le réflexe à garder est de savoir **dans quelle variable** poser chaque option, pour le jour où une bibliothèque externe entre dans le projet :

| Variable | Option | Étape | Position sur la ligne de link |
|---|---|---|---|
| `CPPFLAGS` | `-Ichemin` | compilation | — |
| `LDFLAGS` | `-Lchemin` | link | avant les objets |
| `LDLIBS` | `-lfoo` | link | **après** les objets, impérativement |

```Makefile
CC       ?= cc
CFLAGS   ?= -O2
CFLAGS   += -Wall -Wextra -std=c99
CPPFLAGS += -Iinclude     # -I : où trouver les en-têtes
LDFLAGS  += -Lbuild       # -L : où chercher les bibliothèques
LDLIBS   +=               # -l : rien pour string.h (libc) ; -lm pour math.h, -lfoo pour libfoo

prog: main.o strutils.o
	$(CC) $(LDFLAGS) $^ $(LDLIBS) -o $@

%.o: %.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@
```

Les deux variables de link ne sont pas interchangeables : la règle implicite de GNU Make développe `$(LDFLAGS)` **avant** les objets et `$(LDLIBS)` **après** (`LINK.c = $(CC) $(CFLAGS) $(CPPFLAGS) $(LDFLAGS)`, puis `$(LINK.c) $^ $(LOADLIBES) $(LDLIBS) -o $@`), ce qui satisfait gratuitement la contrainte d'ordre du linker. Un `-lfoo` glissé dans `CFLAGS` passerait avant les objets : l'archive serait lue alors qu'aucun symbole n'est encore réclamé, puis ignorée → `undefined reference` ([[C - ordre de résolution des archives au link]]).

## Connexions

- [[C - chaînes de caractères (strings)]] - Concept de base
- [[C - librairie math.h]] - La librairie standard qui, elle, impose `-lm` au link
- [[GCC : [-l] et [-L] - lier une bibliothèque et son chemin de recherche]] - Le détail des deux options
- [[Makefile - automatisation compilation C]] - Les variables `CFLAGS`, `LDFLAGS`, `LDLIBS`

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Librairies/Librairie string.h.md`

---
**Tags thématiques** : #c #string.h #librairie #strlen #strcpy
