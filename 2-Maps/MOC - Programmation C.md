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
- [[C - compilation et linkage]] - gcc, étapes de compilation
- [[GCC - driver et non compilateur]] - Les quatre étapes et qui reçoit quelle option
- [[C - en-tête et bibliothèque (déclarer vs définir)]] - La distinction qui explique la moitié des erreurs de build
- [[ELF - Executable and Linkable Format]] - Le format du binaire produit : sections, segments, table des symboles

### Édition de liens
- [[C - convention -lfoo et recherche des archives]] - Comment `ld` trouve `libfoo.a`
- [[C - ordre de résolution des archives au link]] - Objets d'abord, bibliothèques ensuite, `--start-group`

### Make
- [[Makefile - automatisation compilation C]] - Règles, variables, automatisation
- [[MAKE - but par défaut DEFAULT_GOAL]] - Le piège de l'`include` placé avant `all:`

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
21. [[GCC - driver et non compilateur]]
22. [[C - en-tête et bibliothèque (déclarer vs définir)]]
23. [[C - convention -lfoo et recherche des archives]]
24. [[C - ordre de résolution des archives au link]]
25. [[MAKE - but par défaut DEFAULT_GOAL]]
26. [[IEEE-754 - simple précision 32 bits]]
27. [[C - qualificatif volatile]]

---

## 📖 Ressources

### Sources
- OpenClassrooms : https://openclassrooms.com/fr/courses/19980-apprenez-a-programmer-en-c
- Fichiers source : `Archive/Apprendre le C/`, `0-Inbox/PS2SDK.md` (chapitre 7)

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

- **Total de notes** : 33 notes permanentes
- **Date de création** : 2025-11-13
- **Dernière mise à jour** : 2026-08-26

---

**Tags thématiques** : #c #programmation #moc #index #langage-c
