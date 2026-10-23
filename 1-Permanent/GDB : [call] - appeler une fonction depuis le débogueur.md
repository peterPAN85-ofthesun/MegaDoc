---
type: permanent
created: 2026-10-12 14:54
tags:
  - permanent
  - gdb
  - debug
  - c
---

# GDB : [call] - appeler une fonction depuis le débogueur

> [!abstract] Concept
> `call fonction(args)` exécute réellement une fonction du programme arrêté, dans son propre processus, et affiche la valeur retournée — un moyen de tester une fonction isolément sans écrire de `main` de test.

## Explication

Le processus arrêté contient tout le code du programme, prêt à être exécuté. `call` en profite : `gdb` met en place les arguments selon l'ABI de la plateforme, détourne le flux vers l'adresse de la fonction, la laisse s'exécuter, puis restaure l'état d'exécution là où il était. Du point de vue du programme, cet appel a réellement eu lieu — il a consommé de la pile, et ses effets de bord sont bien là.

`call` et `print` sont presque interchangeables : tous deux évaluent une expression pouvant contenir un appel. La seule différence est l'affichage du résultat lorsque la fonction retourne `void` — `print` signale la valeur vide, `call` reste silencieux. D'où l'usage : `call` pour une procédure qu'on invoque pour son effet (`call reinit(ctx)`), `print` quand on veut la valeur (`p strlen(nom)`).

Le cast explicite présent dans la forme `call (type)fonction(args)` sert quand `gdb` **ignore la signature** — fonction d'une bibliothèque sans symboles de débogage, ou pointeur de fonction génériquement typé. Sans information de type, `gdb` suppose un retour `int`, ce qui tronque silencieusement une adresse 64 bits ou produit n'importe quoi sur un `double` ; `call (char *)get_nom()` rétablit l'interprétation correcte. À manier avec prudence : un appel au mauvais moment (structures à moitié initialisées, verrou déjà pris) peut planter le processus et mettre fin à la session, et si la fonction appelée rencontre un point d'arrêt, `gdb` s'arrête **dans** cet appel imbriqué.

## Exemples

### Tester une fonction sur place

```
(gdb) br main
(gdb) run
(gdb) call somme(3, 4)
$1 = 7
(gdb) p somme(3, 4)          # équivalent, et on garde la valeur dans $2
$2 = 7
(gdb) call afficher(ctx)     # procédure void : aucune sortie de gdb, mais l'effet a lieu
```

### Quand le cast devient nécessaire

```
(gdb) call get_nom()
$3 = 1437226608              ← gdb a supposé un retour « int » : l'adresse est tronquée
(gdb) call (char *)get_nom()
$4 = 0x55555555604a "config.ini"
(gdb) call (double)moyenne(tab, n)
$5 = 12.5
```

### Utiliser les fonctions de la libc sur ses propres données

```
(gdb) p strlen(nom)
$6 = 10
(gdb) call (int)strcmp(a, b)
$7 = -1
(gdb) call (void *)memset(buf, 0, 64)      # remet un tampon à zéro
```

## Cas d'usage

- **Tester une fonction pure** sans écrire de programme de test : l'appeler directement avec des valeurs choisies.
- **Déclencher un effet** : réinitialiser un contexte, vider un cache, forcer un *flush* pour voir la sortie.
- **Inspecter via un accesseur** : appeler le `getter` d'un type opaque dont la structure est inaccessible.
- **Afficher une structure lisiblement** : appeler la fonction de *dump* déjà présente dans le programme.

## Avantages et inconvénients

✅ **Avantages** :
- Exécute du vrai code dans le vrai contexte : pas de simulation, pas de harnais de test à écrire.
- Donne accès à toutes les fonctions liées au binaire, y compris celles de la libc.
- Permet de réutiliser les fonctions de *dump* du programme pour l'inspection.

❌ **Inconvénients** / Limites :
- Les effets de bord sont réels et irréversibles : l'état du programme est modifié.
- Sans symboles, le retour est supposé `int` — cast obligatoire sous peine de résultat faux.
- Un crash dans la fonction appelée tue le processus et la session.
- Consomme la pile du processus : risque de débordement si celle-ci est déjà sollicitée.

## Connexions

### Notes liées
- [[GDB : [print] - afficher une valeur et choisir son format]] - Évalue aussi les appels, et conserve le résultat dans `$n`
- [[GDB : [set variable] - modifier une variable en cours d'exécution]] - L'autre façon d'agir sur l'état du processus
- [[GDB : [whatis] et [ptype] - inspecter le type d'une expression]] - `ptype fonction` donne la signature à respecter dans le cast
- [[ABI - Application Binary Interface]] - La convention d'appel que `gdb` doit respecter pour passer les arguments
- [[C - type opaque (encapsulation et stabilité ABI)]] - Le cas où l'accesseur est la seule voie d'accès aux données
- [[C - conversion de types (casting)]] - Le cast qui rétablit le type de retour

### Dans le contexte de
- [[GDB - débogueur en ligne de commande]] - Fait partie des actions sur un processus arrêté
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/GDB.md`

---
**Tags thématiques** : #gdb #debug #call #abi #c
