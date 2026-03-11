---
type: permanent
created: 2026-03-11
tags:
  - permanent
  - broadcast
  - sony
  - mls-x1
  - switcher
  - multi-program
---

# MLS-X1 - Modes d'opération banque switcher (Standard, Multi Program, Multi Program 2)

> [!abstract] Concept
> Une banque switcher MLS-X1 peut fonctionner en trois modes d'opération — Standard, Multi Program (MP) et Multi Program 2 (MP2) — qui déterminent le nombre de sorties programme indépendantes, la gestion des keys/DME et les transitions disponibles. MP2 est le mode le plus avancé avec 2 flux vraiment indépendants (main + sub), mais incompatible avec M/E Split.

## Source

User's Guide MLS-X1S/MLS-X1 – pp.108, 117, 127, 145, 178, 260-263, 402, 430-433, 443, 571-573

---

## Vue d'ensemble des modes

| Critère | Standard | Multi Program | Multi Program 2 |
|---|---|---|---|
| **Programmes par banque** | 1 (PGM1) | Jusqu'à 4 (PGM1-4) | 2 flux indépendants (main + sub) |
| **Nature des flux** | 1 flux unique | Multiples sorties du même flux | 2 flux vraiment séparés |
| **M/E Split compatible** | ✅ | ✅ (Out5-Out8 indisponibles) | ❌ Incompatible |
| **Licence 4K (MZS-X1500)** | Si 2160P | Si 2160P | Si 2160P |

---

## Keys

| Critère | Standard | Multi Program | Multi Program 2 |
|---|---|---|---|
| **Keys par banque — HD** | 8 (Key 1-8) | 8 (Key 1-8) | 8 partagées main/sub |
| **Keys par banque — 4K** | 6 (Key 1-6) | 6 (Key 1-6) | 6 partagées main/sub |
| **Additional keys (4K)** | 2 parmi les 6 (pas de resizer) | 2 parmi les 6 | 2 parmi les 6 |
| **SL Keys (keys 5-8, GPU)** | ✅ Si ≤ 4 keys | ✅ Si ≤ 4 keys (DME exclusif en 4K) | ✅ Main uniquement — désactivées sur sub |
| **Key Priority** | ✅ Configurable librement | ⚠ Non modifiable selon transition | ⚠ Non modifiable selon transition |
| **Inhibit key par programme** | ❌ N/A | ❌ Non disponible | ✅ Keys 1-8 inhibables séparément sur main et sub |

> En 4K : **DME et SL Keys sont mutuellement exclusifs** par box (MZS-X1620).

---

## Sorties

| Critère | Standard | Multi Program | Multi Program 2 |
|---|---|---|---|
| **Sorties configurables** | 4 sorties fixes | Jusqu'à 8 (Out1-Out8) | Jusqu'à 8 (Out1-Out8) |
| **Out1** | PGM1 fixe | PGM1 fixe | PGM1 fixe |
| **Out2-Out4** | PVW1, Clean, K-PVW1 (fixes) | Librement assignables | Librement assignables |
| **Out5-Out8** | ❌ Indisponibles | ✅ PGM1-4, PVW1, Clean, K-PVW1-2 | ✅ PGM1-4, PVW1-2, Clean, Sub Clean, K-PVW1-2 |
| **Sub Clean** | ❌ | ❌ | ✅ Assignable Out2-Out8 |
| **Sub Preview (PVW2)** | ❌ | ❌ | ✅ Assignable Out2-Out8 |

> MP2 ajoute **PVW2** et **Sub Clean** vs Multi Program.

---

## Backgrounds et transitions

| Critère | Standard | Multi Program | Multi Program 2 |
|---|---|---|---|
| **Backgrounds par banque** | 1 paire A/B | 1 paire A/B (PGM2-4 partagent) | 2 paires A/B indépendantes (main + sub) |
| **Transitions indépendantes** | ❌ 1 seul programme | ❌ Une seule transition pour tous les PGM | ✅ Main et sub ont leurs propres transitions |
| **Transition Preview (TRANS PVW)** | ✅ | ✅ | ❌ Non disponible |
| **Preset Color Mix en next transition** | ✅ | ❌ Si key en next transition | ❌ Si key en next transition |
| **Pattern Limit** | ✅ Wipe / DME wipe | ⚠ Uniquement si background = wipe | ⚠ Uniquement si background = wipe |
| **Split faders** | ✅ | ✅ Main | ❌ Non disponibles sur sub bank |
| **Fader lever 2-stroke** | ✅ Correct | ✅ Correct | ⚠ Peut être incorrect si positions main/sub différentes |
| **Wipe patterns** | ✅ Tous | ✅ Tous | ⚠ Standard uniquement |
| **Pattern Mix / Split / Pairing / Modulation / Spiral** | ✅ | ✅ | ❌ |
| **Edge fill color matte** | ✅ Toutes options | ✅ Toutes options | ⚠ Flat color uniquement |
| **Multi réplication** | ✅ Tous types | ✅ Tous types | ⚠ 4 types uniquement |

> **Avantage principal de MP2** : deux transitions totalement indépendantes sur main et sub.

---

## DME

| Critère | Standard | Multi Program | Multi Program 2 |
|---|---|---|---|
| **Canaux DME — HD (1 M/E box)** | 4 | 4 | 4 |
| **Canaux DME — 4K (1 M/E box)** | 2 | 2 | 2 |
| **Emplacements DME simultanés** | 2 (2 keys OU key + image effect) | 2 | ⚠ 2 max partagés entre main ET sub |
| **DME Wipe 1-ch enhanced (HD)** | ✅ | ✅ | ✅ Séparé sur main ET sub |
| **DME Wipe 2-ch / 3-ch enhanced (HD)** | ✅ | ✅ | ⚠ Main OU sub uniquement |
| **Processed key — 1 canal DME** | ✅ Sur 2 keys | ✅ Sur 2 keys | ✅ Sur 2 keys (main et/ou sub) |
| **Processed key — 2-4 canaux DME** | ✅ Sur 1 key | ✅ Sur 1 key | ⚠ Sur 1 key (main OU sub) |
| **Image effect** | ✅ Bkgd A ou B | ✅ Bkgd A ou B | ✅ Sur 2 backgrounds (main et/ou sub) |

---

## Fonctions avancées MP2

| Critère | Standard | Multi Program | Multi Program 2 |
|---|---|---|---|
| **Re-entry entre programmes** | ❌ | ❌ | ✅ Si Extended Re-Entry activé (main↔sub) |
| **Recall simultané main/sub** | ❌ | ❌ | ⚠ Données main prioritaires |
| **MP2 Auto Correct (copy/move/swap)** | ❌ | ❌ | ✅ Configurable |
| **Copie / Swap config sur sub bank** | ✅ | ✅ | ❌ Non supporté sur sub bank |
| **Boutons assignables par programme** | ❌ | ❌ 1 seule assignation par banque | ✅ Dedicated mode : main/sub séparés |
| **MACRO ATTACH ENABLE / SHOW KEY** | ✅ Indépendants | ✅ Indépendants | ⚠ Communs à main et sub |
| **Macro attachments DME utility bus** | ✅ | ✅ | ❌ Non séparables main/sub |
| **Utility AUTO PVW** | ✅ | ✅ | ❌ Non disponible sur sub bank |

---

## Liens

- [[MLS-X1 - M-E Normal vs M-E Split]]
- [[MLS-X1 - Ressources par configuration (4K vs HD)]]
- [[MLS-X1 - Notes importantes et restrictions]]
- [[MOC - Sony MLS-X1]]
