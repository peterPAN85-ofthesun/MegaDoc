---
type: permanent
created: 2025-11-13 00:25
tags:
  - permanent
  - programmation
  - c
  - stdio.h
  - printf
  - scanf
---

# C - entrées-sorties console (stdio.h)

> [!abstract] Concept
> La librairie stdio.h fournit les fonctions d'entrée-sortie standard : printf (affichage) et scanf (saisie).

## Explication

**Fonctions principales** :
- `printf(format, ...)` : affichage formaté
- `scanf(format, ...)` : saisie formatée

**Formats de conversion** :

| Format | Type |
|--------|------|
| `%d` | int |
| `%f` | float/double |
| `%c` | char |
| `%s` | string |
| `%p` | pointeur |

## Exemples

### printf

```c
int age = 25;
float prix = 19.99;
char nom[] = "Alice";

printf("Age: %d\n", age);
printf("Prix: %.2f€\n", prix);  // 2 décimales
printf("Nom: %s\n", nom);
printf("%s a %d ans\n", nom, age);
```

### scanf

```c
int age;
float taille;
char nom[50];

printf("Entrez votre âge: ");
scanf("%d", &age);  // Attention au &

printf("Entrez votre taille: ");
scanf("%f", &taille);

printf("Entrez votre nom: ");
scanf("%s", nom);  // Pas de & pour les tableaux
```

## Connexions

- [[C - manipulation de fichiers]] - fprintf, fscanf
- [[C - chaînes de caractères (strings)]] - Format %s
- [[C - pointeurs (concepts de base)]] - & dans scanf

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Librairies/Librairie stdio.h.md`

---
**Tags thématiques** : #c #stdio.h #printf #scanf #io
