---
type: permanent
created: 2026-01-27
tags:
  - permanent
  - csharp
  - cpp
  - memoire
---

# Csharp vs C++ - Gestion mémoire (new et GC)

> [!abstract] Concept
> Le mot-clé `new` existe en C, C++ et Csharp, mais avec des comportements fondamentalement différents concernant l'allocation et la libération de la mémoire.

## Explication

### En C : `malloc` / `free`

```c
// Allocation manuelle
int* ptr = (int*)malloc(sizeof(int));
*ptr = 42;

// Libération manuelle obligatoire
free(ptr);
```

### En C++ : `new` / `delete`

```cpp
// new alloue ET appelle le constructeur
Objet* obj = new Objet();       // Un seul objet
Objet* tab = new Objet[10];     // Tableau d'objets

// Retourne l'ADRESSE de l'objet (pointeur)

// Libération manuelle obligatoire
delete obj;      // Un seul objet
delete[] tab;    // Tableau (ne pas oublier les [])
```

### En Csharp : `new` + Garbage Collector

```csharp
// new crée l'objet et retourne une RÉFÉRENCE (pas un pointeur)
Objet obj = new Objet();

// Pas de delete ! Le Garbage Collector libère automatiquement
// quand l'objet n'est plus référencé
```

## Comparaison

| Aspect | C | C++ | Csharp |
|--------|---|-----|-----|
| Allocation | `malloc()` | `new` | `new` |
| Libération | `free()` | `delete` / `delete[]` | Automatique (GC) |
| Retour | Adresse (void*) | Adresse (pointeur typé) | Référence |
| Constructeur | Non | Oui | Oui |
| Risque de fuite | Élevé | Élevé | Faible |

## Exemples pratiques

### Piège C++ : Oublier delete[]

```cpp
void fonction() {
    int* tab = new int[1000];
    // ... utilisation ...
    // Oubli de delete[] tab; = FUITE MÉMOIRE
}
```

### Csharp : Pas de souci

```csharp
void Fonction() {
    int[] tab = new int[1000];
    // ... utilisation ...
    // Pas besoin de libérer, le GC s'en charge
}
```

## Cas d'usage

- **C** : Systèmes embarqués, bas niveau, contrôle total
- **C++** : Performance critique, RAII, smart pointers recommandés
- **Csharp** : Applications métier, jeux (Unity, Godot), productivité

## Connexions

### Notes liées
- [[C - allocation dynamique (malloc free)]] - Allocation en C
- [[Csharp - Modificateurs d'accès]] - Autre différence Csharp/C++

### Dans le contexte de
- [[MOC - Godot]] - Godot Csharp utilise le GC

## Ressources

- Source : Notes de cours Godot Csharp

---

**Tags thématiques** : `#csharp` `#cpp` `#memoire` `#new` `#gc`
