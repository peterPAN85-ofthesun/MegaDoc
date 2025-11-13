---
type: permanent
created: 2025-01-08 01:54
tags:
  - permanent
  - réseau
  - ttl
  - ip
---

# TTL - Time To Live

> [!abstract] Concept
> Le TTL est un compteur dans les paquets IP qui limite leur durée de vie sur le réseau.

## Explication

Le TTL empêche les paquets de tourner indéfiniment en cas de boucle de routage.

**Principe** :
1. Paquet créé avec TTL = 64 (ou 128, 255)
2. Chaque routeur traversé décrémente TTL de 1
3. Si TTL atteint 0, le paquet est détruit
4. Routeur envoie message ICMP "Time Exceeded"

## Valeurs typiques initiales

| OS | TTL initial |
|----|-----------:|
| Linux | 64 |
| Windows | 128 |
| Cisco | 255 |

## Utilité

**Éviter les boucles infinies** :
- Routage mal configuré
- Tables de routage incohérentes
- Empêche saturation du réseau

**Traceroute** :
- Utilise TTL croissant (1, 2, 3...)
- Chaque routeur répond quand TTL = 0
- Permet de tracer le chemin

## Exemple

```
Paquet part avec TTL = 64
Routeur 1 → TTL = 63
Routeur 2 → TTL = 62
...
Routeur 64 → TTL = 0 → ICMP Time Exceeded
```

## TTL vs Hop Limit

- **IPv4** : TTL (Time To Live)
- **IPv6** : Hop Limit (même concept, nom différent)

## Connexions

- [[ICMP - Internet Control Message Protocol]] - Message Time Exceeded
- [[traceroute - tracer route réseau]] - Utilise le TTL
- [[ROUTAGE - statique]] - Décrémente le TTL

---
**Sources** : [[J1 - Formation Réseau|Formation Réseau - Jour 1]], Glossaire
