---
type: permanent
created: 2025-11-12 23:05
tags:
  - permanent
  - programmation
  - c
  - types
---

# C - types de données primitifs

> [!abstract] Concept
> Les types primitifs en C définissent la nature et la taille des données stockées en mémoire : entiers, flottants, caractères.

## Explication

Chaque variable en C doit avoir un **type** qui détermine :
- La **taille en mémoire** (nombre d'octets)
- Les **valeurs possibles** (plage min-max)
- Les **opérations autorisées**

**Types de base** :

| Type | Taille | Plage (signed) | Usage |
|------|--------|----------------|-------|
| `char` | 1 octet | -128 à 127 | Caractère ASCII |
| `int` | 4 octets | -2^31 à 2^31-1 | Entier standard |
| `long` | 8 octets | -2^63 à 2^63-1 | Grand entier |
| `float` | 4 octets | ±3.4e-38 à ±3.4e38 | Décimal simple précision |
| `double` | 8 octets | ±1.7e-308 à ±1.7e308 | Décimal double précision |

**Modificateurs signed/unsigned** :
- `signed` : nombres négatifs et positifs (par défaut)
- `unsigned` : uniquement positifs, double la plage positive

## Exemples

### Déclaration de types

```c
int age;              // Entier signé
unsigned int score;   // Entier non-signé
char lettre;          // Caractère
float prix;           // Flottant simple précision
double pi;            // Flottant double précision
long population;      // Grand entier
```

### Signed vs Unsigned (8 bits)

```c
signed char a;    // -128 à 127
unsigned char b;  // 0 à 255
```

**Fonctionnement** :
- En **signed** : le bit de poids fort (MSB) indique le signe
  - `0111 1111` = +127
  - `1000 0000` = -128
- En **unsigned** : tous les bits représentent la valeur
  - `1111 1111` = 255

### Taille des types

```c
#include <stdio.h>

int main() {
    printf("Taille int: %zu octets\n", sizeof(int));
    printf("Taille char: %zu octets\n", sizeof(char));
    printf("Taille double: %zu octets\n", sizeof(double));
    return 0;
}
```

## Connexions

### Concepts liés
- [[C - variables (déclaration et portée)]] - Utilisation des types
- [[C - conversion de types (casting)]] - Changement de type
- [[C - opérateurs arithmétiques]] - Opérations sur types numériques
- [[C - pointeurs (concepts de base)]] - Pointeurs typés

### Règles importantes
- Toujours initialiser les variables avant utilisation
- Attention aux dépassements (overflow) : `unsigned char x = 255; x++; // x = 0`
- Le type `char` peut être signed ou unsigned selon la plateforme

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 3)

---
**Tags thématiques** : #c #types #int #char #float #double #mémoire
