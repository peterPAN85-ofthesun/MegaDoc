---
type: permanent
created: 2025-11-13 00:20
tags:
  - permanent
  - programmation
  - c
  - préprocesseur
  - define
  - include
---

# C - directives préprocesseur (#define, #include)

> [!abstract] Concept
> Le préprocesseur traite les directives (lignes commençant par #) avant la compilation, permettant les inclusions, macros et compilations conditionnelles.

## Explication

**Préprocesseur** : Premier passage avant compilation
- Traite les directives `#`
- Remplace les macros
- Inclut les fichiers
- Gère la compilation conditionnelle

**Directives principales** :
- `#include` : inclure un fichier
- `#define` : définir une macro
- `#ifdef`, `#ifndef` : compilation conditionnelle

## Exemples

### #include

```c
#include <stdio.h>    // Librairie système
#include "monfichier.h"  // Fichier local
```

### #define - Constantes

```c
#define PI 3.14159
#define MAX_SIZE 100

int tableau[MAX_SIZE];
double cercle = 2 * PI * rayon;
```

### #define - Macros fonction

```c
#define CARRE(x) ((x) * (x))
#define MAX(a,b) ((a) > (b) ? (a) : (b))

int result = CARRE(5);  // 25
int maximum = MAX(10, 20);  // 20
```

**Important** : Toujours mettre des parenthèses autour des paramètres et du corps de la macro.

### Compilation conditionnelle

```c
#define WINDOWS

#ifdef WINDOWS
    // Code pour Windows
#endif

#ifdef LINUX
    // Code pour Linux
#endif

#ifndef DEBUG
    // Code si DEBUG n'est pas défini
#endif
```

### Protection d'inclusion multiple

```c
#ifndef FICHIER_H
#define FICHIER_H

// Contenu du header

#endif
```

## Connexions

- [[C - organisation multi-fichiers (headers)]] - Include guards
- [[C - macros prédéfinies]] - Macros système

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 12)

---
**Tags thématiques** : #c #préprocesseur #define #include #macros
