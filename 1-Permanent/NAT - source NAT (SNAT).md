---
type: permanent
created: 2025-01-08 19:45
tags:
  - permanent
  - réseau
  - nat
  - linux
---

# SNAT - Source NAT

> [!abstract] Concept
> SNAT (Source NAT) modifie l'adresse IP source d'un paquet, permettant aux machines d'un réseau privé d'accéder à Internet via une IP publique.

## Explication

Le SNAT remplace l'IP privée source par une IP publique lors de la sortie vers Internet.

**Flux** :
```
[PC privé] 192.168.1.10:5234 → [Routeur SNAT] → 203.0.113.1:1024 → [Internet]
           IP privée                           IP publique
```

**Table de translation** :
Le routeur mémorise :
| IP privée:Port | IP publique:Port | Destination |
|----------------|------------------|-------------|
| 192.168.1.10:5234 | 203.0.113.1:1024 | 8.8.8.8:53 |

Pour retransmettre la réponse au bon PC.

## SNAT vs MASQUERADE (Linux)

### SNAT
- IP publique **fixe**
- Plus performant (pas de lookup IP)
- Usage : serveur avec IP statique

```bash
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j SNAT --to-source 203.0.113.1
```

### MASQUERADE
- IP publique **dynamique** (DHCP)
- Moins performant (lookup IP à chaque paquet)
- Usage : box Internet, connexions DHCP

```bash
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j MASQUERADE
```

## Configuration Linux (iptables)

**Prérequis** : Activer IP forwarding
```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
# Permanent : /etc/sysctl.conf
net.ipv4.ip_forward = 1
```

**SNAT avec IP fixe** :
```bash
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j SNAT --to-source 203.0.113.1
```

**MASQUERADE (IP dynamique)** :
```bash
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j MASQUERADE
```

**Vérification** :
```bash
iptables -t nat -L -v -n
```

## Équivalent Cisco

Sur Cisco IOS, SNAT = **NAT Overload** ou **PAT** :
```cisco
ip nat inside source list 1 interface GigabitEthernet0/1 overload
```

## Comparaison avec DNAT

| Type | Modifie | Direction | Usage |
|------|---------|-----------|-------|
| **SNAT** | IP source | Sortant (inside → outside) | Accès Internet |
| **DNAT** | IP destination | Entrant (outside → inside) | Port forwarding |

## Connexions

- [[NAT - Network Address Translation]] - Concept parent
- [[PAT - Port Address Translation]] - Équivalent (avec ports)
- [[NAT - destination NAT (DNAT)]] - NAT inverse (entrant)
- [[NAT Linux - iptables et NAT]] - Configuration complète

---
**Sources** : [[J2 - Formation Réseau|Formation Réseau - Jour 2]], iptables Documentation, RFC 3022
