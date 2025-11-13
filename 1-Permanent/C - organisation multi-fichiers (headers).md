---
type: permanent
created: 2025-11-12 23:45
tags:
  - permanent
  - programmation
  - c
  - headers
  - organisation
---

# C - organisation multi-fichiers (headers)

> [!abstract] Concept
> Les fichiers headers (.h) contiennent les déclarations (prototypes, structures, macros) permettant de partager du code entre plusieurs fichiers .c.

## Explication

**Structure d'un projet C** :
- **Fichiers .c** : implémentation (définitions de fonctions)
- **Fichiers .h** : interface (prototypes, structures, macros)
- **#include** : inclusion de headers

**Avantages** :
- Réutilisation du code
- Organisation modulaire
- Séparation interface/implémentation
- Compilation séparée (plus rapide)

**Types d'inclusion** :
- `#include <stdio.h>` : headers système (bibliothèques standard)
- `#include "monfichier.h"` : headers personnalisés (même dossier)

## Exemples

### Structure de base

**Fichier : math_utils.h**
```c
#ifndef MATH_UTILS_H
#define MATH_UTILS_H

// Prototypes
int addition(int a, int b);
int multiplication(int a, int b);

#endif
```

**Fichier : math_utils.c**
```c
#include <stdio.h>
#include "math_utils.h"

int addition(int a, int b) {
    return a + b;
}

int multiplication(int a, int b) {
    return a * b;
}
```

**Fichier : main.c**
```c
#include <stdio.h>
#include "math_utils.h"

int main() {
    printf("5 + 3 = %d\n", addition(5, 3));
    printf("5 * 3 = %d\n", multiplication(5, 3));
    return 0;
}
```

### Include guards (protection contre inclusions multiples)

```c
#ifndef DEF_MONFICHIER_H
#define DEF_MONFICHIER_H

// Contenu du header (prototypes, structures, etc.)

#endif
```

**Problème sans guards** :
```c
// fichier1.h
struct Data { int x; };

// fichier2.h
#include "fichier1.h"

// main.c
#include "fichier1.h"
#include "fichier2.h"
// ERREUR: struct Data définie 2 fois!
```

**Solution avec guards** :
```c
// fichier1.h
#ifndef FICHIER1_H
#define FICHIER1_H
struct Data { int x; };
#endif

// Maintenant, inclusions multiples OK!
```

### Exemple complet : projet modulaire

**game.h**
```c
#ifndef GAME_H
#define GAME_H

typedef struct {
    int vie;
    int mana;
} Joueur;

// Prototypes
Joueur creerJoueur(int vie, int mana);
void afficherJoueur(Joueur j);

#endif
```

**game.c**
```c
#include <stdio.h>
#include "game.h"

Joueur creerJoueur(int vie, int mana) {
    Joueur j;
    j.vie = vie;
    j.mana = mana;
    return j;
}

void afficherJoueur(Joueur j) {
    printf("Vie: %d, Mana: %d\n", j.vie, j.mana);
}
```

**main.c**
```c
#include "game.h"

int main() {
    Joueur hero = creerJoueur(100, 50);
    afficherJoueur(hero);
    return 0;
}
```

### Compilation multi-fichiers

```bash
# Méthode 1 : compilation directe
gcc main.c game.c -o jeu

# Méthode 2 : compilation séparée
gcc -c main.c     # → main.o
gcc -c game.c     # → game.o
gcc main.o game.o -o jeu

# Avec CMake
add_executable(jeu main.c game.c)
```

### Fonction static (privée au fichier)

```c
// utils.c
static int fonctionPrivee() {
    // Invisible depuis d'autres fichiers
    return 42;
}

int fonctionPublique() {
    return fonctionPrivee();  // OK dans le même fichier
}
```

## Connexions

### Concepts liés
- [[C - fonctions (déclaration et appel)]] - Prototypes
- [[C - structures (struct)]] - Déclaration dans headers
- [[C - directives préprocesseur (define include)]] - Mécanisme d'inclusion
- [[Makefile - automatisation compilation C]] - Build automatisé

### Bonnes pratiques
- Toujours utiliser include guards
- Un header par module logique
- Ne pas définir de fonctions dans les .h (seulement prototypes)
- Inclure uniquement les headers nécessaires

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 8)

---
**Tags thématiques** : #c #headers #include #organisation #modularité #compilation
