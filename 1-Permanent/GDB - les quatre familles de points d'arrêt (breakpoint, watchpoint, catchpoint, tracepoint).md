---
type: permanent
created: 2026-10-12 14:54
tags:
  - permanent
  - gdb
  - debug
  - c
---

# GDB - les quatre familles de points d'arrêt (breakpoint, watchpoint, catchpoint, tracepoint)

> [!abstract] Concept
> `gdb` distingue quatre déclencheurs : le *breakpoint* se déclenche sur un **emplacement de code**, le *watchpoint* sur un **changement de donnée**, le *catchpoint* sur un **événement** (exception, appel système, chargement de bibliothèque), le *tracepoint* collecte des données **sans arrêter** le programme.

## Explication

Les quatre familles répondent à quatre questions différentes. « Quand le programme passe *ici* ? » → *breakpoint*. « Qui modifie *cette variable* ? » → *watchpoint*. « Quand *cet événement* se produit, où qu'il se produise ? » → *catchpoint*. « Que valent ces variables à chaque passage, dans un programme qu'on ne peut pas arrêter ? » → *tracepoint*. Choisir la bonne famille change radicalement l'effort : chercher un écrasement mémoire avec des breakpoints posés au hasard peut prendre une heure, là où un `watch` sur la variable donne la réponse immédiatement.

Le **watchpoint** est le plus précieux et le plus mal connu. `watch var` arrête dès que la valeur change, `rwatch` dès qu'elle est lue, `awatch` dans les deux cas. Son coût dépend entièrement du support matériel : les processeurs modernes offrent quelques registres de débogage (typiquement 4, sur des zones de 8 octets au plus) qui rendent la surveillance **gratuite** ; au-delà, ou sur une zone plus large, `gdb` bascule en watchpoint logiciel — il exécute alors le programme instruction par instruction en comparant la valeur à chaque pas, avec un ralentissement comparable au [[GDB - débogage inverse (target record-full)|débogage inverse]]. À noter : un watchpoint sur une variable **locale** meurt avec son cadre de pile, `gdb` le signalant explicitement.

Le **catchpoint** se déclenche sur un événement plutôt que sur une position : `catch throw` sur une exception C++, `catch syscall write` sur un appel système, `catch fork`, `catch exec`, `catch load` sur le chargement d'une bibliothèque partagée. Utile précisément quand on ne sait **pas où** regarder. Le **tracepoint**, enfin, est d'une autre nature : il n'interrompt rien. On déclare quelles données collecter (`collect`), on lance la collecte (`tstart`), on laisse tourner, puis on explore l'historique a posteriori (`tfind`). C'est la réponse aux situations où l'arrêt est inacceptable — temps réel, systèmes embarqués via `gdbserver`, bogues qui disparaissent dès qu'on suspend le processus.

Les quatre familles partagent un **espace de numérotation unique** : `info breakpoints` les liste toutes, et `delete`, `enable`, `disable` s'appliquent indifféremment, par numéro.

## Exemples

### Vue d'ensemble

| Famille | Déclencheur | Commandes | Arrête le programme ? |
|---|---|---|---|
| **Breakpoint** | Emplacement de code | `break`, `tbreak` | Oui |
| **Watchpoint** | Accès à une donnée | `watch`, `rwatch`, `awatch` | Oui |
| **Catchpoint** | Événement | `catch`, `tcatch` | Oui |
| **Tracepoint** | Emplacement, en continu | `trace`, `collect`, `tstart` | **Non** |

### Watchpoint : trouver qui corrompt une variable

```
(gdb) watch compteur
Hardware watchpoint 2: compteur
(gdb) c
Hardware watchpoint 2: compteur
Old value = 10
New value = 2147483647        ← la corruption, prise en flagrant délit
decrementer (c=0x7fff...) at utils.c:18
(gdb) bt                      ← et le chemin qui y mène
```

```
(gdb) watch tab[5]            # une case précise
(gdb) watch *ptr              # la zone pointée (et non le pointeur)
(gdb) rwatch config           # arrêt à la LECTURE
(gdb) awatch etat             # lecture ou écriture
(gdb) watch somme if somme > 1000     # conditionnel
```

### Catchpoint : réagir à un événement

```
(gdb) catch syscall write     # à chaque write(), d'où qu'il vienne
(gdb) catch load libm.so      # au chargement de la bibliothèque
(gdb) catch signal SIGPIPE
(gdb) catch throw             # exception C++ levée
```

### Tracepoint : collecter sans suspendre

```
(gdb) trace utils.c:42
(gdb) actions
> collect i, somme, tab[i]
> end
(gdb) tstart                  # le programme tourne à pleine vitesse
...
(gdb) tstop
(gdb) tfind start             # exploration de l'historique collecté
(gdb) p somme
(gdb) tfind                   # passage suivant
```

### Tout gérer d'un seul endroit

```
(gdb) info breakpoints
Num Type            Disp Enb Address  What
1   breakpoint      keep y   0x...    in main at main.c:10
2   hw watchpoint   keep y            compteur
3   catchpoint      keep y            syscall "write"
(gdb) delete 2
(gdb) disable 3
```

## Cas d'usage

- **Corruption mémoire** : `watch` sur la variable écrasée, puis `bt` au déclenchement — la méthode la plus rapide.
- **Fuite de descripteurs** : `catch syscall open` pour recenser toutes les ouvertures.
- **Bogue sensible au *timing*** : tracepoints, puisque tout arrêt ferait disparaître le symptôme.
- **Lecture inattendue** : `rwatch` pour savoir qui consulte une donnée censée être privée.

## Avantages et inconvénients

✅ **Avantages** :
- Le watchpoint matériel répond à « qui modifie ceci ? » sans coût d'exécution.
- Le catchpoint permet de piéger un événement sans savoir où il se produit dans le code.
- Le tracepoint autorise l'observation de systèmes qu'on ne peut pas suspendre.
- Gestion unifiée : un seul `info breakpoints`, une seule numérotation.

❌ **Inconvénients** / Limites :
- Watchpoints matériels très peu nombreux (≈ 4) et limités en taille ; au-delà, chute de performance drastique.
- Un watchpoint sur une locale expire à la sortie de la fonction.
- Les tracepoints exigent généralement `gdbserver` et un support de la cible.
- `catch syscall` sur un appel fréquent (`write`) noie la session en arrêts.

## Connexions

### Notes liées
- [[GDB : [break] - poser et gérer les points d'arrêt]] - La famille de base, détaillée
- [[GDB : [display] - réévaluer une expression à chaque arrêt]] - Affiche sans arrêter, là où `watch` arrête
- [[GDB - débogage inverse (target record-full)]] - L'autre réponse à « qui a modifié cette variable ? »
- [[GDB : [backtrace] - lire la pile d'appels]] - Le réflexe au déclenchement d'un watchpoint
- [[GCC : [-fsanitize] - instrumentation à l'exécution]] - Détection automatique des corruptions, sans surveillance manuelle
- [[PS2SDK - breakpoints matériels libeedebug]] - Les mêmes registres de débogage, pilotés à la main sur une cible sans `gdb`

### Dans le contexte de
- [[GDB - débogueur en ligne de commande]] - Le choix du déclencheur structure toute la session
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/GDB.md`
- Documentation GDB : chapitre *Stopping and Continuing*

---
**Tags thématiques** : #gdb #debug #watchpoint #breakpoint #tracepoint #c
