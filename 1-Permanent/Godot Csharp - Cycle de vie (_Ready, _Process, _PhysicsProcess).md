---
type: permanent
created: 2026-01-27
tags:
  - permanent
  - godot
  - csharp
  - gamedev
---

# Godot Csharp - Cycle de vie (_Ready, _Process, _PhysicsProcess)

> [!abstract] Concept
> Les méthodes `_Ready()`, `_Process()` et `_PhysicsProcess()` définissent le cycle de vie d'un noeud Godot et sont appelées automatiquement par le moteur.

## Explication

Godot appelle automatiquement certaines méthodes sur les noeuds à des moments précis. En Csharp, on les surcharge avec `override`.

| Méthode | Moment d'appel | Usage |
|---------|----------------|-------|
| `_Ready()` | Une fois, quand le noeud entre dans l'arbre | Initialisation |
| `_Process(double delta)` | Chaque frame (variable) | Logique de jeu, rendu |
| `_PhysicsProcess(double delta)` | À intervalle fixe (60 fps par défaut) | Physique, mouvements |
| `_Input(InputEvent ev)` | À chaque événement d'entrée | Gestion des inputs |

### Le paramètre `delta`

- **`delta`** : Temps écoulé depuis la dernière frame (en secondes)
- Permet d'avoir un mouvement **indépendant du framerate**
- Multiplier les valeurs de mouvement par `delta`

## Exemples

### Structure de base d'un script

```csharp
using Godot;

public partial class Player : CharacterBody3D
{
    Camera3D camera;

    public override void _Ready()
    {
        base._Ready();
        // Initialisation : récupérer les noeuds enfants
        camera = GetNode<Camera3D>("Camera3D");
    }

    public override void _Input(InputEvent ev)
    {
        // Réagir aux inputs (souris, clavier, etc.)
        if (ev is InputEventMouseMotion mouse)
        {
            // Traiter le mouvement souris
        }
    }

    public override void _Process(double delta)
    {
        base._Process(delta);
        // Logique de jeu, mise à jour visuelle
        // Appelé à chaque frame
    }

    public override void _PhysicsProcess(double delta)
    {
        base._PhysicsProcess(delta);
        // Physique et mouvements
        // Appelé à intervalle fixe
    }
}
```

### Importance de `partial`

```csharp
// Le mot-clé "partial" est OBLIGATOIRE
// Il indique que cette classe complète une classe générée par Godot
public partial class Player : CharacterBody3D
```

## Cas d'usage

- **`_Ready()`** : Récupérer références aux noeuds, initialiser variables
- **`_Process()`** : Animations, UI, effets visuels, rotation caméra
- **`_PhysicsProcess()`** : Déplacements, collisions, gravité
- **`_Input()`** : Capture des inputs avant `_Process()`

## Connexions

### Notes liées
- [[Godot Csharp - Déplacement CharacterBody3D]] - Utilise `_PhysicsProcess()`
- [[Godot Csharp - Input mapping personnalisé]] - Utilisé dans `_Input()`
- [[Csharp - Méthodes de casting]] - Pour `GetNode<T>()`

### Dans le contexte de
- [[MOC - Godot]] - Base de tout script Godot

---

**Tags thématiques** : `#godot` `#csharp` `#gamedev` `#lifecycle`
