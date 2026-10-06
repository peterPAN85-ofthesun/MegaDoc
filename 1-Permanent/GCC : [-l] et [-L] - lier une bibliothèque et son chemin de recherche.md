---
type: permanent
created: 2026-09-30 01:58
tags:
  - permanent
  - gcc
  - linkage
  - build
---

# GCC : [-l] et [-L] - lier une bibliothèque et son chemin de recherche

> [!abstract] Concept
> `-Lchemin` ajoute un répertoire à la liste où l'éditeur de liens cherche les bibliothèques, `-lfoo` demande à lier `libfoo.so`/`libfoo.a` ; les `-L` sont valables quelle que soit leur position, mais **un `-l` doit impérativement être écrit après les fichiers sources ou objets qui l'utilisent**, sinon l'archive est lue alors qu'aucun symbole n'est encore réclamé et se retrouve ignorée.

## Explication

Les deux options travaillent en couple mais ne font pas la même chose. `-L` ne lie rien : il **enrichit le chemin de recherche** de `ld`, exactement comme `PATH` pour le shell. `-l` est la demande de liaison proprement dite : `-lfoo` fait construire à `ld` les noms `libfoo.so` puis `libfoo.a`, qu'il cherche dans chaque répertoire `-L` dans l'ordre de leur apparition, avant de retomber sur ses `SEARCH_DIR` internes (`/usr/lib`, `/usr/local/lib`…). D'où les deux messages d'erreur à ne pas confondre : `cannot find -lfoo` signifie que le **fichier** est introuvable — c'est un problème de `-L` ; `undefined reference to 'foo'` signifie que le fichier a été trouvé et lu, mais que le symbole n'en a pas été extrait — c'est presque toujours un problème d'**ordre** du `-l`.

C'est là le point décisif : **la position de `-l` sur la ligne de commande fait partie de sa sémantique**. `ld` parcourt ses arguments en une seule passe, de gauche à droite, et d'une archive il n'extrait que les membres résolvant un symbole *déjà* indéfini à l'instant où il la lit. Écrire `gcc -lfoo main.c -o prog` échoue donc : quand `libfoo.a` est examinée, la liste des symboles manquants est vide, l'archive est abandonnée sans retour possible, puis `main.o` réclame `foo()` — trop tard. La forme correcte place la bibliothèque en dernier : `gcc main.c -Llibdir -lfoo -o prog`. La règle se prolonge entre bibliothèques : si `libA` dépend de `libB`, il faut écrire `-lA -lB`, la plus dépendante d'abord (voir [[C - ordre de résolution des archives au link]] pour les dépendances croisées et `--start-group`).

`-L`, à l'inverse, est **insensible à sa position** : le manuel de GNU `ld` précise que tous les `-L` s'appliquent à tous les `-l`, dans quelque ordre qu'ils apparaissent. `gcc main.c -lfoo -Llibdir` fonctionne donc, même si l'usage veut qu'on groupe `-L` avant les `-l` par lisibilité. Seul l'ordre **des `-L` entre eux** compte, puisqu'il détermine quelle copie de `libfoo.a` est trouvée en premier lorsque plusieurs existent. Enfin, `-L` n'influence que l'édition de liens : pour qu'un `.so` soit retrouvé **à l'exécution**, il faut `-Wl,-rpath` ou `LD_LIBRARY_PATH`, car le chemin de compilation n'est pas mémorisé dans le binaire.

## Exemples

### La règle d'or : la bibliothèque après les sources

```bash
# ÉCHOUE — libfoo est lue avant que main.c ne réclame quoi que ce soit
$ gcc -Llibdir -lfoo main.c -o prog
/usr/bin/ld : main.c:(.text+0x5) : référence indéfinie vers « foo »

# CORRECT — les sources d'abord, la bibliothèque ensuite
$ gcc main.c -Llibdir -lfoo -o prog
$ ./prog; echo $?
42
```

### Les deux erreurs à distinguer

| Message | Cause | Correctif |
|---|---|---|
| `cannot find -lfoo` | Le fichier `libfoo.a`/`.so` n'est pas dans les chemins connus | Ajouter le bon `-L` |
| `undefined reference to 'foo'` | L'archive a été lue trop tôt, ou une dépendance manque | Déplacer le `-l` **après** les objets |

### `-L` est indifférent à sa place, `-l` non

```bash
gcc main.c -lfoo -Llibdir -o prog    # fonctionne : tous les -L valent pour tous les -l
gcc -Llibdir -lfoo main.c -o prog    # échoue   : le -l est passé avant l'objet
```

### Plusieurs `-L` : leur ordre entre eux décide

```bash
gcc main.c -L./build -L/usr/local/lib -lfoo   # ./build/libfoo.a gagne
gcc main.c -L/usr/local/lib -L./build -lfoo   # /usr/local/lib/libfoo.a gagne
```

### Lier, puis retrouver le `.so` à l'exécution

```bash
gcc main.c -Lbuild -lfoo -o prog                        # link OK
./prog                                                  # error while loading shared libraries
gcc main.c -Lbuild -lfoo -Wl,-rpath,'$ORIGIN/build' -o prog   # chemin inscrit dans le binaire
```

### Observer la recherche quand `-L` semble bon

```bash
gcc main.c -Llibdir -lfoo -Wl,--verbose -o prog | grep libfoo
# attempt to open libdir/libfoo.so failed
# attempt to open libdir/libfoo.a succeeded
```

## Cas d'usage

- **Lier une bibliothèque locale non installée** : `-Ibuild/include` pour compiler, `-Lbuild -lfoo` pour lier.
- **Déboguer un `undefined reference`** alors que la bibliothèque est bien passée : vérifier d'abord que son `-l` est bien *après* les objets.
- **Préférer une copie locale à celle du système** : placer son `-L` avant les autres.
- **Cross-compilation** : `-L` du sysroot cible, et `-Wl,--verbose` pour s'assurer qu'aucun chemin de l'hôte ne s'est glissé dans la résolution.

## Avantages et inconvénients

✅ **Avantages** :
- Écriture courte et portable sur tout Unix ; `-l` reste équivalent au chemin complet de l'archive, toujours utilisable en dernier recours.
- La séparation « où chercher » (`-L`) / « quoi lier » (`-l`) permet de rejouer le même link sur un autre sysroot en ne changeant que les `-L`.

❌ **Inconvénients** / Limites :
- La contrainte d'ordre de `-l` n'est signalée par aucun message explicite : elle se manifeste sous forme d'`undefined reference` trompeur.
- Le plugin LTO de `gcc` réexamine parfois les archives et **masque** une erreur d'ordre, qui ressurgit sur une autre chaîne d'outils (`-fno-use-linker-plugin` pour la faire apparaître).
- `-L` ne vaut que pour le link : il ne règle rien pour le chargement dynamique à l'exécution.
- Un `-L` mal placé dans l'ordre des `-L` peut lier silencieusement la mauvaise version d'une bibliothèque.

## Connexions

### Notes liées
- [[C - ordre de résolution des archives au link]] - Le mécanisme de la passe unique qui impose la position du `-l`
- [[C - convention -lfoo et recherche des archives]] - Comment le nom `libfoo.a` est construit et cherché
- [[GCC : [-I] et [-i*] - chemins de recherche des en-têtes]] - Le pendant de `-L` à l'étape de compilation
- [[C - compilation et linkage]] - Quelle étape reçoit `-L` et `-l`
- [[C - bibliothèque statique vs bibliothèque partagée]] - Ce que `-l` finit par choisir entre `.a` et `.so`
- [[CMAKE : [target_link_libraries] - lier bibliothèques Qt]] - L'équivalent déclaratif, qui gère l'ordre à notre place

### Dans le contexte de
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Manuel GNU `ld`, options `-l` / `-L`
- Vérifications en session sur GCC 16.2.1 (2026-09-30)

---
**Tags thématiques** : #gcc #linkage #ld #build #bibliothèques
