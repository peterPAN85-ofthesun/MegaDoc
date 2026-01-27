---
type: permanent
created: 2026-01-27
tags:
  - permanent
  - godot
  - csharp
  - gamedev
  - collections
---

# Godot Csharp - Collections (Array, Dictionary)

> [!abstract] Concept
> Godot fournit ses propres types de collections (`Godot.Collections.Array` et `Dictionary`) qui sont interopérables avec GDScript et l'éditeur, en plus des collections .NET standard.

## Explication

### Quand utiliser les collections Godot ?

- **Export vers l'éditeur** : Les collections Godot sont nécessaires pour `[Export]`
- **Interop GDScript** : Communication entre Csharp et GDScript
- **API Godot** : Certaines méthodes retournent des collections Godot

### Collections .NET vs Godot

| Aspect | .NET | Godot |
|--------|------|-------|
| Performance | Meilleure | Légèrement moindre |
| Typage générique | `List<T>` | `Array<T>` |
| Export éditeur | Non | Oui |
| Interop GDScript | Non | Oui |

## Exemples

### Array Godot

```csharp
using Godot;
using Godot.Collections;

// Array non-typé (comme GDScript)
Godot.Collections.Array mixedArray = new() { "Premier", 2, 3.0f, "Dernier" };

// Array typé (recommandé en Csharp)
Godot.Collections.Array<string> names = new() { "Alice", "Bob", "Charlie" };

// Parcourir
foreach (string name in names)
{
    GD.Print(name);
}

// Opérations courantes
names.Add("David");
names.Remove("Bob");
bool exists = names.Contains("Alice");
int count = names.Count;
```

### Dictionary Godot

```csharp
using Godot.Collections;

// Dictionary non-typé
Godot.Collections.Dictionary inventory = new()
{
    { "Sword", 1 },
    { "Potion", 5 },
    { "Gold", 100 }
};

// Dictionary typé (recommandé)
Godot.Collections.Dictionary<string, int> typedInventory = new()
{
    { "Sword", 1 },
    { "Potion", 5 }
};

// Accès
int potions = typedInventory["Potion"];

// Parcourir
foreach (var (item, quantity) in typedInventory)
{
    GD.Print($"{item}: {quantity}");
}

// Opérations
typedInventory["Shield"] = 1;  // Ajouter
typedInventory.Remove("Sword");
bool hasSword = typedInventory.ContainsKey("Sword");
```

### Export vers l'éditeur

```csharp
public partial class Inventory : Node
{
    // Éditable dans l'inspecteur Godot
    [Export]
    public Godot.Collections.Array<PackedScene> Loot { get; set; } = new();

    [Export]
    public Godot.Collections.Dictionary<string, int> StartingItems { get; set; } = new();
}
```

### Conversion .NET ↔ Godot

```csharp
// .NET vers Godot
List<string> netList = new() { "A", "B", "C" };
Godot.Collections.Array<string> godotArray = new(netList);

// Godot vers .NET
List<string> backToNet = new(godotArray);
```

## Cas d'usage

- **Inventaire** : Dictionary<string, int> pour objets/quantités
- **Pool d'objets** : Array<Node> pour réutilisation
- **Spawn aléatoire** : Array<PackedScene> exporté
- **Données de jeu** : Sauvegardes, configurations

## Connexions

### Notes liées
- [[Godot Csharp - Instanciation de scènes]] - Array de PackedScene pour spawner
- [[Csharp - Modificateurs d'accès]] - Export avec [Export]

### Dans le contexte de
- [[MOC - Godot]] - Structures de données

---

**Tags thématiques** : `#godot` `#csharp` `#gamedev` `#collections` `#array` `#dictionary`
