---
type: permanent
created: 2025-01-08 19:45
tags:
  - permanent
  - réseau
  - nat
  - linux
---

# SNAT - Source NAT

> [!abstract] Concept
> SNAT (Source NAT) modifie l'adresse IP source d'un paquet, permettant aux machines d'un réseau privé d'accéder à Internet via une IP publique.

## Explication

Le SNAT remplace l'IP privée source par une IP publique lors de la sortie vers Internet.

**Flux** :
```
[PC privé] 192.168.1.10:5234 → [Routeur SNAT] → 203.0.113.1:1024 → [Internet]
           IP privée                           IP publique
```

**Table de translation** :
Le routeur mémorise :
| IP privée:Port | IP publique:Port | Destination |
|----------------|------------------|-------------|
| 192.168.1.10:5234 | 203.0.113.1:1024 | 8.8.8.8:53 |

Pour retransmettre la réponse au bon PC.

<svg viewBox="0 0 440 190" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SNAT : l'adresse source est réécrite en sortie">
<defs><marker id="snA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<rect x="16" y="62" width="96" height="40" rx="5" fill="none" stroke="#4c9aff" stroke-width="1.5"/>
<text x="30" y="80" font-size="11" fill="#4c9aff">PC privé</text>
<text x="24" y="95" font-size="10" fill="#4c9aff">192.168.1.10:5234</text>
<rect x="166" y="58" width="108" height="48" rx="6" fill="none" stroke="currentColor" stroke-width="1.8"/>
<text x="186" y="80" font-size="12" fill="currentColor">Routeur SNAT</text>
<text x="188" y="96" font-size="10" fill="currentColor" opacity="0.8">réécrit la SOURCE</text>
<rect x="330" y="62" width="94" height="40" rx="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="354" y="86" font-size="12" fill="currentColor">Internet</text>
<line x1="112" y1="82" x2="164" y2="82" stroke="currentColor" stroke-width="1.8" marker-end="url(#snA)"/>
<line x1="274" y1="82" x2="328" y2="82" stroke="currentColor" stroke-width="1.8" marker-end="url(#snA)"/>
<text x="278" y="72" font-size="10" fill="#f2994a">203.0.113.1:1024</text>
<rect x="16" y="124" width="188" height="24" rx="4" fill="#4c9aff" fill-opacity="0.12" stroke="#4c9aff" stroke-width="1.2"/>
<text x="24" y="140" font-size="10" fill="#4c9aff">src 192.168.1.10:5234 → dst 8.8.8.8:80</text>
<rect x="236" y="124" width="188" height="24" rx="4" fill="#f2994a" fill-opacity="0.12" stroke="#f2994a" stroke-width="1.2"/>
<text x="244" y="140" font-size="10" fill="#f2994a">src 203.0.113.1:1024 → dst 8.8.8.8:80</text>
<text x="208" y="141" font-size="14" fill="currentColor">→</text>
<text x="16" y="172" font-size="11" fill="currentColor" opacity="0.8">seule la source change ; la destination est intacte — c'est le sens sortant du NAT</text>
<text x="16" y="26" font-size="12" fill="currentColor">SNAT : masquer qui parle, pour sortir vers Internet</text>
</svg>

## SNAT vs MASQUERADE (Linux)

### SNAT
- IP publique **fixe**
- Plus performant (pas de lookup IP)
- Usage : serveur avec IP statique

```bash
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j SNAT --to-source 203.0.113.1
```

### MASQUERADE
- IP publique **dynamique** (DHCP)
- Moins performant (lookup IP à chaque paquet)
- Usage : box Internet, connexions DHCP

```bash
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j MASQUERADE
```

## Configuration Linux (iptables)

**Prérequis** : Activer IP forwarding
```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
# Permanent : /etc/sysctl.conf
net.ipv4.ip_forward = 1
```

**SNAT avec IP fixe** :
```bash
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j SNAT --to-source 203.0.113.1
```

**MASQUERADE (IP dynamique)** :
```bash
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j MASQUERADE
```

**Vérification** :
```bash
iptables -t nat -L -v -n
```

## Équivalent Cisco

Sur Cisco IOS, SNAT = **NAT Overload** ou **PAT** :
```cisco
ip nat inside source list 1 interface GigabitEthernet0/1 overload
```

## Comparaison avec DNAT

| Type | Modifie | Direction | Usage |
|------|---------|-----------|-------|
| **SNAT** | IP source | Sortant (inside → outside) | Accès Internet |
| **DNAT** | IP destination | Entrant (outside → inside) | Port forwarding |

## Connexions

- [[NAT - Network Address Translation]] - Concept parent
- [[PAT - Port Address Translation]] - Équivalent (avec ports)
- [[NAT - destination NAT (DNAT)]] - NAT inverse (entrant)
- [[NAT Linux - iptables et NAT]] - Configuration complète

---
**Sources** : [[J2 - Formation Réseau|Formation Réseau - Jour 2]], iptables Documentation, RFC 3022
