---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
---

# Hints et tooltips

> [!abstract] Concept
> Les hints et tooltips fournissent des informations contextuelles au survol, améliorant l'expérience utilisateur en expliquant les éléments de l'interface.

## Explication

Les tooltips dans Godot sont des petites fenêtres d'information qui apparaissent lorsque la souris survole un Control node. La propriété `TooltipText` des Control nodes permet de définir un texte de tooltip simple, tandis que la méthode `_MakeCustomTooltip()` permet de créer des tooltips complexes avec du contenu personnalisé.

Les tooltips par défaut affichent du texte simple avec un léger délai. Pour des jeux complexes comme Human Decision Simulator, des tooltips personnalisés peuvent afficher des statistiques détaillées, des icônes, des graphiques, ou des descriptions riches pour aider le joueur à comprendre les mécaniques du jeu.

Les hints sont similaires mais généralement plus persistants, comme des indicateurs de tutoriel ou des messages d'aide qui guident le joueur. Dans HDS, les tooltips seront essentiels pour expliquer les effets des décisions politiques, les statistiques des citoyens, le fonctionnement des systèmes économiques, et les conséquences potentielles des choix.

Les bonnes pratiques incluent des tooltips concis mais informatifs, un délai approprié pour éviter les apparitions intempestives, et un design visuel cohérent. Les tooltips ne doivent pas bloquer des éléments importants de l'interface.

## Exemples

```csharp
using Godot;

public partial class ButtonWithTooltip : Button
{
    public override void _Ready()
    {
        // Tooltip simple
        TooltipText = "Cliquez pour démarrer la simulation";
    }
}

// Tooltip personnalisé avec contenu riche
public partial class ResourceButton : Button
{
    [Export]
    public string ResourceName { get; set; } = "Or";

    [Export]
    public int CurrentAmount { get; set; } = 1000;

    [Export]
    public int ProductionRate { get; set; } = 10;

    public override Control _MakeCustomTooltip(string forText)
    {
        // Créer un tooltip personnalisé
        VBoxContainer tooltip = new VBoxContainer();
        tooltip.AddThemeConstantOverride("separation", 5);

        // Titre
        Label titleLabel = new Label
        {
            Text = ResourceName,
            ThemeTypeVariation = "HeaderLabel"
        };
        tooltip.AddChild(titleLabel);

        // Quantité actuelle
        Label amountLabel = new Label
        {
            Text = $"Quantité: {CurrentAmount:N0}"
        };
        tooltip.AddChild(amountLabel);

        // Production
        Label productionLabel = new Label
        {
            Text = $"Production: +{ProductionRate}/jour",
            Modulate = Colors.Green
        };
        tooltip.AddChild(productionLabel);

        // Barre de progression (optionnel)
        ProgressBar bar = new ProgressBar
        {
            MinValue = 0,
            MaxValue = 2000,
            Value = CurrentAmount,
            CustomMinimumSize = new Vector2(200, 20)
        };
        tooltip.AddChild(bar);

        return tooltip;
    }

    public override void _Ready()
    {
        // Active le tooltip personnalisé
        TooltipText = "resource_tooltip"; // Texte dummy pour activer _MakeCustomTooltip
    }
}

// Système de tooltips géré centralement
public partial class TooltipManager : CanvasLayer
{
    private static TooltipManager _instance;
    private Panel _tooltipPanel;
    private Label _tooltipLabel;
    private Timer _showTimer;

    private const float ShowDelay = 0.5f;

    public override void _Ready()
    {
        _instance = this;
        Layer = 1000; // Au-dessus de tout

        // Créer le panel de tooltip
        _tooltipPanel = new Panel();
        _tooltipPanel.Visible = false;

        _tooltipLabel = new Label
        {
            AutowrapMode = TextServer.AutowrapMode.Word
        };

        MarginContainer margin = new MarginContainer();
        margin.AddThemeConstantOverride("margin_left", 10);
        margin.AddThemeConstantOverride("margin_right", 10);
        margin.AddThemeConstantOverride("margin_top", 5);
        margin.AddThemeConstantOverride("margin_bottom", 5);
        margin.AddChild(_tooltipLabel);

        _tooltipPanel.AddChild(margin);
        AddChild(_tooltipPanel);

        _showTimer = new Timer
        {
            WaitTime = ShowDelay,
            OneShot = true
        };
        _showTimer.Timeout += ShowTooltip;
        AddChild(_showTimer);
    }

    public static void Show(string text, Vector2 position)
    {
        if (_instance == null) return;

        _instance._tooltipLabel.Text = text;
        _instance._tooltipPanel.Position = position + new Vector2(10, 10);
        _instance._showTimer.Start();
    }

    public static void Hide()
    {
        if (_instance == null) return;

        _instance._showTimer.Stop();
        _instance._tooltipPanel.Visible = false;
    }

    private void ShowTooltip()
    {
        _tooltipPanel.Visible = true;
    }
}

// Control avec tooltip géré par le manager
public partial class CitizenPanel : PanelContainer
{
    [Export]
    public string CitizenName { get; set; } = "Jean";

    [Export]
    public float Happiness { get; set; } = 0.75f;

    [Export]
    public string Occupation { get; set; } = "Fermier";

    public override void _Ready()
    {
        MouseEntered += OnMouseEntered;
        MouseExited += OnMouseExited;
    }

    private void OnMouseEntered()
    {
        string tooltipText = $"{CitizenName}\nMétier: {Occupation}\nBonheur: {Happiness:P0}";
        TooltipManager.Show(tooltipText, GlobalPosition);
    }

    private void OnMouseExited()
    {
        TooltipManager.Hide();
    }
}

// Tooltip dynamique pour décisions politiques
public partial class PolicyOptionButton : Button
{
    [Export]
    public string PolicyName { get; set; }

    [Export]
    public string Description { get; set; }

    [Export]
    public float HappinessImpact { get; set; }

    [Export]
    public int CostGold { get; set; }

    public override Control _MakeCustomTooltip(string forText)
    {
        VBoxContainer tooltip = new VBoxContainer();

        Label nameLabel = new Label
        {
            Text = PolicyName,
            AddThemeFontSizeOverride("font_size", 18)
        };
        tooltip.AddChild(nameLabel);

        Label descLabel = new Label
        {
            Text = Description,
            AutowrapMode = TextServer.AutowrapMode.WordSmart,
            CustomMinimumSize = new Vector2(300, 0)
        };
        tooltip.AddChild(descLabel);

        HBoxContainer impactsContainer = new HBoxContainer();

        Label happinessLabel = new Label
        {
            Text = $"Bonheur: {HappinessImpact:+0.0;-0.0}",
            Modulate = HappinessImpact >= 0 ? Colors.Green : Colors.Red
        };
        impactsContainer.AddChild(happinessLabel);

        Label costLabel = new Label
        {
            Text = $"  Coût: {CostGold} or",
            Modulate = Colors.Yellow
        };
        impactsContainer.AddChild(costLabel);

        tooltip.AddChild(impactsContainer);

        return tooltip;
    }

    public override void _Ready()
    {
        TooltipText = "policy_tooltip";
    }
}
```

## Connexions
### Notes liées
- [[Godot - Système UI de Godot - Control nodes]]
- [[Godot - Gestion des événements UI]]
- [[Godot - Créer un système de tutoriel]]
- [[Godot - Feedback visuel et audio]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. Les tooltips sont essentiels pour rendre le jeu accessible, surtout avec des systèmes complexes de simulation économique et sociale. Les joueurs ont besoin d'explications claires sur les effets de leurs décisions, les statistiques des citoyens, et le fonctionnement des mécaniques du jeu. Des tooltips bien conçus réduisent la courbe d'apprentissage et améliorent l'expérience globale en fournissant l'information au bon moment.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
