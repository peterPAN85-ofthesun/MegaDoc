---
type: permanent
created: 2025-11-12 23:30
tags:
  - permanent
  - programmation
  - c
  - boucles
  - while
  - for
---

# C - boucles (while/for/do-while)

> [!abstract] Concept
> Les boucles permettent de répéter l'exécution d'un bloc de code tant qu'une condition est vraie.

## Explication

Le C propose 3 types de boucles :
- **while** : condition testée avant l'exécution
- **do...while** : condition testée après l'exécution (au moins 1 itération)
- **for** : boucle avec initialisation, condition et incrémentation intégrées

**Structure générale** :
1. **Initialisation** : avant la boucle
2. **Condition** : teste si continuer
3. **Corps** : instructions à répéter
4. **Incrémentation** : modification de la variable de contrôle

## Exemples

### Boucle while

```c
int compteur = 0;

while (compteur < 10) {
    printf("%d\n", compteur);
    compteur++;
}
```

**Fonctionnement** :
1. Teste `compteur < 10`
2. Si vrai : exécute le corps
3. Retourne à l'étape 1
4. Si faux : sort de la boucle

### Boucle do...while

```c
int compteur = 0;

do {
    printf("%d\n", compteur);
    compteur++;
} while (compteur < 10);  // Ne pas oublier le point-virgule
```

**Différence avec while** : Le corps s'exécute **au moins une fois** avant de tester la condition.

```c
int x = 100;

do {
    printf("Exécuté au moins une fois\n");
} while (x < 10);  // Faux, mais s'exécute quand même 1 fois
```

### Boucle for

```c
for (int i = 0; i < 10; i++) {
    printf("%d\n", i);
}
```

**Décomposition** :
```c
for (initialisation; condition; incrémentation) {
    // Corps
}
```

Équivalent while :
```c
int i = 0;           // Initialisation
while (i < 10) {     // Condition
    printf("%d\n", i);
    i++;             // Incrémentation
}
```

### Boucle for avec plusieurs variables

```c
for (int i = 0, j = 10; i < j; i++, j--) {
    printf("i=%d, j=%d\n", i, j);
}
```

### Boucle infinie

```c
// Boucle infinie with while
while (1) {
    // Code
    if (condition_sortie) break;
}

// Boucle infinie with for
for (;;) {
    // Code
    if (condition_sortie) break;
}
```

### Boucles imbriquées

```c
for (int ligne = 0; ligne < 5; ligne++) {
    for (int colonne = 0; colonne < 5; colonne++) {
        printf("* ");
    }
    printf("\n");
}
// Affiche un carré de 5x5 étoiles
```

## Connexions

### Concepts liés
- [[C - break et continue]] - Contrôle du flux dans les boucles
- [[C - conditions (if else switch)]] - Combinaison avec boucles
- [[C - tableaux statiques]] - Parcours de tableaux
- [[C - opérateurs arithmétiques]] - Incrémentation ++

### Choix de la boucle

| Situation | Boucle recommandée |
|-----------|-------------------|
| Nombre d'itérations connu | `for` |
| Condition sur variable externe | `while` |
| Au moins 1 itération garantie | `do...while` |
| Parcours de tableau | `for` |

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 6)

---
**Tags thématiques** : #c #boucles #while #for #do-while #itération
