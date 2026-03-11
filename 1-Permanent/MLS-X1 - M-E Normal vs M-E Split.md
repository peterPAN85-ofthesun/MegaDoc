---
type: permanent
created: 2026-03-11
tags:
  - permanent
  - broadcast
  - sony
  - mls-x1
  - switcher
  - me-split
---

# MLS-X1 - M/E Normal vs M/E Split

> [!abstract] Concept
> Le **M/E Split** divise un bloc hardware M/E physique en deux sous-blocs indépendants (sub block A et B), chacun fonctionnant comme une banque switcher séparée. Cela double le nombre de banques logiques à hardware égal, mais est incompatible avec le mode Multi Program 2 et réduit les sorties disponibles en mode Multi Program.

## Source

User's Guide MLS-X1S/MLS-X1 – pp.127, 145, 178, 260, 402, 430-432, 443, 571-572

---

## Principe fondamental

| Critère | M/E Normal | M/E Splitté |
|---|---|---|
| **Définition** | Un bloc hardware M/E = 1 banque switcher | Un bloc hardware M/E = 2 sous-blocs indépendants (sub block A + B) |
| **Activation** | Actif par défaut | À activer : Home > Setup > System > Format/Config > Box Config > [M/E Split] |
| **Redémarrage requis** | — | ✅ Oui, provoque un redémarrage |
| **Compatibilité Multi Program 2** | ✅ | ❌ Incompatible — MP2 est désactivé |

> M/E Split et Multi Program 2 sont **mutuellement exclusifs**.

---

## Banques switcher générées

| Configuration | M/E Normal | M/E Splitté |
|---|---|---|
| **1 M/E box — HD** | 4 banques | 6 banques (max physique) |
| **1 M/E box — 4K** | 2 banques | 4 banques |
| **2 M/E box — HD** | 4 banques | 6 banques (max) |
| **4 M/E box + XPT — HD** | 6 banques | 6 banques (plafond déjà atteint) |

> Le plafond système est **6 banques**. Avec 4 M/E box, le split n'augmente plus le nombre de banques.

---

## Keys

| Critère | M/E Normal | M/E Splitté |
|---|---|---|
| **Keys par banque — HD** | 8 keys fixes | Variable selon répartition entre les 2 sub blocks |
| **Keys par banque — 4K** | 6 keys fixes | Variable selon répartition |
| **Config nb. full keys par sub block** | N/A | ✅ 0, 2, 4, 6 ou 8 (HD) ; 0, 2 ou 4 (4K) |
| **Additional keys par sub block** | N/A | ⚠ 0, 1 ou 2 (4K uniquement) — non disponibles HD |
| **SL Keys (keys 5-8)** | ✅ Si ≤ 4 keys sur le bloc | ✅ Un seul sub block peut utiliser les SL Keys |

> Menu de configuration : Home > Setup > Switcher > Config > M/E Assign > [No. of full keys]

---

## DME

| Critère | M/E Normal | M/E Splitté |
|---|---|---|
| **Emplacements DME simultanés** | 2 (2 keys OU key + image effect) | ✅ 1 canal DME par sub block (2 au total pour le bloc physique) |
| **DME Wipe sur le background** | ✅ Disponible | ✅ 1 canal DME par sub block |

> En M/E Split, chaque sub block gère ses DME **indépendamment**.

---

## Modes d'opération disponibles par sub block

| Mode | M/E Normal | M/E Splitté |
|---|---|---|
| **Standard** | ✅ | ✅ (sur chaque sub block) |
| **Multi Program** | ✅ | ✅ (Out5-Out8 indisponibles) |
| **Multi Program 2** | ✅ | ❌ Non disponible |
| **DSK** | ✅ (P/P uniquement) | ✅ (P/P uniquement, sorties réduites à 4) |

---

## Impact sur les sorties

| Contexte | M/E Normal | M/E Splitté |
|---|---|---|
| **Mode Standard — Out1-Out4** | PGM1, PVW1, Clean, K-PVW1 (fixes) | Identique |
| **Mode Multi Program — Out1-Out8** | Out1 fixe + Out2-Out8 librement assignables | Out1 fixe + Out2-Out4 assignables — **Out5-Out8 indisponibles** |
| **Mode DSK — sorties** | 6 fixes : PGM1, PGM2, PGM3, PGM4, K-PVW1, K-PVW2 | 4 fixes : PGM1, PGM2, K-PVW1, K-PVW2 (PGM3/4 et Out5-6 disparaissent) |

> Perte de **4 sorties configurables** en mode Multi Program quand M/E Split est actif.

---

## Assignation M/E logique

| Critère | M/E Normal | M/E Splitté |
|---|---|---|
| **Assignation logique** | 1 M/E logique (M/E-1 à M/E-5 ou P/P) par bloc physique | 1 M/E logique par sub block — le bloc physique porte 2 assignations M/E logiques |

> Menu : Home > Setup > Switcher > Config > M/E Assign

---

## Snapshots et flash prevention

| Critère | M/E Normal | M/E Splitté |
|---|---|---|
| **Flash prevention bus** | Configuré par banque M/E | ⚠ À configurer séparément pour chaque sub block |
| **Transitions indépendantes** | ❌ 1 seul programme | ✅ Chaque sub block gère son propre programme et ses transitions |

> C'est l'**intérêt principal du M/E Split** : deux flux vidéo indépendants depuis un seul bloc hardware.

---

## Liens

- [[MLS-X1 - Modes d'opération banque switcher (Standard, Multi Program, Multi Program 2)]]
- [[MLS-X1 - Ressources par configuration (4K vs HD)]]
- [[MLS-X1 - Notes importantes et restrictions]]
- [[MOC - Sony MLS-X1]]
