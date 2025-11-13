---
type: permanent
created: 2025-11-13 00:17
tags:
  - permanent
  - programmation
  - c
  - enum
  - énumérations
---

# C - énumérations (enum)

> [!abstract] Concept
> Une énumération définit un type avec un ensemble fini de valeurs nommées (constantes entières).

## Explication

**Syntaxe** :
```c
enum NomEnum {
    VALEUR1, VALEUR2, VALEUR3
};
```

**Valeurs par défaut** : 0, 1, 2, ...

**Avantage** : Rend le code plus lisible

## Exemples

### Déclaration basique

```c
enum Couleur {
    ROUGE,   // 0
    VERT,    // 1
    BLEU     // 2
};

int main() {
    enum Couleur c = ROUGE;
    if (c == ROUGE) {
        printf("Rouge sélectionné\n");
    }
    return 0;
}
```

### Valeurs personnalisées

```c
enum Volume {
    FAIBLE = 10,
    MOYEN = 50,
    FORT = 100
};
```

### Typedef

```c
typedef enum Volume Volume;
enum Volume {
    FAIBLE, MOYEN, FORT
};

Volume musique = MOYEN;
```

## Connexions

- [[C - structures (struct)]] - Autre type composé
- [[C - conditions (if else switch)]] - Utilisation avec switch

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 14)

---
**Tags thématiques** : #c #enum #énumérations #constantes
