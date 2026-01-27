---
type: permanent
created: 2026-01-27
tags:
  - permanent
  - godot
  - csharp
  - gamedev
  - input
---

# Godot Csharp - Gestion du curseur souris

> [!abstract] Concept
> `DisplayServer.MouseSetMode()` permet de contrôler le comportement du curseur : visible, caché, capturé (pour les FPS), ou confiné à la fenêtre.

## Explication

Le mode souris détermine comment le curseur interagit avec la fenêtre du jeu.

## Modes disponibles

| Mode | Description | Usage |
|------|-------------|-------|
| `Visible` | Curseur normal, visible | Menus, UI |
| `Hidden` | Curseur invisible mais actif | Cutscenes |
| `Captured` | Invisible + capturé au centre | FPS, TPS |
| `Confined` | Visible mais confiné à la fenêtre | RTS, stratégie |
| `ConfinedHidden` | Confiné + invisible | Combinaison |

## Exemples

### Capturer la souris (FPS)

```csharp
public override void _Ready()
{
    // Capturer la souris pour un FPS
    DisplayServer.MouseSetMode(DisplayServer.MouseMode.Captured);
}
```

### Libérer la souris (menu pause)

```csharp
public void OuvrirMenuPause()
{
    // Rendre la souris visible pour naviguer dans le menu
    DisplayServer.MouseSetMode(DisplayServer.MouseMode.Visible);
}

public void FermerMenuPause()
{
    // Re-capturer pour le gameplay
    DisplayServer.MouseSetMode(DisplayServer.MouseMode.Captured);
}
```

### Toggle avec Escape

```csharp
public override void _Input(InputEvent ev)
{
    if (ev.IsActionPressed("ui_cancel"))  // Escape par défaut
    {
        if (DisplayServer.MouseGetMode() == DisplayServer.MouseMode.Captured)
        {
            DisplayServer.MouseSetMode(DisplayServer.MouseMode.Visible);
        }
        else
        {
            DisplayServer.MouseSetMode(DisplayServer.MouseMode.Captured);
        }
    }
}
```

### Lire le mode actuel

```csharp
var currentMode = DisplayServer.MouseGetMode();
if (currentMode == DisplayServer.MouseMode.Captured)
{
    // En mode jeu
}
```

## Cas d'usage

- **FPS/TPS** : `Captured` pendant le jeu, `Visible` dans les menus
- **RTS** : `Confined` pour garder la souris dans la fenêtre
- **Point & Click** : `Visible` avec curseur custom
- **Cutscenes** : `Hidden` temporairement

## Connexions

### Notes liées
- [[Godot Csharp - Rotation caméra FPS]] - Utilise `Captured` pour la rotation
- [[Godot Csharp - Input mapping personnalisé]] - Toggle avec une action

### Dans le contexte de
- [[MOC - Godot]] - Gestion des inputs

---

**Tags thématiques** : `#godot` `#csharp` `#gamedev` `#souris` `#input`
