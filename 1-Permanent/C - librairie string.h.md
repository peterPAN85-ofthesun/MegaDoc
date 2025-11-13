---
type: permanent
created: 2025-11-13 00:12
tags:
  - permanent
  - programmation
  - c
  - string.h
  - librairie
---

# C - librairie string.h

> [!abstract] Concept
> La librairie string.h fournit des fonctions pour manipuler les chaînes de caractères (longueur, copie, concaténation, comparaison).

## Explication

Fonctions principales :

| Fonction | Description |
|----------|-------------|
| `strlen(s)` | Longueur de la chaîne |
| `strcpy(dest, src)` | Copie src dans dest |
| `strcat(dest, src)` | Concatène src à dest |
| `strcmp(s1, s2)` | Compare s1 et s2 |
| `strchr(s, c)` | Cherche caractère c |
| `strstr(s, sub)` | Cherche sous-chaîne |

## Exemples

```c
#include <string.h>
#include <stdio.h>

int main() {
    char str1[50] = "Hello";
    char str2[] = " World";

    // Longueur
    printf("Longueur: %zu\n", strlen(str1));  // 5

    // Copie
    char copie[50];
    strcpy(copie, str1);  // copie = "Hello"

    // Concaténation
    strcat(str1, str2);  // str1 = "Hello World"

    // Comparaison
    if (strcmp(str1, "Hello World") == 0) {
        printf("Identiques\n");
    }

    return 0;
}
```

## Connexions

- [[C - chaînes de caractères (strings)]] - Concept de base

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Librairies/Librairie string.h.md`

---
**Tags thématiques** : #c #string.h #librairie #strlen #strcpy
