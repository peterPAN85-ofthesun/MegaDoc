---
type: permanent
created: 2025-11-12 23:35
tags:
  - permanent
  - programmation
  - c
  - break
  - continue
  - contrôle-flux
---

# C - break et continue

> [!abstract] Concept
> `break` et `continue` permettent de contrôler le flux d'exécution à l'intérieur des boucles.

## Explication

**break** :
- Sortie immédiate de la boucle
- Reprend l'exécution après la boucle
- Fonctionne avec `while`, `for`, `do...while`, `switch`

**continue** :
- Passe directement à l'itération suivante
- Ignore le reste du corps de la boucle
- Fonctionne avec `while`, `for`, `do...while`

## Exemples

### break - Sortie de boucle

```c
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;  // Sort de la boucle quand i = 5
    }
    printf("%d ", i);
}
// Affiche: 0 1 2 3 4
```

### continue - Passer à l'itération suivante

```c
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        continue;  // Saute l'itération quand i = 5
    }
    printf("%d ", i);
}
// Affiche: 0 1 2 3 4 6 7 8 9
```

### break vs continue

```c
// Avec break
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) break;
    printf("%d ", i);
}
// Affiche: (rien, car i=0 est pair dès le début)

// Avec continue
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) continue;  // Saute les pairs
    printf("%d ", i);
}
// Affiche: 1 3 5 7 9 (nombres impairs seulement)
```

### break dans switch

```c
int choix = 2;

switch (choix) {
    case 1:
        printf("Un\n");
        break;  // Obligatoire pour éviter le fall-through
    case 2:
        printf("Deux\n");
        break;
    case 3:
        printf("Trois\n");
        break;
}
```

### break dans boucles imbriquées

```c
for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
        if (j == 3) break;  // Sort uniquement de la boucle interne
        printf("(%d,%d) ", i, j);
    }
    printf("\n");
}
// Affiche:
// (0,0) (0,1) (0,2)
// (1,0) (1,1) (1,2)
// etc.
```

**Note** : `break` sort uniquement de la boucle la plus proche. Pour sortir de toutes les boucles, utiliser un flag ou une fonction avec `return`.

### Exemple pratique : recherche dans tableau

```c
int tableau[] = {10, 20, 30, 40, 50};
int recherche = 30;
int trouve = 0;

for (int i = 0; i < 5; i++) {
    if (tableau[i] == recherche) {
        printf("Trouvé à l'index %d\n", i);
        trouve = 1;
        break;  // Inutile de continuer
    }
}

if (!trouve) {
    printf("Non trouvé\n");
}
```

### Exemple continue : filtrer les valeurs

```c
for (int i = 1; i <= 100; i++) {
    if (i % 3 != 0 && i % 5 != 0) {
        continue;  // Ignore les nombres non-multiples de 3 ou 5
    }
    printf("%d ", i);
}
// Affiche tous les multiples de 3 ou 5
```

## Connexions

### Concepts liés
- [[C - boucles (while for do-while)]] - Structures itératives
- [[C - conditions (if else switch)]] - break dans switch
- [[C - fonctions (déclaration et appel)]] - return pour sortir de fonction

### Bonnes pratiques
- Utiliser `break` pour sortir de recherches
- Utiliser `continue` pour filtrer des valeurs
- Éviter les `break` multiples (rend le code confus)
- Préférer `return` dans une fonction si possible

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 6)

---
**Tags thématiques** : #c #break #continue #contrôle-flux #boucles
