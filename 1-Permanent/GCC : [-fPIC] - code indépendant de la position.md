---
type: permanent
created: 2026-09-29 16:44
tags:
  - permanent
  - gcc
  - compilation
  - bibliotheque
  - linkage
---

# GCC : [-fPIC] - code indépendant de la position

> [!abstract] Concept
> `-fPIC` (*Position Independent Code*) fait générer un code sans aucune adresse absolue, donc exécutable quelle que soit l'adresse à laquelle il est chargé — condition nécessaire à toute [[C - bibliothèque statique vs bibliothèque partagée|bibliothèque partagée]].

## Explication

Une bibliothèque partagée n'a pas d'adresse de chargement fixée à l'avance : le *dynamic loader* la place là où il reste de la place, et cette adresse change d'un processus à l'autre. Si le code contenait des adresses absolues — « sauter à 0x4005a0 », « lire la globale à 0x601040 » — il faudrait les corriger une à une au chargement, ce qui interdirait de partager la même page de code entre processus, puisque chacun l'aurait modifiée différemment.

`-fPIC` résout le problème en n'émettant que des références **relatives**. Les sauts internes se font relativement au compteur de programme, et les accès aux données ou aux fonctions externes passent par deux tables remplies au chargement, la **GOT** (*Global Offset Table*) et la **PLT** (*Procedure Linkage Table*). Seules ces tables, petites et propres à chaque processus, sont relocalisées : le code lui-même reste identique en mémoire physique et réellement partagé.

En pratique, oublier `-fPIC` sur les objets destinés à un `.so` produit une erreur de link explicite (`relocation R_X86_64_32S ... can not be used when making a shared object; recompile with -fPIC`). La conséquence côté build est qu'un même `.o` ne convient pas idéalement aux deux cibles : les objets d'une archive statique n'ont pas besoin de PIC, et l'indirection GOT/PLT a un petit coût. `-fPIE`, la variante pour exécutables, sert à l'ASLR et est aujourd'hui le défaut de la plupart des distributions.

## Exemples

### Le message d'erreur caractéristique

```bash
$ gcc -c src/foo.c -o build/foo.o        # sans -fPIC
$ gcc -shared -o libfoo.so build/foo.o
/usr/bin/ld: build/foo.o: relocation R_X86_64_32S against `.rodata'
can not be used when making a shared object; recompile with -fPIC
```

### La compilation correcte

```bash
gcc -c -fPIC src/foo.c -Iinclude -o build/foo.o
gcc -shared -o libfoo.so build/foo.o
```

### Dans un Makefile, par cible

```Makefile
PICFLAGS := -fPIC -fvisibility=hidden

$(SHARED): CFLAGS += $(PICFLAGS)    # n'étend CFLAGS que pour cette cible
$(SHARED): $(OBJS)
	$(CC) -shared -o $@ $^ $(LDFLAGS)
```

### Variantes

| Option | Usage |
|---|---|
| `-fpic` | PIC avec table d'offsets de taille limitée (plus rapide, plafond sur certaines architectures). |
| `-fPIC` | PIC sans limite de taille de GOT. Le choix sûr pour une bibliothèque. |
| `-fPIE` | Équivalent pour un **exécutable** position-independent (ASLR). Défaut courant. |
| `-fno-pic` | Désactive explicitement, pour du code chargé à adresse fixe. |

## Cas d'usage

- **Construire un `.so`** : obligatoire, sans quoi le link échoue.
- **Durcir un exécutable** : `-fPIE -pie` permet à l'ASLR de randomiser l'adresse de base du binaire.
- **Code chargé à adresse fixe** (bootloader, firmware, homebrew console) : `-fno-pic`, le PIC n'y apporte rien et coûte une indirection.

## Avantages et inconvénients

✅ **Avantages** :
- Une seule copie physique du code partagée entre tous les processus.
- Chargement à n'importe quelle adresse, base de l'ASLR.

❌ **Inconvénients** / Limites :
- Indirection GOT/PLT sur les accès globaux et les appels externes : léger surcoût.
- Un registre réservé à la table sur certaines architectures, donc un de moins pour l'allocateur.
- Objets non interchangeables entre cible statique et cible partagée si l'on veut éviter ce surcoût.

## Connexions

### Notes liées
- [[C - bibliothèque statique vs bibliothèque partagée]] - Le contexte qui rend `-fPIC` obligatoire
- [[GCC : [-fvisibility] - visibilité des symboles]] - Son compagnon habituel dans `PICFLAGS`
- [[ELF - Executable and Linkable Format]] - GOT, PLT et relocations
- [[C - Makefile de bibliothèque]] - Où il s'active par cible
- [[C - compilation et linkage]] - L'étape concernée

### Dans le contexte de
- [[ABI - Application Binary Interface]] - Une des conventions binaires de la plateforme
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/Créer sa librairie en C-C++.md` (chapitre 3b)

---
**Tags thématiques** : #gcc #pic #bibliotheque #linkage #elf
