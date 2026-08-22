---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - c
  - linkage
  - build
---

# C - convention -lfoo et recherche des archives

> [!abstract] Concept
> `-lfoo` demande à `ld` de chercher `libfoo.so` puis `libfoo.a` dans les répertoires `-L` dans l'ordre, puis dans ses `SEARCH_DIR` internes ; ce n'est que du sucre syntaxique — donner le chemin complet de l'archive produit exactement le même binaire.

## Explication

Pour `-lfoo`, l'éditeur de liens construit le nom de fichier en collant le préfixe `lib` et le suffixe d'archive. Il cherche d'abord dans chaque répertoire `-L` **dans l'ordre où ils apparaissent** sur la ligne de commande, puis dans les `SEARCH_DIR` compilés dans le linker (visibles avec `ld --verbose`). Sur une cible hébergée classique il tente `libfoo.so` avant `libfoo.a`, le lien dynamique étant privilégié ; sur une cible purement statique, seul `.a` est sondé.

`-Wl,--verbose` rend ce parcours entièrement observable, ce qui est l'outil de diagnostic à réflexe quand un `cannot find -l…` apparaît alors que le fichier semble présent.

La convention n'a **rien d'universel**. Le langage C n'en dit rien : la norme ISO ne connaît ni fichier objet, ni bibliothèque, ni édition de liens. POSIX la standardise pour `c99`/`cc` et `ld`, mapping `libfoo.a` compris — c'est l'étage où elle devient contractuelle. Les chaînes d'outils (GNU binutils, LLVM `lld`) l'implémentent. MSVC, lui, ne suit pas : on y écrit `foo.lib`, sans préfixe `lib`. Ce préfixe est un héritage direct d'Unix des années 70.

## Exemples

### Observer la recherche

```bash
gcc -o prog foo.o -Wl,--verbose -lfoo
```

```
attempt to open /tmp/libfoo.a failed
attempt to open /usr/lib/libfoo.a succeeded
```

### `-l` est du sucre syntaxique

```bash
gcc -o prog foo.o /usr/lib/libfoo.a /usr/lib/libbar.a
# strictement équivalent à :
gcc -o prog foo.o -L/usr/lib -lfoo -lbar
```

### Les conventions selon la plateforme

| Plateforme | Écriture | Fichier cherché |
|---|---|---|
| Unix / Linux / *BSD | `-lfoo` | `libfoo.so`, `libfoo.a` |
| macOS | `-lfoo` | `libfoo.dylib`, `libfoo.a` |
| MSVC | `foo.lib` ou `/DEFAULTLIB:foo` | `foo.lib` — **pas de préfixe `lib`** |

## Cas d'usage

- **Diagnostiquer un `cannot find -l…`** : `-Wl,--verbose` montre les chemins essayés.
- **Forcer une version statique** : donner le chemin complet du `.a`.
- **Cross-compilation** : vérifier que les `SEARCH_DIR` internes ne pointent pas vers l'hôte.

## Avantages et inconvénients

✅ **Avantages** :
- Écriture courte et portable entre Unix, Linux, BSD et macOS.
- Le chemin complet reste toujours possible en dernier recours.

❌ **Inconvénients** / Limites :
- Non portable vers MSVC.
- La préférence `.so` sur `.a` peut lier une bibliothèque dynamique sans qu'on l'ait voulu.

## Connexions

### Notes liées
- [[C - en-tête et bibliothèque (déclarer vs définir)]] - Ce que `-l` apporte réellement
- [[C - ordre de résolution des archives au link]] - Pourquoi la position du `-l` compte
- [[GCC - driver et non compilateur]] - Qui reçoit ces options
- [[PS2SDK - bibliothèques injectées par les specs GCC]] - Un cas de `-l` implicites

- [[ELF - Executable and Linkable Format]] - Ce que contient l'archive trouvée

### Dans le contexte de
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitres 7d et 7e)

---
**Tags thématiques** : #c #linkage #ld #build #posix
