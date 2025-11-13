---
type: permanent
created: 2025-11-11 00:00
tags:
  - permanent
  - cmake
  - qt
  - linking
---

# target_link_libraries avec composants Qt

> [!abstract] Concept
> Commande CMake pour lier les bibliothèques Qt à une cible exécutable ou bibliothèque, en utilisant la syntaxe moderne des composants.


## Explication

Après avoir créé une cible (avec `add_executable` ou `qt_add_executable`), on doit la lier aux bibliothèques Qt nécessaires. La commande `target_link_libraries` établit cette connexion.

La syntaxe moderne utilise des **cibles importées** avec le namespace Qt. Par exemple, `Qt6::Widgets` représente la bibliothèque Widgets de Qt6. Cette syntaxe est préférable aux anciennes variables car elle gère automatiquement les dépendances transitives et les chemins d'include.

Pour supporter Qt5 et Qt6, on utilise `Qt${QT_VERSION_MAJOR}::Component`, où `QT_VERSION_MAJOR` est défini par `find_package`. Ainsi le même code fonctionne avec les deux versions.

Le mot-clé **PRIVATE** indique que la dépendance Qt n'est pas propagée aux cibles qui dépendent de notre cible. Pour un exécutable final, PRIVATE est approprié. Pour une bibliothèque partagée, on utiliserait PUBLIC ou INTERFACE selon les besoins.

Les composants Qt courants sont : Core (base), Gui (graphique bas niveau), Widgets (interface utilisateur), Network (réseau), Sql (base de données), etc.


## Exemples

```cmake
# Lier Widgets à un exécutable (Qt5 ou Qt6)
target_link_libraries(myapp PRIVATE Qt${QT_VERSION_MAJOR}::Widgets)

# Lier plusieurs composants
target_link_libraries(myapp PRIVATE
    Qt${QT_VERSION_MAJOR}::Widgets
    Qt${QT_VERSION_MAJOR}::Network
)

# Version spécifique Qt6
target_link_libraries(myapp PRIVATE Qt6::Widgets)
```


## Connexions
### Notes liées
- [[CMAKE : [find_package] - découverte Qt multi-versions]]
- [[CMAKE : [qt_add_executable] - créer exécutable Qt6]]
- [[CMAKE : [CMAKE_PREFIX_PATH] - variable chemin installation Qt]]


### Contexte
Le linkage correct des bibliothèques Qt est essentiel pour que l'exécutable compile et s'exécute. Sans `target_link_libraries`, les symboles Qt ne seront pas résolus à l'édition de liens, causant des erreurs "undefined reference".


## Sources
- Fichier source : `0-Inbox/cmake/QT/QT projects - CMakeList.md`
- Documentation CMake : target_link_libraries()

---
**Tags thématiques** : #cmake #qt #linking #targets
