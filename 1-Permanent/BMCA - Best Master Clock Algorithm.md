---
type: permanent
created: 2025-11-25 15:45
tags:
  - permanent
  - réseau
  - ptp
  - synchronisation
  - broadcast
source: "Formation Réseau - 2110"
---

# BMCA - Best Master Clock Algorithm

> [!abstract] Concept
> Le BMCA (Best Master Clock Algorithm) est l'algorithme de sélection automatique du MASTER dans un réseau PTP, permettant de désigner l'horloge la plus fiable parmi tous les candidats disponibles.

## Explication

Dans un réseau PTP, **plusieurs équipements peuvent prétendre au rôle de MASTER** (générateurs de référence temporelle). Le **BMCA** organise un "concours" pour élire automatiquement le meilleur candidat.

**Objectif** : Garantir que l'horloge la plus stable et la plus fiable devient MASTER.

## Processus de sélection

Le BMCA compare les horloges candidates selon une **cascade de critères** :

```
Priority1 → Quality → Priority2 → MAC Address
```

### 1. Priority1
**Configurable par l'administrateur** (0-255, plus petit = meilleur)
- Valeur par défaut : **128**
- Permet de forcer un MASTER préféré

**Configuration Cisco** :
```cisco
ptp priority1 100
```

**Exemple** :
- Horloge A : priority1 = 100
- Horloge B : priority1 = 128
- **→ A devient MASTER**

### 2. Quality (clockClass + clockAccuracy)
**Fourni automatiquement par le constructeur**

**clockClass** indique la source de synchronisation :
- **6** : Horloge atomique (GPS, Rubidium)
- **7** : Horloge haute précision (OCXO)
- **13** : Application-specific
- **52** : Horloge interne non synchronisée (FOLLOWER)
- **248** : Default (sans source externe)

**Exemple** :
- Horloge A : GPS connecté (clockClass = 6)
- Horloge B : Oscillateur interne (clockClass = 248)
- **→ A devient MASTER** (meilleur Quality)

### 3. Priority2
**Deuxième priorité configurable** (0-255, plus petit = meilleur)
- Utilisée si Priority1 et Quality identiques
- Valeur par défaut : **128**

**Configuration Cisco** :
```cisco
ptp priority2 110
```

### 4. MAC Address (tie-breaker final)
Si tous les critères précédents sont identiques, l'horloge avec **l'adresse MAC la plus petite** devient MASTER.

**Exemple** :
- Horloge A : MAC `00:1A:2B:3C:4D:5E`
- Horloge B : MAC `00:1A:2B:3C:4D:5F`
- **→ A devient MASTER** (5E < 5F)

## Cascade complète (exemple)

Soit 3 horloges candidates :

| Horloge | Priority1 | Quality | Priority2 | MAC Address |
|---------|-----------|---------|-----------|-------------|
| A | 128 | GPS (6) | 128 | 00:11:22:33:44:55 |
| B | 100 | Interne (248) | 128 | 00:11:22:33:44:56 |
| C | 128 | GPS (6) | 120 | 00:11:22:33:44:57 |

**Résultat** :
1. Priority1 : B (100) < A/C (128) → **B devient MASTER**

Si B tombe en panne :
1. Priority1 : A (128) = C (128)
2. Quality : A (6) = C (6)
3. Priority2 : C (120) < A (128) → **C devient MASTER**

## Messages BMCA

Les horloges échangent des messages **Announce** périodiquement (toutes les 1-2 secondes) contenant :
- Priority1
- clockClass
- clockAccuracy
- Priority2
- clockIdentity (MAC-based)

Chaque équipement compare les Announce reçus avec ses propres attributs et détermine s'il doit être MASTER ou FOLLOWER.

## États PTP

Après exécution du BMCA, chaque équipement entre dans un état :
- **MASTER** : Élu meilleur horloge, génère Sync
- **FOLLOWER** : Se synchronise sur le MASTER
- **PASSIVE** : Candidat MASTER en attente (backup)
- **LISTENING** : Écoute les Announce sans participer

## Basculement automatique

Si le MASTER tombe en panne :
1. Les FOLLOWER cessent de recevoir les Sync
2. Le timeout expire (~3-4 messages manqués)
3. Le BMCA se réexécute
4. Le meilleur candidat restant devient nouveau MASTER
5. Convergence en **quelques secondes**

## Configuration stratégique

### Forcer un MASTER préféré
```cisco
! Sur le générateur GPS principal
ptp priority1 50

! Sur le générateur GPS backup
ptp priority1 60

! Sur les autres équipements
ptp priority1 128
```

### Empêcher un équipement d'être MASTER
```cisco
ptp priority1 255
```

L'équipement ne pourra jamais devenir MASTER (sauf si tous les autres ont aussi 255).

## Cas d'usage

### Studio broadcast avec GPS
- **Générateur GPS principal** : priority1 = 50, clockClass = 6
- **Générateur GPS backup** : priority1 = 60, clockClass = 6
- **Équipements de production** : priority1 = 128, clockClass = 248

**→ Principal devient MASTER. Si panne, backup prend le relais automatiquement.**

### Réseau sans GPS
Tous les équipements ont clockClass = 248. On utilise Priority1/Priority2 pour désigner manuellement le MASTER le plus stable.

## Vérification

```cisco
show ptp clock
```

**Sortie exemple** :
```
PTP Clock Summary
  Clock Identity: 00:1A:2B:3C:4D:5E:FF:FE
  Clock Domain: 0
  Priority1: 100
  Priority2: 128
  State: MASTER
  Clock Class: 6 (GPS synchronized)
```

## Avantages / Inconvénients

✅ **Automatique** : Pas d'intervention manuelle
✅ **Résilient** : Basculement automatique si panne
✅ **Déterministe** : Résultat prévisible
✅ **Hiérarchique** : Cascade de critères clairs

❌ **Complexité** : Nécessite compréhension des critères
❌ **Risque de flapping** : Si deux horloges équivalentes (instabilité)
❌ **Convergence lente** : Quelques secondes lors d'un basculement

## Connexions

- [[PTP - Precision Time Protocol]] - Protocole de synchronisation
- [[SMPTE 2110 - transport multimédia par IP]] - Utilise PTP avec BMCA

---
**Sources** : Formation Réseau - 2110, IEEE 1588
