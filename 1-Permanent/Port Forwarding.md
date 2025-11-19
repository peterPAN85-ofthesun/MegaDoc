---
type: permanent
created: 2025-11-16 14:45
tags:
  - réseau
  - nat
  - routage
---

# Port Forwarding

Le **Port Forwarding** (redirection de port) est une technique réseau qui permet de rediriger le trafic d'un port spécifique vers un hôte et un port différents sur un réseau local.

## Principe

Lorsqu'un routeur reçoit une requête sur un port public spécifique, il la redirige automatiquement vers une machine et un port du réseau local (LAN).

## Exemple concret

```
Internet → Routeur (IP publique:80) → Serveur Web local (192.168.1.100:8080)
```

## Cas d'usage

- Héberger un serveur web accessible depuis Internet
- Accéder à distance à un système via SSH
- Héberger des serveurs de jeux
- Configuration de caméras IP

## Lien avec NAT

Le Port Forwarding fonctionne en conjonction avec [[NAT - Network Address Translation]] pour permettre l'accès depuis l'extérieur à des services internes.

## Sécurité

⚠️ Attention : Ouvrir des ports expose des services au réseau public. Toujours :
- Utiliser des mots de passe forts
- Limiter les ports ouverts au strict nécessaire
- Configurer des règles de firewall appropriées
