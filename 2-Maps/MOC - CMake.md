---
type: moc
created: 2025-11-11 00:00
tags:
  - moc
  - index
  - cmake
  - build-system
---

# 🗺️ MOC - CMake

> [!note] Vue d'ensemble
> Cette carte de contenu rassemble les notes sur le thème : **CMake, le système de build multiplateforme pour projets C/C++**

## Introduction
CMake est un système de build moderne et multiplateforme qui génère des fichiers de build natifs (Makefiles, projets Visual Studio, Ninja, etc.). Cette carte organise les concepts essentiels pour maîtriser CMake, de la configuration de base aux pratiques modernes avec CMakePresets.json.

## Structure

### Point d'entrée

| Note | Description |
|------|-------------|
| [[CMAKE - patrons de CMakeLists.txt (simple, sous-projet, dépendance externe)]] | Les trois squelettes de projet prêts à recopier — vue d'assemblage des commandes détaillées plus bas |

### Structure d'un CMakeLists.txt

| Commande | Description |
|----------|-------------|
| [[CMAKE : [cmake_minimum_required] - version minimale et politiques]] | Plancher de version et dialecte CMake du fichier |
| [[CMAKE : [project] - nom, version et variables générées]] | Nom, langages, version et variables `PROJECT_*` |
| [[CMAKE : [configure_file] - générer un en-tête depuis un template .h.in]] | Faire descendre une variable CMake jusqu'au code source |

### Cibles

| Commande | Description |
|----------|-------------|
| [[CMAKE : [add_executable] - déclarer la cible exécutable]] | Créer le binaire et le point d'accroche des commandes `target_*` |
| [[CMAKE : [add_library] - déclarer une bibliothèque]] | Produire une archive, un objet partagé ou une cible INTERFACE |
| [[CMAKE : [target_compile_features] - exiger des fonctionnalités du compilateur]] | Déclarer un standard ou une fonctionnalité de langage plutôt qu'un drapeau |

### Dépendances

| Commande | Description |
|----------|-------------|
| [[CMAKE : [add_subdirectory] - intégrer une bibliothèque en sous-projet]] | Intégrer une bibliothèque vendorée ou interne au build |
| [[CMAKE : [find_package] - variables de résultat en mode Module]] | Localiser une dépendance installée : `_FOUND`, `_INCLUDE_DIR`, `_LIBRARY` |
| [[CMAKE : [target_include_directories] - propager les répertoires d'en-têtes]] | Exposer les en-têtes d'une cible à ses consommateurs (PRIVATE/PUBLIC/INTERFACE) |

### Configuration et préréglages

| Fichier/Variable | Description |
|------------------|-------------|
| [[CMAKE : _CMakePresets.json_ - fichier configuration moderne]] | Format JSON moderne pour configurations réutilisables |
| [[CMAKE : [CMAKE_BUILD_TYPE] - variable build type Debug ou Release]] | Types de compilation et optimisations |
| [[CMAKE : [CMAKE_PREFIX_PATH] - variable chemin installation Qt]] | Configuration des chemins de recherche de paquets |

### Gestion des fichiers sources

| Commande                                                             | Description                                            |
| -------------------------------------------------------------------- | ------------------------------------------------------ |
| [[CMAKE : [file GLOB] - collecter fichiers sources automatiquement]] | Collecte automatique de fichiers sources avec globbing |

### Outils et intégration IDE

| Variable | Description |
|----------|-------------|
| [[CMAKE : [CMAKE_EXPORT_COMPILE_COMMANDS] - variable génération compile_commands.json]] | Génération de compile_commands.json pour LSP et outils d'analyse |

### Intégration Qt (voir aussi [[MOC - Qt avec CMake]])

| Commande | Description |
|----------|-------------|
| [[CMAKE : [find_package] - découverte Qt multi-versions]] | Pattern pour supporter Qt5 et Qt6 |
| [[CMAKE : [target_link_libraries] - lier bibliothèques Qt]] | Linkage de bibliothèques Qt |

## Fondamentaux sous-jacents

CMake ne remplace pas la chaîne de compilation : il l'orchestre. Comprendre ce qu'il génère aide à diagnostiquer ce qu'il produit.

| Note | Ce que CMake en fait |
|------|----------------------|
| [[C - compilation et linkage]] | Les quatre étapes (`cpp`, `cc1`, `as`, `ld`) derrière chaque ligne de build |
| [[C - en-tête et bibliothèque (déclarer vs définir)]] | La distinction entre `target_include_directories` (`-I`) et `target_link_libraries` (`-l`) |
| [[C - convention -lfoo et recherche des archives]] | Ce que `target_link_libraries` produit réellement sur la ligne de commande |
| [[C - ordre de résolution des archives au link]] | Pourquoi CMake calcule un ordre de link à partir du graphe de dépendances |
| [[MAKE - but par défaut DEFAULT_GOAL]] | Le comportement des Makefiles générés par le générateur Unix Makefiles |
| [[ELF - Executable and Linkable Format]] | Le format de l'artefact que produisent `add_executable` et `add_library` |

>[!Note]
>`CMAKE_EXPORT_COMPILE_COMMANDS` et l'outil `bear` répondent au même besoin par deux voies : le premier fait générer `compile_commands.json` par CMake, le second le capture depuis un build Make existant — voir [[PS2SDK - configuration du LSP (bear et clangd)]].

## Notes principales
- [[CMAKE - patrons de CMakeLists.txt (simple, sous-projet, dépendance externe)]] - Par où commencer
- [[CMAKE : [add_executable] - déclarer la cible exécutable]] - La brique de base du modèle par cibles
- [[CMAKE : [add_library] - déclarer une bibliothèque]] - Découper un projet en modules liables
- [[CMAKE : [target_include_directories] - propager les répertoires d'en-têtes]] - Le cœur des *usage requirements*
- [[CMAKE : _CMakePresets.json_ - fichier configuration moderne]] - Incontournable pour projets modernes
- [[CMAKE : [CMAKE_BUILD_TYPE] - variable build type Debug ou Release]] - Fondamental pour développement/distribution
- [[CMAKE : [CMAKE_EXPORT_COMPILE_COMMANDS] - variable génération compile_commands.json]] - Essentiel pour bonne expérience développeur
- [[CMAKE : [file GLOB] - collecter fichiers sources automatiquement]] - Controverse et bonnes pratiques

## 🔗 MOCs connexes

- [[MOC - Programmation C]] - Le langage et sa chaîne de compilation
- [[MOC - Qt avec CMake]] - Application de CMake au framework Qt
- [[MOC - PS2 Homebrew]] - L'approche inverse : build par Makefiles écrits à la main

## Ressources externes
- Documentation officielle CMake : https://cmake.org/documentation/
- CMake Tutorial : https://cmake.org/cmake/help/latest/guide/tutorial/index.html
- CMake Presets documentation : https://cmake.org/cmake/help/latest/manual/cmake-presets.7.html
- Modern CMake practices : https://cliutils.gitlab.io/modern-cmake/

## Notes en développement
- Générateurs CMake (Unix Makefiles, Ninja, etc.)
- cmake-gui et ccmake
- CPack pour packaging
- CTest pour tests unitaires
- ExternalProject et FetchContent
- Cibles importées et export/install d'un paquet
- Expressions génératrices ($<...>)

---
**Dernière mise à jour** : 2026-09-22
