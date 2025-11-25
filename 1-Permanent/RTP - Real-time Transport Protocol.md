---
type: permanent
created: 2025-11-25 16:00
tags:
  - permanent
  - réseau
  - protocole
  - temps-réel
  - broadcast
source: "Formation Réseau - 2110"
---

# RTP - Real-time Transport Protocol

> [!abstract] Concept
> RTP (Real-time Transport Protocol) est un protocole de couche 5 (session) conçu pour le transport de flux audio/vidéo en temps réel sur réseau IP, utilisé notamment par SMPTE 2110 pour encapsuler les essences broadcast.

## Explication

**RTP** encapsule des flux **temps réel** (audio, vidéo) en paquets IP pour transmission sur réseau :
- **Pas de garantie de livraison** (comme UDP)
- **Optimisé pour latence faible** (priorité sur fiabilité)
- **Horodatage précis** des échantillons

**Couche OSI** : Couche 5 (Session)
**Transport sous-jacent** : UDP (couche 4)

## Structure d'un paquet RTP

### Header RTP (12 octets minimum)

| Champ | Taille | Description |
|-------|--------|-------------|
| **V** | 2 bits | Version (toujours 2) |
| **P** | 1 bit | Padding (remplissage) |
| **X** | 1 bit | Extension header présent |
| **CC** | 4 bits | Nombre de CSRC identifiers |
| **M** | 1 bit | **Marker Bit** (dernier paquet d'une frame) |
| **PT** | 7 bits | **Payload Type** (type de contenu) |
| **Sequence Number** | 16 bits | Numéro de séquence du paquet |
| **Timestamp** | 32 bits | Horodatage de l'échantillon |
| **SSRC** | 32 bits | Identifiant source synchrone |

### Champs critiques pour SMPTE 2110

#### Payload Type (PT)
Identifie le **type de flux** :
- **96** : Vidéo (SMPTE 2110-20)
- **97-98** : Audio (SMPTE 2110-30)
- **100** : Métadonnées (SMPTE 2110-40)

#### Sequence Number
- Numéro incrémental de **chaque paquet** (0 → 65535, puis reboucle)
- Permet au receiver de **détecter les pertes** et **réordonner** les paquets

**Exemple** :
```
Paquets reçus : 1001, 1002, 1004, 1003
Réordonné     : 1001, 1002, 1003, 1004
Perte détectée: Aucune
```

#### Marker Bit (M)
- **M=1** : Dernier paquet d'une **image vidéo complète**
- Permet au receiver de savoir quand il peut **afficher la frame**

**Exemple vidéo HD** :
```
Paquet 1 (M=0) ┐
Paquet 2 (M=0) │
...            ├─ 1 frame complète
Paquet N (M=0) │
Paquet N+1 (M=1) ┘ → Frame prête à afficher
```

#### Timestamp
- Horodatage de **l'échantillon média** (pas du paquet)
- Permet **synchronisation lip-sync** (audio/vidéo)
- **Extension 64 bits** pour précision nanoseconde (SMPTE 2110)

## RTP dans SMPTE 2110

### Encapsulation
```
[Vidéo/Audio brut] → [RTP Header] → [UDP] → [IP Multicast] → [Ethernet]
```

### Débit typique (vidéo HD 1080p)

**Calcul** :
```
Résolution : 1920 × 1080 pixels
FPS        : 25 images/seconde
Profondeur : 10 bits
Sampling   : 4:2:2 (Y + Cb/2 + Cr/2 = 2)

Débit = 1920 × 1080 × 25 × 10 × 2 = 1.037 Gbps
```

**Fragmentation RTP** :
- MTU Ethernet : 1500 octets
- Payload RTP max : ~1460 octets
- **Une image HD nécessite ~900 paquets RTP**

### Audio (SMPTE 2110-30)

**Format** : PCM non compressé
- 24 bits par échantillon
- 48 kHz
- Paquets de 1 ms (48 échantillons)

**Taille paquet** :
```
48 échantillons × 24 bits × 2 canaux = 288 octets + Header RTP
```

## Pourquoi UDP et pas TCP ?

### UDP (utilisé par RTP)
✅ **Latence faible** : Pas d'attente de retransmission
✅ **Temps réel** : Accepte les pertes (vieux paquets inutiles)
✅ **Broadcast/Multicast** : Compatible

### TCP (NON utilisé)
❌ **Latence variable** : Retransmissions bloquantes
❌ **Buffer accumulation** : Délais imprévisibles
❌ **Pas de multicast** : Unicast uniquement

**Philosophie** : En **temps réel**, un paquet perdu est **moins grave** qu'un paquet **en retard**.

## Gestion des erreurs

### FEC (Forward Error Correction)
- Ajout de paquets de **redondance** (SMPTE 2022-5)
- Permet de **reconstruire** paquets perdus
- **Trade-off** : +20% bande passante pour tolérer 10% pertes

### Buffering
- Receiver bufferise quelques ms pour **réordonner**
- **Trade-off** : Latence accrue vs tolérance jitter

## Vérification

### Wireshark
Filtre RTP :
```
rtp
```

**Statistiques RTP** :
- Telephony → RTP → Stream Analysis
- Affiche : pertes, jitter, latency

### Outils broadcast
- **Prism** : Analyse flux SMPTE 2110 (RTP)
- **Tektronix Sentry** : Monitoring RTP professionnel

## Cas d'usage

### Broadcast IP (SMPTE 2110)
- Transport vidéo/audio non compressé
- Précision horodatage (lip-sync)

### VoIP (Voice over IP)
- Téléphonie IP (SIP, H.323)
- Codecs : G.711, G.729, Opus

### Visioconférence
- Zoom, Teams, Webex
- Codecs : H.264, VP8, VP9

### Streaming (IPTV)
- Multicast IPTV opérateurs
- Unicast streaming (HLS, DASH encapsulent RTP)

## Protocoles associés

### RTCP (RTP Control Protocol)
- **Compagnon de RTP** (même session)
- Échange **statistiques** : pertes, jitter, QoS
- Permet **synchronisation** multi-flux (audio + vidéo)

### RTSP (Real Time Streaming Protocol)
- Contrôle session : Play, Pause, Stop
- Ne transporte PAS les données (RTP le fait)

## Avantages / Inconvénients

✅ **Temps réel** : Optimisé latence faible
✅ **Standardisé** : RFC 3550
✅ **Horodatage** : Synchronisation précise
✅ **Détection pertes** : Sequence numbers

❌ **Pas de fiabilité** : Pas de retransmission (UDP)
❌ **Complexité** : Gestion réordonnancement côté receiver
❌ **Pas de QoS natif** : Dépend du réseau sous-jacent

## Connexions

- [[SMPTE 2110 - transport multimédia par IP]] - Utilise RTP
- [[SDP - Session Description Protocol]] - Décrit sessions RTP
- [[NMOS - découverte équipements broadcast]] - Orchestre flux RTP
- [[MULTICAST - diffusion groupe]] - Transport réseau

---
**Sources** : Formation Réseau - 2110, RFC 3550 (RTP)
