---
type: permanent
created: 2025-01-08 19:45
tags:
  - permanent
  - réseau
  - nat
  - linux
---

# DNAT - Destination NAT

> [!abstract] Concept
> DNAT (Destination NAT) modifie l'adresse IP destination d'un paquet, permettant de rediriger le trafic entrant vers un serveur interne.

## Explication

Le DNAT remplace l'IP publique destination par une IP privée, redirigeant le trafic vers un serveur interne. C'est l'équivalent du **port forwarding**.

**Flux** :
```
[Internet] → 203.0.113.1:80 → [Routeur DNAT] → 192.168.1.10:80 → [Serveur web privé]
             IP publique                       IP privée
```

**Le routeur traduit** :
- Destination : 203.0.113.1:80 → 192.168.1.10:80
- Source : conservée (IP du client Internet)

<svg viewBox="0 0 440 190" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="DNAT : l'adresse destination est réécrite en entrée">
<defs><marker id="dnA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<rect x="16" y="62" width="94" height="40" rx="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="34" y="86" font-size="12" fill="currentColor">Client</text>
<rect x="166" y="58" width="108" height="48" rx="6" fill="none" stroke="currentColor" stroke-width="1.8"/>
<text x="186" y="80" font-size="12" fill="currentColor">Routeur DNAT</text>
<text x="180" y="96" font-size="10" fill="currentColor" opacity="0.8">réécrit la DESTINATION</text>
<rect x="326" y="58" width="98" height="48" rx="5" fill="none" stroke="#27ae60" stroke-width="1.5"/>
<text x="338" y="78" font-size="11" fill="#27ae60">Serveur web</text>
<text x="334" y="94" font-size="10" fill="#27ae60">192.168.1.10:80</text>
<line x1="110" y1="82" x2="164" y2="82" stroke="currentColor" stroke-width="1.8" marker-end="url(#dnA)"/>
<text x="110" y="72" font-size="10" fill="#f2994a">→ 203.0.113.1:80</text>
<line x1="274" y1="82" x2="324" y2="82" stroke="currentColor" stroke-width="1.8" marker-end="url(#dnA)"/>
<rect x="16" y="124" width="188" height="24" rx="4" fill="#f2994a" fill-opacity="0.12" stroke="#f2994a" stroke-width="1.2"/>
<text x="24" y="140" font-size="10" fill="#f2994a">src client → dst 203.0.113.1:80</text>
<rect x="236" y="124" width="188" height="24" rx="4" fill="#27ae60" fill-opacity="0.12" stroke="#27ae60" stroke-width="1.2"/>
<text x="244" y="140" font-size="10" fill="#27ae60">src client → dst 192.168.1.10:80</text>
<text x="208" y="141" font-size="14" fill="currentColor">→</text>
<text x="16" y="172" font-size="11" fill="currentColor" opacity="0.8">la source est conservée : le serveur voit la vraie IP du client — c'est le port forwarding</text>
<text x="16" y="26" font-size="12" fill="currentColor">DNAT : rediriger le trafic entrant vers un serveur interne</text>
</svg>

## Configuration Linux (iptables)

**Prérequis** : IP forwarding activé
```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
```

**Redirection de port (HTTP)** :
```bash
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80
```

**Redirection avec changement de port** :
```bash
# Port externe 8080 → Port interne 80
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.10:80
```

**Redirection multiple (plusieurs serveurs)** :
```bash
# HTTP → Serveur 1
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80

# HTTPS → Serveur 1
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j DNAT --to-destination 192.168.1.10:443

# SSH → Serveur 2
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 22 -j DNAT --to-destination 192.168.1.20:22
```

**Vérification** :
```bash
iptables -t nat -L PREROUTING -v -n
```

## Équivalent Cisco

Sur Cisco IOS, DNAT = **Port forwarding statique** :
```cisco
ip nat inside source static tcp 192.168.1.10 80 203.0.113.1 80
```

## DNAT vs SNAT

| Type | Modifie | Direction | Usage |
|------|---------|-----------|-------|
| **SNAT** | IP source | Sortant (inside → outside) | Clients accèdent à Internet |
| **DNAT** | IP destination | Entrant (outside → inside) | Internet accède à serveurs |

**Souvent combinés** :
1. Client Internet → DNAT → Serveur interne
2. Serveur répond → SNAT → Client Internet

## Chaînage PREROUTING

DNAT s'applique dans la chaîne **PREROUTING** (avant routage) :
```
Paquet arrive → PREROUTING (DNAT) → Routage → FORWARD (firewall) → POSTROUTING (SNAT) → Sortie
```

## Sécurité

⚠️ **DNAT expose un service** :
- Ajouter règles firewall (FORWARD chain)
- Limiter par IP source si possible
- Surveiller les logs

**Exemple avec firewall** :
```bash
# DNAT
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80

# Firewall : autoriser uniquement HTTP vers ce serveur
iptables -A FORWARD -p tcp -d 192.168.1.10 --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT
```

## Connexions

- [[NAT - port forwarding]] - Concept général
- [[NAT - Network Address Translation]] - Concept parent
- [[NAT - source NAT (SNAT)]] - NAT inverse (sortant)
- [[NAT Linux - Port forwarding]] - Configuration complète
- [[DMZ - Zone démilitarisée]] - Zone pour serveurs exposés

---
**Sources** : [[J2 - Formation Réseau|Formation Réseau - Jour 2]], iptables Documentation, Netfilter Documentation
