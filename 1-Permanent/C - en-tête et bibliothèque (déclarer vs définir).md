---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - c
  - compilation
  - linkage
---

# C - en-tête et bibliothèque (déclarer vs définir)

> [!abstract] Concept
> Un en-tête **déclare** (prototypes, types, macros) et est consommé par le préprocesseur ; une bibliothèque **définit** (code machine) et est consommée par l'éditeur de liens — les deux sont indépendants, ce qui rend le réflexe « un `#include` → un `-l` » faux dans les deux sens.

## Explication

C'est la distinction qui explique la moitié des erreurs de build en C. L'en-tête est localisé par `-I` et son absence produit `unknown type name` ou `implicit declaration of function`, à la compilation. La bibliothèque est localisée par `-L`, désignée par `-l`, et son absence produit `undefined reference to 'f'`, à l'édition de liens. Deux étapes, deux options, deux familles de messages.

Le réflexe erroné se manifeste dans un sens quand un en-tête ne contient que des `#define`, des macros et des `static inline`. Tout est résolu à la compilation, **il n'existe aucune archive à lier** — c'est la catégorie dite *header-only*, et ajouter un `-l` produit alors un `cannot find -l…` trompeur qui laisse croire à une installation incomplète.

Il se manifeste dans l'autre sens quand une bibliothèque est liée sans qu'on inclue le moindre de ses en-têtes : il suffit qu'un autre objet en réclame les symboles. C'est notamment le cas des bibliothèques que le toolchain ajoute d'office.

## Exemples

### Le tableau de correspondance

| | En-tête (`.h`) | Bibliothèque (`.a` / `.so`) |
|---|---|---|
| Contient | des **déclarations** : prototypes, types, macros | des **définitions** : le code machine |
| Consommé par | le préprocesseur (`#include`) | l'éditeur de liens (`-l`) |
| Localisé par | `-I` | `-L` |
| Si absent | `unknown type name`, `implicit declaration of function` | `undefined reference to 'f'` |

### Un en-tête sans bibliothèque

```c
/* macros.h — entièrement résolu à la compilation */
#define PACK(A, B) (((A) << 16) | (B))
typedef unsigned int u32;
```

Aucune archive `libmacros.a` n'existe ni ne peut exister : ajouter `-lmacros` échoue.

### Les deux erreurs, à deux étapes différentes

```bash
gcc -c foo.c                  # implicit declaration → il manque un -I ou un #include
gcc -o prog foo.o             # undefined reference  → il manque un -l
```

## Cas d'usage

- **Diagnostiquer une erreur de build** : le message dit à quelle étape chercher.
- **Écrire un Makefile minimal** : ne lister que les archives réellement nécessaires.
- **Utiliser une bibliothèque header-only** : `#include` seul, jamais de `-l`.

## Avantages et inconvénients

✅ **Avantages** :
- Séparation nette qui permet de distribuer en-têtes et binaires indépendamment.
- Les bibliothèques header-only n'ont aucun coût de lien.

❌ **Inconvénients** / Limites :
- Le message `have you installed the static version of…` oriente vers une fausse piste.
- Rien dans le nom d'un en-tête n'indique s'il a une archive associée.

## Connexions

### Notes liées
- [[GCC - driver et non compilateur]] - Quelle étape consomme quelle option
- [[C - convention -lfoo et recherche des archives]] - Comment `-l` est résolu
- [[C - organisation multi-fichiers (headers)]] - Le rôle des en-têtes dans un projet
- [[PS2SDK - en-têtes header-only sans archive]] - Une instanciation concrète
- [[C - compilation et linkage]] - Les étapes de build

- [[ELF - Executable and Linkable Format]] - Où vivent réellement déclarations et définitions dans le binaire

### Dans le contexte de
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 7c)

---
**Tags thématiques** : #c #compilation #linkage #headers #build
