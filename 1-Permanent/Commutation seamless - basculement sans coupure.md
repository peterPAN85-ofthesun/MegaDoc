---
type: permanent
created: 2025-12-18 14:40
tags:
  - permanent
  - réseau
  - broadcast
  - smpte
  - vidéo
---

# Commutation seamless - basculement sans coupure

> [!abstract] Concept
> La commutation seamless permet de basculer entre sources vidéo sans interruption visible en s'abonnant au nouveau flux avant de quitter l'ancien, au prix d'une latence accrue et d'un buffering multiple.

## Explication

En production broadcast SMPTE 2110, la **commutation** consiste à passer d'une source vidéo à une autre (ex : caméra 1 → caméra 2). Deux stratégies existent :

### Commutation no-seamless (avec coupure)

**Séquence** :
1. Désabonnement du flux actuel (IGMP Leave)
2. Abonnement au nouveau flux (IGMP Join)
3. Réception et décodage nouveau flux

**Problème** : Pendant l'étape 2, l'équipement ne reçoit **aucun flux** → **écran noir** de 50-200 ms.

**Avantage** :
- Latence minimale
- Un seul flux en mémoire (buffer réduit)
- Bande passante économisée

**Usage** : Commutations non critiques (post-production, preview).

### Commutation seamless (sans coupure)

**Séquence** :
1. Abonnement au nouveau flux (IGMP Join) **en parallèle**
2. **Attente** que nouveau flux soit synchronisé (buffer plein)
3. Basculement décodeur vers nouveau flux
4. Désabonnement ancien flux (IGMP Leave)

**Avantage** : Aucune interruption visible → **transition fluide**.

**Problème** :
- **Latence accrue** : +10 à 50 ms (temps de remplissage buffer)
- **Consommation mémoire** : 2+ flux simultanés en RAM
- **Bande passante doublée** temporairement

**Usage** : Production live antenne (sports, JT, direct).

## Exemples

### Cas d'usage mélangeur vidéo

**Mélangeur broadcast typique** :
- S'abonne à **12-16 flux** simultanément
- Tous les flux bufferisés en permanence
- Commutation instantanée entre sources (< 1 trame, soit 40 ms à 25 fps)

**Pourquoi ?** Le mélangeur doit pouvoir basculer instantanément entre n'importe quelle source (caméra, replay, graphisme). Tous les flux sont **pré-chargés** et **synchronisés** via PTP.

### Comparaison pratique

| Critère | No-seamless | Seamless |
|---------|-------------|----------|
| Coupure visible | Oui (50-200 ms) | Non |
| Latence totale | ~1-5 ms | ~10-50 ms |
| Buffer requis | 1 flux | 2+ flux |
| Bande passante pic | 1 Gbps | 2+ Gbps |
| Synchro PTP | Optionnelle | **Obligatoire** |
| Usage | Post-prod, preview | Live antenne |

### Workflow typique (régie TV)

**Scénario** : Basculer de Caméra 1 à Caméra 2 en direct antenne.

**No-seamless** :
```
00:00.000 - Flux Cam1 actif
00:00.100 - IGMP Leave Cam1 → ÉCRAN NOIR
00:00.150 - IGMP Join Cam2
00:00.200 - Flux Cam2 actif
          ↑ 100 ms de coupure ❌
```

**Seamless** :
```
00:00.000 - Flux Cam1 actif
00:00.000 - IGMP Join Cam2 (en parallèle)
00:00.030 - Cam2 bufferisée et synchronisée
00:00.030 - Basculement décodeur Cam1 → Cam2
00:00.030 - IGMP Leave Cam1
          ↑ Aucune coupure ✅ (+30 ms latence)
```

## Connexions

### Notes liées
- [[SMPTE 2110 - transport multimédia par IP]] - Infrastructure broadcast IP
- [[PTP - Precision Time Protocol]] - Synchronisation nanoseconde requise pour seamless
- [[SMPTE 2110-21 - types de flux NL N W]] - Seamless requiert émetteurs type NL
- [[IGMP - Internet Group Management Protocol]] - Mécanisme d'abonnement multicast
- [[SMPTE 2022-7 - redondance réseau]] - Seamless aussi pour basculement réseau rouge/bleu

### Contexte

La commutation seamless est **critique** pour :
- **Direct TV** : Aucune coupure acceptable antenne
- **Sports live** : Multiples caméras, commutations fréquentes
- **Événementiel** : Qualité broadcast professionnelle

**Contraintes techniques** :
1. **PTP obligatoire** : Tous flux synchronisés à la nanoseconde
2. **Émetteurs NL** : Timing régulier (pas de burst)
3. **Buffer dimensionné** : RAM suffisante pour N flux simultanés
4. **NMOS IS-05** : Orchestration automatique des abonnements

**Trade-off** : Latence vs qualité. Production live accepte +30 ms latence pour zéro coupure.

## Sources
- Formation Réseau - 2110
- SMPTE ST 2110-21:2017 (Traffic Shaping)
- SMPTE ST 2022-7:2019 (Seamless Protection Switching)

---
**Tags thématiques** : #smpte #broadcast #commutation #live
