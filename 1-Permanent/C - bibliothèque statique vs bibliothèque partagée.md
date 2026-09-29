---
type: permanent
created: 2026-09-29 16:20
tags:
  - permanent
  - c
  - build
  - linkage
  - bibliotheque
---

# C - bibliothèque statique vs bibliothèque partagée

> [!abstract] Concept
> Une bibliothèque **statique** (`.a`) est recopiée dans l'exécutable à l'édition de liens, une bibliothèque **partagée** (`.so`) n'y laisse qu'une référence résolue au lancement — le choix arbitre entre autonomie du binaire et mise à jour centralisée.

## Explication

L'archive statique n'est qu'un conteneur de fichiers objets (`ar rcs`). Au link, l'éditeur de liens en extrait les seuls membres qui résolvent un symbole manquant et les recopie dans le binaire final. Le programme produit est **autonome** : il ne dépend plus de la présence de la bibliothèque sur la machine cible, et la question de l'[[ABI - Application Binary Interface]] ne se pose pas puisque le code embarqué est exactement celui contre lequel on a compilé.

La bibliothèque partagée suit la logique inverse. Le binaire ne contient qu'un `DT_NEEDED` pointant vers `libfoo.so` ; c'est le *dynamic loader* (`ld.so`) qui, au lancement, la charge et résout les symboles. Une seule copie du code réside en mémoire physique quel que soit le nombre de processus qui l'utilisent, et corriger un bug dans la bibliothèque corrige d'un coup tous les programmes qui en dépendent, **sans recompilation**. Le prix à payer est double : la bibliothèque doit être installée et trouvable sur le système, et son ABI doit rester stable d'une version à l'autre — d'où la règle de ne jamais exposer ses structures à l'utilisateur (voir [[C - type opaque (encapsulation et stabilité ABI)]]).

En pratique, la ligne de partage tient à la portée du projet. Une bibliothèque destinée à être installée au niveau du système d'exploitation et partagée par de nombreux programmes sera **partagée**. Un projet de taille modeste, livré avec son exécutable ou embarqué, gagne à rester **statique** : pas de déploiement à gérer, pas de contrat ABI à tenir.

## Exemples

### Produire les deux depuis les mêmes sources

```bash
# Statique : archiver les objets
gcc -c src/foo.c -Iinclude -o build/foo.o
ar rcs libfoo.a build/foo.o

# Partagée : objets compilés en PIC, puis link partiel
gcc -c -fPIC src/foo.c -Iinclude -o build/foo.o
gcc -shared -o libfoo.so build/foo.o
```

### Observer la différence sur le binaire

```bash
$ gcc prog.c -L. -lfoo -o prog     # lié à libfoo.so
$ ldd prog
        libfoo.so => not found      # dépendance externe visible

$ gcc prog.c ./libfoo.a -o prog    # lié à libfoo.a
$ ldd prog
        not a dynamic executable... # aucune trace de foo
```

### Tableau de décision

| Critère | Statique `.a` | Partagée `.so` |
|---|---|---|
| Déploiement | binaire autonome | bibliothèque à installer |
| Taille du binaire | plus lourd | léger |
| Mémoire (N programmes) | N copies | 1 copie |
| Correction de bug | recompiler tous les programmes | remplacer le `.so` |
| Contrainte ABI | aucune | forte |

## Cas d'usage

- **Bibliothèque système** (`libc`, `libssl`) : partagée, pour mutualiser mémoire et correctifs de sécurité.
- **Outil distribué en un seul fichier** : statique, pour éliminer toute dépendance à l'installation.
- **Cible embarquée sans loader dynamique** : statique, seule option disponible (cas typique de la [[PS2SDK - répartition des bibliothèques EE|console PS2]]).

## Avantages et inconvénients

✅ **Statique** :
- Exécutable autonome, aucune dépendance de déploiement.
- Aucun problème d'ABI : la bonne version est embarquée.
- ❌ Chaque changement du code source impose de recompiler tous les programmes.
- ❌ Exécutable plus lourd, code dupliqué en mémoire.

✅ **Partagée** :
- Mise à jour centralisée sans recompiler les programmes clients.
- Une seule copie en mémoire pour tout le système.
- ❌ Impose de surveiller l'ABI et de masquer les structures.
- ❌ Doit être présente et trouvable sur le système cible.

## Connexions

### Notes liées
- [[ABI - Application Binary Interface]] - Le contrat que seule la bibliothèque partagée doit tenir
- [[C - type opaque (encapsulation et stabilité ABI)]] - La technique qui rend l'ABI stable
- [[GCC : [-fPIC] - code indépendant de la position]] - Obligatoire pour compiler un `.so`
- [[C - convention -lfoo et recherche des archives]] - `ld` cherche `.so` avant `.a`
- [[C - compilation et linkage]] - L'étape de link où se joue la différence
- [[ELF - Executable and Linkable Format]] - Le format commun aux deux

### Dans le contexte de
- [[C - arborescence d'un projet de bibliothèque]] - Le projet qui produit l'une ou l'autre
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/Créer sa librairie en C-C++.md` (chapitre 1)

---
**Tags thématiques** : #c #build #linkage #bibliotheque #abi
