---
type: permanent
created: 2025-11-11 00:00
tags:
  - permanent
  - cmake
  - qt
  - qt6
---

# qt_add_executable et qt_finalize_executable

> [!abstract] Concept
> Commandes Qt6 modernes pour créer et finaliser des exécutables Qt, remplaçant add_executable avec des optimisations spécifiques Qt.


## Explication

Qt6 introduit `qt_add_executable`, une alternative à `add_executable` de CMake qui intègre des optimisations et fonctionnalités spécifiques à Qt.

**qt_add_executable** crée une cible exécutable avec gestion automatique de certaines propriétés Qt (ressources, déploiement, plugins). Elle accepte une option `MANUAL_FINALIZATION` qui permet de contrôler quand la finalisation Qt doit s'exécuter.

**qt_finalize_executable** effectue le post-processing nécessaire pour un exécutable Qt6. Cette étape :
- Configure les ressources Qt embarquées
- Prépare le déploiement pour différentes plateformes
- Configure les plugins Qt nécessaires
- Optimise le binaire final

Si `MANUAL_FINALIZATION` n'est pas spécifié, `qt_finalize_executable` est appelée automatiquement. Sinon, il faut l'appeler explicitement à la fin du CMakeLists.txt, typiquement dans une condition `if(QT_VERSION_MAJOR EQUAL 6)`.

Pour Qt5, on utilise toujours `add_executable` classique car ces commandes n'existent pas.


## Exemples

```cmake
# Création avec finalisation manuelle (Qt6)
if(${QT_VERSION_MAJOR} GREATER_EQUAL 6)
    qt_add_executable(myapp
        MANUAL_FINALIZATION
        ${PROJECT_SOURCES}
    )
else()
    add_executable(myapp ${PROJECT_SOURCES})
endif()

# ... configuration de la cible ...

# Finalisation explicite (Qt6 uniquement)
if(QT_VERSION_MAJOR EQUAL 6)
    qt_finalize_executable(myapp)
endif()
```


## Connexions
### Notes liées
- [[CMAKE : [find_package] - découverte Qt multi-versions]]
- [[CMAKE : [target_link_libraries] - lier bibliothèques Qt]]
- [[CMAKE - gestion multi-plateforme Qt]]


### Contexte
Ces commandes sont essentielles pour les projets Qt6 modernes. Elles simplifient la configuration et garantissent que l'exécutable est correctement préparé pour le déploiement sur toutes les plateformes supportées par Qt.


## Sources
- Fichier source : `0-Inbox/cmake/QT/QT projects - CMakeList.md`
- Documentation Qt : qt_add_executable(), qt_finalize_executable()

---
**Tags thématiques** : #cmake #qt #qt6 #executable
