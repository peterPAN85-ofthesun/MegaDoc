---
type: permanent
created: 2026-09-29 16:42
tags:
  - permanent
  - gcc
  - debug
  - memoire
  - build
---

# GCC : [-fsanitize] - instrumentation à l'exécution

> [!abstract] Concept
> `-fsanitize=` fait injecter par le compilateur des vérifications **à l'exécution** : `address` détecte les accès mémoire invalides, `leak` les fuites, `undefined` les comportements indéfinis — chacun diagnostiquant au moment précis de la faute au lieu de laisser le programme dériver.

## Explication

Un accès hors limites ou un `use-after-free` ne provoque pas de plantage immédiat : le programme continue avec une mémoire silencieusement corrompue, et le crash survient bien plus tard, à un endroit sans rapport. Les sanitizers renversent cette logique. Le compilateur entoure chaque accès mémoire de contrôles et remplace l'allocateur par une version qui encadre les blocs de *redzones* empoisonnées ; le premier accès fautif est signalé sur-le-champ, avec pile d'appels, site d'allocation et site de libération.

`-fsanitize=address` (ASan) couvre les débordements de tampon (pile, tas, globales), les `use-after-free` et `use-after-return`. Il doit être compilé avec [[GCC : [-g] - niveaux d'informations de débogage|`-g`]] pour que le rapport cite fichier et ligne, et **doit aussi être passé à l'édition de liens** pour tirer la bibliothèque d'exécution. `-fsanitize=leak` (LSan) signale à la sortie les blocs jamais libérés — il est déjà inclus dans ASan sous Linux. `-fsanitize=undefined` (UBSan) instrumente les opérations dont la norme C ne définit pas le résultat : elles ne plantent pas, elles produisent n'importe quoi, et l'optimiseur a le droit de supposer qu'elles n'arrivent jamais — d'où des bugs qui n'apparaissent qu'à `-O2`.

Le coût interdit de les laisser en production : ASan multiplie environ par 2 le temps d'exécution et par 3 la mémoire. Ils appartiennent donc à une cible `debug` dédiée, et sont mutuellement exclusifs avec `valgrind` (les deux instrumentent l'allocateur). `address` et `undefined` se combinent en revanche très bien : `-fsanitize=address,undefined`.

## Exemples

### Les trois sanitizers usuels

| Option | Détecte |
|---|---|
| `-fsanitize=address` | Accès hors limites, `use-after-free`, `use-after-return`, double `free`. Requiert `-g`. |
| `-fsanitize=leak` | Fuites de mémoire (blocs non libérés à la sortie). |
| `-fsanitize=undefined` | Comportements indéfinis (voir catalogue ci-dessous). |

### Ce que `-fsanitize=undefined` attrape

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

### Dans un Makefile

```Makefile
debug: CFLAGS := -g3 -O0 -fsanitize=address,undefined
debug: LDFLAGS += -fsanitize=address,undefined   # indispensable au link
debug: re
```

### Un rapport ASan

```
==1234==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000010
READ of size 4 at 0x602000000010 thread T0
    #0 0x401234 in main list.c:42
freed by thread T0 here:
    #1 0x401100 in foo_list_free list.c:31
```

## Cas d'usage

- **Cible `make debug`** : reconstruire tout le projet instrumenté avant de chasser une corruption mémoire.
- **Intégration continue** : faire tourner la suite de tests sous ASan+UBSan pour attraper les fautes latentes avant release.
- **Diagnostiquer un bug qui n'apparaît qu'en `-O2`** : c'est presque toujours un UB, que `-fsanitize=undefined` localise immédiatement.

## Avantages et inconvénients

✅ **Avantages** :
- Diagnostic au point exact de la faute, avec pile d'appels et site d'allocation.
- Aucune modification du code source, aucun outil externe à installer.
- Attrape des UB que ni le compilateur ni les tests ne révèlent.

❌ **Inconvénients** / Limites :
- Surcoût important : ~2x en temps, ~3x en mémoire — jamais en production.
- Nécessite de recompiler **tout** le code à instrumenter, y compris la bibliothèque.
- Incompatible avec `valgrind` ; certaines vérifications ne fonctionnent qu'à `-O0`.
- Doit être répété dans `LDFLAGS`, oubli fréquent qui produit un `undefined reference to '__asan_*'`.

## Connexions

### Notes liées
- [[GCC : [-g] - niveaux d'informations de débogage]] - Requis pour des rapports avec fichier et ligne
- [[GCC : [-O] - niveaux d'optimisation]] - L'optimisation exploite les UB, d'où les bugs qu'elle révèle
- [[C - allocation dynamique (malloc free)]] - Les fautes que ASan et LSan surveillent
- [[C - pointeurs (concepts de base)]] - Déréférencement nul, pointeur pendant
- [[C - Makefile de bibliothèque]] - La cible `debug` qui les active

### Dans le contexte de
- [[C - compilation et linkage]] - Option de compilation **et** de link
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/Créer sa librairie en C-C++.md` (chapitre 3b)

---
**Tags thématiques** : #gcc #debug #sanitizer #memoire #undefined-behavior
