---
type: permanent
created: 2025-01-08 01:51
tags:
  - permanent
  - réseau
  - dhcp
  - protocole
---

# DHCP - Dynamic Host Configuration Protocol

> [!abstract] Concept
> Le DHCP attribue automatiquement une adresse IP et la configuration réseau aux machines d'un réseau.

## Explication

Le DHCP évite la configuration manuelle des adresses IP sur chaque machine. Un serveur DHCP distribue automatiquement les paramètres réseau.

**Paramètres distribués** :
- Adresse IP
- Masque de sous-réseau
- Passerelle par défaut
- Serveur(s) DNS
- Durée de bail (lease)

<svg viewBox="0 0 440 240" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Séquence DHCP DORA entre client et serveur">
<defs><marker id="doA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="doB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#27ae60"/></marker></defs>
<rect x="20" y="30" width="96" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="46" y="48" font-size="12" fill="currentColor">CLIENT</text>
<rect x="324" y="30" width="96" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="344" y="48" font-size="12" fill="currentColor">SERVEUR</text>
<line x1="68" y1="56" x2="68" y2="220" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>
<line x1="372" y1="56" x2="372" y2="220" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>
<line x1="68" y1="82" x2="368" y2="82" stroke="#4c9aff" stroke-width="1.8" marker-end="url(#doA)"/>
<text x="112" y="76" font-size="11" fill="#4c9aff">1. DISCOVER — broadcast « qui a une IP ? »</text>
<line x1="372" y1="118" x2="72" y2="118" stroke="#27ae60" stroke-width="1.8" marker-end="url(#doB)"/>
<text x="138" y="112" font-size="11" fill="#27ae60">2. OFFER — « voici 192.168.1.50 »</text>
<line x1="68" y1="154" x2="368" y2="154" stroke="#4c9aff" stroke-width="1.8" marker-end="url(#doA)"/>
<text x="130" y="148" font-size="11" fill="#4c9aff">3. REQUEST — « je prends celle-ci »</text>
<line x1="372" y1="190" x2="72" y2="190" stroke="#27ae60" stroke-width="1.8" marker-end="url(#doB)"/>
<text x="126" y="184" font-size="11" fill="#27ae60">4. ACK — bail + masque + GW + DNS</text>
<text x="20" y="216" font-size="10" fill="currentColor" opacity="0.75">broadcast</text>
<text x="330" y="216" font-size="10" fill="currentColor" opacity="0.75">unicast</text>
<text x="16" y="22" font-size="12" fill="currentColor">DORA : Discover → Offer → Request → Ack</text>
<text x="16" y="236" font-size="11" fill="currentColor" opacity="0.8">les deux premières étapes sont en broadcast : le client n'a pas encore d'adresse</text>
</svg>

## Processus DORA

1. **Discover** : Client diffuse "Je cherche un serveur DHCP"
2. **Offer** : Serveur répond "Voici une IP disponible"
3. **Request** : Client demande "J'accepte cette IP"
4. **Acknowledge** : Serveur confirme "IP attribuée"

## Bail (Lease)

L'IP est prêtée pour une durée limitée :
- Le client doit renouveler avant expiration
- Permet de récupérer les IP inutilisées
- Durée typique : 24h à 7 jours

## Ports

**Client** : Port 68 (UDP)
**Serveur** : Port 67 (UDP)

## Avantages

✅ Configuration automatique
✅ Gestion centralisée
✅ Évite les conflits d'IP
✅ Réutilisation des IP

## Inconvénients

❌ Dépendance au serveur DHCP
❌ IP changeante (problème pour serveurs)

## Connexions

- [[DHCP Cisco - Relay Agent]] - Relai DHCP inter-VLAN
- [[DHCP Cisco - Réservations MAC]] - IP fixe via DHCP
- [[DNS - Domain Name System]] - Souvent couplé

---
**Sources** : [[J1 - Formation Réseau|Formation Réseau - Jour 1]], Glossaire
