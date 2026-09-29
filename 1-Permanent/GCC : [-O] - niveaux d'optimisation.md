---
type: permanent
created: 2026-09-29 16:38
tags:
  - permanent
  - gcc
  - compilation
  - optimisation
  - build
---

# GCC : [-O] - niveaux d'optimisation

> [!abstract] Concept
> `-O<n>` règle le compromis entre temps de compilation, vitesse d'exécution et taille du binaire : `-O0` désactive tout, `-O2` est le réglage de production courant, `-Os`/`-Oz` privilégient la taille et `-Og` le débogage.

## Explication

Sans option, GCC compile en `-O0` : traduction quasi littérale du source, aucune réorganisation. Chaque niveau au-dessus active un ensemble de passes supplémentaires — propagation de constantes, élimination de code mort, *inlining*, déroulage de boucles, vectorisation. Le gain en vitesse se paie en temps de compilation et en mémoire du compilateur, de façon parfois spectaculaire sur les très grosses fonctions.

`-O1` (ou `-O` tout court) vise l'équilibre : réduire à la fois la taille du code et le temps d'exécution sans trop allonger la compilation. `-O2` pousse plus loin et constitue le défaut de fait des bibliothèques et distributions. `-O3` ajoute des passes agressives (vectorisation, *inlining* plus large) dont le bénéfice réel dépend beaucoup du code — il arrive qu'il dégrade les performances en gonflant le cache d'instructions. `-Os` optimise la taille plutôt que la vitesse, `-Oz` va plus loin encore au détriment du temps d'exécution.

Deux niveaux sont faits pour le développement. `-O0` garantit que ce que montre le débogueur correspond au source : pas de variable optimisée hors d'existence, pas de ligne réordonnée. `-Og` est le compromis conçu pour le débogage — il active les optimisations qui ne gênent pas le pas-à-pas. Dans un Makefile, `CFLAGS ?= -O2` laisse l'utilisateur surcharger le niveau sans éditer le fichier.

## Exemples

### Les niveaux

| Option | Effet |
|---|---|
| `-O0` | Aucune optimisation (défaut). Compilation rapide, débogage fidèle. |
| `-Og` | Optimise sans gêner le débogueur. Le bon choix en développement. |
| `-O1` / `-O` | Réduit taille et temps d'exécution sans trop allonger la compilation. |
| `-O2` | Optimise davantage ; allonge nécessairement la compilation. Standard de production. |
| `-O3` | Passes agressives (vectorisation, inlining large). Gain non garanti. |
| `-Os` | Optimise la **taille** plutôt que la vitesse. |
| `-Oz` | Comme `-Os`, plus agressif encore. |

### Un effet visible

```c
int f(void) { int a = 2, b = 3; return a * b; }
```

```bash
$ gcc -O0 -S f.c -o -   # charge 2, charge 3, multiplie
$ gcc -O2 -S f.c -o -   # movl $6, %eax   — tout est replié à la compilation
```

### Dans un Makefile

```Makefile
CFLAGS ?= -O2                  # surchargeable : make CFLAGS=-O0
CFLAGS += -Wall -Wextra -Werror
debug: CFLAGS := -g3 -O0 -fsanitize=address,undefined
```

## Cas d'usage

- **Production / release** : `-O2`, éventuellement `-O3` après mesure sur du code de calcul.
- **Développement et débogage** : `-O0` ou `-Og`, obligatoires pour que `gdb` reste lisible.
- **Embarqué et bibliothèques chargées en mémoire contrainte** : `-Os` pour un binaire compact.

## Avantages et inconvénients

✅ **Avantages** :
- Gain de performance sans toucher au code source.
- Curseur explicite : un seul flag arbitre vitesse, taille et temps de build.

❌ **Inconvénients** / Limites :
- Rend le débogage trompeur : variables « optimized out », lignes réordonnées.
- Peut révéler des *undefined behavior* jusque-là inoffensifs — un bug apparu en passant à `-O2` est presque toujours un UB, à chercher avec [[GCC : [-fsanitize] - instrumentation à l'exécution|`-fsanitize=undefined`]].
- `-O3` n'est pas systématiquement plus rapide que `-O2` : à mesurer.

## Connexions

### Notes liées
- [[GCC : [-g] - niveaux d'informations de débogage]] - L'autre moitié du couple compilation/débogage
- [[GCC : [-fsanitize] - instrumentation à l'exécution]] - Ce qui révèle les UB exposés par l'optimisation
- [[C - compilation et linkage]] - Qui reçoit cette option parmi les quatre étapes
- [[C - qualificatif volatile]] - Le mot-clé qui interdit localement l'optimisation d'un accès
- [[C - Makefile de bibliothèque]] - Où `-O2` et `-O0` cohabitent

### Dans le contexte de
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/Créer sa librairie en C-C++.md` (chapitre 3b)

---
**Tags thématiques** : #gcc #compilation #optimisation #build #performance
