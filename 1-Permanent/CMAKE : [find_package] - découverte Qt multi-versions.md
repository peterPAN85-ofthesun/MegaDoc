---
type: permanent
created: 2025-11-11 00:00
tags:
  - permanent
  - cmake
  - qt
  - find_package
---

# Découverte Qt multi-versions avec find_package

> [!abstract] Concept
> Pattern CMake permettant de détecter automatiquement Qt5 ou Qt6 avec un fallback flexible, garantissant la compatibilité multi-versions.


## Explication

Dans un projet Qt, on veut souvent supporter à la fois Qt5 et Qt6 sans dupliquer le code CMake. CMake propose un pattern en deux étapes pour y parvenir.

**Première étape** : Recherche du nom de paquet Qt disponible. On utilise `find_package(QT NAMES Qt6 Qt5 REQUIRED COMPONENTS Widgets)`. Cette commande cherche d'abord Qt6, puis Qt5 si Qt6 n'est pas trouvé. Elle définit la variable `QT_VERSION_MAJOR` (5 ou 6).

**Deuxième étape** : Recherche de la version détectée. On utilise `find_package(Qt${QT_VERSION_MAJOR} REQUIRED COMPONENTS Widgets)`. Cette commande charge le paquet exact détecté à l'étape précédente avec ses composants (Widgets, Core, Gui, etc.).

Ce pattern permet d'écrire le reste du CMakeLists.txt de manière générique en utilisant `${QT_VERSION_MAJOR}`, rendant le code compatible avec les deux versions majeures de Qt sans modification.


## Exemples

```cmake
# Étape 1 : Détecter quelle version de Qt est disponible
find_package(QT NAMES Qt6 Qt5 REQUIRED COMPONENTS Widgets)

# À ce stade, QT_VERSION_MAJOR vaut 6 ou 5

# Étape 2 : Charger la version détectée
find_package(Qt${QT_VERSION_MAJOR} REQUIRED COMPONENTS Widgets)

# Utilisation générique dans le reste du fichier
target_link_libraries(myapp PRIVATE Qt${QT_VERSION_MAJOR}::Widgets)
```


## Connexions
### Notes liées
- [[CMAKE : [CMAKE_PREFIX_PATH] - variable chemin installation Qt]]
- [[CMAKE : [target_link_libraries] - lier bibliothèques Qt]]
- [[CMAKE - automation Qt AUTOUIC AUTOMOC AUTORCC]]


### Contexte
Ce pattern est essentiel pour maintenir des projets Qt compatibles avec les anciennes et nouvelles versions. Il évite de maintenir deux branches CMake séparées et facilite les migrations progressives de Qt5 vers Qt6.


## Sources
- Fichier source : `0-Inbox/cmake/QT/QT projects - CMakeList.md`
- Documentation CMake : cmake-qt(7)

---
**Tags thématiques** : #cmake #qt #find_package #compatibility
