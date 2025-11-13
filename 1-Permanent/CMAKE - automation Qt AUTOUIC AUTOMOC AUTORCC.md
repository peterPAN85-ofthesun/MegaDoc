---
type: permanent
created: 2025-11-11 00:00
tags:
  - permanent
  - cmake
  - qt
  - automation
---

# Automation Qt dans CMake

> [!abstract] Concept
> Les trois variables CMake qui automatisent la génération de code Qt : AUTOUIC pour les UI, AUTOMOC pour le Meta-Object Compiler, et AUTORCC pour les ressources.


## Explication

CMake propose trois variables d'automation pour simplifier l'intégration de Qt dans un projet. Ces variables évitent d'appeler manuellement les outils de génération de code Qt.

**CMAKE_AUTOUIC** active la génération automatique des fichiers d'interface utilisateur. Elle convertit les fichiers `.ui` (créés avec Qt Designer) en headers `.h` utilisables en C++. Sans cette option, il faudrait appeler manuellement l'outil `uic` (User Interface Compiler).

**CMAKE_AUTOMOC** active la génération automatique du Meta-Object Compiler. Cette étape est nécessaire pour toutes les classes Qt qui utilisent `Q_OBJECT` ou `Q_GADGET`. Le MOC génère le code supplémentaire nécessaire pour les signals/slots et l'introspection Qt. Sans cette option, il faudrait appeler manuellement `moc`.

**CMAKE_AUTORCC** active la compilation automatique des fichiers de ressources Qt (`.qrc`). Ces fichiers contiennent des images, polices, fichiers de configuration embarqués dans l'exécutable. Sans cette option, il faudrait appeler manuellement `rcc` (Resource Compiler).

Toutes les trois s'activent avec `set(CMAKE_AUTOUIC ON)`, `set(CMAKE_AUTOMOC ON)`, `set(CMAKE_AUTORCC ON)`.


## Exemples

```cmake
# Activation de l'automation Qt
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

# CMake détectera et traitera automatiquement :
# - Les fichiers .ui → génération des headers UI
# - Les classes avec Q_OBJECT → génération du code MOC
# - Les fichiers .qrc → compilation des ressources
```


## Connexions
### Notes liées
- [[CMAKE : [find_package] - découverte Qt multi-versions]]
- [[CMAKE : [qt_add_executable] - créer exécutable Qt6]]
- [[CMAKE : [CMAKE_EXPORT_COMPILE_COMMANDS] - variable génération compile_commands.json]]


### Contexte
L'automation est essentielle dans les projets Qt modernes pour éviter la gestion manuelle des outils de génération de code. Ces trois variables réduisent considérablement la complexité du CMakeLists.txt et évitent les erreurs de build.


## Sources
- Fichier source : `0-Inbox/cmake/QT/QT projects - CMakeList.md`
- Documentation CMake : cmake-qt(7)

---
**Tags thématiques** : #cmake #qt #automation #build-system
