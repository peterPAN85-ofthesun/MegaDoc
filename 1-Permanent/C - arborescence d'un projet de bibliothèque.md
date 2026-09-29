---
type: permanent
created: 2026-09-29 16:22
tags:
  - permanent
  - c
  - build
  - bibliotheque
  - organisation
---

# C - arborescence d'un projet de bibliothèque

> [!abstract] Concept
> L'arborescence canonique d'une bibliothèque C sépare `include/` (en-têtes publics installés) de `src/` (implémentation et en-têtes privés), avec un sous-dossier `include/foo/` qui donne à l'API son espace de noms de fichiers.

## Explication

La structure ne relève pas du goût personnel : c'est elle qui matérialise la frontière entre ce que l'utilisateur voit et ce qui reste interne. Tout ce qui se trouve dans `include/` sera **copié chez l'utilisateur** à l'installation et fait donc partie du contrat ; tout ce qui vit dans `src/` disparaît à la compilation. Cette séparation physique rend la règle vérifiable d'un coup d'œil, là où un mélange `.c`/`.h` dans un même dossier laisse l'API se déliter au fil des commits.

Le sous-dossier `include/foo/` est le détail qui compte le plus. Sans lui, installer un `string.h` dans `/usr/local/include` entre en collision frontale avec le `<string.h>` de la bibliothèque standard. Avec lui, l'utilisateur écrit `#include <foo/string.h>` : le préfixe `foo/` joue le rôle d'espace de noms et rend la collision impossible, y compris avec une autre bibliothèque tierce. On y place en général un en-tête « parapluie » `foo/foo.h` qui inclut les autres, pour que l'utilisateur pressé n'ait qu'une ligne à écrire.

Le reste découle : `src/` peut être sous-découpé par module (`src/string/`, `src/list/`), `tests/` et `examples/` consomment la bibliothèque **comme le ferait un utilisateur** (ce qui valide l'API au passage), `build/` reçoit les objets et fichiers de dépendances et n'est jamais versionné, et `README.md` / `LICENSE` conditionnent la diffusion.

## Exemples

### Arborescence de référence

```
libfoo/
├── include/
│   └── foo/              ← en-têtes PUBLICS (installés chez l'utilisateur)
│       ├── foo.h         ← en-tête « parapluie » qui inclut les autres
│       ├── string.h
│       └── list.h
├── src/                  ← implémentation + en-têtes PRIVÉS
│   ├── internal.h        ← privé, jamais installé
│   ├── string/
│   │   ├── foo_strlen.c
│   │   └── foo_strdup.c
│   └── list/
│       ├── list_internal.h
│       └── foo_list_push.c
├── tests/
│   └── test_string.c
├── examples/
├── build/                ← généré (objets, dépendances), dans .gitignore
├── Makefile
├── README.md
└── LICENSE
```

### L'en-tête parapluie

```c
/* include/foo/foo.h */
#ifndef FOO_H
#define FOO_H
#include <foo/string.h>
#include <foo/list.h>
#endif
```

### Le rôle du préfixe de dossier

```c
#include <foo/string.h>   /* la bibliothèque : aucune ambiguïté */
#include <string.h>       /* la libc : intacte */
```

## Cas d'usage

- **Installer proprement** : `cp -r include/foo $(PREFIX)/include/` copie exactement la surface publique, sans tri à faire.
- **Auditer l'API** : `ls include/foo/` donne la liste exhaustive de ce qui est promis à l'utilisateur.
- **Valider l'ergonomie** : compiler `examples/` avec les seuls `-Iinclude` prouve qu'aucun en-tête privé n'a fuité.

## Avantages et inconvénients

✅ **Avantages** :
- La frontière public/privé devient une propriété du système de fichiers, donc difficile à violer par accident.
- Le préfixe `foo/` élimine les collisions de noms d'en-têtes.
- Structure reconnue : Make, CMake et les packagers s'y attendent.

❌ **Inconvénients** / Limites :
- Deux `-I` à gérer (`-Iinclude -Isrc`) au lieu d'un seul.
- Chemins plus longs, redondance apparente `include/foo/foo.h`.

## Connexions

### Notes liées
- [[C - en-tête public vs en-tête privé]] - La règle que cette arborescence matérialise
- [[C - Makefile de bibliothèque]] - Le build qui l'exploite
- [[C - organisation multi-fichiers (headers)]] - Le cas simple, sans frontière publique
- [[GIT : _.gitignore_ - artefacts de compilation C et C++]] - Pourquoi `build/` reste hors du dépôt
- [[CMAKE : [target_include_directories] - propager les répertoires d'en-têtes]] - L'équivalent côté CMake

### Dans le contexte de
- [[C - bibliothèque statique vs bibliothèque partagée]] - Ce que ce projet produit au final
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/Créer sa librairie en C-C++.md` (chapitre 2)

---
**Tags thématiques** : #c #bibliotheque #organisation #build #api
