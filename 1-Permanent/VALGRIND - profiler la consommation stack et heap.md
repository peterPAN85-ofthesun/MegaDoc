---
type: permanent
created: 2026-10-12 14:55
tags:
  - permanent
  - valgrind
  - debug
  - performance
  - c
---

# VALGRIND - profiler la consommation stack et heap

> [!abstract] Concept
> L'outil `massif` de Valgrind échantillonne la mémoire consommée par un programme au fil de son exécution ; `ms_print` transforme le journal produit en courbe et en instantanés chiffrés, distinguant heap utile, surcoût d'allocateur et pile.

## Explication

Savoir qu'un programme « consomme trop » ne dit ni **quand** ni **quoi**. `massif` répond aux deux : il s'interpose entre le programme et l'allocateur, échantillonne régulièrement l'état de la mémoire et écrit un journal d'instantanés. Le résultat n'est pas un total mais un **profil temporel** — on voit la montée, le pic, les paliers et, en détail aux instantanés complets, l'arbre des fonctions responsables des allocations.

La lecture repose sur quatre colonnes qu'il ne faut pas confondre. `useful-heap` est ce que le programme a effectivement demandé à [[C - allocation dynamique (malloc free)|`malloc`/`calloc`/`realloc`]]. `extra-heap` est le surcoût de l'allocateur : en-têtes de blocs, arrondis d'alignement, remplissage — invisible dans le code, bien réel en mémoire, et d'autant plus lourd que les allocations sont nombreuses et petites. `stacks` mesure la pile, mais **seulement** si l'option `--stacks=yes` a été passée (c'est coûteux, donc désactivé par défaut). `total` est la somme des trois, soit l'empreinte réellement vue par le système.

Deux conditions de mesure sont impératives. Compiler avec les **mêmes optimisations que la version étudiée** : profiler un binaire `-O0` ne renseigne pas sur le comportement d'un binaire `-O2`, où l'allocation d'un objet peut avoir été éliminée. Et désactiver [[GCC : [-fsanitize] - instrumentation à l'exécution|`-fsanitize=address`]] : ASan remplace lui aussi l'allocateur, les deux instrumentations sont mutuellement exclusives et Valgrind refuse de tourner. `-g` reste utile, non pour la mesure, mais pour que les piles d'allocation portent des noms de fonctions plutôt que des adresses.

## Exemples

### La chaîne complète

```shell
$ gcc -g -O2 main.c -o a.out          # mêmes optimisations que la cible, + symboles
$ valgrind --tool=massif \
           --stacks=yes \             # inclure la pile dans la mesure
           --peak-inaccuracy=0.0 \    # pic exact, sans tolérance
           --massif-out-file=out.log ./a.out
$ ms_print out.log | less             # courbe + instantanés lisibles
```

> [!warning] Incompatible avec les sanitizers
> Retirer `-fsanitize=address` (et `=leak`) de la ligne de compilation : Valgrind et ASan instrumentent tous deux l'allocateur et ne peuvent pas cohabiter.

### Lire le tableau

```
--------------------------------------------------------------------------------
  n        time(i)         total(B)   useful-heap(B) extra-heap(B)    stacks(B)
--------------------------------------------------------------------------------
 84        299,075            4,088            1,560           296        2,232
 85        300,870            4,320            1,560           296        2,464
 86        302,665            4,816            1,560           296        2,960
 87        304,454            4,856            1,560           296        3,000   ← pic
 88        306,262            3,400            1,560           296        1,544
 89        308,071            1,816            1,024             8          784
 90        309,862            1,776            1,024             8          744
 91        311,646              528                0             0          528
```

| Colonne | Signification |
|---|---|
| `n` | Numéro d'instantané |
| `time(i)` | Date de l'instantané (par défaut en instructions exécutées) |
| `total(B)` | Empreinte totale = heap utile + surcoût + pile |
| `useful-heap(B)` | Octets réellement demandés par `malloc`/`calloc`/`realloc` |
| `extra-heap(B)` | Surcoût de l'allocateur : en-têtes de blocs, alignement, remplissage |
| `stacks(B)` | Pile — mesurée uniquement avec `--stacks=yes` |

Ici le heap reste plat à 1 560 octets : la variation du `total` vient entièrement de la **pile**, qui gonfle jusqu'à 3 000 octets puis redescend — signature d'une récursion ou de gros tableaux automatiques, pas d'un problème d'allocation dynamique.

### Options utiles

| Option | Rôle |
|---|---|
| `--stacks=yes` | Mesurer la pile (désactivé par défaut : fort surcoût) |
| `--peak-inaccuracy=0.0` | Pic exact ; par défaut 1 % de tolérance pour aller plus vite |
| `--massif-out-file=F` | Nom du journal (défaut : `massif.out.<pid>`) |
| `--time-unit=B` | Axe du temps en octets alloués plutôt qu'en instructions |
| `--detailed-freq=N` | Fréquence des instantanés détaillés (arbre des allocations) |
| `--threshold=N` | Seuil d'affichage des entrées de l'arbre, en pourcentage |

### Visualisation graphique

```shell
$ massif-visualizer out.log     # même journal, courbe interactive et arbre cliquable
```

## Cas d'usage

- **Localiser un pic mémoire** : repérer l'instantané du maximum, puis lire l'arbre d'allocation détaillé pour savoir quelle fonction en est responsable.
- **Trancher pile ou heap** : un `total` qui monte à `useful-heap` constant désigne la pile — donc une récursion ou de gros tableaux automatiques.
- **Mesurer le surcoût d'allocateur** : un `extra-heap` du même ordre que `useful-heap` révèle une multitude de petites allocations, candidates au regroupement en un seul bloc.
- **Valider une optimisation** : comparer deux profils avant/après remplacement d'une structure de données.

## Avantages et inconvénients

✅ **Avantages** :
- Aucune modification du code source ni recompilation particulière (hors retrait des sanitizers).
- Sépare explicitement heap utile, surcoût d'allocateur et pile.
- Profil temporel complet avec attribution par pile d'appels, et non simple total.
- Journal réutilisable : `ms_print` en console, `massif-visualizer` en graphique.

❌ **Inconvénients** / Limites :
- Ralentissement important, encore accentué par `--stacks=yes`.
- Incompatible avec `-fsanitize=address` / `=leak`.
- Ne détecte pas les fuites (c'est le rôle de `--tool=memcheck`) : mesure l'usage, pas sa légitimité.
- Mesure la mémoire **demandée**, non la mémoire physique réellement engagée par le noyau.

## Connexions

### Notes liées
- [[C - allocation dynamique (malloc free)]] - Les appels dont `useful-heap` comptabilise exactement les demandes
- [[GCC : [-fsanitize] - instrumentation à l'exécution]] - Instrumentation concurrente, à désactiver avant toute mesure
- [[GCC : [-O] - niveaux d'optimisation]] - Doit être identique à la version profilée pour que la mesure ait un sens
- [[GCC : [-g] - niveaux d'informations de débogage]] - Rend les piles d'allocation lisibles
- [[LINUX : [ulimit] - consulter et modifier les limites de ressources]] - Le plafond auquel se heurte la consommation mesurée
- [[GDB - débogueur en ligne de commande]] - Complément : inspection du flux là où `massif` mesure l'empreinte
- [[PS2 - allocation VRAM et alignement]] - Même problématique d'alignement et de surcoût, sur une mémoire contrainte

### Dans le contexte de
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/Monitorer les performances d'un programme en C.md`

---
**Tags thématiques** : #valgrind #massif #performance #mémoire #heap #stack #c
