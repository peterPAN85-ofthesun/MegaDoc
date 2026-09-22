
# 1 -Structure du projet

## a) Simple

```
.
├── CMakeLists.txt
├── hello.c
├── hello.h
└── main.c
```

Le `CMakeLists.txt`

```CMake
# Nous voulons un cmake "récent" pour utiliser les dernières fonctionnalités
cmake_minimum_required(VERSION 3.0)

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

# On indique que l'on veut un exécutable "hello" compilé à partir des fichiers décrits par les variables SRCS et HEADERS
add_executable(hello ${SRCS} ${HEADERS})
```

## b) Bibliothèque en sous projet

```
.
├── CMakeLists.txt
├── libhello
│   ├── CMakeLists.txt
│   ├── hello.c
│   └── hello.h
└── main.c
```

Le `CMakeList.txt` à l'intérieur du dossier `libhello.h` : remplace le `add_executable()` par `add_library()`

```CMake
# Nous voulons un cmake "récent" pour utiliser les dernières fonctionnalités
cmake_minimum_required(VERSION 3.0)

# Notre projet est étiqueté libhello
project(libhello)

# Crée des variables avec les fichiers à compiler
set(SRCS
    hello.c
    )
    
set(HEADERS
    hello.h
    )

add_library(hello ${SRCS} ${HEADERS})
```

>[!Note]
>Le nom du binaire indiqué à add_library() est « hello », car selon le système, CMake rajoutera « lib » comme préfixe afin de suivre les conventions du système cible.

Pour le `CMakeLists.txt` principal, on ajoute :
- Inclusion d'un sous projet pour compiler la bibliothèque `add_subdirectory`
- liaison de la bibliothèque avec le programme `target_link_libraries`

```CMake
# Nous voulons un cmake "récent" pour utiliser les dernières fonctionnalités
cmake_minimum_required(VERSION 3.0)

# Notre projet est étiqueté hello
project(hello)

# On inclut notre bibliothèque dans le processus de CMake
add_subdirectory(libhello)

# Crée des variables avec les fichiers à compiler
set(SRCS
    main.c
    )
    
# Notre exécutable
add_executable(main ${SRCS})

# Et pour que l'exécutable fonctionne, il faut lui indiquer la bibliothèque dont il dépend
target_link_libraries(main hello)
```

>[!Note]
>Si on souhaite juste écrire un `#include "hello.h"` dans le fichier `main.c`, vous pouvez rajouter `target_include_directories(libhello PUBLIC .)` à la fin du fichier `CMakeLists.txt` du dossier `libhello`

## c) Bibliothèque externe

```
.
├── CMakeLists.txt
└── main.c
```

On doit indiquer la dépendance à la librairie `libpng`. Pour ce faire, on utilise la commande `find_package()`. Cette commande fini par définir plusieurs variables :
- `NOM_LIB_FOUND` indique si la bibliothèque a été trouvée (VRAI/FAUX)
- `NOM_LIB_INCLUDE_DIR` et `NOM_LIB_INCLUDE_DIRS` indique les répertoires à inclure pour trouver les fichiers d'entêtes
- `NOM_LIB_LIBRARY` et `NOM_LIB_LIBRARIES` indique les bibliothèques à ajouter à l'édition de liens

```CMake
# Nous voulons un cmake "récent" pour utiliser les dernières fonctionnalités
cmake_minimum_required(VERSION 3.0)

# Notre projet est étiqueté hello
project(helloSDL)

# Crée des variables avec les fichiers à compiler
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

>[!Note]
>Il est possible de rechercher une version spécifique avec la syntaxe  `find_package(Boost 1.57.0)`

# 2 - En vrac

## a) activation du C++11/C++14

Certains compilateurs doivent être activé en ajoutant une option supplémentaire lors de la compilation.

Notamment : pour vérifier si le compilateur supporte le `nullptr`
```CMake
# Cette ligne doit être placée après les add_executable/add_library
target_compile_features(hello PUBLIC cxx_nullptr)
```

On peut retrouver la liste des fonctionnalités du C++ vérifiable à travers cette fonction : [Documentation](http://www.cmake.org/cmake/help/v3.1/prop_gbl/CMAKE_CXX_KNOWN_FEATURES.html)

## b) Passer des variables de CMake au code source

**Cas d'usage :** Faire passer la version d'un build indiqué par CMake

On écris un fichier qui servira de motif : `version.h.in`
```version.h.in
#define VERSION_MAJOR "@HELLO_VERSION_MAJOR@"
```

>[!Note]
>un fichier `.h.in` est un template d'en-tête. Il sert à générer un `.h` qui écrasé à chaque nouvelle configuration.

Ensuite, on indique dans le CMakeLists.txt

```CMake
project(hello VERSION 1.0.1)

configure_file(${CMAKE_CURRENT_SOURCE_DIR}/src/version.h.in ${CMAKE_CURRENT_SOURCE_DIR}/version.h)
```


>[!Note]
>Ici, nous utilisons les arguments de la fonction [project()](http://www.cmake.org/cmake/help/v3.0/command/project.html) afin de définir la version de notre projet. À partir de cette information, CMake va définir les variables : <NOM-DU-PROJET>_VERSION_MAJOR, <NOM-DU-PROJET>_VERSION_MINOR, <NOM-DU-PROJET>_VERSION_PATCH (entre autres).

