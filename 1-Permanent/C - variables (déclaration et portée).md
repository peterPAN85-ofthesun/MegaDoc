---
type: permanent
created: 2025-11-12 23:10
tags:
  - permanent
  - programmation
  - c
  - variables
  - portée
---

# C - variables (déclaration et portée)

> [!abstract] Concept
> Une variable est un espace mémoire nommé qui stocke une valeur d'un type donné. Sa portée détermine où elle est accessible dans le code.

## Explication

**Déclaration** : Réserver de la mémoire pour une variable
**Portée** : Zone du code où la variable existe et est accessible

**Modificateurs de portée** :
- **Locale** : variable dans une fonction (détruite à la fin)
- **Globale** : variable hors fonction (existe pendant tout le programme)
- `static` : variable qui conserve sa valeur entre appels de fonction
- `const` : variable constante (non modifiable)

**Règles de nommage** :
- Respecte la casse : `Variable` ≠ `variable`
- Pas d'espaces ni de caractères spéciaux (é, à, +, -, etc.)
- Ne peut pas commencer par un chiffre

## Exemples

### Déclaration et affectation

```c
// Méthode 1 : déclaration puis affectation
int pointsDeVie;
pointsDeVie = 100;

// Méthode 2 : déclaration avec initialisation
int pointsDeVie = 100;

// Déclarations multiples
int a, b, c;
int x = 5, y = 10, z = 15;
```

### Variable constante

```c
const int MAX_JOUEURS = 4;
// MAX_JOUEURS = 5;  // ERREUR : impossible de modifier une constante
```

### Variable static (persistante)

```c
#include <stdio.h>

void compteur() {
    static int count = 0;  // Initialisée une seule fois
    count++;
    printf("Appel numéro %d\n", count);
}

int main() {
    compteur();  // Affiche: Appel numéro 1
    compteur();  // Affiche: Appel numéro 2
    compteur();  // Affiche: Appel numéro 3
    return 0;
}
```

**Comportement** : `count` conserve sa valeur entre les appels de fonction.

### Portée locale vs globale

```c
#include <stdio.h>

int globale = 100;  // Variable globale (accessible partout)

void fonction() {
    int locale = 50;  // Variable locale (existe uniquement dans fonction)
    printf("Globale: %d, Locale: %d\n", globale, locale);
}

int main() {
    printf("Globale: %d\n", globale);  // OK
    // printf("Locale: %d\n", locale); // ERREUR : locale n'existe pas ici
    fonction();
    return 0;
}
```

### Variable static globale (visibilité fichier)

```c
// fichier.c
static int compteurInterne = 0;  // Visible uniquement dans ce fichier

void incrementer() {
    compteurInterne++;
}
```

## Connexions

### Concepts liés
- [[C - types de données primitifs]] - Types de variables
- [[C - fonctions (déclaration et appel)]] - Portée locale dans fonctions
- [[C - pointeurs (concepts de base)]] - Variables pointeurs
- [[C - organisation multi-fichiers (headers)]] - Variables globales et static

### Règles importantes
- Toujours initialiser les variables avant utilisation
- Éviter les variables globales (privilégier paramètres de fonction)
- Utiliser `const` pour les valeurs immuables
- Utiliser `static` pour conserver l'état entre appels

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 3)

---
**Tags thématiques** : #c #variables #portée #static #const #globale #locale
