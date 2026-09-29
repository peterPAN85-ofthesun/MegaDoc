---
type: permanent
created: 2026-09-29 16:21
tags:
  - permanent
  - c
  - abi
  - linkage
  - bibliotheque
---

# ABI - Application Binary Interface

> [!abstract] Concept
> L'ABI est le contrat **binaire** entre deux modules compilés séparément — taille et disposition des types, convention d'appel, noms de symboles — par opposition à l'API qui n'est qu'un contrat *source*.

## Explication

Quand le compilateur traduit `list.size`, il ne produit pas un accès « au champ nommé size » mais un accès *à l'octet 8 de la structure*. De même, `sizeof(struct foo_list)` devient une constante gravée dans le code, et un appel de fonction devient un `jal` vers un symbole dont le nom, les registres d'arguments et l'ordre d'empilement sont figés. Tout cet ensemble de décisions — offsets, tailles, alignement, convention d'appel, *mangling* des noms — constitue l'ABI.

La distinction avec l'API est ce qui rend l'ABI difficile. Une API reste compatible tant que le code de l'utilisateur **compile** ; une ABI reste compatible tant que le binaire de l'utilisateur **fonctionne sans être recompilé**. Ajouter un champ au milieu d'une structure publique ne casse aucune compilation : c'est une rupture d'ABI silencieuse, qui ne se manifeste qu'à l'exécution, sous forme de valeurs absurdes ou de corruption mémoire.

Ce contrat n'a d'importance que là où deux binaires compilés à des moments différents doivent se parler : c'est exactement le cas d'une [[C - bibliothèque statique vs bibliothèque partagée|bibliothèque partagée]]. Avec une bibliothèque statique, tout est recompilé et relié ensemble, l'ABI n'est jamais mise à l'épreuve. Les moyens de la tenir sont connus : [[C - type opaque (encapsulation et stabilité ABI)|types opaques]], n'ajouter des fonctions qu'en fin d'interface, ne jamais réordonner les champs exposés, et versionner le `soname` (`libfoo.so.1`) lorsqu'une rupture est assumée.

## Exemples

### Rupture d'ABI sans rupture d'API

```c
/* version 1.0 — publiée */
struct foo_list { void *head; size_t size; };   /* size à l'offset 8 */

/* version 1.1 — un champ inséré */
struct foo_list { void *head; void *tail; size_t size; };  /* size à l'offset 16 */
```

Le code de l'utilisateur compile toujours (API intacte), mais son binaire **non recompilé** lit toujours l'octet 8 : il y trouve désormais `tail`. API stable, ABI cassée.

### Ce que couvre l'ABI

| Élément | Exemple de rupture |
|---|---|
| Taille d'un type | `sizeof(struct)` change |
| Offset des champs | un champ inséré ou réordonné |
| Convention d'appel | passage par registre → par pile |
| Nom du symbole | renommer une fonction publique |
| Mangling C++ | changer un type de paramètre |
| Visibilité | un symbole passé en `hidden` |

### C++ : une ABI bien plus fragile

En C++, changer un paramètre, ajouter une méthode `virtual` (donc une entrée de vtable) ou passer un membre en `const` rompt l'ABI, alors que le nom de la fonction n'a pas bougé — le *mangling* encode la signature complète.

## Cas d'usage

- **Publier une bibliothèque partagée** : garantir que les programmes existants continueront de fonctionner après mise à jour.
- **Versionner un `soname`** : `libfoo.so.1` → `libfoo.so.2` signale une rupture assumée, les deux versions cohabitent.
- **Interfacer deux langages** : `extern "C"` supprime le mangling C++ pour retomber sur l'ABI C, stable et documentée.

## Avantages et inconvénients

✅ **Avantages d'une ABI tenue** :
- Les programmes clients bénéficient des correctifs sans recompilation.
- Permet une distribution par paquets système indépendante.

❌ **Contraintes** :
- Gèle des choix d'implémentation très tôt dans la vie du projet.
- Les ruptures sont silencieuses à la compilation, coûteuses à l'exécution.

## Connexions

### Notes liées
- [[C - type opaque (encapsulation et stabilité ABI)]] - La parade principale côté C
- [[C - bibliothèque statique vs bibliothèque partagée]] - Le seul contexte où l'ABI compte vraiment
- [[C - en-tête compatible C et C++ (extern C)]] - `extern "C"` pour retomber sur l'ABI C
- [[GCC : [-fvisibility] - visibilité des symboles]] - Réduire la surface d'ABI exposée
- [[ELF - Executable and Linkable Format]] - Où vivent symboles et relocations

### Dans le contexte de
- [[C - en-tête public vs en-tête privé]] - La frontière source qui protège la frontière binaire
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/Archive/Créer sa librairie en C-C++.md` (chapitres 1 et 2b)

---
**Tags thématiques** : #c #abi #linkage #bibliotheque #compatibilite
