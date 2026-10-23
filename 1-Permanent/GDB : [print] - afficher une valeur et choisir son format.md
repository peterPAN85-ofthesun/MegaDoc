---
type: permanent
created: 2026-10-12 14:49
tags:
  - permanent
  - gdb
  - debug
  - c
---

# GDB : [print] - afficher une valeur et choisir son format

> [!abstract] Concept
> `print` (abrégé `p`) évalue une expression C dans le contexte de l'arrêt courant et l'affiche ; un suffixe de format (`/x`, `/t`, `/c`…) impose la représentation plutôt que celle déduite du type.

## Explication

`print` ne se limite pas à un nom de variable : il évalue une **expression C complète** dans la portée courante — `p tab[i]`, `p *ptr`, `p s.champ`, `p n * 2 + 1`, `p strlen(nom)`. C'est ce qui en fait l'outil central de l'inspection : on interroge l'état du programme avec la syntaxe du langage, sans avoir à ajouter le moindre `printf`.

Par défaut, l'affichage suit le **type déclaré** de l'expression. Le suffixe de format court-circuite cette déduction : il réinterprète les mêmes octets autrement. `p/x flags` lit un champ de bits en hexadécimal, `p/t masque` en binaire, `p/c octet` montre le caractère derrière un entier. Attention à la nature de l'opération : le format **n'est pas un cast**, il change la représentation affichée, pas la valeur ; `p/f n` sur un `int` affiche l'entier converti, pas les octets réinterprétés comme flottant (pour cela : `p *(float*)&n`).

Un pointeur pose un problème que `print` seul ne résout pas : `gdb` connaît le type pointé, mais **pas le nombre d'éléments**. `p tab` sur un `int *` n'affiche donc qu'une adresse, et `p *tab` que le premier élément. L'**opérateur `@`** fournit la longueur manquante : `p tab[0]@8` construit un *tableau artificiel* de 8 éléments à partir de cette case et l'affiche d'un bloc. C'est la seule façon de visualiser un buffer obtenu par [[C - allocation dynamique (malloc free)|`malloc`]], dont la taille ne vit que dans une variable du programme.

Chaque résultat est mémorisé dans l'**historique des valeurs** sous un nom `$1`, `$2`… réutilisable dans une expression suivante (`p $1 + 1`), et `show values` rappelle les dix derniers. Pratique pour comparer une valeur à ce qu'elle était quelques pas plus tôt sans la renoter à la main.

## Exemples

### Les formats

| Suffixe | Représentation |
|---|---|
| `/d` | Décimal signé |
| `/u` | Décimal non signé |
| `/x` | Hexadécimal |
| `/o` | Octal |
| `/t` | Binaire (*two*) |
| `/c` | Caractère |
| `/f` | Flottant |
| `/s` | Chaîne |
| `/a` | Adresse (avec symbole le plus proche) |

### Un même octet, quatre lectures

```
(gdb) p c
$1 = 65 'A'
(gdb) p/x c
$2 = 0x41
(gdb) p/t c
$3 = 1000001
(gdb) p/c c
$4 = 65 'A'
```

### Expressions, pas seulement des variables

```
(gdb) p tab[3]
(gdb) p *ptr
(gdb) p cfg.timeout * 1000
(gdb) p sizeof(struct Point)
(gdb) p/x ~mask & 0xFF
```

### Plage mémoire : l'opérateur `@`

```c
int tab[8] = {1,2,3,4,5,6,7,8};
int *buf = malloc(4 * sizeof(int));
```

```
(gdb) p tab
$1 = {1, 2, 3, 4, 5, 6, 7, 8}          ← tableau statique : la taille est dans le type
(gdb) p buf
$2 = (int *) 0x5555555592a0            ← pointeur : juste une adresse
(gdb) p *buf
$3 = 1                                 ← un seul élément
(gdb) p buf[0]@4                       ← « 4 éléments à partir de buf[0] »
$4 = {1, 2, 3, 4}
(gdb) p *buf@4                         ← forme équivalente
$5 = {1, 2, 3, 4}
(gdb) p/x tab[2]@3                     ← se combine aux formats
$6 = {0x3, 0x4, 0x5}
```

> [!warning] Aucune vérification de borne
> `gdb` ne sait pas où s'arrête l'allocation : `p buf[0]@1000` affichera 1000 entiers en lisant allègrement au-delà du bloc. Les valeurs hors plage sont du bruit, pas une erreur.

### Historique des valeurs

```
(gdb) show values     # les dix derniers résultats, avec leurs $n
(gdb) p $3 - $1       # réutilisation directe
```

## Cas d'usage

- **Inspecter un buffer dynamique** : `p buf[0]@n`, impossible autrement sur un pointeur.
- **Lire un champ de bits ou un masque** : `p/t` ou `p/x`, seuls formats lisibles pour du binaire.
- **Vérifier un pointeur** : `p ptr` pour l'adresse, `p *ptr` pour le pointé — `0x0` trahit immédiatement le `NULL`.
- **Contrôler une taille** : `p sizeof(...)` pour confirmer un alignement ou un `malloc` suspect.
- **Comparer deux instants** : noter `$1` avant une fonction, comparer après.

## Avantages et inconvénients

✅ **Avantages** :
- Syntaxe C familière, y compris appels de fonctions et arithmétique.
- Les formats évitent toute conversion mentale sur les valeurs binaires.
- L'historique `$n` sert de bloc-notes intégré.

❌ **Inconvénients** / Limites :
- Répond `<optimized out>` dès que la variable n'existe plus dans un binaire optimisé.
- Le format n'est pas une réinterprétation d'octets : confusion fréquente avec `/f`.
- `p fonction(...)` exécute réellement la fonction, avec ses effets de bord.

## Connexions

### Notes liées
- [[C - relation pointeurs-tableaux]] - Pourquoi un pointeur ne dit pas sa longueur, d'où l'opérateur `@`
- [[C - allocation dynamique (malloc free)]] - Le buffer `malloc` typique que `@` permet de visualiser
- [[GDB - qualification de portée (fonction::variable)]] - Comment nommer une variable invisible depuis la portée courante
- [[GDB : [whatis] et [ptype] - inspecter le type d'une expression]] - Savoir quoi afficher avant de l'afficher
- [[GDB : [set variable] - modifier une variable en cours d'exécution]] - La contrepartie en écriture
- [[C - types de données primitifs]] - Les types dont `print` déduit son format par défaut
- [[IEEE-754 - simple précision 32 bits]] - Pourquoi `/f` et la réinterprétation d'octets ne sont pas la même chose

### Dans le contexte de
- [[GDB - débogueur en ligne de commande]] - La commande d'inspection centrale d'une session
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/GDB.md`

---
**Tags thématiques** : #gdb #debug #print #c #formats #pointeurs
