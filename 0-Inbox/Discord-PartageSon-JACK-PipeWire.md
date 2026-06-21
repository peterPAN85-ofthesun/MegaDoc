---
date: 2026-06-20
tags: [linux, arch, pipewire, jack, discord, audio]
---

# Partager le son d'Ardour/Carla (JACK) sur Discord — PipeWire/Wayland

## Problème
Partage d'écran **avec son** sur Discord (client natif `/usr/bin/discord`) : impossible
de transmettre le son d'**Ardour** ou **Carla** (qui tournent en pipewire-jack).
Le node `discord_capture` apparaît une fraction de seconde puis disparaît.
Symptôme trompeur : si on branche Ardour à la main sur un `discord_capture`, le son
**ne passe que tant qu'une vidéo YouTube/Firefox joue** ; dès qu'on coupe la vidéo,
le son d'Ardour est coupé lui aussi alors que le lien est toujours présent.

## Cause réelle (diagnostic)
Discord crée **un node `discord_capture` par application** dont il détecte l'audio,
et identifie ces applis par leur **`application.process.binary` / `application.process.id`**
(propriétés PipeWire). Constaté en live : un node de capture pour Firefox, un pour
Chromium, etc.

- Ardour/Carla en **JACK** exposent des ports JACK, sans flux PulseAudio
  `Stream/Output/Audio` ni `application.process.binary` → Discord ne les voit jamais
  comme des applis → aucun node de capture créé pour eux.
- Brancher Ardour à la main sur le node de capture de **Firefox** le faisait
  « piggyback » : Discord ne transmet ce node que tant que Firefox produit du son →
  d'où « ça marche seulement quand YouTube joue ».
- Vérifié au `pw-top` : dans l'état défaillant, le graphe PipeWire tourne quand même
  (driver = micro webcam C920, sink + ardour + discord_capture en `running`, liens
  intacts). Le blocage est **côté application Discord**, pas côté routage PipeWire.

## Solution — un pont loopback qui se fait passer pour une appli
On crée un sink virtuel **« Discord-Bridge »** :
- côté capture = `Audio/Sink` → on y envoie Ardour/Carla (ports d'entrée) ;
- côté lecture = `Stream/Output/Audio` **avec `application.process.binary`** → Discord
  le reconnaît comme une appli, lui crée son propre node de capture et le transmet
  **dès qu'il y a du signal, indépendamment de Firefox**. Sort aussi vers les HP réels
  (on entend le son normalement).

La clé qui débloque tout : **`application.process.binary`** dans `playback.props`.

### Config persistante
Fichier `~/.config/pipewire/pipewire.conf.d/discord-bridge.conf` :

```
context.modules = [
  { name = libpipewire-module-loopback
    args = {
      capture.props = {
        media.class      = Audio/Sink
        node.name        = discord_bridge
        node.description = "Discord-Bridge"
        audio.position   = [ FL FR ]
      }
      playback.props = {
        media.class                = Stream/Output/Audio
        node.name                  = discord_bridge_out
        node.description           = "Discord-Bridge"
        application.name           = "Discord-Bridge"
        application.process.binary = discord-bridge
        media.role                 = Music
        target.object              = alsa_output.pci-0000_00_1f.3.analog-stereo
        audio.position             = [ FL FR ]
      }
    }
  }
]
```

Activation : se charge au prochain login, ou maintenant via
`systemctl --user restart pipewire pipewire-pulse wireplumber`
(coupe l'audio ~1 s et interrompt l'appel Discord en cours).

### Test rapide en RAM (sans config)
```bash
pw-loopback \
  --capture-props='media.class=Audio/Sink node.name=discord_bridge node.description=Discord-Bridge audio.position=[FL,FR]' \
  --playback-props='media.class=Stream/Output/Audio node.name=discord_bridge_out application.name=Discord-Bridge application.process.binary=discord-bridge media.role=Music target.object=alsa_output.pci-0000_00_1f.3.analog-stereo audio.position=[FL,FR]' &
```

### Routage Ardour/Carla -> pont
Envoyer le Master vers le sink **« Discord-Bridge »**, soit depuis Ardour/Carla, soit
via qpwgraph :
```bash
pw-link "ardour:Master/audio_out 1" "discord_bridge:playback_FL"
pw-link "ardour:Master/audio_out 2" "discord_bridge:playback_FR"
# Carla en mode autonome : brancher Carla:audio-out1/2 de la même façon
```
Pour que ça tienne tout seul : qpwgraph -> Patchbay -> Activate -> Save
(le node `discord_bridge` est stable, il ne churne pas).

## Usage quotidien
Tout ce qu'on veut partager sur Discord → l'envoyer dans le sink **« Discord-Bridge »**.
On l'entend dans les HP *et* Discord le transmet, vidéo ou pas.

## Commandes de diag utiles
```bash
pw-link -i / -o / -l          # ports d'entrée / sortie / liens
pw-top -b -n 2                # arbre driver->followers + activité réelle
pw-dump                       # état complet (states, props, links) -> à parser
```

## Environnement
PipeWire 1.6.6 · WirePlumber 0.5.14 · xdg-desktop-portal-kde 6.6.5 · Discord natif · Arch/KDE Wayland
