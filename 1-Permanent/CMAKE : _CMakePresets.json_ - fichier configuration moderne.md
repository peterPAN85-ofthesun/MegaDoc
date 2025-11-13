---
type: permanent
created: 2025-11-11 00:00
tags:
  - permanent
  - cmake
  - configuration
  - presets
---

# CMakePresets.json - Configuration moderne CMake

> [!abstract] Concept
> Format JSON standardisé (CMake 3.19+) pour définir des configurations CMake réutilisables et partageables entre développeurs.


## Explication

Traditionnellement, on configure CMake en ligne de commande avec de nombreux arguments : `cmake -DCMAKE_BUILD_TYPE=Debug -DCMAKE_PREFIX_PATH=/opt/Qt/6.5.3/gcc_64 -G "Unix Makefiles" ..`. Cette approche est verbeuse, difficile à partager et source d'erreurs.

**CMakePresets.json** (introduit dans CMake 3.19) résout ce problème en centralisant les configurations dans un fichier JSON versionné avec le projet.

Le fichier contient deux types de presets :

**configurePresets** définit les configurations de génération (configure step). Chaque preset spécifie :
- Le générateur (Unix Makefiles, Ninja, Visual Studio, etc.)
- Le répertoire de build (binaryDir)
- Les variables CMake (cacheVariables : CMAKE_BUILD_TYPE, CMAKE_PREFIX_PATH, etc.)
- Un nom et une description lisibles

**buildPresets** définit les configurations de compilation (build step). Chaque preset référence un configurePreset spécifique.

Les développeurs utilisent simplement : `cmake --preset debug-qt6` au lieu de répéter tous les arguments. Les IDE modernes (VS Code, CLion, Qt Creator) détectent automatiquement les presets.


## Exemples

### Exemple basique

```json
{
  "version": 3,
  "configurePresets": [
    {
      "name": "debug-qt6",
      "displayName": "🐞 Debug (Qt6)",
      "generator": "Unix Makefiles",
      "binaryDir": "${sourceDir}/build/debug-qt6",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Debug",
        "CMAKE_PREFIX_PATH": "/opt/Qt/6.5.3/gcc_64",
        "CMAKE_EXPORT_COMPILE_COMMANDS": "YES"
      }
    }
  ],
  "buildPresets": [
    {
      "name": "build-debug-qt6",
      "configurePreset": "debug-qt6"
    }
  ]
}
```

Utilisation :
```bash
cmake --preset debug-qt6
cmake --build --preset build-debug-qt6
```

### Héritage de configuration avec `inherits`

Les presets peuvent hériter d'autres presets pour réutiliser la configuration :

```json
{
  "version": 3,
  "configurePresets": [
    {
      "name": "default",
      "displayName": "Configuration de base",
      "generator": "Ninja",
      "binaryDir": "${sourceDir}/build/${presetName}"
    },
    {
      "name": "debug",
      "inherits": "default",
      "displayName": "Debug",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Debug"
      }
    },
    {
      "name": "release",
      "inherits": "default",
      "displayName": "Release",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Release"
      }
    }
  ]
}
```

### Conditions multi-plateformes

Restreindre un preset à certaines plateformes :

```json
{
  "configurePresets": [
    {
      "name": "windows-only",
      "displayName": "Configuration Windows",
      "condition": {
        "type": "equals",
        "lhs": "${hostSystemName}",
        "rhs": "Windows"
      },
      "generator": "Visual Studio 17 2022"
    },
    {
      "name": "linux-only",
      "displayName": "Configuration Linux",
      "condition": {
        "type": "equals",
        "lhs": "${hostSystemName}",
        "rhs": "Linux"
      },
      "generator": "Ninja"
    }
  ]
}
```

### Variables d'environnement

Définir des variables d'environnement pour le build :

```json
{
  "configurePresets": [
    {
      "name": "with-env",
      "displayName": "Configuration avec variables d'env",
      "environment": {
        "MY_CUSTOM_VAR": "valeur",
        "PATH": "$env{HOME}/tools/bin:$penv{PATH}"
      }
    }
  ]
}
```

**Note** : `$env{VAR}` référence une variable d'environnement, `$penv{VAR}` référence la variable parente.

### Presets de test (testPresets)

Configurer l'exécution des tests CTest :

```json
{
  "testPresets": [
    {
      "name": "default",
      "configurePreset": "debug",
      "output": {
        "outputOnFailure": true
      },
      "execution": {
        "noTestsAction": "error",
        "stopOnFailure": true
      }
    }
  ]
}
```

Utilisation : `ctest --preset default`

### Presets de packaging (packagePresets)

Configurer CPack pour la génération de packages :

```json
{
  "packagePresets": [
    {
      "name": "default",
      "configurePreset": "release",
      "generators": [
        "TGZ",
        "DEB"
      ]
    }
  ]
}
```

Utilisation : `cpack --preset default`

### Workflows complets (workflowPresets)

Enchaîner configure, build, test et package automatiquement :

```json
{
  "workflowPresets": [
    {
      "name": "complete-workflow",
      "steps": [
        {
          "type": "configure",
          "name": "release"
        },
        {
          "type": "build",
          "name": "build-release"
        },
        {
          "type": "test",
          "name": "default"
        },
        {
          "type": "package",
          "name": "default"
        }
      ]
    }
  ]
}
```

Utilisation : `cmake --workflow --preset complete-workflow`


## Connexions
### Notes liées
- [[CMAKE : [CMAKE_PREFIX_PATH] - variable chemin installation Qt]]
- [[CMAKE : [CMAKE_BUILD_TYPE] - variable build type Debug ou Release]]
- [[CMAKE : [CMAKE_EXPORT_COMPILE_COMMANDS] - variable génération compile_commands.json]]


### Contexte
CMakePresets.json est désormais la méthode recommandée pour configurer des projets CMake modernes. Elle améliore la reproductibilité des builds, facilite l'onboarding de nouveaux développeurs et s'intègre parfaitement aux IDE.


## Sources
- Fichier source : `0-Inbox/cmake/QT/QT projects - CMakePresets.md`
- Enrichi avec : `0-Inbox/cmake/Tuto/CMake - Les Presets.md` (2025-11-12)
- Documentation CMake : cmake-presets(7)
- https://cmake.org/cmake/help/latest/manual/cmake-presets.7.html

---
**Tags thématiques** : #cmake #configuration #presets #json #modern-cmake
