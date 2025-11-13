---
type: permanent
created: 2025-01-08 16:19
tags:
  - permanent
  - réseau
  - routage
  - cisco
  - distance-administrative
---

# Routage Cisco - Distance administrative

> [!abstract] Concept
> Métrique de priorité utilisée par Cisco pour choisir entre plusieurs routes vers la même destination

## Explication

La **distance administrative (AD)** est une valeur de **0 à 255** qui indique la **fiabilité** d'une source de routage. Plus l'AD est **faible**, plus la route est **prioritaire**.

**Utilité** : quand plusieurs protocoles offrent des routes vers le même réseau, le routeur choisit celle avec l'AD la plus basse.

**Exemple** : si OSPF (AD=110) et RIP (AD=120) proposent une route vers 10.0.0.0/8, c'est la route OSPF qui sera choisie.

## Exemples

### Valeurs par défaut

| Source de routage | Distance administrative (AD) |
|-------------------|------------------------------|
| **Interface connectée** | 0 |
| **Route statique** | 1 |
| **EIGRP summary route** | 5 |
| **eBGP** | 20 |
| **EIGRP (interne)** | 90 |
| **IGRP** | 100 |
| **OSPF** | 110 |
| **IS-IS** | 115 |
| **RIP** | 120 |
| **EIGRP (externe)** | 170 |
| **iBGP** | 200 |
| **Route inconnue** | 255 (ignorée) |

**Règle** : AD=0 (connecté) > AD=1 (statique) > AD=90 (EIGRP) > AD=110 (OSPF) > AD=120 (RIP)

### Modifier l'AD d'une route statique

```cisco
# Route avec AD par défaut (1)
Router(config)# ip route 10.0.0.0 255.0.0.0 192.168.1.1

# Route avec AD custom (50)
Router(config)# ip route 10.0.0.0 255.0.0.0 192.168.1.2 50
```

Si les deux routes existent, celle avec AD=1 sera choisie (plus prioritaire).

### Floating static route (route de secours)

```cisco
# Route principale via ISP 1 (AD=1)
Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1

# Route de secours via ISP 2 (AD=10)
Router(config)# ip route 0.0.0.0 0.0.0.0 198.51.100.1 10
```

**Principe** : la route avec AD=10 n'entre dans la table de routage que si la route principale (AD=1) disparaît.

### Priorité statique > dynamique

```cisco
# Route statique (AD=1)
Router(config)# ip route 192.168.10.0 255.255.255.0 192.168.1.1

# OSPF apprend aussi 192.168.10.0/24 (AD=110)
```

**Résultat** : la route **statique** (AD=1) est choisie, la route OSPF est ignorée.

**Utilité** : forcer un chemin spécifique même si un protocole dynamique propose un autre chemin.

### Exemple : Préférer EIGRP à OSPF

Configuration par défaut :
- EIGRP : AD=90
- OSPF : AD=110

EIGRP sera **toujours préféré** à OSPF si les deux proposent la même route.

### Vérification AD dans la table de routage

```cisco
Router# show ip route
```

**Sortie type** :
```
C    192.168.1.0/24 is directly connected, GigabitEthernet0/1
S    192.168.10.0/24 [1/0] via 192.168.1.1
O    10.0.0.0/8 [110/20] via 192.168.1.2
D    172.16.0.0/16 [90/2560] via 192.168.1.3
```

**Format** : `[AD/métrique]`
- `[1/0]` : AD=1, métrique=0 (route statique)
- `[110/20]` : AD=110, métrique=20 (OSPF)
- `[90/2560]` : AD=90, métrique=2560 (EIGRP)

### Modifier l'AD d'un protocole (global)

**Attention** : rarement recommandé, peut créer des boucles.

```cisco
# Modifier AD de OSPF (par défaut 110 → 115)
Router(config)# router ospf 1
Router(config-router)# distance 115
```

### Bloquer une route dynamique

```cisco
# Augmenter AD à 255 (ignoré)
Router(config)# ip route 10.0.0.0 255.0.0.0 Null0 255
```

Route jamais insérée dans la table.

## Connexions

### Notes liées
- [[Routage Cisco - Configuration de base]] - Routes statiques
- [[Routage Cisco - Routes statiques avancées]] - Floating static routes
- [[ROUTAGE - statique]] - Concept général
- [[Routage Cisco - Vérification et dépannage]] - Voir AD dans show ip route

### Contexte
La distance administrative est essentielle pour comprendre pourquoi une route est choisie plutôt qu'une autre. Critique lors de l'utilisation de **plusieurs protocoles de routage** ou pour configurer des **routes de secours**.

## Sources
- Formation Réseau - Distance administrative
- Cisco Administrative Distance

---
**Tags thématiques** : #distance-administrative #priorité #routage #métrique
