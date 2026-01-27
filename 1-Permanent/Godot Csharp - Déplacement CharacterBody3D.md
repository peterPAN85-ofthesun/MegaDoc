---
type: permanent
created: 2026-01-27
tags:
  - permanent
  - godot
  - csharp
  - gamedev
  - physique
---

# Godot Csharp - Déplacement CharacterBody3D

> [!abstract] Concept
> `CharacterBody3D` est le noeud spécialisé pour les personnages contrôlés par le joueur. Il offre deux méthodes de déplacement : `MoveAndSlide()` (simple) et `MoveAndCollide()` (contrôle total).

## Explication

`CharacterBody3D` n'est pas affecté par la physique mais peut affecter d'autres corps. Il fournit une détection de collision et de pentes.

### MoveAndSlide() vs MoveAndCollide()

| Aspect | MoveAndSlide() | MoveAndCollide() |
|--------|----------------|------------------|
| Complexité | Simple | Avancé |
| Glissement | Automatique | Manuel |
| Pentes | Gérées automatiquement | À implémenter |
| Velocity | Modifiée automatiquement | Non modifiée |
| Retour | Aucun | `KinematicCollision3D` |
| Delta | Géré en interne | À multiplier manuellement |

### Propriété Velocity

> [!important]
> On ne peut pas modifier directement `Velocity.X` ou `Velocity.Y`. Il faut passer par une variable intermédiaire.

```csharp
// INCORRECT
Velocity.X = 5; // Ne fonctionne pas !

// CORRECT
var velocity = Velocity;
velocity.X = 5;
Velocity = velocity;
```

## Exemples

### Déplacement FPS complet avec MoveAndSlide()

```csharp
public partial class Player : CharacterBody3D
{
    float moveSpeed = 7.0f;
    float gravity = 10.0f;

    public override void _PhysicsProcess(double delta)
    {
        var velocity = Velocity;

        // Reset horizontal
        velocity.X = 0;
        velocity.Z = 0;

        // Récupérer l'input
        var direction = new Vector2();
        if (Input.IsActionPressed("ui_up")) direction.Y -= 1;
        if (Input.IsActionPressed("ui_down")) direction.Y += 1;
        if (Input.IsActionPressed("ui_left")) direction.X -= 1;
        if (Input.IsActionPressed("ui_right")) direction.X += 1;
        direction = direction.Normalized();

        // Convertir en mouvement 3D relatif à l'orientation
        var forward = GlobalTransform.Basis.Z;
        var right = GlobalTransform.Basis.X;

        velocity.Z = (forward * direction.Y + right * direction.X).Z * moveSpeed;
        velocity.X = (forward * direction.Y + right * direction.X).X * moveSpeed;

        // Gravité
        velocity.Y -= gravity * (float)delta;

        Velocity = velocity;
        MoveAndSlide();
    }
}
```

### Utilisation de MoveAndCollide()

```csharp
public override void _PhysicsProcess(double delta)
{
    var velocity = new Vector3(5, 0, 0);

    // MoveAndCollide retourne les infos de collision
    var collision = MoveAndCollide(velocity * (float)delta);

    if (collision != null)
    {
        // Accès aux informations de collision
        var collider = collision.GetCollider();
        var normal = collision.GetNormal();
        var position = collision.GetPosition();

        // Implémenter son propre glissement
        velocity = velocity.Slide(normal);
    }
}
```

### Quand utiliser MoveAndCollide()

- Contrôle total sur la réponse aux collisions
- Mécaniques de surf/slide personnalisées
- Rebonds, ricochets
- Détection précise du point d'impact

## Orientation et mouvement relatif

```csharp
// Obtenir les axes locaux du personnage
var forward = GlobalTransform.Basis.Z;  // Avant/Arrière
var right = GlobalTransform.Basis.X;    // Gauche/Droite
var up = GlobalTransform.Basis.Y;       // Haut/Bas

// Mouvement relatif à l'orientation
var worldVelocity = forward * inputDirection.Y + right * inputDirection.X;
```

## Cas d'usage

- **MoveAndSlide()** : FPS, TPS, platformers, la plupart des jeux
- **MoveAndCollide()** : Jeux de surf, billard, physique custom, puzzles

## Connexions

### Notes liées
- [[Godot Csharp - Cycle de vie (_Ready, _Process, _PhysicsProcess)]] - Utiliser `_PhysicsProcess()`
- [[Godot Csharp - Input mapping personnalisé]] - Récupérer les inputs
- [[Godot Csharp - Rotation caméra FPS]] - Complémentaire au mouvement

### Dans le contexte de
- [[MOC - Godot]] - Physique des personnages

## Ressources

- Documentation Godot : https://docs.godotengine.org/en/stable/tutorials/physics/using_character_body_2d.html

---

**Tags thématiques** : `#godot` `#csharp` `#gamedev` `#physique` `#characterbody`
