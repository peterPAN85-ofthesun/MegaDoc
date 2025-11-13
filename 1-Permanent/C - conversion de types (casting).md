---
type: permanent
created: 2025-11-12 23:20
tags:
  - permanent
  - programmation
  - c
  - casting
  - types
---

# C - conversion de types (casting)

> [!abstract] Concept
> Le casting permet de convertir une valeur d'un type vers un autre type, soit implicitement par le compilateur, soit explicitement par le programmeur.

## Explication

**Conversion implicite** : Le compilateur convertit automatiquement quand nécessaire
**Conversion explicite (cast)** : Le programmeur force la conversion avec `(type)variable`

**Syntaxe du cast** :
```c
(type_cible) variable
```

**Conversions courantes** :
- `int` → `double` : élargissement (toujours sûr)
- `double` → `int` : rétrécissement (perte de précision)
- `int` → `char` : rétrécissement (risque de perte)

## Exemples

### Cast explicite

```c
int a = 5;
double b;

b = (double)a;  // b = 5.0 (conversion int → double)
```

### Division avec cast

```c
int x = 5, y = 2;
double resultat;

resultat = x / y;          // 2.0 (division entière puis conversion)
resultat = (double)x / y;  // 2.5 (conversion puis division réelle)
```

**Explication** :
- Sans cast : `5 / 2 = 2` (division entière), puis `2 → 2.0`
- Avec cast : `5.0 / 2 = 2.5` (division réelle)

### Conversion double → int (troncature)

```c
double pi = 3.14159;
int entier;

entier = (int)pi;  // entier = 3 (partie décimale perdue)
```

### Conversion avec perte de données

```c
int grand = 300;
char petit;

petit = (char)grand;  // Résultat imprévisible (char = -128 à 127)
```

### Conversion implicite

```c
int a = 5;
float b = 2.5;
float resultat;

resultat = a + b;  // a est implicitement converti en float
                   // résultat = 7.5
```

### Cast pour pointeurs

```c
void* ptr = malloc(100);
int* int_ptr = (int*)ptr;  // Conversion void* → int*
```

## Connexions

### Concepts liés
- [[C - types de données primitifs]] - Types de base
- [[C - opérateurs arithmétiques]] - Division entière vs réelle
- [[C - pointeurs (concepts de base)]] - Cast de pointeurs
- [[C - allocation dynamique (malloc free)]] - Cast de void*

### Règles importantes
- Toujours caster explicitement pour la clarté du code
- Attention aux pertes de données (double → int, int → char)
- La conversion `void*` → `type*` nécessite un cast explicite
- Utiliser `sizeof()` pour connaître la taille d'un type

### Exemple sizeof()

```c
#include <stdio.h>

int main() {
    int a = 5;
    printf("Taille de int: %zu octets\n", sizeof(int));
    printf("Taille de a: %zu octets\n", sizeof(a));
    return 0;
}
```

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 3)

---
**Tags thématiques** : #c #casting #conversion #types #sizeof
