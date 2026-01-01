---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
---

# Le système de scènes et de nœuds

> [!abstract] Concept
> Le système de scènes et nœuds organise le jeu en hiérarchies réutilisables où chaque scène est un arbre de nœuds spécialisés.

## Explication

Godot utilise une architecture basée sur des scènes et des nœuds plutôt que sur des GameObjects comme Unity. Une scène est un fichier (.tscn) contenant une hiérarchie de nœuds organisés en arbre. Chaque nœud a un type spécifique (Node3D, Sprite2D, RigidBody, etc.) et peut avoir des enfants.

Les scènes sont réutilisables et peuvent être instanciées plusieurs fois ou imbriquées dans d'autres scènes. Par exemple, une scène "Citizen" peut être instanciée pour chaque citoyen dans la simulation. Les scènes peuvent être sauvegardées, chargées, et modifiées indépendamment, favorisant la modularité.

Pour Human Decision Simulator, le système de scènes permettra de créer des composants réutilisables : scène de citoyen, scène de bâtiment, scène d'interface, scène de monde principal. Chaque scène peut avoir ses propres scripts C#, et l'arbre de scènes forme la structure globale du jeu.

Les nœuds communiquent via GetNode(), des signaux, ou des références exportées. La racine de chaque scène est accessible via GetTree().Root, et on peut accéder aux scènes parentes/enfants via GetParent() et GetChildren(). Le cycle de vie des nœuds (Ready, Process, Exit) est géré automatiquement.

## Exemples

```csharp
using Godot;

// Scène principale du jeu
public partial class MainScene : Node
{
    // Référence à une scène packagée
    [Export]
    public PackedScene CitizenScene { get; set; }

    private Node3D _worldRoot;

    public override void _Ready()
    {
        _worldRoot = GetNode<Node3D>("WorldRoot");

        // Instancier plusieurs citoyens
        for (int i = 0; i < 10; i++)
        {
            SpawnCitizen(new Vector3(i * 2, 0, 0));
        }
    }

    private void SpawnCitizen(Vector3 position)
    {
        // Instancier une scène
        Node3D citizen = CitizenScene.Instantiate<Node3D>();
        citizen.Position = position;

        // Ajouter au monde
        _worldRoot.AddChild(citizen);

        // Accéder au script du citoyen si besoin
        if (citizen is Citizen citizenScript)
        {
            citizenScript.Initialize($"Citizen_{_worldRoot.GetChildCount()}");
        }
    }
}

// Script d'une scène de citoyen réutilisable
public partial class Citizen : CharacterBody3D
{
    private string _citizenName;
    private Label3D _nameLabel;

    public override void _Ready()
    {
        // Récupérer des enfants de la scène
        _nameLabel = GetNode<Label3D>("NameLabel");

        // Se connecter à des signaux d'autres nœuds
        var healthBar = GetNodeOrNull<ProgressBar>("UI/HealthBar");
        if (healthBar != null)
        {
            // Configuration du healthbar
        }
    }

    public void Initialize(string name)
    {
        _citizenName = name;
        if (_nameLabel != null)
        {
            _nameLabel.Text = name;
        }
    }
}

// Navigation dans l'arbre de scène
public partial class SceneNavigationExample : Node
{
    public override void _Ready()
    {
        // Accéder au parent
        Node parent = GetParent();

        // Accéder aux enfants
        foreach (Node child in GetChildren())
        {
            GD.Print($"Enfant: {child.Name}");
        }

        // Accéder à un nœud spécifique par chemin
        var player = GetNode<CharacterBody3D>("../Player");

        // Accéder à un nœud depuis la racine
        var gameManager = GetNode<Node>("/root/GameManager");

        // Chercher un nœud par nom dans les descendants
        var healthBar = FindChild("HealthBar", true, false);

        // Vérifier l'existence avant d'accéder
        var optionalNode = GetNodeOrNull<Label>("OptionalLabel");
        if (optionalNode != null)
        {
            optionalNode.Text = "Existe!";
        }
    }
}

// Chargement et changement de scènes
public partial class SceneManager : Node
{
    public void LoadGameScene()
    {
        // Charger une scène
        PackedScene gameScene = GD.Load<PackedScene>("res://Scenes/GameWorld.tscn");

        // Obtenir la scène courante
        Node currentScene = GetTree().CurrentScene;

        // Nettoyer et changer de scène
        currentScene.QueueFree();

        // Instancier la nouvelle scène
        Node newScene = gameScene.Instantiate();
        GetTree().Root.AddChild(newScene);
        GetTree().CurrentScene = newScene;
    }

    public void LoadSceneWithTransition(string scenePath)
    {
        // Méthode recommandée avec CallDeferred pour éviter les problèmes
        CallDeferred(MethodName.DeferredLoadScene, scenePath);
    }

    private void DeferredLoadScene(string scenePath)
    {
        GetTree().ChangeSceneToFile(scenePath);
    }
}

// Organisation des scènes en composants
public partial class Building : Node3D
{
    // Cette scène peut être composée de plusieurs sous-scènes
    private MeshInstance3D _model;
    private Area3D _interactionZone;
    private AnimationPlayer _animator;

    [Export]
    public string BuildingName { get; set; } = "Maison";

    [Export]
    public int Capacity { get; set; } = 4;

    public override void _Ready()
    {
        // Accéder aux nœuds enfants définis dans la scène
        _model = GetNode<MeshInstance3D>("Model");
        _interactionZone = GetNode<Area3D>("InteractionZone");
        _animator = GetNode<AnimationPlayer>("AnimationPlayer");

        // Connecter les signaux
        _interactionZone.BodyEntered += OnBodyEntered;

        GD.Print($"Bâtiment {BuildingName} prêt avec capacité {Capacity}");
    }

    private void OnBodyEntered(Node3D body)
    {
        if (body.IsInGroup("citizens"))
        {
            GD.Print($"Citoyen entre dans {BuildingName}");
        }
    }

    // Méthode pour détruire proprement la scène
    public void Demolish()
    {
        _animator.Play("demolish");
        _animator.AnimationFinished += (StringName animName) =>
        {
            QueueFree(); // Détruit ce nœud et tous ses enfants
        };
    }
}
```

## Connexions
### Notes liées
- [[Godot - Le cycle de vie d'un nœud - Ready, Process, PhysicsProcess]]
- [[Godot - GetNode et références de nœuds en CSharp]]
- [[Godot - Instancing pour objets multiples]]
- [[Godot - Communication entre nœuds]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. Le système de scènes et nœuds est le paradigme fondamental de Godot, différent des autres moteurs. Comprendre comment organiser le jeu en scènes réutilisables est crucial pour HDS où on aura besoin d'instancier des centaines de citoyens, bâtiments, et éléments d'interface. Une bonne architecture de scènes facilite la maintenance, les tests, et l'évolution du projet. C'est la base sur laquelle tout le reste du jeu est construit.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
