---
type: permanent
created: 2025-11-13 00:35
tags:
  - permanent
  - programmation
  - c
  - poo
  - orienté-objet
---

# C - programmation orientée objet

> [!abstract] Concept
> Bien que le C ne soit pas orienté objet, on peut simuler des classes via des structures contenant des pointeurs de fonctions.

## Explication

**Principe** :
- Structure = classe (attributs + méthodes)
- Pointeurs de fonctions = méthodes
- Constructeur/destructeur = fonctions d'init/free

**Règles** :
- Les méthodes sont des pointeurs de fonctions dans la structure
- Toutes les fonctions publiques prennent un pointeur `This` vers la structure
- Préfixer les fonctions avec le nom de la classe

## Exemples

### Exemple de classe "Stylo"

**stylo.h**
```c
#ifndef STYLO_H
#define STYLO_H

typedef struct Stylo Stylo;

struct Stylo {
    char *couleur;
    void (*ecrire)(Stylo *This);
};

// Constructeur/Destructeur
Stylo* Stylo_new(char *couleur);
void Stylo_delete(Stylo *This);

// Méthodes publiques
void Stylo_ecrire(Stylo *This);

#endif
```

**stylo.c**
```c
#include "stylo.h"
#include <stdlib.h>
#include <stdio.h>

Stylo* Stylo_new(char *couleur) {
    Stylo *This = (Stylo*)malloc(sizeof(Stylo));
    This->couleur = couleur;
    This->ecrire = Stylo_ecrire;
    return This;
}

void Stylo_delete(Stylo *This) {
    free(This);
}

void Stylo_ecrire(Stylo *This) {
    printf("J'écris en %s\n", This->couleur);
}
```

**main.c**
```c
int main() {
    Stylo *monStylo = Stylo_new("bleu");
    monStylo->ecrire(monStylo);  // J'écris en bleu
    Stylo_delete(monStylo);
    return 0;
}
```

## Connexions

- [[C - structures (struct)]] - Base de la POO
- [[C - pointeurs (concepts de base)]] - Pointeurs de fonctions
- [[C - allocation dynamique (malloc free)]] - Constructeur/destructeur

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Tips/Programmation orientée objet.md`
- https://chgi.developpez.com/c/objet/

---
**Tags thématiques** : #c #poo #orienté-objet #struct #classes
