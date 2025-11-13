---
type: permanent
created: 2025-11-11 00:00
tags:
  - permanent
  - cmake
  - file-management
---

# file(GLOB) pour sources CMake

> [!abstract] Concept
> Commande CMake qui collecte automatiquement des fichiers sources en utilisant des patterns de globbing, évitant de lister manuellement chaque fichier.


## Explication

Dans un projet CMake, il faut spécifier tous les fichiers sources à compiler. Plutôt que de lister manuellement chaque fichier, `file(GLOB)` permet de les collecter automatiquement avec des patterns (wildcards).

La syntaxe de base est : `file(GLOB VARIABLE "pattern1" "pattern2" ...)`. Les patterns supportent `*` (n'importe quels caractères) et peuvent spécifier plusieurs extensions.

Par exemple, `file(GLOB SOURCES "${CMAKE_CURRENT_SOURCE_DIR}/*.cpp")` collecte tous les fichiers .cpp du répertoire courant et stocke les chemins dans la variable SOURCES.

**Controverse** : L'utilisation de `file(GLOB)` est débattue dans la communauté CMake. Le problème principal : CMake ne redétecte pas automatiquement les nouveaux fichiers ajoutés après la configuration initiale. Il faut relancer `cmake ..` manuellement quand on ajoute/supprime des fichiers.

**Alternative recommandée** : Lister explicitement les fichiers sources. C'est plus verbeux mais garantit que CMake recompile quand nécessaire et rend les dépendances explicites.

Pour les projets Qt générés automatiquement (Qt Creator), `file(GLOB)` est acceptable car l'IDE régénère le CMakeLists.txt.


## Exemples

```cmake
# Collecter plusieurs types de fichiers
file(GLOB PROJECT_SOURCES
    "${CMAKE_CURRENT_SOURCE_DIR}/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/*.hpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/*.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/*.h"
)

# Utiliser les sources collectées
add_executable(myapp ${PROJECT_SOURCES})
```

```cmake
# Alternative recommandée (liste explicite)
set(PROJECT_SOURCES
    main.cpp
    window.cpp
    widget.cpp
)
add_executable(myapp ${PROJECT_SOURCES})
```


## Connexions
### Notes liées
- [[CMAKE : [qt_add_executable] - créer exécutable Qt6]]
- [[CMAKE : _CMakePresets.json_ - fichier configuration moderne]]


### Contexte
`file(GLOB)` simplifie les CMakeLists.txt mais au prix d'une détection imparfaite des changements. Dans les projets manuels, préférer les listes explicites. Dans les projets générés automatiquement (IDE), son utilisation est acceptable.


## Sources
- Fichier source : `0-Inbox/cmake/QT/QT projects - CMakeList.md`
- Documentation CMake : file(GLOB)

---
**Tags thématiques** : #cmake #file-management #globbing #best-practices
