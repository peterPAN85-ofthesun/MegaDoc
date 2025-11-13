---
type: permanent
created: 2025-01-08 16:06
tags:
  - permanent
  - réseau
  - nat
  - cisco
  - port-forwarding
---

# NAT Cisco - Port forwarding

> [!abstract] Concept
> Rediriger un port externe (IP publique) vers un serveur interne (IP privée + port)

## Explication

Le **port forwarding** (redirection de ports) permet de rendre accessible un service interne depuis Internet en redirigeant un **port spécifique** de l'IP publique vers un serveur privé.

**Différence vs NAT statique** :
- **NAT statique** : translation de TOUS les ports (serveur entièrement exposé)
- **Port forwarding** : translation d'UN SEUL port (plus sécurisé)

**Cas d'usage** :
- Serveur web interne accessible sur port 80/443
- SSH sur port custom (ex: 2222)
- Serveur de jeux (ports UDP)
- Caméras IP
- NAS accessible à distance

**Avantage** : plusieurs serveurs peuvent partager la même IP publique (ports différents).

## Exemples

### Serveur web (HTTP/HTTPS)

```cisco
# Port 80 (HTTP) → Serveur web 192.168.1.10
Router(config)# ip nat inside source static tcp 192.168.1.10 80 203.0.113.1 80

# Port 443 (HTTPS)
Router(config)# ip nat inside source static tcp 192.168.1.10 443 203.0.113.1 443
```

**Résultat** : `http://203.0.113.1` → `http://192.168.1.10`

### SSH sur port custom

```cisco
# Port externe 2222 → SSH interne (port 22)
Router(config)# ip nat inside source static tcp 192.168.1.20 22 203.0.113.1 2222
```

**Connexion** : `ssh -p 2222 user@203.0.113.1` → `192.168.1.20:22`

**Sécurité** : masquer le port SSH standard (22)

### Plusieurs services, même IP publique

```cisco
# Serveur web 1 → port 80
Router(config)# ip nat inside source static tcp 192.168.1.10 80 203.0.113.1 80

# Serveur web 2 → port 8080
Router(config)# ip nat inside source static tcp 192.168.1.20 80 203.0.113.1 8080

# SSH serveur 1 → port 2222
Router(config)# ip nat inside source static tcp 192.168.1.10 22 203.0.113.1 2222

# SSH serveur 2 → port 2223
Router(config)# ip nat inside source static tcp 192.168.1.20 22 203.0.113.1 2223
```

**1 seule IP publique** pour 4 services différents

### Port forwarding UDP (serveur jeu)

```cisco
# Serveur Minecraft (port UDP 25565)
Router(config)# ip nat inside source static udp 192.168.1.30 25565 203.0.113.1 25565
```

### Configuration complète

```cisco
# Interfaces
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip address 203.0.113.1 255.255.255.248
Router(config-if)# ip nat outside
Router(config-if)# exit

Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip address 192.168.1.254 255.255.255.0
Router(config-if)# ip nat inside
Router(config-if)# exit

# Port forwarding
Router(config)# ip nat inside source static tcp 192.168.1.10 80 203.0.113.1 80
Router(config)# ip nat inside source static tcp 192.168.1.10 443 203.0.113.1 443

Router(config)# end
Router# write memory
```

### Vérification

```cisco
# Voir translations
Router# show ip nat translations

# Filtrer par protocole
Router# show ip nat translations | include tcp

# Voir la config
Router# show running-config | include nat
```

**Sortie type** :
```
tcp 203.0.113.1:80    192.168.1.10:80    ---               ---
tcp 203.0.113.1:443   192.168.1.10:443   ---               ---
tcp 203.0.113.1:2222  192.168.1.20:22    ---               ---
```

### Retirer port forwarding

```cisco
Router(config)# no ip nat inside source static tcp 192.168.1.10 80 203.0.113.1 80
```

## Connexions

### Notes liées
- [[NAT - port forwarding]] - Concept général
- [[NAT Cisco - NAT statique]] - Translation 1:1 complète
- [[NAT Cisco - Configuration interfaces]] - Inside/outside
- [[NAT - Network Address Translation]] - Concept NAT/PAT

### Contexte
Port forwarding est la méthode standard pour exposer des services internes sur Internet tout en économisant les IP publiques. Plus sécurisé que NAT statique car seuls les ports spécifiés sont accessibles.

## Sources
- Formation Réseau - Port Forwarding
- Cisco Static NAT with Port Translation

---
**Tags thématiques** : #port-forwarding #redirection #nat #serveur
