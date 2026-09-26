---
type: permanent
created: 2026-09-22 14:47
tags:
  - permanent
  - cmake
  - build-system
  - configuration
---

# configure_file - générer un en-tête depuis un template .h.in

> [!abstract] Concept
> Commande qui copie un fichier en remplaçant les `@VARIABLE@` par la valeur des variables CMake correspondantes — le pont standard pour faire descendre une information du build jusqu'au code source.


## Explication

Le build connaît des informations que le code ignore : le numéro de version du projet, le hash Git, les options activées, le nom de la plateforme cible. `configure_file(<entrée> <sortie>)` les fait franchir la frontière. CMake lit le fichier d'entrée, substitue chaque occurrence de `@VAR@` (et de `${VAR}`, sauf en mode `@ONLY`) par la valeur de la variable CMake du même nom, puis écrit le résultat.

Par convention, le fichier modèle porte le suffixe `.in` : `version.h.in` produit `version.h`. Ce n'est **pas un en-tête** au sens du compilateur, mais un patron ; il est régénéré à chaque configuration et son produit est donc écrasé. Il en découle deux règles : le `.h.in` se versionne dans Git, le `.h` généré **ne se versionne pas**.

La source de valeurs la plus fréquente est la version déclarée par [[CMAKE : [project] - nom, version et variables générées]] : `project(hello VERSION 1.0.1)` renseigne `hello_VERSION_MAJOR`, `hello_VERSION_MINOR`, `hello_VERSION_PATCH`, qu'il suffit d'écrire entre arobases dans le modèle. La version n'existe alors qu'à un seul endroit du dépôt.

Deux directives spécifiques enrichissent les modèles. `#cmakedefine VAR` devient `#define VAR` si la variable est vraie, et un commentaire `/* #undef VAR */` sinon — le moyen propre de transformer une option CMake en macro de préprocesseur. `#cmakedefine01 VAR` produit toujours un `#define` valant `0` ou `1`.

**Point de vigilance** : générer dans le répertoire source (`${CMAKE_CURRENT_SOURCE_DIR}`) pollue le dépôt d'un fichier produit et casse les builds parallèles hors-source. La cible correcte est `${CMAKE_CURRENT_BINARY_DIR}`, à condition d'ajouter ce répertoire aux chemins d'include de la cible via [[CMAKE : [target_include_directories] - propager les répertoires d'en-têtes]].


## Exemples

```c
/* version.h.in — le modèle, versionné dans Git */
#define VERSION_MAJOR "@HELLO_VERSION_MAJOR@"
#define VERSION_MINOR "@HELLO_VERSION_MINOR@"
#define VERSION_FULL  "@HELLO_VERSION@"

#cmakedefine ENABLE_LOGGING
```

```cmake
cmake_minimum_required(VERSION 3.16)
project(hello VERSION 1.0.1)

option(ENABLE_LOGGING "Active les logs" ON)

# Génération dans le répertoire de build (recommandé)
configure_file(
    ${CMAKE_CURRENT_SOURCE_DIR}/src/version.h.in
    ${CMAKE_CURRENT_BINARY_DIR}/version.h
    @ONLY
)

add_executable(main src/main.c)

# Sans cette ligne, le code ne trouve pas le version.h généré
target_include_directories(main PRIVATE ${CMAKE_CURRENT_BINARY_DIR})
```

```c
/* version.h produit après configuration */
#define VERSION_MAJOR "1"
#define VERSION_MINOR "0"
#define VERSION_FULL  "1.0.1"

#define ENABLE_LOGGING
```


## Cas d'usage

- **Bannière de version** : afficher au lancement la version exacte du binaire, alignée sur celle déclarée dans `project()`.
- **Compilation conditionnelle** : transformer une `option()` CMake en macro de préprocesseur consommée par `#ifdef`.
- **Fichiers non sources** : la commande n'est pas réservée aux en-têtes — elle génère aussi des `.pc` pkg-config, des manifestes, des scripts de lancement.


## Avantages et limites

✅ **Avantages** :
- Source unique de vérité pour la version et les options, partagée entre build et code
- Les directives `#cmakedefine` produisent des en-têtes propres, sans `-D` sur la ligne de commande
- Fonctionne sur n'importe quel type de fichier texte, pas seulement le C/C++

❌ **Limites** :
- Le fichier généré est écrasé à chaque configuration : toute modification manuelle est perdue
- Générer dans l'arborescence source pollue le dépôt et casse le build hors-source
- Le fichier n'est régénéré qu'à la configuration : une variable changée hors CMake n'est pas prise en compte tant que `cmake` n'est pas relancé


## Connexions
### Notes liées
- [[CMAKE : [project] - nom, version et variables générées]] - fournit les variables `<NOM>_VERSION_*` injectées dans le modèle
- [[CMAKE : [target_include_directories] - propager les répertoires d'en-têtes]] - indispensable pour que le code trouve l'en-tête généré
- [[C - directives préprocesseur (define include)]] - les `#define` que cette commande fabrique
- [[C - macros prédéfinies]] - l'alternative fournie par le compilateur lui-même (`__DATE__`, `__FILE__`)
- [[CMAKE - patrons de CMakeLists.txt (simple, sous-projet, dépendance externe)]] - le squelette complet où cette commande prend place



### Contexte
`configure_file` est le seul mécanisme standard pour qu'une décision prise à la configuration atteigne le code compilé autrement que par un `-D` sur la ligne de commande — et sa trace reste lisible, dans un en-tête que l'on peut ouvrir.


## Sources
- Fichier source : `0-Inbox/Archive/CMAKE - Get Started.md`
- Documentation CMake : configure_file(), project()

---
**Tags thématiques** : #cmake #build-system #configuration #versioning #préprocesseur
