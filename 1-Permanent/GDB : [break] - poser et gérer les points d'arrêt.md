---
type: permanent
created: 2026-10-12 14:49
tags:
  - permanent
  - gdb
  - debug
  - c
---

# GDB : [break] - poser et gérer les points d'arrêt

> [!abstract] Concept
> `break` (abrégé `b` ou `br`) désigne un endroit du code où l'exécution doit s'interrompre pour laisser inspecter l'état ; `tbreak` fait la même chose une seule fois.

## Explication

Un *breakpoint* est le plus simple des quatre déclencheurs de `gdb` (voir [[GDB - les quatre familles de points d'arrêt (breakpoint, watchpoint, catchpoint, tracepoint)|les quatre familles]]) : il se déclenche sur une **position de code**, pas sur une donnée ni un événement. Il se pose **avant** `run`, sur une position du source que `gdb` traduit en adresse grâce aux tables DWARF. Techniquement, l'instruction cible est remplacée par un piège (`int3` sur x86) que le noyau rapporte au débogueur ; l'instruction d'origine est restaurée à la reprise. Le programme s'arrête donc *juste avant* d'exécuter la ligne indiquée : la ligne affichée n'a pas encore eu lieu.

Trois désignations couvrent presque tous les besoins : `break fonction` s'arrête à l'entrée d'une fonction, `break fichier:ligne` sur une ligne précise, `break fichier:fonction` lève l'ambiguïté quand plusieurs fichiers définissent le même nom (`static` homonymes). On peut poser un point d'arrêt sur un fichier qui n'est pas encore chargé : `gdb` propose alors de le rendre *pending* et de l'activer dès que le code apparaît.

La différence entre **supprimer** et **désactiver** compte dans une longue session. `delete` oublie le point d'arrêt (et libère son numéro), `disable` le garde en mémoire inactif : on le réactivera par `enable` sans avoir à retrouver la ligne. Chaque point d'arrêt porte un numéro incrémental, visible par `info breakpoints`, qui sert ensuite à le viser.

## Exemples

### Poser

```
(gdb) break main                 # à l'entrée de main()
(gdb) br main.c:42               # ligne 42 de main.c
(gdb) br utils.c:compute         # la fonction compute DE utils.c
(gdb) tbreak main.c:42           # temporaire : disparaît après le premier arrêt
```

### Conditionner (évite les milliers d'arrêts inutiles)

```
(gdb) break main.c:42 if i == 99      # seulement à la 100e itération
(gdb) ignore 1 500                    # ignorer les 500 premiers passages du br n°1
```

### Lister, supprimer, désactiver

```
(gdb) info breakpoints        # numéros, emplacements, nombre de passages
(gdb) delete 2                # supprime le point d'arrêt n°2
(gdb) delete breakpoints      # (abrégeable « del br ») supprime tout
(gdb) clear compute           # supprime le point d'arrêt posé sur compute()
(gdb) disable 3               # conservé mais inactif
(gdb) enable 3
```

## Cas d'usage

- **Entrer dans une fonction suspecte** : `break fonction` puis `run`, pour observer ses arguments réels.
- **Isoler une itération fautive** : point d'arrêt conditionnel sur l'indice qui déclenche le bogue.
- **Vérifier qu'un chemin est pris** : poser un point d'arrêt dans une branche et voir s'il est jamais atteint.

## Avantages et inconvénients

✅ **Avantages** :
- Conditions et compteurs d'ignorance évitent de recompiler pour ajouter un `if` de débogage.
- `tbreak` laisse la session propre pour un arrêt ponctuel (un point d'entrée, par exemple).

❌ **Inconvénients** / Limites :
- Une ligne optimisée ou supprimée par le compilateur n'est pas atteignable : `-O0` est requis.
- Les points d'arrêt conditionnels sont évalués par `gdb` à chaque passage, ce qui ralentit beaucoup une boucle serrée.
- Un `inline` ou une macro peut placer l'arrêt à un endroit contre-intuitif.

## Connexions

### Notes liées
- [[GDB - débogueur en ligne de commande]] - La session dans laquelle ces commandes prennent place
- [[GDB - exécution pas à pas (next step continue finish)]] - Ce qu'on fait entre deux points d'arrêt
- [[GDB : [backtrace] - lire la pile d'appels]] - Première chose à regarder une fois arrêté
- [[GDB - les quatre familles de points d'arrêt (breakpoint, watchpoint, catchpoint, tracepoint)]] - Les trois autres déclencheurs : donnée, événement, collecte sans arrêt
- [[GDB : [display] - réévaluer une expression à chaque arrêt]] - Automatise l'inspection à chaque arrêt
- [[C - organisation multi-fichiers (headers)]] - Pourquoi la syntaxe `fichier:fonction` est nécessaire

### Dans le contexte de
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/GDB.md`

---
**Tags thématiques** : #gdb #debug #breakpoint #c
