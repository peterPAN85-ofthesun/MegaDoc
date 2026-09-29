---
type: permanent
created: 2026-09-22 14:47
tags:
  - permanent
  - cmake
  - build-system
  - targets
  - cpp
---

# target_compile_features - exiger des fonctionnalités du compilateur

> [!abstract] Concept
> Commande qui déclare les fonctionnalités de langage dont une cible a besoin ; CMake en déduit seul le drapeau à passer (`-std=c++14`…) ou échoue si le compilateur ne sait pas les fournir.


## Explication

Certains compilateurs n'activent pas les standards récents par défaut : un code C++14 compilé sans `-std=c++14` échoue sur une syntaxe pourtant valide. Plutôt que d'écrire ce drapeau à la main — non portable, MSVC n'utilise pas la même syntaxe que GCC — on déclare **le besoin**, et CMake choisit le drapeau.

`target_compile_features(<cible> <PRIVATE|PUBLIC|INTERFACE> <fonctionnalités...>)` accepte deux familles de noms. Les **fonctionnalités granulaires** désignent un point précis du langage : `cxx_nullptr`, `cxx_lambdas`, `cxx_constexpr`, `c_variadic_macros`. Les **méta-fonctionnalités** désignent un standard entier : `cxx_std_11`, `cxx_std_14`, `cxx_std_17`, `cxx_std_20`, et leurs équivalents C `c_std_99`, `c_std_11`. La liste complète des fonctionnalités granulaires connues est exposée par la propriété globale `CMAKE_CXX_KNOWN_FEATURES`.

En pratique, les méta-fonctionnalités ont largement supplanté les granulaires : depuis CMake 3.8, la liste détaillée n'est plus maintenue pour les compilateurs récents, et déclarer `cxx_std_17` est à la fois plus lisible et plus fiable que d'énumérer les constructions utilisées. Les granulaires gardent leur intérêt pour du code devant rester compatible avec des compilateurs anciens et hétérogènes.

Comme toutes les commandes `target_*`, elle **doit être placée après** le `add_executable` ou `add_library` de la cible, et son mot-clé de visibilité décide de la propagation : `PUBLIC` sur une bibliothèque impose aussi le standard aux consommateurs — approprié quand l'API publique expose des types C++17, excessif sinon. Si le compilateur ne sait pas fournir la fonctionnalité, CMake s'arrête à la configuration avec un message explicite, au lieu de laisser le compilateur échouer sur une erreur de syntaxe obscure.


## Exemples

```cmake
add_library(hello hello.cpp)

# Fonctionnalité granulaire : la cible a besoin de nullptr
target_compile_features(hello PUBLIC cxx_nullptr)
```

```cmake
# Forme moderne : un standard entier
add_executable(main main.cpp)
target_compile_features(main PRIVATE cxx_std_17)
```

```cmake
# Lister les fonctionnalités connues du compilateur courant
get_property(features GLOBAL PROPERTY CMAKE_CXX_KNOWN_FEATURES)
message(STATUS "${features}")
```


## Cas d'usage

- **Portabilité multi-compilateurs** : un même `CMakeLists.txt` produit `-std=c++17` avec GCC et `/std:c++17` avec MSVC.
- **Échec précoce** : refuser la configuration sur une toolchain trop ancienne plutôt que d'accumuler des erreurs de compilation.
- **Contrat d'API** : une bibliothèque dont les en-têtes utilisent du C++17 le déclare en `PUBLIC`, ce qui force ses consommateurs au même standard.


## Avantages et limites

✅ **Avantages** :
- Exprime une intention portable plutôt qu'un drapeau spécifique à un compilateur
- Diagnostic clair à la configuration si la toolchain est insuffisante
- Se propage aux consommateurs via les mots-clés de visibilité, comme le reste de l'API par cibles

❌ **Limites** :
- Les fonctionnalités granulaires ne sont plus maintenues pour les compilateurs récents : leur usage est aujourd'hui découragé
- Ne remplace pas `CMAKE_CXX_STANDARD` dans les projets qui règlent le standard globalement, les deux coexistent mal
- Aucun effet sur les bibliothèques tierces : seule la cible désignée est concernée


## Connexions
### Notes liées
- [[CMAKE : [add_executable] - déclarer la cible exécutable]] - la cible doit exister avant l'appel
- [[CMAKE : [target_include_directories] - propager les répertoires d'en-têtes]] - même logique de visibilité PRIVATE/PUBLIC/INTERFACE
- [[CMAKE : [cmake_minimum_required] - version minimale et politiques]] - le pendant côté CMake de cette exigence de version
- [[C - compilation et linkage]] - le drapeau `-std=` que CMake finit par générer
- [[CMAKE - patrons de CMakeLists.txt (simple, sous-projet, dépendance externe)]] - le squelette complet où cette commande prend place



### Contexte
Cette commande illustre le déplacement opéré par CMake moderne : on ne décrit plus *comment* compiler (les drapeaux), mais *ce dont on a besoin* (les fonctionnalités), et le générateur traduit.


## Sources
- Fichier source : `0-Inbox/Archive/CMAKE - Get Started.md`
- Documentation CMake : target_compile_features(), CMAKE_CXX_KNOWN_FEATURES

---
**Tags thématiques** : #cmake #build-system #targets #cpp #portabilité
