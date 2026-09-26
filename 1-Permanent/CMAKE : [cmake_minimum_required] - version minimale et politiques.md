---
type: permanent
created: 2026-09-22 14:47
tags:
  - permanent
  - cmake
  - build-system
  - configuration
---

# cmake_minimum_required - version minimale et politiques

> [!abstract] Concept
> Première commande de tout `CMakeLists.txt` : elle refuse les versions de CMake trop anciennes **et** fixe le jeu de politiques (*policies*) qui détermine le comportement des commandes suivantes.


## Explication

`cmake_minimum_required(VERSION <min>)` doit être la toute première commande appelée dans le `CMakeLists.txt` racine, avant même `project()`. Son rôle évident est défensif : si l'utilisateur lance une version de CMake antérieure à `<min>`, la configuration s'arrête immédiatement avec une erreur explicite plutôt que d'échouer plus loin sur une commande inconnue.

Son rôle le moins évident est le plus important : cette commande **règle les politiques CMake**. Chaque fois que CMake change un comportement de manière incompatible, il l'encapsule dans une policy (`CMP0077`, `CMP0079`…). `cmake_minimum_required(VERSION 3.20)` active en bloc le comportement *NEW* de toutes les policies introduites jusqu'à 3.20, et laisse en *OLD* celles d'après. La version déclarée n'est donc pas seulement un plancher : c'est une **déclaration du dialecte CMake** dans lequel le fichier est écrit.

Conséquence pratique : déclarer `VERSION 3.0` sur une machine équipée de CMake 3.28 ne fait pas « tourner CMake en 3.0 », mais demande à CMake 3.28 de se comporter comme 3.0 pour tous les points litigieux — ce qui ressuscite des comportements hérités et déclenche des avertissements de dépréciation. Depuis **CMake 4.0, une compatibilité inférieure à 3.5 est une erreur fatale** : les vieux `cmake_minimum_required(VERSION 3.0)` que l'on croise dans les tutoriels ne configurent plus du tout. Une valeur raisonnable aujourd'hui se situe entre 3.16 et 3.25 selon les distributions visées.

La forme `VERSION <min>...<max>` (avec trois points) permet de dissocier les deux rôles : `<min>` reste le plancher d'erreur, `<max>` le niveau de policies à activer.


## Exemples

```cmake
# Forme historique des tutoriels — refusée par CMake >= 4.0
cmake_minimum_required(VERSION 3.0)
```

```cmake
# Forme recommandée : plancher réaliste, policies modernes
cmake_minimum_required(VERSION 3.16)

project(hello)
```

```cmake
# Forme à intervalle : n'échoue pas sous 3.16,
# mais adopte les policies jusqu'à 3.27 si CMake est plus récent
cmake_minimum_required(VERSION 3.16...3.27)
```


## Cas d'usage

- **Portabilité contrôlée** : fixer le plancher sur la version de CMake livrée par la distribution la plus ancienne que le projet doit supporter (Debian stable, Ubuntu LTS…).
- **Migration progressive** : monter la version déclarée d'un cran pour adopter un lot de policies, puis corriger les avertissements qui apparaissent.
- **Sous-projets** : chaque `CMakeLists.txt` de sous-répertoire intégré par [[CMAKE : [add_subdirectory] - intégrer une bibliothèque en sous-projet]] peut redéclarer sa propre version minimale s'il doit rester compilable isolément.


## Avantages et limites

✅ **Avantages** :
- Message d'erreur clair et précoce au lieu d'un échec obscur en cours de configuration
- Garantit un comportement reproductible des commandes quelle que soit la version de CMake installée
- La syntaxe `min...max` permet d'être tolérant sans renoncer aux comportements modernes

❌ **Limites** :
- Une valeur trop basse fige des comportements obsolètes et génère du bruit d'avertissements
- Depuis CMake 4.0, les valeurs `< 3.5` cassent purement et simplement la configuration
- La commande ne vérifie rien sur le compilateur : c'est le rôle de [[CMAKE : [target_compile_features] - exiger des fonctionnalités du compilateur]]


## Connexions
### Notes liées
- [[CMAKE : [project] - nom, version et variables générées]] - la commande qui suit immédiatement dans tout CMakeLists.txt
- [[CMAKE : _CMakePresets.json_ - fichier configuration moderne]] - les presets exigent eux-mêmes une version minimale de CMake
- [[CMAKE : [target_compile_features] - exiger des fonctionnalités du compilateur]] - l'équivalent côté compilateur de ce contrôle de version
- [[CMAKE - patrons de CMakeLists.txt (simple, sous-projet, dépendance externe)]] - le squelette complet où cette commande prend place



### Contexte
Le couple `cmake_minimum_required()` + `project()` forme l'en-tête obligatoire de tout projet CMake. Le reste du fichier — cibles, dépendances, options — n'a de sens que dans le dialecte fixé ici.


## Sources
- Fichier source : `0-Inbox/Archive/CMAKE - Get Started.md`
- Documentation CMake : cmake_minimum_required(), cmake-policies(7)

---
**Tags thématiques** : #cmake #build-system #configuration #policies
