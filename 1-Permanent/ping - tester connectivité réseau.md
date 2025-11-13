---
type: permanent
created: 2025-01-08 19:45
tags:
  - permanent
  - réseau
  - diagnostic
  - icmp
---

# Ping

> [!abstract] Concept
> Ping est un outil de diagnostic réseau qui teste la connectivité entre deux machines en envoyant des paquets ICMP Echo Request.

## Explication

Ping envoie des messages **ICMP Echo Request** et attend des **ICMP Echo Reply** pour vérifier :
- ✅ La machine cible est joignable
- ✅ Le réseau fonctionne
- ✅ Le temps de latence (RTT - Round Trip Time)

**Principe** :
```
[PC A] → ICMP Echo Request → [PC B]
[PC A] ← ICMP Echo Reply   ← [PC B]
```

## Utilisation

**Linux** :
```bash
ping 8.8.8.8                    # Ping continu (Ctrl+C pour arrêter)
ping -c 4 8.8.8.8               # 4 paquets seulement
ping -i 0.2 192.168.1.1         # Intervalle 0.2s entre paquets
ping -s 1000 192.168.1.1        # Taille paquet 1000 octets
```

**Windows** :
```cmd
ping 8.8.8.8                    # 4 paquets par défaut
ping -t 8.8.8.8                 # Ping continu
ping -n 10 8.8.8.8              # 10 paquets
```

**Cisco** :
```cisco
ping 8.8.8.8
ping 192.168.1.1 source GigabitEthernet0/0   ! Spécifier IP source
ping 10.0.0.1 repeat 100                     ! 100 paquets
```

## Interprétation des résultats

**Succès** :
```
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=15.2 ms
```
- `icmp_seq` : numéro séquence
- `ttl` : Time To Live restant
- `time` : latence aller-retour

**Échec** :
```
Request timeout                 # Pas de réponse (firewall, machine éteinte)
Destination host unreachable    # Pas de route vers destination
Network is unreachable          # Réseau injoignable
```

## Diagnostics courants

### Ping réussit
✅ Connectivité réseau OK
✅ Routage fonctionnel
✅ Machine cible active

### Ping échoue

**Timeout** :
- Machine éteinte ou inexistante
- Firewall bloque ICMP
- Problème réseau (câble, switch)

**Destination unreachable** :
- Pas de route dans la table de routage
- Gateway incorrecte
- VLAN isolation

**TTL exceeded** :
- Boucle de routage
- TTL trop faible

## Variations de ping

**Ping spécifique** :
```bash
ping -I eth0 192.168.1.1        # Interface source spécifique
ping -4 google.com               # Forcer IPv4
ping -6 google.com               # Forcer IPv6
fping 192.168.1.{1..254}        # Ping d'un range IP
```

**Tests avancés** :
```bash
# Test MTU (Maximum Transmission Unit)
ping -M do -s 1472 8.8.8.8      # Don't fragment, taille 1472

# Test de charge
ping -f 192.168.1.1             # Flood ping (root uniquement)
```

## Protocole sous-jacent

Ping utilise **ICMP** (Internet Control Message Protocol) :
- Type 8 : Echo Request (envoyé)
- Type 0 : Echo Reply (reçu)

## Limitations

❌ **Firewall** : Beaucoup de firewalls bloquent ICMP
❌ **Pas de garantie** : Ping OK ≠ service applicatif OK
❌ **Priorité basse** : Routeurs priorisent trafic de données sur ICMP

## Connexions

- [[ICMP - Internet Control Message Protocol]] - Protocole utilisé
- [[traceroute - tracer route réseau]] - Outil complémentaire (chemin réseau)
- [[TTL - Time To Live]] - Champ utilisé par ping
- [[Routage Cisco - Vérification et dépannage]] - Diagnostic réseau

---
**Sources** : RFC 792 (ICMP), man ping, Cisco IOS Documentation
