---
type: permanent
created: 2026-08-11 00:00
tags:
  - permanent
  - réseau
  - routage
  - ip
---

# Route par défaut

> [!abstract] Concept
> La route par défaut (0.0.0.0/0) est une route « attrape-tout » utilisée pour tout le trafic qui ne correspond à aucune autre entrée de la table de routage.

## Explication

Quand un routeur reçoit un paquet, il cherche dans sa [[Table de routage]] la route la plus spécifique correspondant à l'IP de destination. Si aucune route explicite ne correspond, la route par défaut prend le relais — à condition qu'elle existe.

On l'appelle aussi *gateway of last resort*. C'est typiquement la route utilisée pour envoyer tout le trafic sortant vers Internet, via la passerelle du fournisseur d'accès.

## Exemples

```
0.0.0.0/0 via 192.168.1.254
```

Se lit : « Tout ce que je ne connais pas → envoyer à 192.168.1.254 »

Configuration Cisco :
```
ip route 0.0.0.0 0.0.0.0 192.168.1.254
```

Configuration Linux :
```
ip route add default via 192.168.1.254
```

## Cas d'usage

- Connexion d'un réseau local à Internet via une box/routeur unique
- Simplification de la table de routage : évite de lister toutes les destinations possibles
- Combinée avec du [[NAT - Network Address Translation|NAT]] pour permettre l'accès Internet depuis des IP privées ([[RFC 1918 - adressage IP privé]])

## Connexions

### Notes liées
- [[Table de routage]] - Contient la route par défaut comme entrée particulière
- [[ROUTAGE - statique]] - Type de route le plus souvent utilisé pour la route par défaut
- [[NAT - Network Address Translation]] - Souvent associée pour l'accès Internet

### Contexte
Concept simple mais essentiel : presque tous les réseaux domestiques et d'entreprise reposent sur une route par défaut pour leur connectivité Internet.

## Sources
- [[ROUTAGE - statique]]

---
**Tags thématiques** : #réseau #routage #ip
