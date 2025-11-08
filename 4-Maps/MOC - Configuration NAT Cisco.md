---
type: moc
created: 2025-01-08 01:43
tags:
  - moc
  - cisco
  - nat
  - configuration
---

# 🗺️ MOC - Configuration NAT Cisco

> [!note] Guide de référence
> Configuration complète du NAT et PAT sur routeurs Cisco IOS.

## 📚 Concept

Voir [[NAT - Network Address Translation]] pour le concept général.

---

## Étapes de configuration

1. Définir les interfaces Inside (réseau privé) et Outside (Internet)
2. Configurer le type de NAT (statique, dynamique, PAT)
3. Créer les règles de translation

## Définition des interfaces

```cisco
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip nat outside      # Interface WAN (Internet)
Router(config-if)# exit

Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip nat inside       # Interface LAN (réseau privé)
Router(config-if)# exit
```

>[!tip]
>Toute interface connectée au réseau privé = `ip nat inside`
>Interface vers Internet = `ip nat outside`

---

## NAT Statique (1:1)

**Cas d'usage** : Serveur web interne accessible avec IP publique dédiée.

```cisco
# Serveur 192.168.1.10 → IP publique 203.0.113.10
Router(config)# ip nat inside source static 192.168.1.10 203.0.113.10
```

**Résultat** : Translation bidirectionnelle permanente.

---

## NAT Dynamique (Pool)

**Cas d'usage** : Plusieurs utilisateurs avec pool d'IP publiques.

```cisco
# ACL pour définir les IP à traduire
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255

# Pool d'adresses publiques
Router(config)# ip nat pool PUBLIC_POOL 203.0.113.10 203.0.113.20 netmask 255.255.255.0

# Lier l'ACL au pool
Router(config)# ip nat inside source list 1 pool PUBLIC_POOL
```

**Limitation** : 11 connexions max (taille du pool).

---

## PAT / NAT Overload (N:1)

**Cas d'usage** : Partager 1 IP publique pour tout le réseau.

```cisco
# ACL pour le réseau
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255

# PAT avec l'IP de l'interface outside
Router(config)# ip nat inside source list 1 interface GigabitEthernet0/0 overload
```

>[!important]
>Le mot-clé **overload** active le PAT.

---

## Port Forwarding

**Cas d'usage** : Rediriger port externe vers serveur interne.

```cisco
# Port 80 → Serveur web
Router(config)# ip nat inside source static tcp 192.168.1.10 80 203.0.113.1 80

# Port 443 → HTTPS
Router(config)# ip nat inside source static tcp 192.168.1.10 443 203.0.113.1 443

# Port externe 2222 → SSH interne 22
Router(config)# ip nat inside source static tcp 192.168.1.20 22 203.0.113.1 2222
```

---

## Vérification

```cisco
# Translations actives
Router# show ip nat translations

# Statistiques
Router# show ip nat statistics

# Configuration NAT
Router# show running-config | include nat

# Compter translations
Router# show ip nat translations | count
```

---

## Dépannage

```cisco
# Debug (ATTENTION en production!)
Router# debug ip nat
Router# debug ip nat detailed

# Supprimer translations dynamiques
Router# clear ip nat translation *

# Supprimer translation spécifique
Router# clear ip nat translation inside 192.168.1.10
```

---

## Timeouts

```cisco
# Timeout général (300s = 5 min)
Router(config)# ip nat translation timeout 300

# Timeout TCP (86400s = 24h)
Router(config)# ip nat translation tcp-timeout 86400

# Timeout UDP
Router(config)# ip nat translation udp-timeout 300
```

---

## Exemple Complet : Entreprise avec DMZ

```cisco
# Interface WAN
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip address 203.0.113.1 255.255.255.248
Router(config-if)# ip nat outside
Router(config-if)# exit

# Interface LAN
Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip address 192.168.1.254 255.255.255.0
Router(config-if)# ip nat inside
Router(config-if)# exit

# Interface DMZ
Router(config)# interface GigabitEthernet0/2
Router(config-if)# ip address 10.0.0.254 255.255.255.0
Router(config-if)# ip nat inside
Router(config-if)# exit

# ACL pour LAN (PAT)
Router(config)# access-list 10 permit 192.168.1.0 0.0.0.255

# PAT pour le LAN
Router(config)# ip nat inside source list 10 interface GigabitEthernet0/0 overload

# NAT statique serveur web DMZ
Router(config)# ip nat inside source static 10.0.0.10 203.0.113.2

# NAT statique serveur mail DMZ
Router(config)# ip nat inside source static 10.0.0.20 203.0.113.3

Router(config)# end
Router# write memory
```

---

## Problèmes Courants

| Problème | Solution |
|----------|----------|
| Pas de translation | Vérifier `ip nat inside/outside` sur interfaces |
| Table NAT pleine | `clear ip nat translation *` |
| NAT statique inactif | Vérifier routage et ACL |
| Connexions lentes | Augmenter timeout |

---

## Connexions

### Concepts
- [[NAT - Network Address Translation]]
- [[PAT - Port Address Translation]]
- [[Port forwarding]]

### Configuration Linux équivalente
- [[MOC - Configuration NAT Linux]]

### Voir aussi
- Canvas : ![[Ex NAT.canvas]]

---

**Sources** : Fiche technique NAT et PAT, [[Formation Réseau - Jour 2]]
