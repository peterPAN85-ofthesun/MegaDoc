---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
---

# HUD et overlay

> [!abstract] Concept
> Le HUD (Heads-Up Display) et les overlays affichent des informations permanentes par-dessus le jeu via CanvasLayer, sans bloquer les interactions.

## Explication

Le HUD est une interface persistante qui affiche des informations essentielles pendant le gameplay (santé, ressources, score, minimap). Dans Godot, les HUDs sont créés avec des Control nodes placés dans un CanvasLayer, ce qui les rend indépendants de la caméra 3D et garantit qu'ils restent toujours visibles.

CanvasLayer permet de contrôler l'ordre de rendu via la propriété `Layer`, ce qui est utile pour superposer plusieurs couches d'UI (HUD de base, notifications, menus de pause). Les HUDs doivent être légers et optimisés car ils sont mis à jour fréquemment.

Pour Human Decision Simulator, le HUD affichera les ressources de la civilisation (nourriture, or, population), la date/temps de simulation, des indicateurs d'état (bonheur, tension sociale), et potentiellement une minimap de la ville. L'overlay peut également montrer des notifications d'événements importants.

Les bonnes pratiques incluent la mise à jour sélective (ne redessiner que ce qui change), l'utilisation de pools d'objets pour les notifications temporaires, et la séparation claire entre les données (Model) et leur affichage (View) pour faciliter les tests et la maintenance.

## Exemples

```csharp
using Godot;

public partial class GameHUD : CanvasLayer
{
    private Label _populationLabel;
    private Label _foodLabel;
    private Label _goldLabel;
    private Label _dateLabel;
    private ProgressBar _happinessBar;
    private VBoxContainer _notificationsContainer;

    public override void _Ready()
    {
        Layer = 10; // S'assurer que le HUD est au-dessus du jeu

        _populationLabel = GetNode<Label>("HUDContainer/TopBar/PopulationLabel");
        _foodLabel = GetNode<Label>("HUDContainer/TopBar/FoodLabel");
        _goldLabel = GetNode<Label>("HUDContainer/TopBar/GoldLabel");
        _dateLabel = GetNode<Label>("HUDContainer/TopBar/DateLabel");
        _happinessBar = GetNode<ProgressBar>("HUDContainer/BottomBar/HappinessBar");
        _notificationsContainer = GetNode<VBoxContainer>("HUDContainer/NotificationsPanel");
    }

    public void UpdateResources(int population, float food, float gold)
    {
        _populationLabel.Text = $"Population: {population:N0}";
        _foodLabel.Text = $"Nourriture: {food:N0}";
        _goldLabel.Text = $"Or: {gold:N0}";
    }

    public void UpdateDate(int year, int month, int day)
    {
        _dateLabel.Text = $"{day:D2}/{month:D2}/{year}";
    }

    public void UpdateHappiness(float happiness)
    {
        _happinessBar.Value = happiness * 100;

        // Changer la couleur selon le niveau
        Color barColor = happiness switch
        {
            >= 0.7f => Colors.Green,
            >= 0.4f => Colors.Yellow,
            _ => Colors.Red
        };

        _happinessBar.Modulate = barColor;
    }

    public void ShowNotification(string message, float duration = 3.0f)
    {
        Label notification = new Label
        {
            Text = message,
            Modulate = new Color(1, 1, 1, 0)
        };

        _notificationsContainer.AddChild(notification);

        // Animation de fade in/out
        Tween tween = CreateTween();
        tween.TweenProperty(notification, "modulate:a", 1.0f, 0.3f);
        tween.TweenInterval(duration);
        tween.TweenProperty(notification, "modulate:a", 0.0f, 0.3f);
        tween.TweenCallback(Callable.From(() => notification.QueueFree()));
    }
}

// Overlay d'événement avec pause
public partial class EventOverlay : CanvasLayer
{
    [Signal]
    public delegate void EventClosedEventHandler();

    private Panel _eventPanel;
    private Label _titleLabel;
    private Label _descriptionLabel;
    private Button _closeButton;

    public override void _Ready()
    {
        Layer = 100; // Au-dessus du HUD
        Visible = false;

        _eventPanel = GetNode<Panel>("CenterContainer/EventPanel");
        _titleLabel = GetNode<Label>("CenterContainer/EventPanel/VBoxContainer/TitleLabel");
        _descriptionLabel = GetNode<Label>("CenterContainer/EventPanel/VBoxContainer/DescriptionLabel");
        _closeButton = GetNode<Button>("CenterContainer/EventPanel/VBoxContainer/CloseButton");

        _closeButton.Pressed += OnClosePressed;
    }

    public void ShowEvent(string title, string description)
    {
        _titleLabel.Text = title;
        _descriptionLabel.Text = description;

        Visible = true;
        GetTree().Paused = true;
    }

    private void OnClosePressed()
    {
        Visible = false;
        GetTree().Paused = false;
        EmitSignal(SignalName.EventClosed);
    }
}

// Minimap overlay
public partial class MinimapOverlay : CanvasLayer
{
    private Panel _minimapPanel;
    private TextureRect _minimapTexture;
    private ColorRect _playerIndicator;

    public override void _Ready()
    {
        Layer = 11; // Juste au-dessus du HUD principal

        _minimapPanel = GetNode<Panel>("MinimapPanel");
        _minimapTexture = GetNode<TextureRect>("MinimapPanel/MinimapTexture");
        _playerIndicator = GetNode<ColorRect>("MinimapPanel/PlayerIndicator");

        // Positionner en haut à droite
        _minimapPanel.SetAnchorsPreset(Control.LayoutPreset.TopRight);
        _minimapPanel.OffsetLeft = -220;
        _minimapPanel.OffsetTop = 20;
    }

    public void UpdatePlayerPosition(Vector2 worldPos, Vector2 worldSize)
    {
        // Convertir position monde en position minimap
        Vector2 minimapSize = _minimapTexture.Size;
        Vector2 normalizedPos = worldPos / worldSize;
        Vector2 minimapPos = normalizedPos * minimapSize;

        _playerIndicator.Position = minimapPos - _playerIndicator.Size / 2;
    }
}
```

## Connexions
### Notes liées
- [[Godot - Système UI de Godot - Control nodes]]
- [[Godot - Créer des menus et interfaces]]
- [[Godot - Ancres et marges dans l'UI]]
- [[Godot - Feedback visuel et audio]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. Le HUD est l'interface constante qui permet au joueur de surveiller l'état de sa civilisation en temps réel. Il doit afficher clairement les métriques clés (population, ressources, bonheur) sans encombrer l'écran. Les overlays permettent d'afficher des événements importants (révolutions, catastrophes naturelles, découvertes) qui nécessitent l'attention immédiate du joueur. Un bon HUD améliore l'expérience de jeu en rendant l'information accessible sans distraction.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
