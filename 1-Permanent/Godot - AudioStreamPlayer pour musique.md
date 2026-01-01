---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
---

# AudioStreamPlayer pour musique

> [!abstract] Concept
> AudioStreamPlayer joue des sons 2D non-spatialisés, idéal pour la musique de fond, les effets UI et l'ambiance générale du jeu.

## Explication

AudioStreamPlayer est le nœud audio de base dans Godot pour jouer des sons qui ne nécessitent pas de positionnement 3D. Il lit des fichiers audio (OGG, WAV, MP3) et offre un contrôle sur le volume, le pitch, et la lecture en boucle. C'est le choix parfait pour la musique de fond et les effets sonores d'interface.

Le nœud supporte plusieurs formats de stream : AudioStreamOggVorbis (recommandé pour la musique), AudioStreamWAV (pour les effets courts), et AudioStreamMP3. Il peut être contrôlé via des bus audio pour appliquer des effets et gérer le mixage global.

Pour Human Decision Simulator, AudioStreamPlayer sera utilisé pour la musique d'ambiance qui change selon l'état de la civilisation, les sons d'interface utilisateur (clics de boutons, notifications), et les effets audio globaux qui ne sont pas liés à une position spécifique dans l'espace 3D.

En C#, on contrôle la lecture avec `Play()`, `Stop()`, `Seek()` et on peut surveiller la progression avec `GetPlaybackPosition()`. Le signal `Finished` permet de détecter quand un son se termine, utile pour enchaîner des pistes musicales ou gérer des transitions.

## Exemples

```csharp
using Godot;

public partial class MusicManager : Node
{
    private AudioStreamPlayer _musicPlayer;
    private AudioStreamPlayer _uiSoundPlayer;

    [Export]
    public AudioStream PeacefulMusic { get; set; }

    [Export]
    public AudioStream TenseMusic { get; set; }

    public override void _Ready()
    {
        _musicPlayer = GetNode<AudioStreamPlayer>("MusicPlayer");
        _uiSoundPlayer = GetNode<AudioStreamPlayer>("UISoundPlayer");

        // Configuration de la musique en boucle
        _musicPlayer.Finished += OnMusicFinished;

        PlayMusic(PeacefulMusic);
    }

    public void PlayMusic(AudioStream stream)
    {
        if (_musicPlayer.Stream == stream && _musicPlayer.Playing)
            return;

        _musicPlayer.Stream = stream;
        _musicPlayer.Play();
    }

    public void CrossfadeToMusic(AudioStream newStream, float duration = 2.0f)
    {
        // Créer un tween pour le fondu enchaîné
        Tween tween = CreateTween();
        tween.TweenProperty(_musicPlayer, "volume_db", -80, duration / 2);
        tween.TweenCallback(Callable.From(() =>
        {
            _musicPlayer.Stream = newStream;
            _musicPlayer.Play();
        }));
        tween.TweenProperty(_musicPlayer, "volume_db", 0, duration / 2);
    }

    public void PlayUISound(AudioStream sound)
    {
        _uiSoundPlayer.Stream = sound;
        _uiSoundPlayer.Play();
    }

    private void OnMusicFinished()
    {
        // Rejouer la musique si elle ne boucle pas automatiquement
        _musicPlayer.Play();
    }

    public void SetMusicVolume(float volumePercent)
    {
        // Conversion linéaire -> décibels
        float db = Mathf.LinearToDb(volumePercent);
        _musicPlayer.VolumeDb = db;
    }
}

// Gestionnaire de musique adaptatif basé sur l'état du jeu
public partial class AdaptiveMusicController : Node
{
    private MusicManager _musicManager;
    private string _currentMood = "peaceful";

    [Export]
    public AudioStream PeacefulTheme { get; set; }

    [Export]
    public AudioStream WarTheme { get; set; }

    [Export]
    public AudioStream CrisisTheme { get; set; }

    public override void _Ready()
    {
        _musicManager = GetNode<MusicManager>("/root/MusicManager");
    }

    public void UpdateMusicBasedOnGameState(float tension, bool atWar)
    {
        string newMood;

        if (atWar)
            newMood = "war";
        else if (tension > 0.7f)
            newMood = "crisis";
        else
            newMood = "peaceful";

        if (newMood != _currentMood)
        {
            _currentMood = newMood;
            AudioStream newTheme = newMood switch
            {
                "war" => WarTheme,
                "crisis" => CrisisTheme,
                _ => PeacefulTheme
            };

            _musicManager.CrossfadeToMusic(newTheme, 3.0f);
        }
    }
}
```

## Connexions
### Notes liées
- [[Godot - Système audio de Godot]]
- [[Godot - Bus audio et mixage]]
- [[Godot - AudioStreamPlayer3D pour sons spatialisés]]
- [[Godot - Feedback visuel et audio]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. La musique joue un rôle crucial dans l'immersion du joueur et la communication de l'état émotionnel de la simulation. Un système de musique adaptative qui change selon la tension sociale, l'économie, ou les événements en cours aide à créer une expérience plus engageante. AudioStreamPlayer est l'outil fondamental pour implémenter ce système musical dynamique.

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
