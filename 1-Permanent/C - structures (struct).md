---
type: permanent
created: 2025-11-13 00:15
tags:
  - permanent
  - programmation
  - c
  - struct
  - structures
---

# C - structures (struct)

> [!abstract] Concept
> Une structure permet de regrouper plusieurs variables de types différents sous un même nom, créant ainsi un type composé personnalisé.

## Explication

**Définition** : Type de données personnalisé regroupant plusieurs champs

**Syntaxe** :
```c
struct NomStructure {
    type1 champ1;
    type2 champ2;
};
```

**Accès aux champs** :
- `structure.champ` : accès direct
- `pointeur->champ` : via pointeur

## Exemples

### Déclaration et utilisation

```c
struct Point {
    int x;
    int y;
};

int main() {
    struct Point p;
    p.x = 10;
    p.y = 20;

    printf("(%d, %d)\n", p.x, p.y);
    return 0;
}
```

### Typedef (simplification)

```c
typedef struct Point Point;
struct Point {
    int x;
    int y;
};

// Maintenant on peut écrire :
Point p;  // Au lieu de : struct Point p;
```

### Initialisation

```c
struct Point p1 = {10, 20};  // x=10, y=20
struct Point p2 = {0};       // x=0, y=0
```

### Pointeur vers structure

```c
Point p = {10, 20};
Point *ptr = &p;

// Deux notations équivalentes :
(*ptr).x = 30;
ptr->x = 30;  // Préférable
```

## Connexions

- [[C - énumérations (enum)]] - Autre type composé
- [[C - programmation orientée objet]] - Base de la POO en C
- [[C - allocation dynamique (malloc free)]] - Allocation de structures

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 13)

---
**Tags thématiques** : #c #struct #structures #typedef
