---
type: moc
created: 2025-11-11 00:00
tags:
  - moc
  - index
  - qt
  - cmake
  - gui
---

# 🗺️ MOC - Qt avec CMake

> [!note] Vue d'ensemble
> Cette carte de contenu rassemble les notes sur le thème : **Intégration de Qt (framework GUI) avec CMake**

## Introduction
Qt est un framework multiplateforme pour développer des applications graphiques modernes. Son intégration avec CMake nécessite de comprendre plusieurs concepts spécifiques : automation des outils Qt, découverte multi-versions, création d'exécutables adaptés à chaque plateforme. Cette carte organise tous les concepts essentiels pour maîtriser Qt avec CMake.

## Structure

### Automation et génération de code
- [[CMAKE - automation Qt AUTOUIC AUTOMOC AUTORCC]] - AUTOUIC, AUTOMOC, AUTORCC pour génération automatique

### Configuration et découverte Qt

| Commande/Variable | Description |
|-------------------|-------------|
| [[CMAKE : [find_package] - découverte Qt multi-versions]] | Pattern pour supporter Qt5 et Qt6 |
| [[CMAKE : [CMAKE_PREFIX_PATH] - variable chemin installation Qt]] | Configuration du chemin d'installation Qt |
| [[CMAKE : [target_link_libraries] - lier bibliothèques Qt]] | Linkage des bibliothèques Qt (Widgets, Core, etc.) |

### Création d'exécutables Qt

| Commande/Concept | Description |
|------------------|-------------|
| [[CMAKE : [qt_add_executable] - créer exécutable Qt6]] | Commandes Qt6 modernes pour créer et finaliser des exécutables |
| [[CMAKE - gestion multi-plateforme Qt]] | Adaptation Android, iOS, Desktop |

### Intégration générale CMake (voir aussi [[MOC - CMake]])

| Fichier/Variable | Description |
|------------------|-------------|
| [[CMAKE : _CMakePresets.json_ - fichier configuration moderne]] | Configurations réutilisables |
| [[CMAKE : [CMAKE_BUILD_TYPE] - variable build type Debug ou Release]] | Types de compilation |
| [[CMAKE : [CMAKE_EXPORT_COMPILE_COMMANDS] - variable génération compile_commands.json]] | Intégration LSP/IDE |

### Ce que produit le linkage (fondamentaux C)

`target_link_libraries` se traduit en options `-l` passées à `ld` : ces notes expliquent ce qui se passe une fois CMake sorti de scène.

| Note | Utilité |
|------|---------|
| [[C - convention -lfoo et recherche des archives]] | Comment `Qt6::Widgets` devient un chemin de bibliothèque résolu |
| [[C - ordre de résolution des archives au link]] | Pourquoi l'ordre des cibles liées compte, et le rôle de `--start-group` |
| [[C - en-tête et bibliothèque (déclarer vs définir)]] | Distinguer une erreur d'include d'une erreur de linkage |

## Notes principales
- [[CMAKE - automation Qt AUTOUIC AUTOMOC AUTORCC]] - Incontournable pour éviter appels manuels moc/uic/rcc
- [[CMAKE : [find_package] - découverte Qt multi-versions]] - Pattern essentiel compatibilité Qt5/Qt6
- [[CMAKE : [qt_add_executable] - créer exécutable Qt6]] - Standard Qt6 moderne
- [[CMAKE - gestion multi-plateforme Qt]] - Crucial pour applications mobiles

## Ressources externes
- Documentation Qt CMake : https://doc.qt.io/qt-6/cmake-manual.html
- Qt Creator CMake integration : https://doc.qt.io/qtcreator/creator-project-cmake.html
- Qt6 CMake API : https://doc.qt.io/qt-6/cmake-commands-qtcore.html
- Migration Qt5 → Qt6 : https://doc.qt.io/qt-6/portingguide.html

## Notes en développement
- qt_add_library
- qt_add_qml_module (Qt Quick/QML)
- Qt Designer (.ui files)
- Qt Resource System (.qrc)
- Qt Linguist (traductions)
- Déploiement Qt (windeployqt, macdeployqt, linuxdeployqt)

---
**Dernière mise à jour** : 2026-08-22
