---
date: 2025/11/07
tags:
  - Réseau
  - Routage
  - Cisco
  - Debian
---


Le routage IP permet de définir des chemins pour acheminer les paquets entre différents réseaux. Cette fiche présente les méthodes de configuration de routes statiques sur les équipements Cisco et les systèmes Debian/Linux.

---

## Routage sur Cisco

### Afficher la table de routage

```
Router> enable
Router# show ip route
```

La table de routage affiche :
- **C** : Réseaux directement connectés (Connected)
- **S** : Routes statiques (Static)
- **R** : Routes apprises par RIP
- **O** : Routes apprises par OSPF
- **D** : Routes apprises par EIGRP

### Ajouter une route statique

Syntaxe générale :

```
Router> enable
Router# configure terminal
Router(config)# ip route [réseau_destination] [masque] [passerelle_ou_interface]
```

#### Exemple 1 : Route via une adresse IP (Next Hop)

```
Router(config)# ip route 192.168.10.0 255.255.255.0 192.168.1.1
```

Cette commande indique :
- Réseau de destination : `192.168.10.0/24`
- Passerelle (next hop) : `192.168.1.1`

>[!NOTE]
>**Next Hop** : L'adresse IP du routeur suivant qui sait comment atteindre le réseau de destination

#### Exemple 2 : Route via une interface

```
Router(config)# ip route 10.0.0.0 255.0.0.0 GigabitEthernet0/0
```

Cette méthode est utile pour les liaisons point-à-point.

#### Exemple 3 : Route par défaut (Default Gateway)

```
Router(config)# ip route 0.0.0.0 0.0.0.0 192.168.1.254
```

La route par défaut (`0.0.0.0/0`) capture tout le trafic dont la destination n'est pas dans la table de routage.

### Supprimer une route statique

```
Router(config)# no ip route 192.168.10.0 255.255.255.0 192.168.1.1
```

### Sauvegarder la configuration

```
Router(config)# end
Router# write memory
```

ou

```
Router# copy running-config startup-config
```

### Exemple complet : Routage entre 3 réseaux

**Topologie** :
```
Réseau A (192.168.1.0/24) ── [R1] ── Réseau B (192.168.2.0/24) ── [R2] ── Réseau C (192.168.3.0/24)
```

**Configuration R1** :
```
R1(config)# ip route 192.168.3.0 255.255.255.0 192.168.2.2
```

**Configuration R2** :
```
R2(config)# ip route 192.168.1.0 255.255.255.0 192.168.2.1
```

>[!NOTE]
>**Important** : Le routage doit être configuré dans les deux sens (aller et retour) pour que la communication fonctionne.

### Vérification et dépannage

```
Router# show ip route              # Afficher la table de routage complète
Router# show ip route static       # Afficher uniquement les routes statiques
Router# show running-config        # Vérifier la configuration active
Router# ping 192.168.10.1          # Tester la connectivité
Router# traceroute 192.168.10.1    # Afficher le chemin suivi par les paquets
```

---

## Routage sur Debian/Linux

### Afficher la table de routage

```bash
# Méthode moderne (iproute2)
ip route show

# Méthode classique
route -n
netstat -rn
```

Exemple de sortie :
```
default via 192.168.1.254 dev eth0
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.10
192.168.10.0/24 via 192.168.1.1 dev eth0
```

### Ajouter une route statique (temporaire)

#### Route vers un réseau spécifique

```bash
ip route add 192.168.10.0/24 via 192.168.1.1
```

Ou avec l'ancienne commande `route` :

```bash
route add -net 192.168.10.0 netmask 255.255.255.0 gw 192.168.1.1
```

#### Route par défaut

```bash
ip route add default via 192.168.1.254

# ou
route add default gw 192.168.1.254
```

#### Route via une interface spécifique

```bash
ip route add 10.0.0.0/8 dev eth1
```

>[!NOTE]
>Les routes ajoutées avec `ip route` ou `route` sont temporaires et disparaissent au redémarrage du système.

### Supprimer une route

```bash
# Méthode moderne
ip route del 192.168.10.0/24

# Méthode classique
route del -net 192.168.10.0 netmask 255.255.255.0
```

### Rendre les routes permanentes

#### Méthode 1 : Fichier `/etc/network/interfaces` (Debian classique)

```bash
auto eth0
iface eth0 inet static
    address 192.168.1.10
    netmask 255.255.255.0
    gateway 192.168.1.254
    # Routes statiques supplémentaires
    up ip route add 192.168.10.0/24 via 192.168.1.1
    up ip route add 10.0.0.0/8 via 192.168.1.2
```

Redémarrer le réseau :

```bash
systemctl restart networking
# ou
ifdown eth0 && ifup eth0
```

#### Méthode 2 : Netplan (Ubuntu/Debian récent)

Éditez `/etc/netplan/01-netcfg.yaml` :

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      addresses:
        - 192.168.1.10/24
      routes:
        - to: 192.168.10.0/24
          via: 192.168.1.1
        - to: 10.0.0.0/8
          via: 192.168.1.2
        - to: default
          via: 192.168.1.254
```

Appliquer la configuration :

```bash
netplan apply
```

#### Méthode 3 : Fichier `/etc/network/if-up.d/` (script personnalisé)

Créez un script `/etc/network/if-up.d/static-routes` :

```bash
#!/bin/bash
ip route add 192.168.10.0/24 via 192.168.1.1
ip route add 10.0.0.0/8 via 192.168.1.2
```

Rendez-le exécutable :

```bash
chmod +x /etc/network/if-up.d/static-routes
```

#### Méthode 4 : systemd-networkd

Créez `/etc/systemd/network/10-static-routes.network` :

```ini
[Match]
Name=eth0

[Network]
Address=192.168.1.10/24
Gateway=192.168.1.254

[Route]
Destination=192.168.10.0/24
Gateway=192.168.1.1

[Route]
Destination=10.0.0.0/8
Gateway=192.168.1.2
```

Redémarrer le service :

```bash
systemctl restart systemd-networkd
```

### Activer le routage IP (Forwarding)

Pour que le système Debian agisse comme routeur entre plusieurs réseaux :

```bash
# Activation temporaire
echo 1 > /proc/sys/net/ipv4/ip_forward

# Vérifier l'état
cat /proc/sys/net/ipv4/ip_forward

# Activation permanente
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
sysctl -p
```

>[!NOTE]
>**IP Forwarding** est nécessaire pour transformer un serveur Debian en routeur. Sans cette option, le système ne transférera pas les paquets entre ses interfaces.

### Exemple complet : Serveur Debian en routeur

**Topologie** :
```
Réseau LAN (192.168.1.0/24) ── eth0 [Serveur Debian] eth1 ── Réseau DMZ (10.0.0.0/24)
```

**Configuration** :

1. Configurer les interfaces dans `/etc/network/interfaces` :

```bash
auto eth0
iface eth0 inet static
    address 192.168.1.1
    netmask 255.255.255.0

auto eth1
iface eth1 inet static
    address 10.0.0.1
    netmask 255.255.255.0
```

2. Activer le forwarding :

```bash
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
sysctl -p
```

3. Ajouter une route par défaut (vers Internet) :

```bash
ip route add default via 192.168.1.254 dev eth0
```

4. Configurer les clients :
   - Machines du réseau 192.168.1.0/24 : gateway `192.168.1.1`
   - Machines du réseau 10.0.0.0/24 : gateway `10.0.0.1`

### Vérification et dépannage

```bash
# Afficher la table de routage
ip route show
route -n

# Vérifier l'IP forwarding
cat /proc/sys/net/ipv4/ip_forward

# Tester la connectivité
ping -c 4 192.168.10.1

# Tracer le chemin des paquets
traceroute 192.168.10.1
mtr 192.168.10.1

# Afficher les statistiques réseau
ip -s link
netstat -i

# Capturer les paquets (dépannage avancé)
tcpdump -i eth0 icmp
```

---

## Comparaison Cisco vs Debian

| Aspect                    | Cisco                                  | Debian                                      |
| ------------------------- | -------------------------------------- | ------------------------------------------- |
| **Afficher les routes**   | `show ip route`                        | `ip route show` ou `route -n`               |
| **Route statique**        | `ip route IPdest mask IPnext`          | `ip route add IPdest/prefix via IPnext`     |
| **Route par défaut**      | `ip route 0.0.0.0 0.0.0.0 gateway`     | `ip route add default via gateway`          |
| **Supprimer une route**   | `no ip route ...`                      | `ip route del ...`                          |
| **Persistance**           | `write memory`                         | Fichiers `/etc/network/` ou `/etc/netplan/` |
| **IP Forwarding**         | Activé par défaut                      | Doit être activé manuellement               |
| **Format masque**         | Notation décimale (`255.255.255.0`)    | Notation CIDR préférée (`/24`)              |
| **Test connectivité**     | `ping`, `traceroute`                   | `ping`, `traceroute`, `mtr`                 |

>[!NOTE]
>**Points clés** :
>- Sur Cisco, les routes sont configurées en mode configuration et sauvegardées avec `write memory`
>- Sur Debian, les routes temporaires utilisent `ip route`, les permanentes nécessitent une configuration dans les fichiers système
>- Le forwarding IP doit être explicitement activé sur Debian pour faire du routage
>- Cisco utilise des masques en notation décimale, Linux préfère la notation CIDR

---

## Bonnes pratiques

### Sécurité
- Limiter les routes statiques au strict nécessaire
- Documenter chaque route ajoutée (commentaires, documentation)
- Utiliser des protocoles de routage dynamique (RIP, OSPF) pour les grandes infrastructures
- Implémenter des règles de pare-feu (ACL sur Cisco, iptables sur Debian)

### Performance
- Éviter les boucles de routage (route A→B→A)
- Utiliser des métriques appropriées pour les routes multiples
- Surveiller la table de routage (éviter trop d'entrées)

### Maintenance
- Sauvegarder régulièrement les configurations
- Tester les routes après modification (`ping`, `traceroute`)
- Maintenir une documentation à jour de la topologie réseau
- Utiliser des outils de monitoring (Nagios, Zabbix, Observium)

### Dépannage
1. Vérifier la table de routage (`show ip route` / `ip route show`)
2. Tester la connectivité directe (`ping` vers le next hop)
3. Vérifier l'IP forwarding (Linux)
4. Analyser le chemin avec `traceroute`
5. Capturer les paquets avec `tcpdump` ou Wireshark
