---
type: permanent
created: 2026-09-29 16:32
tags:
  - permanent
  - c
  - abi
  - bibliotheque
  - encapsulation
---

# C - type opaque (encapsulation et stabilité ABI)

> [!abstract] Concept
> Un type opaque est une structure **déclarée sans être définie** dans l'en-tête public : l'utilisateur ne peut la manipuler que par pointeur et par les fonctions fournies, ce qui libère la bibliothèque de toute contrainte sur la disposition de ses champs.

## Explication

Le problème naît de ce que le compilateur doit savoir pour traduire un accès direct. Si l'en-tête public définit `struct foo_list { void *head; size_t size; };`, alors le binaire de l'utilisateur contient, en dur, la **taille** de la structure (pour l'allouer sur sa pile) et l'**offset** de chaque champ (pour y accéder). Ces constantes sont gravées au moment où *son* programme est compilé, pas au moment où la bibliothèque l'est.

Vient une version 1.1 qui insère `void *tail;` entre les deux champs. Le code de l'utilisateur compile toujours, mais son binaire — qui n'a pas été recompilé, c'est tout l'intérêt d'une [[C - bibliothèque statique vs bibliothèque partagée|bibliothèque partagée]] — continue de lire `size` à l'ancien offset, où se trouve désormais `tail`. Pire : s'il avait déclaré la structure sur sa pile, il n'a réservé que deux champs là où la bibliothèque en écrit trois, et l'écriture déborde. C'est une rupture d'[[ABI - Application Binary Interface|ABI]], silencieuse à la compilation.

La parade est de ne déclarer dans l'en-tête public que l'existence du type : `typedef struct foo_list foo_list_t;`. Le compilateur sait alors qu'un `foo_list_t` existe, sait manipuler un `foo_list_t *` (tous les pointeurs ont la même taille), mais ignore tout du contenu. La définition réelle vit dans un [[C - en-tête public vs en-tête privé|en-tête privé]] ou directement dans le `.c`. La contrepartie côté utilisateur est une discipline stricte : tout passe par des pointeurs, l'allocation et la libération deviennent l'affaire de la bibliothèque — en pratique un **constructeur** et un **destructeur**.

## Exemples

### Le problème : un type visible

```c
/* include/foo/list.h — version 1.0 */
struct foo_list {
    void   *head;
    size_t  size;
};
```

```c
/* code utilisateur, compilé une fois pour toutes */
struct foo_list list;        /* allouée sur SA pile : taille figée */
foo_list_init(&list);
printf("%zu\n", list.size);  /* offset figé */
```

```c
/* include/foo/list.h — version 1.1 */
struct foo_list {
    void   *head;
    void   *tail;    /* nouveau : tout décale */
    size_t  size;
};
```

Le binaire non recompilé lit `tail` en croyant lire `size`, et l'initialisation par la nouvelle bibliothèque écrit un champ de plus que ce qui a été réservé.

### La solution : le type opaque

```c
/* include/foo/list.h */
typedef struct foo_list foo_list_t;   /* « ça existe », sans plus */

foo_list_t *foo_list_new(void);
size_t      foo_list_size(const foo_list_t *list);
void        foo_list_free(foo_list_t *list);
```

```c
/* src/list/list.c — la définition réelle, libre d'évoluer */
struct foo_list {
    void   *head;
    size_t  size;
};

foo_list_t *foo_list_new(void)
{
    return calloc(1, sizeof(struct foo_list));
}

size_t foo_list_size(const foo_list_t *list)
{
    return list->size;
}
```

### Ce que l'utilisateur peut et ne peut pas faire

```c
foo_list_t *list = foo_list_new();      /* OK */
printf("%zu\n", foo_list_size(list));   /* OK */
foo_list_free(list);                    /* OK */

foo_list_t list;        /* ERREUR : taille inconnue */
list->size;             /* ERREUR : contenu inconnu */
```

## Cas d'usage

- **Bibliothèque partagée évolutive** : ajouter des champs de version en version sans casser un seul programme client.
- **Encapsulation stricte** : garantir qu'aucun utilisateur ne dépend d'un détail d'implémentation (cas de `FILE` dans la libc, `pthread_mutex_t` partiellement opaque, `sqlite3`).
- **Handles système** : représenter une ressource (socket, contexte, connexion) dont le contenu ne regarde que la bibliothèque.

## Avantages et inconvénients

✅ **Avantages** :
- L'implémentation peut changer entièrement sans recompilation côté utilisateur.
- Encapsulation réelle : les invariants de la structure ne peuvent pas être violés de l'extérieur.
- Temps de compilation réduit chez l'utilisateur (moins de détails à traiter).

❌ **Inconvénients** / Limites :
- Allocation obligatoirement dynamique : plus de structure sur la pile, coût d'un `malloc` par objet.
- Un appel de fonction par accès à un champ, là où un accès direct était gratuit — indirection non *inlinable* à travers un `.so`.
- Impose d'écrire et de documenter un constructeur/destructeur pour chaque type.

## Connexions

### Notes liées
- [[ABI - Application Binary Interface]] - Le contrat que la technique protège
- [[C - en-tête public vs en-tête privé]] - Où vit la déclaration, où vit la définition
- [[C - structures (struct)]] - La définition complète, côté implémentation
- [[C - pointeurs (concepts de base)]] - Le seul mode de manipulation autorisé
- [[C - allocation dynamique (malloc free)]] - Ce que fait le constructeur en interne
- [[C - programmation orientée objet]] - Type opaque + fonctions = encapsulation à la C

### Dans le contexte de
- [[C - bibliothèque statique vs bibliothèque partagée]] - Indispensable côté partagé, facultatif côté statique
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/Créer sa librairie en C-C++.md` (chapitre 2b)

---
**Tags thématiques** : #c #abi #encapsulation #bibliotheque #api
