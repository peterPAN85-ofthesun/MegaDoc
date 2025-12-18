---
type: permanent
created: 2025-11-25 15:40
tags:
  - permanent
  - réseau
  - synchronisation
  - broadcast
  - temps-réel
source: "Formation Réseau - 2110"
---

# PTP - Precision Time Protocol

> [!abstract] Concept
> PTP (Precision Time Protocol) est un protocole de synchronisation horaire permettant d'atteindre une précision à la nanoseconde entre équipements réseau, essentiel pour le transport de flux vidéo/audio professionnels (SMPTE 2110).

## Explication

En **broadcast IP**, les flux vidéo/audio arrivent par paquets asynchrones. Pour reconstruire les images/trames synchrones, tous les équipements doivent partager une **référence temporelle commune ultra-précise**.

**PTP** synchronise toutes les horloges du réseau avec une précision de l'ordre de la **nanoseconde**.

**Standard** : IEEE 1588 (version 2 publiée en 2008)
**Norme broadcast** : SMPTE 2059 (basée sur PTPv2)

⚠️ **PTPv1 et PTPv2 ne sont PAS compatibles** ⚠️

## Architecture PTP

### Rôles

**MASTER** : Générateur de référence temporelle (horloge maître)
- Diffuse messages de synchronisation
- Un seul MASTER actif par domaine PTP

**FOLLOWER** (anciennement SLAVE) : Équipement synchronisé
- Reçoit messages du MASTER
- Ajuste son horloge locale
- Calcule délai de propagation

```
[MASTER] ----Sync----> [FOLLOWER]
         <--Delay Req--
         --Delay Resp->
```

## Mécanisme de synchronisation

### Vue d'ensemble : Échange complet MASTER ↔ FOLLOWER

```
MASTER (horloge référence)          FOLLOWER (à synchroniser)
      |                                      |
      |                                      |
═══════════════════ PHASE 1 : SYNC ═══════════════════════
      |                                      |
      | t1 = 10:00:00.000000000              |
      |--- Sync --------------------------->| t2 = 10:00:00.000000150
      |    (timestamp t1)                    | (reçu avec délai réseau)
      |                                      |
      |--- Follow_Up (t1) ------------------>|
      |    (précise t1 exact)                | Stocke t1 et t2
      |                                      |
═══════════════ PHASE 2 : DELAY REQUEST ══════════════════
      |                                      |
      |                                      | t3 = 10:00:00.500000000
      |<-- Delay_Req -------------------------| (envoi requête)
      | t4 = 10:00:00.500000140              |
      | (reçu avec délai réseau)             |
      |                                      |
      |--- Delay_Resp (t4) ----------------->|
      |    (indique t4 de réception)         | Stocke t3 et t4
      |                                      |
═══════════════════ CALCULS FOLLOWER ═════════════════════
                                             |
                    Délai réseau = (t2-t1 + t4-t3) / 2
                                 = (150ns + 140ns) / 2
                                 = 145 ns
                                             |
                    Offset horloge = (t2-t1) - délai
                                   = 150ns - 145ns
                                   = +5 ns
                                             |
                    → Ajuste horloge locale : -5 ns
                                             |
                                      [SYNCHRONISÉ]
```

**Principe** :
1. **MASTER → FOLLOWER** (Sync) : Mesure t2-t1 (temps aller)
2. **FOLLOWER → MASTER** (Delay Req) : Mesure t4-t3 (temps retour)
3. **Calcul délai** : Moyenne des deux trajets (hypothèse symétrique)
4. **Calcul offset** : Décalage horloge à compenser
5. **Ajustement** : FOLLOWER corrige son horloge

### Phase 1 : SYNC (Master → Follower)

```
MASTER                           FOLLOWER
  |                                  |
  |--- Sync (t1) ------------------->|
  |                                  | Reçoit à t2
  |--- Follow_Up (timestamp t1) ---->|
  |                                  | Calcule offset = (t2-t1) - délai
```

Le MASTER envoie :
1. **Sync** : Paquet avec timestamp t1 d'envoi
2. **Follow_Up** : Message précisant le timestamp exact t1

Le FOLLOWER :
- Enregistre t2 (heure de réception locale)
- Connaît maintenant le décalage (si le délai était connu)

### Phase 2 : DELAY REQUEST (Follower → Master)

```
MASTER                           FOLLOWER
  |                                  |
  |<-- Delay_Req (t3) ---------------|
  | Reçoit à t4                      |
  |--- Delay_Resp (timestamp t4) --->|
  |                                  | Calcule délai = (t4-t3)
```

Le FOLLOWER envoie :
1. **Delay_Req** à t3

Le MASTER répond :
1. **Delay_Resp** avec timestamp t4 (réception)

Le FOLLOWER calcule :
- **Délai réseau** : `(t4 - t3 + t2 - t1) / 2`
- **Offset horloge** : `(t2 - t1) - délai`

Le FOLLOWER ajuste son horloge pour compenser l'offset.

## Fréquence des requêtes

Définie par **SMPTE 2059-2** :
- Messages Sync : toutes les **125 µs à 1 s** (typiquement)
- Delay Request : toutes les **1 à 10 s**

Plus la fréquence est élevée, meilleure est la précision (mais plus de charge réseau).

## Sélection du MASTER : BMCA

Voir [[BMCA - Best Master Clock Algorithm]] pour le mécanisme de sélection automatique du MASTER.

## Modes de gestion PTP sur switches

### Ordinary Clock (par défaut)
- Switch ne participe PAS au PTP
- Trames PTP traversent comme données normales
- **Inconvénient** : Latence variable du switch = dégradation précision

### Transparent Clock
- Switch mesure son délai interne de traitement
- Incrémente le champ `correctionField` dans les trames PTP
- Follower corrige automatiquement
- **Inconvénient** : Ne peut pas sortir du domaine réseau (trames modifiées)

**Configuration Cisco** :
```cisco
ptp mode transparent
```

### Boundary Clock
- Switch se synchronise comme FOLLOWER sur une interface
- Devient MASTER sur les autres interfaces
- Synchronisation hiérarchique port par port
- **Avantage** : Meilleure précision dans réseaux complexes

**Configuration Cisco** :
```cisco
interface GigabitEthernet0/1
 ptp role master

interface GigabitEthernet0/2
 ptp role slave
```

## Domaines PTP

**Domaine PTP** : Groupe d'équipements partageant la même référence temporelle
- Numéro de domaine : 0 à 255
- Par défaut : domaine 0

**Cas d'usage** : Interconnexion de deux infrastructures 2110 indépendantes
- Infrastructure A : domaine 0
- Infrastructure B : domaine 1
- Évite conflits entre deux MASTER

**Configuration** :
```cisco
ptp domain 0
```

## Supervision PTP

### Cisco
```cisco
show ptp clock
show ptp corrections
show ptp parent
show ptp port
```

**Exemple sortie** :
```
PTP Clock Summary
  Clock Identity: 00:1A:2B:3C:4D:5E:FF:FE
  Clock Domain: 0
  State: SLAVE
  Offset from Master: 150 ns
```

### Outils tiers
- **Prism** : Monitoring PTP dédié broadcast
- **Wireshark** : Capture et analyse trames PTP

## Cas d'usage

### Broadcast IP (SMPTE 2110)
**Critique** : Sans PTP précis, impossible de :
- Reconstruire trames vidéo synchrones
- Commuter sans coupure (seamless switching)
- Mixer plusieurs sources vidéo

### Autres domaines
- **5G Mobile Networks** : Synchronisation stations de base
- **Marchés financiers** : Horodatage transactions (µs/ns)
- **Grids électriques** : Synchronisation smart grids
- **Instrumentation** : Mesures scientifiques distribuées

## Avantages / Inconvénients

✅ **Précision nanoseconde** : 100× meilleur que NTP
✅ **Standard ouvert** : IEEE 1588
✅ **Hardware timestamping** : Meilleure précision que software
✅ **Scalable** : Hiérarchie Boundary Clocks

❌ **Complexité configuration** : Modes switches, domaines
❌ **Support hardware nécessaire** : PTP-aware switches
❌ **Sensible aux asymétries** : Délais up/down différents
❌ **Coût** : Switches avec support PTP plus chers

## Comparaison NTP vs PTP

| Aspect | NTP | PTP |
|--------|-----|-----|
| **Précision** | ~1 ms | ~100 ns |
| **Couche** | Application (L7) | Ethernet (L2/L3) |
| **Hardware** | Non requis | Recommandé (HW timestamping) |
| **Usage** | IT, synchronisation serveurs | Télécoms, broadcast, finance |
| **Complexité** | Simple | Avancée |

## Connexions

- [[SMPTE 2110 - transport multimédia par IP]] - Norme utilisant PTP
- [[BMCA - Best Master Clock Algorithm]] - Sélection MASTER
- [[PTP Clock modes - Ordinary Transparent Boundary]] - Modes switches
- [[SDI vs IP - comparaison broadcast]] - Synchronisation SDI vs PTP

---
**Sources** : Formation Réseau - 2110, IEEE 1588, SMPTE 2059
