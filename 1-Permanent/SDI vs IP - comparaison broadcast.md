---
type: permanent
created: 2025-11-25 15:35
tags:
  - permanent
  - broadcast
  - vidéo
  - réseau
source: "Formation Réseau - 2110"
---

# SDI vs IP - comparaison broadcast

> [!abstract] Concept
> Le passage du SDI (Serial Digital Interface) vers le broadcast IP (SMPTE 2110) représente un changement de paradigme fondamental dans le transport de flux vidéo professionnels, comparable à la transition du circuit-switched vers le packet-switched en téléphonie.

## Explication

**SDI** : Standard historique de transport vidéo professionnel sur câbles coaxiaux
**IP (SMPTE 2110)** : Transport vidéo/audio sur réseau Ethernet standard

## Comparaison détaillée

| **Aspect** | **SDI** | **Réseau IP (2110)** |
|------------|---------|---------------------|
| **Commutation** | Circuit (dédiée) | Paquets (partagée) |
| **Connexions** | Statiques (câbles physiques) | Dynamiques (routage software) |
| **Bande passante** | Garantie (1.485 Gbps HD-SDI) | Best Effort (dépend du réseau) |
| **Déterminisme** | Déterministe (latence fixe) | Probabiliste (latence variable) |
| **Direction** | Unidirectionnel | Multidirectionnel (any-to-any) |
| **Synchronisation** | Synchrone (horloge embarquée) | Asynchrone (nécessite PTP) |
| **Temps réel** | Temps réel natif | Jitter / reordering possible |
| **Latence** | Basse (< 1ms) | Variable (dépend utilisation réseau) |
| **Erreurs** | Très faible BER | Perte paquets (compensé par FEC) |
| **Topologie** | Point-à-point | Any-to-any (multicast) |
| **Signal** | 1 flux (vidéo + audio embarqué) | Multi-flux (essences séparées) |

## Caractéristiques SDI

### Format signal
```
1 câble coaxial = 1 vidéo + 16 canaux audio embarqués
```

**Débit HD-SDI** : 1.485 Gbps (non compressible)

### Architecture
```
[Caméra] --câble SDI--> [Mélangeur]
          (point-à-point dédié)
```

**Matrice de routage** : Switch hardware avec connexions physiques fixes

### Avantages
✅ Simple, robuste, éprouvé (40 ans d'utilisation)
✅ Latence ultra-basse et constante
✅ Plug-and-play (aucune configuration réseau)
✅ Zéro perte de signal (BER négligeable)

### Inconvénients
❌ Câbles coaxiaux coûteux et lourds
❌ Distance limitée (100m sans répéteur)
❌ Pas de flexibilité (rewiring physique nécessaire)
❌ Scalabilité faible (matrice hardware limitée)
❌ Audio/vidéo liés (pas de séparation possible)

## Caractéristiques IP (SMPTE 2110)

### Format signal
```
N flux multicast distincts :
- 239.1.1.1 → Vidéo
- 239.1.1.2 → Audio (canaux 1-8)
- 239.1.1.3 → Audio (canaux 9-16)
- 239.1.1.4 → Métadonnées
```

**Débit vidéo HD** : ~1 Gbps (non compressé, ou JPEG XS si 2110-22)

### Architecture
```
[Caméra] --Ethernet--> [Switch 10G] --Multicast--> [N équipements]
                         |                           - Mélangeur
                         |                           - Enregistreur
                         +---------------------------+ Moniteur
```

**Routage virtuel** : Orchestrateur software (NMOS) + switches réseau

### Avantages
✅ Infrastructure standard (Ethernet, switches IP)
✅ Flexibilité totale (routage dynamique par software)
✅ Longues distances (fibre optique, 10+ km)
✅ Scalabilité (ajout équipements sans rewiring)
✅ Séparation essences (audio/vidéo indépendants)
✅ Multicast (1 source → N destinations sans duplication)

### Inconvénients
❌ Complexité configuration (réseau, PTP, IGMP)
❌ Latence variable (dépend de la charge réseau)
❌ Jitter et réordonnancement de paquets
❌ Nécessite PTP pour synchronisation nanoseconde
❌ Perte de paquets possible (compensé par FEC)

## Migration SDI → IP

### Gateway SDI-IP
Équipements de conversion bidirectionnelle :
```
[Équipement SDI] <---> [Gateway] <---> [Réseau IP 2110]
```

**Fonction** : Encapsule/désencapsule les flux pour transition progressive

### Approche hybride
- Infrastructure IP pour backbone
- Périphériques SDI pour caméras legacy
- Conversion aux frontières

## Use cases préférentiels

### SDI reste pertinent pour :
- Productions mobiles (OB vans)
- Environnements simples sans besoin de flexibilité
- Distances courtes (< 100m)
- Latence ultra-critique (< 1ms)

### IP s'impose pour :
- Studios modernes avec routage complexe
- Productions distribuées (multi-sites)
- Besoin de scalabilité (événementiel)
- Longues distances (fibre optique)
- Flexibilité maximale (reconfigurations fréquentes)

## Connexions

- [[SMPTE 2110 - transport multimédia par IP]] - Norme IP broadcast
- [[PTP - Precision Time Protocol]] - Synchronisation nécessaire en IP
- [[MULTICAST - diffusion groupe]] - Distribution IP efficace
- [[RTP - Real-time Transport Protocol]] - Encapsulation temps réel

---
**Sources** : Formation Réseau - 2110, SMPTE Documentation
