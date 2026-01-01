---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
---

# AnimationPlayer et AnimationTree

> [!abstract] Concept
> AnimationPlayer gère la lecture d'animations simples, tandis qu'AnimationTree permet de mélanger et transitionner entre plusieurs animations de façon complexe.

## Explication

L'AnimationPlayer est le nœud de base pour jouer des animations dans Godot. Il peut animer n'importe quelle propriété d'un nœud (position, rotation, couleur, etc.) et supporte des pistes multiples, des courbes d'animation et des appels de méthodes. Il est parfait pour les animations simples et séquentielles.

L'AnimationTree est un système plus avancé qui se construit au-dessus d'AnimationPlayer. Il permet de créer des blend spaces, des state machines d'animation, et de fusionner plusieurs animations avec des poids variables. C'est essentiel pour des animations de personnages complexes où on veut mélanger marche/course, ou ajouter des animations de couches supérieures (comme viser tout en marchant).

Pour Human Decision Simulator, AnimationPlayer peut servir pour les animations UI, les transitions de caméra, ou les animations environnementales simples. AnimationTree sera utile pour les NPCs avec des comportements complexes nécessitant des transitions fluides entre différents états d'animation.

En C#, on contrôle ces nœuds via des méthodes comme `Play()`, `Stop()`, et on peut accéder aux paramètres de l'AnimationTree pour contrôler les blends et transitions. L'AnimationTree utilise des ressources AnimationNodeStateMachine ou AnimationNodeBlendTree pour définir sa logique.

## Exemples

```csharp
using Godot;

public partial class NPCAnimationController : Node3D
{
    private AnimationPlayer _animPlayer;
    private AnimationTree _animTree;

    public override void _Ready()
    {
        _animPlayer = GetNode<AnimationPlayer>("AnimationPlayer");
        _animTree = GetNode<AnimationTree>("AnimationTree");

        // Jouer une animation simple
        _animPlayer.Play("idle");

        // Activer l'AnimationTree (il prend le contrôle de l'AnimationPlayer)
        _animTree.Active = true;
    }

    public void SetMovementState(string state)
    {
        // Transition vers un état dans la state machine
        _animTree.Set("parameters/StateMachine/transition_request", state);
    }

    public void SetMovementSpeed(float speed)
    {
        // Contrôler un blend entre idle, walk et run
        _animTree.Set("parameters/MovementBlend/blend_amount", speed);
    }
}

// Animation de UI avec AnimationPlayer
public partial class MenuAnimator : Control
{
    private AnimationPlayer _animPlayer;

    public override void _Ready()
    {
        _animPlayer = GetNode<AnimationPlayer>("AnimationPlayer");
    }

    public void ShowMenu()
    {
        _animPlayer.Play("fade_in");
    }

    public void HideMenu()
    {
        _animPlayer.PlayBackwards("fade_in");
    }

    // Callback appelé depuis l'animation
    private void OnAnimationFinished(StringName animName)
    {
        if (animName == "fade_out")
        {
            QueueFree();
        }
    }
}

// Contrôle avancé d'AnimationTree pour NPC
public partial class CitizenAnimator : Node
{
    private AnimationTree _animTree;

    public override void _Ready()
    {
        _animTree = GetNode<AnimationTree>("AnimationTree");
        _animTree.Active = true;
    }

    public void UpdateAnimation(Vector3 velocity, bool isWorking)
    {
        float speed = velocity.Length();

        // Blend entre idle et walk basé sur la vitesse
        _animTree.Set("parameters/IdleWalkBlend/blend_amount",
            Mathf.Clamp(speed / 5.0f, 0.0f, 1.0f));

        // OneShot pour animation de travail
        if (isWorking)
        {
            _animTree.Set("parameters/WorkOneShot/request",
                (int)AnimationNodeOneShot.OneShotRequest.Fire);
        }
    }
}
```

## Connexions
### Notes liées
- [[Godot - Gestion des animations 3D importées]]
- [[Godot - States machines pour NPCs]]
- [[Godot - Créer des NPCs avec routines]]
- [[Godot - Feedback visuel et audio]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. Les animations sont cruciales pour donner vie aux NPCs dans la simulation. AnimationPlayer sera utilisé pour les effets UI et les transitions visuelles, tandis qu'AnimationTree permettra de créer des animations de citoyens réalistes qui marchent, travaillent, et interagissent de façon fluide. Un système d'animation bien conçu améliore grandement l'immersion et la lisibilité du comportement des NPCs dans la simulation.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
