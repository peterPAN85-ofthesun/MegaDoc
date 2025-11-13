---
type: permanent
created: 2025-11-11 00:00
tags:
  - permanent
  - cmake
  - qt
  - cross-platform
---

# Gestion multi-plateforme Qt

> [!abstract] Concept
> Stratégie CMake pour créer des exécutables ou bibliothèques Qt adaptés à chaque plateforme (Android, iOS, Desktop) avec une configuration conditionnelle.


## Explication

Les applications Qt doivent s'adapter aux contraintes de chaque plateforme. Sur mobile (Android), une application Qt est typiquement une bibliothèque partagée chargée par un wrapper Java/Kotlin. Sur desktop (Linux, Windows, macOS), c'est un exécutable classique.

**Pour Qt6**, `qt_add_executable` gère automatiquement ces différences. Elle crée le type de cible approprié selon la plateforme détectée.

**Pour Qt5**, il faut gérer manuellement avec des conditions :
- **Android + Qt5** : `add_library(myapp SHARED ...)` (bibliothèque partagée)
- **Desktop + Qt5** : `add_executable(myapp ...)` (exécutable classique)

Des propriétés spécifiques à la plateforme doivent aussi être configurées :
- **MACOSX_BUNDLE** : Crée un bundle .app sur macOS
- **MACOSX_BUNDLE_GUI_IDENTIFIER** : Identifiant unique pour iOS/macOS
- **WIN32_EXECUTABLE** : Exécutable Windows sans console

Ces propriétés sont définies avec `set_target_properties` et permettent un packaging correct sur chaque plateforme.


## Exemples

```cmake
# Gestion multi-plateforme Qt5
if(${QT_VERSION_MAJOR} GREATER_EQUAL 6)
    qt_add_executable(myapp ${PROJECT_SOURCES})
else()
    if(ANDROID)
        add_library(myapp SHARED ${PROJECT_SOURCES})
    else()
        add_executable(myapp ${PROJECT_SOURCES})
    endif()
endif()

# Propriétés multi-plateformes
set_target_properties(myapp PROPERTIES
    MACOSX_BUNDLE_GUI_IDENTIFIER com.example.myapp
    MACOSX_BUNDLE TRUE
    WIN32_EXECUTABLE TRUE
)
```


## Connexions
### Notes liées
- [[CMAKE : [qt_add_executable] - créer exécutable Qt6]]
- [[CMAKE : [find_package] - découverte Qt multi-versions]]
- [[CMAKE : [target_link_libraries] - lier bibliothèques Qt]]


### Contexte
La gestion multi-plateforme est cruciale pour les applications Qt modernes qui visent plusieurs systèmes d'exploitation. Qt6 simplifie considérablement ce processus, mais la compatibilité Qt5 nécessite encore une gestion manuelle.


## Sources
- Fichier source : `0-Inbox/cmake/QT/QT projects - CMakeList.md`
- Documentation Qt : Platform Notes

---
**Tags thématiques** : #cmake #qt #cross-platform #android #ios #macos
