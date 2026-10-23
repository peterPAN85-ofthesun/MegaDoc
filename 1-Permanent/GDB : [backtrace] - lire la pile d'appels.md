---
type: permanent
created: 2026-10-12 14:53
tags:
  - permanent
  - gdb
  - debug
  - c
---

# GDB : [backtrace] - lire la pile d'appels

> [!abstract] Concept
> `backtrace` (`bt`, ou `where`) affiche la chaîne des appels qui a mené à l'arrêt, de la fonction courante jusqu'à `main` ; `up` et `down` permettent de se déplacer dans cette chaîne pour inspecter les variables de chaque niveau.

## Explication

À chaque appel de fonction, le programme empile un **cadre de pile** (*frame*) contenant les paramètres, les variables locales et l'adresse de retour. La pile d'appels est donc l'historique vivant du chemin parcouru, et c'est la première chose à regarder après un arrêt — surtout après un crash : le `#0` indique *où* ça a cassé, les niveaux suivants *pourquoi on y était*. Un `SIGSEGV` dans `memcpy` ne dit rien ; voir qu'il a été appelé depuis `charger_config` avec un pointeur issu d'un `fopen` raté dit tout.

Les cadres sont numérotés à partir de `#0`, la fonction la plus profonde — celle où l'on est. `up` monte vers l'appelant (`#1`, `#2`…), `down` redescend ; les deux acceptent un nombre de niveaux (`up 3`), et `frame <n>` saute directement. Ce déplacement est purement un **changement de point de vue** : il ne modifie pas l'exécution, mais il change la portée de résolution des noms. Après un `up`, [[GDB : [print] - afficher une valeur et choisir son format|`print`]] voit les locales de l'appelant, ce qui est souvent plus direct que la [[GDB - qualification de portée (fonction::variable)|qualification `fonction::variable`]].

Deux compléments indispensables à chaque niveau : `info args` liste les paramètres reçus par la fonction du cadre courant, `info locals` ses variables locales. Pour les récursions profondes, `bt <n>` limite l'affichage aux `n` premiers cadres et `bt -n` aux `n` derniers — nécessaire quand la pile compte des milliers d'entrées. Un `bt` qui s'achève sur des `??` signale soit du code sans symboles, soit une pile corrompue (débordement de tampon ayant écrasé une adresse de retour).

## Exemples

### Lire une pile après un crash

```
Program received signal SIGSEGV, Segmentation fault.
0x00007ffff7e4b2a1 in memcpy () from /lib/libc.so.6
(gdb) bt
#0  memcpy () from /lib/libc.so.6
#1  0x0000555555555234 in charger_config (chemin=0x0) at config.c:28
#2  0x00005555555552f1 in init () at main.c:14
#3  0x0000555555555345 in main () at main.c:31
```

Le coupable est au cadre `#1` : `chemin=0x0`, un pointeur nul transmis à la fonction.

### Se déplacer et inspecter

```
(gdb) up                     # passe au cadre #1
#1  0x... in charger_config (chemin=0x0) at config.c:28
28          memcpy(buf, chemin, n);
(gdb) info args
chemin = 0x0
n = 64
(gdb) info locals
buf = "\000\000..."
(gdb) p n * 2                # évalué dans la portée de ce cadre
$1 = 128
(gdb) down                   # retour au cadre #0
(gdb) frame 3                # saut direct vers main
```

### Les variantes

| Commande | Effet |
|---|---|
| `bt` / `where` / `backtrace` | Pile complète |
| `bt 5` | Les 5 cadres les plus profonds |
| `bt -5` | Les 5 cadres les plus externes (jusqu'à `main`) |
| `bt full` | Pile complète **avec** les locales de chaque cadre |
| `frame` | Rappelle quel cadre est sélectionné |

## Cas d'usage

- **Segfault** : identifier la ligne fautive puis remonter jusqu'à l'origine de la donnée invalide.
- **Récursion infinie** : `bt 20` montre le motif répété et la condition d'arrêt jamais atteinte.
- **Assertion ou `abort()`** : la pile dit quel chemin a violé l'invariant.
- **Code inconnu** : comprendre qui appelle quoi en posant un point d'arrêt et en lisant la pile.

## Avantages et inconvénients

✅ **Avantages** :
- Donne le contexte complet d'un crash en une commande.
- `up`/`down` rendent accessibles les variables de tous les niveaux d'appel.
- Fonctionne aussi sur un *core dump* post-mortem, sans relancer le programme.

❌ **Inconvénients** / Limites :
- Illisible sans `-g` (adresses et `??` au lieu des noms et des lignes).
- `-O2` peut faire disparaître des cadres par *inlining* : le chemin affiché n'est plus le chemin écrit.
- Une pile corrompue produit une trace fausse — le symptôme devient lui-même peu fiable.

## Connexions

### Notes liées
- [[GDB - débogueur en ligne de commande]] - Le premier réflexe après tout arrêt
- [[GDB : [print] - afficher une valeur et choisir son format]] - Ce qu'on fait une fois le bon cadre sélectionné
- [[GDB - qualification de portée (fonction::variable)]] - L'alternative au déplacement de cadre
- [[GDB - exécution pas à pas (next step continue finish)]] - `finish` sort du cadre `#0` vers `#1`
- [[C - fonctions (déclaration et appel)]] - Le mécanisme d'appel qui empile ces cadres
- [[VALGRIND - profiler la consommation stack et heap]] - Mesurer ce que cette pile consomme réellement

### Dans le contexte de
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/GDB.md`

---
**Tags thématiques** : #gdb #debug #pile #backtrace #c
