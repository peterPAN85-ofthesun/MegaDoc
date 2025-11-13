---
type: permanent
created: 2025-01-08 16:21
tags:
  - permanent
  - réseau
  - routage
  - cisco
  - troubleshooting
---

# Routage Cisco - Vérification et dépannage

> [!abstract] Concept
> Commandes essentielles pour diagnostiquer et résoudre les problèmes de routage sur Cisco

## Explication

Le dépannage routage nécessite de vérifier :
1. **Table de routage** : routes présentes, next-hop, métriques
2. **Interfaces** : état up/down, adressage IP
3. **Connectivité** : ping, traceroute
4. **Configuration** : routes statiques configurées
5. **Chemins** : route réellement empruntée

Méthodologie : du plus simple (interfaces) au plus complexe (analyse paquets).

## Exemples

### Afficher la table de routage

```cisco
# Table complète
Router# show ip route

# Uniquement routes statiques
Router# show ip route static

# Uniquement routes connectées
Router# show ip route connected

# Route vers IP spécifique
Router# show ip route 192.168.10.0

# Routes d'un protocole
Router# show ip route ospf
Router# show ip route eigrp
```

**Format de sortie** :
```
C    192.168.1.0/24 is directly connected, GigabitEthernet0/1
S    192.168.10.0/24 [1/0] via 192.168.1.1
S*   0.0.0.0/0 [1/0] via 203.0.113.1
```

**C** : Connected, **S** : Static, **S*** : Static route par défaut

### Vérifier les interfaces

```cisco
# Résumé des interfaces
Router# show ip interface brief

# Détails interface
Router# show interfaces GigabitEthernet0/0

# Statistiques
Router# show interfaces GigabitEthernet0/0 | include errors
```

**États** :
- **up/up** : interface opérationnelle ✓
- **up/down** : Layer 1 OK, Layer 2 KO (protocole)
- **administratively down** : interface shutdown
- **down/down** : pas de câble ou câble défectueux

### Tests de connectivité

**Ping simple** :

```cisco
Router# ping 192.168.10.1
```

**Ping étendu (spécifier source)** :

```cisco
Router# ping
Protocol [ip]:
Target IP address: 192.168.10.1
Repeat count [5]:
Datagram size [100]:
Timeout in seconds [2]:
Extended commands [n]: y
Source address or interface: 192.168.1.10
```

**Traceroute (voir le chemin)** :

```cisco
Router# traceroute 192.168.10.1
```

Montre chaque routeur traversé jusqu'à la destination.

### Vérifier la configuration

```cisco
# Toutes les routes statiques
Router# show running-config | include ip route

# Section interfaces
Router# show running-config | section interface
```

### Résoudre : route manquante

**Symptôme** : `show ip route` ne montre pas la route

**Causes** :
1. Route jamais configurée
2. Next-hop injoignable (interface down)
3. Distance administrative trop élevée (route masquée par une autre)

**Vérification** :

```cisco
# Voir config
Router# show running-config | include ip route 192.168.10.0

# Vérifier next-hop
Router# show ip route 192.168.1.1

# Ping next-hop
Router# ping 192.168.1.1
```

### Résoudre : route présente mais ping échoue

**Symptôme** : route dans la table, mais ping échoue

**Causes** :
1. Routage retour manquant (asymétrique)
2. Firewall/ACL bloque le trafic
3. Interface destinataire down
4. Mauvais next-hop configuré

**Vérification** :

```cisco
# Traceroute pour voir où ça bloque
Router# traceroute 192.168.10.1

# Vérifier ACL
Router# show access-lists

# Vérifier interfaces du routeur distant (si accès)
```

### Déboguer le routage

```cisco
# Voir modifications table de routage
Router# debug ip routing

# Voir tous les paquets IP (ATTENTION: très verbeux)
Router# debug ip packet

# Arrêter debug
Router# undebug all
```

**Attention** : debug génère énormément de logs, impacte les performances. À utiliser **ponctuellement** sur réseau de test.

### Problèmes courants

| Symptôme | Cause probable | Diagnostic |
|----------|----------------|------------|
| Destination unreachable | Pas de route | `show ip route [IP]` |
| Ping OK du routeur, KO des PC | Pas de route retour | Vérifier routage sur routeur distant |
| Connexion intermittente | Route flapping | `show ip route` répété |
| Mauvais chemin emprunté | Mauvaise AD ou métrique | `show ip route` (voir AD) |
| Interface down | Shutdown ou câble | `show ip interface brief` |

### Méthodologie de dépannage

**Étape 1** : Vérifier couche physique

```cisco
Router# show ip interface brief
```

**Étape 2** : Vérifier table de routage

```cisco
Router# show ip route [destination]
```

**Étape 3** : Tester next-hop

```cisco
Router# ping [next-hop]
```

**Étape 4** : Vérifier connectivité end-to-end

```cisco
Router# ping [destination]
Router# traceroute [destination]
```

**Étape 5** : Vérifier configuration

```cisco
Router# show running-config | include ip route
```

**Étape 6** : Analyser avec debug (si nécessaire)

```cisco
Router# debug ip routing
```

### Commandes essentielles

```cisco
# Table de routage
show ip route
show ip route static
show ip route [IP]

# Interfaces
show ip interface brief
show interfaces [nom]

# Tests
ping [IP]
traceroute [IP]

# Configuration
show running-config | include ip route

# Debug
debug ip routing
debug ip packet
undebug all
```

## Connexions

### Notes liées
- [[Routage Cisco - Configuration de base]] - Routes statiques
- [[Routage Cisco - Distance administrative]] - Priorité des routes
- [[ROUTAGE - statique]] - Concept général
- [[ICMP - Internet Control Message Protocol]] - Protocole utilisé par ping
- [[TTL - Time To Live]] - Utilisé par traceroute

### Contexte
Commandes indispensables pour diagnostiquer les problèmes de connectivité réseau. À utiliser systématiquement lors de la mise en service ou du dépannage d'un réseau routé.

## Sources
- Formation Réseau - Dépannage routage
- Cisco IP Routing Troubleshooting

---
**Tags thématiques** : #troubleshooting #routage #show-commands #ping #traceroute
