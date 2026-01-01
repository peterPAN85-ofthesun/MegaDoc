---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
---

# Système audio de Godot

> [!abstract] Concept
> Le système audio de Godot intègre players (2D/3D), bus de mixage, effets, et formats de stream pour créer une expérience sonore complète et professionnelle.

## Explication

Le système audio de Godot est composé de plusieurs éléments interconnectés : les AudioStreamPlayers (standard, 2D, 3D) qui jouent les sons, les AudioStreams qui représentent les fichiers audio (OGG, WAV, MP3), les bus audio qui organisent et mixent les sons, et les effets audio qui transforment le son. Le tout est géré par le singleton AudioServer.

Les trois types de players servent des besoins différents : AudioStreamPlayer pour les sons 2D non-positionnés (musique, UI), AudioStreamPlayer2D pour les sons 2D positionnés (jeux 2D), et AudioStreamPlayer3D pour les sons spatialisés 3D. Chaque type peut être routé vers n'importe quel bus audio pour le mixage et les effets.

Pour Human Decision Simulator, le système audio créera l'ambiance d'une civilisation vivante : musique adaptative selon l'état du jeu, sons 3D de citoyens et activités, notifications sonores d'événements, et effets d'interface. Un système audio bien conçu améliore considérablement l'immersion sans surcharger le joueur visuellement.

Les formats recommandés sont OGG Vorbis pour la musique (compression avec qualité), WAV pour les effets courts qui nécessitent un chargement instantané, et MP3 en dernier recours. Godot gère automatiquement le streaming pour les fichiers longs.

## Exemples

```csharp
using Godot;

// Gestionnaire audio centralisé
public partial class GameAudioSystem : Node
{
    // Singleton
    public static GameAudioSystem Instance { get; private set; }

    // Players dédiés
    private AudioStreamPlayer _musicPlayer;
    private AudioStreamPlayer _ambiencePlayer;
    private AudioManager3D _audio3DManager;

    [Export]
    public AudioStream[] BackgroundMusics { get; set; }

    [Export]
    public AudioStream CityAmbience { get; set; }

    public override void _Ready()
    {
        Instance = this;

        // Music player
        _musicPlayer = new AudioStreamPlayer
        {
            Bus = "Music"
        };
        AddChild(_musicPlayer);

        // Ambience player (loops d'ambiance)
        _ambiencePlayer = new AudioStreamPlayer
        {
            Bus = "Ambience",
            Stream = CityAmbience,
            Autoplay = true
        };
        AddChild(_ambiencePlayer);

        // Gestionnaire de sons 3D
        _audio3DManager = new AudioManager3D();
        AddChild(_audio3DManager);

        // Démarrer la musique
        PlayRandomMusic();
    }

    public void PlayRandomMusic()
    {
        if (BackgroundMusics == null || BackgroundMusics.Length == 0)
            return;

        int randomIndex = GD.RandRange(0, BackgroundMusics.Length - 1);
        _musicPlayer.Stream = BackgroundMusics[randomIndex];
        _musicPlayer.Play();

        // Quand la musique se termine, en jouer une autre
        _musicPlayer.Finished += PlayRandomMusic;
    }

    public void PlaySound3D(AudioStream sound, Vector3 position)
    {
        _audio3DManager.PlaySoundAtPosition(sound, position);
    }

    public void SetMusicVolume(float volume)
    {
        int busIdx = AudioServer.GetBusIndex("Music");
        AudioServer.SetBusVolumeDb(busIdx, Mathf.LinearToDb(volume));
    }
}

// Gestionnaire 3D simple intégré
public partial class AudioManager3D : Node
{
    private Node3D _soundsRoot;
    private System.Collections.Generic.Queue<AudioStreamPlayer3D> _playerPool = new();

    public override void _Ready()
    {
        _soundsRoot = new Node3D { Name = "Sounds3DRoot" };
        AddChild(_soundsRoot);

        // Pré-créer des players
        for (int i = 0; i < 15; i++)
        {
            CreatePlayer();
        }
    }

    private void CreatePlayer()
    {
        var player = new AudioStreamPlayer3D
        {
            Bus = "SFX",
            MaxDistance = 30f
        };
        player.Finished += () => ReturnPlayer(player);
        _soundsRoot.AddChild(player);
        _playerPool.Enqueue(player);
    }

    public void PlaySoundAtPosition(AudioStream sound, Vector3 position, float maxDistance = 30f)
    {
        if (_playerPool.Count == 0)
        {
            GD.Print("Pool vide, création d'un nouveau player");
            CreatePlayer();
        }

        var player = _playerPool.Dequeue();
        player.Stream = sound;
        player.GlobalPosition = position;
        player.MaxDistance = maxDistance;
        player.Play();
    }

    private void ReturnPlayer(AudioStreamPlayer3D player)
    {
        _playerPool.Enqueue(player);
    }
}

// Système de sons adaptatifs basés sur le gameplay
public partial class AdaptiveAudioController : Node
{
    [Export]
    public AudioStream PeacefulMusic { get; set; }

    [Export]
    public AudioStream TenseMusic { get; set; }

    [Export]
    public AudioStream BattleMusic { get; set; }

    private AudioStreamPlayer _musicPlayer;
    private string _currentMood = "";
    private float _transitionDuration = 2.0f;

    public override void _Ready()
    {
        _musicPlayer = GetNode<AudioStreamPlayer>("MusicPlayer");
    }

    public void UpdateMood(float tension, bool inBattle)
    {
        string newMood;

        if (inBattle)
            newMood = "battle";
        else if (tension > 0.7f)
            newMood = "tense";
        else
            newMood = "peaceful";

        if (newMood != _currentMood)
        {
            TransitionToMood(newMood);
            _currentMood = newMood;
        }
    }

    private void TransitionToMood(string mood)
    {
        AudioStream newMusic = mood switch
        {
            "battle" => BattleMusic,
            "tense" => TenseMusic,
            _ => PeacefulMusic
        };

        // Fade out -> change -> fade in
        Tween tween = CreateTween();

        // Fade out
        tween.TweenProperty(_musicPlayer, "volume_db", -80, _transitionDuration / 2);

        // Changer de musique
        tween.TweenCallback(Callable.From(() =>
        {
            _musicPlayer.Stream = newMusic;
            _musicPlayer.Play();
        }));

        // Fade in
        tween.TweenProperty(_musicPlayer, "volume_db", 0, _transitionDuration / 2);
    }
}

// Notification sonore avec priorité
public partial class SoundNotificationSystem : Node
{
    [Export]
    public AudioStream ImportantEvent { get; set; }

    [Export]
    public AudioStream MinorEvent { get; set; }

    [Export]
    public AudioStream UIClick { get; set; }

    private AudioStreamPlayer _notificationPlayer;
    private System.Collections.Generic.Queue<(AudioStream sound, float priority)> _soundQueue = new();
    private bool _isPlaying = false;

    public override void _Ready()
    {
        _notificationPlayer = new AudioStreamPlayer
        {
            Bus = "UI"
        };
        _notificationPlayer.Finished += OnSoundFinished;
        AddChild(_notificationPlayer);
    }

    public void PlayNotification(AudioStream sound, float priority = 1.0f)
    {
        if (!_isPlaying)
        {
            PlayImmediate(sound);
        }
        else
        {
            // Ajouter à la queue
            _soundQueue.Enqueue((sound, priority));
        }
    }

    private void PlayImmediate(AudioStream sound)
    {
        _notificationPlayer.Stream = sound;
        _notificationPlayer.Play();
        _isPlaying = true;
    }

    private void OnSoundFinished()
    {
        _isPlaying = false;

        if (_soundQueue.Count > 0)
        {
            var (sound, _) = _soundQueue.Dequeue();
            PlayImmediate(sound);
        }
    }
}
```

## Connexions
### Notes liées
- [[Godot - AudioStreamPlayer pour musique]]
- [[Godot - AudioStreamPlayer3D pour sons spatialisés]]
- [[Godot - Bus audio et mixage]]
- [[Godot - Feedback visuel et audio]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. Le système audio est un pilier fondamental de l'expérience de jeu, créant l'ambiance, fournissant du feedback, et renforçant l'immersion. Dans HDS, l'audio aidera à communiquer l'état de la civilisation (musique qui change avec la tension sociale, sons d'activités économiques, notifications d'événements), rendant la simulation plus vivante et engageante. Un système audio bien architecturé facilite l'ajout de nouveaux sons et l'ajustement de l'expérience sonore globale.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
