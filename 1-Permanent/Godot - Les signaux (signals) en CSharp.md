---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
  - csharp
---

# Les signaux (signals) en C#

> [!abstract] Concept
> Les signaux en C# implémentent le pattern Observer, permettant aux nœuds de notifier des événements sans couplage direct avec les récepteurs.

## Explication

Les signaux dans Godot C# sont déclarés avec l'attribut `[Signal]` et un delegate. Ils fonctionnent comme des événements C# mais sont intégrés au système de Godot. Un nœud déclare un signal, l'émet avec `EmitSignal()`, et d'autres nœuds s'y connectent avec l'opérateur `+=` ou la méthode `Connect()`.

Les signaux peuvent transporter des paramètres typés, facilitant la communication de données complexes. Ils supportent la déconnexion (`-=` ou `Disconnect()`), la vérification de connexion (`IsConnected()`), et peuvent être connectés à des méthodes avec ou sans paramètres (Godot adapte automatiquement).

Pour Human Decision Simulator, les signaux seront omniprésents : citoyens émettant des signaux de changement d'état (faim, bonheur, mort), bâtiments signalant la production, système économique notifiant les changements de ressources, événements politiques déclenchant des réactions en chaîne. Cette architecture découplée facilite l'ajout de nouvelles fonctionnalités sans casser l'existant.

Les bonnes pratiques incluent des noms de signaux clairs (PascalCase pour les delegates, snake_case pour les noms de signaux dans l'éditeur), des paramètres pertinents mais pas excessifs, et la déconnexion propre des signaux quand les nœuds sont détruits pour éviter les fuites mémoire.

## Exemples

```csharp
using Godot;

// Déclaration de base des signaux
public partial class Citizen : Node3D
{
    // Signal sans paramètres
    [Signal]
    public delegate void DiedEventHandler();

    // Signal avec paramètres
    [Signal]
    public delegate void HealthChangedEventHandler(float newHealth, float maxHealth);

    [Signal]
    public delegate void ResourceProducedEventHandler(string resourceType, int amount);

    private float _health = 100f;
    private const float MaxHealth = 100f;

    public void TakeDamage(float damage)
    {
        _health -= damage;

        // Émettre le signal de changement de santé
        EmitSignal(SignalName.HealthChanged, _health, MaxHealth);

        if (_health <= 0)
        {
            EmitSignal(SignalName.Died);
            QueueFree();
        }
    }

    public void ProduceResource(string type, int amount)
    {
        EmitSignal(SignalName.ResourceProduced, type, amount);
    }
}

// Connexion aux signaux
public partial class CityManager : Node
{
    private Citizen _citizen;

    public override void _Ready()
    {
        _citizen = GetNode<Citizen>("Citizen");

        // Méthode 1: Opérateur += (recommandé en C#)
        _citizen.HealthChanged += OnCitizenHealthChanged;
        _citizen.Died += OnCitizenDied;
        _citizen.ResourceProduced += OnResourceProduced;
    }

    private void OnCitizenHealthChanged(float health, float maxHealth)
    {
        float healthPercent = health / maxHealth;
        GD.Print($"Santé du citoyen: {healthPercent:P0}");

        if (healthPercent < 0.3f)
        {
            GD.Print("ATTENTION: Citoyen en danger!");
        }
    }

    private void OnCitizenDied()
    {
        GD.Print("Un citoyen est mort!");
        // Mettre à jour les statistiques de la ville
    }

    private void OnResourceProduced(string resourceType, int amount)
    {
        GD.Print($"Ressource produite: {amount}x {resourceType}");
    }

    // Important: Déconnecter les signaux pour éviter les fuites mémoire
    public override void _ExitTree()
    {
        if (_citizen != null)
        {
            _citizen.HealthChanged -= OnCitizenHealthChanged;
            _citizen.Died -= OnCitizenDied;
            _citizen.ResourceProduced -= OnResourceProduced;
        }
    }
}

// Signaux avec types complexes
public partial class EconomySystem : Node
{
    [Signal]
    public delegate void ResourcesChangedEventHandler(Godot.Collections.Dictionary<string, int> resources);

    [Signal]
    public delegate void TradeCompletedEventHandler(string buyer, string seller, string item, int price);

    private Godot.Collections.Dictionary<string, int> _resources = new();

    public void AddResource(string type, int amount)
    {
        if (!_resources.ContainsKey(type))
            _resources[type] = 0;

        _resources[type] += amount;

        // Émettre avec dictionnaire
        EmitSignal(SignalName.ResourcesChanged, _resources);
    }

    public void ExecuteTrade(string buyer, string seller, string item, int price)
    {
        // Logique de commerce...

        EmitSignal(SignalName.TradeCompleted, buyer, seller, item, price);
    }
}

// Connexion dynamique de signaux
public partial class DynamicSignalManager : Node
{
    public void ConnectToNewCitizen(Citizen citizen)
    {
        // Vérifier si déjà connecté
        if (!citizen.IsConnected(Citizen.SignalName.Died, Callable.From(OnAnyCitizenDied)))
        {
            citizen.Died += OnAnyCitizenDied;
        }

        // Connexion avec méthode Connect() pour plus de contrôle
        citizen.Connect(
            Citizen.SignalName.HealthChanged,
            Callable.From<float, float>((health, maxHealth) =>
            {
                GD.Print($"Lambda: Santé changée: {health}/{maxHealth}");
            })
        );
    }

    private void OnAnyCitizenDied()
    {
        GD.Print("Notification: Un citoyen quelconque est mort");
    }
}

// Chaînage de signaux (relay pattern)
public partial class UIHealthBar : ProgressBar
{
    [Signal]
    public delegate void CriticalHealthEventHandler();

    private const float CriticalThreshold = 0.2f;

    public void OnHealthChanged(float health, float maxHealth)
    {
        float healthPercent = health / maxHealth;
        Value = healthPercent * 100;

        // Re-émettre un nouveau signal si critique
        if (healthPercent <= CriticalThreshold)
        {
            EmitSignal(SignalName.CriticalHealth);
        }
    }
}

// Signaux dans les autoload/singletons
public partial class GameEvents : Node
{
    public static GameEvents Instance { get; private set; }

    [Signal]
    public delegate void GamePausedEventHandler(bool isPaused);

    [Signal]
    public delegate void DayPassedEventHandler(int dayNumber);

    [Signal]
    public delegate void LawEnactedEventHandler(string lawName, Godot.Collections.Dictionary effects);

    public override void _Ready()
    {
        Instance = this;
    }

    public static void PauseGame(bool pause)
    {
        Instance?.EmitSignal(SignalName.GamePaused, pause);
    }

    public static void AdvanceDay(int day)
    {
        Instance?.EmitSignal(SignalName.DayPassed, day);
    }
}

// Utilisation des signaux singleton
public partial class DayNightCycle : Node
{
    public override void _Ready()
    {
        GameEvents.Instance.DayPassed += OnDayPassed;
        GameEvents.Instance.GamePaused += OnGamePaused;
    }

    private void OnDayPassed(int dayNumber)
    {
        GD.Print($"Nouveau jour: {dayNumber}");
        // Mettre à jour le cycle jour/nuit
    }

    private void OnGamePaused(bool isPaused)
    {
        SetProcess(!isPaused);
    }
}

// Signaux avec flags de connexion
public partial class AdvancedSignalUser : Node
{
    public override void _Ready()
    {
        var citizen = GetNode<Citizen>("Citizen");

        // Connexion OneShot (se déconnecte automatiquement après le premier appel)
        citizen.Connect(
            Citizen.SignalName.Died,
            Callable.From(OnCitizenDiedOnce),
            (uint)ConnectFlags.OneShot
        );

        // Connexion Deferred (appelée pendant idle_frame plutôt qu'immédiatement)
        citizen.Connect(
            Citizen.SignalName.HealthChanged,
            Callable.From<float, float>(OnHealthChangedDeferred),
            (uint)ConnectFlags.Deferred
        );
    }

    private void OnCitizenDiedOnce()
    {
        GD.Print("Cette méthode ne sera appelée qu'une seule fois");
    }

    private void OnHealthChangedDeferred(float health, float maxHealth)
    {
        GD.Print("Appelé de manière différée");
    }
}
```

## Connexions
### Notes liées
- [[Godot - Communication entre nœuds]]
- [[Godot - Observer pattern avec signals]]
- [[Godot - Event bus et communication globale]]
- [[Godot - Bonnes pratiques CSharp dans Godot]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. Les signaux sont le mécanisme de communication recommandé dans Godot et seront utilisés partout dans HDS. Ils permettent de créer une architecture modulaire où les citoyens, bâtiments, systèmes économiques et sociaux peuvent communiquer sans se connaître directement. Cela rend le code plus maintenable, testable, et extensible. Comprendre parfaitement les signaux est crucial pour bâtir une simulation complexe et évolutive.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
