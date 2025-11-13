---
type: permanent
created: 2025-11-12 23:55
tags:
  - permanent
  - programmation
  - c
  - tableaux
  - arrays
---

# C - tableaux statiques

> [!abstract] Concept
> Un tableau est un conteneur de taille fixe qui stocke plusieurs valeurs du même type dans des emplacements mémoire contigus.

## Explication

**Caractéristiques** :
- Taille fixe définie à la déclaration
- Éléments de même type
- Indexation à partir de 0
- Mémoire contiguë

**Accès aux éléments** :
- `tableau[index]` : accès direct
- `*(tableau + index)` : accès via pointeur (équivalent)

**Relation pointeur-tableau** :
- Le nom du tableau **est un pointeur** vers le premier élément
- `tableau` ≡ `&tableau[0]`

## Exemples

### Déclaration et initialisation

```c
// Méthode 1 : déclaration puis affectation
int tableau[4];
tableau[0] = 10;
tableau[1] = 23;
tableau[2] = 505;
tableau[3] = 8;

// Méthode 2 : initialisation directe
int tableau[4] = {10, 23, 505, 8};

// Méthode 3 : initialisation partielle
int tableau[4] = {10, 23};  // {10, 23, 0, 0}

// Méthode 4 : initialisation à zéro
int tableau[4] = {0};  // {0, 0, 0, 0}

// Méthode 5 : taille automatique
int tableau[] = {12, 19, 18, 2};  // Taille = 4
```

### Accès aux éléments

```c
int tab[4] = {10, 20, 30, 40};

printf("%d\n", tab[0]);        // 10 (premier élément)
printf("%d\n", tab[3]);        // 40 (dernier élément)

tab[2] = 100;                   // Modification
printf("%d\n", tab[2]);        // 100
```

### Relation avec les pointeurs

```c
int tab[4] = {10, 20, 30, 40};

// Ces accès sont équivalents :
printf("%d\n", tab[0]);         // 10
printf("%d\n", *tab);           // 10
printf("%d\n", *(tab + 0));     // 10

printf("%d\n", tab[2]);         // 30
printf("%d\n", *(tab + 2));     // 30
```

### Tableau comme paramètre de fonction

```c
// Méthode 1 : notation tableau
void afficher(int tableau[], int taille) {
    for (int i = 0; i < taille; i++) {
        printf("%d ", tableau[i]);
    }
}

// Méthode 2 : notation pointeur (équivalent)
void afficher(int *tableau, int taille) {
    for (int i = 0; i < taille; i++) {
        printf("%d ", tableau[i]);
    }
}

int main() {
    int tab[4] = {10, 15, 3, 8};
    afficher(tab, 4);  // Passe l'adresse du premier élément
    return 0;
}
```

### Parcours de tableau

```c
int tableau[5] = {1, 2, 3, 4, 5};
int taille = 5;

// Parcours avec for
for (int i = 0; i < taille; i++) {
    printf("%d ", tableau[i]);
}

// Parcours avec pointeur
int *p = tableau;
for (int i = 0; i < taille; i++) {
    printf("%d ", *(p + i));
}
```

### Tableaux multidimensionnels

```c
// Tableau 2D (matrice 3x3)
int matrice[3][3] = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

printf("%d\n", matrice[0][0]);  // 1
printf("%d\n", matrice[1][2]);  // 6
printf("%d\n", matrice[2][2]);  // 9

// Parcours 2D
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        printf("%d ", matrice[i][j]);
    }
    printf("\n");
}
```

### Taille d'un tableau

```c
int tab[] = {1, 2, 3, 4, 5};
int taille = sizeof(tab) / sizeof(tab[0]);  // 5

printf("Taille: %d éléments\n", taille);
```

## Connexions

### Concepts liés
- [[C - pointeurs (concepts de base)]] - Arithmétique de pointeurs
- [[C - relation pointeurs-tableaux]] - Équivalence
- [[C - chaînes de caractères (strings)]] - Tableaux de char
- [[C - allocation dynamique (malloc free)]] - Tableaux dynamiques

### Limites et pièges
- Pas de vérification des bornes : `tab[100]` peut compiler même si taille = 4
- Taille fixe : impossible de redimensionner
- Passage par référence implicite aux fonctions
- Impossible de retourner un tableau local d'une fonction

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 10)

---
**Tags thématiques** : #c #tableaux #arrays #indexation #mémoire
