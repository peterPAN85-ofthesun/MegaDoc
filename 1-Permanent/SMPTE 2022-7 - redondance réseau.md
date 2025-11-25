---
type: permanent
created: 2025-11-25 16:10
tags:
  - permanent
  - réseau
  - broadcast
  - redondance
  - haute-disponibilité
source: "Formation Réseau - 2110"
---

# SMPTE 2022-7 - redondance réseau

> [!abstract] Concept
> SMPTE 2022-7 est un standard de redondance réseau permettant de transmettre des flux broadcast (vidéo/audio) sur deux réseaux indépendants simultanément, garantissant la continuité de service en cas de panne d'un lien.

## Explication

En **broadcast professionnel**, toute interruption de flux est **inacceptable** (production live, diffusion antenne). SMPTE 2022-7 apporte une **haute disponibilité** en dupliquant les flux sur deux infrastructures réseau distinctes.

**Principe** : Envoyer le **même flux** sur deux réseaux indépendants (rouge et bleu), le receiver sélectionne les paquets du réseau le plus fiable en temps réel.

## Architecture réseau rouge/bleu

### Infrastructure typique

```
                  [Émetteur]
                  /        \
          [NIC Rouge]    [NIC Bleu]
                /            \
      [Réseau Rouge]     [Réseau Bleu]
      239.100.x.x        239.200.x.x
           |                  |
      [Switch Rouge]    [Switch Bleu]
           |                  |
           \                  /
          [NIC Rouge]    [NIC Bleu]
                \        /
                [Récepteur]
```

### Caractéristiques
- **Deux réseaux physiquement séparés** :
  - Switches distincts
  - Câblage indépendant
  - Alimentations électriques séparées
- **Adressages IP différents** :
  - Rouge : `192.168.10.x` / `239.100.x.x`
  - Bleu : `192.168.20.x` / `239.200.x.x`

## Fonctionnement SMPTE 2022-7

### Émission
L'émetteur envoie **deux flux identiques** simultanément :
- **Flux primaire** (rouge) : `239.100.1.1:5004`
- **Flux secondaire** (bleu) : `239.200.1.1:5004`

**Clé** : Les en-têtes RTP sont **identiques** :
- Même **Sequence Number**
- Même **Timestamp**
- Même **Payload**

```
Paquet RTP #1001 → Rouge (239.100.1.1)
Paquet RTP #1001 → Bleu  (239.200.1.1)  (identique)
```

### Réception seamless
Le receiver reçoit les **deux flux simultanément** et applique un algorithme de sélection :

1. **Buffering** : Bufferise quelques ms de chaque flux
2. **Comparaison Sequence Numbers** :
   - Si paquet N reçu sur rouge ET bleu → garde le premier arrivé
   - Si paquet N reçu sur rouge SEULEMENT → utilise rouge
   - Si paquet N reçu sur bleu SEULEMENT → utilise bleu
3. **Détection panne** :
   - Si réseau rouge tombe → utilise 100% bleu
   - Si réseau bleu tombe → utilise 100% rouge
4. **Reconstruction** : Flux continu sans perte ni coupure

### Latence additionnelle
**Trade-off** : Buffer de synchronisation = latence accrue
- Typique : **+5 à 20 ms**
- Nécessaire pour comparer les deux flux

## Scénarios de défaillance

### Cas 1 : Panne totale réseau rouge
```
Rouge : ❌ (switch HS, câble coupé)
Bleu  : ✅

→ Receiver bascule automatiquement sur 100% bleu
```

### Cas 2 : Congestion réseau rouge
```
Rouge : ⚠️ (pertes de paquets intermittentes)
Bleu  : ✅

→ Receiver utilise bleu pour paquets manquants sur rouge
```

### Cas 3 : Jitter asymétrique
```
Rouge : Latence 2 ms
Bleu  : Latence 10 ms

→ Receiver utilise prioritairement rouge (plus rapide)
   mais garde bleu en backup
```

### Cas 4 : Panne simultanée
```
Rouge : ❌
Bleu  : ❌

→ Perte totale du flux (probabilité très faible)
```

## Avantages de SMPTE 2022-7

### Seamless (sans coupure)
- Basculement **instantané** (pas de resynchronisation)
- Contrairement aux solutions active/standby (plusieurs secondes)

### Protection contre
✅ **Pannes équipement** : Switch, routeur
✅ **Coupure câble** : Fibre coupée, connecteur défectueux
✅ **Congestion réseau** : Surcharge temporaire
✅ **Erreurs transmission** : Corruption paquets
✅ **Maintenance** : Intervention sans interruption

### Transparent
- Aucune configuration côté émetteur (envoie juste sur 2 IPs)
- Receiver gère automatiquement la sélection

## Inconvénients

❌ **Coût** : Double infrastructure (switches, câblage, NICs)
❌ **Bande passante** : Doublée (2× le débit)
❌ **Latence** : +5-20 ms (buffer synchronisation)
❌ **Complexité** : Configuration, monitoring, dépannage

## Configuration

### Émetteur
```
Interface 1 (rouge) : 192.168.10.100
  → Multicast 239.100.1.1:5004

Interface 2 (bleu)  : 192.168.20.100
  → Multicast 239.200.1.1:5004
```

Les deux flux doivent avoir :
- **Même contenu RTP** (Sequence Number, Timestamp)
- **Adresses IP différentes**

### Receiver
Le receiver s'abonne aux **deux flux** via IGMP :
```
IGMP Join 239.100.1.1  (rouge)
IGMP Join 239.200.1.1  (bleu)
```

Le firmware du receiver implémente l'algorithme SMPTE 2022-7 de sélection/reconstruction.

## Monitoring

### Indicateurs clés
- **Packet Loss rouge** : % paquets perdus réseau rouge
- **Packet Loss bleu** : % paquets perdus réseau bleu
- **Packet Loss total** : Après reconstruction 2022-7 (doit être 0%)
- **Jitter rouge/bleu** : Variation latence
- **Active path** : Quel réseau est principalement utilisé

### Outils
- **Prism** : Monitoring SMPTE 2022-7
- **Tektronix Sentry** : Analyse redondance
- **Cisco show commands** : Statistiques multicast
## Cas d'usage

### Production TV en direct
- Émission nationale : aucune tolérance à la coupure
- Redondance critique pour continuité antenne

### Événementiel (sport, concerts)
- Événement unique, pas de "deuxième chance"
- Redondance essentielle

### Studio permanent
- Investissement infrastructure justifié
- Maintenance sans interruption de service

### Lieux avec risques physiques
- Zones de passage (câbles exposés)
- Environnements industriels
- Extérieurs (intempéries)

## Alternative : Active/Standby

| Aspect | **SMPTE 2022-7** | **Active/Standby** |
|--------|------------------|-------------------|
| **Basculement** | Seamless (instantané) | 3-10 secondes |
| **Coût** | Double infrastructure | Simple +1 backup |
| **Latence** | +5-20 ms | Aucune (mode normal) |
| **Complexité** | Élevée | Faible |
| **Protection** | Pannes + congestion | Pannes équipement uniquement |

**Recommandation** : 2022-7 pour broadcast critique, Active/Standby pour IT classique.

## Vérification

### Wireshark
Filtre pour voir les deux flux :
```
(ip.dst == 239.100.1.1 or ip.dst == 239.200.1.1) and rtp
```

Vérifier que Sequence Numbers sont identiques sur les deux flux.

### Test de failover
1. Débrancher câble réseau rouge
2. Vérifier que flux continue sans coupure (utilise bleu)
3. Rebrancher rouge, débrancher bleu
4. Vérifier seamless switchover

## Connexions

- [[SMPTE 2110 - transport multimédia par IP]] - Utilise redondance 2022-7
- [[RTP - Real-time Transport Protocol]] - Flux dupliqués en RTP
- [[MULTICAST - diffusion groupe]] - Transport sur deux groupes multicast
- [[Topologie Spine-Leaf]] - Architecture avec redondance

---
**Sources** : Formation Réseau - 2110, SMPTE 2022-7 Standard
