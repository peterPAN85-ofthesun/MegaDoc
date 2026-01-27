---
type: permanent
created: 2026-01-27
tags:
  - permanent
  - godot
  - csharp
  - gamedev
  - animation
---

# Godot Csharp - AnimationPlayer

> [!abstract] Concept
> `AnimationPlayer` est le noeud central pour jouer des animations dans Godot. Il peut animer n'importe quelle propriété de n'importe quel noeud.

## Explication

AnimationPlayer fonctionne avec des **pistes d'animation** qui modifient des propriétés au fil du temps. Une animation peut contenir plusieurs pistes affectant différents noeuds.

## Exemples

### Récupérer et jouer une animation

```csharp
public partial class Player : CharacterBody3D
{
    AnimationPlayer animPlayer;

    public override void _Ready()
    {
        animPlayer = GetNode<AnimationPlayer>("AnimationPlayer");
    }

    public void Marcher()
    {
        animPlayer.Play("Walk");
    }

    public void Courir()
    {
        animPlayer.Play("Run");
    }

    public void Idle()
    {
        animPlayer.Play("Idle");
    }
}
```

### Contrôle avancé

```csharp
// Jouer une animation
animPlayer.Play("Attack");

// Jouer à l'envers
animPlayer.PlayBackwards("Attack");

// Arrêter
animPlayer.Stop();

// Mettre en pause
animPlayer.Pause();

// Vérifier si une animation est en cours
if (animPlayer.IsPlaying())
{
    GD.Print($"Animation en cours: {animPlayer.CurrentAnimation}");
}

// Vitesse de lecture (2x plus rapide)
animPlayer.SpeedScale = 2.0f;
```

### Attendre la fin d'une animation

```csharp
public async void AttaquerEtAttendre()
{
    animPlayer.Play("Attack");

    // Attendre que l'animation se termine
    await ToSignal(animPlayer, AnimationPlayer.SignalName.AnimationFinished);

    GD.Print("Animation terminée !");
    animPlayer.Play("Idle");
}
```

### Connecter aux signaux d'animation

```csharp
public override void _Ready()
{
    animPlayer = GetNode<AnimationPlayer>("AnimationPlayer");

    // Quand une animation se termine
    animPlayer.AnimationFinished += OnAnimationFinished;
}

private void OnAnimationFinished(StringName animName)
{
    GD.Print($"Animation {animName} terminée");

    if (animName == "Death")
    {
        QueueFree();
    }
}
```

## Méthodes utiles

| Méthode | Description |
|---------|-------------|
| `Play(name)` | Jouer l'animation |
| `PlayBackwards(name)` | Jouer à l'envers |
| `Stop()` | Arrêter |
| `Pause()` | Mettre en pause |
| `IsPlaying()` | Animation en cours ? |
| `Queue(name)` | Ajouter à la file d'attente |
| `GetAnimation(name)` | Obtenir la ressource Animation |

## Propriétés utiles

| Propriété | Description |
|-----------|-------------|
| `CurrentAnimation` | Nom de l'animation actuelle |
| `CurrentAnimationPosition` | Position temporelle actuelle |
| `SpeedScale` | Multiplicateur de vitesse |
| `Autoplay` | Animation au démarrage |

## Cas d'usage

- **Personnages** : Walk, Run, Jump, Attack, Death
- **UI** : Transitions, apparitions, disparitions
- **Effets** : Flash, shake, pulse
- **Objets** : Portes, leviers, plateformes

## Connexions

### Notes liées
- [[Godot Csharp - Signaux et événements]] - Signal `AnimationFinished`
- [[Godot Csharp - Cycle de vie (_Ready, _Process, _PhysicsProcess)]] - Déclencher dans `_Process()`

### Dans le contexte de
- [[MOC - Godot]] - Système d'animation

---

**Tags thématiques** : `#godot` `#csharp` `#gamedev` `#animation`
