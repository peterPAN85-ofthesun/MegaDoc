2110 : norme publiée par SMPTE, transport multimédia par IP, opensource

# Contexte actuel :

SDI :
- 1 vidéo
- 16 audio
- 1.485 Gbits/s HD-SDI
- unidirectionnelle

| SDI                                  | Réseau                                     |
| ------------------------------------ | ------------------------------------------ |
| Commutation de circuit               | Commutation de paquets                     |
| connections statiques                | connexions dynamique (routage)             |
| bande passante garantie              | "Best Effort"                              |
| Déterministe                         | Probabiliste                               |
| Mono Signal "unidirectionnel"        | Multi SIgnal                               |
| synchrone                            | Asynchrone                                 |
| temps réel                           | Non temps réel / Jitter / reordering       |
| basse latence                        | Latence variable (dépend de l'utilisation) |
| pas (très peu) d'erreur (BER faible) | Perte de pacquets / FEC / Re-Tx            |
| Point à Point                        | "Any to any"                               |
|                                      |                                            |
|                                      |                                            |

Équipements pour faire la conversion : gateway

# Infrastructure Interface 2110

- Control LAN (admin, accessible par controler Broadcast comme VSM ou Cerebrom)
- Media LAN 1 (Réseau Rouge)
- Media LAN (Réseau Bleu)

Topologie Spine Leaf (Un cœur de réseau qui alimente des leaf)

Le controller Broadcast doit être interfacer par un orchestrator pour piloter le 2110
## Transport Multicast

>[!Claude]
>Développer comment intégrer une solution Multicast sur Linux et Cisco

Le 2110 se base sur un transport Broadcast

Sur un switch L2 - activer IGMP snooping !

Sdi -> séparation des essences audio/vidéos/méta-data (non-compressés)-> 1 flux par essences x 2 interfaces Medias

débit brut vidéo HD 4:2:2
1920 x 1080px x 25i/s x 10bits x ( 1 + 0.5 + 0.5 ) = 1.037Gb/s

débit brut audio
24bits x 48kHz

## Synchronisation

Problématique : la donnée "supression de trame "

### Commutation "no seamless"

Désabonnement du flux présent, puis abonnement à un autre flux

>[!Warning]
>Problème : à un instant t l'équipement se trouve sans flux 

### Commutation "seamless"

Attend d'être abonné au prochain flux pour se désabonner

>[!Warning]
>Lattence importante le temps de commuter

>[!Note]
>Un mélangeur s'abonne à plein de flux en même temps pour processer toutes les images en même temps

### Signal de synchro entre les equipements 2110

ST 2059 (PTP) : Précision à la nano-seconde (IEEE 1588)
2110 utilise PTPv2 (2008), pas compatibe avec PTPv1

La générateur de ref MASTER donne la référence temporelle au reste du réseau. Chaque générateur FOLLOWER ajuste son horloge et calcule le délai par rapport au MASTER

>[!Claude]
>Inclue un schéma du fonctionnement du PTP entre un MASTER et un FOLLOWER, avec les deux phases : le sync et le delay request

Pour désigner le MASTER -> **BMCA**
C'est un concours entre les machines pour désigner la plus fiable
 |  P1 
 |  Q 
 |  P2
 |  MAC
V
P1 et P2 sont renseignés par l'admin
Q est fourni par le constructeur, offre un meilleur score s'il le générateur et connecté au GPS
Si  on arrive à comparé l'adresse MAC, le MASTER sera celui avec l'adresse MAC la plus petite 

2059 - 2 : défini la fréquence des requêtes PTP  

Les switchs ajoutent de la latence 
- Ordinary Clock (DEFAULT)
- Transparent Clock (Le switch détermine le delay de traitement et l'incrémente dans la trame PTP) -> Problème, on ne peut pas sortir le transparent clockdu réseau
- BoundaryCLock (on synchronise les switchs indépendement les uns des autres, on assigne sur le switch port par port si c'est une interface MASTER ou SLAVE)

Supervision du PTP:
- Prism
- Cisco `show ptp corrections`

Dans des connexions entre deux structures 2110, on peut identifier deux domaines PTP distinct pour ne pas faire connecter deux générateurs MASTER 
## Orchestrator
2 Modes
- IGMP
- SDN
L'orchestrator doit découvrir tous les équipements sur le réseau à l'aide du protocole NMOS

(Cerebrum, VSM soul)
### NMOS (AMWA)

IS-04 Comment décrouvrir un équipement
IS-05 Comment se connecter à un équipement

Dans NMOS, un équipement correspond à un node, et peut être identifié comme un sender ou un receiver 


## Trame 2110

Fontionne à l'aide de RTP (RealTimeProtocole) -> L5

Header RTP

| DATA             | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| PT (PayLoadType) | ID du type de flux (96 -> vidéo, 97-98 -> audio, 100 -> data)    |
| SequenceNumber   | Numéro du pacquet                                                |
| M (Marquer Bit)  | Identifie le dernier paquet qui code une image                   |
| TimeStamp        | Horodatage (extension pour une précision à la nano seconde près) |
|                  |                                                                  |

L4 -> UDP (sans vérification de la validité du transfert de la trame)
UDP permet une optimisation de la lattence. Celà implique que l'infrastructure réseau soit fiable

Rappel : TCP verifie que la trame a été correctement transféré au destinataire

Chaque flux est identifié par un champ au format **SDP** , transféré par l'interface CONTROL du 2110, qui donne les caractéristiques de la source:
- quelle adresse Multicast
- quel port
- le type de la source (vidéo, son, data)

>[!Claude]
>Donner deux exemples (vidéo et son) de texte au format SDP avec description des informations dans le contexte d'un flux 2110 avec deux interfaces réseaux fonctionnelles (réseau rouge et bleu)

# SMPTE 2022

le 2110 hérite de la documentation 4 et 7 de la SMPTE 2022

## 2022 - 6

Transport de la trame SDI sur IP

>[!Avantage]
>Liaison synchrone

>[!Désaventage]
>On ne peux pas séparer les essences (problèmes hérité du flux sdi)

## 2022 - 7

Description de la redondance (réseau rouge et bleu) et des flux synchronisés sur les deux réseaux (mêmes en-tête rtp, mais sur des adresses IP/MAC différentes)

En réception l'équipement reçoit les deux réseaux simultanément garantissant la qualité de service en cas de coupure

# SMPTE 2110

## 2110 - 10
décris le transport en RTP


## 2110 - 20
transport de vidéo non compressé
seulement la partie active de l'image
définition des images jusqu'à 32K x 32K
Supports YCbCr, RGB, XYZ, ICtCp
Supports 4:2:2/10, 4:2:2/12, ... 4:4:4/16, 4:2:0/12, KEY/16

## 2110 - 21
Technologie d'encapsulation et de transport

3 types de récepteur/emetteurs
- Type NL (NarowLinear) envoie de manière régulièrement les paquets **Faible buffer**
- Type N (Narow) envoie les paquets quand il en a envoyer. Ex une image HD, il y a des lignes utiles et d'autres non, l'équipement N n'enverra pas les lignes  inutiles
- Type W, pas de logique,**GRAND BUFFER**

|            | N/NL | W   | Emetteurs |
| ---------- | ---- | --- | --------- |
| N/NL       | V    | X   |           |
| W          | V    | V   |           |
| Récepteurs |      |     |           |

## 2110 - 22
décris la capacité de compression de la vidéo en JPEG XS


## 2110 - 30
décris l'audio non compressé (PCM)
Basé sur AES67
Taille d'un paquet = 1460 octets

pour augmenter le débit, on peut réduire la latence entre les paquets. En augmentant les débits on peut augmenter le nombre de canaux

3 profils :
- 1ms, 48kHz, 8 canaux
- 1ms, 24kHz, 16 canaux
- 125micro-seconde, 48kHz, 64 canaux

## 2110 - 31
décris l'audio compressé (AES3)

### 2110 - 40, 41, 43
métadata
sous titrage, atmos...

2110 - 43 -> TTML (basé sur XML)
Meilleur indexation des données pour le sous-titrage

