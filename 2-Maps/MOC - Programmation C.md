---
type: moc
created: 2025-11-13 00:40
tags:
  - moc
  - index
  - programmation
  - c
---

# MOC - Programmation C

> [!abstract] Vue d'ensemble
> Map of Content (MOC) regroupant toutes les notes permanentes sur le langage de programmation C : concepts fondamentaux, structures de contrôle, pointeurs, I/O, et outils de build.

## 🎯 Introduction

Le C est un langage de programmation impératif créé dans les années 1970, encore largement utilisé pour la programmation système, embarquée et les applications nécessitant un contrôle fin de la mémoire.

### Note principale
- [[C - langage de programmation]] - Vue d'ensemble et caractéristiques

---

## 📦 Fondamentaux

### Types et variables
- [[C - types de données primitifs]] - int, char, float, double, long
- [[C - variables (déclaration et portée)]] - Déclaration, const, static, globales/locales
- [[C - conversion de types (casting)]] - Cast explicite et implicite
- [[C - opérateurs arithmétiques]] - +, -, *, /, %, ++, --

---

## 🔀 Structures de contrôle

### Conditions
- [[C - conditions (if else switch)]] - if, else, switch, opérateurs de comparaison

### Boucles
- [[C - boucles (while for do-while)]] - while, for, do-while
- [[C - break et continue]] - Contrôle du flux dans les boucles

---

## ⚙️ Fonctions et organisation

### Fonctions
- [[C - fonctions (déclaration et appel)]] - Prototypes, paramètres, return
- [[C - organisation multi-fichiers (headers)]] - .h, .c, include guards

---

## 🧠 Pointeurs et mémoire

### Pointeurs
- [[C - pointeurs (concepts de base)]] - &, *, NULL, déréférencement
- [[C - relation pointeurs-tableaux]] - Équivalences et arithmétique

### Tableaux et mémoire
- [[C - tableaux statiques]] - Tableaux de taille fixe
- [[C - allocation dynamique (malloc free)]] - malloc, free, calloc, realloc

---

## 📝 Chaînes de caractères

- [[C - chaînes de caractères (strings)]] - char[], '\0', manipulation de base
- [[C - librairie string.h]] - strlen, strcpy, strcat, strcmp

---

## 🏗️ Structures de données

- [[C - structures (struct)]] - Définition, typedef, accès aux champs
- [[C - énumérations (enum)]] - États et constantes nommées

---

## ⚡ Préprocesseur

- [[C - directives préprocesseur (define include)]] - Macros, inclusions, compilation conditionnelle
- [[C - macros prédéfinies]] - __LINE__, __FILE__, __DATE__, __TIME__

---

## 💾 Entrées-sorties

### Console
- [[C - entrées-sorties console (stdio.h)]] - printf, scanf, formats

### Fichiers
- [[C - manipulation de fichiers]] - fopen, fclose, fprintf, fscanf, fread, fwrite

---

## 🔧 Outils et build

### Compilation
- [[C - compilation et linkage]] - Les quatre étapes (`cpp`, `cc1`, `as`, `ld`) et qui reçoit quelle option
- [[C - en-tête et bibliothèque (déclarer vs définir)]] - La distinction qui explique la moitié des erreurs de build
- [[ELF - Executable and Linkable Format]] - Le format du binaire produit : sections, segments, table des symboles

### Édition de liens
- [[C - convention -lfoo et recherche des archives]] - Comment `ld` trouve `libfoo.a`
- [[C - ordre de résolution des archives au link]] - Objets d'abord, bibliothèques ensuite, `--start-group`

### Make
- [[Makefile - automatisation compilation C]] - Règles, variables, automatisation
- [[MAKE - but par défaut DEFAULT_GOAL]] - Le piège de l'`include` placé avant `all:`
- [[GCC : [-MMD -MP] - génération des fichiers de dépendances]] - Recompiler juste ce qu'il faut quand un en-tête change

### Options GCC
- [[GCC : [-O] - niveaux d'optimisation]] - `-O0` à `-O3`, `-Os`, `-Og` : vitesse, taille, débogage
- [[GCC : [-g] - niveaux d'informations de débogage]] - `-g0` à `-g3`, tables DWARF
- [[GCC : [-fsanitize] - instrumentation à l'exécution]] - `address`, `leak`, `undefined`
- [[GCC : [-fPIC] - code indépendant de la position]] - Obligatoire pour produire un `.so`
- [[GCC : [-fvisibility] - visibilité des symboles]] - `hidden` par défaut, API désignée explicitement

### Outillage de projet
- [[GIT : _.gitignore_ - artefacts de compilation C et C++]] - Ce que le build régénère ne se versionne pas

---

## 📦 Créer une bibliothèque

### Choix de conception
- [[C - bibliothèque statique vs bibliothèque partagée]] - `.a` vs `.so` : autonomie contre mise à jour centralisée
- [[ABI - Application Binary Interface]] - Le contrat binaire, distinct de l'API
- [[C - type opaque (encapsulation et stabilité ABI)]] - Déclarer sans définir pour rester libre d'évoluer

### Structure du projet
- [[C - arborescence d'un projet de bibliothèque]] - `include/foo/`, `src/`, `tests/`, `build/`
- [[C - en-tête public vs en-tête privé]] - Ce qu'on promet à l'utilisateur, ce qu'on garde
- [[C - en-tête compatible C et C++ (extern C)]] - Rendre la bibliothèque consommable depuis du C++

### Build et diffusion
- [[C - Makefile de bibliothèque]] - `ar rcs`, `-shared`, `PREFIX` et `DESTDIR`
- [[GIT : _.gitignore_ - artefacts de compilation C et C++]] - Garder le dépôt propre

---

## 🚀 Concepts avancés

- [[C - programmation orientée objet]] - Simulation de POO avec struct + pointeurs de fonctions
- [[IEEE-754 - simple précision 32 bits]] - Représentation binaire des flottants, convertir vs réinterpréter
- [[C - qualificatif volatile]] - Empêche l'optimisation d'accès à une variable modifiable hors du flux normal (registre matériel, ISR, DMA)

---

## 📚 Librairies standard

### stdio.h
- [[C - entrées-sorties console (stdio.h)]] - I/O console
- [[C - manipulation de fichiers]] - I/O fichiers

### string.h
- [[C - librairie string.h]] - Manipulation de chaînes

### stdlib.h
- [[C - allocation dynamique (malloc free)]] - Gestion mémoire

---

## 🔗 Parcours d'apprentissage recommandé

### Niveau 1 : Débutant
1. [[C - langage de programmation]]
2. [[C - types de données primitifs]]
3. [[C - variables (déclaration et portée)]]
4. [[C - opérateurs arithmétiques]]
5. [[C - conditions (if else switch)]]
6. [[C - boucles (while for do-while)]]
7. [[C - entrées-sorties console (stdio.h)]]

### Niveau 2 : Intermédiaire
8. [[C - fonctions (déclaration et appel)]]
9. [[C - tableaux statiques]]
10. [[C - chaînes de caractères (strings)]]
11. [[C - structures (struct)]]
12. [[C - organisation multi-fichiers (headers)]]

### Niveau 3 : Avancé
13. [[C - pointeurs (concepts de base)]]
14. [[C - relation pointeurs-tableaux]]
15. [[C - allocation dynamique (malloc free)]]
16. [[C - manipulation de fichiers]]
17. [[C - directives préprocesseur (define include)]]

### Niveau 4 : Expert
18. [[C - programmation orientée objet]]
19. [[C - compilation et linkage]]
20. [[Makefile - automatisation compilation C]]
21. [[C - en-tête et bibliothèque (déclarer vs définir)]]
22. [[C - convention -lfoo et recherche des archives]]
23. [[C - ordre de résolution des archives au link]]
24. [[MAKE - but par défaut DEFAULT_GOAL]]
25. [[IEEE-754 - simple précision 32 bits]]
26. [[C - qualificatif volatile]]

### Niveau 5 : Créer et diffuser une bibliothèque
27. [[C - bibliothèque statique vs bibliothèque partagée]]
28. [[C - arborescence d'un projet de bibliothèque]]
29. [[C - en-tête public vs en-tête privé]]
30. [[ABI - Application Binary Interface]]
31. [[C - type opaque (encapsulation et stabilité ABI)]]
32. [[C - en-tête compatible C et C++ (extern C)]]
33. [[C - Makefile de bibliothèque]]
34. [[GCC : [-O] - niveaux d'optimisation]]
35. [[GCC : [-g] - niveaux d'informations de débogage]]
36. [[GCC : [-fsanitize] - instrumentation à l'exécution]]
37. [[GCC : [-fPIC] - code indépendant de la position]]
38. [[GCC : [-fvisibility] - visibilité des symboles]]
39. [[GCC : [-MMD -MP] - génération des fichiers de dépendances]]
40. [[GIT : _.gitignore_ - artefacts de compilation C et C++]]

---

## 📖 Ressources

### Sources
- OpenClassrooms : https://openclassrooms.com/fr/courses/19980-apprenez-a-programmer-en-c
- Fichiers source : `Archive/Apprendre le C/`, `0-Inbox/PS2SDK.md` (chapitre 7), `0-Inbox/Archive/Créer sa librairie en C-C++.md`

### Domaines connexes
- [[MOC - PS2 Homebrew]] - Instanciation de ces mécanismes en cross-compilation MIPS
- [[MOC - CMake]] - Alternative à Make pour l'automatisation de build
- [[MOC - C++ POO]] - Le prolongement objet du langage, mêmes règles de compilation

### Documentation officielle
- C Standard Library Reference
- GCC Documentation
- GNU Make Manual

---

## 🎯 Statistiques

- **Total de notes** : 46 notes permanentes
- **Date de création** : 2025-11-13
- **Dernière mise à jour** : 2026-09-29

---

**Tags thématiques** : #c #programmation #moc #index #langage-c
