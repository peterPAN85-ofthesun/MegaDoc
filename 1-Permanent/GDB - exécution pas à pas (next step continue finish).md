---
type: permanent
created: 2026-10-12 14:49
tags:
  - permanent
  - gdb
  - debug
  - c
---

# GDB - exécution pas à pas (next step continue finish)

> [!abstract] Concept
> Quatre commandes suffisent à piloter l'avancée d'un programme arrêté : `next` enjambe un appel, `step` y entre, `finish` en sort, `continue` relance jusqu'au prochain point d'arrêt.

## Explication

La distinction fondamentale est celle entre `next` et `step`, et elle ne porte que sur les **appels de fonction**. Sur une ligne ordinaire, les deux font exactement la même chose : exécuter la ligne et s'arrêter à la suivante. Sur une ligne qui appelle une fonction, `next` (`n`) exécute l'appel entier d'un bloc et s'arrête après, tandis que `step` (`s`) descend dans le corps de la fonction appelée. C'est le choix qu'on fait en permanence : *je fais confiance à cet appel* → `next`, *le bogue est peut-être dedans* → `step`.

`step` ne descend que dans du code **compilé avec informations de débogage**. Un `step` sur `printf()` ne plonge donc pas dans la libc installée sans symboles : il se comporte comme un `next`. C'est un comportement voulu, qui évite de se perdre dans les entrailles du système.

`finish` est la sortie de secours : il reprend l'exécution jusqu'au retour de la fonction courante, puis affiche la **valeur de retour** — ce qui en fait aussi un moyen rapide de connaître ce qu'une fonction a produit sans ajouter de `printf`. `continue` (`c`), lui, rend la main complètement : le programme court jusqu'au point d'arrêt suivant, ou jusqu'à sa fin s'il n'y en a plus.

## Exemples

### Les quatre mouvements

| Commande | Abrév. | Effet |
|---|---|---|
| `next` | `n` | Ligne suivante, **sans entrer** dans les appels |
| `step` | `s` | Ligne suivante, **en entrant** dans les appels (si compilés avec `-g`) |
| `finish` | — | Jusqu'au retour de la fonction courante, affiche la valeur de retour |
| `continue` | `c` | Jusqu'au prochain point d'arrêt |

### Scénario typique

```
Breakpoint 1, main () at main.c:10
10          int r = compute(tab, n);
(gdb) n                 # j'enjambe compute(), r est calculé
11          printf("%d\n", r);
(gdb) s                 # cette fois j'entre dans printf... → pas de symboles, comporte comme n
(gdb) c                 # je relance
```

### Sortir d'une fonction où l'on est entré par erreur

```
(gdb) s
compute (tab=0x7ffd..., n=8) at utils.c:4
(gdb) finish
Run till exit from #0  compute (...) at utils.c:4
0x0000... in main () at main.c:10
Value returned is $1 = 36      ← la valeur de retour, gratuitement
```

### Avancer de plusieurs lignes

```
(gdb) next 5        # cinq « next » d'affilée
(gdb) until 30      # continue jusqu'à dépasser la ligne 30 (pratique pour sortir d'une boucle)
```

## Cas d'usage

- **Suivre un calcul** : `next` en boucle, en vérifiant une variable à chaque arrêt.
- **Descendre vers le bogue** : `step` uniquement sur l'appel soupçonné, `next` sur tous les autres.
- **Sortir d'une boucle sans poser de point d'arrêt** : `until <ligne après la boucle>`.
- **Connaître une valeur de retour** : `finish` au lieu d'instrumenter le code.

## Avantages et inconvénients

✅ **Avantages** :
- Grain d'avancement choisi à chaque arrêt, sans recompilation.
- `finish` donne la valeur de retour, information difficile à obtenir autrement.

❌ **Inconvénients** / Limites :
- Fastidieux sur une boucle longue : préférer un point d'arrêt conditionnel.
- Trompeur si le binaire est optimisé (lignes réordonnées ou fusionnées).
- `step` ne descend pas dans le code sans symboles, ce qui peut surprendre.

## Connexions

### Notes liées
- [[GDB : [break] - poser et gérer les points d'arrêt]] - Définit les arrêts entre lesquels `continue` navigue
- [[GDB - débogage inverse (target record-full)]] - Le pas-à-pas dans l'autre sens, quand on est allé trop loin
- [[GDB : [backtrace] - lire la pile d'appels]] - Pour savoir où l'on a atterri après un `step`
- [[GDB - débogueur en ligne de commande]] - Le cycle général d'une session
- [[GCC : [-O] - niveaux d'optimisation]] - Explique pourquoi le pas-à-pas devient incohérent au-delà de `-O0`

### Dans le contexte de
- [[C - fonctions (déclaration et appel)]] - La notion d'appel sur laquelle repose la distinction `next`/`step`
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/GDB.md`

---
**Tags thématiques** : #gdb #debug #pas-à-pas #c
