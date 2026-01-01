---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
---

# Architecture MVC dans Godot

> [!abstract] Concept
> Le pattern MVC (Model-View-Controller) sépare la logique métier, la présentation et le contrôle des interactions, permettant un code maintenable et testable.

## Explication

L'architecture MVC adapte le pattern classique Model-View-Controller au système de nœuds de Godot. Le Model contient la logique métier et les données (classes C# pures), la View représente l'interface graphique (nœuds de scène Godot), et le Controller fait le lien entre les deux en gérant les entrées utilisateur et mettant à jour les vues.

Dans Godot, la View correspond typiquement aux scènes et nœuds visuels (Control, Node3D, Sprite). Le Model est implémenté via des classes C# qui héritent de RefCounted ou Object mais qui n'ont pas de représentation visuelle directe. Le Controller est souvent un script attaché à un nœud qui orchestre les interactions.

Cette séparation est particulièrement utile pour Human Decision Simulator car elle permet de tester la logique de simulation économique et sociale indépendamment de l'interface. Les systèmes de calcul peuvent être des Models purs, l'UI de visualisation constitue les Views, et les contrôleurs gèrent les interactions du joueur.

L'approche MVC facilite également le découplage : les Models peuvent notifier les changements via des signaux, et plusieurs Views peuvent observer le même Model. Cela permet par exemple d'avoir plusieurs visualisations différentes des mêmes données de simulation.

## Exemples

```csharp
using Godot;
using System.Collections.Generic;

// MODEL - Logique métier pure
public partial class PopulationModel : GodotObject
{
    [Signal]
    public delegate void PopulationChangedEventHandler(int newPopulation);

    private int _population;

    public int Population
    {
        get => _population;
        set
        {
            if (_population != value)
            {
                _population = value;
                EmitSignal(SignalName.PopulationChanged, _population);
            }
        }
    }

    public void UpdatePopulation(float deltaTime)
    {
        // Logique de simulation pure
        float growthRate = 0.01f;
        Population += (int)(_population * growthRate * deltaTime);
    }
}

// VIEW - Présentation des données
public partial class PopulationView : Label
{
    public void UpdateDisplay(int population)
    {
        Text = $"Population: {population:N0}";
    }

    public void ShowWarning(bool warning)
    {
        Modulate = warning ? Colors.Red : Colors.White;
    }
}

// CONTROLLER - Orchestration
public partial class PopulationController : Node
{
    private PopulationModel _model;
    private PopulationView _view;

    public override void _Ready()
    {
        _model = new PopulationModel();
        _model.Population = 1000;

        _view = GetNode<PopulationView>("PopulationView");

        // Connexion Model -> View
        _model.PopulationChanged += OnPopulationChanged;

        // Mise à jour initiale
        _view.UpdateDisplay(_model.Population);
    }

    public override void _Process(double delta)
    {
        _model.UpdatePopulation((float)delta);
    }

    private void OnPopulationChanged(int newPopulation)
    {
        _view.UpdateDisplay(newPopulation);
        _view.ShowWarning(newPopulation > 10000);
    }

    // Gestion des inputs utilisateur
    public void OnAddPopulationPressed()
    {
        _model.Population += 100;
    }
}

// Exemple plus complexe pour système économique
public partial class EconomyModel : GodotObject
{
    [Signal]
    public delegate void ResourcesChangedEventHandler(Dictionary<string, float> resources);

    private Dictionary<string, float> _resources = new();

    public void ProduceResource(string resourceType, float amount)
    {
        if (!_resources.ContainsKey(resourceType))
            _resources[resourceType] = 0;

        _resources[resourceType] += amount;
        EmitSignal(SignalName.ResourcesChanged, _resources);
    }

    public float GetResource(string resourceType)
    {
        return _resources.GetValueOrDefault(resourceType, 0f);
    }
}
```

## Connexions
### Notes liées
- [[Godot - Observer pattern avec signals]]
- [[Godot - Component pattern pour systèmes modulaires]]
- [[Godot - Event bus et communication globale]]
- [[Godot - Bonnes pratiques CSharp dans Godot]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. L'architecture MVC est essentielle pour structurer un projet complexe comme HDS où la logique de simulation (modèles économiques, sociaux, démographiques) doit être séparée de la présentation (visualisation 3D, UI, graphiques). Cette séparation permet de tester la logique indépendamment, de changer facilement l'interface, et de maintenir un code clair même quand le projet grandit. C'est la fondation d'une architecture logicielle robuste.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
