---
type: permanent
created: 2026-10-12 14:53
tags:
  - permanent
  - gdb
  - debug
  - c
---

# GDB : [display] - réévaluer une expression à chaque arrêt

> [!abstract] Concept
> `display expr` met une expression sous surveillance : `gdb` la réaffiche automatiquement à chaque arrêt, ce qui transforme un pas-à-pas en suivi continu de valeurs.

## Explication

Pendant un pas-à-pas, retaper `p i`, `p somme`, `p *ptr` après chaque `next` est l'essentiel du temps perdu. `display` inverse la charge : on déclare une fois les expressions intéressantes, et `gdb` les réévalue et les affiche **à chaque arrêt** — après chaque pas, à chaque point d'arrêt atteint. La sortie devient un tableau de bord qui défile en regard du code.

Chaque expression surveillée reçoit un numéro, et la liste se gère comme celle des points d'arrêt : `info display` l'affiche, `undisplay <n>` supprime une entrée, `disable display <n>` la garde en la rendant muette, `enable display <n>` la rallume. Comme pour `print`, un format est acceptable : `display/x flags` suivra le registre en hexadécimal, `display/t masque` en binaire.

La subtilité est la **portée**. Une expression surveillée qui n'a plus de sens dans le contexte courant — une locale d'une fonction qu'on a quittée — n'est pas une erreur : `gdb` désactive simplement son affichage, et le réactive si l'on revient dans une portée où elle existe. À ne pas confondre avec un `watch` : `display` ne provoque jamais d'arrêt, il se contente d'afficher quand un arrêt a lieu pour une autre raison, tandis qu'un [[GDB - les quatre familles de points d'arrêt (breakpoint, watchpoint, catchpoint, tracepoint)|watchpoint]] interrompt le programme dès que la valeur change.

## Exemples

### Mettre en place un tableau de bord

```
(gdb) br main.c:20
(gdb) run
(gdb) display i
1: i = 0
(gdb) display somme
2: somme = 0
(gdb) display/x flags
3: /x flags = 0x1
(gdb) n
21          somme += tab[i];
1: i = 0
2: somme = 0
3: /x flags = 0x1
(gdb) n
1: i = 0
2: somme = 12          ← la mise à jour est automatique
3: /x flags = 0x1
```

### Gérer la liste

```
(gdb) info display
Num Enb Expression
1:   y  i
2:   y  somme
3:   y  /x flags
(gdb) disable display 3     # temporairement muet
(gdb) enable display 3
(gdb) undisplay 2           # supprimé définitivement
(gdb) delete display         # tout supprimer
```

### Expressions composées

```
(gdb) display tab[i]              # suit l'élément courant, l'indice changeant
(gdb) display *ptr
(gdb) display somme / (i + 1)     # une moyenne calculée à la volée
```

## Cas d'usage

- **Suivre une boucle** : indice, accumulateur et élément courant affichés à chaque pas.
- **Observer un parcours de liste** : `display *noeud` pendant qu'on avance de maillon en maillon.
- **Surveiller un registre de flags** en hexadécimal ou en binaire pendant une séquence d'opérations.
- **Vérifier un invariant** : afficher l'expression censée rester constante et voir à quel pas elle casse.

## Avantages et inconvénients

✅ **Avantages** :
- Supprime la retape de `print` à chaque pas.
- Accepte les formats et les expressions calculées, pas seulement des noms de variables.
- Se désactive proprement hors de portée, sans message d'erreur parasite.

❌ **Inconvénients** / Limites :
- Sortie vite encombrée au-delà de quatre ou cinq expressions.
- N'arrête pas le programme : ne détecte pas une modification survenue entre deux arrêts.
- Chaque expression est réévaluée à chaque arrêt : une expression coûteuse (appel de fonction) ralentit la session et peut avoir des effets de bord.

## Connexions

### Notes liées
- [[GDB - exécution pas à pas (next step continue finish)]] - Le contexte où `display` prend tout son sens
- [[GDB : [print] - afficher une valeur et choisir son format]] - Même syntaxe d'expression et mêmes formats
- [[GDB - les quatre familles de points d'arrêt (breakpoint, watchpoint, catchpoint, tracepoint)]] - Le `watchpoint`, qui arrête au lieu d'afficher
- [[GDB : [break] - poser et gérer les points d'arrêt]] - Les arrêts qui déclenchent le réaffichage
- [[C - boucles (while for do-while)]] - La structure dont `display` facilite le suivi

### Dans le contexte de
- [[GDB - débogueur en ligne de commande]] - Automatise l'inspection d'une session
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/GDB.md`

---
**Tags thématiques** : #gdb #debug #display #c
