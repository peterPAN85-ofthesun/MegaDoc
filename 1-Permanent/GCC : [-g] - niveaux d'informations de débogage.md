---
type: permanent
created: 2026-09-29 16:40
tags:
  - permanent
  - gcc
  - compilation
  - debug
  - build
---

# GCC : [-g] - niveaux d'informations de débogage

> [!abstract] Concept
> `-g` fait produire au compilateur des tables DWARF reliant le binaire au code source ; `-g0` n'en génère aucune, `-g2` (le défaut de `-g`) couvre les variables locales, `-g3` ajoute les définitions de macros.

## Explication

Le code machine ne sait rien des noms de variables ni des numéros de ligne. Les informations de débogage sont des **sections supplémentaires** (`.debug_info`, `.debug_line`…) ajoutées à l'objet et au binaire : elles font correspondre une adresse à une ligne de source, un emplacement de pile à un nom de variable, une plage d'adresses à une fonction. Sans elles, `gdb` n'affiche que des adresses et `backtrace` que des offsets.

Le niveau se choisit par ce qu'on veut pouvoir inspecter. `-g1` ne décrit que les fonctions et les variables externes : suffisant pour obtenir une *backtrace* lisible sur un crash, mais **aucune information sur les variables locales**. `-g2`, obtenu en écrivant simplement `-g`, ajoute locales, `typedef`, classes, `namespace` et fonctions template — c'est le niveau de travail normal. `-g3` y ajoute les définitions de macros, ce qui permet d'évaluer une macro directement dans le débogueur (`print MAX(a,b)`) au lieu de devoir la déplier mentalement.

Ces informations ne changent **ni le code généré ni les performances** : elles ne font que grossir le fichier. Rien n'interdit donc `-O2 -g` en production — c'est même la pratique recommandée, quitte à extraire ensuite les symboles dans un fichier séparé (`objcopy --only-keep-debug`) et à livrer un binaire allégé par `strip`. En revanche, combiner `-g` avec `-O2` rend le pas-à-pas déroutant, d'où le couple `-g3 -O0` en développement et l'exigence de `-g` pour que [[GCC : [-fsanitize] - instrumentation à l'exécution|`-fsanitize=address`]] rapporte des numéros de ligne.

## Exemples

### Les niveaux

| Option | Contenu |
|---|---|
| `-g0` | Aucune information de débogage. |
| `-g1` | Minimum : description des fonctions et variables externes. **Aucune info sur les variables locales.** |
| `-g` = `-g2` | Niveau par défaut : variables locales, `typedef`, `namespace`, classes, fonctions template. |
| `-g3` | Ajoute les définitions de macros. |

### Ce que change `-g3`

```c
#define AREA(w, h) ((w) * (h))
int main(void) { int w = 3, h = 4; return AREA(w, h); }
```

```
(gdb) print AREA(w, h)
-g2 → No symbol "AREA" in current context.
-g3 → $1 = 12
```

### Peser le coût

```bash
$ gcc -O2      prog.c -o prog && ls -l prog   #  16 K
$ gcc -O2 -g3  prog.c -o prog && ls -l prog   #  48 K — même code machine
$ strip prog                                  # retour à 16 K
```

## Cas d'usage

- **Développement** : `-g3 -O0` pour un pas-à-pas fidèle et des macros évaluables.
- **Production avec post-mortem** : `-O2 -g`, symboles extraits dans un fichier `.debug` séparé pour analyser les *core dumps* sans alourdir la livraison.
- **Sanitizers** : `-g` est requis pour que `-fsanitize=address` désigne fichier et ligne au lieu d'adresses brutes.

## Avantages et inconvénients

✅ **Avantages** :
- Aucun impact sur le code généré ni sur les performances.
- Rend exploitables `gdb`, `valgrind`, les sanitizers et les *core dumps*.

❌ **Inconvénients** / Limites :
- Binaires nettement plus volumineux (souvent x2 à x5).
- Les tables DWARF exposent noms de fichiers, de variables et structure du code — à retirer avec `strip` sur une livraison fermée.
- Avec `-O2`, les informations restent partiellement trompeuses (variables « optimized out »).

## Connexions

### Notes liées
- [[GCC : [-O] - niveaux d'optimisation]] - L'option avec laquelle `-g` doit être arbitrée
- [[GCC : [-fsanitize] - instrumentation à l'exécution]] - Exige `-g` pour des rapports lisibles
- [[C - compilation et linkage]] - L'étape qui produit ces sections
- [[ELF - Executable and Linkable Format]] - Où vivent les sections `.debug_*`
- [[PS2SDK - breakpoints matériels libeedebug]] - Le débogage quand `gdb` n'est pas disponible

### Dans le contexte de
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/Créer sa librairie en C-C++.md` (chapitre 3b)

---
**Tags thématiques** : #gcc #debug #compilation #gdb #dwarf
