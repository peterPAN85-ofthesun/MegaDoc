---
type: permanent
created: 2026-10-12 14:52
tags:
  - permanent
  - gdb
  - debug
  - c
---

# GDB - qualification de portée (fonction::variable)

> [!abstract] Concept
> L'opérateur `::` désigne une variable en précisant la portée où la chercher — `ma_fonction::compteur`, `'utils.c'::table` — ce qui permet d'atteindre un `static` ou une locale invisible depuis l'endroit où l'on est arrêté.

## Explication

`print` résout les noms dans la **portée du cadre de pile courant** : les locales de la fonction où l'on est arrêté, puis les globales. Tout le reste est hors d'atteinte et provoque `No symbol "x" in current context` — alors que la variable existe bel et bien dans le processus. Deux cas sont fréquents : une variable `static` locale à un autre fichier (invisible hors de son unité de compilation, cf. [[C - variables (déclaration et portée)]]), et une locale d'une fonction qui nous a appelés.

La syntaxe `portée::nom` lève cette restriction. `ma_fonction::compteur` cherche `compteur` dans la fonction nommée ; `'utils.c'::table` cherche dans le fichier nommé — les apostrophes sont nécessaires à cause du point du nom de fichier, que `gdb` interpréterait autrement comme un accès à un champ de structure. C'est aussi le moyen de trancher entre homonymes : une globale `log` masquée par une locale `log` reste accessible par `'main.c'::log`.

La limite est structurelle : une variable **locale** n'existe que tant que son cadre de pile vit. `fonction::variable` ne fonctionne donc que si cette fonction est effectivement **dans la pile d'appels** au moment de l'arrêt ; sinon `gdb` répond que la variable n'est pas disponible. Pour une locale `static`, en revanche, l'adresse est fixe pour toute la durée du programme et la qualification marche à tout moment. Lorsque la fonction est dans la pile, se déplacer avec [[GDB : [backtrace] - lire la pile d'appels|`up`]] est souvent plus commode : toutes ses locales redeviennent alors accessibles sans qualification.

## Exemples

### Atteindre un `static` d'un autre fichier

```c
/* utils.c */
static int appels = 0;          /* invisible depuis main.c */
void compute(void) { appels++; }
```

```
(gdb) p appels
No symbol "appels" in current context.
(gdb) p 'utils.c'::appels
$1 = 17
(gdb) p compute::appels         ← fonctionne aussi si le static est local à la fonction
```

### Trancher entre homonymes

```c
int taille = 1024;              /* globale */
void f(void) { int taille = 3;  /* masque la globale */ }
```

```
(gdb) p taille
$2 = 3                          ← la locale gagne
(gdb) p 'main.c'::taille
$3 = 1024                       ← la globale, explicitement
```

### Locale d'une fonction appelante

```
(gdb) bt
#0  compute (n=8) at utils.c:12
#1  main () at main.c:20
(gdb) p main::resultat          ← main est dans la pile : OK
$4 = 0
(gdb) p autre_fonction::x       ← pas dans la pile
No frame is currently executing in specified block.
```

## Cas d'usage

- **Compteur `static`** : lire un compteur d'appels caché dans un module sans l'exposer dans l'API.
- **Variable masquée** : vérifier la valeur d'une globale alors qu'une locale porte le même nom.
- **État de l'appelant** : consulter une variable de `main` sans quitter la fonction où l'on enquête.

## Avantages et inconvénients

✅ **Avantages** :
- Donne accès à l'état complet du processus, pas seulement à la portée lexicale courante.
- Seule façon d'atteindre un `static` de fichier depuis ailleurs.
- Se combine à tout le reste : `p/x 'utils.c'::flags`, `set var compute::appels = 0`.

❌ **Inconvénients** / Limites :
- Inutilisable pour une locale dont la fonction n'est pas dans la pile.
- Les apostrophes autour du nom de fichier sont obligatoires et facilement oubliées.
- Suppose que le fichier a été compilé avec `-g` : sans symboles, aucune portée nommable.

## Connexions

### Notes liées
- [[GDB : [print] - afficher une valeur et choisir son format]] - La commande que cette syntaxe étend
- [[GDB : [backtrace] - lire la pile d'appels]] - L'alternative : se déplacer dans la frame plutôt que qualifier
- [[GDB : [set variable] - modifier une variable en cours d'exécution]] - Accepte la même qualification
- [[C - variables (déclaration et portée)]] - Le `static` et le masquage que cette syntaxe contourne
- [[C - organisation multi-fichiers (headers)]] - Pourquoi une variable peut être invisible d'une unité à l'autre

### Dans le contexte de
- [[GDB - débogueur en ligne de commande]] - Fait partie de l'inspection d'état
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/GDB.md`

---
**Tags thématiques** : #gdb #debug #portée #static #c
