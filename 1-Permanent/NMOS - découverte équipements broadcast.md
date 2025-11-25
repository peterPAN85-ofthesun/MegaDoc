---
type: permanent
created: 2025-11-25 15:55
tags:
  - permanent
  - broadcast
  - réseau
  - orchestration
  - api
source: "Formation Réseau - 2110"
---

# NMOS - découverte équipements broadcast

> [!abstract] Concept
> NMOS (Networked Media Open Specifications) est un ensemble de standards ouverts développés par l'AMWA pour la découverte automatique, l'enregistrement et le contrôle d'équipements broadcast IP (SMPTE 2110).

## Explication

Dans une infrastructure **broadcast IP**, il peut y avoir des **centaines d'équipements** (caméras, mélangeurs, enregistreurs, moniteurs). NMOS permet :
- **Découverte automatique** des équipements sur le réseau
- **Enregistrement** des capacités (senders/receivers)
- **Connexion** dynamique des flux (routing virtuel)

**Développé par** : AMWA (Advanced Media Workflow Association)
**Statut** : Open source, standardisé

## Terminologie NMOS

### Node (Nœud)
Un **équipement réseau broadcast** :
- Peut être un sender (émetteur de flux)
- Peut être un receiver (récepteur de flux)
- Peut être les deux simultanément

**Exemple** :
- Une **caméra** = Node avec 1 sender (vidéo out)
- Un **moniteur** = Node avec 1 receiver (vidéo in)
- Un **mélangeur** = Node avec N receivers + 1 sender

### Sender
**Source de flux** :
- Diffuse un flux multicast (vidéo, audio, métadonnées)
- Expose ses caractéristiques (format, débit, adresse multicast)

### Receiver
**Destination de flux** :
- S'abonne à un flux multicast
- Spécifie ses capacités (formats acceptés)

## Standards NMOS principaux

### IS-04 : Discovery and Registration
**Objectif** : Découvrir automatiquement tous les équipements sur le réseau

**Mécanisme** :
1. Chaque node s'**enregistre** auprès d'un Registry (serveur central)
2. Le Registry maintient une **base de données** de tous les nodes/senders/receivers
3. Les contrôleurs (orchestrateurs) **interrogent** le Registry via API REST

**API REST** :
```http
GET /nodes          → Liste tous les nodes
GET /senders        → Liste tous les senders
GET /receivers      → Liste tous les receivers
GET /flows          → Liste tous les flux
```

**Exemple réponse** :
```json
{
  "id": "cam01-sender-video",
  "label": "Camera 01 - Video Output",
  "transport": "urn:x-nmos:transport:rtp",
  "flow_id": "flow-cam01-video",
  "manifest_href": "http://239.1.1.1:5000/sdp"
}
```

### IS-05 : Device Connection Management
**Objectif** : Connecter dynamiquement senders et receivers

**Mécanisme** :
1. Contrôleur interroge IS-04 pour lister senders/receivers disponibles
2. Contrôleur envoie commande IS-05 pour connecter :
   - Receiver X → abonne-toi au Sender Y
3. Receiver configure son abonnement multicast

**API REST** :
```http
PATCH /receivers/{id}/target
{
  "sender_id": "cam01-sender-video",
  "transport_file": {
    "data": "v=0\no=- ...",
    "type": "application/sdp"
  }
}
```

Le receiver reçoit le fichier **SDP** décrivant le flux et s'abonne automatiquement.

## Modes d'orchestration

### Mode IGMP (automatique)
- Les receivers envoient **IGMP Join** directement
- Les switches routent les flux multicast automatiquement
- **Simple** mais moins de contrôle centralisé

### Mode SDN (Software-Defined Networking)
- Un contrôleur central (SDN controller) programme les switches
- Contrôle fin des flux (QoS, chemins redondants)
- **Complexe** mais offre fonctionnalités avancées

## Orchestrateurs compatibles NMOS

### Cerebrum (Axon)
Contrôleur broadcast haut de gamme :
- Interface graphique pour router les flux
- Gestion de matrices virtuelles
- Intégration IS-04/IS-05

### VSM (Broadcast Controllers)
Contrôleur multi-fabricants :
- Gère équipements hétérogènes
- Interface tactile
- Automation workflow

### Sony IP Live
Solution Sony intégrée pour production live SMPTE 2110.

## Workflow typique

```
1. Déploiement
   ├─ Équipements (nodes) se connectent au réseau
   └─ Chaque node s'enregistre au Registry (IS-04)

2. Découverte
   ├─ Orchestrateur interroge Registry
   └─ Affiche liste senders/receivers disponibles

3. Connexion
   ├─ Opérateur sélectionne : "Moniteur 3 → Caméra 1"
   ├─ Orchestrateur envoie commande IS-05
   └─ Moniteur 3 s'abonne au flux multicast de Caméra 1

4. Flux actif
   └─ Caméra 1 diffuse → Moniteur 3 reçoit
```

## Architecture NMOS typique

```
                  [NMOS Registry]
                  (base de données)
                        ↑
         +--------------+-------------+
         |              |             |
    [Caméra 1]    [Mélangeur]    [Moniteur]
    (Node/Sender) (Node/Both)    (Node/Receiver)
         |              |             |
         +----[Réseau IP 2110]--------+
```

## Avantages NMOS

✅ **Automatisation** : Plus besoin de configurer manuellement IPs/ports
✅ **Interopérabilité** : Standard ouvert (multi-fabricants)
✅ **Scalabilité** : Gestion de centaines d'équipements
✅ **Flexibilité** : Reconfigurations rapides (sans rewiring)
✅ **API REST** : Intégration avec systèmes tiers

## Défis

❌ **Dépendance Registry** : SPOF si Registry tombe
❌ **Courbe d'apprentissage** : Complexité initiale
❌ **Support inégal** : Tous équipements ne supportent pas NMOS
❌ **Sécurité** : API non authentifiées par défaut (IS-10 pour sécurité)

## Extensions NMOS

- **IS-06** : Network Control (SDN)
- **IS-07** : Event & Tally
- **IS-08** : Channel Mapping (audio)
- **IS-09** : System Parameters (paramètres globaux)
- **IS-10** : Authorization (sécurité)

## Cas d'usage

### Production TV en direct
- 50 caméras, 20 mélangeurs, 30 moniteurs
- Orchestrateur découvre automatiquement tous les équipements
- Opérateur route flux en quelques clics

### Événementiel (concert, sport)
- Infrastructure temporaire déployée rapidement
- Découverte automatique lors de la mise en réseau
- Reconfiguration live pendant l'événement

### Post-production collaborative
- Plusieurs monteurs accèdent aux mêmes sources
- Routage dynamique des rushes vers postes de montage

## Vérification

**Interroger Registry IS-04** :
```bash
curl http://registry-ip:3000/x-nmos/query/v1.3/nodes
```

**Connecter receiver via IS-05** :
```bash
curl -X PATCH http://receiver-ip:3000/x-nmos/connection/v1.1/receivers/{id}/target \
  -H "Content-Type: application/json" \
  -d '{"sender_id": "cam01-sender"}'
```

## Connexions

- [[SMPTE 2110 - transport multimédia par IP]] - Infrastructure transport
- [[SDP - Session Description Protocol]] - Description flux (IS-05)
- [[RTP - Real-time Transport Protocol]] - Encapsulation flux

---
**Sources** : Formation Réseau - 2110, AMWA NMOS Specifications
