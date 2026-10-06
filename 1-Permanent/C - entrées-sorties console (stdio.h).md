---
type: permanent
created: 2025-11-13 00:25
tags:
  - permanent
  - programmation
  - c
  - stdio.h
  - printf
  - scanf
---

# C - entrées-sorties console (stdio.h)

> [!abstract] Concept
> La librairie stdio.h fournit les fonctions d'entrée-sortie standard : printf (affichage) et scanf (saisie).

## Explication

**Fonctions principales** :
- `printf(format, ...)` : affichage formaté
- `scanf(format, ...)` : saisie formatée

**Formats de conversion** :

| Format | Type |
|--------|------|
| `%d` | int |
| `%f` | float/double |
| `%c` | char |
| `%s` | string |
| `%p` | pointeur |

## Exemples

### printf

```c
int age = 25;
float prix = 19.99;
char nom[] = "Alice";

printf("Age: %d\n", age);
printf("Prix: %.2f€\n", prix);  // 2 décimales
printf("Nom: %s\n", nom);
printf("%s a %d ans\n", nom, age);
```

### scanf

```c
int age;
float taille;
char nom[50];

printf("Entrez votre âge: ");
scanf("%d", &age);  // Attention au &

printf("Entrez votre taille: ");
scanf("%f", &taille);

printf("Entrez votre nom: ");
scanf("%s", nom);  // Pas de & pour les tableaux
```

## Lier depuis un Makefile

`stdio.h` fait partie de la **libc**, que le pilote `gcc` lie déjà de lui-même : aucun `-l` n'est nécessaire ici, et écrire `-lc` serait redondant. Le contre-exemple à connaître est [[C - librairie math.h]], dont les définitions vivent dans une bibliothèque séparée et qui exige donc `-lm`.

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
LDLIBS   +=               # -l : rien pour stdio.h (libc) ; -lm pour math.h, -lfoo pour libfoo

prog: main.o io.o
	$(CC) $(LDFLAGS) $^ $(LDLIBS) -o $@

%.o: %.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@
```

Les deux variables de link ne sont pas interchangeables : la règle implicite de GNU Make développe `$(LDFLAGS)` **avant** les objets et `$(LDLIBS)` **après** (`LINK.c = $(CC) $(CFLAGS) $(CPPFLAGS) $(LDFLAGS)`, puis `$(LINK.c) $^ $(LOADLIBES) $(LDLIBS) -o $@`), ce qui satisfait gratuitement la contrainte d'ordre du linker. Un `-lfoo` glissé dans `CFLAGS` passerait avant les objets : l'archive serait lue alors qu'aucun symbole n'est encore réclamé, puis ignorée → `undefined reference` ([[C - ordre de résolution des archives au link]]).

## Connexions

- [[C - manipulation de fichiers]] - fprintf, fscanf
- [[C - chaînes de caractères (strings)]] - Format %s
- [[C - pointeurs (concepts de base)]] - & dans scanf
- [[C - librairie math.h]] - La librairie standard qui, elle, impose `-lm` au link
- [[GCC : [-l] et [-L] - lier une bibliothèque et son chemin de recherche]] - Le détail des deux options
- [[Makefile - automatisation compilation C]] - Les variables `CFLAGS`, `LDFLAGS`, `LDLIBS`

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Librairies/Librairie stdio.h.md`

---
**Tags thématiques** : #c #stdio.h #printf #scanf #io
