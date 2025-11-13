---
type: permanent
created: 2025-11-12 23:15
tags:
  - permanent
  - programmation
  - c
  - opérateurs
---

# C - opérateurs arithmétiques

> [!abstract] Concept
> Les opérateurs arithmétiques permettent d'effectuer des calculs mathématiques sur des variables numériques.

## Explication

Le C fournit des opérateurs pour les opérations mathématiques de base et des opérateurs spéciaux pour modifier rapidement des variables.

**Opérateurs de base** :

| Opérateur | Opération | Exemple | Résultat |
|-----------|-----------|---------|----------|
| `+` | Addition | `5 + 3` | 8 |
| `-` | Soustraction | `5 - 3` | 2 |
| `*` | Multiplication | `5 * 3` | 15 |
| `/` | Division | `5 / 3` | 1 (division entière) |
| `%` | Modulo (reste) | `5 % 3` | 2 |

**Opérateurs d'incrémentation/décrémentation** :

| Opérateur | Signification | Équivalent |
|-----------|---------------|------------|
| `++` | Incrémente de 1 | `x = x + 1` |
| `--` | Décrémente de 1 | `x = x - 1` |

**Division entière vs réelle** :
- Division entre `int` : résultat entier (tronqué)
- Division avec `float` ou `double` : résultat réel

## Exemples

### Opérations de base

```c
int a = 10, b = 3;
int resultat;

resultat = a + b;  // 13
resultat = a - b;  // 7
resultat = a * b;  // 30
resultat = a / b;  // 3 (division entière, pas 3.333...)
resultat = a % b;  // 1 (reste de 10 / 3)
```

### Division entière vs réelle

```c
int a = 5, b = 3;
double resultat;

resultat = a / b;        // 1.0 (division entière puis conversion)
resultat = (double)a / b; // 1.666... (conversion puis division réelle)
resultat = 5.0 / 3;      // 1.666... (division réelle directe)
```

### Incrémentation et décrémentation

```c
int compteur = 5;

compteur++;  // compteur = 6
compteur--;  // compteur = 5
++compteur;  // compteur = 6
--compteur;  // compteur = 5
```

**Pré-incrémentation vs Post-incrémentation** :

```c
int x = 5, y;

y = x++;  // y = 5, puis x = 6 (post-incrémentation)
x = 5;
y = ++x;  // x = 6, puis y = 6 (pré-incrémentation)
```

### Opérateurs composés

```c
int x = 10;

x += 5;   // x = x + 5;  → x = 15
x -= 3;   // x = x - 3;  → x = 12
x *= 2;   // x = x * 2;  → x = 24
x /= 4;   // x = x / 4;  → x = 6
x %= 4;   // x = x % 4;  → x = 2
```

## Connexions

### Concepts liés
- [[C - types de données primitifs]] - Types numériques
- [[C - conversion de types (casting)]] - Pour division réelle
- [[C - boucles (while for do-while)]] - Utilisation de ++ dans boucles

### Pièges courants
- **Division entière** : `5 / 2 = 2`, pas `2.5`
- **Modulo sur négatifs** : comportement dépend du compilateur
- **Overflow** : `unsigned char x = 255; x++; // x = 0`

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 4)

---
**Tags thématiques** : #c #opérateurs #arithmétique #calcul #modulo
