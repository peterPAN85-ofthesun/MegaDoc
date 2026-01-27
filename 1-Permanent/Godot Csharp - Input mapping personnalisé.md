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

# Godot Csharp - Input mapping personnalisé

> [!abstract] Concept
> Godot permet de créer des "actions" qui regroupent plusieurs entrées (clavier, souris, manette) sous un même nom logique, facilitant la gestion multi-plateforme.

## Explication

Au lieu de vérifier chaque touche individuellement, on crée des **actions** qui peuvent être déclenchées par plusieurs entrées différentes.

### Configuration dans l'éditeur

1. Aller dans `Projet → Paramètres du Projet → Contrôles`
2. Créer une action (ex: `avancer`)
3. Associer les entrées souhaitées :
   - Flèche du haut
   - Touche W
   - Joystick gauche vers le haut

## Exemples

### Vérifier l'état d'une action

```csharp
public override void _Process(double delta)
{
    // Action actuellement maintenue
    if (Input.IsActionPressed("avancer"))
    {
        // Le joueur maintient la touche
    }

    // Action vient d'être relâchée
    if (Input.IsActionJustReleased("avancer"))
    {
        // Le joueur vient de relâcher
    }

    // Action vient d'être pressée (une seule fois)
    if (Input.IsActionJustPressed("sauter"))
    {
        // Déclencher le saut
    }
}
```

### Actions par défaut de Godot

Godot fournit des actions prédéfinies :
- `ui_up`, `ui_down`, `ui_left`, `ui_right`
- `ui_accept`, `ui_cancel`
- `ui_focus_next`, `ui_focus_prev`

```csharp
if (Input.IsActionPressed("ui_up"))
{
    direction.Y -= 1;
}
if (Input.IsActionPressed("ui_down"))
{
    direction.Y += 1;
}
```

### Obtenir la force d'un input analogique

```csharp
// Pour les joysticks, retourne une valeur entre 0 et 1
float force = Input.GetActionStrength("accelerer");
```

## Méthodes Input disponibles

| Méthode | Description |
|---------|-------------|
| `IsActionPressed(action)` | `true` si l'action est maintenue |
| `IsActionJustPressed(action)` | `true` une seule frame au début |
| `IsActionJustReleased(action)` | `true` une seule frame à la fin |
| `GetActionStrength(action)` | Force analogique (0.0 à 1.0) |
| `GetVector(neg_x, pos_x, neg_y, pos_y)` | Vecteur 2D normalisé |

## Cas d'usage

- **Mouvement** : `avancer`, `reculer`, `gauche`, `droite`
- **Actions** : `sauter`, `tirer`, `interagir`
- **UI** : `pause`, `inventaire`, `carte`
- **Debug** : `debug_mode`, `free_cam`

## Connexions

### Notes liées
- [[Godot Csharp - Déplacement CharacterBody3D]] - Utilise les actions pour le mouvement
- [[Godot Csharp - Cycle de vie (_Ready, _Process, _PhysicsProcess)]] - Vérifié dans `_Process()` ou `_PhysicsProcess()`

### Dans le contexte de
- [[MOC - Godot]] - Système d'input Godot

---

**Tags thématiques** : `#godot` `#csharp` `#gamedev` `#input`
