---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
  - 3d
---

# AudioStreamPlayer3D pour sons spatialisés

> [!abstract] Concept
> AudioStreamPlayer3D joue des sons positionnés dans l'espace 3D avec atténuation de volume basée sur la distance, créant une expérience audio immersive.

## Explication

AudioStreamPlayer3D est un nœud spécialisé pour jouer des sons dans un environnement 3D. Contrairement à AudioStreamPlayer qui joue des sons 2D, ce nœud calcule automatiquement le volume et le panoramique stéréo basé sur la position du son par rapport à la caméra/listener, créant un effet de spatialisation réaliste.

Le nœud offre plusieurs paramètres importants : `AttenuationModel` (comment le volume diminue avec la distance), `MaxDistance` (distance maximale d'audibilité), `UnitSize` (échelle de référence), et `EmissionAngle` (pour les sons directionnels). Il supporte l'effet Doppler pour simuler les changements de fréquence basés sur le mouvement.

Pour Human Decision Simulator, AudioStreamPlayer3D sera essentiel pour créer une ambiance sonore vivante : bruits de pas des citoyens, sons de travail dans les fermes ou ateliers, conversations dans les marchés, et événements localisés (constructions, célébrations, conflits). Cela renforce l'immersion en donnant une dimension sonore à la simulation 3D.

Les bonnes pratiques incluent le groupement de sons similaires sur des bus audio pour optimiser, l'utilisation d'object pooling pour les sons fréquents, et l'ajustement des paramètres d'atténuation selon l'échelle du jeu.

## Exemples

```csharp
using Godot;

// Citoyen avec sons de pas spatialisés
public partial class CitizenWithFootsteps : CharacterBody3D
{
    private AudioStreamPlayer3D _footstepPlayer;
    private float _footstepTimer = 0f;
    private const float FootstepInterval = 0.5f;

    [Export]
    public AudioStream[] FootstepSounds { get; set; }

    public override void _Ready()
    {
        _footstepPlayer = new AudioStreamPlayer3D
        {
            MaxDistance = 30f,
            UnitSize = 1f,
            AttenuationModel = AudioStreamPlayer3D.AttenuationModelEnum.InverseSquareDistance
        };

        // Bus audio pour tous les footsteps
        _footstepPlayer.Bus = "SFX";

        AddChild(_footstepPlayer);
    }

    public override void _PhysicsProcess(double delta)
    {
        if (Velocity.Length() > 0.1f) // En mouvement
        {
            _footstepTimer += (float)delta;
            if (_footstepTimer >= FootstepInterval)
            {
                PlayFootstep();
                _footstepTimer = 0f;
            }
        }
    }

    private void PlayFootstep()
    {
        if (FootstepSounds == null || FootstepSounds.Length == 0)
            return;

        // Son aléatoire pour variété
        int randomIndex = GD.RandRange(0, FootstepSounds.Length - 1);
        _footstepPlayer.Stream = FootstepSounds[randomIndex];
        _footstepPlayer.PitchScale = (float)GD.RandRange(0.9, 1.1); // Variation de pitch
        _footstepPlayer.Play();
    }
}

// Bâtiment avec son d'ambiance 3D
public partial class WorkshopBuilding : Node3D
{
    private AudioStreamPlayer3D _ambiencePlayer;

    [Export]
    public AudioStream WorkingSound { get; set; }

    public override void _Ready()
    {
        _ambiencePlayer = new AudioStreamPlayer3D
        {
            Stream = WorkingSound,
            Autoplay = true,
            MaxDistance = 40f,
            UnitSize = 5f, // Plus grande unité pour un bâtiment
            AttenuationModel = AudioStreamPlayer3D.AttenuationModelEnum.Linear
        };

        AddChild(_ambiencePlayer);
    }

    public void SetWorking(bool isWorking)
    {
        if (isWorking && !_ambiencePlayer.Playing)
        {
            _ambiencePlayer.Play();
        }
        else if (!isWorking && _ambiencePlayer.Playing)
        {
            // Fade out
            Tween tween = CreateTween();
            tween.TweenProperty(_ambiencePlayer, "volume_db", -80, 1.0f);
            tween.TweenCallback(Callable.From(() => _ambiencePlayer.Stop()));
        }
    }
}

// Gestionnaire de sons 3D avec pooling
public partial class AudioManager3D : Node
{
    private PackedScene _audioPlayerScene;
    private Node3D _soundsRoot;
    private System.Collections.Generic.List<AudioStreamPlayer3D> _availablePlayers = new();

    public override void _Ready()
    {
        _soundsRoot = new Node3D { Name = "SoundsRoot" };
        AddChild(_soundsRoot);

        // Pré-créer un pool de lecteurs audio
        for (int i = 0; i < 20; i++)
        {
            var player = new AudioStreamPlayer3D();
            player.Finished += () => ReturnToPool(player);
            _soundsRoot.AddChild(player);
            _availablePlayers.Add(player);
        }
    }

    public void PlaySoundAtPosition(AudioStream sound, Vector3 position, float maxDistance = 30f)
    {
        AudioStreamPlayer3D player = GetAvailablePlayer();
        if (player == null)
        {
            GD.PrintErr("No available audio players in pool");
            return;
        }

        player.Stream = sound;
        player.MaxDistance = maxDistance;
        player.GlobalPosition = position;
        player.Play();
    }

    private AudioStreamPlayer3D GetAvailablePlayer()
    {
        if (_availablePlayers.Count > 0)
        {
            var player = _availablePlayers[0];
            _availablePlayers.RemoveAt(0);
            return player;
        }

        // Pool épuisé, créer un nouveau (éviter en production)
        var newPlayer = new AudioStreamPlayer3D();
        newPlayer.Finished += () => ReturnToPool(newPlayer);
        _soundsRoot.AddChild(newPlayer);
        return newPlayer;
    }

    private void ReturnToPool(AudioStreamPlayer3D player)
    {
        if (!_availablePlayers.Contains(player))
        {
            _availablePlayers.Add(player);
        }
    }
}

// Événement 3D avec son directionnel
public partial class EventMarker : Node3D
{
    private AudioStreamPlayer3D _eventSound;

    [Export]
    public AudioStream CelebrationSound { get; set; }

    public override void _Ready()
    {
        _eventSound = new AudioStreamPlayer3D
        {
            Stream = CelebrationSound,
            MaxDistance = 50f,
            EmissionAngleDegrees = 45f, // Son directionnel
            EmissionAngleEnabled = true,
            EmissionAngleFilterAttenuationDb = -12f
        };

        AddChild(_eventSound);
    }

    public void TriggerEvent()
    {
        _eventSound.Play();

        // Animation visuelle + son
        GD.Print($"Événement déclenché à {GlobalPosition}");
    }

    // Rotation pour diriger le son
    public void SetSoundDirection(Vector3 direction)
    {
        LookAt(GlobalPosition + direction, Vector3.Up);
    }
}
```

## Connexions
### Notes liées
- [[Godot - Système audio de Godot]]
- [[Godot - AudioStreamPlayer pour musique]]
- [[Godot - Bus audio et mixage]]
- [[Godot - Pooling d'objets]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. L'audio spatialisé est crucial pour créer une simulation immersive où le joueur peut "entendre" l'activité de sa civilisation. Les sons de citoyens qui travaillent, marchent, et interagissent dans différentes zones de la ville ajoutent une dimension sensorielle importante. Un système audio 3D bien conçu aide le joueur à comprendre rapidement ce qui se passe dans différentes parties de la simulation sans avoir besoin de regarder partout constamment.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
