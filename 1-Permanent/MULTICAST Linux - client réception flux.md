---
type: permanent
created: 2025-11-25 16:45
tags:
  - permanent
  - réseau
  - multicast
  - linux
  - client
---

# MULTICAST Linux - client réception flux

> [!abstract] Concept
> Configuration d'un client Linux simple pour s'abonner et recevoir un flux multicast sans faire de routage.

## Explication

Un client multicast est un hôte qui souhaite **recevoir** un flux multicast (IPTV, broadcast IP, visioconférence) sans faire de routage. Il doit simplement :
1. Rejoindre le groupe multicast via IGMP
2. Configurer une route pour le trafic multicast
3. Utiliser une application pour consommer le flux

**Différence avec routeur multicast** : Le client ne forward pas le trafic, il le consomme uniquement.

## Configuration réseau

### 1. Ajouter route multicast

```bash
# Route pour plage multicast vers interface réseau
ip route add 224.0.0.0/4 dev eth0

# Vérifier
ip route show
```

**Explication** : Tout trafic vers `224.0.0.0/4` (plage multicast) passe par `eth0`.

### 2. Rejoindre groupe multicast

Méthode 1 : Via application (automatique)
```bash
# VLC, ffmpeg, socat rejoignent automatiquement le groupe
vlc rtp://@239.1.1.1:5004
```

Méthode 2 : Manuellement avec `ip maddr`
```bash
# Rejoindre groupe 239.1.1.1 sur eth0
ip maddr add 239.1.1.1 dev eth0

# Vérifier memberships
ip maddr show dev eth0
```

### 3. Vérifier abonnement IGMP

```bash
# Voir groupes multicast rejoints
cat /proc/net/igmp

# Exemple sortie :
# Idx Device    : Count Querier   Group    Users Timer
# 2   eth0      : 1     V3        239.1.1.1 1     0
```

**Interprétation** :
- `Count` : Nombre de groupes multicast
- `Querier` : Version IGMP
- `Group` : Adresse du groupe multicast
- `Users` : Nombre d'applications abonnées

## Applications de réception

### Option 1 : VLC (interface graphique ou CLI)

```bash
# Recevoir flux RTP multicast
vlc rtp://@239.1.1.1:5004

# Avec interface spécifique
vlc rtp://@239.1.1.1:5004 --miface eth0
```

### Option 2 : socat (afficher données brutes)

```bash
# Rejoindre groupe et afficher données
socat UDP4-RECV:5004,ip-add-membership=239.1.1.1:eth0 -

# Sauvegarder dans fichier
socat UDP4-RECV:5004,ip-add-membership=239.1.1.1:eth0 \
  OPEN:output.ts,creat,trunc
```

**Syntaxe** : `ip-add-membership=GROUPE:INTERFACE`

### Option 3 : ffmpeg (enregistrement)

```bash
# Recevoir et enregistrer flux
ffmpeg -i rtp://@239.1.1.1:5004 -c copy output.mp4

# Avec timeout
ffmpeg -timeout 30000000 -i rtp://@239.1.1.1:5004 -c copy output.mp4
```

### Option 4 : iperf3 (test bande passante multicast)

```bash
# Recevoir et mesurer débit
iperf3 -s -B 239.1.1.1 -p 5004

# Mode client (émetteur)
iperf3 -c 239.1.1.1 -p 5004 -u -b 10M -t 60
```

## Firewall (autoriser multicast)

### iptables

```bash
# Autoriser réception multicast sur eth0
iptables -A INPUT -i eth0 -d 224.0.0.0/4 -j ACCEPT

# Autoriser IGMP (protocole 2)
iptables -A INPUT -p igmp -j ACCEPT
```

### firewalld

```bash
# Autoriser multicast dans zone
firewall-cmd --zone=public --add-service=ssdp --permanent
firewall-cmd --reload

# Autoriser IGMP
firewall-cmd --zone=public --add-protocol=igmp --permanent
firewall-cmd --reload
```

## Troubleshooting

### Problème : Pas de flux reçu

**Vérifications** :
1. Route multicast existe ?
   ```bash
   ip route show | grep 224.0.0.0
   ```

2. Groupe multicast rejoint ?
   ```bash
   cat /proc/net/igmp | grep 239.1.1.1
   ```

3. Trafic UDP arrive ?
   ```bash
   tcpdump -i eth0 -n host 239.1.1.1
   ```

4. Firewall bloque ?
   ```bash
   iptables -L -n -v | grep 224.0.0.0
   ```

### Problème : Flux reçu mais corrompu

**Solutions** :
1. Vérifier MTU : Multicast nécessite souvent jumbo frames (MTU 9000)
   ```bash
   ip link set eth0 mtu 9000
   ```

2. Vérifier buffer UDP
   ```bash
   # Augmenter buffer réception
   sysctl -w net.core.rmem_max=134217728
   sysctl -w net.core.rmem_default=134217728
   ```

3. Vérifier pertes paquets
   ```bash
   netstat -su | grep "packet receive errors"
   ```

## Exemple complet : Client SMPTE 2110

```bash
#!/bin/bash
# client-2110.sh : Recevoir flux vidéo broadcast IP

# 1. Configuration interface
ip addr add 192.168.10.50/24 dev eth0
ip link set eth0 up
ip link set eth0 mtu 9000

# 2. Route multicast
ip route add 224.0.0.0/4 dev eth0

# 3. Augmenter buffers UDP
sysctl -w net.core.rmem_max=134217728
sysctl -w net.core.rmem_default=134217728

# 4. Autoriser firewall
iptables -A INPUT -i eth0 -d 224.0.0.0/4 -j ACCEPT
iptables -A INPUT -p igmp -j ACCEPT

# 5. Recevoir flux avec ffmpeg
ffmpeg -protocol_whitelist file,rtp,udp \
  -i rtp://@239.100.1.1:5004 \
  -c copy output.mp4
```

## Cas d'usage

- **IPTV** : Recevoir chaînes TV en multicast
- **Broadcast IP** : Client monitoring SMPTE 2110
- **Visioconférence** : Participant multicast
- **Tests réseau** : Valider distribution multicast

## Connexions

- [[MULTICAST - diffusion groupe]] - Concept général
- [[IGMP - Internet Group Management Protocol]] - Protocole d'abonnement
- [[MULTICAST Linux - bridge IGMP snooping]] - Switch L2 Linux
- [[MULTICAST Linux - routeur PIM]] - Routeur Linux avec PIM daemon
- [[SMPTE 2110 - transport multimédia par IP]] - Broadcast IP

---
**Sources** : Linux IP Multicast HOWTO, man ip-maddress, man socat
