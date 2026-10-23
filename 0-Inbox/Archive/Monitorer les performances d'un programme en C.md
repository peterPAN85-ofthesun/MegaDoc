
#   1 - consomation STACK et HEAP

2 outils important : `valgrind` et `ms_print`

```shell
$ gcc -g -02 main.c -o a.out  # On compile avec les bons paramètre d'optimisation !
$ valgrind --tool=massif --stacks=yes --peak-inaccuracy=0.0 --massif-out-file=out.log ./a.out  # On génère un log à l'aide de massif

$ ms_print out.log | less # On affiche le graphe corresiondant à l'usage de la mémmoire
```

>[!Warning]
>Penser à désactiver `--fsanitize=address` comme option dans gcc; valgrind ne fonctionnera pas avec


Le graphe prend cette forme :
```
--------------------------------------------------------------------------------
  n        time(i)         total(B)   useful-heap(B) extra-heap(B)    stacks(B)
--------------------------------------------------------------------------------
 84        299,075            4,088            1,560           296        2,232
 85        300,870            4,320            1,560           296        2,464
 86        302,665            4,816            1,560           296        2,960
 87        304,454            4,856            1,560           296        3,000
 88        306,262            3,400            1,560           296        1,544
 89        308,071            1,816            1,024             8          784
 90        309,862            1,776            1,024             8          744
 91        311,646              528                0             0          528
```

avec :
- `useful-heap` pour l'espace demandé par `malloc`/`calloc`/`realloc`
- `extra-heap` surcoût de l'allocateur (en-têtes de blocs, alignement...)
- `stacks`
- `total`

Un autre outil graphique pour visualiser la sortie de massif :
```shell
$ massif-visualizer out.log
```

# 2 - changer la taille de la `stack` ou de la `heap`

```shell
$ ulimit -a    
-t: cpu time (seconds)              unlimited
-f: file size (blocks)              unlimited
-d: data seg size (kbytes)          unlimited
-s: stack size (kbytes)             8192
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
-N 15: rt cpu time (microseconds)   unlimited
```

Changer la taille de la `heap`
```shell
$ ulimit -d 
```

Changer la taille de la `stack`
```shell
$ ulimit -s
```