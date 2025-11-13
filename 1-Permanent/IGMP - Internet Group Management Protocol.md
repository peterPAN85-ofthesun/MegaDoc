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

## Cas d'usage

- IPTV / Streaming vidéo
- Visioconférence multi-participants
- Mise à jour logicielle de masse
- Protocoles de routage (OSPF, EIGRP)

## Connexions

- [[MULTICAST - diffusion groupe]] - Concept général
- [[PIM - Protocol Independent Multicast]] - Routage multicast
- [[Classe D réseau]] - Adresses multicast

---
**Sources** : [[J1 - Formation Réseau|Formation Réseau - Jour 1]], Glossaire
