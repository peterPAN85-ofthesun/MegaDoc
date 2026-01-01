---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
  - ui
---

# Ancres et marges dans l'UI

> [!abstract] Concept
> Les ancres et marges définissent comment les nœuds UI se positionnent et redimensionnent par rapport à leur parent, permettant des interfaces adaptatives.

## Explication

Les ancres (anchors) dans Godot déterminent les points d'attache d'un Control node par rapport à son conteneur parent. Chaque nœud UI possède quatre ancres (haut, bas, gauche, droite) qui peuvent être positionnées entre 0.0 et 1.0, représentant un pourcentage de la taille du parent.

Les marges (margins) définissent la distance en pixels entre les bords du nœud et ses points d'ancrage. Combinées avec les ancres, elles permettent de créer des layouts responsifs qui s'adaptent automatiquement aux différentes résolutions d'écran.

Le système d'ancrage de Godot offre plusieurs presets courants : coins, centres, et modes d'expansion. Pour un jeu comme Human Decision Simulator, cela permet de créer des interfaces qui fonctionnent sur différentes tailles d'écran tout en conservant une mise en page cohérente.

La propriété `GrowDirection` contrôle comment un Control grandit quand sa taille change. Les marges peuvent être définies via `AnchorLeft`, `AnchorRight`, `AnchorTop`, `AnchorBottom` et les offsets correspondants.

## Exemples

```csharp
using Godot;

public partial class ResponsivePanel : Panel
{
    public override void _Ready()
    {
        // Ancrer au centre avec marges fixes
        AnchorLeft = 0.5f;
        AnchorRight = 0.5f;
        AnchorTop = 0.5f;
        AnchorBottom = 0.5f;

        // Définir la taille avec offsets
        OffsetLeft = -200;
        OffsetRight = 200;
        OffsetTop = -150;
        OffsetBottom = 150;
    }
}

// Panneau qui s'étend sur toute la largeur
public partial class FullWidthBar : Panel
{
    public override void _Ready()
    {
        // Ancres en mode "full rect" horizontalement
        AnchorLeft = 0.0f;
        AnchorRight = 1.0f;
        AnchorTop = 0.0f;
        AnchorBottom = 0.0f;

        // Marges pour l'espacement
        OffsetLeft = 10;
        OffsetRight = -10;
        OffsetBottom = 50;
    }
}

// Configuration programmatique d'ancres pour un HUD
public partial class HUDManager : Control
{
    private Label _healthLabel;

    public override void _Ready()
    {
        _healthLabel = GetNode<Label>("HealthLabel");

        // Ancrer en haut à gauche avec marges
        _healthLabel.SetAnchorsPreset(Control.LayoutPreset.TopLeft);
        _healthLabel.OffsetLeft = 20;
        _healthLabel.OffsetTop = 20;
    }
}
```

## Connexions
### Notes liées
- [[Godot - Système UI de Godot - Control nodes]]
- [[Godot - Containers et layouts]]
- [[Godot - Créer des menus et interfaces]]
- [[Godot - HUD et overlay]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. Le système d'ancrage est essentiel pour créer une interface utilisateur adaptative capable d'afficher les informations de simulation (population, ressources, événements) sur différentes résolutions d'écran. Une compréhension solide des ancres permet de construire des menus, des HUDs et des panneaux d'information qui restent lisibles et bien positionnés quelle que soit la taille de la fenêtre.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
