---
type: permanent
created: 2025-11-25 16:05
tags:
  - permanent
  - réseau
  - protocole
  - broadcast
  - multimédia
source: "Formation Réseau - 2110"
---

# SDP - Session Description Protocol

> [!abstract] Concept
> SDP (Session Description Protocol) est un format texte standardisé permettant de décrire les caractéristiques d'une session multimédia (adresse, port, codec, format), utilisé notamment pour annoncer les flux SMPTE 2110.

## Explication

Un flux **RTP multicast** peut être diffusé à une adresse comme `239.1.1.1:5004`. Mais comment un receiver sait-il :
- **Quel codec** est utilisé ?
- **Quelle résolution** vidéo ?
- **Quels ports** écouter (audio primaire, secondaire) ?
- **Quel Payload Type RTP** ?

**SDP** décrit toutes ces informations dans un **fichier texte** structuré.

**Standard** : RFC 4566
**Format** : Texte (lignes clé=valeur)

## Structure d'un fichier SDP

### Format général
```
v=0                           ← Version SDP
o=- 123456 1 IN IP4 10.0.0.1  ← Origine session
s=Camera 1 Video              ← Nom session
c=IN IP4 239.1.1.1/32         ← Adresse multicast destination
t=0 0                         ← Timing (0 0 = permanent)
m=video 5004 RTP/AVP 96       ← Média: vidéo, port 5004, payload 96
a=rtpmap:96 raw/90000         ← Attributs: format, clock rate
a=fmtp:96 sampling=YCbCr-4:2:2 ← Format parameters
```

### Lignes principales

#### v= (Version)
```
v=0
```
Version SDP (toujours 0).

#### o= (Origin)
```
o=- 3840109254 1 IN IP4 10.0.0.10
```
- `-` : Username (souvent non utilisé)
- `3840109254` : Session ID
- `1` : Version session
- `IN IP4` : Type réseau
- `10.0.0.10` : Adresse IP source

#### s= (Session Name)
```
s=Camera 01 - Video Output HD
```
Nom descriptif de la session.

#### c= (Connection)
```
c=IN IP4 239.1.1.1/32
```
- `IN IP4` : IPv4
- `239.1.1.1` : **Adresse multicast**
- `/32` : TTL ou scope (unicast vs multicast)

#### t= (Timing)
```
t=0 0
```
- `0 0` : Session permanente (pas de début/fin)

#### m= (Media Description)
```
m=video 5004 RTP/AVP 96
```
- `video` : Type (video, audio, application)
- `5004` : **Port UDP**
- `RTP/AVP` : Profil RTP
- `96` : **Payload Type RTP**

#### a= (Attributes)
```
a=rtpmap:96 raw/90000
a=fmtp:96 sampling=YCbCr-4:2:2; width=1920; height=1080
a=source-filter: incl IN IP4 239.1.1.1 10.0.0.10
```
- `rtpmap` : Mapping Payload Type → codec
- `fmtp` : Format parameters (détails codec)
- `source-filter` : Filtrage par source (SSM)

## Exemples SMPTE 2110

### Exemple 1 : Flux vidéo HD (réseau rouge)

```
v=0
o=- 1234567890 1 IN IP4 192.168.10.100
s=Camera 01 - Video HD 1080p50
c=IN IP4 239.100.1.1/32
t=0 0
m=video 5004 RTP/AVP 96
a=rtpmap:96 raw/90000
a=fmtp:96 sampling=YCbCr-4:2:2; width=1920; height=1080; depth=10; colorimetry=BT709
a=mediaclk:direct=0
a=source-filter: incl IN IP4 239.100.1.1 192.168.10.100
```

**Interprétation** :
- **Adresse multicast** : `239.100.1.1`
- **Port** : `5004`
- **Payload RTP** : `96`
- **Format** : 1920×1080, 10 bits, 4:2:2, BT709
- **Source** : `192.168.10.100`

### Exemple 2 : Flux audio (8 canaux, réseau rouge)

```
v=0
o=- 1234567891 1 IN IP4 192.168.10.100
s=Camera 01 - Audio (channels 1-8)
c=IN IP4 239.100.1.2/32
t=0 0
m=audio 5006 RTP/AVP 97
a=rtpmap:97 L24/48000/8
a=ptime:1
a=mediaclk:direct=0
a=source-filter: incl IN IP4 239.100.1.2 192.168.10.100
```

**Interprétation** :
- **Adresse multicast** : `239.100.1.2`
- **Port** : `5006`
- **Payload RTP** : `97`
- **Format** : L24 (PCM 24 bits), 48 kHz, 8 canaux
- **Ptime** : 1 ms par paquet

### Exemple 3 : Redondance SMPTE 2022-7 - Vidéo complète (rouge + bleu)

**Vidéo primaire (réseau rouge)** :
```
v=0
o=- 1234567890 1 IN IP4 192.168.10.100
s=Camera 01 - Video HD 1080p50 (Primary)
c=IN IP4 239.100.1.1/32
t=0 0
m=video 5004 RTP/AVP 96
a=rtpmap:96 raw/90000
a=fmtp:96 sampling=YCbCr-4:2:2; width=1920; height=1080; depth=10; colorimetry=BT709
a=mediaclk:direct=0
a=ts-refclk:ptp=IEEE1588-2008:00-1B-21-FF-FE-12-34-56:0
a=source-filter: incl IN IP4 239.100.1.1 192.168.10.100
```

**Vidéo secondaire (réseau bleu)** :
```
v=0
o=- 1234567890 1 IN IP4 192.168.20.100
s=Camera 01 - Video HD 1080p50 (Secondary)
c=IN IP4 239.200.1.1/32
t=0 0
m=video 5004 RTP/AVP 96
a=rtpmap:96 raw/90000
a=fmtp:96 sampling=YCbCr-4:2:2; width=1920; height=1080; depth=10; colorimetry=BT709
a=mediaclk:direct=0
a=ts-refclk:ptp=IEEE1588-2008:00-1B-21-FF-FE-12-34-56:0
a=source-filter: incl IN IP4 239.200.1.1 192.168.20.100
```

**Interprétation** :
- **Même Session ID** (`1234567890`) : Flux identiques
- **Adresses différentes** : Rouge `239.100.x.x`, Bleu `239.200.x.x`
- **IPs sources différentes** : Rouge `192.168.10.100`, Bleu `192.168.20.100`
- **PTP identique** : Synchronisation commune (`a=ts-refclk`)
- **Payload/Format identiques** : Receiver peut basculer seamless

### Exemple 4 : Redondance SMPTE 2022-7 - Audio complet (rouge + bleu)

**Audio primaire (réseau rouge)** :
```
v=0
o=- 1234567891 1 IN IP4 192.168.10.100
s=Camera 01 - Audio 8ch (Primary)
c=IN IP4 239.100.1.2/32
t=0 0
m=audio 5006 RTP/AVP 97
a=rtpmap:97 L24/48000/8
a=ptime:1
a=mediaclk:direct=0
a=ts-refclk:ptp=IEEE1588-2008:00-1B-21-FF-FE-12-34-56:0
a=source-filter: incl IN IP4 239.100.1.2 192.168.10.100
```

**Audio secondaire (réseau bleu)** :
```
v=0
o=- 1234567891 1 IN IP4 192.168.20.100
s=Camera 01 - Audio 8ch (Secondary)
c=IN IP4 239.200.1.2/32
t=0 0
m=audio 5006 RTP/AVP 97
a=rtpmap:97 L24/48000/8
a=ptime:1
a=mediaclk:direct=0
a=ts-refclk:ptp=IEEE1588-2008:00-1B-21-FF-FE-12-34-56:0
a=source-filter: incl IN IP4 239.200.1.2 192.168.20.100
```

**Interprétation** :
- **Adresse rouge** : `239.100.1.2`, **Adresse bleu** : `239.200.1.2`
- **Port identique** : `5006`
- **Payload identique** : `97` (L24 = PCM 24 bits)
- **8 canaux**, **48 kHz**, **ptime 1 ms**
- Les deux flux ont les **mêmes en-têtes RTP** (Sequence Number, Timestamp identiques) grâce à la référence PTP commune

**Principe SMPTE 2022-7** : Le receiver s'abonne **simultanément** aux deux flux (rouge ET bleu), bufferise les deux, et utilise le premier paquet arrivé. Si un réseau tombe, l'autre prend le relais instantanément (seamless).

## Transmission SDP

### Interface Control (SMPTE 2110)
Le SDP est transmis via le **réseau Control** :
- **HTTP** : `http://192.168.1.100:8080/camera01.sdp`
- **NMOS IS-05** : API REST (connexion receiver)
- **Fichier partagé** : NFS, SMB

### NMOS IS-05
Le contrôleur envoie le SDP au receiver via API :
```http
PATCH /receivers/{id}/target
{
  "transport_file": {
    "data": "v=0\no=...",
    "type": "application/sdp"
  }
}
```

Le receiver parse le SDP et s'abonne automatiquement aux flux multicast.

## Cas d'usage

### Broadcast IP (SMPTE 2110)
- Chaque sender expose un fichier SDP
- Receiver parse SDP pour connaître adresse/port/format
- Permet interopérabilité multi-fabricants

### VoIP (SIP)
- Session Initiation Protocol (SIP) transporte SDP
- Négociation codec entre appelant/appelé

### WebRTC
- Navigateurs échangent SDP via signaling server
- Décrit flux audio/vidéo peer-to-peer

### Streaming RTSP
- RTSP DESCRIBE retourne SDP
- Client connaît les flux disponibles

## Avantages / Inconvénients

✅ **Standard ouvert** : RFC 4566
✅ **Texte lisible** : Facile à débugger
✅ **Flexible** : Supporte vidéo, audio, métadonnées
✅ **Interopérable** : Multi-fabricants

❌ **Pas de signalisation active** : Juste description (pas de protocole transport)
❌ **Parsing complexe** : Format libre, variantes multiples
❌ **Pas de sécurité** : SDP non chiffré (peut contenir infos sensibles)

## Outils

### Génération SDP
- **FFmpeg** : Génère SDP pour flux RTP
  ```bash
  ffmpeg -re -i input.mp4 -f rtp rtp://239.1.1.1:5004 -sdp_file stream.sdp
  ```

### Validation SDP
- **SDP Parser online** : Outils web pour parser/valider
- **Wireshark** : Affiche SDP dans sessions RTSP/SIP

### Lecture SDP
- **VLC** : Peut lire flux depuis fichier SDP
  ```bash
  vlc stream.sdp
  ```

## Connexions

- [[RTP - Real-time Transport Protocol]] - Protocole décrit par SDP
- [[SMPTE 2110 - transport multimédia par IP]] - Utilise SDP
- [[NMOS - découverte équipements broadcast]] - Transmet SDP (IS-05)
- [[MULTICAST - diffusion groupe]] - Adresses décrites dans SDP

---
**Sources** : Formation Réseau - 2110, RFC 4566 (SDP)
