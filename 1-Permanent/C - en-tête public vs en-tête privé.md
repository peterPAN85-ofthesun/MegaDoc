---
type: permanent
created: 2026-09-29 16:30
tags:
  - permanent
  - c
  - bibliotheque
  - api
  - headers
---

# C - en-tête public vs en-tête privé

> [!abstract] Concept
> Un en-tête **public** (`include/foo/`) ne contient que ce dont l'utilisateur a besoin — prototypes, types opaques, constantes, macros d'API — tandis qu'un en-tête **privé** (`src/`) porte la définition réelle des structures et les fonctions internes, et n'est jamais installé.

## Explication

La séparation répond à une question simple : *que promet-on à l'utilisateur ?* Tout ce qui figure dans un en-tête public devient un engagement — on ne peut plus le renommer, le réordonner ni le supprimer sans casser du code existant, et souvent sans casser l'[[ABI - Application Binary Interface]]. Plus la surface publique est petite, plus la bibliothèque reste libre d'évoluer. Un en-tête public bien écrit se limite donc aux prototypes de l'API, aux `typedef` de [[C - type opaque (encapsulation et stabilité ABI)|types opaques]], aux constantes et aux quelques macros que l'utilisateur doit vraiment manipuler.

L'en-tête privé est l'exact complément : il définit `struct foo_list` en entier, déclare les helpers internes, et n'est visible que des `.c` de la bibliothèque, compilés avec `-Isrc`. Il disparaît à l'installation — rien dans `src/` n'est copié chez l'utilisateur. Cette asymétrie explique pourquoi l'[[C - arborescence d'un projet de bibliothèque|arborescence]] met physiquement les deux familles dans des dossiers distincts : la règle devient vérifiable, au lieu de reposer sur la discipline.

Une convention de nommage complète le dispositif. Les symboles publics portent le préfixe de la bibliothèque (`foo_list_push`), les symboles internes un **double underscore** (`foo__list_node_free`) : la lecture d'un appel suffit alors à savoir de quel côté de la frontière on se trouve. Côté binaire, `-fvisibility=hidden` fait la même chose pour l'éditeur de liens, en empêchant les symboles internes de sortir du `.so`.

## Exemples

### En-tête public — que des déclarations

```c
/* include/foo/list.h */
#ifndef FOO_LIST_H
#define FOO_LIST_H

#include <stddef.h>

typedef struct foo_list foo_list_t;   /* type OPAQUE : structure cachée */

foo_list_t *foo_list_new(void);
int         foo_list_push(foo_list_t *list, void *data);
size_t      foo_list_size(const foo_list_t *list);
void        foo_list_free(foo_list_t *list);

#endif /* FOO_LIST_H */
```

### En-tête privé — la définition réelle

```c
/* src/list/list_internal.h */
#ifndef FOO_LIST_INTERNAL_H
#define FOO_LIST_INTERNAL_H

#include "foo/list.h"

struct foo_list {
    struct node *head;
    size_t       size;
};

void foo__list_node_free(struct node *n);   /* double underscore = interne */

#endif
```

### Ce qui va de quel côté

| Élément | Public | Privé |
|---|---|---|
| Prototypes de l'API | ✅ | |
| `typedef struct foo_list foo_list_t;` | ✅ | |
| `struct foo_list { ... };` | | ✅ |
| Constantes et codes d'erreur de l'API | ✅ | |
| Helpers `foo__*` | | ✅ |
| `static inline` de commodité | ✅ (avec prudence) | |

## Cas d'usage

- **Réduire la surface d'API** : déplacer un prototype de `include/` vers `src/` libère la liberté de le modifier.
- **Éviter les inclusions parasites** : l'en-tête public n'inclut que le strict nécessaire (`<stddef.h>` plutôt que `<stdlib.h>`), ce qui allège tout ce qui le consomme.
- **Tester l'interne** : un test peut inclure l'en-tête privé via `-Isrc`, ce qu'un utilisateur ne peut pas faire.

## Avantages et inconvénients

✅ **Avantages** :
- Liberté d'évolution : ce qui n'est pas publié peut être changé à tout moment.
- Documentation implicite : `include/foo/` **est** la documentation de l'API.
- Compilation plus rapide chez l'utilisateur : moins d'en-têtes tirés.

❌ **Inconvénients** / Limites :
- Impose de passer par des accesseurs là où un accès direct au champ suffirait.
- Deux chemins d'inclusion à maintenir dans le build (`-Iinclude -Isrc`).

## Connexions

### Notes liées
- [[C - type opaque (encapsulation et stabilité ABI)]] - Ce qui permet de garder la structure privée
- [[C - arborescence d'un projet de bibliothèque]] - La traduction en dossiers de cette règle
- [[C - en-tête et bibliothèque (déclarer vs définir)]] - Déclaration vs définition, l'étage en dessous
- [[GCC : [-fvisibility] - visibilité des symboles]] - La même frontière, côté symboles binaires
- [[C - organisation multi-fichiers (headers)]] - Le cas simple sans frontière publique

### Dans le contexte de
- [[ABI - Application Binary Interface]] - Ce que la surface publique engage
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/Créer sa librairie en C-C++.md` (chapitre 2a)

---
**Tags thématiques** : #c #bibliotheque #api #headers #encapsulation
