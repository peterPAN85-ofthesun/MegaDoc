---
type: permanent
created: 2026-09-22 15:12
tags:
  - permanent
  - cmake
  - build-system
  - patterns
---

# CMAKE - patrons de CMakeLists.txt

> [!abstract] Concept
> Les trois structures de projet qui couvrent la quasi-totalité des cas de départ en CMake — exécutable plat, bibliothèque en sous-projet, dépendance externe installée — avec le `CMakeLists.txt` correspondant à recopier.


## Explication

Un projet CMake se reconnaît à sa **topologie de dépendances**, pas à son langage. Trois topologies suffisent à démarrer, et chacune impose son squelette de `CMakeLists.txt`.

Le **projet plat** n'a aucune dépendance : un seul `CMakeLists.txt` à la racine, une seule cible. Le **projet à bibliothèque interne** sépare le code réutilisable dans un sous-répertoire qui déclare sa propre cible ; la racine se contente de l'intégrer et de la lier. Le **projet à dépendance externe** consomme une bibliothèque déjà installée sur le système, qu'il faut d'abord localiser.

Les trois partagent le même en-tête obligatoire — [[CMAKE : [cmake_minimum_required] - version minimale et politiques]] puis [[CMAKE : [project] - nom, version et variables générées]] — et la même convention de regroupement des sources dans des variables `SRCS` / `HEADERS`. Les en-têtes listés dans `HEADERS` ne sont pas compilés ; on les déclare pour qu'ils apparaissent dans l'arborescence des IDE générés.

> [!warning] Version minimale
> Les patrons ci-dessous portent `VERSION 3.16` là où le tutoriel d'origine écrivait `VERSION 3.0`. Depuis **CMake 4.0, une compatibilité déclarée sous 3.5 est une erreur fatale** : les `cmake_minimum_required(VERSION 3.0)` des anciens tutoriels ne configurent plus du tout.

Dans les trois cas, le build se lance de la même façon, hors-source :

```bash
cmake -S . -B build
cmake --build build
```


## Patron 1 — Projet simple

Un exécutable, aucune dépendance.

```
.
├── CMakeLists.txt
├── hello.c
├── hello.h
└── main.c
```

```cmake
# Nous voulons un cmake "récent" pour utiliser les dernières fonctionnalités
cmake_minimum_required(VERSION 3.16)

# Notre projet est étiqueté hello
project(hello)

# Crée des variables avec les fichiers à compiler
set(SRCS
    main.c
    hello.c
    )

set(HEADERS
    hello.h
    )

# On indique que l'on veut un exécutable "hello" compilé
# à partir des fichiers décrits par les variables SRCS et HEADERS
add_executable(hello ${SRCS} ${HEADERS})
```


## Patron 2 — Bibliothèque en sous-projet

Le code réutilisable part dans `libhello/`, qui possède son propre `CMakeLists.txt`.

```
.
├── CMakeLists.txt
├── libhello
│   ├── CMakeLists.txt
│   ├── hello.c
│   └── hello.h
└── main.c
```

**`libhello/CMakeLists.txt`** — identique au patron 1, à ceci près que `add_executable()` devient `add_library()` :

```cmake
cmake_minimum_required(VERSION 3.16)

project(libhello)

set(SRCS
    hello.c
    )

set(HEADERS
    hello.h
    )

add_library(hello ${SRCS} ${HEADERS})

# Permet au parent d'écrire simplement #include "hello.h"
target_include_directories(hello PUBLIC .)
```

> [!Note]
> Le nom du binaire indiqué à `add_library()` est « hello », car selon le système, CMake rajoutera « lib » comme préfixe afin de suivre les conventions du système cible. Écrire `add_library(libhello ...)` produirait un `liblibhello.a`.

**`CMakeLists.txt` racine** — deux ajouts par rapport au patron 1 : l'inclusion du sous-projet et la liaison de la bibliothèque.

```cmake
cmake_minimum_required(VERSION 3.16)

project(hello)

# On inclut notre bibliothèque dans le processus de CMake
add_subdirectory(libhello)

set(SRCS
    main.c
    )

# Notre exécutable
add_executable(main ${SRCS})

# Et pour que l'exécutable fonctionne,
# il faut lui indiquer la bibliothèque dont il dépend
target_link_libraries(main hello)
```

L'ordre est contraignant : `add_subdirectory()` doit précéder `target_link_libraries()`, sinon la cible `hello` n'existe pas encore.


## Patron 3 — Dépendance externe

La bibliothèque est déjà installée sur le système ; il faut la trouver avant de l'utiliser.

```
.
├── CMakeLists.txt
└── main.c
```

```cmake
cmake_minimum_required(VERSION 3.16)

project(helloPNG)

set(SRCS
    main.c
    )

# Notre exécutable
add_executable(main ${SRCS})

# Recherche la dépendance externe
find_package (PNG)
if (PNG_FOUND)
  # Une fois la dépendance trouvée, nous l'incluons au projet
  target_include_directories(main PUBLIC ${PNG_INCLUDE_DIR})
  target_link_libraries (main ${PNG_LIBRARY})
else ()
  # Sinon, nous affichons un message
  message(FATAL_ERROR "libpng not found")
endif ()
```

`find_package()` publie des variables aux noms normalisés : `<NOM>_FOUND`, `<NOM>_INCLUDE_DIR(S)`, `<NOM>_LIBRARY/LIBRARIES`. Une version minimale se demande par `find_package(Boost 1.57.0)`.

**Forme moderne équivalente**, quand le paquet expose une cible importée — plus courte, et les répertoires d'include voyagent avec la cible :

```cmake
find_package(PNG REQUIRED)
target_link_libraries(main PRIVATE PNG::PNG)
```


## Compléments transversaux

**Exiger un standard de langage** — à placer après `add_executable`/`add_library` :

```cmake
# Forme granulaire du tutoriel d'origine (obsolète depuis CMake 3.8)
target_compile_features(hello PUBLIC cxx_nullptr)

# Forme moderne recommandée
target_compile_features(hello PUBLIC cxx_std_17)
```

**Injecter la version du build dans le code source** :

```c
/* version.h.in */
#define VERSION_MAJOR "@HELLO_VERSION_MAJOR@"
```

```cmake
project(hello VERSION 1.0.1)

configure_file(
    ${CMAKE_CURRENT_SOURCE_DIR}/src/version.h.in
    ${CMAKE_CURRENT_BINARY_DIR}/version.h
    @ONLY
)
target_include_directories(main PRIVATE ${CMAKE_CURRENT_BINARY_DIR})
```

Le tutoriel d'origine générait dans `${CMAKE_CURRENT_SOURCE_DIR}` : cela écrit un fichier produit au milieu des sources versionnées et casse le build hors-source. La cible correcte est le répertoire de build.


## Cas d'usage

- **Démarrage de projet** : recopier le patron correspondant à la topologie visée plutôt que de repartir d'une page blanche.
- **Migration d'un Makefile** : le patron 2 est la traduction directe d'un `Makefile` qui produisait une archive puis liait un binaire dessus.
- **Diagnostic** : comparer un `CMakeLists.txt` qui échoue au patron de sa catégorie pour repérer la commande manquante.


## Avantages et limites

✅ **Avantages** :
- Couvrent l'essentiel des projets C/C++ de petite et moyenne taille
- Chaque patron est un incrément du précédent : on ajoute une topologie à la fois
- Le passage patron 1 → patron 2 ne demande qu'un `add_executable` transformé en `add_library`

❌ **Limites** :
- Patrons de démarrage : ni installation (`install()`), ni export de paquet, ni tests CTest
- Le patron 3 suppose la dépendance déjà installée ; pour une dépendance récupérée à la configuration, il faut `FetchContent`
- La variable globale `set(SRCS ...)` ne passe pas à l'échelle sur un projet à nombreuses cibles, où l'on liste les sources directement dans chaque `add_executable`/`add_library`


## Connexions
### Notes liées
- [[MOC - CMake]]
- [[CMAKE : [add_executable] - déclarer la cible exécutable]] - la commande centrale du patron 1
- [[CMAKE : [add_library] - déclarer une bibliothèque]] - ce que devient `add_executable` dans le patron 2
- [[CMAKE : [add_subdirectory] - intégrer une bibliothèque en sous-projet]] - l'articulation racine ↔ sous-projet du patron 2
- [[CMAKE : [find_package] - variables de résultat en mode Module]] - le mécanisme du patron 3
- [[CMAKE : [target_include_directories] - propager les répertoires d'en-têtes]] - le `PUBLIC .` qui rend `#include "hello.h"` possible
- [[CMAKE : [configure_file] - générer un en-tête depuis un template .h.in]] - le complément de versionnage
- [[Makefile - automatisation compilation C]] - ce que ces patrons génèrent avec le générateur Unix Makefiles


### Contexte
Ces trois patrons sont les formes canoniques dont les notes de commandes détaillent chaque pièce : les lire ensemble donne la vue d'assemblage que les notes atomiques, par construction, ne portent pas.


## Sources
- Fichier source : `0-Inbox/Archive/CMAKE - Get Started.md`
- Documentation CMake : https://cmake.org/cmake/help/latest/guide/tutorial/index.html

---
**Tags thématiques** : #cmake #build-system #patterns #templates #démarrage
