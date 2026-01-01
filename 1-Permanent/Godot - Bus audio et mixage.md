---
type: permanent
created: 2026-01-01 17:55
tags:
  - permanent
  - godot
  - gamedev
---

# Bus audio et mixage

> [!abstract] Concept
> Les bus audio organisent et mixent les sons en canaux (musique, effets, voix), permettant un contrôle global du volume et des effets audio.

## Explication

Le système de bus audio dans Godot fonctionne comme une table de mixage : chaque AudioStreamPlayer peut être routé vers un bus spécifique (Music, SFX, Voice, etc.), et chaque bus peut avoir son propre volume, des effets (reverb, compression, EQ), et peut être routé vers d'autres bus. Le bus "Master" reçoit tous les autres bus par défaut.

Les bus sont configurés dans l'Audio Bus Editor de Godot et sont accessibles en C# via AudioServer. On peut contrôler dynamiquement le volume de chaque bus, activer/désactiver des effets, et même créer des bus temporaires en runtime. Cela permet de créer des systèmes audio sophistiqués avec peu de code.

Pour Human Decision Simulator, les bus permettront de séparer la musique d'ambiance, les effets sonores de simulation (bruits de foule, travaux), les sons d'interface, et les voix/notifications. Le joueur pourra ajuster chaque catégorie indépendamment dans les options, et le jeu peut automatiquement baisser la musique pendant les dialogues importants (ducking).

Les effets audio sur les bus (reverb pour les intérieurs, low-pass filter pour les sons distants) ajoutent de la profondeur et du réalisme. Les bus peuvent aussi être utilisés pour des transitions atmosphériques dynamiques.

## Exemples

```csharp
using Godot;

// Gestionnaire centralisé des bus audio
public partial class AudioBusManager : Node
{
    // Indices des bus (correspondent à leur position dans l'Audio Bus Editor)
    private const string MasterBus = "Master";
    private const string MusicBus = "Music";
    private const string SfxBus = "SFX";
    private const string VoiceBus = "Voice";
    private const string UiBus = "UI";

    public override void _Ready()
    {
        // S'assurer que les bus existent
        EnsureBusExists(MusicBus);
        EnsureBusExists(SfxBus);
        EnsureBusExists(VoiceBus);
        EnsureBusExists(UiBus);

        // Charger les volumes sauvegardés
        LoadVolumeSettings();
    }

    private void EnsureBusExists(string busName)
    {
        int busIdx = AudioServer.GetBusIndex(busName);
        if (busIdx == -1)
        {
            GD.PrintErr($"Bus audio '{busName}' n'existe pas!");
        }
    }

    public void SetBusVolume(string busName, float volumePercent)
    {
        int busIdx = AudioServer.GetBusIndex(busName);
        if (busIdx == -1) return;

        // Convertir pourcentage linéaire en décibels
        float volumeDb = volumePercent > 0.001f
            ? Mathf.LinearToDb(volumePercent)
            : -80f; // Silence effectif

        AudioServer.SetBusVolumeDb(busIdx, volumeDb);

        // Sauvegarder
        SaveVolumeSetting(busName, volumePercent);
    }

    public float GetBusVolume(string busName)
    {
        int busIdx = AudioServer.GetBusIndex(busName);
        if (busIdx == -1) return 0f;

        float volumeDb = AudioServer.GetBusVolumeDb(busIdx);
        return Mathf.DbToLinear(volumeDb);
    }

    public void MuteBus(string busName, bool mute)
    {
        int busIdx = AudioServer.GetBusIndex(busName);
        if (busIdx == -1) return;

        AudioServer.SetBusMute(busIdx, mute);
    }

    private void SaveVolumeSetting(string busName, float volume)
    {
        // Utiliser ConfigFile pour sauvegarder
        var config = new ConfigFile();
        config.Load("user://audio_settings.cfg");
        config.SetValue("volumes", busName, volume);
        config.Save("user://audio_settings.cfg");
    }

    private void LoadVolumeSettings()
    {
        var config = new ConfigFile();
        Error err = config.Load("user://audio_settings.cfg");

        if (err == Error.Ok)
        {
            SetBusVolume(MusicBus, (float)config.GetValue("volumes", MusicBus, 0.8));
            SetBusVolume(SfxBus, (float)config.GetValue("volumes", SfxBus, 1.0));
            SetBusVolume(VoiceBus, (float)config.GetValue("volumes", VoiceBus, 1.0));
            SetBusVolume(UiBus, (float)config.GetValue("volumes", UiBus, 0.9));
        }
    }
}

// Menu d'options audio avec sliders
public partial class AudioOptionsMenu : VBoxContainer
{
    private AudioBusManager _busManager;
    private HSlider _masterSlider;
    private HSlider _musicSlider;
    private HSlider _sfxSlider;

    public override void _Ready()
    {
        _busManager = GetNode<AudioBusManager>("/root/AudioBusManager");

        CreateVolumeSlider("Master", "Master", out _masterSlider);
        CreateVolumeSlider("Musique", "Music", out _musicSlider);
        CreateVolumeSlider("Effets sonores", "SFX", out _sfxSlider);
    }

    private void CreateVolumeSlider(string label, string busName, out HSlider slider)
    {
        Label titleLabel = new Label { Text = label };
        AddChild(titleLabel);

        slider = new HSlider
        {
            MinValue = 0,
            MaxValue = 100,
            Step = 1,
            Value = _busManager.GetBusVolume(busName) * 100,
            CustomMinimumSize = new Vector2(200, 20)
        };

        slider.ValueChanged += (double value) =>
        {
            _busManager.SetBusVolume(busName, (float)value / 100f);
        };

        AddChild(slider);
    }
}

// Ducking automatique (baisser la musique pendant les dialogues)
public partial class AudioDucker : Node
{
    private const string MusicBus = "Music";
    private float _originalMusicVolume;
    private bool _isDucked = false;

    public void DuckMusic(float duckAmount = 0.3f, float duration = 0.5f)
    {
        if (_isDucked) return;

        int busIdx = AudioServer.GetBusIndex(MusicBus);
        _originalMusicVolume = AudioServer.GetBusVolumeDb(busIdx);

        float targetVolume = _originalMusicVolume - Mathf.LinearToDb(1.0f - duckAmount);

        Tween tween = CreateTween();
        tween.TweenMethod(
            Callable.From<float>((vol) => AudioServer.SetBusVolumeDb(busIdx, vol)),
            _originalMusicVolume,
            targetVolume,
            duration
        );

        _isDucked = true;
    }

    public void UnduckMusic(float duration = 0.5f)
    {
        if (!_isDucked) return;

        int busIdx = AudioServer.GetBusIndex(MusicBus);

        Tween tween = CreateTween();
        tween.TweenMethod(
            Callable.From<float>((vol) => AudioServer.SetBusVolumeDb(busIdx, vol)),
            AudioServer.GetBusVolumeDb(busIdx),
            _originalMusicVolume,
            duration
        );

        _isDucked = false;
    }
}

// Effets audio dynamiques
public partial class AudioEffectsController : Node
{
    public void AddReverbToMusic(float roomSize = 0.8f, float damping = 0.5f)
    {
        int busIdx = AudioServer.GetBusIndex("Music");

        // Ajouter effet Reverb
        var reverb = new AudioEffectReverb
        {
            RoomSize = roomSize,
            Damping = damping,
            Wet = 0.3f,
            Dry = 0.7f
        };

        AudioServer.AddBusEffect(busIdx, reverb);
    }

    public void ApplyLowPassFilterToDistantSounds()
    {
        int sfxBus = AudioServer.GetBusIndex("SFX");

        var lowPass = new AudioEffectLowPassFilter
        {
            CutoffHz = 2000f,
            Resonance = 1.0f
        };

        AudioServer.AddBusEffect(sfxBus, lowPass);
    }

    public void EnableBypassEffect(string busName, int effectIdx, bool bypass)
    {
        int busIdx = AudioServer.GetBusIndex(busName);
        AudioServer.SetBusEffectEnabled(busIdx, effectIdx, !bypass);
    }
}
```

## Connexions
### Notes liées
- [[Godot - Système audio de Godot]]
- [[Godot - AudioStreamPlayer pour musique]]
- [[Godot - AudioStreamPlayer3D pour sons spatialisés]]
- [[Godot - Feedback visuel et audio]]

### Contexte
Cette note fait partie de l'apprentissage de Godot pour le projet Human Decision Simulator. Les bus audio sont essentiels pour créer une expérience sonore professionnelle et permettre aux joueurs de personnaliser leur expérience audio. Dans HDS, séparer la musique d'ambiance, les sons de simulation, et les effets d'interface permet un contrôle précis. Le ducking automatique pendant les événements importants assure que les joueurs ne manquent pas d'informations critiques, et les effets audio dynamiques ajoutent de l'immersion (reverb dans les bâtiments, atténuation des sons distants).

## Sources
- Documentation officielle Godot

---
**Tags thématiques** : #godot #gamedev
