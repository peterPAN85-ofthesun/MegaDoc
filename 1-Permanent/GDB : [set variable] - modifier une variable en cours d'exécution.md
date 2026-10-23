---
type: permanent
created: 2026-10-12 14:52
tags:
  - permanent
  - gdb
  - debug
  - c
---

# GDB : [set variable] - modifier une variable en cours d'exécution

> [!abstract] Concept
> `set variable x = 42` écrit directement dans la mémoire du processus arrêté ; le mot `variable` est obligatoire dès que le nom de la variable collide avec une sous-commande de `set`.

## Explication

Le débogueur ne fait pas que lire : il **écrit**. Toute expression affectable en C l'est aussi sous `gdb` — une locale, une globale, un champ de structure, une case de tableau, la cible d'un pointeur. L'exécution reprend ensuite avec la nouvelle valeur, exactement comme si le programme l'avait calculée lui-même. C'est ce qui permet de tester un chemin de code sans recompiler : forcer une condition d'erreur, sauter une branche, corriger un indice fautif pour voir si la suite tient.

Le piège est syntaxique. `set` est aussi le préfixe des **réglages du débogueur** (`set width`, `set args`, `set listsize`, `set print pretty`…). Écrire `set width = 80` dans l'intention de modifier une variable nommée `width` change le réglage d'affichage de `gdb` et laisse la variable intacte — silencieusement. La forme longue `set variable width = 80` lève l'ambiguïté en annonçant explicitement qu'il s'agit d'une variable du programme. L'abréviation usuelle `set var` suffit, et c'est l'habitude à prendre par défaut plutôt que de se demander à chaque fois si le nom est à risque.

Deux garde-fous à connaître. Le typage est celui de C : `gdb` convertit comme le ferait une affectation, donc assigner `3.9` à un `int` donne `3`. Et le changement est **réel mais éphémère** : il porte sur ce processus-là, n'existe plus à la relance et ne corrige évidemment pas le source. C'est un outil d'expérimentation, pas de réparation.

## Exemples

### Les formes d'affectation

```
(gdb) set var i = 0
(gdb) set var p.x = 10                 # champ de structure
(gdb) set var tab[3] = -1              # case de tableau
(gdb) set var *ptr = 42                # cible d'un pointeur
(gdb) set var ptr = &autre             # le pointeur lui-même
(gdb) set var flags = flags | 0x04     # expression à droite
(gdb) set var 'utils.c'::appels = 0    # avec qualification de portée
```

### Le piège du nom réservé

```
(gdb) set width = 80
                           ← aucune erreur : gdb a changé SA largeur d'affichage
(gdb) p width
$1 = 1920                  ← la variable du programme n'a pas bougé
(gdb) set variable width = 80
(gdb) p width
$2 = 80                    ← cette fois c'est bien la variable
```

### Forcer un chemin d'erreur

```c
FILE *f = fopen(chemin, "r");
if (!f) { /* branche jamais testée */ }
```

```
(gdb) br main.c:12
(gdb) run
(gdb) set var f = 0        ← on simule l'échec du fopen
(gdb) c                    ← la branche d'erreur s'exécute enfin
```

## Cas d'usage

- **Tester une branche inatteignable** : simuler un échec d'allocation ou d'ouverture de fichier.
- **Franchir un bogue pour voir la suite** : corriger un indice hors borne et poursuivre la session.
- **Raccourcir une boucle** : forcer le compteur près de la fin pour atteindre vite le cas intéressant.
- **Réinitialiser un compteur `static`** avant de rejouer une séquence.

## Avantages et inconvénients

✅ **Avantages** :
- Teste des cas d'erreur sans injecter de code de test dans le source.
- Économise un cycle de recompilation complet pour vérifier une hypothèse.
- Accepte les mêmes expressions que `print`, y compris la qualification de portée.

❌ **Inconvénients** / Limites :
- `set x = ...` sans `variable` peut modifier un réglage de `gdb` **sans message d'erreur**.
- Peut placer le programme dans un état incohérent qu'il n'atteindrait jamais seul — conclusions à manier avec prudence.
- Impossible sur une variable `<optimized out>` ou en lecture seule (`.rodata`).

## Connexions

### Notes liées
- [[GDB : [print] - afficher une valeur et choisir son format]] - La contrepartie en lecture
- [[GDB : [whatis] et [ptype] - inspecter le type d'une expression]] - Connaître le type avant d'écrire dedans
- [[GDB : [call] - appeler une fonction depuis le débogueur]] - L'autre façon d'agir sur l'état du processus
- [[GDB - qualification de portée (fonction::variable)]] - Pour viser une variable hors de la portée courante
- [[C - variables (déclaration et portée)]] - Ce qui est affectable et où
- [[C - qualificatif volatile]] - Le cas des variables dont la valeur change hors du flux normal

### Dans le contexte de
- [[GDB - débogueur en ligne de commande]] - L'écriture, pendant de la lecture dans une session
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/GDB.md`

---
**Tags thématiques** : #gdb #debug #variables #c
