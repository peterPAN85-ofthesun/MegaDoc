---
type: permanent
created: 2026-09-22 14:47
tags:
  - permanent
  - cmake
  - build-system
  - configuration
---

# project - nom, version et variables générées

> [!abstract] Concept
> Commande qui nomme le projet, déclare ses langages et sa version, et fabrique au passage une série de variables (`<NOM>_VERSION_MAJOR`, `<NOM>_SOURCE_DIR`…) exploitables dans tout le reste du build.


## Explication

`project(<nom>)` étiquette le projet courant. Ce nom n'est pas décoratif : il devient le préfixe d'un jeu de variables automatiques et il apparaît dans les IDE générés (nom de la solution Visual Studio, nom du projet Xcode). La commande déclenche aussi la **détection des compilateurs** : c'est à cet instant que CMake teste `CC`/`CXX`, détermine l'ABI et renseigne `CMAKE_C_COMPILER`, `CMAKE_CXX_COMPILER`, `CMAKE_SYSTEM_NAME`. Rien qui dépende du compilateur ne doit donc être écrit avant `project()`.

L'argument `VERSION <major>.<minor>.<patch>[.<tweak>]` est la partie la plus utile au quotidien. Écrire `project(hello VERSION 1.0.1)` définit d'un coup `hello_VERSION` (`1.0.1`), `hello_VERSION_MAJOR` (`1`), `hello_VERSION_MINOR` (`0`), `hello_VERSION_PATCH` (`1`), ainsi que les doublons génériques `PROJECT_VERSION`, `PROJECT_VERSION_MAJOR`, etc. La version du projet vit ainsi **à un seul endroit**, d'où elle peut être injectée dans le code source par [[CMAKE : [configure_file] - générer un en-tête depuis un template .h.in]] ou dans les métadonnées d'un paquet.

Les arguments `LANGUAGES C CXX` (ou `NONE`) restreignent la détection aux langages réellement utilisés — utile pour accélérer la configuration d'un projet C pur, ou pour un projet qui ne fait que copier des fichiers. Les arguments `DESCRIPTION` et `HOMEPAGE_URL` alimentent CPack et la documentation générée.

Chaque appel à `project()` dans un sous-répertoire crée un nouveau *scope* de projet : `PROJECT_SOURCE_DIR` y pointe sur le sous-répertoire, tandis que `CMAKE_SOURCE_DIR` continue de désigner la racine. C'est ce qui permet à une bibliothèque en sous-projet de rester compilable seule.


## Exemples

```cmake
cmake_minimum_required(VERSION 3.16)

# Projet C++ versionné
project(hello
    VERSION 1.0.1
    DESCRIPTION "Exemple minimal CMake"
    LANGUAGES CXX
)

message(STATUS "Version : ${hello_VERSION}")        # 1.0.1
message(STATUS "Majeure : ${PROJECT_VERSION_MAJOR}") # 1
```

```cmake
# Projet C pur : détection plus rapide, pas de compilateur C++ requis
project(libhello VERSION 0.2.0 LANGUAGES C)
```


## Cas d'usage

- **Source unique de vérité pour la version** : la version déclarée ici est propagée au code (`version.h`), au `SOVERSION` des bibliothèques partagées et aux paquets CPack.
- **Sous-projet autonome** : une bibliothèque qui déclare son propre `project()` se compile aussi bien seule qu'intégrée via [[CMAKE : [add_subdirectory] - intégrer une bibliothèque en sous-projet]].
- **Build conditionnel par plateforme** : les variables renseignées par `project()` (`CMAKE_SYSTEM_NAME`, `CMAKE_CXX_COMPILER_ID`) servent de base aux branches `if()` multi-plateformes.


## Avantages et limites

✅ **Avantages** :
- Centralise le numéro de version et évite sa duplication dans le code et les scripts de packaging
- Déclenche une détection de compilateur explicite et diagnosticable
- Les variables `PROJECT_*` restent valides dans tous les sous-répertoires du projet

❌ **Limites** :
- Confusion fréquente entre `PROJECT_SOURCE_DIR` (projet courant) et `CMAKE_SOURCE_DIR` (racine du build) dès qu'il y a des sous-projets
- Le nom du projet est indépendant du nom des cibles : `project(hello)` ne crée aucun exécutable `hello`
- Oublier `LANGUAGES` fait chercher un compilateur C++ même dans un projet purement C


## Connexions
### Notes liées
- [[CMAKE : [cmake_minimum_required] - version minimale et politiques]] - la commande qui doit précéder celle-ci
- [[CMAKE : [configure_file] - générer un en-tête depuis un template .h.in]] - consomme les variables `<NOM>_VERSION_*` produites ici
- [[CMAKE : [add_executable] - déclarer la cible exécutable]] - le nom du projet ne crée pas de cible, il faut la déclarer explicitement
- [[CMAKE - gestion multi-plateforme Qt]] - exploite les variables système renseignées par `project()`
- [[CMAKE - patrons de CMakeLists.txt (simple, sous-projet, dépendance externe)]] - le squelette complet où cette commande prend place



### Contexte
`project()` est le point où CMake passe d'un simple interpréteur de script à un générateur de build : avant, aucun compilateur n'est connu ; après, toute la chaîne de compilation est identifiée.


## Sources
- Fichier source : `0-Inbox/Archive/CMAKE - Get Started.md`
- Documentation CMake : project()

---
**Tags thématiques** : #cmake #build-system #configuration #versioning
