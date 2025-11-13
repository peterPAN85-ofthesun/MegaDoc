---
type: permanent
created: 2025-01-08 16:17
tags:
  - permanent
  - réseau
  - routage
  - cisco
  - avancé
---

# Routage Cisco - Routes statiques avancées

> [!abstract] Concept
> Techniques avancées de routage statique : routes de secours, load balancing, routes NULL, routes permanentes

## Explication

Au-delà du routage statique basique, Cisco offre des fonctionnalités avancées :
- **Floating static routes** : routes de secours activées si la route principale tombe
- **Load balancing** : répartir le trafic sur plusieurs chemins
- **Routes NULL (Blackhole)** : supprimer le trafic vers certains réseaux
- **Routes permanentes** : garder la route même si l'interface tombe

Ces techniques permettent la **redondance** et le **contrôle fin** du routage.

## Exemples

### Routes de secours (Floating Static Routes)

```cisco
# Route principale (AD = 1 par défaut)
Router(config)# ip route 10.0.0.0 255.0.0.0 192.168.1.1

# Route de secours (AD = 10)
Router(config)# ip route 10.0.0.0 255.0.0.0 192.168.1.2 10
```

**Principe** : la route avec AD=10 n'est utilisée que si la route principale (AD=1) est indisponible.

**Cas d'usage** : double liaison ISP (Internet principal + backup)

```cisco
# ISP principal
Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1

# ISP backup (utilisé si principal tombe)
Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.5 10
```

### Load balancing (répartition de charge)

```cisco
# Deux routes vers même réseau, même AD
Router(config)# ip route 10.0.0.0 255.0.0.0 192.168.1.1
Router(config)# ip route 10.0.0.0 255.0.0.0 192.168.1.2
```

**Résultat** : Cisco répartit le trafic entre les deux chemins (round-robin ou per-destination).

**Condition** : les deux routes doivent avoir la **même distance administrative** et **même métrique**.

**Cas d'usage** : double liaison vers un datacenter

### Route NULL (Blackhole)

```cisco
Router(config)# ip route 192.168.99.0 255.255.255.0 Null0
```

**Effet** : tout le trafic vers 192.168.99.0/24 est **supprimé** (pas de réponse ICMP).

**Cas d'usage** :
- Bloquer des réseaux malveillants
- Empêcher le routage vers des plages IP non utilisées
- Sécurité (drop silencieux)

**Exemple sécurité** :

```cisco
# Bloquer plages privées sur interface WAN
Router(config)# ip route 10.0.0.0 255.0.0.0 Null0
Router(config)# ip route 172.16.0.0 255.240.0.0 Null0
Router(config)# ip route 192.168.0.0 255.255.0.0 Null0
```

### Route permanente

```cisco
Router(config)# ip route 192.168.10.0 255.255.255.0 192.168.1.1 permanent
```

**Effet** : la route reste dans la table même si l'interface next-hop tombe.

**Attention** : peut créer des **black holes** (trafic perdu si le chemin est réellement down). À utiliser avec précaution.

### Route avec interface + next-hop

```cisco
Router(config)# ip route 172.16.0.0 255.255.0.0 GigabitEthernet0/0 192.168.1.1
```

**Avantages** :
- Plus rapide (évite lookup ARP)
- Utile sur réseaux multi-accès (Ethernet)
- Combine précision (interface) et clarté (next-hop)

### Configuration complète - Redondance ISP

```cisco
# Interface ISP principal
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip address 203.0.113.2 255.255.255.252
Router(config-if)# no shutdown
Router(config-if)# exit

# Interface ISP backup
Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip address 198.51.100.2 255.255.255.252
Router(config-if)# no shutdown
Router(config-if)# exit

# Route par défaut principale (ISP 1)
Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1

# Route de secours (ISP 2)
Router(config)# ip route 0.0.0.0 0.0.0.0 198.51.100.1 10

# Bloquer RFC1918 sur WAN (sécurité)
Router(config)# ip route 10.0.0.0 255.0.0.0 Null0
Router(config)# ip route 172.16.0.0 255.240.0.0 Null0
Router(config)# ip route 192.168.0.0 255.255.0.0 Null0

Router(config)# end
Router# write memory
```

### Vérification

```cisco
# Voir routes avec métriques
Router# show ip route

# Tester failover (simuler panne)
Router(config)# interface GigabitEthernet0/0
Router(config-if)# shutdown

# Vérifier basculement
Router# show ip route 0.0.0.0
```

La route de secours (AD=10) devrait apparaître.

## Connexions

### Notes liées
- [[Routage Cisco - Configuration de base]] - Routes statiques simples
- [[Routage Cisco - Distance administrative]] - Priorité des routes
- [[ROUTAGE - statique]] - Concept général
- [[Routage Cisco - Vérification et dépannage]] - Tests et diagnostic

### Contexte
Techniques avancées pour améliorer la **résilience** (floating static) et les **performances** (load balancing) du réseau. Routes NULL utiles pour la **sécurité** en bloquant le trafic malveillant.

## Sources
- Formation Réseau - Routage statique avancé
- Cisco Advanced Static Routing

---
**Tags thématiques** : #routage-avancé #floating-static #load-balancing #null-route #redondance
