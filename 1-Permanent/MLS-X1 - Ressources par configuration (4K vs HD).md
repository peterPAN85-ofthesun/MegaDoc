---
type: permanent
created: 2026-03-11
tags:
  - permanent
  - broadcast
  - sony
  - mls-x1
  - switcher
---

# MLS-X1 - Ressources par configuration (4K vs HD)

> [!abstract] Concept
> Le MLS-X1 propose différentes configurations matérielles (half box, cross-point box, M/E box) qui déterminent directement le nombre de ressources disponibles (banques, entrées/sorties, keys, DME…), et ces ressources sont systématiquement divisées par ~2 en 4K (UHD) par rapport au HD.

## Source

Documentation MLS-X1S/MLS-X1 User's Guide – Appendice « Number of Switcher Resources » (p.571-573)

---

## Configurations matérielles

| Abréviation | Description |
|---|---|
| **Half box** | Configuration minimale — 1 carte I/O seule |
| **1 cross-point box** | 1 carte I/O + 1 carte MKS-X1140 |
| **1 M/E box** | 2 cartes I/O (configuration M/E complète) |
| **1 M/E box + cross-point** | M/E box + cross-point box dans le même système |
| **2 M/E box** | 2 M/E box (+ cross-point-only) |

---

## Banques switcher (M/E)

| Mode | Half box | 1 XPT box | 1 M/E box | 1 M/E + XPT | 2 M/E box |
|---|---|---|---|---|---|
| **Normal — 4K** | 1 | 1 | 2 | 3 | 4 |
| **Normal — HD** | 2 | 2 | 4 | 6 | 6 |
| **M/E Split — 4K** | 2 | 2 | 4 | 6 | 6 |
| **M/E Split — HD** | 4 | 4 | 6 | 6 | 6 |

> Le plafond système est **6 banques** en HD. Le M/E Split double les banques disponibles à hardware égal.

---

## Entrées / Sorties

| Ressource | Half box | 1 XPT box | 1 M/E box | 1 M/E + XPT | 2 M/E box |
|---|---|---|---|---|---|
| **Entrées totales — 4K** | 16 | 16 | 32 | 48 | 64 |
| **Entrées totales — HD** | 32 | 32 | 64 | 96 | 128 |
| **Sorties Output — 4K** | 16 | 16 | 32 | 16 | 32 |
| **Sorties Output — HD** | 32 | 32 | 64 | 32 | 64 |
| **Dedicated Out — 4K** | – | – | – | 32 | 32 |
| **Dedicated Out — HD** | – | – | – | 64 | 64 |

> Les **Dedicated Outputs** ne sont disponibles qu'à partir de la configuration **1 M/E box + cross-point box**.

---

## Keys

| Ressource | Half box | 1 XPT box | 1 M/E box | 1 M/E + XPT | 2 M/E box |
|---|---|---|---|---|---|
| **Keys totales — 4K** | 6 | 6 | 12 | 18 | 24 |
| **Keys totales — HD** | 16 | 16 | 32 | 48 | 48 |
| **Keys avec resizer — 4K** | 4 | 4 | 8 | 12 | 16 |
| **Keys avec resizer — HD** | 16 | 16 | 32 | 48 | 48 |
| **Keys par banque** | 6 (4K) / 8 (HD) | 6/8 | 6/8 | 6/8 | 6/8 |

> En 4K, si ≤ 4 keys sur une banque, les **SL Keys** (keys 5-8) peuvent être utilisées.

---

## DME (Digital Multi-Effect)

| Ressource | Half box | 1 XPT box | 1 M/E box | 1 M/E + XPT | 2 M/E box |
|---|---|---|---|---|---|
| **Canaux DME — 4K** | 2 | 2 | 2 | 4 | 4 |
| **Canaux DME — HD** | 4 | 4 | 4 | 4 | 4 |
| **DME enhanced ch.1 ou 2 (HD)** | 3 | 3 | 3 | 3 | 3 |
| **DME enhanced ch.1 ET 2 (HD)** | 2 | 2 | 2 | 2 | 2 |
| **DME enhanced ch.1 ou 3 (4K)** | 1 | 1 | 1 | 3 | 3 |
| **DME enhanced ch.1 ET 3 (4K)** | – | – | – | 2 | 2 |

> En 4K : DME et SL Keys sont **mutuellement exclusifs** par box (licence MZS-X1620).

---

## Autres ressources

| Ressource | Half box | 1 XPT box | 1 M/E box | 1 M/E + XPT | 2 M/E box |
|---|---|---|---|---|---|
| **Multi viewers — 4K** | 1 | 1 | 2 | 3 | 4 |
| **Multi viewers — HD** | 2 | 2 | 4 | 4 | 4 |
| **Sorties frame memory — 4K** | 6 | 6 | 6 | 12 | 12 |
| **Sorties frame memory — HD** | 16 | 16 | 16 | 16 | 16 |
| **Sorties clip player — 4K/HD** | 2/4 | 2/4 | 2/4 | 2/4 | 2/4 |
| **Fonds de couleur — 4K/HD** | 1/2 | 1/2 | 1/2 | 1/2 | 1/2 |

---

## Liens

- [[MLS-X1 - Référentiel matériel (modèles, cartes, licences)]]
- [[MLS-X1 - M-E Normal vs M-E Split]]
- [[MLS-X1 - Modes d'opération banque switcher (Standard, Multi Program, Multi Program 2)]]
- [[MLS-X1 - Notes importantes et restrictions]]
- [[MOC - Sony MLS-X1]]
