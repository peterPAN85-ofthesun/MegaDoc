---
type: permanent
created: 2026-09-22 14:47
tags:
  - permanent
  - cmake
  - build-system
  - architecture
---

# add_subdirectory - intégrer une bibliothèque en sous-projet

> [!abstract] Concept
> Commande qui fait entrer un répertoire possédant son propre `CMakeLists.txt` dans le build courant, rendant ses cibles directement utilisables par le projet parent.


## Explication

`add_subdirectory(<répertoire>)` demande à CMake d'exécuter le `CMakeLists.txt` situé dans `<répertoire>` **avant de poursuivre** le fichier courant. Les cibles qui y sont déclarées — typiquement une bibliothèque créée par [[CMAKE : [add_library] - déclarer une bibliothèque]] — rejoignent le graphe global et deviennent référençables par leur nom dans le projet parent. Aucune déclaration supplémentaire n'est nécessaire : il suffit ensuite d'écrire `target_link_libraries(main hello)`.

La structure canonique met un `CMakeLists.txt` racine qui décrit l'exécutable, et un sous-répertoire `libhello/` qui décrit la bibliothèque avec son propre `cmake_minimum_required()` et son propre `project()`. Le sous-projet reste ainsi **compilable de manière autonome** : on peut entrer dans `libhello/` et lancer CMake dessus directement, ce qui est précieux pour tester ou publier la bibliothèque séparément.

Côté portée des variables, chaque sous-répertoire crée un **scope enfant** : il hérite en lecture des variables du parent, mais ses propres `set()` n'y remontent pas (sauf `set(... PARENT_SCOPE)`). Les cibles, elles, sont globales — c'est précisément ce qui rend la commande utile. Cette asymétrie est la source d'erreur la plus courante : on modifie une variable dans le sous-répertoire en espérant influencer le parent, sans effet.

L'ordre d'appel compte : `add_subdirectory(libhello)` doit précéder tout `target_link_libraries(main hello)`, sans quoi la cible `hello` n'existe pas encore. La commande accepte un second argument pour choisir le répertoire de build correspondant, utile quand le sous-répertoire source est hors de l'arborescence du projet.


## Exemples

```
.
├── CMakeLists.txt
├── libhello
│   ├── CMakeLists.txt
│   ├── hello.c
│   └── hello.h
└── main.c
```

```cmake
# CMakeLists.txt racine
cmake_minimum_required(VERSION 3.16)
project(hello)

# On intègre le sous-projet : la cible "hello" devient disponible
add_subdirectory(libhello)

set(SRCS
    main.c
    )

add_executable(main ${SRCS})

# Et on déclare la dépendance
target_link_libraries(main hello)
```

```cmake
# libhello/CMakeLists.txt — autonome
cmake_minimum_required(VERSION 3.16)
project(libhello)

add_library(hello hello.c hello.h)

# Expose ses en-têtes à qui la lie
target_include_directories(hello PUBLIC .)
```


## Cas d'usage

- **Découpage modulaire** : un dépôt, un exécutable, plusieurs bibliothèques internes, chacune dans son sous-répertoire.
- **Dépendance vendorée** : intégrer une bibliothèque tierce copiée dans `third_party/` ou ajoutée en sous-module Git, sans passer par `find_package`.
- **Monorepo** : une racine qui agrège plusieurs projets indépendants, chacun restant configurable seul.


## Avantages et limites

✅ **Avantages** :
- La dépendance est compilée avec exactement les mêmes options et le même compilateur que le parent
- Aucune installation préalable requise, contrairement à [[CMAKE : [find_package] - variables de résultat en mode Module]]
- Le sous-projet reste utilisable de façon autonome s'il déclare son propre `project()`

❌ **Limites** :
- Les variables ne remontent pas au parent, ce qui piège régulièrement
- Un sous-projet tiers mal écrit peut polluer le parent (options globales, `CMAKE_CXX_FLAGS` modifiés, cibles aux noms génériques)
- Le code de la dépendance est recompilé pour chaque projet qui l'intègre, au contraire d'une bibliothèque installée sur le système


## Connexions
### Notes liées
- [[CMAKE : [add_library] - déclarer une bibliothèque]] - la cible que le sous-répertoire déclare habituellement
- [[CMAKE : [target_include_directories] - propager les répertoires d'en-têtes]] - ce qui permet au parent d'écrire un simple `#include "hello.h"`
- [[CMAKE : [find_package] - variables de résultat en mode Module]] - l'approche alternative, pour une dépendance déjà installée
- [[C - organisation multi-fichiers (headers)]] - le découpage source que cette structure reflète
- [[CMAKE - patrons de CMakeLists.txt (simple, sous-projet, dépendance externe)]] - le squelette complet où cette commande prend place



### Contexte
`add_subdirectory` matérialise dans le build l'arborescence logique du code : chaque module a son fichier de configuration, et le projet racine se contente d'assembler.


## Sources
- Fichier source : `0-Inbox/Archive/CMAKE - Get Started.md`
- Documentation CMake : add_subdirectory()

---
**Tags thématiques** : #cmake #build-system #architecture #modularité
