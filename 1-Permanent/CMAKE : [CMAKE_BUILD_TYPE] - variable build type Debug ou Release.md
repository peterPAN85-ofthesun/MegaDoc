---
type: permanent
created: 2025-11-11 00:00
tags:
  - permanent
  - cmake
  - build-configuration
  - optimization
---

# CMAKE_BUILD_TYPE Debug vs Release

> [!abstract] Concept
> Variable CMake qui contrôle le type de compilation, déterminant les optimisations, symboles de debug et comportements runtime.


## Explication

CMAKE_BUILD_TYPE détermine comment le code est compilé et optimisé. C'est une variable critique qui affecte les performances, la taille du binaire et la capacité de déboguer.

**Debug** est utilisé pendant le développement :
- Symboles de debug inclus (permet utilisation de gdb, lldb)
- Pas d'optimisations du compilateur (-O0)
- Assertions actives (assert() s'exécute)
- Binaire plus gros et plus lent
- Code non réorganisé = correspondance source/assembleur

**Release** est utilisé pour la distribution finale :
- Pas de symboles de debug (binaire plus petit)
- Optimisations maximales (-O3 ou -O2)
- Assertions désactivées (NDEBUG défini)
- Binaire rapide et compact
- Code réorganisé = difficile à déboguer

**Autres types** moins courants :
- **RelWithDebInfo** : Release avec symboles debug (profiling)
- **MinSizeRel** : Optimisation pour taille minimale

CMAKE_BUILD_TYPE est défini soit en ligne de commande (`-DCMAKE_BUILD_TYPE=Debug`), soit dans CMakePresets.json, soit dans le CMakeLists.txt (déconseillé).


## Exemples

```cmake
# Dans CMakeLists.txt (lecture uniquement, ne pas définir)
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}")

# En ligne de commande
cmake -DCMAKE_BUILD_TYPE=Debug ..
cmake -DCMAKE_BUILD_TYPE=Release ..
```

```json
// Dans CMakePresets.json (recommandé)
{
  "configurePresets": [
    {
      "name": "debug",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Debug"
      }
    },
    {
      "name": "release",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Release"
      }
    }
  ]
}
```


## Connexions
### Notes liées
- [[CMAKE : _CMakePresets.json_ - fichier configuration moderne]]
- [[CMAKE : [CMAKE_EXPORT_COMPILE_COMMANDS] - variable génération compile_commands.json]]
- [[CMAKE - gestion multi-plateforme Qt]]


### Contexte
Bien choisir le build type est essentiel. Développer en Release cache les bugs (assertions désactivées), mais développer en Debug produit un binaire 10x plus lent. La bonne pratique : Debug en développement, Release pour la distribution.


## Sources
- Fichier source : `0-Inbox/cmake/QT/QT projects - CMakePresets.md`
- Documentation CMake : CMAKE_BUILD_TYPE

---
**Tags thématiques** : #cmake #build-configuration #optimization #debug #release
