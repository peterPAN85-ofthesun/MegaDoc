---
type: permanent
created: 2025-01-08 01:41
tags:
  - permanent
  - réseau
  - nat
  - pat
---

# PAT - Port Address Translation

> [!abstract] Concept
> Le PAT (NAT Overload) permet à plusieurs machines de partager une seule IP publique en utilisant différents ports sources.

## Explication

Extension du NAT qui traduit IP **+ port source**, permettant à des milliers de machines de partager 1 seule IP publique.

**Exemple** :
```
192.168.1.10:5234  →  203.0.113.1:1024  →  8.8.8.8:80
192.168.1.11:6781  →  203.0.113.1:1025  →  1.1.1.1:443
192.168.1.12:8192  →  203.0.113.1:1026  →  93.184.216.34:80
```

Le routeur maintient une **table de translation** :
- IP privée:Port privé ↔ IP publique:Port public

<svg viewBox="0 0 440 215" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PAT : plusieurs machines partagent une IP publique via des ports différents">
<defs><marker id="ptA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<rect x="16" y="52" width="118" height="22" rx="4" fill="none" stroke="#4c9aff" stroke-width="1.2"/>
<text x="22" y="68" font-size="10" fill="#4c9aff">192.168.1.10:5234</text>
<rect x="16" y="86" width="118" height="22" rx="4" fill="none" stroke="#4c9aff" stroke-width="1.2"/>
<text x="22" y="102" font-size="10" fill="#4c9aff">192.168.1.11:6781</text>
<rect x="16" y="120" width="118" height="22" rx="4" fill="none" stroke="#4c9aff" stroke-width="1.2"/>
<text x="22" y="136" font-size="10" fill="#4c9aff">192.168.1.12:8192</text>
<rect x="168" y="70" width="86" height="58" rx="6" fill="none" stroke="currentColor" stroke-width="1.8"/>
<text x="192" y="94" font-size="12" fill="currentColor">PAT</text>
<text x="176" y="112" font-size="10" fill="currentColor" opacity="0.8">1 IP publique</text>
<line x1="134" y1="63" x2="166" y2="86" stroke="#4c9aff" stroke-width="1.4" marker-end="url(#ptA)"/>
<line x1="134" y1="97" x2="166" y2="99" stroke="#4c9aff" stroke-width="1.4" marker-end="url(#ptA)"/>
<line x1="134" y1="131" x2="166" y2="112" stroke="#4c9aff" stroke-width="1.4" marker-end="url(#ptA)"/>
<rect x="290" y="52" width="134" height="22" rx="4" fill="#f2994a" fill-opacity="0.14" stroke="#f2994a" stroke-width="1.2"/>
<text x="296" y="68" font-size="10" fill="#f2994a">203.0.113.1:1024 → 8.8.8.8:80</text>
<rect x="290" y="86" width="134" height="22" rx="4" fill="#f2994a" fill-opacity="0.14" stroke="#f2994a" stroke-width="1.2"/>
<text x="296" y="102" font-size="10" fill="#f2994a">203.0.113.1:1025 → 1.1.1.1:443</text>
<rect x="290" y="120" width="134" height="22" rx="4" fill="#f2994a" fill-opacity="0.14" stroke="#f2994a" stroke-width="1.2"/>
<text x="296" y="136" font-size="10" fill="#f2994a">203.0.113.1:1026 → 93.184.216.34</text>
<line x1="254" y1="86" x2="288" y2="63" stroke="#f2994a" stroke-width="1.4" marker-end="url(#ptA)"/>
<line x1="254" y1="99" x2="288" y2="97" stroke="#f2994a" stroke-width="1.4" marker-end="url(#ptA)"/>
<line x1="254" y1="112" x2="288" y2="131" stroke="#f2994a" stroke-width="1.4" marker-end="url(#ptA)"/>
<text x="16" y="172" font-size="11" fill="currentColor" opacity="0.85">le PORT SOURCE devient la clé de démultiplexage : il identifie à qui renvoyer la réponse</text>
<text x="16" y="190" font-size="11" fill="currentColor" opacity="0.75">~64 000 ports disponibles → des milliers de machines derrière une seule IP publique</text>
<text x="16" y="26" font-size="12" fill="currentColor">NAT Overload : même IP publique, ports différents</text>
</svg>

## NAT vs PAT

**NAT classique** : Traduit uniquement l'IP
**PAT** : Traduit IP + port → ~65000 connexions par IP publique

## Terminologie

| Cisco | Linux | Signification |
|-------|-------|---------------|
| NAT Overload | MASQUERADE | PAT avec IP dynamique |
| PAT | SNAT | PAT avec IP fixe |

## Limitations

- Environ 65000 ports par IP publique
- Problèmes avec : FTP, SIP, gaming P2P, VPN

## Connexions

- [[NAT - Network Address Translation]] - Concept parent
- [[NAT - port forwarding]] - Inverse (connexions entrantes)
- [[NAT - source NAT (SNAT)]] - Implémentation Linux

**Configuration** :
- [[MOC - Réseau]]

---
**Sources** : [[J2 - Formation Réseau|Formation Réseau - Jour 2]]
