---
type: permanent
created: 2026-10-12 14:53
tags:
  - permanent
  - gdb
  - debug
  - c
---

# GDB - débogage inverse (target record-full)

> [!abstract] Concept
> Après `target record-full`, `gdb` journalise chaque instruction exécutée et peut rejouer le programme **à l'envers** — `reverse-step`, `reverse-next`, `reverse-continue` — pour revenir sur un pas déjà franchi.

## Explication

La frustration classique du pas-à-pas est d'avoir dépassé l'instant intéressant : un `next` de trop, la variable est déjà écrasée, et il faut relancer toute la session depuis le début. L'enregistrement d'exécution supprime ce coût. `target record-full` demande à `gdb` de consigner, instruction par instruction, l'**état modifié** — registres et cases mémoire écrites, avec leur valeur précédente. Disposant de ce journal, le débogueur sait défaire les changements et reconstituer l'état antérieur : l'exécution devient navigable dans les deux sens.

L'ordre des opérations est impératif : la commande se lance **après** `run` (il faut un processus vivant) mais **avant** la portion de code à étudier, car seul ce qui est exécuté ensuite est enregistré. En pratique on pose un point d'arrêt un peu en amont de la zone suspecte, on lance, on active `record-full` à l'arrêt, puis on avance normalement — avec désormais la possibilité de reculer. `record stop` met fin à l'enregistrement, `info record` indique le nombre d'instructions journalisées.

Le prix est lourd et explique que ce mode ne soit pas actif par défaut : chaque instruction coûte du temps et de la mémoire, avec un ralentissement couramment de deux ordres de grandeur, et un tampon circulaire de taille bornée (`set record full-insn-number-max`) qui finit par écraser le plus ancien. Le mode est donc réservé à des fenêtres courtes et bien ciblées. Autres limites : les appels système ne sont pas annulables (on ne « dé-écrit » pas un fichier), et tout n'est pas supporté sur toutes les architectures.

## Exemples

### Mise en place

```
(gdb) br config.c:25        # juste avant la zone suspecte
(gdb) run
Breakpoint 1, charger_config () at config.c:25
(gdb) target record-full    # à partir d'ici, tout est enregistré
(gdb) n
(gdb) n
(gdb) n                     # un next de trop : la valeur est perdue...
(gdb) reverse-next          # ...on revient en arrière d'une ligne
(gdb) p somme               # la voilà
```

### Les commandes inverses

| Commande | Symétrique de |
|---|---|
| `reverse-step` / `rs` | `step` — recule d'une ligne, en entrant dans les appels |
| `reverse-next` / `rn` | `next` — recule d'une ligne, en enjambant les appels |
| `reverse-continue` / `rc` | `continue` — recule jusqu'au point d'arrêt précédent |
| `reverse-finish` | `finish` — revient au point d'appel de la fonction courante |

### Gérer l'enregistrement

```
(gdb) info record                              # instructions enregistrées, position courante
(gdb) set record full-insn-number-max 500000   # agrandir le tampon
(gdb) record stop                              # arrêter (le journal est perdu)
```

## Cas d'usage

- **Un pas de trop** : revenir sur l'instant où la variable avait encore sa bonne valeur.
- **Variable corrompue sans coupable évident** : avancer jusqu'au constat, puis reculer pas à pas jusqu'à l'écriture fautive.
- **Crash non reproductible** : combiné à un point d'arrêt sur le signal, remonter dans l'enchaînement qui y a conduit.
- **Code dense** : explorer un même passage plusieurs fois, dans les deux sens, sans relancer.

## Avantages et inconvénients

✅ **Avantages** :
- Supprime les relances répétées du programme pour ré-atteindre un même point.
- Permet de remonter d'un symptôme vers sa cause, au lieu de deviner d'avance où regarder.
- Combinable avec tout le reste : `print`, `backtrace`, `display` fonctionnent normalement.

❌ **Inconvénients** / Limites :
- Ralentissement massif (souvent x100 et plus) et consommation mémoire proportionnelle.
- Tampon borné : le début de l'enregistrement finit par être écrasé.
- Appels système et entrées-sorties ne sont pas réversibles.
- Support dépendant de l'architecture ; indisponible sur la plupart des cibles embarquées.

## Connexions

### Notes liées
- [[GDB - exécution pas à pas (next step continue finish)]] - Les commandes dont celles-ci sont les symétriques
- [[GDB : [break] - poser et gérer les points d'arrêt]] - Sert à positionner le début de l'enregistrement
- [[GDB - les quatre familles de points d'arrêt (breakpoint, watchpoint, catchpoint, tracepoint)]] - Le `watchpoint`, autre réponse à « qui a modifié cette variable ? »
- [[GDB - débogueur en ligne de commande]] - Le mode d'exécution standard, en avant seulement
- [[GCC : [-fsanitize] - instrumentation à l'exécution]] - Autre arbitrage coût/information à l'exécution

### Dans le contexte de
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/GDB.md`

---
**Tags thématiques** : #gdb #debug #reverse-debugging #c
