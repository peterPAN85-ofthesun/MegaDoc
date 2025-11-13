---
type: permanent
created: 2025-01-08 16:57
tags:
  - permanent
  - réseau
  - nat
  - linux
  - iptables
  - port-forwarding
  - dnat
---

# NAT Linux - Port forwarding

> [!abstract] Concept
> Rediriger des ports externes vers serveurs internes avec iptables DNAT

## Explication

Le **port forwarding** (DNAT = Destination NAT) permet de rendre accessible un service interne depuis Internet en redirigeant un **port spécifique** de l'IP publique vers un serveur privé.

**Chaînes iptables** :
- **PREROUTING** (table nat) : translation IP/port
- **FORWARD** (table filter) : autorisation du trafic

**Format** :
```
Internet → IP_PUBLIQUE:PORT_EXTERNE → Routeur Linux → IP_PRIVEE:PORT_INTERNE
```

## Exemples

### Serveur web (HTTP/HTTPS)

```bash
# Port 80 → Serveur web 192.168.1.10:80
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80
iptables -A FORWARD -p tcp -d 192.168.1.10 --dport 80 -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT

# Port 443 → HTTPS
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j DNAT --to-destination 192.168.1.10:443
iptables -A FORWARD -p tcp -d 192.168.1.10 --dport 443 -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
```

**Résultat** : `http://IP_PUBLIQUE` redirige vers `http://192.168.1.10`

### SSH sur port custom

```bash
# Port externe 2222 → SSH interne 22
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 2222 -j DNAT --to-destination 192.168.1.20:22
iptables -A FORWARD -p tcp -d 192.168.1.20 --dport 22 -j ACCEPT
```

**Connexion** : `ssh -p 2222 user@IP_PUBLIQUE` → `192.168.1.20:22`

**Sécurité** : masquer le port SSH standard (22)

### Plusieurs services, même IP publique

```bash
# Serveur web 1 → port 80
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80

# Serveur web 2 → port 8080
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.20:80

# SSH serveur 1 → port 2222
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 2222 -j DNAT --to-destination 192.168.1.10:22

# SSH serveur 2 → port 2223
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 2223 -j DNAT --to-destination 192.168.1.20:22

# Autoriser forwards
iptables -A FORWARD -p tcp -d 192.168.1.10 -m multiport --dports 80,22 -j ACCEPT
iptables -A FORWARD -p tcp -d 192.168.1.20 -m multiport --dports 80,22 -j ACCEPT
```

**1 IP publique** pour 4 services différents (ports différents)

### Port forwarding UDP (serveur jeu)

```bash
# Minecraft (port UDP 25565)
iptables -t nat -A PREROUTING -i eth0 -p udp --dport 25565 -j DNAT --to-destination 192.168.1.30:25565
iptables -A FORWARD -p udp -d 192.168.1.30 --dport 25565 -j ACCEPT
```

### Redirection de plage de ports

```bash
# Ports 5000-6000 → Serveur VoIP
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 5000:6000 -j DNAT --to-destination 192.168.1.40
iptables -A FORWARD -p tcp -d 192.168.1.40 --dport 5000:6000 -j ACCEPT
```

### Script complet - Routeur avec port forwarding

```bash
#!/bin/bash

WAN_IF="eth0"
LAN_IF="eth1"

# Flush
iptables -F
iptables -t nat -F

# Politique
iptables -P FORWARD DROP

# IP Forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward

# ===== NAT (MASQUERADE) =====
iptables -t nat -A POSTROUTING -o $WAN_IF -j MASQUERADE

# ===== FORWARD LAN → WAN =====
iptables -A FORWARD -i $LAN_IF -o $WAN_IF -j ACCEPT
iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT

# ===== PORT FORWARDING (DNAT) =====
# Serveur web
iptables -t nat -A PREROUTING -i $WAN_IF -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80
iptables -t nat -A PREROUTING -i $WAN_IF -p tcp --dport 443 -j DNAT --to-destination 192.168.1.10:443

# SSH custom
iptables -t nat -A PREROUTING -i $WAN_IF -p tcp --dport 2222 -j DNAT --to-destination 192.168.1.20:22

# Autoriser forwards
iptables -A FORWARD -p tcp -d 192.168.1.10 -m multiport --dports 80,443 -j ACCEPT
iptables -A FORWARD -p tcp -d 192.168.1.20 --dport 22 -j ACCEPT

# Sauvegarder
iptables-save > /etc/iptables/rules.v4

echo "Routeur NAT + Port Forwarding configuré"
```

### Vérifier le port forwarding

```bash
# Voir règles DNAT
iptables -t nat -L PREROUTING -v -n --line-numbers

# Voir règles FORWARD
iptables -L FORWARD -v -n --line-numbers

# Compter paquets en temps réel
watch -n1 'iptables -t nat -L PREROUTING -v -n'

# Logs iptables
tail -f /var/log/syslog | grep iptables
```

### Tester depuis l'extérieur

```bash
# Depuis Internet (ou autre réseau)
curl http://IP_PUBLIQUE        # Doit afficher page web interne
ssh -p 2222 user@IP_PUBLIQUE   # Doit connecter au serveur interne
```

### Supprimer une redirection

```bash
# Lister avec numéros de ligne
iptables -t nat -L PREROUTING -v -n --line-numbers

# Supprimer ligne N
iptables -t nat -D PREROUTING N

# Supprimer par règle complète
iptables -t nat -D PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80
```

### Logs pour debug

```bash
# Logger les paquets DNAT
iptables -t nat -I PREROUTING -p tcp --dport 80 -j LOG --log-prefix "DNAT HTTP: "

# Voir les logs
tail -f /var/log/syslog | grep "DNAT HTTP"
```

### Hairpin NAT (accès interne via IP publique)

Problème : depuis le LAN, accéder au serveur via IP publique ne fonctionne pas.

**Solution** :

```bash
# Ajouter SNAT pour trafic interne → serveur interne via IP publique
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -d 192.168.1.10 -p tcp --dport 80 -j MASQUERADE
```

## Connexions

### Notes liées
- [[NAT - port forwarding]] - Concept général
- [[NAT Linux - iptables et NAT]] - SNAT/MASQUERADE
- [[NAT Cisco - Port forwarding]] - Équivalent Cisco
- [[NAT - Network Address Translation]] - Concept NAT

### Contexte
Port forwarding est la méthode standard pour exposer des services internes (web, SSH, jeux) sur Internet avec Linux. Plus sécurisé que NAT statique complet car seuls les ports spécifiés sont accessibles.

## Sources
- Formation Réseau - Port Forwarding Linux
- iptables DNAT Tutorial

---
**Tags thématiques** : #port-forwarding #dnat #iptables #redirection #linux
