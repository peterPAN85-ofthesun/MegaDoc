---
type: permanent
created: 2025-01-08 16:38
tags:
  - permanent
  - réseau
  - dhcp
  - linux
  - troubleshooting
---

# DHCP Linux - Vérification et dépannage

> [!abstract] Concept
> Commandes essentielles pour diagnostiquer et résoudre les problèmes DHCP sur serveur Linux

## Explication

Le dépannage DHCP Linux nécessite de vérifier :
1. **Service actif** : isc-dhcp-server running ?
2. **Configuration** : syntaxe dhcpd.conf valide ?
3. **Baux actifs** : clients ont reçu des IP ?
4. **Logs** : erreurs dans syslog/journal ?
5. **Réseau** : interface écoute sur bon réseau ?

**Fichiers clés** :
- `/etc/dhcp/dhcpd.conf` : configuration
- `/var/lib/dhcp/dhcpd.leases` : baux actifs
- `/var/log/syslog` : logs DHCP

## Exemples

### Vérifier l'état du service

```bash
# État du service
systemctl status isc-dhcp-server

# Voir si actif au démarrage
systemctl is-enabled isc-dhcp-server

# Processus actif ?
ps aux | grep dhcpd
```

**État souhaité** : `active (running)`

### Tester la syntaxe de la configuration

```bash
# Vérifier dhcpd.conf avant de redémarrer
dhcpd -t -cf /etc/dhcp/dhcpd.conf

# Voir la config complète interprétée
dhcpd -d -cf /etc/dhcp/dhcpd.conf
```

**Sortie OK** : `Internet Systems Consortium DHCP Server 4.x`
**Erreur** : ligne et description de l'erreur

### Voir les baux DHCP actifs

```bash
# Outil graphique (installer si besoin)
dhcp-lease-list

# Lire directement le fichier
cat /var/lib/dhcp/dhcpd.leases

# Baux actifs uniquement (filtrer)
grep "^lease" /var/lib/dhcp/dhcpd.leases
```

**Contenu type** :
```
lease 192.168.1.100 {
  starts 2 2025/01/08 14:30:00;
  ends 3 2025/01/09 14:30:00;
  hardware ethernet aa:bb:cc:dd:ee:ff;
  client-hostname "PC-Bureau";
}
```

### Voir les logs en temps réel

```bash
# Méthode 1 : journalctl (systemd)
journalctl -u isc-dhcp-server -f

# Méthode 2 : syslog classique
tail -f /var/log/syslog | grep dhcp

# Méthode 3 : dhcpd.log si configuré
tail -f /var/log/dhcpd.log
```

**Chercher** : DHCPDISCOVER, DHCPOFFER, DHCPREQUEST, DHCPACK

### Voir les statistiques réseau

```bash
# Ports DHCP ouverts ?
netstat -ulnp | grep dhcpd
ss -ulnp | grep dhcpd

# Écoute sur quelle interface ?
lsof -i :67
```

**Résultat attendu** : port **67 (UDP)** ouvert

### Capturer le trafic DHCP

```bash
# Voir tout le trafic DHCP
tcpdump -i eth0 port 67 or port 68 -vv

# Enregistrer dans un fichier
tcpdump -i eth0 port 67 or port 68 -w dhcp-capture.pcap

# Analyser avec Wireshark
wireshark dhcp-capture.pcap
```

**Chercher** : séquence DISCOVER → OFFER → REQUEST → ACK

### Redémarrer le service

```bash
# Redémarrer complètement
systemctl restart isc-dhcp-server

# Recharger la config (sans couper baux actifs)
systemctl reload isc-dhcp-server

# Vérifier après redémarrage
systemctl status isc-dhcp-server
journalctl -u isc-dhcp-server -n 50
```

### Problèmes courants

| Symptôme | Cause probable | Solution |
|----------|----------------|----------|
| Service ne démarre pas | Erreur syntaxe dhcpd.conf | `dhcpd -t -cf /etc/dhcp/dhcpd.conf` |
| Pas de baux attribués | Mauvaise interface | Vérifier `/etc/default/isc-dhcp-server` |
| Clients sans IP | Firewall bloque port 67 | `ufw allow 67/udp` |
| Conflits d'adresses | Deux serveurs DHCP | Désactiver l'autre serveur |
| Logs vides | Service pas démarré | `systemctl start isc-dhcp-server` |

### Vérifier l'interface d'écoute

```bash
# Quelle interface configurée ?
cat /etc/default/isc-dhcp-server | grep INTERFACES

# Interface a une IP ?
ip addr show eth0

# Interface up ?
ip link show eth0
```

### Libérer tous les baux (réinitialiser)

```bash
# Arrêter le service
systemctl stop isc-dhcp-server

# Sauvegarder les baux
cp /var/lib/dhcp/dhcpd.leases /var/lib/dhcp/dhcpd.leases.backup

# Vider les baux
> /var/lib/dhcp/dhcpd.leases

# Redémarrer
systemctl start isc-dhcp-server
```

**Attention** : tous les clients devront redemander une IP.

### Activer les logs personnalisés

Éditer `/etc/rsyslog.d/50-dhcp.conf` :

```bash
# Créer le fichier
cat > /etc/rsyslog.d/50-dhcp.conf <<EOF
if \$programname == 'dhcpd' then /var/log/dhcpd.log
& stop
EOF

# Redémarrer rsyslog
systemctl restart rsyslog
```

**Résultat** : logs DHCP dans `/var/log/dhcpd.log` (séparé de syslog)

### Debug mode (mode verbeux)

```bash
# Arrêter le service
systemctl stop isc-dhcp-server

# Lancer en mode debug (foreground)
dhcpd -d -f -cf /etc/dhcp/dhcpd.conf

# CTRL+C pour arrêter
# Redémarrer le service normalement
systemctl start isc-dhcp-server
```

**Mode debug** : affiche TOUT en temps réel (très verbeux).

### Vérifier le firewall

```bash
# UFW (Ubuntu)
ufw status
ufw allow 67/udp

# iptables
iptables -L -n | grep 67

# Autoriser DHCP
iptables -A INPUT -p udp --dport 67 -j ACCEPT
iptables -A OUTPUT -p udp --sport 67 -j ACCEPT
```

### Tester depuis un client

```bash
# Sur le client Linux
dhclient -v eth0

# Voir le processus DORA dans les logs
```

**Vérifier sur serveur** : logs montrent DISCOVER reçu et OFFER envoyé.

## Connexions

### Notes liées
- [[DHCP Linux - Installation et configuration]] - Setup serveur
- [[DHCP - Dynamic Host Configuration]] - Processus DORA
- [[DHCP Cisco - Vérification et dépannage]] - Équivalent Cisco
- [[DHCP Linux - Client DHCP]] - Dépannage côté client

### Contexte
Commandes indispensables pour diagnostiquer les problèmes DHCP sur serveur Linux. À utiliser lors de la mise en service ou du dépannage d'un serveur DHCP isc-dhcp-server.

## Sources
- Formation Réseau - Dépannage DHCP Linux
- ISC DHCP Server Troubleshooting

---
**Tags thématiques** : #dhcp #troubleshooting #linux #logs #diagnostic
