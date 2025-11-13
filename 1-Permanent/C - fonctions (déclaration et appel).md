---
type: permanent
created: 2025-11-12 23:40
tags:
  - permanent
  - programmation
  - c
  - fonctions
---

# C - fonctions (déclaration et appel)

> [!abstract] Concept
> Les fonctions sont des blocs de code réutilisables qui effectuent une tâche spécifique, prennent optionnellement des paramètres et retournent optionnellement une valeur.

## Explication

**Structure d'une fonction** :
```c
type_retour nomFonction(type_param1 param1, type_param2 param2) {
    // Corps de la fonction
    return valeur;  // Si type_retour != void
}
```

**Composants** :
- **Type de retour** : type de la valeur renvoyée (`int`, `double`, `void`)
- **Nom** : identifiant de la fonction
- **Paramètres** : données reçues par la fonction
- **Corps** : instructions à exécuter
- **return** : valeur renvoyée (sauf si `void`)

**Prototype** : Déclaration de la fonction avant son utilisation (nécessaire si la fonction est définie après `main`)

## Exemples

### Fonction avec retour

```c
int addition(int a, int b) {
    return a + b;
}

int main() {
    int resultat = addition(5, 3);  // resultat = 8
    printf("Résultat: %d\n", resultat);
    return 0;
}
```

### Fonction sans retour (void)

```c
void afficherMessage() {
    printf("Bonjour!\n");
}

int main() {
    afficherMessage();  // Pas de valeur retournée
    return 0;
}
```

### Prototype de fonction

```c
#include <stdio.h>

// Prototype (déclaration)
double aireRectangle(double largeur, double hauteur);

int main() {
    printf("Aire: %f\n", aireRectangle(5.0, 10.0));
    return 0;
}

// Définition de la fonction (après main)
double aireRectangle(double largeur, double hauteur) {
    return largeur * hauteur;
}
```

**Sans prototype** : Erreur de compilation si la fonction est appelée avant sa définition.

### Fonction static (portée fichier)

```c
// fichier.c
static int fonctionPrivee() {
    // Accessible uniquement dans ce fichier
    return 42;
}

int fonctionPublique() {
    return fonctionPrivee();  // OK dans le même fichier
}
```

### Fonction avec plusieurs paramètres

```c
double calculMoyenne(int note1, int note2, int note3) {
    return (note1 + note2 + note3) / 3.0;
}

int main() {
    double moyenne = calculMoyenne(15, 12, 18);
    printf("Moyenne: %.2f\n", moyenne);  // 15.00
    return 0;
}
```

### Passage de paramètres par valeur

```c
void incrementer(int x) {
    x++;  // Modifie la copie locale, pas l'original
}

int main() {
    int nombre = 5;
    incrementer(nombre);
    printf("%d\n", nombre);  // Affiche 5 (inchangé)
    return 0;
}
```

**Important** : Les paramètres sont passés **par valeur** (copie). Pour modifier l'original, utiliser les pointeurs.

## Connexions

### Concepts liés
- [[C - pointeurs (concepts de base)]] - Passage par référence
- [[C - organisation multi-fichiers (headers)]] - Prototypes dans .h
- [[C - variables (déclaration et portée)]] - Variables locales aux fonctions

### Bonnes pratiques
- Une fonction = une tâche
- Noms explicites : `calculerMoyenne()` plutôt que `calc()`
- Limiter le nombre de paramètres (max 4-5)
- Toujours fournir un prototype si définie après utilisation

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 7)

---
**Tags thématiques** : #c #fonctions #prototype #return #void #paramètres
