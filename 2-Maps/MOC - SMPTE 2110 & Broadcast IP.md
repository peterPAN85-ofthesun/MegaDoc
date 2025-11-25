---
type: moc
created: 2025-11-25
updated: 2025-11-25
tags:
  - moc
  - broadcast
  - smpte
  - vidéo
  - réseau
---

# MOC - SMPTE 2110 & Broadcast IP

Map of Content centralisée pour le transport multimédia professionnel sur IP selon la norme SMPTE 2110.

---

## 🎯 Vue d'ensemble

Le **SMPTE 2110** représente la transition du broadcast professionnel vers l'IP, remplaçant les connexions SDI traditionnelles par des flux multicast sur infrastructure Ethernet standard.

**Domaines couverts** :
- Transport vidéo/audio non compressé sur IP
- Synchronisation nanoseconde (PTP)
- Orchestration et découverte automatique (NMOS)
- Redondance et haute disponibilité
- Architecture réseau optimisée

---

## 📚 Parcours d'apprentissage recommandé

### Niveau 1 : Comprendre la transition SDI → IP
1. **Commencer par** : [[SDI vs IP - comparaison broadcast]]
2. **Puis** : [[SMPTE 2110 - transport multimédia par IP]]
3. **Fondation réseau** : [[MULTICAST - diffusion groupe]]

### Niveau 2 : Maîtriser la synchronisation
1. **Essentiel** : [[PTP - Precision Time Protocol]]
2. **Sélection Master** : [[BMCA - Best Master Clock Algorithm]]
3. **Configuration switches** : [[PTP Clock modes - Ordinary Transparent Boundary]]

### Niveau 3 : Orchestration et transport
1. **Découverte** : [[NMOS - découverte équipements broadcast]]
2. **Encapsulation** : [[RTP - Real-time Transport Protocol]]
3. **Description flux** : [[SDP - Session Description Protocol]]

### Niveau 4 : Architecture et haute disponibilité
1. **Topologie** : [[Topologie Spine-Leaf]]
2. **Redondance** : [[SMPTE 2022-7 - redondance réseau]]
3. **Configuration Spine (L3)** : [[MULTICAST Cisco - routeur PIM]] ou [[MULTICAST Linux - routeur PIM]]
4. **Configuration Leaf (L2)** : [[MULTICAST Cisco - switch IGMP snooping]] ou [[MULTICAST Linux - bridge IGMP snooping]]

---

## 📖 Notes par thème

### 🎬 Fondamentaux Broadcast IP

#### Concepts de base
- [[SMPTE 2110 - transport multimédia par IP]] → Norme principale, séparation essences
- [[SDI vs IP - comparaison broadcast]] → Évolution du paradigme broadcast
- [[MULTICAST - diffusion groupe]] → Communication 1-vers-N

#### Protocoles réseau
- [[IGMP - Internet Group Management Protocol]] → Abonnement aux groupes multicast
- [[PIM - Protocol Independent Multicast]] → Routage multicast inter-switches

#### Configuration réseau multicast
- [[MULTICAST Linux - client réception flux]] → Client s'abonnant à un flux
- [[MULTICAST Linux - bridge IGMP snooping]] → Switch L2 Linux
- [[MULTICAST Linux - routeur PIM]] → Routeur L3 Linux (Spine)
- [[MULTICAST Cisco - switch IGMP snooping]] → Switch L2 Cisco (Leaf)
- [[MULTICAST Cisco - routeur PIM]] → Routeur L3 Cisco (Spine)

---

### ⏱️ Synchronisation (critique)

#### PTP - Precision Time Protocol
- [[PTP - Precision Time Protocol]] → IEEE 1588, synchronisation nanoseconde
- [[BMCA - Best Master Clock Algorithm]] → Élection automatique du Master
- [[PTP Clock modes - Ordinary Transparent Boundary]] → Modes switches (Ordinary, Transparent, Boundary)

#### Concepts clés
**Pourquoi la synchronisation est critique ?**
- Reconstruction de trames vidéo synchrones
- Commutation seamless (sans coupure)
- Lip-sync audio/vidéo
- Précision requise : **< 1 µs**

**Standards** :
- **SMPTE 2059** : Basé sur PTPv2 (IEEE 1588-2008)
- **SMPTE 2059-2** : Fréquence des requêtes PTP

---

### 🎛️ Orchestration et contrôle

#### NMOS (Network Media Open Specifications)
- [[NMOS - découverte équipements broadcast]] → IS-04 (discovery), IS-05 (connection)

#### Concepts clés
**Terminologie** :
- **Node** : Équipement réseau (caméra, mélangeur)
- **Sender** : Émetteur de flux
- **Receiver** : Récepteur de flux
- **Registry** : Base de données centralisée

**Standards NMOS** :
- **IS-04** : Découverte et enregistrement
- **IS-05** : Gestion des connexions
- **IS-06** : Contrôle réseau (SDN)
- **IS-07** : Events & Tally
- **IS-08** : Channel Mapping
- **IS-10** : Autorisation et sécurité

**Orchestrateurs compatibles** :
- Cerebrum (Axon)
- VSM (Broadcast Controllers)
- Sony IP Live

---

### 📡 Transport et encapsulation

#### Protocoles
- [[RTP - Real-time Transport Protocol]] → Encapsulation temps réel (couche 5)
- [[SDP - Session Description Protocol]] → Description des flux multimédia

#### Structure d'un flux SMPTE 2110
```
[Essence vidéo/audio brut]
         ↓
    [RTP Header]
    - Payload Type (96=vidéo, 97/98=audio)
    - Sequence Number
    - Timestamp
    - Marker Bit
         ↓
       [UDP]
    (pas de retransmission)
         ↓
   [IP Multicast]
   (239.x.x.x)
         ↓
     [Ethernet]
```

#### Débits typiques
**Vidéo HD 1080p 4:2:2 10 bits** :
```
1920 × 1080 × 25 fps × 10 bits × 2 (Y+CbCr) = ~1.037 Gbps
```

**Audio PCM 24 bits 48 kHz** :
```
24 bits × 48 kHz × N canaux
```

---

### 🏗️ Architecture réseau

#### Topologie
- [[Topologie Spine-Leaf]] → Architecture datacenter/broadcast moderne

#### Structure typique
```
                   [GPS Master PTP]
                          |
              [Spine - Boundary Clock]
            /           |            \
    [Leaf Rouge]  [Leaf Bleu]   [Leaf Control]
    (Transp. Clock) (Transp. Clock)
         |              |               |
    [Caméras]     [Mélangeurs]    [Enregistreurs]
```

#### Trois réseaux séparés
1. **Media LAN Rouge** : Flux primaire (239.100.x.x)
2. **Media LAN Bleu** : Flux redondant (239.200.x.x)
3. **Control LAN** : Orchestration, NMOS, monitoring

#### Switches recommandés
**Spine** :
- Cisco Nexus 9300 (100G)
- Arista 7500R
- Juniper QFX10000

**Leaf** :
- Cisco Nexus 93180 (48× 10G + 6× 100G)
- Arista 7280R

**Caractéristiques requises** :
- Support PTP (Boundary ou Transparent Clock)
- IGMP Snooping
- PIM Sparse Mode
- QoS (priorisation flux temps réel)

---

### 🛡️ Redondance et haute disponibilité

#### SMPTE 2022-7
- [[SMPTE 2022-7 - redondance réseau]] → Haute disponibilité réseau rouge/bleu

#### Principe
- **Deux flux identiques** simultanément (rouge ET bleu)
- **Mêmes en-têtes RTP** (Sequence Number, Timestamp)
- **Adresses IP différentes**
- **Basculement seamless** (sans coupure)

#### Protection contre
✅ Panne switch/routeur
✅ Coupure câble/fibre
✅ Congestion réseau
✅ Erreurs de transmission
✅ Maintenance sans interruption

#### Trade-off
- ❌ Coût : Double infrastructure
- ❌ Bande passante : Doublée
- ❌ Latence : +5-20 ms (buffer synchronisation)

---

## 🔧 Standards SMPTE 2110

### Famille 2110

| Standard | Description | Contenu |
|----------|-------------|---------|
| **2110-10** | Timing et synchronisation | Base PTP |
| **2110-20** | Vidéo non compressée | Formats jusqu'à 32K |
| **2110-21** | Gestion trafic | Types NL, N, W |
| **2110-22** | Vidéo JPEG XS | Compression légère |
| **2110-30** | Audio PCM | Basé sur AES67 |
| **2110-31** | Audio AES3 | Compressé |
| **2110-40** | Métadonnées | Ancillary data |
| **2110-41** | Métadonnées rapides | Fast metadata |
| **2110-43** | Sous-titrage TTML | XML-based |

### Standards associés

#### SMPTE 2022
- **2022-6** : Transport SDI complet sur IP
- **2022-7** : Redondance réseau (seamless)

#### SMPTE 2059
- **2059-1** : PTPv2 pour broadcast
- **2059-2** : Fréquence requêtes PTP

#### Autres standards
- **AES67** : Audio sur IP (base de 2110-30)
- **IEEE 1588** : PTP (Precision Time Protocol)
- **RFC 3550** : RTP (Real-time Transport Protocol)
- **RFC 4566** : SDP (Session Description Protocol)

---

## 🎓 Concepts clés à maîtriser

### 1. Séparation des essences
Contrairement au SDI (tout dans un câble), SMPTE 2110 sépare :
- **Vidéo** → Flux multicast distinct
- **Audio** (16+ canaux) → Flux multicast distinct(s)
- **Métadonnées** → Flux multicast distinct

**Avantage** : Flexibilité maximale (abonnement sélectif)

### 2. Transport multicast
- **1 source → N destinations** sans duplication
- Économie de bande passante massive
- IGMP Snooping **obligatoire** (éviter saturation)

### 3. Synchronisation PTP
- **Précision nanoseconde** requise
- **GPS Master** recommandé (clockClass=6)
- **Boundary Clock** sur Spine, **Transparent Clock** sur Leaf

### 4. Commutation seamless
- **Pas de coupure** lors du changement de source
- Nécessite :
  - PTP précis
  - Buffer de synchronisation
  - NMOS pour orchestration

### 5. Workflow NMOS
```
1. Équipements s'enregistrent (IS-04 Registry)
2. Orchestrateur découvre équipements
3. Opérateur connecte : "Moniteur 3 → Caméra 1"
4. IS-05 envoie SDP au receiver
5. Receiver s'abonne au flux multicast
6. Flux actif
```

---

## 💻 Configuration pratique

### Configuration type (Cisco)

#### Spine (routeur L3)
```cisco
! Multicast routing
ip multicast-routing
interface range GigabitEthernet1/0/1-24
 ip pim sparse-mode
ip pim rp-address 10.0.0.1

! PTP Boundary Clock
ptp mode boundary-clock
ptp domain 0
ptp priority1 100
interface GigabitEthernet1/0/1
 ptp role slave
interface range GigabitEthernet1/0/2-24
 ptp role master
```

#### Leaf (switch L2)
```cisco
! IGMP Snooping
ip igmp snooping
ip igmp snooping vlan 10
ip igmp snooping vlan 20

! PTP Transparent Clock
ptp mode transparent
```

### Vérification
```cisco
! Multicast
show ip mroute
show ip pim neighbor
show ip igmp groups
show ip igmp snooping

! PTP
show ptp clock
show ptp port
show ptp corrections
```

---

## 📊 Cas d'usage typiques

### Production TV en direct
**Contexte** : Studio national, émission antenne
- 50 caméras 4K
- 20 mélangeurs
- 30 moniteurs
- 10 enregistreurs

**Infrastructure** :
- 2 Spines (redondance)
- 10 Leafs
- Réseaux rouge/bleu (SMPTE 2022-7)
- GPS Master PTP

**Résultat** :
- Routage flexible (matrice virtuelle infinie)
- Latence < 2 ms
- 0% perte (grâce redondance)
- Basculement seamless

### Événementiel (sport, concerts)
**Avantages** :
- Déploiement rapide (câbles Ethernet)
- Scalabilité (ajout équipements sans rewiring)
- Longues distances (fibre optique, 10+ km)

### Post-production collaborative
**Avantages** :
- Plusieurs monteurs accèdent aux mêmes rushes
- Pas de duplication fichiers
- Collaboration temps réel

---

## 🔗 Connexions avec autres domaines

### Réseau
- [[MOC - Réseau]] → Section Broadcast IP
- VLANs pour segmentation (Media / Control)
- QoS pour priorisation flux
- Firewall et sécurité (IS-10)

### Linux Administration
- Configuration serveurs NMOS
- PIM daemon (pimd)
- Monitoring (Prometheus, Grafana)
- Streaming tools (FFmpeg, GStreamer)

### Automatisation
- Scripts Python/Bash pour orchestration
- API REST NMOS (IS-04/IS-05)
- CI/CD pour déploiements

---

## 📈 Évolution et tendances

### Adoption croissante
- **NBC Sports** : JO 2020 entièrement IP
- **BBC** : Studios IP depuis 2019
- **NEP Broadcast** : Régies mobiles IP

### Technologies émergentes
- **JPEG XS** : Compression légère (2110-22)
- **SMPTE 2110 sur cloud** : AWS, Azure, GCP
- **IA et automatisation** : Routage intelligent

### Défis restants
- Interopérabilité multi-fabricants
- Complexité configuration initiale
- Formation des équipes techniques
- Coût infrastructure (switches 100G)

---

## 📚 Ressources externes

### Documentation officielle
- **SMPTE Standards** : https://www.smpte.org/
- **AMWA NMOS Specs** : https://specs.amwa.tv/nmos/
- **IEEE 1588 (PTP)** : https://standards.ieee.org/

### Formations
- **SMPTE Academy** : Cours en ligne
- **Cisco Broadcast Networking** : Formation certifiante
- **Grass Valley Training** : Labs pratiques

### Outils
- **Prism** : Monitoring SMPTE 2110
- **Wireshark** : Analyse RTP/PTP
- **Tektronix Sentry** : Monitoring professionnel
- **FFmpeg** : Streaming/encoding

---

## 📊 Statistiques du domaine

**Notes permanentes** : 19 notes
- Fondamentaux : 3 notes
- Synchronisation : 3 notes
- Orchestration : 2 notes
- Transport : 2 notes
- Architecture : 3 notes
- Configuration multicast : 6 notes (3 Linux + 2 Cisco + 1 concept)

**Connexions** : ~80 liens internes
**Couverture** : Standards 2110-10 à 2110-43, PTP, NMOS IS-04/IS-05, Configuration complète multicast

---

## 🎯 Prochaines étapes suggérées

### Approfondir
- [ ] AES67 (audio sur IP)
- [ ] JPEG XS (compression légère)
- [ ] NMOS IS-06 à IS-10 (extensions)
- [ ] SMPTE ST 2022-5 (FEC - Forward Error Correction)

### Pratiquer
- [ ] Lab virtuel (GNS3/EVE-NG)
- [ ] Streaming test avec FFmpeg
- [ ] Analyse flux avec Wireshark
- [ ] Configuration switches Cisco/Arista

### Projets
- [ ] Simuler infrastructure 2110 complète
- [ ] Créer orchestrateur NMOS simple (Python)
- [ ] Monitoring dashboard (Grafana)

---

**Dernière mise à jour** : 2025-11-25

**Note** : Ce domaine évolue rapidement. Consulter régulièrement les standards SMPTE et AMWA pour mises à jour.
