---
type: permanent
created: 2025-11-11 00:00
tags:
  - permanent
  - cmake
  - qt
  - configuration
---

# CMAKE_PREFIX_PATH pour Qt

> [!abstract] Concept
> Variable CMake qui spécifie le chemin d'installation de Qt, permettant à find_package de localiser les bibliothèques Qt.


## Explication

Lorsqu'on utilise `find_package(Qt6)` ou `find_package(Qt5)`, CMake doit savoir où chercher les fichiers de configuration Qt. Par défaut, CMake cherche dans des emplacements standards du système, mais Qt est souvent installé dans des répertoires personnalisés (par exemple `/opt/Qt/6.5.3/gcc_64`).

**CMAKE_PREFIX_PATH** indique à CMake les répertoires racines où chercher les paquets. Pour Qt, on pointe vers le répertoire d'installation spécifique à la version et au compilateur.

Cette variable peut être définie de plusieurs manières :
- En ligne de commande : `cmake -DCMAKE_PREFIX_PATH=/opt/Qt/6.5.3/gcc_64 ..`
- Dans le CMakeLists.txt : `set(CMAKE_PREFIX_PATH "/opt/Qt/6.5.3/gcc_64")`
- Dans CMakePresets.json : `"CMAKE_PREFIX_PATH": "/opt/Qt/6.5.3/gcc_64"`

La méthode avec CMakePresets.json est recommandée car elle permet de définir plusieurs configurations (Debug/Release, Qt5/Qt6) et de les partager entre développeurs.


## Exemples

```json
// Dans CMakePresets.json
{
  "configurePresets": [
    {
      "name": "debug-qt6",
      "cacheVariables": {
        "CMAKE_PREFIX_PATH": "/opt/Qt/6.5.3/gcc_64"
      }
    }
  ]
}
```

```cmake
# Dans CMakeLists.txt (moins flexible)
set(CMAKE_PREFIX_PATH "/opt/Qt/6.5.3/gcc_64")
find_package(Qt6 REQUIRED COMPONENTS Widgets)
```


## Connexions
### Notes liées
- [[CMAKE : [find_package] - découverte Qt multi-versions]]
- [[CMAKE : _CMakePresets.json_ - fichier configuration moderne]]
- [[CMAKE : [target_link_libraries] - lier bibliothèques Qt]]


### Contexte
Sans CMAKE_PREFIX_PATH correctement configuré, find_package(Qt6) échouera avec une erreur "Qt6 not found". Cette variable est donc critique dans tout projet Qt utilisant CMake, surtout dans des environnements où Qt n'est pas installé dans les chemins système standards.


## Sources
- Fichier source : `0-Inbox/cmake/QT/QT projects - CMakePresets.md`
- Documentation CMake : cmake-variables(7)

---
**Tags thématiques** : #cmake #qt #configuration #paths
