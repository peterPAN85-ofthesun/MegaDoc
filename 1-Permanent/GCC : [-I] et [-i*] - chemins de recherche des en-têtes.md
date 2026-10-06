---
type: permanent
created: 2026-09-30 01:58
tags:
  - permanent
  - gcc
  - préprocesseur
  - compilation
  - build
---

# GCC : [-I] et [-i*] - chemins de recherche des en-têtes

> [!abstract] Concept
> `-Ichemin` ajoute un répertoire en tête de la liste où le préprocesseur cherche les `#include` ; **il n'existe pas d'option `-i` seule** — la minuscule désigne une famille (`-include`, `-iquote`, `-isystem`, `-idirafter`, `-imacros`) qui sert à forcer une inclusion ou à insérer un répertoire ailleurs que dans la liste prioritaire.

## Explication

`-I` est le pendant exact de [[GCC : [-l] et [-L] - lier une bibliothèque et son chemin de recherche|`-L`]], mais une étape plus tôt : il agit sur `cpp` alors que `-L` agit sur `ld`. Le préprocesseur entretient **deux listes** de répertoires. La première, dite *quoted*, ne sert qu'aux `#include "…"` et commence par le répertoire du fichier qui inclut. La seconde, dite *system* ou *angle-bracket*, sert aux `#include <…>` et aux `#include "…"` restés introuvables dans la première ; elle se termine par les répertoires par défaut de la chaîne (`/usr/include`…). `-Ichemin` ajoute le répertoire **à la fin de la liste *quoted* et au début de la liste *system***, donc avant tous les répertoires système : c'est ce qui permet de faire primer un en-tête local sur celui du système. L'ordre **des `-I` entre eux** est significatif — le premier qui contient le fichier gagne, les suivants ne sont pas consultés — mais leur position relative aux fichiers sources n'a aucune importance, contrairement à ce qui vaut pour `-l`.

Il n'y a pas de symétrie parfaite avec le couple `-l`/`-L` : **`gcc -i` n'existe pas** et provoque une erreur `option « -i » non reconnue`. Ce que la minuscule couvre, c'est un jeu d'options dont le rôle est de placer un répertoire *autrement* que `-I`, ou d'injecter un fichier sans passer par le source. `-iquote rep` ne l'ajoute qu'à la liste des `#include "…"`, ce qui évite qu'un chemin privé ne capture un `<stdio.h>`. `-isystem rep` le déclare **répertoire système** : les avertissements y sont supprimés, ce qui est la bonne option pour les en-têtes de tiers qu'on ne veut pas voir polluer un build en `-Wall -Werror`. `-idirafter rep` le place *après* les répertoires par défaut, donc en position de repli. Ces trois-là dessinent une échelle de priorité qui va de `-iquote` (le plus prioritaire, mais restreint) à `-idirafter` (le dernier consulté).

Restent les deux options qui ne sont pas des chemins mais des **inclusions forcées**. `-include fichier.h` insère le fichier comme si un `#include` figurait en toute première ligne de chaque unité de compilation, sans modifier une ligne de source : c'est le mécanisme des en-têtes de configuration générés par le build (le `config.h` d'`autotools`, ce que [[CMAKE : [configure_file] - générer un en-tête depuis un template .h.in|`configure_file`]] produit) et des *prefix headers*. `-imacros fichier.h` fait de même mais **ne garde que les macros** définies par le fichier, en jetant ses déclarations — utile pour propager un jeu de `#define` sans traîner de types. Les deux sont à manier avec parcimonie : un en-tête inclus de force est invisible à la lecture du fichier, et la moindre erreur de compilation devient difficile à rattacher à sa cause.

## Exemples

### L'ordre des `-I` décide de l'en-tête retenu

```c
// m.c
#include "pick.h"
int main(void){ printf("WHICH=%d\n", WHICH); }
```

```bash
$ echo '#define WHICH 1' > a/pick.h ; echo '#define WHICH 2' > b/pick.h
$ gcc -Ia -Ib m.c -o m && ./m      # WHICH=1
$ gcc -Ib -Ia m.c -o m && ./m      # WHICH=2
```

### Voir les deux listes réelles

```bash
$ echo | gcc -E -Ia -iquote b -isystem sysinc -idirafter lateinc -v -x c - 2>&1 | sed -n '/#include/,/End of/p'
#include "..." search starts here:
 b                                                  ← -iquote : uniquement les "..."
#include <...> search starts here:
 a                                                  ← -I      : avant tout le système
 sysinc                                             ← -isystem: système, sans warnings
 /usr/lib/gcc/x86_64-pc-linux-gnu/16/include
 /usr/local/include
 /usr/include
 lateinc                                            ← -idirafter : en dernier recours
End of search list.
```

### La famille `-i*` en un tableau

| Option | Effet |
|---|---|
| `-I rep` | Ajoute `rep` avant les répertoires système, pour `"…"` comme pour `<…>`. |
| `-iquote rep` | Ajoute `rep` **uniquement** pour les `#include "…"`. |
| `-isystem rep` | Ajoute `rep` comme répertoire **système** : avertissements supprimés dans ces en-têtes. |
| `-idirafter rep` | Ajoute `rep` **après** les répertoires par défaut : position de repli. |
| `-include f.h` | Inclut `f.h` comme si c'était la première ligne du source. |
| `-imacros f.h` | Comme `-include`, mais ne conserve que les macros de `f.h`. |
| `-i` | **N'existe pas** : `option « -i » non reconnue sur la ligne de commande`. |

### `-include` : compiler sans toucher au source

```c
// n.c — VAL n'est défini nulle part dans le fichier
int main(void){ return VAL; }
```

```bash
$ echo '#define VAL 7' > pre.h
$ gcc -include pre.h n.c -o n && ./n; echo $?
7
```

### `-isystem` pour faire taire les en-têtes de tiers

```bash
gcc -Wall -Werror -Ivendor/include main.c         # échoue sur un warning venu de vendor/
gcc -Wall -Werror -isystem vendor/include main.c  # compile : vendor/ traité comme système
```

## Cas d'usage

- **Bibliothèque non installée** : `-Iinclude` pour compiler, `-Lbuild -lfoo` pour lier — les deux moitiés du même problème.
- **Faire primer un en-tête local** sur la version installée dans `/usr/include` : `-I` suffit, le système vient toujours après.
- **Dépendance tierce bruyante** : `-isystem` au lieu de `-I`, pour garder `-Wall -Werror` sur son propre code.
- **En-tête de configuration généré** : `-include build/config.h`, sans polluer chaque fichier d'un `#include` conditionnel.
- **Diagnostiquer un `No such file or directory`** sur un `#include` : `gcc -E -v` affiche les listes exactes que le préprocesseur a parcourues.

## Avantages et inconvénients

✅ **Avantages** :
- `-I` est insensible à sa position sur la ligne de commande, ce qui en fait une option beaucoup moins piégeuse que `-l`.
- La famille `-i*` donne un contrôle fin de la priorité et du statut « système » d'un répertoire, là où `-I` n'offre qu'un seul comportement.
- `-include` permet d'imposer une configuration à tout un build sans modifier une ligne de source.

❌ **Inconvénients** / Limites :
- Empiler les `-I` finit par capturer des en-têtes inattendus : deux `pick.h` dans deux répertoires, et le résultat dépend de l'ordre des options.
- `-isystem` supprime les avertissements, donc peut masquer un vrai problème dans un en-tête qu'on maintient soi-même.
- `-include` et `-imacros` rendent le source incomplet à la lecture : le fichier ne dit plus d'où viennent ses macros.
- L'absence de `-i` fait perdre du temps à qui raisonne par analogie avec `-l`/`-L`.

## Connexions

### Notes liées
- [[GCC : [-l] et [-L] - lier une bibliothèque et son chemin de recherche]] - Le couple équivalent à l'étape d'édition de liens
- [[C - directives préprocesseur (define include)]] - Les `#include` que ces options servent à résoudre
- [[C - compilation et linkage]] - Pourquoi `-I` s'adresse à `cpp` et `-L` à `ld`
- [[C - en-tête public vs en-tête privé]] - Ce que `-I` expose et ce que `-iquote` permet de garder
- [[CMAKE : [target_include_directories] - propager les répertoires d'en-têtes]] - L'équivalent déclaratif, `SYSTEM` compris
- [[GCC : [-MMD -MP] - génération des fichiers de dépendances]] - Suivre les en-têtes effectivement trouvés par ces chemins

### Dans le contexte de
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Manuel GCC, *Options for Directory Search* (`-I`, `-iquote`, `-isystem`, `-idirafter`) et *Preprocessor Options* (`-include`, `-imacros`)
- Vérifications en session sur GCC 16.2.1 (2026-09-30)

---
**Tags thématiques** : #gcc #préprocesseur #include #compilation #build
