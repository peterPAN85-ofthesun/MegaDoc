---
type: permanent
created: 2026-10-12 14:55
tags:
  - permanent
  - linux
  - shell
  - performance
  - c
---

# LINUX : [ulimit] - consulter et modifier les limites de ressources

> [!abstract] Concept
> `ulimit` lit et ajuste les limites de ressources que le noyau impose à un processus — taille de pile, segment de données, nombre de descripteurs, taille des *core dumps* — pour le shell courant et tous les processus qu'il lancera ensuite.

## Explication

Le noyau associe à chaque processus un jeu de limites (`rlimit`), héritées de son parent. Dépasser l'une d'elles ne donne pas un ralentissement mais un **échec net** : `SIGSEGV` sur débordement de pile, `malloc` qui retourne `NULL` sur limite de données atteinte, `open` qui échoue avec `EMFILE`. `ulimit -a` affiche l'état complet — c'est la première chose à regarder quand un programme échoue « sans raison » sur une machine alors qu'il fonctionne ailleurs.

Chaque limite est double : la limite **souple** (*soft*, celle appliquée, modifiable librement par l'utilisateur jusqu'au plafond) et la limite **dure** (*hard*, le plafond, abaissable par tous mais relevable seulement avec les privilèges nécessaires). `ulimit -S -s 4096` change la souple, `ulimit -H -s` affiche la dure ; sans option, la lecture porte sur la souple et l'écriture sur les deux. Une limite dure abaissée est **irréversible** dans ce shell : la remonter demande un nouveau shell, ou une configuration dans `/etc/security/limits.conf` (ou une unité systemd, selon le contexte de lancement).

Deux limites intéressent directement le programmeur C. `-s` fixe la taille de la **pile** du thread principal, 8 Mo par défaut sur la plupart des distributions : c'est elle qui transforme une récursion profonde ou un gros tableau automatique en segfault. `-d` borne le **segment de données**, historiquement le heap étendu par `brk` — avec une nuance de taille sur Linux : depuis le noyau 4.7, `RLIMIT_DATA` couvre aussi les mappages anonymes, donc les grosses allocations que la *glibc* sert par `mmap` plutôt que par `brk`. Point crucial : `ulimit` n'affecte que le shell courant et sa descendance — un programme déjà lancé n'est pas concerné, et la limite s'évanouit à la fermeture du terminal.

## Exemples

### Tout afficher

```shell
$ ulimit -a
-t: cpu time (seconds)              unlimited
-f: file size (blocks)              unlimited
-d: data seg size (kbytes)          unlimited
-s: stack size (kbytes)             8192        ← 8 Mo de pile
-c: core file size (blocks)         unlimited
-m: resident set size (kbytes)      unlimited
-u: processes                       127171
-n: file descriptors                1024
-l: locked-in-memory size (kbytes)  unlimited
-v: address space (kbytes)          unlimited
-x: file locks                      unlimited
-i: pending signals                 127171
-q: bytes in POSIX msg queues       819200
-e: max nice                        31
-r: max rt priority                 98
```

### Lire puis modifier

```shell
$ ulimit -s                 # lire la limite de pile (ko)
8192
$ ulimit -s 32768           # la porter à 32 Mo pour ce shell et ses enfants
$ ulimit -s unlimited       # aucune limite (si la limite dure l'autorise)

$ ulimit -d                 # segment de données (≈ heap)
unlimited
$ ulimit -d 262144          # le borner à 256 Mo

$ ulimit -H -s              # la limite DURE de pile
$ ulimit -S -s 4096         # n'ajuster que la limite souple
```

### Les limites les plus utilisées

| Option | Ressource | Usage typique |
|---|---|---|
| `-s` | Taille de la pile | Autoriser une récursion profonde, ou au contraire la plafonner |
| `-d` | Segment de données | Brider le heap pour tester un échec de `malloc` |
| `-v` | Espace d'adressage total | Confiner globalement un processus |
| `-c` | Taille des *core dumps* | `ulimit -c unlimited` pour obtenir un *core* exploitable sous `gdb` |
| `-n` | Descripteurs de fichiers | Serveurs à nombreuses connexions |
| `-t` | Temps CPU | Tuer automatiquement un calcul qui s'emballe |

### Tester un échec d'allocation

```shell
$ ulimit -d 65536       # 64 Mo de données
$ ./a.out               # malloc finira par retourner NULL
```

> [!warning] Portée limitée au shell
> `ulimit` ne s'applique qu'au shell courant et à ses enfants. Pour une limite persistante : `/etc/security/limits.conf` (sessions PAM) ou `LimitSTACK=` dans une unité systemd.

## Cas d'usage

- **Débloquer une récursion profonde** : relever `-s` au lieu de réécrire l'algorithme — en pleine conscience que la contrainte réapparaîtra ailleurs.
- **Obtenir un *core dump*** : `ulimit -c unlimited` avant de relancer le programme qui plante, pour l'analyser ensuite sous `gdb`.
- **Vérifier la robustesse** : brider `-d` ou `-v` pour s'assurer que tous les retours de `malloc` sont bien testés.
- **Diagnostiquer un `EMFILE`** : comparer `-n` au nombre de descripteurs réellement ouverts par le service.

## Avantages et inconvénients

✅ **Avantages** :
- Intégré au shell, aucune installation.
- Permet de simuler une machine contrainte sans la contraindre vraiment.
- Granularité par processus, héritée proprement par les enfants.

❌ **Inconvénients** / Limites :
- Portée éphémère : perdue à la fermeture du shell.
- Une limite dure abaissée ne peut pas être relevée sans privilèges.
- `-m` (*resident set size*) est ignoré par les noyaux Linux modernes.
- `-d` et la frontière `brk`/`mmap` rendent l'effet sur le heap moins intuitif qu'il n'y paraît.

## Connexions

### Notes liées
- [[VALGRIND - profiler la consommation stack et heap]] - Mesure la consommation réelle, que ces limites plafonnent
- [[C - allocation dynamique (malloc free)]] - Le `malloc` qui retourne `NULL` quand `-d` ou `-v` est atteint
- [[C - tableaux statiques]] - Les tableaux automatiques qui saturent la pile fixée par `-s`
- [[GDB - débogueur en ligne de commande]] - Exploite les *core dumps* qu'autorise `ulimit -c`
- [[LINUX : _proc_ - système de fichiers virtuel processus]] - `/proc/<pid>/limits` donne les limites effectives d'un processus en cours
- [[GCC : [-fsanitize] - instrumentation à l'exécution]] - Détecte le débordement de pile que la limite `-s` transforme en segfault

### Dans le contexte de
- [[MOC - Linux Administration]] - Fait partie de ce domaine
- [[MOC - Programmation C]] - Contrainte d'exécution des programmes C

## Sources
- Fichier source : `0-Inbox/Archive/Monitorer les performances d'un programme en C.md`

---
**Tags thématiques** : #linux #ulimit #rlimit #performance #mémoire #shell
