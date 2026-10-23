---
type: permanent
created: 2026-10-12 14:52
tags:
  - permanent
  - gdb
  - debug
  - c
---

# GDB : [whatis] et [ptype] - inspecter le type d'une expression

> [!abstract] Concept
> `whatis` répond par le type déclaré d'une expression, sans le déplier ; `ptype` en donne la définition complète — champs d'une `struct`, valeurs d'un `enum`, signature d'une fonction.

## Explication

Les deux commandes répondent à la question « qu'est-ce que je manipule, au fait ? », mais à des profondeurs différentes. `whatis` s'arrête au **premier niveau** : sur une variable déclarée `Point p`, il répond `type = Point`, c'est-à-dire le `typedef` tel qu'écrit, sans chercher ce qu'il cache. `ptype` **résout** le typedef et affiche la définition dépliée : la liste des champs avec leurs types. Sur une `struct` un peu riche, c'est la différence entre un nom et un plan.

L'intérêt pratique est double. D'abord, découvrir une structure sans ouvrir le header correspondant — `ptype struct Config` donne immédiatement les champs réels, y compris ceux ajoutés depuis la dernière lecture du code. Ensuite, trancher les erreurs de type : un `ptype` sur une variable qu'on croyait `int *` révélant `char **` explique sur-le-champ un déréférencement aberrant. Les deux commandes acceptent n'importe quelle **expression**, pas seulement un identifiant : `whatis tab[0]`, `ptype *ptr`, `ptype fonction` (qui affiche alors la signature complète).

Point de détail qui a son importance : ces commandes n'**évaluent pas** l'expression. `ptype fonction()` donne le type de retour sans appeler la fonction, et `whatis i++` ne modifie pas `i`. Elles travaillent uniquement sur les informations de type DWARF, donc exigent [[GCC : [-g] - niveaux d'informations de débogage|`-g`]] (et `-g3` pour que les macros soient connues).

## Exemples

### La différence en une capture

```c
typedef struct { int x, y; char *nom; } Point;
Point p = {1, 2, "origine"};
```

```
(gdb) whatis p
type = Point                      ← le nom déclaré, point final
(gdb) ptype p
type = struct {
    int x;
    int y;
    char *nom;
}                                 ← la définition dépliée
```

### Sur une expression quelconque

```
(gdb) whatis p.nom
type = char *
(gdb) whatis &p
type = Point *
(gdb) ptype main
type = int (int, char **)         ← la signature de la fonction
(gdb) ptype enum Etat
type = enum Etat {INIT, PRET, ARRET}
```

### Dépiler les typedef un cran à la fois

```
(gdb) whatis mon_alias           # type = Point
(gdb) whatis Point               # type = struct {...}  (un cran de plus)
(gdb) ptype mon_alias            # tout, d'un coup
```

## Cas d'usage

- **Explorer une `struct` inconnue** : `ptype` avant de commencer à lire les champs au hasard.
- **Diagnostiquer un déréférencement** : vérifier le nombre réel d'étoiles d'un pointeur.
- **Retrouver une signature** : `ptype fonction` plutôt que de chercher le prototype dans les en-têtes.
- **Lister un `enum`** : voir les valeurs symboliques disponibles pour une comparaison.

## Avantages et inconvénients

✅ **Avantages** :
- Évite d'aller relire les en-têtes pendant une session de débogage.
- N'évalue pas l'expression : aucun effet de bord.
- Fonctionne sur les expressions composées, pas seulement sur des noms.

❌ **Inconvénients** / Limites :
- Dépend entièrement des informations DWARF : muettes sans `-g`.
- `ptype` sur une structure imbriquée affiche les sous-types par leur nom, pas récursivement.
- Sur du code optimisé, certains types locaux peuvent avoir disparu.

## Connexions

### Notes liées
- [[GDB : [print] - afficher une valeur et choisir son format]] - Savoir le type avant de choisir le format d'affichage
- [[GDB : [set variable] - modifier une variable en cours d'exécution]] - Écrire une valeur compatible suppose de connaître le type
- [[C - structures (struct)]] - L'objet que `ptype` déplie
- [[C - énumérations (enum)]] - `ptype` en liste les valeurs symboliques
- [[C - pointeurs (concepts de base)]] - Les confusions de niveau d'indirection que `whatis` révèle
- [[GCC : [-g] - niveaux d'informations de débogage]] - La source de ces informations de type

### Dans le contexte de
- [[GDB - débogueur en ligne de commande]] - Fait partie de l'inspection d'état
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/GDB.md`

---
**Tags thématiques** : #gdb #debug #types #struct #c
