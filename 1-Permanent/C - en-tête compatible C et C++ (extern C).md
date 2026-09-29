---
type: permanent
created: 2026-09-29 16:34
tags:
  - permanent
  - c
  - cpp
  - headers
  - linkage
---

# C - en-tête compatible C et C++ (extern C)

> [!abstract] Concept
> Encapsuler les déclarations d'un en-tête dans `extern "C" { }`, sous garde `#ifdef __cplusplus`, permet à une bibliothèque écrite en C d'être consommée depuis du C++ — sans cet ajout, le link échoue.

## Explication

Le C++ autorise la **surcharge** : plusieurs fonctions peuvent porter le même nom pourvu que leurs paramètres diffèrent. Pour que l'éditeur de liens les distingue, le compilateur C++ encode la signature complète dans le nom du symbole — c'est le *name mangling*. `void print(int)` devient quelque chose comme `_Z5printi`. Le C, qui ne connaît pas la surcharge, n'a pas ce besoin : `print` reste `print`.

Dès lors, si un fichier `.cpp` inclut un en-tête C, le compilateur C++ suppose que les fonctions déclarées suivent les règles C++ et cherche au link un symbole *manglé* — que l'archive C, compilée avec `gcc`, ne contient évidemment pas. Le résultat est un `undefined reference to 'print(int)'` typique, avec la signature entre parenthèses qui trahit le mangling. `extern "C"` désactive cet encodage pour le bloc concerné et rétablit l'[[ABI - Application Binary Interface|ABI]] C.

La macro `__cplusplus` est définie automatiquement par tous les compilateurs C++, et par aucun compilateur C. La garder en garde autour du `extern "C"` rend l'en-tête utilisable par les deux langages depuis un fichier unique : le compilateur C ne voit jamais une syntaxe qu'il ne comprend pas. La relation reste asymétrique — du C++ peut consommer du C, l'inverse n'est pas vrai, le C++ héritant du C mais pas le contraire.

## Exemples

### En-tête bilingue complet

```c
/* include/foo/list.h */
#ifndef FOO_LIST_H
#define FOO_LIST_H

#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct foo_list foo_list_t;   /* type OPAQUE : structure cachée */

foo_list_t *foo_list_new(void);
int         foo_list_push(foo_list_t *list, void *data);
size_t      foo_list_size(const foo_list_t *list);
void        foo_list_free(foo_list_t *list);

#ifdef __cplusplus
}
#endif
#endif /* FOO_LIST_H */
```

### Observer le mangling

```bash
$ gcc   -c print.c   && nm print.o | grep print
0000000000000000 T print

$ g++   -c print.cpp && nm print.o | grep print
0000000000000000 T _Z5printi          # signature encodée
```

### L'erreur sans `extern "C"`

```
undefined reference to `foo_list_new()'
```

La présence des parenthèses dans le message signale que le link cherche un symbole C++ : c'est la signature d'un `extern "C"` manquant.

## Cas d'usage

- **Publier une bibliothèque C** : l'ajout est gratuit et double la base d'utilisateurs potentiels.
- **Exposer une API C depuis du C++** : le motif inverse, pour offrir une façade stable et liable depuis n'importe quel langage (Python `ctypes`, Rust FFI, Go cgo passent tous par l'ABI C).
- **Interfacer du code historique** : envelopper un en-tête C tiers non modifiable dans `extern "C" { #include <legacy.h> }`.

## Avantages et inconvénients

✅ **Avantages** :
- Un seul en-tête sert les deux langages, sans duplication.
- L'ABI C est le plus petit dénominateur commun de l'interopérabilité entre langages.

❌ **Inconvénients** / Limites :
- Interdit dans le bloc tout ce qui est propre au C++ : surcharge, templates, références, `namespace`.
- Facile à oublier sur un en-tête ajouté après coup — l'erreur ne se voit qu'au link.

## Connexions

### Notes liées
- [[ABI - Application Binary Interface]] - Le contrat binaire que `extern "C"` rétablit
- [[C - en-tête public vs en-tête privé]] - L'en-tête où se place cette garde
- [[C - directives préprocesseur (define include)]] - `#ifdef` et compilation conditionnelle
- [[C++ - Classes (structure header-source)]] - L'organisation côté C++
- [[C - convention -lfoo et recherche des archives]] - L'étape de link où l'oubli se manifeste
- [[C - macros prédéfinies]] - `__cplusplus` fait partie des macros définies par le compilateur

### Dans le contexte de
- [[C - arborescence d'un projet de bibliothèque]] - Un détail de la surface publique
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/Créer sa librairie en C-C++.md` (chapitre 2a, encadré)

---
**Tags thématiques** : #c #cpp #headers #linkage #interoperabilite
