---
type: permanent
created: 2025-01-08 01:56
tags:
  - permanent
  - réseau
  - nat
  - ports
---

# Port forwarding

> [!abstract] Concept
> Le port forwarding redirige un port externe (IP publique) vers une machine interne (IP privée).

## Explication

Aussi appelé **redirection de port** ou **DNAT** (Destination NAT), permet d'exposer un service interne sur Internet.

**Problème** :
- Réseau privé derrière NAT
- Serveur web interne (192.168.1.10)
- Comment y accéder depuis Internet ?

**Solution** :
```
Internet → IP publique:80 → Routeur NAT → 192.168.1.10:80
```

## Principe

Le routeur écoute sur un port externe et redirige vers IP:port interne :

| Port externe | IP:Port interne | Service |
|--------------|-----------------|---------|
| 80 | 192.168.1.10:80 | Web HTTP |
| 443 | 192.168.1.10:443 | Web HTTPS |
| 2222 | 192.168.1.20:22 | SSH |
| 3389 | 192.168.1.30:3389 | RDP |

## Port externe ≠ Port interne

Possibilité de mapper différents ports :
```
Port externe 8080 → Port interne 80
```

Avantage :
- Masquer le service réel
- Plusieurs services sur ports externes différents

## Différence avec PAT

**PAT** : Sortant (inside → outside)
- Clients internes accèdent à Internet

**Port Forwarding** : Entrant (outside → inside)
- Internet accède à serveur interne

## Sécurité

⚠️ **Exposition d'un service** :
- Ouvre une faille potentielle
- N'exposer que le strict nécessaire
- Utiliser ports non-standards
- Combiner avec firewall

## Connexions

- [[NAT - Network Address Translation]] - Concept parent
- [[PAT - Port Address Translation]] - Inverse (sortant)
- [[NAT - destination NAT (DNAT)]] - Nom Linux
- [[DMZ - Zone démilitarisée]] - Zone pour services exposés

**Configuration** :
- [[MOC - Réseau]]

---
**Sources** : Fiche NAT et PAT
