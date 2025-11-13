---
type: permanent
created: 2025-11-12 23:25
tags:
  - permanent
  - programmation
  - c
  - conditions
  - if
  - switch
---

# C - conditions (if/else/switch)

> [!abstract] Concept
> Les structures conditionnelles permettent d'exécuter du code différent selon qu'une condition est vraie ou fausse.

## Explication

Le C propose deux structures pour les conditions :
- **if/else** : pour tester des conditions booléennes
- **switch** : pour tester une variable contre plusieurs valeurs

**Opérateurs de comparaison** :

| Opérateur | Signification |
|-----------|---------------|
| `==` | Égal à |
| `!=` | Différent de |
| `<` | Inférieur à |
| `>` | Supérieur à |
| `<=` | Inférieur ou égal |
| `>=` | Supérieur ou égal |

**Opérateurs logiques** :

| Opérateur | Signification |
|-----------|---------------|
| `&&` | ET logique |
| `\|\|` | OU logique |
| `!` | NON logique |

## Exemples

### Structure if/else

```c
int age = 18;

if (age < 18) {
    printf("Vous êtes mineur\n");
}
else if (age == 18) {
    printf("Vous venez d'être majeur\n");
}
else {
    printf("Vous êtes majeur\n");
}
```

### Conditions multiples

```c
int age = 25;
int permis = 1;  // 1 = vrai, 0 = faux

if (age >= 18 && permis) {
    printf("Vous pouvez conduire\n");
}

if (age < 16 || age > 65) {
    printf("Tarif réduit\n");
}

if (!(age >= 18)) {
    printf("Vous n'êtes pas majeur\n");
}
```

### Structure switch

```c
int choix = 2;

switch (choix) {
    case 1:
        printf("Option 1 sélectionnée\n");
        break;
    case 2:
        printf("Option 2 sélectionnée\n");
        break;
    case 3:
        printf("Option 3 sélectionnée\n");
        break;
    default:
        printf("Option invalide\n");
        break;
}
```

**Important** : Le `break` est obligatoire pour éviter l'exécution en cascade.

### Switch sans break (fall-through intentionnel)

```c
int jour = 6;

switch (jour) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
        printf("Jour de semaine\n");
        break;
    case 6:
    case 7:
        printf("Week-end\n");
        break;
    default:
        printf("Jour invalide\n");
}
```

### Opérateur ternaire (condition courte)

```c
int age = 20;
char* statut;

statut = (age >= 18) ? "majeur" : "mineur";
// Équivalent à :
// if (age >= 18) statut = "majeur";
// else statut = "mineur";
```

## Connexions

### Concepts liés
- [[C - boucles (while for do-while)]] - Structures de contrôle itératives
- [[C - variables (déclaration et portée)]] - Variables booléennes
- [[C - énumérations (enum)]] - Utilisation avec switch

### Pièges courants
- **Confondre `=` et `==`** : `if (x = 5)` assigne au lieu de comparer
- **Oublier break dans switch** : exécution en cascade
- **Utiliser switch sur float/double** : impossible, uniquement entiers/char

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 5)
- Fichier source : `0-Inbox/Apprendre le C/Tips/Fonctions Logique.md`

---
**Tags thématiques** : #c #conditions #if #else #switch #booléen
