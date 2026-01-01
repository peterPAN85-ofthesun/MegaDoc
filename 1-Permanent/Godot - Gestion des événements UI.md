---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
  - ui
---

# Gestion des événements UI

> [!abstract] Concept
> La gestion des événements UI utilise des signaux et InputEvent pour détecter et réagir aux interactions utilisateur (clics, survol, saisie).

## Explication

Les événements UI dans Godot sont gérés via deux mécanismes principaux : les signaux prédéfinis des Control nodes (`Pressed`, `Toggled`, `TextChanged`) et la méthode `_GuiInput()` pour un contrôle personnalisé des InputEvent. Les Control nodes capturent automatiquement les événements souris et touch dans leur rectangle.

Les signaux sont la méthode recommandée car ils découplent l'émetteur du récepteur et permettent une architecture flexible. Pour des interactions complexes, `_GuiInput()` permet d'accéder directement aux événements bruts (position, bouton, modificateurs).

Pour Human Decision Simulator, la gestion des événements UI est cruciale pour les interactions avec les menus de décisions, la sélection de citoyens ou bâtiments dans la vue 3D via des overlays, et la réactivité générale de l'interface. Les événements doivent être gérés de manière performante pour ne pas ralentir la simulation.

Les Control nodes ont une propriété `MouseFilter` qui contrôle comment ils réagissent aux événements souris : `Stop` (bloque la propagation), `Pass` (laisse passer), ou `Ignore` (ignore complètement). Cela permet de créer des zones interactives complexes avec des comportements précis.

## Exemples

```csharp
using Godot;

public partial class InteractiveButton : Button
{
    [Signal]
    public delegate void LongPressedEventHandler();

    private bool _isPressed = false;
    private float _pressTime = 0f;
    private const float LongPressDuration = 1.0f;

    public override void _Ready()
    {
        // Signaux standard
        Pressed += OnPressed;
        MouseEntered += OnMouseEntered;
        MouseExited += OnMouseExited;

        // Configurer le filtre pour capturer les événements
        MouseFilter = MouseFilterEnum.Stop;
    }

    private void OnPressed()
    {
        GD.Print("Button pressed!");
    }

    private void OnMouseEntered()
    {
        // Effet de survol
        Modulate = new Color(1.2f, 1.2f, 1.2f);
    }

    private void OnMouseExited()
    {
        Modulate = Colors.White;
    }

    public override void _GuiInput(InputEvent @event)
    {
        if (@event is InputEventMouseButton mouseEvent)
        {
            if (mouseEvent.ButtonIndex == MouseButton.Left)
            {
                if (mouseEvent.Pressed)
                {
                    _isPressed = true;
                    _pressTime = 0f;
                }
                else
                {
                    _isPressed = false;
                }
            }
            // Clic droit pour menu contextuel
            else if (mouseEvent.ButtonIndex == MouseButton.Right && mouseEvent.Pressed)
            {
                ShowContextMenu();
            }
        }
    }

    public override void _Process(double delta)
    {
        if (_isPressed)
        {
            _pressTime += (float)delta;
            if (_pressTime >= LongPressDuration)
            {
                EmitSignal(SignalName.LongPressed);
                _isPressed = false;
            }
        }
    }

    private void ShowContextMenu()
    {
        GD.Print("Context menu");
    }
}

// Panel draggable
public partial class DraggablePanel : Panel
{
    private bool _isDragging = false;
    private Vector2 _dragOffset;

    public override void _Ready()
    {
        MouseFilter = MouseFilterEnum.Stop;
    }

    public override void _GuiInput(InputEvent @event)
    {
        if (@event is InputEventMouseButton mouseButton)
        {
            if (mouseButton.ButtonIndex == MouseButton.Left)
            {
                if (mouseButton.Pressed)
                {
                    _isDragging = true;
                    _dragOffset = mouseButton.Position;
                }
                else
                {
                    _isDragging = false;
                }
            }
        }
        else if (@event is InputEventMouseMotion mouseMotion && _isDragging)
        {
            Position += mouseMotion.Relative;
        }
    }
}

// Gestionnaire d'événements pour sélection de citoyens
public partial class CitizenCard : PanelContainer
{
    [Signal]
    public delegate void CitizenSelectedEventHandler(int citizenId);

    [Signal]
    public delegate void CitizenRightClickedEventHandler(int citizenId, Vector2 position);

    [Export]
    public int CitizenId { get; set; }

    private bool _isHovered = false;

    public override void _Ready()
    {
        MouseFilter = MouseFilterEnum.Stop;
        MouseEntered += OnMouseEntered;
        MouseExited += OnMouseExited;
    }

    public override void _GuiInput(InputEvent @event)
    {
        if (@event is InputEventMouseButton mouseEvent && mouseEvent.Pressed)
        {
            if (mouseEvent.ButtonIndex == MouseButton.Left)
            {
                EmitSignal(SignalName.CitizenSelected, CitizenId);
                AcceptEvent(); // Empêcher la propagation
            }
            else if (mouseEvent.ButtonIndex == MouseButton.Right)
            {
                EmitSignal(SignalName.CitizenRightClicked, CitizenId, mouseEvent.GlobalPosition);
                AcceptEvent();
            }
        }
    }

    private void OnMouseEntered()
    {
        _isHovered = true;
        Modulate = new Color(1.1f, 1.1f, 1.1f);
    }

    private void OnMouseExited()
    {
        _isHovered = false;
        Modulate = Colors.White;
    }
}

// Input field avec validation
public partial class ValidatedLineEdit : LineEdit
{
    [Signal]
    public delegate void ValidInputEventHandler(string text);

    [Export]
    public string ValidationPattern { get; set; } = @"^\d+$"; // Nombres uniquement par défaut

    public override void _Ready()
    {
        TextChanged += OnTextChanged;
        TextSubmitted += OnTextSubmitted;
    }

    private void OnTextChanged(string newText)
    {
        if (System.Text.RegularExpressions.Regex.IsMatch(newText, ValidationPattern))
        {
            Modulate = Colors.White;
        }
        else
        {
            Modulate = new Color(1, 0.8f, 0.8f); // Teinte rouge
        }
    }

    private void OnTextSubmitted(string text)
    {
        if (System.Text.RegularExpressions.Regex.IsMatch(text, ValidationPattern))
        {
            EmitSignal(SignalName.ValidInput, text);
        }
    }
}
```

## Connexions
### Notes liées
- [[Godot - Les signaux (signals) en CSharp]]
- [[Godot - Système d'input dans Godot]]
- [[Godot - Créer des menus et interfaces]]
- [[Godot - Communication entre nœuds]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. La gestion des événements UI est fondamentale pour créer une expérience utilisateur réactive et intuitive. Dans HDS, les joueurs doivent pouvoir cliquer sur des citoyens pour voir leurs détails, faire glisser des panneaux d'information, sélectionner des options de décisions politiques, et interagir avec des graphiques et statistiques. Une gestion d'événements robuste garantit que toutes ces interactions fonctionnent de manière fluide et prévisible.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
