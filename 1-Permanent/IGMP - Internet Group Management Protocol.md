---
type: permanent
created: 2025-01-08 01:55
tags:
  - permanent
  - réseau
  - igmp
  - multicast
---

# IGMP - Internet Group Management Protocol

> [!abstract] Concept
> L'IGMP permet aux hôtes de s'abonner à des flux multicast (diffusion vers un groupe).

## Explication

Le multicast permet d'envoyer des données à plusieurs destinataires simultanément sans dupliquer le flux pour chacun.

**Modes de diffusion** :
- **Unicast** : 1 → 1 (un destinataire)
- **Broadcast** : 1 → Tous (tout le réseau)
- **Multicast** : 1 → Groupe (destinataires intéressés)

## Fonctionnement

1. Hôte veut recevoir flux multicast (ex: IPTV)
2. Hôte envoie message IGMP : "Je rejoins le groupe 224.1.1.1"
3. Routeur/Switch note l'abonnement
4. Flux multicast envoyé uniquement aux abonnés

## Adresses multicast

Plage IPv4 : **224.0.0.0 à 239.255.255.255** (Classe D)

Exemples :
- `224.0.0.1` : Tous les hôtes du sous-réseau
- `224.0.0.2` : Tous les routeurs
- `224.0.0.5` : OSPF
- `239.x.x.x` : Multicast privé

## Versions IGMP

- **IGMPv1** : Basique
- **IGMPv2** : Ajout "Leave Group"
- **IGMPv3** : Filtrage par source

## IGMP Snooping

**Problème** : Sur un switch L2, le trafic multicast est par défaut traité comme du broadcast (envoyé à tous les ports).

**Solution** : IGMP Snooping
- Le switch "écoute" les messages IGMP entre hôtes et routeur
- Apprend quels ports ont des abonnés aux groupes multicast
- Envoie trafic multicast uniquement vers ports concernés

**Configuration** (exemple switch L2) :
```cisco
ip igmp snooping
ip igmp snooping vlan 10
```

**Importance en broadcast IP (SMPTE 2110)** :
- Flux vidéo/audio non compressés = débits massifs (>1 Gbps)
- Sans snooping : saturation du réseau
- Avec snooping : flux uniquement vers équipements abonnés

## Cas d'usage

- **IPTV / Streaming vidéo**
- **Broadcast IP (SMPTE 2110)** : Transport vidéo/audio professionnel
- **Visioconférence multi-participants**
- **Mise à jour logicielle de masse**
- **Protocoles de routage** (OSPF, EIGRP)

## Connexions

- [[MULTICAST - diffusion groupe]] - Concept général
- [[PIM - Protocol Independent Multicast]] - Routage multicast
- [[MULTICAST Linux - client réception flux]] - Client s'abonnant à un flux
- [[MULTICAST Linux - bridge IGMP snooping]] - Switch L2 Linux avec IGMP snooping
- [[MULTICAST Linux - routeur PIM]] - Routeur Linux avec PIM daemon
- [[MULTICAST Cisco - switch IGMP snooping]] - Switch L2 Cisco avec IGMP snooping
- [[MULTICAST Cisco - routeur PIM]] - Routeur Cisco avec PIM Sparse Mode

---
**Sources** : [[J1 - Formation Réseau|Formation Réseau - Jour 1]], Glossaire
