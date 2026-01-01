---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
  - ui
---

# Système UI de Godot - Control nodes

> [!abstract] Concept
> Les Control nodes sont la base du système UI de Godot, fournissant boutons, labels, panels et autres éléments d'interface avec gestion automatique des événements.

## Explication

Le système UI de Godot repose sur une hiérarchie de Control nodes, qui sont des nœuds spécialisés pour créer des interfaces utilisateur 2D. Les principaux types incluent Label (texte), Button (bouton cliquable), LineEdit (saisie de texte), TextureRect (images), Panel (fond), et bien d'autres.

Tous les Control nodes partagent des propriétés communes : position (anchors et offsets), taille (min size, custom size), comportement souris (mouse filter), focus, et thème visuel. Ils émettent des signaux pour les interactions utilisateur (pressed, mouse_entered, text_changed).

Pour Human Decision Simulator, les Control nodes seront utilisés partout : menus de navigation, affichage de statistiques, boutons de décisions politiques, champs de saisie pour configurations, et toute l'interface de gestion de la simulation. Comprendre les Control nodes est fondamental pour créer une UI fonctionnelle.

Les Control nodes peuvent être stylisés via des thèmes (Theme resources) qui définissent couleurs, polices, et styles visuels de manière centralisée. Ils supportent également les localisations pour internationaliser le jeu.

## Exemples

```csharp
using Godot;

// Utilisation basique des Control nodes communs
public partial class BasicUIExample : Control
{
    private Label _titleLabel;
    private Button _actionButton;
    private LineEdit _inputField;
    private ProgressBar _loadingBar;
    private Panel _backgroundPanel;

    public override void _Ready()
    {
        // Label pour afficher du texte
        _titleLabel = new Label
        {
            Text = "Human Decision Simulator",
            HorizontalAlignment = HorizontalAlignment.Center,
            AddThemeFontSizeOverride("font_size", 24)
        };
        _titleLabel.Position = new Vector2(100, 50);
        AddChild(_titleLabel);

        // Button pour interactions
        _actionButton = new Button
        {
            Text = "Démarrer la simulation",
            CustomMinimumSize = new Vector2(200, 50)
        };
        _actionButton.Position = new Vector2(100, 100);
        _actionButton.Pressed += OnActionButtonPressed;
        AddChild(_actionButton);

        // LineEdit pour saisie utilisateur
        _inputField = new LineEdit
        {
            PlaceholderText = "Nom de la civilisation",
            CustomMinimumSize = new Vector2(200, 30)
        };
        _inputField.Position = new Vector2(100, 160);
        _inputField.TextSubmitted += OnTextSubmitted;
        AddChild(_inputField);

        // ProgressBar pour indicateurs
        _loadingBar = new ProgressBar
        {
            MinValue = 0,
            MaxValue = 100,
            Value = 50,
            CustomMinimumSize = new Vector2(200, 20),
            ShowPercentage = true
        };
        _loadingBar.Position = new Vector2(100, 200);
        AddChild(_loadingBar);

        // Panel comme fond
        _backgroundPanel = new Panel
        {
            CustomMinimumSize = new Vector2(400, 300)
        };
        MoveChild(_backgroundPanel, 0); // Mettre en arrière-plan
        AddChild(_backgroundPanel);
    }

    private void OnActionButtonPressed()
    {
        GD.Print("Simulation démarrée!");
    }

    private void OnTextSubmitted(string text)
    {
        GD.Print($"Civilisation nommée: {text}");
    }
}

// Panel de statistiques avec différents Control nodes
public partial class StatsDisplay : PanelContainer
{
    public override void _Ready()
    {
        VBoxContainer vbox = new VBoxContainer();

        // Titre
        Label title = new Label
        {
            Text = "Statistiques de la Civilisation",
            HorizontalAlignment = HorizontalAlignment.Center
        };
        title.AddThemeFontSizeOverride("font_size", 20);
        vbox.AddChild(title);

        // Séparateur
        HSeparator separator = new HSeparator();
        vbox.AddChild(separator);

        // Population avec icône
        HBoxContainer popContainer = new HBoxContainer();
        TextureRect popIcon = new TextureRect
        {
            CustomMinimumSize = new Vector2(24, 24)
        };
        Label popLabel = new Label { Text = "Population: 10,000" };
        popContainer.AddChild(popIcon);
        popContainer.AddChild(popLabel);
        vbox.AddChild(popContainer);

        // Bonheur avec barre
        Label happinessLabel = new Label { Text = "Bonheur" };
        vbox.AddChild(happinessLabel);

        ProgressBar happinessBar = new ProgressBar
        {
            MinValue = 0,
            MaxValue = 100,
            Value = 75,
            ShowPercentage = true
        };
        vbox.AddChild(happinessBar);

        // Bouton d'action
        Button detailsButton = new Button
        {
            Text = "Voir détails",
            SizeFlagsHorizontal = SizeFlags.ShrinkCenter
        };
        detailsButton.Pressed += () => GD.Print("Affichage des détails");
        vbox.AddChild(detailsButton);

        AddChild(vbox);
    }
}

// Menu déroulant (OptionButton)
public partial class DifficultySelector : VBoxContainer
{
    [Signal]
    public delegate void DifficultyChangedEventHandler(int difficultyLevel);

    private OptionButton _difficultyOption;

    public override void _Ready()
    {
        Label label = new Label { Text = "Difficulté:" };
        AddChild(label);

        _difficultyOption = new OptionButton();
        _difficultyOption.AddItem("Facile", 0);
        _difficultyOption.AddItem("Normal", 1);
        _difficultyOption.AddItem("Difficile", 2);
        _difficultyOption.AddItem("Expert", 3);

        _difficultyOption.ItemSelected += OnDifficultySelected;
        AddChild(_difficultyOption);
    }

    private void OnDifficultySelected(long index)
    {
        EmitSignal(SignalName.DifficultyChanged, (int)index);
    }
}

// CheckBox pour options
public partial class OptionsPanel : VBoxContainer
{
    private CheckBox _autosaveCheckbox;
    private CheckBox _tutorialCheckbox;
    private HSlider _volumeSlider;
    private Label _volumeLabel;

    public override void _Ready()
    {
        // Autosave option
        _autosaveCheckbox = new CheckBox
        {
            Text = "Sauvegarde automatique"
        };
        _autosaveCheckbox.Toggled += (bool toggled) =>
        {
            GD.Print($"Autosave: {toggled}");
        };
        AddChild(_autosaveCheckbox);

        // Tutorial option
        _tutorialCheckbox = new CheckBox
        {
            Text = "Afficher le tutoriel",
            ButtonPressed = true
        };
        AddChild(_tutorialCheckbox);

        // Volume slider
        Label volumeTitle = new Label { Text = "Volume:" };
        AddChild(volumeTitle);

        _volumeSlider = new HSlider
        {
            MinValue = 0,
            MaxValue = 100,
            Value = 75,
            Step = 1,
            CustomMinimumSize = new Vector2(200, 20)
        };
        _volumeSlider.ValueChanged += OnVolumeChanged;
        AddChild(_volumeSlider);

        _volumeLabel = new Label { Text = "75%" };
        AddChild(_volumeLabel);
    }

    private void OnVolumeChanged(double value)
    {
        _volumeLabel.Text = $"{value:F0}%";
    }
}
```

## Connexions
### Notes liées
- [[Godot - Containers et layouts]]
- [[Godot - Ancres et marges dans l'UI]]
- [[Godot - Gestion des événements UI]]
- [[Godot - Créer des menus et interfaces]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. Les Control nodes sont les blocs de construction fondamentaux de toute interface utilisateur dans Godot. Maîtriser leur utilisation est essentiel pour créer les nombreuses interfaces dont HDS aura besoin : menus de jeu, écrans de statistiques, panneaux de décisions, HUD de simulation, et bien plus. Une compréhension solide des Control nodes permet de construire des interfaces intuitives et fonctionnelles rapidement.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
