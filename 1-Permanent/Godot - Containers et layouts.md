---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
---

# Containers et layouts

> [!abstract] Concept
> Les Container nodes organisent automatiquement leurs enfants selon des règles de layout (vertical, horizontal, grille), simplifiant la création d'interfaces adaptatives.

## Explication

Les containers dans Godot sont des nœuds Control spécialisés qui gèrent automatiquement le positionnement et le redimensionnement de leurs enfants. Les principaux types incluent VBoxContainer (vertical), HBoxContainer (horizontal), GridContainer (grille), et MarginContainer (marges).

Contrairement au positionnement manuel, les containers calculent automatiquement les positions en fonction de leur type et des propriétés de leurs enfants. Cela permet de créer des interfaces qui s'adaptent dynamiquement au contenu et aux changements de taille. Les containers respectent les propriétés `SizeFlagsHorizontal` et `SizeFlagsVertical` de leurs enfants.

Pour Human Decision Simulator, les containers sont essentiels pour créer des menus, des listes de ressources, des grilles d'informations de citoyens, et des panneaux de statistiques qui restent organisés même quand le contenu change dynamiquement pendant la simulation.

Les containers peuvent être imbriqués pour créer des layouts complexes. Par exemple, un VBoxContainer peut contenir plusieurs HBoxContainers pour créer une structure en lignes et colonnes. Les propriétés de séparation (`AddThemeConstantOverride("separation", value)`) contrôlent l'espacement entre les éléments.

## Exemples

```csharp
using Godot;

public partial class ResourcesPanel : VBoxContainer
{
    public override void _Ready()
    {
        // Configuration du container
        AddThemeConstantOverride("separation", 10);

        // Ajouter des ressources dynamiquement
        AddResourceDisplay("Gold", 1000);
        AddResourceDisplay("Food", 500);
        AddResourceDisplay("Wood", 250);
    }

    private void AddResourceDisplay(string resourceName, int amount)
    {
        HBoxContainer row = new HBoxContainer();

        Label nameLabel = new Label
        {
            Text = resourceName,
            SizeFlagsHorizontal = SizeFlags.ExpandFill
        };

        Label amountLabel = new Label
        {
            Text = amount.ToString(),
            HorizontalAlignment = HorizontalAlignment.Right
        };

        row.AddChild(nameLabel);
        row.AddChild(amountLabel);
        AddChild(row);
    }
}

// Grille de citoyens avec GridContainer
public partial class CitizensGrid : GridContainer
{
    public override void _Ready()
    {
        Columns = 3; // 3 colonnes
        AddThemeConstantOverride("h_separation", 15);
        AddThemeConstantOverride("v_separation", 15);
    }

    public void PopulateWithCitizens(System.Collections.Generic.List<string> citizenNames)
    {
        foreach (var child in GetChildren())
        {
            child.QueueFree();
        }

        foreach (string name in citizenNames)
        {
            Panel citizenPanel = new Panel();
            VBoxContainer vbox = new VBoxContainer();

            Label nameLabel = new Label { Text = name };
            Button detailsButton = new Button { Text = "Détails" };

            vbox.AddChild(nameLabel);
            vbox.AddChild(detailsButton);
            citizenPanel.AddChild(vbox);

            AddChild(citizenPanel);
        }
    }
}

// Layout complexe pour interface de simulation
public partial class SimulationUI : Control
{
    public override void _Ready()
    {
        // Structure: Margin -> VBox -> (Header, Content, Footer)
        MarginContainer margin = new MarginContainer();
        margin.AddThemeConstantOverride("margin_left", 20);
        margin.AddThemeConstantOverride("margin_right", 20);
        margin.AddThemeConstantOverride("margin_top", 20);
        margin.AddThemeConstantOverride("margin_bottom", 20);

        VBoxContainer mainLayout = new VBoxContainer();

        // Header
        HBoxContainer header = CreateHeader();

        // Content area avec scroll
        ScrollContainer scroll = new ScrollContainer();
        scroll.SizeFlagsVertical = SizeFlags.ExpandFill;

        VBoxContainer content = new VBoxContainer();
        scroll.AddChild(content);

        // Footer
        HBoxContainer footer = CreateFooter();

        mainLayout.AddChild(header);
        mainLayout.AddChild(scroll);
        mainLayout.AddChild(footer);
        margin.AddChild(mainLayout);
        AddChild(margin);
    }

    private HBoxContainer CreateHeader()
    {
        HBoxContainer header = new HBoxContainer();
        header.AddChild(new Label { Text = "Human Decision Simulator" });
        return header;
    }

    private HBoxContainer CreateFooter()
    {
        HBoxContainer footer = new HBoxContainer();
        footer.AddChild(new Button { Text = "Pause" });
        footer.AddChild(new Button { Text = "Accélérer" });
        return footer;
    }
}
```

## Connexions
### Notes liées
- [[Godot - Ancres et marges dans l'UI]]
- [[Godot - Système UI de Godot - Control nodes]]
- [[Godot - Créer des menus et interfaces]]
- [[Godot - Gestion des événements UI]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. Les containers sont la clé pour créer des interfaces robustes et maintenables. Dans HDS, ils permettront de construire des listes de ressources qui s'actualisent, des grilles de statistiques de population, des menus de choix qui s'adaptent au nombre d'options disponibles, et des panneaux d'information complexes. Maîtriser les containers réduit considérablement le code de positionnement manuel et rend l'UI plus résiliente aux changements.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
