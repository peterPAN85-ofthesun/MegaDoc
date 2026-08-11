---
type: permanent
created: 2026-08-11 00:00
tags:
  - permanent
  - linux
  - pipewire
  - jack
  - discord
  - audio
---

# PipeWire - Bridge loopback pour capture applicative (Discord)

> [!abstract] Concept
> Discord ne crée un node de capture audio que pour les applications identifiées par la propriété PipeWire `application.process.binary` ; les applications en pur JACK (Ardour, Carla) n'en ont pas et restent invisibles pour le partage de son. Un sink loopback qui usurpe cette propriété résout le problème.

## Explication

Discord (client natif) crée dynamiquement un node `discord_capture` **par application** dont il détecte l'audio, en s'appuyant sur les propriétés PipeWire `application.process.binary` / `application.process.id`. Une application comme **Ardour** ou **Carla**, tournant en JACK pur, expose des ports JACK mais aucun flux `Stream/Output/Audio` avec ces propriétés applicatives — Discord ne la voit donc jamais comme une source à capturer, même si le graphe PipeWire est fonctionnel et que les liens audio existent bien (vérifiable avec `pw-top`).

**Piège de diagnostic courant** : brancher manuellement Ardour sur le node de capture d'une autre appli (ex: Firefox) fait passer le son *par intermittence*, uniquement quand Firefox lui-même produit du son — Discord ne transmet ce node capturé que tant que son application d'origine est active. Le symptôme (« ça marche seulement quand une vidéo YouTube joue ») fait croire à tort à un problème de routage, alors que le blocage est **côté logique applicative de Discord**, pas côté PipeWire.

**Solution** : créer un sink virtuel loopback qui se fait passer pour une vraie application. Côté capture, c'est un simple `Audio/Sink` où l'on envoie Ardour/Carla. Côté lecture, c'est un `Stream/Output/Audio` portant explicitement `application.process.binary` — ce qui fait que Discord lui crée son propre node de capture, transmis dès qu'il y a du signal, indépendamment de toute autre application.

## Exemples

Config persistante — `~/.config/pipewire/pipewire.conf.d/discord-bridge.conf` :
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
        audio.position              = [ FL FR ]
      }
    }
  }
]
```

Test rapide sans fichier de config (en RAM) :
```bash
pw-loopback \
  --capture-props='media.class=Audio/Sink node.name=discord_bridge node.description=Discord-Bridge audio.position=[FL,FR]' \
  --playback-props='media.class=Stream/Output/Audio node.name=discord_bridge_out application.name=Discord-Bridge application.process.binary=discord-bridge media.role=Music target.object=alsa_output.pci-0000_00_1f.3.analog-stereo audio.position=[FL,FR]' &
```

Router Ardour vers le pont :
```bash
pw-link "ardour:Master/audio_out 1" "discord_bridge:playback_FL"
pw-link "ardour:Master/audio_out 2" "discord_bridge:playback_FR"
```

Commandes de diagnostic PipeWire utiles :
```bash
pw-link -i / -o / -l          # ports d'entrée / sortie / liens
pw-top -b -n 2                # arbre driver->followers + activité réelle
pw-dump                       # état complet (states, props, links)
```

## Cas d'usage

- Partager sur Discord le son d'un DAW (Ardour, Carla) fonctionnant en JACK pur
- Plus généralement : rendre visible à une application « appliquant un filtre par identité de process » (ici Discord) une source audio qui n'a normalement pas cette identité
- Diagnostic PipeWire quand un flux existe dans le graphe (`pw-top`) mais qu'une application tierce ne le reconnaît pas

## Connexions

### Notes liées
- (aucune autre note PipeWire/JACK dans le vault pour le moment)

### Contexte
La clé qui débloque tout le problème est la propriété `application.process.binary` dans `playback.props` — sans elle, le loopback est un simple sink audio comme un autre, invisible pour Discord.

## Sources
- Diagnostic personnel Arch/KDE Wayland, PipeWire 1.6.6 / WirePlumber 0.5.14 (2026-06-20)

---
**Tags thématiques** : #linux #pipewire #jack #discord #audio
