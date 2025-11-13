---
type: permanent
created: 2025-11-11 00:00
tags:
  - permanent
  - cmake
  - tooling
  - lsp
---

# CMAKE_EXPORT_COMPILE_COMMANDS

> [!abstract] Concept
> Variable CMake qui génère compile_commands.json, une base de données de compilation utilisée par les outils d'analyse et les Language Server Protocol (LSP).


## Explication

Lors de la compilation d'un projet C/C++, CMake génère des commandes de compilation complexes avec de nombreux flags, chemins d'include, définitions de macros. Ces informations sont nécessaires aux outils d'analyse statique, linters et serveurs de langage (clangd, ccls) pour comprendre le code.

**CMAKE_EXPORT_COMPILE_COMMANDS** active la génération d'un fichier `compile_commands.json` dans le répertoire de build. Ce fichier JSON contient, pour chaque fichier source, la commande exacte de compilation utilisée.

Les outils qui utilisent compile_commands.json :
- **clangd** (LSP) : autocomplétion, navigation, diagnostics en temps réel dans l'éditeur
- **clang-tidy** : linter et modernisation de code
- **cppcheck** : analyse statique
- **IDE modernes** : VS Code, Neovim, Emacs, etc.

Sans ce fichier, les LSP ne connaissent pas les chemins d'include ou les macros définies, causant des erreurs fantômes dans l'éditeur.

S'active avec `set(CMAKE_EXPORT_COMPILE_COMMANDS ON)` ou via CMakePresets.json.


## Exemples

```cmake
# Dans CMakeLists.txt
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
```

```json
// Dans CMakePresets.json (recommandé)
{
  "configurePresets": [
    {
      "name": "debug",
      "cacheVariables": {
        "CMAKE_EXPORT_COMPILE_COMMANDS": "YES"
      }
    }
  ]
}
```

Résultat : fichier `build/compile_commands.json` créé
```json
[
  {
    "directory": "/home/user/project/build",
    "command": "/usr/bin/c++ -I/opt/Qt/6.5.3/include ...",
    "file": "/home/user/project/main.cpp"
  }
]
```


## Connexions
### Notes liées
- [[CMAKE : _CMakePresets.json_ - fichier configuration moderne]]
- [[CMAKE : [CMAKE_PREFIX_PATH] - variable chemin installation Qt]]
- [[CMAKE - automation Qt AUTOUIC AUTOMOC AUTORCC]]


### Contexte
CMAKE_EXPORT_COMPILE_COMMANDS est indispensable dans un workflow moderne de développement C++. Elle améliore radicalement l'expérience développeur en permettant l'autocomplétion intelligente, les diagnostics précis et la navigation de code dans l'éditeur.


## Sources
- Fichier source : `0-Inbox/cmake/QT/QT projects - CMakePresets.md`
- Documentation CMake : CMAKE_EXPORT_COMPILE_COMMANDS

---
**Tags thématiques** : #cmake #tooling #lsp #compile-commands #developer-experience
