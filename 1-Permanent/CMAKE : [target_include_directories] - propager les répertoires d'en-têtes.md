---
type: permanent
created: 2026-09-22 14:47
tags:
  - permanent
  - cmake
  - build-system
  - targets
---

# target_include_directories - propager les répertoires d'en-têtes

> [!abstract] Concept
> Commande qui attache des répertoires d'en-têtes à une cible et décide, via `PRIVATE` / `PUBLIC` / `INTERFACE`, si ces répertoires sont hérités par les cibles qui la consomment.


## Explication

`target_include_directories(<cible> <PRIVATE|PUBLIC|INTERFACE> <répertoires...>)` ajoute des chemins de recherche d'en-têtes — les futurs `-I` de la ligne de compilation, voir [[GCC - driver et non compilateur]]. Elle remplace l'ancienne commande globale `include_directories()`, qui s'appliquait à toutes les cibles du répertoire sans distinction.

Tout l'intérêt tient dans le mot-clé de visibilité, qui exprime **qui a besoin de ce chemin** :

- `PRIVATE` : la cible en a besoin pour se compiler, ses consommateurs non. Cas d'un en-tête d'implémentation interne.
- `INTERFACE` : la cible n'en a pas besoin elle-même, ses consommateurs oui. Cas d'une bibliothèque header-only.
- `PUBLIC` : les deux. Cas d'une bibliothèque dont l'API publique est dans le même répertoire que ses sources.

C'est cette propagation qui permet au projet parent d'écrire simplement `#include "hello.h"` sans rien configurer : si `libhello/CMakeLists.txt` déclare `target_include_directories(hello PUBLIC .)`, alors toute cible liée à `hello` par `target_link_libraries` hérite automatiquement du chemin. La dépendance est décrite **une fois, du côté de celui qui la connaît** — c'est le principe des *usage requirements* de CMake moderne.

En pratique, on distingue les chemins de build des chemins d'installation avec l'expression génératrice `$<BUILD_INTERFACE:...>` / `$<INSTALL_INTERFACE:...>`, sans quoi un chemin absolu de la machine de compilation se retrouverait exporté dans le paquet installé.


## Exemples

```cmake
# Dans libhello/CMakeLists.txt : expose ses en-têtes aux consommateurs
add_library(hello hello.c hello.h)
target_include_directories(hello PUBLIC .)
```

```cmake
# Dans le CMakeLists.txt racine : rien à configurer,
# le chemin d'include arrive avec la dépendance
add_executable(main main.c)
target_link_libraries(main hello)   # main.c peut faire #include "hello.h"
```

```cmake
# Les trois visibilités dans un même projet
target_include_directories(mylib
    PUBLIC    include/          # API exposée aux consommateurs
    PRIVATE   src/internal/     # détails d'implémentation
)
```


## Cas d'usage

- **Bibliothèque en sous-projet** : un `PUBLIC .` suffit à rendre ses en-têtes visibles au parent, voir [[CMAKE : [add_subdirectory] - intégrer une bibliothèque en sous-projet]].
- **Dépendance externe** : injecter le chemin renvoyé par `find_package` (`${PNG_INCLUDE_DIR}`) dans la cible qui l'utilise.
- **En-tête généré** : ajouter `${CMAKE_CURRENT_BINARY_DIR}` pour que le code trouve un `version.h` produit par [[CMAKE : [configure_file] - générer un en-tête depuis un template .h.in]].


## Avantages et limites

✅ **Avantages** :
- La dépendance d'inclusion voyage avec la cible : le consommateur n'a rien à savoir de l'arborescence interne
- Les visibilités documentent explicitement la frontière entre API publique et implémentation
- Remplace les `include_directories()` globaux, qui contaminaient toutes les cibles du répertoire

❌ **Limites** :
- Tout mettre en `PUBLIC` par facilité fait fuiter les détails d'implémentation dans les consommateurs
- Un chemin absolu déclaré sans `$<INSTALL_INTERFACE:>` casse l'export du paquet
- Le mot-clé de visibilité est obligatoire : l'omettre produit une erreur de configuration


## Connexions
### Notes liées
- [[CMAKE : [target_link_libraries] - lier bibliothèques Qt]] - la commande qui déclenche l'héritage des répertoires déclarés ici
- [[CMAKE : [add_library] - déclarer une bibliothèque]] - la cible sur laquelle cette commande s'applique le plus souvent
- [[C - directives préprocesseur (define include)]] - le mécanisme `#include` que ces chemins alimentent
- [[C - en-tête et bibliothèque (déclarer vs définir)]] - pourquoi le chemin d'en-tête et le chemin de bibliothèque sont deux choses distinctes
- [[CMAKE - patrons de CMakeLists.txt (simple, sous-projet, dépendance externe)]] - le squelette complet où cette commande prend place



### Contexte
Répertoires d'en-têtes et bibliothèques à lier sont les deux moitiés d'une dépendance C/C++ : `target_include_directories` règle la compilation, `target_link_libraries` règle l'édition de liens.


## Sources
- Fichier source : `0-Inbox/Archive/CMAKE - Get Started.md`
- Documentation CMake : target_include_directories()

---
**Tags thématiques** : #cmake #build-system #targets #headers
