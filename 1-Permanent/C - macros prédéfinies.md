---
type: permanent
created: 2025-11-13 00:22
tags:
  - permanent
  - programmation
  - c
  - macros
  - préprocesseur
---

# C - macros prédéfinies

> [!abstract] Concept
> Le C fournit des macros prédéfinies contenant des informations sur le fichier, la ligne, la date de compilation.

## Explication

**Macros standard** :

| Macro | Contenu |
|-------|---------|
| `__LINE__` | Numéro de ligne actuelle |
| `__FILE__` | Nom du fichier actuel |
| `__DATE__` | Date de compilation |
| `__TIME__` | Heure de compilation |

**Utilisation** : Débogage, logging, versioning

## Exemples

```c
#include <stdio.h>

int main() {
    printf("Fichier: %s\n", __FILE__);
    printf("Ligne: %d\n", __LINE__);
    printf("Compilé le: %s à %s\n", __DATE__, __TIME__);

    // Utile pour débogage
    if (erreur) {
        printf("Erreur ligne %d du fichier %s\n", __LINE__, __FILE__);
    }

    return 0;
}
```

## Connexions

- [[C - directives préprocesseur (define include)]] - Macros personnalisées

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 12)

---
**Tags thématiques** : #c #macros #préprocesseur #debug
