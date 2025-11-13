---
type: permanent
created: 2025-01-08 16:08
tags:
  - permanent
  - réseau
  - nat
  - cisco
  - troubleshooting
---

# NAT Cisco - Vérification et dépannage

> [!abstract] Concept
> Commandes essentielles pour diagnostiquer et résoudre les problèmes NAT sur Cisco

## Explication

Le dépannage NAT nécessite de vérifier :
1. **Interfaces inside/outside** : correctement définies ?
2. **Translations actives** : table NAT
3. **Statistiques** : nombre de translations, hits, misses
4. **Configuration** : règles NAT/PAT/port forwarding
5. **Timeouts** : durée de vie des sessions

Les commandes Cisco permettent d'inspecter, nettoyer ou déboguer les translations.

## Exemples

### Afficher les translations actives

```cisco
# Toutes les translations
Router# show ip nat translations

# Filtrer par protocole
Router# show ip nat translations | include tcp
Router# show ip nat translations | include udp

# Compter les translations
Router# show ip nat translations | count
```

**Sortie type** :
```
Pro Inside global         Inside local          Outside local         Outside global
tcp 203.0.113.1:1024      192.168.1.10:54321    93.184.216.34:80     93.184.216.34:80
tcp 203.0.113.1:80        192.168.1.10:80       ---                  ---
udp 203.0.113.1:1025      192.168.1.20:53       8.8.8.8:53           8.8.8.8:53
```

**Types** :
- Translation dynamique (PAT) : 4 colonnes remplies
- Translation statique : `---` dans Outside

### Afficher les statistiques

```cisco
Router# show ip nat statistics
```

**Informations utiles** :
- Total active translations
- Inside interfaces / Outside interfaces
- Hits / Misses (succès/échecs)
- Expired translations
- Dynamic mappings

### Afficher la configuration NAT

```cisco
# Toute la config NAT
Router# show running-config | include nat

# Interfaces
Router# show running-config | section interface
```

### Libérer les translations

```cisco
# Supprimer toutes les translations dynamiques
Router# clear ip nat translation *

# Supprimer une translation spécifique (inside)
Router# clear ip nat translation inside 192.168.1.10

# Supprimer par port
Router# clear ip nat translation tcp inside 192.168.1.10 80
```

**Utilité** : résoudre table NAT saturée, forcer nouvelle translation

### Déboguer le NAT

```cisco
# Debug général
Router# debug ip nat

# Debug détaillé
Router# debug ip nat detailed

# Arrêter le debug
Router# undebug all
```

**Attention** : debug génère beaucoup de logs, à utiliser ponctuellement sur réseau de test.

### Configurer les timeouts

```cisco
# Timeout général (300s = 5 min)
Router(config)# ip nat translation timeout 300

# Timeout TCP (86400s = 24h)
Router(config)# ip nat translation tcp-timeout 86400

# Timeout UDP (300s = 5 min)
Router(config)# ip nat translation udp-timeout 300

# Timeout DNS (60s)
Router(config)# ip nat translation dns-timeout 60
```

### Vérifier le routage (crucial pour NAT)

```cisco
# Table de routage
Router# show ip route

# Ping depuis le routeur
Router# ping 8.8.8.8 source GigabitEthernet0/1
```

Si le ping échoue → problème de routage, pas de NAT

### Problèmes courants

| Symptôme | Cause probable | Vérification |
|----------|----------------|--------------|
| Pas de translation | Interfaces inside/outside non définies | `show ip nat statistics` |
| Table NAT pleine | Trop de connexions / timeout trop long | `show ip nat statistics` (active translations) |
| NAT statique inactif | Routage manquant ou ACL bloquante | `show ip route` + `show access-lists` |
| Connexions lentes | Timeout trop court | Augmenter `tcp-timeout` |
| Port forwarding KO | Mauvais port ou IP | `show ip nat translations` |

### Forcer une nouvelle translation

```cisco
# Supprimer translation
Router# clear ip nat translation inside 192.168.1.10

# Depuis le client, renouveler connexion
# Ex: fermer/rouvrir navigateur, renouveler DHCP
```

### Vérifier ACL (si utilisée pour PAT)

```cisco
# Voir les ACL
Router# show access-lists

# Exemple sortie
Standard IP access list 1
    10 permit 192.168.1.0, wildcard bits 0.0.0.255
```

Si le réseau n'est pas dans l'ACL → pas de NAT.

## Connexions

### Notes liées
- [[NAT Cisco - Configuration interfaces]] - Définir inside/outside
- [[NAT Cisco - PAT et NAT Overload]] - PAT troubleshooting
- [[NAT Cisco - Port forwarding]] - Vérifier redirections
- [[NAT - Network Address Translation]] - Concept général

### Contexte
Commandes indispensables pour diagnostiquer les problèmes de connectivité Internet (clients sans accès, serveurs inaccessibles depuis l'extérieur). À utiliser lors du dépannage ou de la mise en production.

## Sources
- Formation Réseau - Dépannage NAT
- Cisco NAT Troubleshooting Guide

---
**Tags thématiques** : #nat #troubleshooting #show-commands #debug
