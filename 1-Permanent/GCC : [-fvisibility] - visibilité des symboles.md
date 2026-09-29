---
type: permanent
created: 2026-09-29 16:46
tags:
  - permanent
  - gcc
  - bibliotheque
  - linkage
  - abi
---

# GCC : [-fvisibility] - visibilité des symboles

> [!abstract] Concept
> `-fvisibility=` fixe la visibilité par défaut des symboles d'une bibliothèque partagée ; `hidden` les masque tous et impose de désigner un à un ceux qui composent l'API publique, réduisant d'autant la surface d'[[ABI - Application Binary Interface|ABI]] exposée.

## Explication

Par défaut, **tout** symbole non `static` d'un `.so` est exporté : chaque fonction interne devient visible, liable et interposable depuis l'extérieur. C'est l'inverse de ce qu'on veut d'une bibliothèque bien conçue — la [[C - en-tête public vs en-tête privé|frontière public/privé]] existe au niveau des en-têtes mais pas au niveau binaire, si bien qu'un utilisateur peut appeler un helper interne en le déclarant lui-même, et qu'une version ultérieure qui le supprime casse son programme.

`-fvisibility=hidden` renverse le défaut : rien ne sort, et l'API se construit par ajout explicite, via `__attribute__((visibility("default")))` — généralement caché derrière une macro `PUBLIC_API`. Le bénéfice va au-delà de l'hygiène : la table des symboles dynamiques rétrécit, le chargement est plus rapide, et l'éditeur de liens peut optimiser les appels internes puisqu'il sait qu'aucun ne sera interposé.

L'**interposition** est justement ce que gradue le reste de l'échelle. Un symbole `default` peut être remplacé à l'exécution par un autre portant le même nom (via `LD_PRELOAD`) : c'est le mécanisme qui permet de compter les appels d'une fonction, de journaliser ses arguments, de traquer les fuites en substituant `malloc`, ou d'ajouter ses propres contrôles de sécurité. `internal` et `protected` conservent la visibilité tout en interdisant ce remplacement, `protected` garantissant en outre qu'un appel via pointeur de fonction atteindra bien l'implémentation locale.

## Exemples

### Les quatre niveaux

| Option | Symboles exportés | Interposables |
|---|---|---|
| `-fvisibility=default` | ✅ tous | ✅ oui (remplaçables via `LD_PRELOAD`) |
| `-fvisibility=protected` | ✅ tous | ❌ non — protège même l'appel par pointeur de fonction |
| `-fvisibility=internal` | ✅ | ❌ non, avec garanties ABI supplémentaires |
| `-fvisibility=hidden` | ❌ aucun par défaut | — il faut les désigner un à un |

### Exporter explicitement avec `hidden`

```c
/* include/foo/foo.h */
#define PUBLIC_API __attribute__ ((visibility("default")))

PUBLIC_API void print_HelloWorld(void);
```

```bash
gcc -c -fPIC -fvisibility=hidden src/*.c
gcc -shared -o libfoo.so *.o
nm -D --defined-only libfoo.so   # ne liste plus que print_HelloWorld
```

### L'interposition en pratique

```c
/* tracer.c — compilé en .so et chargé avant la libc */
void *malloc(size_t n) {
    static void *(*real)(size_t);
    if (!real) real = dlsym(RTLD_NEXT, "malloc");
    void *p = real(n);
    fprintf(stderr, "malloc(%zu) = %p\n", n, p);
    return p;
}
```

```bash
LD_PRELOAD=./tracer.so ./prog
```

## Cas d'usage

- **Publier une bibliothèque partagée** : `-fvisibility=hidden` + `PUBLIC_API` fige une API minimale et explicite.
- **Instrumenter sans recompiler** : compter les appels, journaliser les arguments, détecter les fuites en interposant `malloc`/`free`.
- **Durcir une bibliothèque sensible** : `protected` empêche qu'une fonction critique soit détournée par interposition.

## Avantages et inconvénients

✅ **Avantages** :
- Surface d'ABI réduite au strict nécessaire : plus de liberté pour faire évoluer l'interne.
- Table des symboles dynamiques plus petite → chargement plus rapide.
- Appels internes optimisables (pas d'indirection PLT de précaution).

❌ **Inconvénients** / Limites :
- Un `PUBLIC_API` oublié se traduit par un `undefined reference` chez l'utilisateur, pas chez soi.
- `__attribute__` est une extension GCC/Clang : portabilité MSVC à traiter avec une macro conditionnelle (`__declspec(dllexport)`).
- Bloque l'interposition, y compris légitime (outils de profilage, mocks de test).

## Connexions

### Notes liées
- [[C - en-tête public vs en-tête privé]] - La même frontière, au niveau source
- [[ABI - Application Binary Interface]] - Ce que la visibilité engage ou protège
- [[GCC : [-fPIC] - code indépendant de la position]] - Son compagnon dans `PICFLAGS`
- [[ELF - Executable and Linkable Format]] - La table `.dynsym` que cette option remplit
- [[C - bibliothèque statique vs bibliothèque partagée]] - N'a de sens que côté partagé
- [[C - variables (déclaration et portée)]] - `static`, la visibilité au niveau unité de compilation

### Dans le contexte de
- [[C - arborescence d'un projet de bibliothèque]] - La conception d'API dont cette option est le versant binaire
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/Créer sa librairie en C-C++.md` (chapitre 3b)

---
**Tags thématiques** : #gcc #bibliotheque #symboles #abi #linkage
