---
type: permanent
created: 2025-11-12 23:50
tags:
  - permanent
  - programmation
  - c
  - pointeurs
  - mémoire
---

# C - pointeurs (concepts de base)

> [!abstract] Concept
> Un pointeur est une variable qui stocke l'adresse mémoire d'une autre variable, permettant l'accès indirect aux données.

## Explication

**Concept fondamental** :
- Chaque variable est stockée à une **adresse mémoire**
- Un pointeur **pointe vers** cette adresse
- Permet la manipulation indirecte de variables

**Opérateurs** :
- `&variable` : adresse de la variable
- `*pointeur` : valeur pointée (déréférencement)
- `*` dans déclaration : déclare un pointeur

**Syntaxe** :
```c
type *nom_pointeur = &variable;
```

## Exemples

### Déclaration et utilisation de base

```c
int nombre = 42;
int *pointeur = &nombre;  // pointeur contient l'adresse de nombre

printf("Valeur de nombre: %d\n", nombre);          // 42
printf("Adresse de nombre: %p\n", &nombre);        // 0x7ffe...
printf("Valeur du pointeur: %p\n", pointeur);      // 0x7ffe... (même adresse)
printf("Valeur pointée: %d\n", *pointeur);         // 42
```

### Modification via pointeur

```c
int x = 10;
int *p = &x;

*p = 20;  // Modifie x via le pointeur

printf("%d\n", x);  // Affiche 20
```

### Initialisation NULL

```c
int *ptr = NULL;  // Pointeur initialisé à NULL (pointe nulle part)

if (ptr == NULL) {
    printf("Pointeur non initialisé\n");
}
```

**Important** : Toujours initialiser les pointeurs à NULL s'ils ne pointent pas immédiatement vers une variable.

### Types de pointeurs

```c
int *p_int;      // Pointeur vers int
char *p_char;    // Pointeur vers char
double *p_double; // Pointeur vers double
float *p_float;   // Pointeur vers float

// Le type du pointeur DOIT correspondre au type de la variable pointée
```

### Passage par référence

```c
void incrementer(int *p) {
    (*p)++;  // Incrémente la valeur pointée
}

int main() {
    int nombre = 5;
    incrementer(&nombre);  // Passe l'adresse
    printf("%d\n", nombre);  // Affiche 6
    return 0;
}
```

### Pointeurs et scanf

```c
int age;
scanf("%d", &age);  // &age = adresse où stocker la valeur saisie
```

### Pointeurs multiples

```c
int *ptr1, *ptr2, *ptr3;  // Déclare 3 pointeurs

// Attention :
int* ptr1, ptr2;  // ptr1 est un pointeur, ptr2 est un int !
```

### Pointeur vers pointeur

```c
int x = 42;
int *p = &x;      // p pointe vers x
int **pp = &p;    // pp pointe vers p

printf("%d\n", **pp);  // Affiche 42 (double déréférencement)
```

## Connexions

### Concepts liés
- [[C - tableaux statiques]] - Relation pointeurs-tableaux
- [[C - allocation dynamique (malloc free)]] - Pointeurs et mémoire dynamique
- [[C - fonctions (déclaration et appel)]] - Passage par référence
- [[C - chaînes de caractères (strings)]] - char* pour les strings

### Règles essentielles
- Toujours initialiser (`= NULL` ou `= &variable`)
- Ne jamais déréférencer un pointeur NULL
- Le type du pointeur doit correspondre au type pointé
- `&` et `*` sont des opérateurs inverses

### Visualisation

```
Mémoire:
┌─────────┬──────────┐
│ Adresse │  Valeur  │
├─────────┼──────────┤
│  0x1000 │    42    │  ← nombre
│  0x1004 │ 0x1000   │  ← pointeur
└─────────┴──────────┘

int nombre = 42;         // nombre est à 0x1000, contient 42
int *pointeur = &nombre; // pointeur est à 0x1004, contient 0x1000
```

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 9)

---
**Tags thématiques** : #c #pointeurs #mémoire #adresse #déréférencement
