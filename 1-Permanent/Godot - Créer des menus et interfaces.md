---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
---

# Créer des menus et interfaces

> [!abstract] Concept
> La création de menus et interfaces combine Control nodes, containers, signaux et thèmes pour construire des UI interactives et cohérentes.

## Explication

La création d'interfaces dans Godot repose sur l'assemblage de Control nodes (Button, Label, Panel, etc.) organisés avec des containers et connectés via des signaux. Chaque menu est typiquement une scène réutilisable qui peut être instanciée et intégrée dans le jeu.

Le processus typique implique de créer une hiérarchie de nœuds UI dans l'éditeur ou par code, de styliser avec des thèmes, et de connecter les interactions utilisateur via des signaux comme `Pressed` pour les boutons. Les menus peuvent être animés avec AnimationPlayer pour les transitions.

Pour Human Decision Simulator, les menus incluront le menu principal, les menus de pause, les interfaces de sélection de décisions politiques, les écrans de statistiques, et les panneaux d'information contextuels. Chaque menu doit communiquer clairement l'information et permettre des interactions fluides.

Les bonnes pratiques incluent la séparation entre la logique UI et la logique métier, l'utilisation de signaux pour la communication, et la création de composants UI réutilisables. Le chargement/déchargement dynamique de menus permet de gérer la mémoire efficacement.

## Exemples

```csharp
using Godot;

public partial class MainMenu : Control
{
    [Signal]
    public delegate void StartGameRequestedEventHandler();

    [Signal]
    public delegate void QuitRequestedEventHandler();

    private Button _startButton;
    private Button _optionsButton;
    private Button _quitButton;

    public override void _Ready()
    {
        _startButton = GetNode<Button>("VBoxContainer/StartButton");
        _optionsButton = GetNode<Button>("VBoxContainer/OptionsButton");
        _quitButton = GetNode<Button>("VBoxContainer/QuitButton");

        // Connexion des signaux
        _startButton.Pressed += OnStartPressed;
        _optionsButton.Pressed += OnOptionsPressed;
        _quitButton.Pressed += OnQuitPressed;
    }

    private void OnStartPressed()
    {
        EmitSignal(SignalName.StartGameRequested);
    }

    private void OnOptionsPressed()
    {
        // Charger le menu des options
        var optionsMenu = GD.Load<PackedScene>("res://UI/Menus/OptionsMenu.tscn").Instantiate();
        AddChild(optionsMenu);
    }

    private void OnQuitPressed()
    {
        EmitSignal(SignalName.QuitRequested);
    }
}

// Menu de décision pour le jeu
public partial class DecisionMenu : Panel
{
    [Signal]
    public delegate void DecisionMadeEventHandler(string decisionId);

    private Label _titleLabel;
    private Label _descriptionLabel;
    private VBoxContainer _optionsContainer;

    public void ShowDecision(string title, string description, string[] options)
    {
        _titleLabel = GetNode<Label>("VBoxContainer/TitleLabel");
        _descriptionLabel = GetNode<Label>("VBoxContainer/DescriptionLabel");
        _optionsContainer = GetNode<VBoxContainer>("VBoxContainer/OptionsContainer");

        _titleLabel.Text = title;
        _descriptionLabel.Text = description;

        // Nettoyer les options précédentes
        foreach (Node child in _optionsContainer.GetChildren())
        {
            child.QueueFree();
        }

        // Créer les boutons d'options
        for (int i = 0; i < options.Length; i++)
        {
            int index = i; // Capture pour closure
            Button optionButton = new Button
            {
                Text = options[i],
                SizeFlagsHorizontal = SizeFlags.ExpandFill
            };

            optionButton.Pressed += () => OnOptionSelected(index);
            _optionsContainer.AddChild(optionButton);
        }

        Show();
    }

    private void OnOptionSelected(int optionIndex)
    {
        EmitSignal(SignalName.DecisionMade, $"option_{optionIndex}");
        Hide();
    }
}

// Interface de statistiques avec mise à jour dynamique
public partial class StatsPanel : PanelContainer
{
    private Label _populationLabel;
    private Label _happinessLabel;
    private ProgressBar _foodBar;

    public override void _Ready()
    {
        _populationLabel = GetNode<Label>("MarginContainer/VBoxContainer/PopulationLabel");
        _happinessLabel = GetNode<Label>("MarginContainer/VBoxContainer/HappinessLabel");
        _foodBar = GetNode<ProgressBar>("MarginContainer/VBoxContainer/FoodBar");
    }

    public void UpdateStats(int population, float happiness, float food, float maxFood)
    {
        _populationLabel.Text = $"Population: {population:N0}";
        _happinessLabel.Text = $"Bonheur: {happiness:P0}";

        _foodBar.MinValue = 0;
        _foodBar.MaxValue = maxFood;
        _foodBar.Value = food;
    }
}

// Gestionnaire de menus avec transitions
public partial class MenuManager : CanvasLayer
{
    private Control _currentMenu;
    private AnimationPlayer _animPlayer;

    public override void _Ready()
    {
        _animPlayer = GetNode<AnimationPlayer>("AnimationPlayer");
    }

    public void ShowMenu(PackedScene menuScene)
    {
        if (_currentMenu != null)
        {
            HideCurrentMenu();
        }

        _currentMenu = menuScene.Instantiate<Control>();
        AddChild(_currentMenu);

        _animPlayer.Play("fade_in");
    }

    private void HideCurrentMenu()
    {
        if (_currentMenu == null) return;

        _animPlayer.Play("fade_out");
        _animPlayer.AnimationFinished += OnFadeOutFinished;
    }

    private void OnFadeOutFinished(StringName animName)
    {
        if (animName == "fade_out")
        {
            _currentMenu?.QueueFree();
            _currentMenu = null;
            _animPlayer.AnimationFinished -= OnFadeOutFinished;
        }
    }
}
```

## Connexions
### Notes liées
- [[Godot - Système UI de Godot - Control nodes]]
- [[Godot - Containers et layouts]]
- [[Godot - Gestion des événements UI]]
- [[Godot - Les signaux (signals) en CSharp]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. Les menus et interfaces sont l'interface principale entre le joueur et la simulation. Ils doivent présenter clairement les choix complexes (décisions politiques, économiques, sociales), afficher les statistiques de la civilisation de manière compréhensible, et permettre une navigation fluide entre différentes vues de la simulation. Une architecture de menus bien conçue rend le jeu accessible et agréable à utiliser.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
