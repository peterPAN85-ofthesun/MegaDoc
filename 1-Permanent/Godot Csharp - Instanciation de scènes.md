---
type: permanent
created: 2026-01-27
tags:
  - permanent
  - godot
  - csharp
  - gamedev
---

# Godot Csharp - Instanciation de scènes

> [!abstract] Concept
> L'instanciation permet de créer des copies d'une scène (PackedScene) à l'exécution, essentiel pour les projectiles, ennemis, objets à ramasser, etc.

## Explication

Le processus d'instanciation se fait en 3 étapes :
1. **Charger** la scène (PackedScene)
2. **Instancier** pour créer un noeud
3. **Ajouter** à l'arbre de scène

## Exemples

### Méthode statique : ResourceLoader

```csharp
public partial class Player : CharacterBody3D
{
    PackedScene bulletScene;

    public override void _Ready()
    {
        // Charger la scène une fois au démarrage
        bulletScene = ResourceLoader.Load("res://Scenes/Bullet.tscn") as PackedScene;
    }

    public void Tirer()
    {
        // Créer une instance (pas encore dans la scène)
        Node3D bullet = bulletScene.Instantiate<Node3D>();

        // Positionner l'objet AVANT de l'ajouter
        bullet.GlobalPosition = GlobalPosition;

        // Ajouter à la racine de la scène
        GetTree().Root.AddChild(bullet);
    }
}
```

### Méthode dynamique : [Export]

```csharp
public partial class Player : CharacterBody3D
{
    [Export]
    PackedScene BulletScene { get; set; }  // Assigné dans l'inspecteur Godot

    public void Tirer()
    {
        if (BulletScene == null) return;

        Node3D bullet = BulletScene.Instantiate<Node3D>();
        bullet.GlobalPosition = GlobalPosition;
        GetTree().Root.AddChild(bullet);
    }
}
```

### Positionner l'instance

```csharp
// Position globale (monde)
objet.GlobalPosition = new Vector3(10, 0, 5);

// Ou via GlobalTransform complet (position + rotation + scale)
objet.GlobalTransform = this.GlobalTransform;
```

### Détruire une instance

```csharp
// Supprimer un noeud de la scène
objet.QueueFree();  // Suppression propre (fin de frame)
```

## Comparaison des méthodes

| Aspect | ResourceLoader | [Export] |
|--------|----------------|----------|
| Flexibilité | Chemin en dur | Changeable dans l'éditeur |
| Erreurs | À l'exécution | À la compilation (null check) |
| Rechargement | Code modifié | Inspecteur seulement |
| Usage | Scènes fixes | Scènes interchangeables |

## Où ajouter l'instance ?

```csharp
// À la racine de la scène (projectiles, effets)
GetTree().Root.AddChild(objet);

// Comme enfant d'un noeud spécifique (UI, inventaire)
conteneur.AddChild(objet);

// Comme frère du noeud actuel
GetParent().AddChild(objet);
```

## Cas d'usage

- **Projectiles** : Balles, flèches, sorts
- **Ennemis** : Spawners, vagues
- **Objets** : Loot, collectibles
- **Effets** : Particules, décals
- **UI** : Éléments de liste dynamiques

## Connexions

### Notes liées
- [[Godot Csharp - Signaux et événements]] - Notifier quand un objet est créé/détruit
- [[Csharp - Méthodes de casting]] - `Instantiate<T>()`

### Dans le contexte de
- [[MOC - Godot]] - Création dynamique d'objets

---

**Tags thématiques** : `#godot` `#csharp` `#gamedev` `#instanciation`
