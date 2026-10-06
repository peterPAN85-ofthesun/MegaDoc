---
type: permanent
created: 2026-10-02 00:00
tags:
  - permanent
  - programmation
  - c
  - mathematiques
  - math.h
  - librairie
  - linkage
---

# C - librairie math.h

> [!abstract] Concept
> `math.h` déclare les fonctions mathématiques en virgule flottante (`sqrt`, `pow`, trigonométrie, exponentielles, arrondis), mais leur **code** vit dans une bibliothèque distincte de la libc, `libm` : c'est la seule librairie standard d'usage courant dont l'emploi exige d'ajouter explicitement `-lm` à l'édition de liens.

## Explication

L'en-tête fournit trois familles d'éléments. Les **fonctions**, déclarées en `double` par défaut, avec un suffixe par précision : `sqrt`/`sqrtf`/`sqrtl` pour `double`, `float`, `long double` — oublier le suffixe sur un `float` provoque une conversion silencieuse en `double` aller-retour, inutilement coûteuse. Les **macros de classification** (`isnan`, `isinf`, `isfinite`, `fpclassify`, `signbit`) sont le seul moyen correct de tester un résultat non numérique : `x != x` fonctionne par accident, `isnan(x)` exprime l'intention. Enfin les **constantes** : `HUGE_VAL`, `INFINITY` et `NAN` sont normalisées, mais `M_PI` et ses variantes **ne font pas partie du C ISO** — elles viennent de POSIX et peuvent exiger `#define _USE_MATH_DEFINES` ou `-D_GNU_SOURCE` selon la plateforme ; une constante `#define PI 3.14159265358979323846` locale reste le choix portable.

La particularité qui pique tout débutant relève de la distinction [[C - en-tête et bibliothèque (déclarer vs définir)|déclarer vs définir]] : `#include <math.h>` ne fournit que les **prototypes**, ce qui suffit au compilateur mais pas à l'éditeur de liens. Les définitions sont dans `libm`, qu'il faut réclamer avec `-lm`. D'où l'erreur emblématique `undefined reference to 'sqrt'` alors que l'`#include` est bien présent : la compilation a réussi, c'est le **link** qui a échoué. Cette séparation est historique — sur les machines sans unité flottante, `libm` était une implémentation logicielle lourde qu'on ne liait qu'à la demande — et elle survit dans la glibc moderne : en glibc 2.44, `/usr/lib/libm.so` est un script `ld` qui groupe `libm.so.6` et, en `AS_NEEDED`, `libmvec.so.1` (la variante vectorisée).

Deux pièges accompagnent ce link. D'abord l'**optimisation masque l'oubli** : à `-O2`, GCC replie `sqrt(2.0)` ou `pow(2.0, 10)` en constantes à la compilation, le symbole disparaît et le binaire se lie sans `-lm` — pour échouer dès qu'on repasse en `-O0` pour déboguer, ou dès que l'argument devient variable. Ensuite l'**ordre** : `-lm` doit être écrit *après* les objets qui l'utilisent ([[C - ordre de résolution des archives au link]]). En lien dynamique, `ld` tolère souvent l'inverse car il garde en mémoire les symboles d'un `.so`, mais en `-static` l'archive `libm.a` est abandonnée sans retour et l'`undefined reference` revient. La seule écriture robuste reste donc « sources et objets d'abord, bibliothèques ensuite ».

## Exemples

### Fonctions principales

| Catégorie | Fonctions | Remarque |
|---|---|---|
| Racines, puissances | `sqrt`, `cbrt`, `pow`, `hypot` | `hypot(x,y)` évite l'overflow de `sqrt(x*x+y*y)` |
| Exponentielles, logs | `exp`, `exp2`, `log`, `log2`, `log10` | `log1p`/`expm1` pour les très petites valeurs |
| Trigonométrie | `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2` | arguments en **radians** ; `atan2(y,x)` donne l'angle sur 4 quadrants |
| Arrondis | `floor`, `ceil`, `round`, `trunc`, `nearbyint` | `round` s'écarte de zéro, `nearbyint` suit le mode d'arrondi courant |
| Reste, signe | `fmod`, `remainder`, `fabs`, `copysign` | `fmod` garde le signe du dividende |
| Classification | `isnan`, `isinf`, `isfinite`, `fpclassify`, `signbit` | macros, pas des fonctions |

### Code

```c
#include <math.h>
#include <stdio.h>

int main(void)
{
    double x = 2.0;

    printf("sqrt  = %f\n", sqrt(x));        // 1.414214
    printf("pow   = %f\n", pow(x, 10));     // 1024.000000
    printf("angle = %f\n", atan2(1.0, 1.0)); // 0.785398 rad = pi/4

    double bad = sqrt(-1.0);                // hors domaine
    if (isnan(bad))
        printf("resultat non numerique\n");

    return 0;
}
```

### Lier en ligne de commande

```bash
$ gcc -O0 math_demo.c -o demo
/usr/bin/ld : référence indéfinie vers « sqrt »
/usr/bin/ld : référence indéfinie vers « pow »

$ gcc -O0 math_demo.c -lm -o demo     # la bibliothèque APRÈS la source
$ ./demo
sqrt  = 1.414214
```

### Lier depuis un Makefile

La règle est de **ne pas mettre `-lm` dans `CFLAGS`** : les deux options vont dans deux variables distinctes, parce que Make les insère à deux endroits différents de la ligne de link.

```Makefile
CC       ?= cc
CFLAGS   ?= -O2
CFLAGS   += -Wall -Wextra -std=c99
CPPFLAGS += -Iinclude        # -I  : où trouver les en-têtes (compilation)
LDFLAGS  += -Lbuild          # -L  : où chercher les bibliothèques (link)
LDLIBS   += -lm              # -l  : quelles bibliothèques lier (link, EN DERNIER)

SRCS := $(wildcard src/*.c)
OBJS := $(SRCS:.c=.o)

demo: $(OBJS)
	$(CC) $(LDFLAGS) $^ $(LDLIBS) -o $@      # -L avant les objets, -l après

%.o: %.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) demo

.PHONY: clean
```

Cette répartition n'est pas arbitraire : c'est le contrat de la règle implicite de GNU Make, consultable avec `make -p`.

```Makefile
LINK.c = $(CC) $(CFLAGS) $(CPPFLAGS) $(LDFLAGS) $(TARGET_ARCH)
%: %.c
	$(LINK.c) $^ $(LOADLIBES) $(LDLIBS) -o $@
```

`$(LDFLAGS)` est développé **avant** `$^`, `$(LDLIBS)` **après** : en respectant les deux variables, l'ordre correct est obtenu gratuitement, y compris avec la règle implicite — un simple `LDLIBS = -lm` dans un Makefile sans aucune règle suffit à ce que `make demo` lie `demo.c` correctement.

### Le piège de l'optimisation

```bash
$ gcc -O2 math_demo.c -o demo     # lie SANS -lm : sqrt(2.0) a été replié à la compilation
$ ldd demo | grep libm            # (rien) — libm n'est même pas chargée
$ gcc -O0 math_demo.c -o demo     # le même code échoue dès qu'on retire l'optimisation
/usr/bin/ld : référence indéfinie vers « sqrt »
```

Conclusion : mettre `-lm` dès qu'on inclut `math.h`, sans se fier au fait que « ça compile ».

## Cas d'usage

- **Calcul géométrique et 3D** : `sqrt`, `hypot`, `atan2` pour les normes, distances et angles — voir [[MATH - produit scalaire]] et [[MATH - quaternion (définition et structure)]].
- **Normalisation d'un vecteur** : `1.0 / sqrt(x*x + y*y + z*z)`, ou `hypot` pour éviter l'overflow sur de grandes valeurs.
- **Conversion degrés/radians** : toute la trigonométrie de `math.h` travaille en radians, la conversion est à la charge de l'appelant.
- **Valider un résultat flottant** : `isnan`/`isfinite` après une division, un `sqrt` ou un `log` dont l'argument vient de l'utilisateur.
- **Diagnostiquer un `undefined reference to 'sqrt'`** : c'est un oubli de `-lm`, jamais un problème d'`#include`.

## Avantages et inconvénients

✅ **Avantages** :
- Normalisée ISO C : disponible sur toute implémentation hébergée, sans dépendance externe.
- Les variantes `f`/`l` permettent de coller à la précision réellement utilisée.
- Les fonctions dédiées (`hypot`, `log1p`, `fma`) sont numériquement plus sûres que leur équivalent écrit à la main.

❌ **Inconvénients** / Limites :
- Le `-lm` obligatoire est une exception parmi les librairies standard, source d'erreur de link récurrente.
- `-O2` peut masquer l'oubli de `-lm` et faire apparaître la panne plus tard, en build debug.
- `M_PI` n'est pas ISO : code non portable sans garde ou constante locale.
- La gestion d'erreurs est double et peu pratique (`errno` + exceptions flottantes), selon `math_errhandling`.
- Pas de surcharge en C : il faut choisir manuellement `sqrtf`/`sqrt`/`sqrtl` (les macros génériques de `tgmath.h` comblent ce manque).

## Connexions

### Notes liées
- [[C - en-tête et bibliothèque (déclarer vs définir)]] - Pourquoi l'`#include` ne suffit pas et qu'il faut `-lm`
- [[GCC : [-l] et [-L] - lier une bibliothèque et son chemin de recherche]] - Le couple d'options utilisé par `LDFLAGS`/`LDLIBS`
- [[C - ordre de résolution des archives au link]] - Pourquoi `-lm` se place après les objets
- [[Makefile - automatisation compilation C]] - Les variables `CFLAGS`, `LDFLAGS`, `LDLIBS` et la règle implicite
- [[C - types de données primitifs]] - `float`, `double`, `long double` et le choix du suffixe
- [[C - directives préprocesseur (define include)]] - `#include <math.h>` et le cas de `_USE_MATH_DEFINES`
- [[C - librairie string.h]] - Une librairie standard déjà dans la libc, qui ne demande aucun `-l`
- [[C - bibliothèque statique vs bibliothèque partagée]] - `libm.a` contre `libm.so.6`

### Dans le contexte de
- [[MOC - Programmation C]] - Fait partie de ce domaine
- [[MOC - Mathématiques]] - Les notions calculées par ces fonctions

## Sources
- Norme ISO C, `<math.h>` ; manuel glibc, chapitre *Mathematics*
- Vérifications en session : GCC 16.2.1, glibc 2.44 (2026-10-02)

---
**Tags thématiques** : #c #math.h #librairie #linkage #makefile
