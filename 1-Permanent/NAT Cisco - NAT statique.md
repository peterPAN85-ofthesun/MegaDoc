---
type: permanent
created: 2025-01-08 16:02
tags:
  - permanent
  - réseau
  - nat
  - cisco
  - nat-statique
---

# NAT Cisco - NAT statique

> [!abstract] Concept
> Translation 1:1 permanente entre une IP privée et une IP publique dédiée

## Explication

Le **NAT statique** crée une association **permanente** entre :
- 1 adresse IP privée inside
- 1 adresse IP publique outside

**Caractéristiques** :
- Translation **bidirectionnelle** (entrée + sortie)
- **Permanente** (ne timeout pas)
- Utilisé pour les **serveurs accessibles depuis Internet**

**Cas d'usage** :
- Serveur web avec IP publique dédiée
- Serveur mail
- Serveur VPN
- Équipements IoT accessibles à distance

## Exemples

### NAT statique basique

```cisco
# Serveur web 192.168.1.10 → IP publique 203.0.113.10
Router(config)# ip nat inside source static 192.168.1.10 203.0.113.10
```

**Résultat** :
- Trafic **sortant** : 192.168.1.10 → 203.0.113.10
- Trafic **entrant** : 203.0.113.10 → 192.168.1.10

### Plusieurs serveurs DMZ

```cisco
# Serveur web DMZ
Router(config)# ip nat inside source static 10.0.0.10 203.0.113.2

# Serveur mail DMZ
Router(config)# ip nat inside source static 10.0.0.20 203.0.113.3

# Serveur FTP DMZ
Router(config)# ip nat inside source static 10.0.0.30 203.0.113.4
```

Chaque serveur a **sa propre IP publique**.

### Configuration complète avec interfaces

```cisco
# Interfaces
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip nat outside
Router(config-if)# exit

Router(config)# interface GigabitEthernet0/2
Router(config-if)# ip nat inside
Router(config-if)# exit

# NAT statique
Router(config)# ip nat inside source static 10.0.0.10 203.0.113.10

Router(config)# end
Router# write memory
```

### Vérification

```cisco
# Voir translations actives
Router# show ip nat translations

# Voir statistiques
Router# show ip nat statistics
```

**Sortie type** :
```
Pro Inside global      Inside local       Outside local      Outside global
--- 203.0.113.10       10.0.0.10          ---                ---
```

**Inside local** : IP privée réelle
**Inside global** : IP publique traduite

### Supprimer NAT statique

```cisco
Router(config)# no ip nat inside source static 10.0.0.10 203.0.113.10
```

## Connexions

### Notes liées
- [[NAT - Network Address Translation]] - Concept général
- [[NAT Cisco - Configuration interfaces]] - Définir inside/outside
- [[NAT Cisco - Port forwarding]] - Redirection de ports spécifiques
- [[NAT - port forwarding]] - Concept port forwarding

### Contexte
NAT statique essentiel pour publier des serveurs internes sur Internet. Consomme 1 IP publique par serveur (coût). Pour économiser les IP publiques, utiliser le port forwarding à la place.

## Sources
- Formation Réseau - NAT statique
- Cisco Static NAT Configuration

---
**Tags thématiques** : #nat-statique #1to1 #serveur-public #dmz
