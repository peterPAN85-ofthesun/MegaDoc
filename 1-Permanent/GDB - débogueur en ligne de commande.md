---
type: permanent
created: 2026-10-12 14:49
tags:
  - permanent
  - gdb
  - debug
  - c
  - outils
---

# GDB - débogueur en ligne de commande

> [!abstract] Concept
> `gdb` prend le contrôle de l'exécution d'un programme compilé avec informations de débogage : il l'arrête où on veut, montre l'état de la mémoire et des variables, et laisse reprendre instruction par instruction.

## Explication

Un débogueur n'est pas un afficheur de `printf` amélioré : c'est un **processus superviseur**. Via `ptrace`, `gdb` lance le programme comme son enfant, garde le droit de l'interrompre à tout moment, de lire et d'écrire sa mémoire et ses registres. Tout ce qu'il affiche de lisible — noms de variables, numéros de ligne, types — vient des tables DWARF produites par [[GCC : [-g] - niveaux d'informations de débogage|`-g`]]. Sans `-g`, `gdb` fonctionne toujours mais ne parle plus qu'en adresses et en offsets.

Le second prérequis est l'**optimisation**. À `-O2`, le compilateur réordonne les instructions, fusionne des lignes, garde des variables en registre ou les supprime : le pas-à-pas saute alors de façon incohérente et `print` répond `<optimized out>`. On compile donc pour le débogage avec [[GCC : [-O] - niveaux d'optimisation|`-O0`]] (ou `-Og`, qui conserve les optimisations compatibles avec le débogage).

La session suit toujours le même cycle : on pose des [[GDB : [break] - poser et gérer les points d'arrêt|points d'arrêt]], on lance avec `run`, et à chaque arrêt on inspecte ([[GDB : [print] - afficher une valeur et choisir son format|`print`]], [[GDB : [backtrace] - lire la pile d'appels|`backtrace`]]) puis on [[GDB - exécution pas à pas (next step continue finish)|avance pas à pas]]. `gdb` est modal : les commandes n'ont de sens qu'une fois le programme arrêté quelque part.

## Exemples

### Ouvrir une session

```shell
$ gcc -g3 -O0 main.c -o a.out    # informations de débogage, aucune optimisation
$ gdb ./a.out
(gdb) r                          # run : lance le programme
(gdb) q                          # quit
```

### Arguments du programme

```
(gdb) show args              # liste d'arguments que « run » utilisera
(gdb) set args -v fichier.txt
(gdb) run                    # équivaut à ./a.out -v fichier.txt
```

> [!warning] `show args` ≠ `info args`
> `show args` affiche les arguments de **ligne de commande** passés au programme. Pour voir les paramètres de la fonction dans laquelle on est arrêté, c'est `info args`.

### Rendre la main au programme

```
(gdb) detach     # gdb se détache : le processus continue seul jusqu'à sa fin
```

Utile pour laisser le programme produire ses sorties de fin d'exécution — typiquement le rapport de [[GCC : [-fsanitize] - instrumentation à l'exécution|`-fsanitize=leak`]], émis à la terminaison du processus.

## Cas d'usage

- **Crash (`SIGSEGV`)** : lancer sous `gdb`, laisser planter, lire la pile d'appels pour savoir *où* et *avec quoi*.
- **Résultat faux** : poser un point d'arrêt en amont du calcul et suivre les valeurs pas à pas.
- **Code inconnu** : s'arrêter dans une fonction pour observer la forme réelle des données qui y entrent.

## Avantages et inconvénients

✅ **Avantages** :
- Aucune modification du code source, contrairement aux `printf` de débogage.
- Permet d'inspecter *et* de modifier l'état en cours d'exécution.
- Scriptable (`gdb -x script.gdb`, `.gdbinit`) et intégrable aux éditeurs.

❌ **Inconvénients** / Limites :
- Exige une compilation dédiée `-g -O0` : on ne débogue pas le binaire de production tel quel.
- Mal adapté aux bogues de synchronisation : l'arrêt change le *timing* et fait disparaître la course.
- Incompatible avec le binaire optimisé livré (variables disparues, lignes fusionnées).

## Connexions

### Notes liées
- [[GCC : [-g] - niveaux d'informations de débogage]] - Produit les tables DWARF sans lesquelles `gdb` est aveugle
- [[GCC : [-O] - niveaux d'optimisation]] - Doit être baissé à `-O0`/`-Og` pour un pas-à-pas fidèle
- [[GCC : [-fsanitize] - instrumentation à l'exécution]] - Approche complémentaire : détection automatique plutôt qu'inspection manuelle
- [[VALGRIND : [massif] - profiler la consommation mémoire]] - Même famille d'outillage, mais pour la mémoire plutôt que le flux
- [[PS2SDK - breakpoints matériels libeedebug]] - Ce qu'on fait quand `gdb` n'est pas disponible sur la cible

### Dans le contexte de
- [[C - compilation et linkage]] - L'étape qui doit embarquer les symboles
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/GDB.md`

---
**Tags thématiques** : #gdb #debug #c #outils #ptrace
