---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
---

# Communication entre nœuds

> [!abstract] Concept
> La communication entre nœuds utilise GetNode, signaux, groups, ou singletons pour permettre l'interaction et le découplage dans l'architecture du jeu.

## Explication

Godot offre plusieurs méthodes pour permettre aux nœuds de communiquer entre eux. GetNode() et GetNodeOrNull() permettent l'accès direct via des chemins, mais créent un couplage fort. Les signaux (pattern Observer) permettent une communication découplée où l'émetteur ne connait pas les récepteurs. Les groupes (groups) permettent de cibler plusieurs nœuds à la fois sans références directes.

Les signaux sont la méthode recommandée pour la communication dans Godot car ils découplent les composants, facilitent les tests, et permettent une architecture flexible. Un nœud émet un signal (EmitSignal), et d'autres nœuds peuvent s'y connecter (Connect ou +=) pour réagir. Les signaux peuvent transporter des données (paramètres).

Pour Human Decision Simulator, différentes stratégies seront utilisées : signaux pour les événements (citoyen arrive au travail, ressource produite), event bus singleton pour les événements globaux (révolution déclenchée, loi votée), et GetNode pour les relations parent-enfant directes. Groupes pour cibler tous les citoyens ou tous les bâtiments d'un type.

Les autoload/singletons sont utiles pour les systèmes globaux (GameManager, EventBus, SaveSystem) accessibles depuis n'importe où via `/root/NomDuSingleton`. Ils simplifient l'accès mais doivent être utilisés avec modération pour éviter trop de couplage global.

## Exemples

```csharp
using Godot;

// 1. Communication directe via GetNode (couplage fort)
public partial class Player : CharacterBody3D
{
    private Label _healthLabel;

    public override void _Ready()
    {
        // Accès direct à un nœud enfant
        _healthLabel = GetNode<Label>("UI/HealthLabel");

        // Accès à un nœud frère
        var enemy = GetParent().GetNode<Node3D>("Enemy");

        // Accès à un autoload/singleton
        var gameManager = GetNode<Node>("/root/GameManager");
    }

    public void UpdateHealth(int newHealth)
    {
        if (_healthLabel != null)
        {
            _healthLabel.Text = $"Health: {newHealth}";
        }
    }
}

// 2. Communication via signaux (découplé)
public partial class Citizen : Node3D
{
    [Signal]
    public delegate void WorkCompletedEventHandler(string citizenName, string resourceProduced);

    [Signal]
    public delegate void HealthChangedEventHandler(float newHealth);

    private string _citizenName;
    private float _health = 100f;

    public void DoWork()
    {
        // Simuler le travail
        GD.Print($"{_citizenName} travaille...");

        // Émettre le signal quand le travail est terminé
        EmitSignal(SignalName.WorkCompleted, _citizenName, "Wood");
    }

    public void TakeDamage(float damage)
    {
        _health -= damage;
        EmitSignal(SignalName.HealthChanged, _health);
    }
}

// Récepteur de signaux
public partial class CityManager : Node
{
    public override void _Ready()
    {
        // Se connecter aux citoyens existants
        foreach (Node child in GetNode("Citizens").GetChildren())
        {
            if (child is Citizen citizen)
            {
                citizen.WorkCompleted += OnCitizenWorkCompleted;
                citizen.HealthChanged += OnCitizenHealthChanged;
            }
        }
    }

    private void OnCitizenWorkCompleted(string citizenName, string resource)
    {
        GD.Print($"{citizenName} a produit: {resource}");
        // Mettre à jour les ressources de la ville
    }

    private void OnCitizenHealthChanged(float newHealth)
    {
        GD.Print($"Santé du citoyen: {newHealth}");
    }
}

// 3. Communication via groupes
public partial class Building : Node3D
{
    public override void _Ready()
    {
        // Ajouter ce bâtiment au groupe "buildings"
        AddToGroup("buildings");
        AddToGroup("production_buildings");
    }

    public void ProduceResources()
    {
        GD.Print("Production de ressources");
    }
}

public partial class GameController : Node
{
    public void UpdateAllBuildings()
    {
        // Appeler une méthode sur tous les nœuds du groupe
        GetTree().CallGroup("buildings", "ProduceResources");
    }

    public void GetAllProductionBuildings()
    {
        // Récupérer tous les nœuds d'un groupe
        var buildings = GetTree().GetNodesInGroup("production_buildings");
        GD.Print($"Nombre de bâtiments de production: {buildings.Count}");

        foreach (Node building in buildings)
        {
            if (building is Building b)
            {
                b.ProduceResources();
            }
        }
    }
}

// 4. Event Bus global (singleton)
public partial class EventBus : Node
{
    // Singleton
    public static EventBus Instance { get; private set; }

    [Signal]
    public delegate void ResourceChangedEventHandler(string resourceType, float newAmount);

    [Signal]
    public delegate void CitizenDiedEventHandler(string citizenName);

    [Signal]
    public delegate void LawPassedEventHandler(string lawName);

    public override void _Ready()
    {
        Instance = this;
    }

    // Méthodes helper pour émettre des événements globaux
    public static void EmitResourceChanged(string resourceType, float amount)
    {
        Instance?.EmitSignal(SignalName.ResourceChanged, resourceType, amount);
    }

    public static void EmitCitizenDied(string citizenName)
    {
        Instance?.EmitSignal(SignalName.CitizenDied, citizenName);
    }
}

// Utilisation de l'Event Bus
public partial class ResourceManager : Node
{
    public override void _Ready()
    {
        // S'abonner aux événements globaux
        EventBus.Instance.ResourceChanged += OnResourceChanged;
    }

    private void OnResourceChanged(string resourceType, float newAmount)
    {
        GD.Print($"Ressource globale changée: {resourceType} = {newAmount}");
    }

    public void AddResource(string type, float amount)
    {
        // Logique d'ajout...

        // Notifier tout le monde
        EventBus.EmitResourceChanged(type, amount);
    }
}

// 5. Communication via références exportées
public partial class EnemyAI : CharacterBody3D
{
    [Export]
    public NodePath PlayerPath { get; set; }

    private Node3D _player;

    public override void _Ready()
    {
        if (PlayerPath != null)
        {
            _player = GetNode<Node3D>(PlayerPath);
        }
    }

    public override void _PhysicsProcess(double delta)
    {
        if (_player != null)
        {
            // Suivre le joueur
            LookAt(_player.GlobalPosition, Vector3.Up);
        }
    }
}

// 6. Communication via interface (C#)
public interface IDamageable
{
    void TakeDamage(float amount);
    float GetHealth();
}

public partial class Character : CharacterBody3D, IDamageable
{
    private float _health = 100f;

    public void TakeDamage(float amount)
    {
        _health -= amount;
        GD.Print($"Dégâts reçus: {amount}, santé restante: {_health}");
    }

    public float GetHealth() => _health;
}

public partial class Weapon : Node3D
{
    public void Attack(Node target)
    {
        // Vérifier si la cible implémente IDamageable
        if (target is IDamageable damageable)
        {
            damageable.TakeDamage(25f);
        }
    }
}
```

## Connexions
### Notes liées
- [[Godot - Les signaux (signals) en CSharp]]
- [[Godot - Event bus et communication globale]]
- [[Godot - GetNode et références de nœuds en CSharp]]
- [[Godot - Observer pattern avec signals]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. La communication entre nœuds est au cœur de l'architecture du jeu. Dans HDS, de nombreux systèmes doivent communiquer : citoyens qui signalent la fin de leur travail, bâtiments qui notifient leur production, système économique qui informe l'UI des changements de ressources, événements politiques qui déclenchent des réactions sociales. Choisir la bonne méthode de communication (signaux, event bus, références directes, groupes) pour chaque cas garantit un code maintenable et performant.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
