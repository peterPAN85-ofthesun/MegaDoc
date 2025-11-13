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
