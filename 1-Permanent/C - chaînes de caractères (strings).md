---
type: permanent
created: 2025-11-13 00:10
tags:
  - permanent
  - programmation
  - c
  - strings
  - char
---

# C - chaînes de caractères (strings)

> [!abstract] Concept
> Une chaîne de caractères (string) en C est un tableau de caractères se terminant par le caractère nul `'\0'`.

## Explication

**Définition** : `char[]` ou `char*` avec `'\0'` à la fin

**Caractère nul** : `'\0'` (ASCII 0)
- Marque la fin de la chaîne
- Permet de calculer la longueur
- **Obligatoire**

**Format printf** : `%s` pour afficher une string

## Exemples

### Déclaration

```c
// Méthode 1 : caractère par caractère
char chaine[6];
chaine[0] = 'S';
chaine[1] = 'a';
chaine[2] = 'l';
chaine[3] = 'u';
chaine[4] = 't';
chaine[5] = '\0';  // Obligatoire!

// Méthode 2 : initialisation directe
char chaine[] = "Salut";  // '\0' ajouté automatiquement

// Méthode 3 : avec taille explicite
char chaine[10] = "Salut";  // Réserve 10 caractères
```

### Affichage

```c
char message[] = "Bonjour";
printf("%s\n", message);  // Affiche: Bonjour
```

### Caractères spéciaux

```c
printf("Ligne 1\n");     // \n = retour à la ligne
printf("Col1\tCol2\n");  // \t = tabulation
printf("Il dit \"Salut\"\n");  // \" = guillemet
```

### Pointeur vs tableau

```c
char tab[] = "Hello";   // Tableau modifiable
char *ptr = "Hello";    // Pointeur vers littéral (non modifiable)

tab[0] = 'h';  // OK
// ptr[0] = 'h';  // ERREUR : littéral en lecture seule
```

## Connexions

- [[C - librairie string.h]] - Fonctions de manipulation
- [[C - tableaux statiques]] - Tableaux de char
- [[C - pointeurs (concepts de base)]] - char*

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 11)
- Fichier source : `0-Inbox/Apprendre le C/Tips/String et caractères.md`

---
**Tags thématiques** : #c #strings #char #chaînes
