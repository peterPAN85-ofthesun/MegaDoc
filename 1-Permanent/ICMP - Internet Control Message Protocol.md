---
type: permanent
created: 2025-01-08 01:53
tags:
  - permanent
  - réseau
  - icmp
  - protocole
---

# ICMP - Internet Control Message Protocol

> [!abstract] Concept
> L'ICMP transmet des messages de contrôle et d'erreur sur les réseaux IP (ping, erreurs réseau).

## Explication

ICMP n'est pas utilisé pour transférer des données, mais pour :
- Tester la connectivité (**ping**)
- Signaler des erreurs réseau
- Diagnostiquer les problèmes

**Protocole de la couche 3** (réseau) du modèle OSI.

## Messages ICMP courants

| Type | Message | Usage |
|------|---------|-------|
| **0** | Echo Reply | Réponse au ping |
| **3** | Destination Unreachable | Hôte/réseau inaccessible |
| **5** | Redirect | Meilleure route disponible |
| **8** | Echo Request | Requête ping |
| **11** | Time Exceeded | TTL expiré (traceroute) |

## Ping (Echo Request/Reply)

```bash
ping 8.8.8.8
```

1. Envoie **Echo Request** (Type 8)
2. Reçoit **Echo Reply** (Type 0)
3. Mesure le temps de réponse (RTT)

## Traceroute / Tracert

Utilise **Time Exceeded** (Type 11) :
- Envoie paquets avec TTL croissant
- Chaque routeur décrémente TTL
- Routeur renvoie ICMP Time Exceeded quand TTL = 0
- Permet de tracer le chemin

## Pas de numéro de port

ICMP n'utilise pas de ports (protocole IP direct).

## Sécurité

Certains firewalls bloquent ICMP :
- Empêche le ping
- Réduit la visibilité réseau
- Compromis : sécurité vs diagnostic

## Connexions

- [[TTL - Time To Live]] - Utilisé par ICMP
- [[ping - tester connectivité réseau]] - Outil basé sur ICMP
- [[traceroute - tracer route réseau]] - Diagnostic de route

---
**Sources** : [[J1 - Formation Réseau|Formation Réseau - Jour 1]], Glossaire
