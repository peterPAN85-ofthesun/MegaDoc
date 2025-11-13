---
type: permanent
created: 2025-11-12 23:00
tags:
  - permanent
  - programmation
  - c
  - langage
---

# C - langage de programmation

> [!abstract] Concept
> Le C est un langage de programmation de bas niveau créé dans les années 1970, utilisé pour la programmation système et embarquée nécessitant contrôle fin de la mémoire et performances.

## Explication

Le C est un **langage compilé** qui se situe entre le langage machine et les langages de haut niveau. Il offre un contrôle direct sur la mémoire tout en restant portable.

**Caractéristiques principales** :
- Langage de **bas niveau** : accès direct à la mémoire via pointeurs
- **Compilé** : transformation du code source en binaire exécutable
- **Portable** : code compilable sur différentes plateformes
- **Performant** : proche du matériel, peu d'abstraction

**Outils nécessaires** :
- **Éditeur de texte** : pour écrire le code source (.c, .h)
- **Compilateur** : gcc, clang (transforme .c en binaire)
- **Débogueur** : gdb, lldb (pour déboguer)
- **IDE** (optionnel) : Code::Blocks, Visual Studio, Kdevelop, Xcode

## Exemples

### Programme minimal

```c
#include <stdio.h>
#include <stdlib.h>

int main()
{
    printf("Hello, World!");
    return 0;
}
```

**Décomposition** :
- `#include <stdio.h>` : importe la librairie standard d'entrée/sortie
- `int main()` : point d'entrée du programme, retourne un entier
- `printf()` : fonction d'affichage console
- `return 0` : code de retour (0 = succès)

### Commentaires

```c
// Commentaire sur une ligne

/*
Commentaire
sur plusieurs
lignes
*/
```

## Connexions

### Concepts liés
- [[C - compilation et linkage]] - Processus de transformation du code
- [[C - organisation multi-fichiers (headers)]] - Structure projet C
- [[C - entrées-sorties console (stdio.h)]] - Fonction printf

### Contexte
Le C est le langage de base pour comprendre la programmation système. Il a influencé de nombreux langages modernes (C++, C#, Java) et reste indispensable pour le développement système, noyau Linux, drivers, systèmes embarqués.

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md`
- OpenClassrooms : https://openclassrooms.com/fr/courses/19980-apprenez-a-programmer-en-c

---
**Tags thématiques** : #c #programmation #compilation #langage-bas-niveau
