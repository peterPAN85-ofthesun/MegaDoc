---
type: permanent
created: 2026-09-22 14:47
tags:
  - permanent
  - cmake
  - build-system
  - targets
---

# add_executable - déclarer la cible exécutable

> [!abstract] Concept
> Commande qui crée une **cible** exécutable à partir d'une liste de fichiers sources ; cette cible devient ensuite le point d'accroche de toutes les commandes `target_*`.


## Explication

`add_executable(<nom> <sources...>)` déclare qu'un binaire nommé `<nom>` doit être produit à partir des fichiers listés. CMake ajoute automatiquement le suffixe attendu par la plateforme (`.exe` sous Windows, rien sous Unix). Le nom de la cible est **indépendant du nom du projet** : `project(hello)` ne produit rien tant qu'aucun `add_executable` n'est écrit.

La convention habituelle consiste à regrouper les sources dans des variables via `set()` — typiquement `SRCS` pour les `.c`/`.cpp` et `HEADERS` pour les `.h` — puis à les déréférencer avec `${SRCS}`. Les en-têtes ne sont pas compilés (le compilateur les voit via les `#include`, voir [[C - directives préprocesseur (define include)]]) ; on les liste malgré tout pour qu'ils **apparaissent dans l'arborescence des IDE** générés et pour que CMake les considère dans le calcul des dépendances.

L'important est de comprendre que `add_executable` ne fabrique pas une ligne de commande : il crée un **objet cible** dans le graphe de build. Toutes les commandes qui suivent — [[CMAKE : [target_include_directories] - propager les répertoires d'en-têtes]], [[CMAKE : [target_link_libraries] - lier bibliothèques Qt]], [[CMAKE : [target_compile_features] - exiger des fonctionnalités du compilateur]] — enrichissent cet objet de propriétés. C'est seulement à la génération que CMake résout le graphe et produit les règles Makefile ou Ninja correspondantes. D'où la règle : **toute commande `target_*` doit venir après le `add_executable` de la cible concernée**.

Deux variantes existent : `add_executable(<nom> IMPORTED)` référence un binaire déjà compilé hors du projet, et `add_executable(<alias> ALIAS <cible>)` crée un nom de substitution (souvent avec un namespace, `MonProjet::app`).


## Exemples

```cmake
cmake_minimum_required(VERSION 3.16)
project(hello)

# Regroupement des sources dans des variables
set(SRCS
    main.c
    hello.c
    )

set(HEADERS
    hello.h
    )

# La cible "hello" est construite à partir des deux listes
add_executable(hello ${SRCS} ${HEADERS})
```

```cmake
# Forme directe, sans variable intermédiaire
add_executable(main main.c)

# Les commandes target_* viennent APRÈS
target_compile_features(main PRIVATE c_std_11)
```


## Cas d'usage

- **Binaire principal d'un projet** : le cas nominal, une cible unique liée à des bibliothèques par `target_link_libraries`.
- **Outils annexes** : plusieurs `add_executable` dans le même projet pour un binaire principal plus des utilitaires (générateurs de données, benchmarks).
- **Exécutables de test** : une cible par test, enregistrée ensuite auprès de CTest.


## Avantages et limites

✅ **Avantages** :
- Le suffixe et les conventions de nommage du binaire sont gérés par plateforme
- La cible sert de support à toutes les propriétés de compilation, ce qui évite les variables globales
- Lister les en-têtes améliore nettement l'ergonomie dans les IDE

❌ **Limites** :
- Nom de cible et nom de projet se confondent facilement dans les tutoriels, ce qui masque la distinction
- Les fichiers ajoutés après la configuration ne sont pas détectés si les sources viennent de [[CMAKE : [file GLOB] - collecter fichiers sources automatiquement]]
- L'ordre compte : un `target_link_libraries` placé avant son `add_executable` échoue


## Connexions
### Notes liées
- [[CMAKE : [add_library] - déclarer une bibliothèque]] - la commande jumelle, pour produire une archive ou un objet partagé
- [[CMAKE : [target_link_libraries] - lier bibliothèques Qt]] - attache les dépendances à la cible créée ici
- [[CMAKE : [file GLOB] - collecter fichiers sources automatiquement]] - alternative au `set()` manuel des sources
- [[ELF - Executable and Linkable Format]] - le format de l'artefact effectivement produit sous Linux
- [[CMAKE - patrons de CMakeLists.txt (simple, sous-projet, dépendance externe)]] - le squelette complet où cette commande prend place



### Contexte
`add_executable` est le point d'entrée du modèle par cibles de CMake moderne : on ne configure plus des variables globales de compilation, on décore des cibles. Comprendre cela rend lisible tout le reste de l'API `target_*`.


## Sources
- Fichier source : `0-Inbox/Archive/CMAKE - Get Started.md`
- Documentation CMake : add_executable()

---
**Tags thématiques** : #cmake #build-system #targets #compilation
