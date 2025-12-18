---
type: permanent
created: 2025-12-18 14:45
tags:
  - permanent
  - réseau
  - broadcast
  - smpte
  - sdi
---

# SMPTE 2022-6 - transport SDI sur IP

> [!abstract] Concept
> SMPTE 2022-6 encapsule un flux SDI complet dans des paquets IP sans décomposer les essences, permettant une transition progressive SDI→IP tout en héritant des limitations du SDI.

## Explication

**SMPTE 2022-6** est un standard de **transition** entre le monde SDI et le monde IP. Il permet de transporter un **flux SDI complet** (vidéo + audio + métadonnées mélangés) sur infrastructure Ethernet, sans modification du contenu.

### Principe

**Encapsulation directe** :
```
[Signal SDI natif 1.485 Gbps]
         ↓
  [Encapsulation RTP/UDP]
         ↓
    [Transport IP]
         ↓
[Décapsulation → Signal SDI]
```

Le flux SDI est **copié bit à bit** dans des paquets RTP, puis transporté sur le réseau comme un "tunnel".

### Caractéristiques

**Avantages** ✅ :
- **Liaison synchrone** : Timing SDI préservé
- **Compatibilité** : Équipements SDI existants via gateway
- **Migration douce** : Coexistence SDI/IP dans même infrastructure
- **Latence faible** : Pas de traitement essence, simple tunneling

**Désavantages** ❌ :
- **Pas de séparation essences** : Audio + vidéo + métadonnées indissociables
- **Bande passante fixe** : 1.485 Gbps pour HD même si audio seul nécessaire
- **Scalabilité limitée** : Héritage des contraintes SDI (1 vidéo, 16 audio max)
- **Pas de routage granulaire** : Impossible de router audio et vidéo séparément

## Exemples

### Cas d'usage typique

**Liaison inter-sites (Gateway)** :
```
[Studio SDI] → [Gateway 2022-6] → [Réseau IP 10G] → [Gateway 2022-6] → [Studio SDI]
```

**Avantage** : Utiliser infrastructure IP (fibre longue distance, switches) tout en gardant équipements SDI.

### Comparaison SMPTE 2022-6 vs 2110

| Critère | SMPTE 2022-6 | SMPTE 2110 |
|---------|--------------|------------|
| **Séparation essences** | ❌ Non | ✅ Oui (vidéo/audio/data séparés) |
| **Bande passante** | Fixe (1.485 Gbps HD) | Variable (subscribe ce qui est nécessaire) |
| **Flexibilité routage** | ❌ Faible (tout ou rien) | ✅ Maximale (granularité essence) |
| **Compatibilité SDI** | ✅ Directe | ❌ Nécessite conversion |
| **Latence** | ~0.5 ms | ~1-5 ms (traitement essences) |
| **Usage** | Transition, gateway | Production native IP |
| **Évolutivité** | ❌ Limitée par SDI | ✅ Scalabilité IP native |

### Scénario de migration

**Phase 1** : Infrastructure SDI pure (câbles coax)
**Phase 2** : Déploiement 2022-6 (gateway SDI→IP, réseau Ethernet)
- Économie câbles coax longue distance
- Switches au lieu de matrices SDI

**Phase 3** : Migration vers 2110 (caméras IP natives)
- Séparation essences
- Routage flexible
- Décommissionnement gateways 2022-6

### Exemple concret

**Régie mobile (car régie)** :
- Caméras SDI sur le terrain (50-200 m, câbles existants)
- Gateway 2022-6 au car régie
- Liaison fibre 2022-6 vers centre de production (5 km)
- Gateway 2022-6 → équipements SDI centre production

**Bénéfice** : Liaison longue distance via fibre (impossible en SDI natif > 300 m), équipements SDI non modifiés.

## Connexions

### Notes liées
- [[SMPTE 2110 - transport multimédia par IP]] - Successeur, séparation essences
- [[SDI vs IP - comparaison broadcast]] - Évolution paradigme broadcast
- [[RTP - Real-time Transport Protocol]] - Encapsulation commune 2022-6 et 2110
- [[SMPTE 2022-7 - redondance réseau]] - Redondance applicable aussi au 2022-6

### Contexte

**Positionnement historique** :
- **2022-6 (2012)** : Standard de transition
- **2110 (2017)** : Standard natif IP, séparation essences

**Stratégie migration** :
1. Court terme : 2022-6 pour liaisons longues (remplace câbles SDI)
2. Moyen terme : Coexistence 2022-6 (legacy) + 2110 (nouveaux équipements)
3. Long terme : 2110 pur (infrastructure IP native)

**Aujourd'hui** : 2022-6 encore utilisé pour :
- Interfaçage équipements SDI legacy (< 10 ans)
- Liaisons temporaires événementiels (équipements loués)
- Réduction coûts migration (pas de renouvellement matériel immédiat)

**Note** : SMPTE 2022-6 est un **compromis**, pas une solution long terme. Il permet de profiter des avantages réseau IP (distance, coût câbles) sans perdre compatibilité SDI, mais ne débloque pas la vraie révolution de SMPTE 2110 (flexibilité, séparation essences).

## Sources
- Formation Réseau - 2110
- SMPTE ST 2022-6:2012 - Transport of High Bit Rate Media Signals over IP Networks

---
**Tags thématiques** : #smpte #sdi #transition #gateway
