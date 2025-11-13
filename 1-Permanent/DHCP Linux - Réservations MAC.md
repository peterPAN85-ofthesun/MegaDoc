---
type: permanent
created: 2025-01-08 16:32
tags:
  - permanent
  - réseau
  - dhcp
  - linux
  - réservation
---

# DHCP Linux - Réservations MAC

> [!abstract] Concept
> Attribuer une IP fixe à un équipement basée sur son adresse MAC via DHCP

## Explication

Les **réservations DHCP** (aussi appelées "host declarations") permettent d'assigner **toujours la même IP** à un équipement spécifique identifié par son adresse MAC.

**Avantages vs IP statique** :
- Gestion centralisée sur le serveur DHCP
- Aucune configuration locale sur le client
- Facilite le déplacement d'équipements

**Format MAC Linux** : `aa:bb:cc:dd:ee:ff` (séparés par `:`)

## Exemples

### Réservation simple

Dans `/etc/dhcp/dhcpd.conf` :

```bash
# Serveur web - IP fixe 192.168.1.10
host serveur-web {
    hardware ethernet aa:bb:cc:dd:ee:ff;
    fixed-address 192.168.1.10;
}
```

**Résultat** : l'équipement avec MAC `aa:bb:cc:dd:ee:ff` reçoit toujours `192.168.1.10`.

### Réservation avec options personnalisées

```bash
# Serveur DNS/AD avec options spécifiques
host serveur-dns {
    hardware ethernet 00:11:22:33:44:55;
    fixed-address 192.168.10.1;
    option routers 192.168.10.254;
    option domain-name-servers 127.0.0.1;
    option domain-name "ad.entreprise.local";
}
```

### Plusieurs réservations

```bash
# Serveur web
host web-server {
    hardware ethernet aa:bb:cc:dd:ee:01;
    fixed-address 192.168.1.10;
}

# Serveur mail
host mail-server {
    hardware ethernet aa:bb:cc:dd:ee:02;
    fixed-address 192.168.1.20;
}

# Imprimante réseau
host printer-rh {
    hardware ethernet aa:bb:cc:dd:ee:03;
    fixed-address 192.168.1.30;
}

# Caméra IP
host camera-entree {
    hardware ethernet aa:bb:cc:dd:ee:04;
    fixed-address 192.168.1.40;
}
```

### Réservation dans un subnet spécifique

```bash
subnet 192.168.10.0 netmask 255.255.255.0 {
    range 192.168.10.50 192.168.10.200;
    option routers 192.168.10.254;

    # Réservation pour serveur AD (dans le subnet)
    host serveur-ad {
        hardware ethernet 00:11:22:33:44:55;
        fixed-address 192.168.10.1;
    }
}
```

**Note** : la réservation peut être **à l'intérieur** ou **à l'extérieur** du bloc subnet.

### Réservation hors de la plage (range)

```bash
subnet 192.168.1.0 netmask 255.255.255.0 {
    # Plage dynamique : .100 à .200
    range 192.168.1.100 192.168.1.200;
    option routers 192.168.1.254;
}

# Réservations en dehors de la plage (.10 à .50)
host serveur-web {
    hardware ethernet aa:bb:cc:dd:ee:ff;
    fixed-address 192.168.1.10;  # Hors du range
}

host serveur-mail {
    hardware ethernet bb:cc:dd:ee:ff:00;
    fixed-address 192.168.1.20;  # Hors du range
}
```

**Bonne pratique** : réserver .1-.50 pour équipements fixes, .100-200 pour DHCP dynamique.

### Trouver l'adresse MAC d'un équipement

**Linux** :
```bash
ip link show
ifconfig
```

**Windows** :
```cmd
ipconfig /all
```

**Depuis les baux DHCP** :
```bash
cat /var/lib/dhcp/dhcpd.leases
dhcp-lease-list
```

### Appliquer les modifications

```bash
# Vérifier la syntaxe
dhcpd -t -cf /etc/dhcp/dhcpd.conf

# Redémarrer le service
systemctl restart isc-dhcp-server

# Vérifier les logs
journalctl -u isc-dhcp-server -n 50
```

### Vérifier qu'un client a reçu sa réservation

```bash
# Voir les baux actifs
dhcp-lease-list | grep 192.168.1.10

# Logs temps réel
tail -f /var/log/syslog | grep dhcp
```

## Connexions

### Notes liées
- [[DHCP - Dynamic Host Configuration]] - Processus DORA
- [[DHCP Linux - Installation et configuration]] - Setup serveur
- [[DHCP Cisco - Réservations MAC]] - Équivalent Cisco
- [[ARP - Address Resolution Protocol]] - Lien MAC ↔ IP

### Contexte
Essentiel pour les serveurs, imprimantes, caméras IP, équipements IoT nécessitant une IP stable. Permet de centraliser la gestion sans configurer d'IP statique sur chaque équipement.

## Sources
- Formation Réseau - DHCP Linux
- ISC DHCP Host Declarations

---
**Tags thématiques** : #dhcp #réservation #mac-address #ip-fixe #linux
