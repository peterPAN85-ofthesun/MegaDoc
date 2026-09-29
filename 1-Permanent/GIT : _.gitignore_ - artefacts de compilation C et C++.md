---
type: permanent
created: 2026-09-29 16:50
tags:
  - permanent
  - git
  - c
  - build
  - versionning
---

# GIT : _.gitignore_ - artefacts de compilation C et C++

> [!abstract] Concept
> Le `.gitignore` d'un projet C/C++ exclut tout ce que le build **régénère** — objets, archives, binaires, fichiers de dépendances — ainsi que les traces de débogage, de profilage et d'environnement de développement.

## Explication

La règle de fond tient en une phrase : *ce qui peut être reconstruit depuis les sources n'a rien à faire dans le dépôt*. Versionner un `.o` ou un `libfoo.a` alourdit l'historique de fichiers binaires non fusionnables, provoque des conflits à chaque `git pull`, et fait courir le risque qu'un collaborateur lie une archive obsolète sans s'en rendre compte. Le corollaire est que l'[[C - arborescence d'un projet de bibliothèque|arborescence]] doit isoler ces artefacts dans un `build/` unique : une seule ligne suffit alors à les couvrir tous.

Les autres catégories sont moins évidentes mais tout aussi importantes. Les fichiers de profilage et de couverture (`*.gcno`, `*.gcda`, `gmon.out`) sont produits à chaque exécution instrumentée et changent en permanence. Les `core` et `vgcore.*` sont des vidages mémoire de plusieurs dizaines de mégaoctets, qui contiennent en outre l'état complet du processus — donc potentiellement des données sensibles. `compile_commands.json` est généré par le build et dépend des chemins absolus de la machine.

Le motif à négation mérite attention : `examples/*` suivi de `!examples/*.c` exclut tout le dossier **sauf** les sources. C'est la façon de gérer un dossier qui mélange sources versionnées et binaires compilés au même niveau. Attention à l'ordre — Git applique les règles séquentiellement, une négation placée avant l'exclusion n'a aucun effet — et au fait qu'une exclusion de dossier (`examples/`) empêche Git de descendre dedans, rendant toute négation ultérieure inopérante.

## Exemples

### `.gitignore` de référence

```gitignore
# ---- Artefacts de compilation ----------------------------------------
build/
*.o
*.d
*.a
*.so
*.so.*
*.dylib
*.dll
*.lib
*.obj
*.exe
*.out

# ---- Binaires de tests / exemples ------------------------------------
tests/run_tests
examples/*
!examples/*.c
!examples/*.h
!examples/Makefile

# ---- Débogage / profilage / couverture -------------------------------
*.dSYM/
core
core.*
vgcore.*
*.gcno
*.gcda
*.gcov
gmon.out
compile_commands.json

# ---- Documentation générée (Doxygen) ---------------------------------
docs/html/
docs/latex/

# ---- Éditeurs / IDE --------------------------------------------------
.vscode/
.idea/
*.swp
*.swo
*~
\#*\#
.#*

# ---- Systèmes d'exploitation -----------------------------------------
.DS_Store
Thumbs.db
```

### Vérifier pourquoi un fichier est ignoré

```bash
$ git check-ignore -v build/foo.o
.gitignore:2:build/    build/foo.o
```

### Rattraper un fichier déjà versionné

```bash
git rm --cached libfoo.a     # retire de l'index, garde sur le disque
echo "*.a" >> .gitignore
git commit -m "ignore build artifacts"
```

Le `.gitignore` n'a **aucun effet** sur un fichier déjà suivi : il faut le désindexer explicitement.

## Cas d'usage

- **Nouveau projet C/C++** : poser ce fichier au premier commit, avant que les artefacts ne polluent l'historique.
- **Projet multi-plateforme** : couvrir `.so`, `.dylib` et `.dll` même si l'on ne développe que sous Linux, pour les contributeurs.
- **Confidentialité** : les `core.*` et `*.dSYM/` contiennent des vidages mémoire à ne jamais publier.

## Avantages et inconvénients

✅ **Avantages** :
- `git status` reste lisible, les ajouts accidentels deviennent improbables.
- Dépôt léger et historique exempt de binaires non fusionnables.
- Évite de publier des vidages mémoire ou des chemins de la machine de développement.

❌ **Inconvénients** / Limites :
- Sans effet rétroactif sur les fichiers déjà suivis.
- Les motifs à négation sont d'un ordre délicat, et inopérants sous un dossier entièrement exclu.
- Trop large, un motif peut masquer un fichier légitime (`*.out` cache aussi un `data.out` de test).

## Connexions

### Notes liées
- [[C - arborescence d'un projet de bibliothèque]] - Le `build/` que ce fichier exclut
- [[C - Makefile de bibliothèque]] - Ce qui produit ces artefacts
- [[GIT - cycle de vie fichiers]] - Non-tracké, tracké, ignoré
- [[GIT : [git clean] - nettoyer fichiers non-trackés]] - Supprimer réellement ce qui est ignoré
- [[GIT : [git rm] - supprimer fichiers]] - `--cached` pour désindexer un artefact déjà commité
- [[CMAKE : [CMAKE_EXPORT_COMPILE_COMMANDS] - variable génération compile_commands.json]] - Un des fichiers générés listés ici

### Dans le contexte de
- [[MOC - Git & Versionning]] - Fait partie de ce domaine
- [[MOC - Programmation C]] - Outillage de projet C

## Sources
- Fichier source : `0-Inbox/Archive/Créer sa librairie en C-C++.md` (chapitre 4)

---
**Tags thématiques** : #git #gitignore #c #build #versionning
