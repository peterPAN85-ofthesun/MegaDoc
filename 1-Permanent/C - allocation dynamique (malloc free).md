---
type: permanent
created: 2025-11-13 00:00
tags:
  - permanent
  - programmation
  - c
  - malloc
  - free
  - mémoire-dynamique
---

# C - allocation dynamique (malloc/free)

> [!abstract] Concept
> L'allocation dynamique permet de réserver de la mémoire pendant l'exécution du programme, avec une taille déterminée au runtime.

## Explication

**Différence statique/dynamique** :
- **Statique** : taille fixe à la compilation (`int tab[10]`)
- **Dynamique** : taille variable à l'exécution (`malloc()`)

**Fonctions principales** (librairie `stdlib.h`) :
- `malloc(taille)` : alloue `taille` octets, retourne `void*`
- `free(pointeur)` : libère la mémoire allouée
- `sizeof(type)` : taille en octets d'un type

**Règle d'or** : Tout `malloc()` doit avoir son `free()` correspondant.

## Exemples

### Allocation simple

```c
#include <stdlib.h>
#include <stdio.h>

int main() {
    int *p = NULL;

    // Alloue mémoire pour 1 entier
    p = (int*)malloc(sizeof(int));

    if (p == NULL) {
        printf("Erreur d'allocation\n");
        return 1;
    }

    *p = 42;  // Utilisation
    printf("%d\n", *p);

    free(p);  // Libération obligatoire
    return 0;
}
```

### Tableau dynamique

```c
int *tableau = NULL;
int taille = 10;

// Alloue tableau de 10 entiers
tableau = (int*)malloc(taille * sizeof(int));

if (tableau == NULL) {
    printf("Échec allocation\n");
    return 1;
}

// Utilisation comme tableau normal
for (int i = 0; i < taille; i++) {
    tableau[i] = i * 2;
}

// Affichage
for (int i = 0; i < taille; i++) {
    printf("%d ", tableau[i]);
}

free(tableau);  // Libération
```

### Taille variable (saisie utilisateur)

```c
int nbElements;
printf("Combien d'éléments ? ");
scanf("%d", &nbElements);

int *tab = (int*)malloc(nbElements * sizeof(int));

if (tab != NULL) {
    // Utilisation...
    free(tab);
}
```

### Allocation de structure

```c
typedef struct {
    int x;
    int y;
} Point;

Point *p = (Point*)malloc(sizeof(Point));

if (p != NULL) {
    p->x = 10;
    p->y = 20;
    free(p);
}
```

### Tableau de pointeurs (tableau 2D dynamique)

```c
int lignes = 3, colonnes = 4;
int **matrice = NULL;

// Alloue tableau de pointeurs
matrice = (int**)malloc(lignes * sizeof(int*));

// Alloue chaque ligne
for (int i = 0; i < lignes; i++) {
    matrice[i] = (int*)malloc(colonnes * sizeof(int));
}

// Utilisation
matrice[0][0] = 1;
matrice[1][2] = 5;

// Libération (dans l'ordre inverse)
for (int i = 0; i < lignes; i++) {
    free(matrice[i]);
}
free(matrice);
```

### Fonction calloc (initialise à zéro)

```c
// malloc : mémoire non initialisée
int *tab1 = (int*)malloc(10 * sizeof(int));  // Valeurs aléatoires

// calloc : mémoire initialisée à 0
int *tab2 = (int*)calloc(10, sizeof(int));  // Tous à 0

free(tab1);
free(tab2);
```

### Fonction realloc (redimensionner)

```c
int *tab = (int*)malloc(5 * sizeof(int));

// Agrandir à 10 éléments
tab = (int*)realloc(tab, 10 * sizeof(int));

free(tab);
```

## Connexions

### Concepts liés
- [[C - pointeurs (concepts de base)]] - malloc retourne un pointeur
- [[C - tableaux statiques]] - Alternative aux tableaux fixes
- [[C - structures (struct)]] - Allocation de structures

### Pièges courants
- **Fuite mémoire** (memory leak) : oublier `free()`
- **Double free** : libérer 2 fois la même mémoire
- **Dangling pointer** : utiliser un pointeur après `free()`
- **Ne pas vérifier NULL** : malloc peut échouer

### Bonnes pratiques

```c
// Toujours vérifier
void *ptr = malloc(size);
if (ptr == NULL) {
    // Gestion d'erreur
}

// Libérer et mettre à NULL
free(ptr);
ptr = NULL;  // Évite dangling pointer
```

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 16)

---
**Tags thématiques** : #c #malloc #free #mémoire-dynamique #allocation #heap
