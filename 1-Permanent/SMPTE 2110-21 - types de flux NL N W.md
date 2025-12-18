---
type: permanent
created: 2025-12-18 14:35
tags:
  - permanent
  - réseau
  - broadcast
  - smpte
  - vidéo
---

# SMPTE 2110-21 - types de flux NL N W

> [!abstract] Concept
> Le standard SMPTE 2110-21 définit trois types d'émetteurs/récepteurs (NL, N, W) qui se distinguent par leur stratégie d'envoi des paquets vidéo et leurs exigences de buffering, permettant d'optimiser latence ou compatibilité.

## Explication

**SMPTE 2110-21** spécifie la **gestion du trafic vidéo** sur IP, notamment comment les paquets sont temporisés entre émetteur et récepteur. Trois types d'équipements coexistent :

### Type NL (Narrow Linear)

**Caractéristiques** :
- **Envoi** : Régulier, linéaire dans le temps
- **Buffering récepteur** : Faible (quelques lignes vidéo)
- **Latence** : Minimale
- **Contrainte** : Timing strict, sensible au jitter réseau

**Principe** : Les paquets sont envoyés à intervalle constant pendant la durée de la trame vidéo. Un récepteur NL commence à decoder dès réception des premières lignes.

**Usage typique** : Production live ultra-faible latence (caméras → mélangeurs).

### Type N (Narrow)

**Caractéristiques** :
- **Envoi** : Paquets envoyés uniquement pour parties actives de l'image
- **Buffering récepteur** : Faible à moyen
- **Latence** : Faible
- **Optimisation** : Évite d'envoyer lignes de blanking (non visibles)

**Principe** : Pour une image HD 1080p, seules les ~1080 lignes actives sont transmises, pas les lignes de synchronisation verticale/horizontale. Réduit légèrement la bande passante.

**Usage typique** : Production standard avec contraintes réseau.

### Type W (Wide)

**Caractéristiques** :
- **Envoi** : Burst, sans logique de timing particulière
- **Buffering récepteur** : Grand (trame complète)
- **Latence** : Élevée (+10-50 ms)
- **Compatibilité** : Accepte tout type d'émetteur

**Principe** : L'émetteur envoie la trame vidéo complète en rafale dès qu'elle est disponible. Le récepteur bufferise l'intégralité avant de decoder.

**Usage typique** : Post-production, enregistrement, équipements tolérants à la latence.

## Exemples

### Matrice de compatibilité

| Récepteur ↓ / Émetteur → | NL | N | W |
|--------------------------|-----|-----|-----|
| **NL** | ✅ | ✅ | ❌ |
| **N** | ✅ | ✅ | ❌ |
| **W** | ✅ | ✅ | ✅ |

**Règle** : Un récepteur NL/N ne peut **pas** recevoir d'un émetteur W (burst trop rapide, buffer insuffisant).
Un récepteur W accepte **tous** types d'émetteurs (buffer large).

### Cas concrets

**Caméra (NL) → Mélangeur (NL)** :
- Latence : ~1 ms
- Compatible ✅
- Usage : Production live sports

**Caméra (W) → Mélangeur (NL)** :
- Compatible ❌
- Problème : Récepteur NL ne peut bufferiser le burst
- Solution : Reconfigurer caméra en mode NL

**Serveur vidéo (W) → Enregistreur (W)** :
- Latence : ~30 ms
- Compatible ✅
- Usage : Post-production, pas de contrainte temps réel

### Impact sur le réseau

**Type NL (1080p 25 fps)** :
- Débit constant : ~1 Gbps
- Jitter toléré : < 10 µs
- Switches requis : QoS strict, PTP précis

**Type W (1080p 25 fps)** :
- Débit pic : ~3 Gbps (burst)
- Débit moyen : ~1 Gbps
- Switches requis : Buffer profond, pas de QoS critique

## Connexions

### Notes liées
- [[SMPTE 2110 - transport multimédia par IP]] - Standard parent
- [[RTP - Real-time Transport Protocol]] - Encapsulation des paquets
- [[PTP - Precision Time Protocol]] - Synchronisation requise pour NL/N
- [[Commutation seamless - basculement sans coupure]] - Nécessite mode NL

### Contexte

Le choix du type NL/N/W impacte :
- **Architecture** : Production live → NL/N obligatoire
- **Équipements** : Vérifier compatibilité émetteur/récepteur
- **Réseau** : Type W moins exigeant (tolère jitter, QoS relâchée)

**Trade-off** : Latence vs simplicité. Production live exige NL, post-production peut utiliser W.

**Note importante** : La commutation seamless (sans coupure) requiert **impérativement** des émetteurs NL synchronisés par PTP.

## Sources
- Formation Réseau - 2110
- SMPTE ST 2110-21:2017 - Traffic Shaping and Delivery Timing

---
**Tags thématiques** : #smpte #vidéo #latence #buffer
