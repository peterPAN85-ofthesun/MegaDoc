---
type: permanent
created: 2026-09-22 14:47
tags:
  - permanent
  - cmake
  - build-system
  - targets
  - linking
---

# add_library - déclarer une bibliothèque

> [!abstract] Concept
> Commande jumelle de `add_executable` qui produit une bibliothèque statique, partagée ou d'interface — CMake se chargeant d'ajouter seul le préfixe `lib` et le suffixe attendus par la plateforme cible.


## Explication

`add_library(<nom> [STATIC|SHARED|MODULE] <sources...>)` crée une cible bibliothèque. Le nom donné est **logique, pas physique** : écrire `add_library(hello hello.c)` produit `libhello.a` sous Linux, `hello.lib` sous MSVC, `libhello.dylib` sous macOS pour une bibliothèque partagée. C'est exactement la même convention que celle exploitée par l'option de linkage `-lhello` décrite dans [[C - convention -lfoo et recherche des archives]] : on ne doit donc jamais écrire soi-même le préfixe `lib`, sous peine d'obtenir un `liblibhello.a`.

Si aucun mot-clé de type n'est donné, CMake tranche selon la variable globale `BUILD_SHARED_LIBS` : `OFF` (valeur par défaut) produit une bibliothèque **statique**, `ON` une bibliothèque **partagée**. Laisser le type implicite est justement la bonne pratique : l'utilisateur du projet choisit alors à la configuration, par `cmake -DBUILD_SHARED_LIBS=ON`, sans toucher au `CMakeLists.txt`.

Au-delà de `STATIC` et `SHARED`, deux types sont fréquents. `INTERFACE` déclare une bibliothèque **sans aucune source** : elle ne transporte que des propriétés d'usage (répertoires d'en-têtes, définitions, options), ce qui correspond exactement au cas des bibliothèques *header-only* — voir [[PS2SDK - en-têtes header-only sans archive]]. `OBJECT` regroupe des fichiers objets réutilisables par plusieurs cibles sans passer par une archive intermédiaire.

Une fois la cible créée, elle se décore comme n'importe quelle autre : `target_include_directories` pour exposer ses en-têtes, `target_link_libraries` pour ses propres dépendances. C'est ce qui permet à un consommateur de la bibliothèque de n'écrire qu'une seule ligne pour tout récupérer.


## Exemples

```cmake
cmake_minimum_required(VERSION 3.16)
project(libhello)

set(SRCS
    hello.c
    )

set(HEADERS
    hello.h
    )

# Produit libhello.a (ou libhello.so si BUILD_SHARED_LIBS=ON)
add_library(hello ${SRCS} ${HEADERS})
```

```cmake
# Type explicite
add_library(hello_static STATIC hello.c)
add_library(hello_shared SHARED hello.c)

# Bibliothèque header-only : aucune source, que des propriétés
add_library(hello_headers INTERFACE)
target_include_directories(hello_headers INTERFACE include/)
```


## Cas d'usage

- **Factorisation interne** : isoler le cœur logique d'une application dans une bibliothèque, l'exécutable ne gardant que le `main()`.
- **Testabilité** : la bibliothèque peut être liée à la fois au binaire de production et aux binaires de tests, sans recompiler les sources.
- **Distribution** : produire une `.so` versionnée avec les propriétés `VERSION` et `SOVERSION` alimentées par [[CMAKE : [project] - nom, version et variables générées]].


## Avantages et limites

✅ **Avantages** :
- Préfixe et suffixe gérés automatiquement selon la plateforme cible
- Le type statique/partagé reste un choix de l'utilisateur via `BUILD_SHARED_LIBS`
- Les types `INTERFACE` et `OBJECT` couvrent les cas header-only et de réutilisation d'objets sans bricolage

❌ **Limites** :
- Le réflexe d'écrire `add_library(libhello ...)` produit un `liblibhello.a` déroutant
- Une bibliothèque statique n'embarque pas ses dépendances : l'ordre de link reste à la charge du consommateur, voir [[C - ordre de résolution des archives au link]]
- Basculer en `SHARED` sur du code C++ impose de gérer la visibilité des symboles, invisible tant qu'on reste en statique


## Connexions
### Notes liées
- [[CMAKE : [add_executable] - déclarer la cible exécutable]] - la commande symétrique, même modèle de cibles
- [[CMAKE : [add_subdirectory] - intégrer une bibliothèque en sous-projet]] - la façon standard d'intégrer cette bibliothèque au projet parent
- [[C - convention -lfoo et recherche des archives]] - explique le préfixe `lib` que CMake ajoute seul
- [[C - en-tête et bibliothèque (déclarer vs définir)]] - la distinction entre ce que la bibliothèque définit et ce que son en-tête déclare
- [[CMAKE - patrons de CMakeLists.txt (simple, sous-projet, dépendance externe)]] - le squelette complet où cette commande prend place



### Contexte
Découper un projet en bibliothèques est le premier pas vers un build modulaire : chaque bibliothèque devient une unité de dépendance explicite dans le graphe que CMake résout.


## Sources
- Fichier source : `0-Inbox/Archive/CMAKE - Get Started.md`
- Documentation CMake : add_library()

---
**Tags thématiques** : #cmake #build-system #targets #linking #libraries
