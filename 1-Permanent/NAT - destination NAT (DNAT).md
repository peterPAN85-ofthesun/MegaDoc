---
type: permanent
created: 2025-01-08 19:45
tags:
  - permanent
  - réseau
  - nat
  - linux
---

# DNAT - Destination NAT

> [!abstract] Concept
> DNAT (Destination NAT) modifie l'adresse IP destination d'un paquet, permettant de rediriger le trafic entrant vers un serveur interne.

## Explication

Le DNAT remplace l'IP publique destination par une IP privée, redirigeant le trafic vers un serveur interne. C'est l'équivalent du **port forwarding**.

**Flux** :
```
[Internet] → 203.0.113.1:80 → [Routeur DNAT] → 192.168.1.10:80 → [Serveur web privé]
             IP publique                       IP privée
```

**Le routeur traduit** :
- Destination : 203.0.113.1:80 → 192.168.1.10:80
- Source : conservée (IP du client Internet)

## Configuration Linux (iptables)

**Prérequis** : IP forwarding activé
```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
```

**Redirection de port (HTTP)** :
```bash
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80
```

**Redirection avec changement de port** :
```bash
# Port externe 8080 → Port interne 80
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.10:80
```

**Redirection multiple (plusieurs serveurs)** :
```bash
# HTTP → Serveur 1
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80

# HTTPS → Serveur 1
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j DNAT --to-destination 192.168.1.10:443

# SSH → Serveur 2
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 22 -j DNAT --to-destination 192.168.1.20:22
```

**Vérification** :
```bash
iptables -t nat -L PREROUTING -v -n
```

## Équivalent Cisco

Sur Cisco IOS, DNAT = **Port forwarding statique** :
```cisco
ip nat inside source static tcp 192.168.1.10 80 203.0.113.1 80
```

## DNAT vs SNAT

| Type | Modifie | Direction | Usage |
|------|---------|-----------|-------|
| **SNAT** | IP source | Sortant (inside → outside) | Clients accèdent à Internet |
| **DNAT** | IP destination | Entrant (outside → inside) | Internet accède à serveurs |

**Souvent combinés** :
1. Client Internet → DNAT → Serveur interne
2. Serveur répond → SNAT → Client Internet

## Chaînage PREROUTING

DNAT s'applique dans la chaîne **PREROUTING** (avant routage) :
```
Paquet arrive → PREROUTING (DNAT) → Routage → FORWARD (firewall) → POSTROUTING (SNAT) → Sortie
```

## Sécurité

⚠️ **DNAT expose un service** :
- Ajouter règles firewall (FORWARD chain)
- Limiter par IP source si possible
- Surveiller les logs

**Exemple avec firewall** :
```bash
# DNAT
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80

# Firewall : autoriser uniquement HTTP vers ce serveur
iptables -A FORWARD -p tcp -d 192.168.1.10 --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT
```

## Connexions

- [[NAT - port forwarding]] - Concept général
- [[NAT - Network Address Translation]] - Concept parent
- [[NAT - source NAT (SNAT)]] - NAT inverse (sortant)
- [[NAT Linux - Port forwarding]] - Configuration complète
- [[DMZ - Zone démilitarisée]] - Zone pour serveurs exposés

---
**Sources** : [[J2 - Formation Réseau|Formation Réseau - Jour 2]], iptables Documentation, Netfilter Documentation
