---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
  - csharp
---

# GetNode et références de nœuds en C#

> [!abstract] Concept
> GetNode() accède aux nœuds via des chemins de scène, permettant la communication entre composants avec typage fort en C# via GetNode<T>().

## Explication

GetNode() est la méthode principale pour obtenir des références à d'autres nœuds dans l'arbre de scène. Elle prend un chemin string (relatif ou absolu) et retourne le nœud correspondant. En C#, on utilise la version générique `GetNode<T>()` pour obtenir directement le bon type sans casting manuel.

Les chemins peuvent être relatifs au nœud actuel ("ChildNode", "Child/GrandChild"), au parent ("../Sibling"), ou absolus depuis la racine ("/root/AutoloadName"). GetNodeOrNull<T>() est plus sûr car il retourne null au lieu de crasher si le nœud n'existe pas.

Pour Human Decision Simulator, GetNode sera utilisé partout : accéder à l'UI depuis les contrôleurs, récupérer les composants enfants des citoyens (modèle 3D, barre de santé, IA), connecter les systèmes entre eux. Une bonne organisation de l'arbre de scène rend les chemins simples et maintenables.

Les bonnes pratiques incluent le caching des références dans `_Ready()` plutôt que d'appeler GetNode dans `_Process()`, l'utilisation de `GetNodeOrNull()` pour les nœuds optionnels, et l'évitement des chemins absolus longs (préférer les signaux ou autoloads). Le mot-clé `%` permet d'accéder aux nœuds uniques sans chemin complet.

## Exemples

```csharp
using Godot;

// Exemple de base avec GetNode
public partial class PlayerController : CharacterBody3D
{
    // Références cachées pour performance
    private Camera3D _camera;
    private Label _healthLabel;
    private AnimationPlayer _animator;
    private MeshInstance3D _model;

    public override void _Ready()
    {
        // GetNode avec chemin relatif
        _camera = GetNode<Camera3D>("Camera3D");

        // GetNode vers un enfant profond
        _healthLabel = GetNode<Label>("UI/HBoxContainer/HealthLabel");

        // GetNode vers un frère (sibling)
        _animator = GetParent().GetNode<AnimationPlayer>("AnimationPlayer");

        // GetNode sécurisé (ne crash pas)
        _model = GetNodeOrNull<MeshInstance3D>("Model");
        if (_model == null)
        {
            GD.PrintErr("Model non trouvé!");
        }

        // GetNode vers un autoload/singleton
        var gameManager = GetNode<Node>("/root/GameManager");
    }

    public void UpdateHealth(int health)
    {
        // Utiliser la référence cachée (pas de GetNode dans Process!)
        if (_healthLabel != null)
        {
            _healthLabel.Text = $"HP: {health}";
        }
    }
}

// Nœuds uniques avec %
public partial class UIManager : Control
{
    private Button _startButton;
    private Label _scoreLabel;

    public override void _Ready()
    {
        // % permet d'accéder aux nœuds marqués comme "unique" sans chemin complet
        _startButton = GetNode<Button>("%StartButton");
        _scoreLabel = GetNode<Label>("%ScoreLabel");

        // Équivalent à chercher dans tout le sous-arbre
    }
}

// Export de NodePath pour configuration dans l'éditeur
public partial class Enemy : CharacterBody3D
{
    [Export]
    public NodePath PlayerPath { get; set; }

    [Export]
    public NodePath PatrolPointsPath { get; set; }

    private Node3D _player;
    private Node _patrolPoints;

    public override void _Ready()
    {
        // Utiliser le NodePath exporté
        if (PlayerPath != null && !PlayerPath.IsEmpty)
        {
            _player = GetNode<Node3D>(PlayerPath);
        }

        if (PatrolPointsPath != null)
        {
            _patrolPoints = GetNode(PatrolPointsPath);
        }

        // Fallback si pas configuré
        _player ??= GetNodeOrNull<Node3D>("../Player");
    }

    public override void _PhysicsProcess(double delta)
    {
        if (_player != null)
        {
            // Utiliser la référence
            Vector3 directionToPlayer = (_player.GlobalPosition - GlobalPosition).Normalized();
        }
    }
}

// Recherche dynamique de nœuds
public partial class DynamicNodeFinder : Node
{
    public override void _Ready()
    {
        // Trouver tous les enfants d'un certain type
        foreach (Node child in GetChildren())
        {
            if (child is Enemy enemy)
            {
                GD.Print($"Trouvé ennemi: {enemy.Name}");
            }
        }

        // Trouver un enfant par nom (récursif)
        var healthBar = FindChild("HealthBar", true, false);

        // Obtenir tous les nœuds d'un groupe
        var enemies = GetTree().GetNodesInGroup("enemies");
        foreach (Node enemyNode in enemies)
        {
            GD.Print($"Ennemi dans groupe: {enemyNode.Name}");
        }
    }
}

// Gestion d'erreurs robuste
public partial class SafeNodeAccess : Node
{
    public override void _Ready()
    {
        // Méthode 1: GetNodeOrNull
        var optionalNode = GetNodeOrNull<Label>("MaybeExists");
        if (optionalNode != null)
        {
            optionalNode.Text = "Existe!";
        }

        // Méthode 2: HasNode
        if (HasNode("ChildNode"))
        {
            var child = GetNode<Node>("ChildNode");
        }

        // Méthode 3: Try-catch (éviter si possible)
        try
        {
            var node = GetNode<Node>("MightNotExist");
        }
        catch (System.Exception ex)
        {
            GD.PrintErr($"Erreur GetNode: {ex.Message}");
        }
    }
}

// Citoyen avec composants
public partial class Citizen : CharacterBody3D
{
    // Composants
    private NavigationAgent3D _navAgent;
    private AnimationTree _animTree;
    private Area3D _interactionZone;
    private Label3D _nameLabel;

    // Données
    private string _citizenName;

    public override void _Ready()
    {
        // Récupérer tous les composants
        _navAgent = GetNode<NavigationAgent3D>("NavigationAgent3D");
        _animTree = GetNode<AnimationTree>("AnimationTree");
        _interactionZone = GetNode<Area3D>("InteractionZone");
        _nameLabel = GetNode<Label3D>("NameLabel");

        // Validation
        ValidateComponents();

        // Configuration
        _nameLabel.Text = _citizenName ?? "Citoyen";

        // Connexion des signaux des composants
        _interactionZone.BodyEntered += OnBodyEnteredInteractionZone;
    }

    private void ValidateComponents()
    {
        if (_navAgent == null)
            GD.PrintErr($"[{Name}] NavigationAgent3D manquant!");

        if (_animTree == null)
            GD.PrintErr($"[{Name}] AnimationTree manquant!");
    }

    private void OnBodyEnteredInteractionZone(Node3D body)
    {
        GD.Print($"{_citizenName} interagit avec {body.Name}");
    }

    public void Initialize(string name)
    {
        _citizenName = name;
    }
}

// Accès aux autoloads/singletons
public partial class GameplayController : Node
{
    public override void _Ready()
    {
        // Accès aux singletons via /root
        var eventBus = GetNode<Node>("/root/EventBus");
        var gameManager = GetNode<Node>("/root/GameManager");
        var saveSystem = GetNode<Node>("/root/SaveSystem");

        // Ou si le singleton a une propriété static
        // EventBus.Instance.SomeMethod();
    }
}

// Patterns pour éviter GetNode répétitifs
public partial class OptimizedController : Node
{
    // Cache all references once
    private struct NodeReferences
    {
        public Camera3D Camera;
        public Label HealthLabel;
        public AnimationPlayer Animator;
        public CharacterBody3D Player;
    }

    private NodeReferences _refs;

    public override void _Ready()
    {
        // Initialize all at once
        _refs = new NodeReferences
        {
            Camera = GetNode<Camera3D>("Camera"),
            HealthLabel = GetNode<Label>("UI/Health"),
            Animator = GetNode<AnimationPlayer>("Animator"),
            Player = GetNode<CharacterBody3D>("../Player")
        };
    }

    public override void _Process(double delta)
    {
        // Utiliser les références cachées (pas de GetNode!)
        _refs.HealthLabel.Text = $"HP: 100";
    }
}
```

## Connexions
### Notes liées
- [[Godot - Le système de scènes et de nœuds]]
- [[Godot - Communication entre nœuds]]
- [[Godot - Créer et attacher un script CSharp]]
- [[Godot - Bonnes pratiques CSharp dans Godot]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. GetNode est omniprésent dans le code Godot C# et doit être utilisé correctement pour éviter les erreurs et les problèmes de performance. Dans HDS, l'arbre de scène sera complexe avec de nombreux citoyens, bâtiments et systèmes interconnectés. Savoir accéder efficacement aux nœuds, cacher les références, et gérer les erreurs potentielles est crucial pour un code robuste et performant. Une mauvaise utilisation (GetNode dans Process, chemins hardcodés, pas de null-checking) peut causer des crashes et des ralentissements.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
