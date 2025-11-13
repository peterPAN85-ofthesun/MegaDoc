---
type: permanent
created: 2025-11-13 00:05
tags:
  - permanent
  - programmation
  - c
  - pointeurs
  - tableaux
---

# C - relation pointeurs-tableaux

> [!abstract] Concept
> En C, le nom d'un tableau est un pointeur constant vers son premier élément. Les pointeurs et tableaux sont étroitement liés et souvent interchangeables.

## Explication

**Équivalences fondamentales** :
- `tableau` ≡ `&tableau[0]` (adresse du premier élément)
- `tableau[i]` ≡ `*(tableau + i)` (accès par arithmétique)
- `&tableau[i]` ≡ `(tableau + i)` (adresse de l'élément i)

**Arithmétique de pointeurs** :
- `pointeur + n` : avance de `n * sizeof(type)` octets
- `pointeur - n` : recule de `n * sizeof(type)` octets
- `pointeur++` : avance d'un élément

## Exemples

### Équivalences d'accès

```c
int tab[] = {10, 20, 30, 40, 50};

// Ces 4 lignes sont identiques :
printf("%d\n", tab[0]);      // 10
printf("%d\n", *tab);        // 10
printf("%d\n", *(tab + 0));  // 10
printf("%d\n", 0[tab]);      // 10 (bizarre mais valide!)

// Ces 4 lignes sont identiques :
printf("%d\n", tab[3]);      // 40
printf("%d\n", *(tab + 3));  // 40
printf("%d\n", 3[tab]);      // 40
```

### Arithmétique de pointeurs

```c
int tab[] = {10, 20, 30, 40, 50};
int *p = tab;  // p pointe vers tab[0]

printf("%d\n", *p);      // 10
printf("%d\n", *(p+1));  // 20
printf("%d\n", *(p+2));  // 30

p++;  // p pointe maintenant vers tab[1]
printf("%d\n", *p);      // 20

p += 2;  // p pointe vers tab[3]
printf("%d\n", *p);      // 40
```

### Parcours avec pointeur

```c
int tab[] = {1, 2, 3, 4, 5};
int taille = 5;

// Méthode 1 : index
for (int i = 0; i < taille; i++) {
    printf("%d ", tab[i]);
}

// Méthode 2 : arithmétique de pointeurs
for (int i = 0; i < taille; i++) {
    printf("%d ", *(tab + i));
}

// Méthode 3 : incrémentation de pointeur
int *p = tab;
for (int i = 0; i < taille; i++) {
    printf("%d ", *p);
    p++;
}
```

### Différence entre pointeur et tableau

```c
int tab[10];
int *p = tab;

// Similitudes :
tab[0] = 5;  // OK
p[0] = 5;    // OK

tab[5] = 10;  // OK
p[5] = 10;    // OK

// Différences :
p = tab;      // OK (p peut être modifié)
// tab = p;   // ERREUR (tab est constant)

p++;          // OK (p peut être incrémenté)
// tab++;     // ERREUR (tab est constant)

sizeof(tab);  // Taille totale du tableau (40 octets)
sizeof(p);    // Taille du pointeur (8 octets sur 64-bit)
```

### Passage de tableau à une fonction

```c
void modifier(int *tableau, int taille) {
    for (int i = 0; i < taille; i++) {
        tableau[i] *= 2;  // Modifie le tableau original
    }
}

int main() {
    int tab[] = {1, 2, 3, 4, 5};
    modifier(tab, 5);  // Passe l'adresse
    // tab est maintenant {2, 4, 6, 8, 10}
    return 0;
}
```

**Important** : Les tableaux sont **toujours passés par référence** aux fonctions (contrairement aux variables simples).

### Pointeur vs tableau en mémoire

```c
int tab[3] = {10, 20, 30};
int *p = tab;

/*
Mémoire :
┌─────────┬────────┐
│  0x1000 │   10   │  tab[0]
│  0x1004 │   20   │  tab[1]
│  0x1008 │   30   │  tab[2]
│  0x100C │ 0x1000 │  p (pointeur vers tab[0])
└─────────┴────────┘

tab = 0x1000 (constant)
p = 0x1000 (variable, peut changer)
*/
```

## Connexions

### Concepts liés
- [[C - pointeurs (concepts de base)]] - Base des pointeurs
- [[C - tableaux statiques]] - Tableaux de taille fixe
- [[C - allocation dynamique (malloc free)]] - Tableaux dynamiques
- [[C - chaînes de caractères (strings)]] - char* et char[]

### Règles importantes
- Le nom d'un tableau est un **pointeur constant**
- `tableau + i` avance de `i * sizeof(type)` octets, pas de `i` octets
- Les tableaux perdent leur taille quand passés à une fonction
- Toujours passer la taille avec le tableau en paramètre

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 10)

---
**Tags thématiques** : #c #pointeurs #tableaux #arithmétique #mémoire
