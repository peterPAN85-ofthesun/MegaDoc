---
type: permanent
created: 2026-01-27
tags:
  - permanent
  - godot
  - csharp
  - gamedev
  - camera
---

# Godot Csharp - Rotation caméra FPS

> [!abstract] Concept
> La rotation de caméra FPS nécessite de capturer le mouvement de la souris et de l'appliquer séparément : rotation horizontale sur le personnage, rotation verticale sur la caméra avec limitation d'angle.

## Explication

Pour une caméra FPS :
- **Rotation horizontale (Y)** : Appliquée au CharacterBody3D (le personnage tourne)
- **Rotation verticale (X)** : Appliquée à la Camera3D seule (regarder haut/bas)
- **Clamp vertical** : Limiter l'angle pour éviter de regarder "derrière soi"

## Exemples

### Script complet de caméra FPS

```csharp
public partial class Player : CharacterBody3D
{
    // Paramètres souris
    float m_lookAngle = 90.0f;        // Limite verticale en degrés
    [Export]
    float m_mouseSens = 0.3f;         // Sensibilité (éditable dans Godot)
    Vector2 m_mouseDelta = Vector2.Zero;

    Camera3D camera;

    public override void _Ready()
    {
        base._Ready();
        camera = GetNode<Camera3D>("Camera3D");
    }

    public override void _Input(InputEvent ev)
    {
        // Capturer le mouvement de la souris
        if (ev is InputEventMouseMotion eventMouse)
        {
            m_mouseDelta = eventMouse.Relative;
        }
    }

    public override void _Process(double delta)
    {
        base._Process(delta);

        // Rotation verticale de la caméra (regarder haut/bas)
        camera.RotationDegrees -= new Vector3(
            Mathf.RadToDeg(m_mouseDelta.Y), 0, 0
        ) * m_mouseSens * (float)delta;

        // Limiter l'angle vertical (pas de backflip)
        camera.RotationDegrees = new Vector3(
            Mathf.Clamp(camera.RotationDegrees.X, -m_lookAngle, m_lookAngle),
            camera.RotationDegrees.Y,
            camera.RotationDegrees.Z
        );

        // Rotation horizontale du personnage (tourner gauche/droite)
        RotationDegrees -= new Vector3(
            0, Mathf.RadToDeg(m_mouseDelta.X), 0
        ) * m_mouseSens * (float)delta;

        // Reset pour la prochaine frame
        m_mouseDelta = Vector2.Zero;
    }
}
```

### Attribut [Export]

```csharp
[Export]
float m_mouseSens = 0.3f;
```

L'attribut `[Export]` rend la variable éditable directement dans l'inspecteur de Godot, permettant d'ajuster sans recompiler.

## Points clés

- **`InputEventMouseMotion.Relative`** : Déplacement relatif de la souris depuis la dernière frame
- **`Mathf.RadToDeg()`** : Convertir radians en degrés
- **`Mathf.Clamp()`** : Limiter une valeur entre min et max
- **Reset `m_mouseDelta`** : Important pour éviter que la rotation continue sans mouvement

## Cas d'usage

- FPS (First Person Shooter)
- Jeux d'exploration à la première personne
- Simulateurs de marche
- Mode photo/cinématique

## Connexions

### Notes liées
- [[Godot Csharp - Déplacement CharacterBody3D]] - Combiné avec le mouvement
- [[Godot Csharp - Cycle de vie (_Ready, _Process, _PhysicsProcess)]] - Utilise `_Input()` et `_Process()`
- [[Godot Csharp - Gestion du curseur souris]] - Capturer la souris

### Dans le contexte de
- [[MOC - Godot]] - Contrôle caméra

---

**Tags thématiques** : `#godot` `#csharp` `#gamedev` `#camera` `#fps`
