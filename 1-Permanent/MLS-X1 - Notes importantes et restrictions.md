---
type: permanent
created: 2026-03-11
tags:
  - permanent
  - broadcast
  - sony
  - mls-x1
  - switcher
  - licences
  - restrictions
---

# MLS-X1 - Notes importantes et restrictions

> [!abstract] Concept
> Compilation des contraintes et restrictions clés du MLS-X1 par domaine : 4K, DME, keys, sorties dédiées, Clip Player, HDR et configurations multi-M/E. Ces règles sont critiques pour la conception d'un système et le dimensionnement des ressources.

## Source

User's Guide MLS-X1S/MLS-X1 – Appendice « Number of Switcher Resources » (p.571-573) et notes générales

---

## 4K (UHD)

> [!warning] Restrictions 4K
> - Nécessite la licence **MZS-X1500 4K Upgrade License**
> - En 4K, seuls les connecteurs **INPUT impairs** sont activés (les numéros pairs sont désactivés)
> - Le **convertisseur de format** ne peut pas être utilisé en 2160P à 29.97, 25 ou 23.98 Hz
> - En 4K, pour chaque box : soit les **DME** soit les **SL Keys** peuvent être activés — **pas les deux simultanément** (MZS-X1620)

---

## DME (Digital Multi-Effect)

> [!warning] Prérequis DME
> - Nécessite la carte GPU **MKS-X1600** (option sur MLS-X1S) + licence **MZS-X1610 3D DME** pour chaque box
> - Le mode **enhanced** DME n'est disponible qu'en HD (ch.1 ou ch.2) ou 4K (ch.1 ou ch.3)

---

## Keys avec Resizer et SL Keys

> [!info] Règle SL Keys
> - Si le nombre de keys sur une seule banque switcher est **≤ 4**, les **SL Keys** (keys 5-8) peuvent être utilisées
> - Les SL Keys nécessitent MKS-X1600 + MZS-X1620
> - En 4K, activation explicite requise + DME exclusif sur la même box

---

## Dedicated Outputs

> [!info] Disponibilité des Dedicated Outputs
> Les sorties **Dedicated Out** ne sont disponibles qu'à partir de la configuration **1 M/E box + cross-point box**
> (pas disponibles en Half box, 1 cross-point box seule, ou 1 M/E box seule)

---

## Clip Player

> [!warning] Prérequis Clip Player
> - Nécessite la carte GPU **MKS-X1600** + licence **MZS-X1800 Clip Player** pour chaque box
> - En 4K, les 2 canaux Clip Player (Clip 1 et 2) sont liés et opèrent ensemble sur tous les box

---

## Correcteur HDR

> [!warning] Prérequis HDR
> - Nécessite la licence **MZS-X1750 HDR Converter License**
> - **Non disponible en 720P**

---

## Configurations 3 M/E et 4 M/E

> [!info] Configurations avancées
> - Les configurations **3 M/E box** et **4 M/E box** existent mais ne sont disponibles **qu'en 4K**
> - En HD, le nombre maximum de banques est plafonné à **6** dès la config 2 M/E + cross-point
> - Le M/E Split avec 4 M/E box n'augmente plus le nombre de banques (plafond déjà atteint)

---

## Exclusivités mutuelles (récapitulatif)

| Fonctions | Compatibles ? |
|---|---|
| **DME** + **SL Keys** (même box, 4K) | ❌ Mutuellement exclusifs |
| **M/E Split** + **Multi Program 2** | ❌ Mutuellement exclusifs |
| **M/E Split actif** + **Out5-Out8** (mode Multi Program) | ❌ Out5-Out8 indisponibles |
| **M/E Split actif** + **PGM3/PGM4** (mode DSK) | ❌ Indisponibles |
| **Multi Program 2** + **Transition Preview (TRANS PVW)** | ❌ Non disponible en MP2 |
| **Multi Program 2 sub** + **SL Keys** | ❌ SL Keys désactivées sur sub |
| **Multi Program 2 sub** + **Split faders** | ❌ Non disponibles sur sub bank |

---

## Liens

- [[MLS-X1 - Ressources par configuration (4K vs HD)]]
- [[MLS-X1 - Référentiel matériel (modèles, cartes, licences)]]
- [[MLS-X1 - Modes d'opération banque switcher (Standard, Multi Program, Multi Program 2)]]
- [[MLS-X1 - M-E Normal vs M-E Split]]
- [[MLS-X1 - Frame Memory vs Clip Player]]
- [[MOC - Sony MLS-X1]]
