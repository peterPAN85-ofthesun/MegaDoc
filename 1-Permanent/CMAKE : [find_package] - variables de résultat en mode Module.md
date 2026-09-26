---
type: permanent
created: 2026-09-22 14:47
tags:
  - permanent
  - cmake
  - build-system
  - dependencies
---

# find_package - variables de résultat en mode Module

> [!abstract] Concept
> Commande qui localise une dépendance déjà installée sur le système et publie le résultat sous forme de variables normalisées : `<NOM>_FOUND`, `<NOM>_INCLUDE_DIR`, `<NOM>_LIBRARY`.


## Explication

`find_package(<Nom> [version])` cherche une bibliothèque externe — libpng, Boost, OpenSSL — selon deux mécanismes. En **mode Module**, CMake exécute un script `Find<Nom>.cmake` fourni avec lui ou par le projet, qui va fouiller les emplacements standards du système. En **mode Config**, c'est la bibliothèque elle-même qui installe un fichier `<Nom>Config.cmake` décrivant ses cibles ; ce mode, plus fiable, est celui qu'utilise Qt (voir [[CMAKE : [find_package] - découverte Qt multi-versions]]).

Le mode Module publie un jeu de variables aux noms conventionnels, que l'on retrouve d'une bibliothèque à l'autre :

- `<NOM>_FOUND` — booléen indiquant si la recherche a abouti ;
- `<NOM>_INCLUDE_DIR` et `<NOM>_INCLUDE_DIRS` — répertoires à ajouter pour trouver les en-têtes ;
- `<NOM>_LIBRARY` et `<NOM>_LIBRARIES` — bibliothèques à passer à l'édition de liens.

La forme au pluriel inclut les dépendances transitives, la forme au singulier ne désigne que la bibliothèque elle-même : préférer le pluriel en cas de doute. Parce que la recherche peut échouer, le résultat se teste systématiquement : `if (PNG_FOUND)` pour consommer les variables, `else()` pour arrêter proprement la configuration avec `message(FATAL_ERROR ...)`. Sans ce test, un `find_package` raté laisse des variables vides et l'erreur ne se manifeste qu'à l'édition de liens, sous une forme bien moins lisible.

Par défaut la dépendance est optionnelle ; les mots-clés `REQUIRED` (échec fatal automatique) et `QUIET` (pas de message) évitent d'écrire le `if/else` à la main. Une version minimale se demande par `find_package(Boost 1.57.0)`, et `EXACT` impose la correspondance stricte.

**Pratique moderne** : quand le paquet expose des cibles importées (`PNG::PNG`, `OpenSSL::SSL`), les lier directement plutôt que de manipuler les variables — la cible transporte à la fois les includes, les définitions et les dépendances transitives.


## Exemples

```cmake
cmake_minimum_required(VERSION 3.16)
project(helloPNG)

add_executable(main main.c)

# Recherche de la dépendance externe
find_package(PNG)
if (PNG_FOUND)
  target_include_directories(main PUBLIC ${PNG_INCLUDE_DIR})
  target_link_libraries(main ${PNG_LIBRARY})
else ()
  message(FATAL_ERROR "libpng not found")
endif ()
```

```cmake
# Équivalent concis : REQUIRED remplace le if/else
find_package(PNG REQUIRED)
target_link_libraries(main PRIVATE PNG::PNG)   # cible importée : includes inclus

# Contrainte de version
find_package(Boost 1.57.0 REQUIRED)
```


## Cas d'usage

- **Dépendance système** : lier libpng, zlib ou SQLite installés par le gestionnaire de paquets, sans les vendorer.
- **Dépendance optionnelle** : activer une fonctionnalité seulement si la bibliothèque est présente, en s'appuyant sur `<NOM>_FOUND` pour définir une option de compilation.
- **Contrainte de version** : refuser une version trop ancienne d'une API avant même de compiler.


## Avantages et limites

✅ **Avantages** :
- Aucune copie du code tiers dans le dépôt, contrairement à [[CMAKE : [add_subdirectory] - intégrer une bibliothèque en sous-projet]]
- Noms de variables normalisés, prévisibles d'une bibliothèque à l'autre
- Échec détecté à la configuration, bien avant l'édition de liens

❌ **Limites** :
- Dépend d'un `Find<Nom>.cmake` dont la qualité varie fortement ; certains ne gèrent pas les versions
- La bibliothèque doit être installée au préalable : le build n'est pas autonome
- Les variables à l'ancienne ne transportent ni les définitions de préprocesseur ni les dépendances transitives, d'où la préférence pour les cibles importées


## Connexions
### Notes liées
- [[CMAKE : [find_package] - découverte Qt multi-versions]] - l'application du même mécanisme en mode Config pour Qt5/Qt6
- [[CMAKE : [CMAKE_PREFIX_PATH] - variable chemin installation Qt]] - la variable qui oriente la recherche vers une installation hors des chemins standards
- [[CMAKE : [target_include_directories] - propager les répertoires d'en-têtes]] - consomme `<NOM>_INCLUDE_DIR`
- [[C - convention -lfoo et recherche des archives]] - ce que `<NOM>_LIBRARY` produit finalement sur la ligne de link
- [[CMAKE - patrons de CMakeLists.txt (simple, sous-projet, dépendance externe)]] - le squelette complet où cette commande prend place



### Contexte
`find_package` est la frontière entre le projet et son environnement : tout ce qui n'est pas compilé par le projet lui-même passe par cette commande ou par un sous-répertoire vendoré.


## Sources
- Fichier source : `0-Inbox/Archive/CMAKE - Get Started.md`
- Documentation CMake : find_package(), cmake-packages(7)

---
**Tags thématiques** : #cmake #build-system #dependencies #linking
