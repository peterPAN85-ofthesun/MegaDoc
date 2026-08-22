---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - c
  - linkage
  - build
---

# C - ordre de résolution des archives au link

> [!abstract] Concept
> `ld` parcourt les archives en **une seule passe, de gauche à droite**, et n'extrait que les membres résolvant un symbole déjà indéfini à cet instant — d'où la règle « les objets d'abord, les bibliothèques ensuite » et le recours à `--start-group` pour les dépendances croisées.

## Explication

Une archive `.a` n'est pas un bloc monolithique : c'est un **sac de fichiers objets** accompagné d'un index de symboles. Quand `ld` la lit, il ne prend que les membres qui répondent à un symbole manquant **à ce moment-là**. Ce qui n'est pas réclamé au moment de la lecture est abandonné définitivement, sans retour en arrière.

D'où la règle fondamentale : `ld -o prog -lfoo foo.o` **échoue**, parce qu'au moment où `libfoo` est lue aucun symbole n'est encore attendu — elle est ignorée, puis `foo.o` réclame ses fonctions, trop tard. La forme correcte est `ld -o prog foo.o -lfoo`. Le corollaire vaut entre bibliothèques : si `libA` a besoin de `libB`, il faut écrire `-lA -lB`, la plus dépendante en premier.

Quand deux archives se réclament mutuellement, aucun ordre linéaire ne fonctionne. Deux solutions : répéter l'archive (`-lA -lB -lA`), ou encadrer par `-Wl,--start-group … -Wl,--end-group`, qui demande à `ld` de reparcourir le groupe en boucle jusqu'à ce qu'aucun nouveau symbole ne soit résolu. C'est plus coûteux, d'où son usage réservé aux cas réellement circulaires — typiquement le trio libc / glue / noyau.

Dernier point, décisif en pratique : le **plugin LTO** de GCC, actif par défaut sur beaucoup de chaînes, réexamine les archives et **masque ces erreurs d'ordre**. Un link mal ordonné peut passer via `gcc` et échouer via `ld` direct ou avec `-fno-use-linker-plugin`. Il ne faut pas s'y fier.

## Exemples

### La règle de base

```bash
# ÉCHOUE — au moment où libfoo est lue, aucun symbole n'est encore attendu
ld -o prog -lfoo foo.o
#   undefined reference to `fonction_de_foo'

# CORRECT
ld -o prog foo.o -lfoo
```

### Dépendances croisées

```bash
gcc ... -lA -lB -lA                                  # répéter l'archive
gcc ... -Wl,--start-group -lA -lB -Wl,--end-group    # relire jusqu'à stabilisation
```

### Vérifier sans le filet du LTO

```bash
gcc -fno-use-linker-plugin ... -lfoo foo.o   # fait ressortir la vraie erreur d'ordre
```

## Cas d'usage

- **Diagnostiquer un `undefined reference`** alors que la bibliothèque est bien passée.
- **Lier une libc embarquée** avec ses dépendances circulaires.
- **Porter un build** vers une chaîne d'outils sans LTO.

## Avantages et inconvénients

✅ **Avantages** :
- Une seule passe : édition de liens rapide même sur de gros projets.
- `--start-group` reste disponible pour les cas circulaires.

❌ **Inconvénients** / Limites :
- L'ordre est une contrainte implicite qu'aucun message n'explique.
- Le LTO masque l'erreur, qui ressurgit sur une autre chaîne d'outils.

## Connexions

### Notes liées
- [[C - convention -lfoo et recherche des archives]] - Comment `ld` trouve chaque archive
- [[C - en-tête et bibliothèque (déclarer vs définir)]] - L'origine des symboles indéfinis
- [[GCC - driver et non compilateur]] - Qui transmet ces options à `ld`
- [[PS2SDK - bibliothèques injectées par les specs GCC]] - Un `--start-group` réel

- [[ELF - Executable and Linkable Format]] - La table des symboles que `ld` cherche à satisfaire

### Dans le contexte de
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 7f)

---
**Tags thématiques** : #c #linkage #ld #archives #lto
