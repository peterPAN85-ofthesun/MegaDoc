---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
---

# Le cycle de vie d'un nœud - Ready, Process, PhysicsProcess

> [!abstract] Concept
> Le cycle de vie d'un nœud définit les méthodes appelées automatiquement par Godot : `_Ready()` à l'initialisation, `_Process()` chaque frame, et `_PhysicsProcess()` à intervalle fixe.

## Explication

Chaque nœud dans Godot traverse un cycle de vie prévisible avec des méthodes de callback spécifiques. `_Ready()` est appelée une seule fois quand le nœud et tous ses enfants sont ajoutés à la scène, c'est le moment pour initialiser. `_Process(double delta)` est appelée à chaque frame de rendu (variable selon le FPS), utilisée pour la logique visuelle et l'input. `_PhysicsProcess(double delta)` est appelée à intervalles fixes (60 fois par seconde par défaut), essentielle pour la physique et le mouvement.

Le paramètre `delta` représente le temps écoulé depuis le dernier appel en secondes. L'utiliser permet de créer un mouvement indépendant du framerate. On peut désactiver ces callbacks avec `SetProcess(false)` et `SetPhysicsProcess(false)` pour économiser des ressources.

Pour Human Decision Simulator, `_Ready()` initialisera les citoyens et bâtiments, `_Process()` mettra à jour l'UI et les animations, et `_PhysicsProcess()` gérera le déplacement des NPCs et la simulation économique (qui nécessite une mise à jour stable et prévisible).

D'autres méthodes du cycle de vie incluent `_EnterTree()` (appelée avant `_Ready()`), `_ExitTree()` (quand le nœud quitte la scène), et `_Input()` / `_UnhandledInput()` pour les événements d'entrée. L'ordre d'appel est important : le parent reçoit `_Ready()` après ses enfants.

## Exemples

```csharp
using Godot;

// Exemple complet du cycle de vie
public partial class LifecycleExample : Node3D
{
    private int _frameCount = 0;
    private float _totalTime = 0f;

    // 1. Appelée quand le nœud entre dans l'arbre de scène
    public override void _EnterTree()
    {
        GD.Print("_EnterTree: Nœud ajouté à l'arbre");
        // Le nœud existe mais ses enfants ne sont peut-être pas encore prêts
    }

    // 2. Appelée quand le nœud et ses enfants sont prêts
    public override void _Ready()
    {
        GD.Print("_Ready: Initialisation");

        // C'est ici qu'on initialise
        Position = new Vector3(0, 1, 0);

        // Accéder aux enfants est sûr ici
        var child = GetNodeOrNull("ChildNode");

        // Configuration initiale
        SetProcess(true); // Activer _Process (actif par défaut)
        SetPhysicsProcess(true); // Activer _PhysicsProcess
    }

    // 3. Appelée à chaque frame (FPS variable)
    public override void _Process(double delta)
    {
        _frameCount++;
        _totalTime += (float)delta;

        // Logique visuelle et UI
        Rotation = new Vector3(0, _totalTime, 0); // Rotation continue

        // Mise à jour visuelle toutes les 60 frames
        if (_frameCount % 60 == 0)
        {
            GD.Print($"FPS moyen: {_frameCount / _totalTime:F1}");
        }
    }

    // 4. Appelée à intervalle fixe (60/sec par défaut)
    public override void _PhysicsProcess(double delta)
    {
        // Mouvement et physique ici (delta est constant, ~0.0167s à 60Hz)
        Vector3 velocity = new Vector3(1, 0, 0);
        Position += velocity * (float)delta;
    }

    // 5. Appelée quand le nœud quitte l'arbre
    public override void _ExitTree()
    {
        GD.Print("_ExitTree: Nettoyage");
        // Déconnecter les signaux, libérer les ressources
    }
}

// Citoyen avec simulation économique
public partial class Citizen : CharacterBody3D
{
    [Export]
    public float MoveSpeed { get; set; } = 5.0f;

    private float _hunger = 0f;
    private const float HungerRate = 0.1f; // Par seconde de simulation

    public override void _Ready()
    {
        // Initialisation du citoyen
        _hunger = GD.Randf() * 50f; // Faim initiale aléatoire

        GD.Print($"Citoyen initialisé avec faim: {_hunger}");
    }

    public override void _PhysicsProcess(double delta)
    {
        // Mouvement (doit être dans PhysicsProcess pour la physique)
        Vector3 velocity = Velocity;

        if (Input.IsActionPressed("move_forward"))
        {
            velocity.Z = -MoveSpeed;
        }
        else
        {
            velocity.Z = 0;
        }

        Velocity = velocity;
        MoveAndSlide();

        // Simulation de la faim (mise à jour stable)
        _hunger += HungerRate * (float)delta;

        if (_hunger >= 100f)
        {
            GD.Print("Citoyen affamé!");
            _hunger = 100f;
        }
    }

    public override void _Process(double delta)
    {
        // Mise à jour visuelle (animation, UI)
        // Pas de physique ici !
        UpdateHealthBar();
    }

    private void UpdateHealthBar()
    {
        // Logique d'affichage
    }
}

// Contrôle du cycle de vie pour optimisation
public partial class OptimizedNPC : Node3D
{
    private bool _isVisible = true;
    private float _updateTimer = 0f;
    private const float UpdateInterval = 0.5f; // Mise à jour toutes les 0.5s

    public override void _Ready()
    {
        // S'abonner au signal de visibilité si on a un VisibleOnScreenNotifier3D
        var notifier = GetNodeOrNull<VisibleOnScreenNotifier3D>("Notifier");
        if (notifier != null)
        {
            notifier.ScreenEntered += OnScreenEntered;
            notifier.ScreenExited += OnScreenExited;
        }
    }

    public override void _PhysicsProcess(double delta)
    {
        // Ne pas simuler si pas visible
        if (!_isVisible)
            return;

        // Simulation à intervalle réduit
        _updateTimer += (float)delta;
        if (_updateTimer >= UpdateInterval)
        {
            _updateTimer = 0f;
            UpdateAI();
        }
    }

    private void OnScreenEntered()
    {
        _isVisible = true;
        SetPhysicsProcess(true);
    }

    private void OnScreenExited()
    {
        _isVisible = false;
        SetPhysicsProcess(false); // Désactiver pour économiser les ressources
    }

    private void UpdateAI()
    {
        // Logique IA
    }
}

// Gestionnaire avec delta time
public partial class DayNightCycle : Node
{
    [Export]
    public float DayLength { get; set; } = 120f; // secondes

    private float _timeOfDay = 0f; // 0-1 (0 = minuit, 0.5 = midi)

    public override void _Process(double delta)
    {
        // Progression du temps basée sur delta
        _timeOfDay += (float)delta / DayLength;

        if (_timeOfDay >= 1.0f)
        {
            _timeOfDay -= 1.0f;
            OnNewDay();
        }

        UpdateLighting();
    }

    private void UpdateLighting()
    {
        // Mise à jour visuelle de l'éclairage basée sur l'heure
        float sunIntensity = Mathf.Sin(_timeOfDay * Mathf.Pi);
        // Appliquer aux lumières...
    }

    private void OnNewDay()
    {
        GD.Print("Nouveau jour!");
    }
}

// Différence entre Process et PhysicsProcess
public partial class ProcessComparison : Node
{
    public override void _Ready()
    {
        GD.Print($"Physics FPS: {Engine.PhysicsTicksPerSecond}"); // 60 par défaut
    }

    public override void _Process(double delta)
    {
        // Delta variable (dépend du FPS)
        // Bon pour: UI, animations visuelles, input non-physique
        // Éviter: Mouvement physique, simulation critique

        GD.Print($"Process delta: {delta:F4}"); // Varie selon FPS
    }

    public override void _PhysicsProcess(double delta)
    {
        // Delta constant (~0.01667 à 60Hz)
        // Bon pour: Physique, mouvement, simulation
        // Garantit un comportement prévisible

        GD.Print($"PhysicsProcess delta: {delta:F4}"); // Constant
    }
}
```

## Connexions
### Notes liées
- [[Godot - Le système de scènes et de nœuds]]
- [[Godot - Créer et attacher un script CSharp]]
- [[Godot - CharacterBody3D - Contrôleur de personnage]]
- [[Godot - Optimisation de nombreux NPCs]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. Comprendre le cycle de vie des nœuds est fondamental pour écrire du code Godot efficace. Dans HDS, la distinction entre `_Process()` et `_PhysicsProcess()` est cruciale : la simulation économique et le déplacement des NPCs doivent être dans `_PhysicsProcess()` pour garantir des résultats prévisibles et reproductibles, tandis que les mises à jour UI et animations visuelles vont dans `_Process()`. Une mauvaise utilisation peut causer des bugs de physique ou des problèmes de performance.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
