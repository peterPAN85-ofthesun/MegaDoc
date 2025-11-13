---
type: permanent
created: 2025-01-08 19:45
tags:
  - permanent
  - réseau
  - sécurité
  - architecture
---

# DMZ - Zone démilitarisée

> [!abstract] Concept
> Une DMZ (DeMilitarized Zone) est une zone réseau isolée contenant les serveurs accessibles depuis Internet, séparée du réseau interne pour renforcer la sécurité.

## Explication

La DMZ crée un **segment réseau intermédiaire** entre Internet et le LAN interne, hébergeant les serveurs publics (web, mail, FTP).

**Principe de sécurité** :
- Serveurs DMZ accessibles depuis Internet
- Si serveur DMZ compromis → LAN interne protégé
- Double filtrage : Internet ↔ DMZ ↔ LAN

## Architecture classique

```
                    [Internet]
                        |
                   [Firewall 1]
                        |
                      [DMZ]
            (Serveurs Web, Mail, DNS publics)
                        |
                   [Firewall 2]
                        |
                   [LAN Interne]
              (Postes de travail, serveurs internes)
```

**Flux autorisés** :
- Internet → DMZ : Services publics (HTTP, HTTPS, SMTP, DNS)
- DMZ → LAN : Très limité (base de données en lecture seule)
- LAN → DMZ : Administration serveurs
- LAN → Internet : Navigation web, mails sortants

## Implémentations

### DMZ à 2 firewalls (la plus sécurisée)
```
[Internet] → [FW1] → [DMZ] → [FW2] → [LAN]
```
- FW1 : Filtre Internet → DMZ
- FW2 : Filtre DMZ → LAN
- Maximum de sécurité

### DMZ à 1 firewall (3 interfaces)
```
[Internet] ← [FW: eth0]
               ├─ [eth1] → [DMZ]
               └─ [eth2] → [LAN]
```
- 1 seul équipement avec 3 interfaces
- Économique
- Règles de filtrage séparent les zones

### DMZ screened subnet (sous-réseau filtré)
```
        [Internet]
             |
        [Routeur]
         /      \
      [DMZ]    [LAN]
```
- Routeur avec ACLs
- Simple mais moins sécurisé

## Segmentation réseau

**Adressage typique** :
```
Internet   : IP publique (ex: 203.0.113.0/24)
DMZ        : 172.16.1.0/24 (privé ou public)
LAN Interne: 192.168.1.0/24 (privé)
```

**VLANs** :
- VLAN 10 : DMZ
- VLAN 20 : LAN Interne
- VLAN 99 : Management

## Services en DMZ

**Serveurs publics** (exposés sur Internet) :
- Serveur Web (HTTP/HTTPS)
- Serveur Mail (SMTP, IMAP)
- DNS public
- Serveur FTP
- VPN endpoint
- Reverse proxy

**Serveurs internes** (restent dans LAN) :
- Base de données (sauf lecture seule DMZ)
- Serveurs de fichiers
- Active Directory
- Serveurs d'applications métier

## Règles de firewall typiques

**Internet → DMZ** :
```
Autoriser : HTTP (80), HTTPS (443), SMTP (25), DNS (53)
Bloquer : Tout le reste
```

**DMZ → LAN** :
```
Autoriser : Requêtes BDD (3306, 5432) depuis serveurs web uniquement
Bloquer : Tout le reste (principe du moindre privilège)
```

**LAN → DMZ** :
```
Autoriser : SSH/RDP pour administration
Autoriser : Monitoring (SNMP, Nagios)
```

**DMZ → Internet** :
```
Autoriser : Updates (HTTP/HTTPS)
Autoriser : DNS résolution
Bloquer : Connexions sortantes non nécessaires
```

## Configuration avec NAT

**NAT statique pour serveurs DMZ** :
```cisco
! Serveur web DMZ
ip nat inside source static 172.16.1.10 203.0.113.10

! Serveur mail DMZ
ip nat inside source static 172.16.1.20 203.0.113.20
```

**Port forwarding** :
```bash
# iptables Linux
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 172.16.1.10:80
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j DNAT --to-destination 172.16.1.10:443
```

## Avantages

✅ **Isolation** : Compromission DMZ n'affecte pas LAN
✅ **Défense en profondeur** : Double filtrage
✅ **Conformité** : Standards de sécurité (PCI-DSS, etc.)
✅ **Monitoring** : Surveillance centralisée de la zone exposée

## Inconvénients

❌ **Complexité** : Configuration et maintenance
❌ **Coût** : Équipements supplémentaires (firewalls)
❌ **Performance** : Double traversée firewall

## Bonnes pratiques

1. **Principe du moindre privilège** : Autoriser uniquement flux nécessaires
2. **Segmentation stricte** : Jamais de communication directe DMZ ↔ LAN
3. **Monitoring** : IDS/IPS sur zone DMZ
4. **Updates** : Maintenir serveurs DMZ à jour (exposés)
5. **Hardening** : Durcir serveurs DMZ (services minimaux)
6. **Logs centralisés** : SIEM pour détecter intrusions
7. **Bastion host** : Point d'administration unique

## Connexions

- [[NAT - Network Address Translation]] - Translation d'adresses pour DMZ
- [[NAT - port forwarding]] - Exposition services DMZ
- [[NAT - destination NAT (DNAT)]] - Redirection vers DMZ
- [[VLAN - Virtual LAN]] - Segmentation DMZ en VLAN
- [[NAT Cisco - NAT statique]] - Configuration NAT pour serveurs DMZ

---
**Sources** : [[J2 - Formation Réseau|Formation Réseau - Jour 2]], NIST Security Guidelines, Cisco ASA Documentation
