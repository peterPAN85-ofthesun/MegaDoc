---
type: permanent
created: 2026-03-11
tags:
  - permanent
  - broadcast
  - sony
  - mls-x1
  - switcher
  - matériel
  - licences
---

# MLS-X1 - Référentiel matériel (modèles, cartes, licences)

> [!abstract] Concept
> Le système MLS-X1 est composé de caissons switcher (boxes), de cartes optionnelles, de licences logicielles et de panels de contrôle. La distinction clé est entre le MLS-X1 (GPU intégré) et le MLS-X1S (sans GPU de série), qui détermine quelles fonctionnalités avancées sont disponibles nativement.

## Source

User's Guide MLS-X1S/MLS-X1 – Couverture, pp.17-23, 66-71

---

## Caissons switcher (boxes)

| Référence | Nom fonctionnel | Notes |
|---|---|---|
| **MLS-X1** | Live Production Processor (version standard) | GPU intégré en standard. Désigné aussi *box* ou *switcher*. |
| **MLS-X1S** | Live Production Processor (sans GPU de série) | Sans GPU en standard. GPU optionnel via MKS-X1600. Configurable en M/E box, cross-point box ou half box selon les cartes installées. |

---

## Cartes I/O et M/E

| Référence | Nom fonctionnel | Type | Notes |
|---|---|---|---|
| **MKS-X1110** | IP Input & Output Board | Carte I/O | Entrée/sortie IP (ST 2110). 2 cartes → M/E box. 1 carte → Half box. 1 carte + MKS-X1140 → Cross-point box. |
| **MKS-X1115** | SDI Input & Output Board | Carte I/O | Entrée/sortie SDI (BNC). Même logique de configuration que MKS-X1110. |
| **MKS-X1140** | Cross-Point Connection Board | Carte XPT | Carte de connexion cross-point. Obligatoire pour créer une cross-point box. Seule cette carte → cross-point-only box. |
| **MKS-X1210** | Additional ME Board | Carte M/E | Carte M/E additionnelle. Optionnelle pour les cross-point-only box. |
| **MKS-X1211** | Primary ME Board | Carte M/E | Carte M/E primaire. Association avec carte I/O dans une cross-point-only box non garantie sans MKS-X1210. |

---

## Cartes optionnelles et interface

| Référence | Nom fonctionnel | Type | Notes |
|---|---|---|---|
| **MKS-X1600** | MLS-X1S GPU Board | Carte GPU | GPU optionnel pour MLS-X1S. Requis pour : DME, SL Key, Clip Player, niveau audio multi-viewer. |
| **MKS-X1700** | Legacy Interface Board | Carte interface | Active les connecteurs GPI 1 et 2 (D-Sub 25 pin) à l'arrière du caisson. |

---

## Câbles d'interconnexion

| Référence | Description |
|---|---|
| **MKS-XIC01** | Interconnection Cable court (entre caissons / island) |
| **MKS-XIC03** | Interconnection Cable moyen |
| **MKS-XIC15** | Interconnection Cable long |

---

## Licences logicielles

| Référence | Nom fonctionnel | Notes |
|---|---|---|
| **MZS-X1500** | 4K Upgrade License | Requise pour utiliser le format 4K (2160P 2SI). |
| **MZS-X1610** | 3D DME License | Requise pour activer les effets DME. Nécessite aussi MKS-X1600 sur MLS-X1S. |
| **MZS-X1620** | SL Key License | Requise pour activer les SL Keys (keys 5-8). Nécessite aussi MKS-X1600 sur MLS-X1S. |
| **MZS-X1720** | Multi Viewer License | Licence pour le multi viewer avancé. |
| **MZS-X1750** | HDR Converter License | Requise pour activer le convertisseur HDR. Non disponible en 720P. |
| **MZS-X1770** | Licence (fonction non précisée) | Référencée en couverture. Détails non détaillés dans ce guide. |
| **MZS-X1800** | Clip Player License | Requise pour activer le clip player. Nécessite aussi MKS-X1600 sur MLS-X1S. |
| **MZS-X1SN** | Licence système (non précisée) | Référencée en couverture. |
| **MLSU-X1** | MLS-X1 Upgrade (non précisé) | Référencé en couverture. |

---

## Panels de contrôle — ICP-X7000 (panel intégré modulaire)

| Référence | Nom fonctionnel | Notes |
|---|---|---|
| **ICP-X7000** | Integrated Control Panel | Panel modulaire principal. Jusqu'à 14 rangées de modules. Connexion PoE+ (RJ-45, 1000BASE-T). Max 2 panels par switcher. |
| **MKS-X7075** | Extension Adaptor | Permet d'étendre la connectique du panel. |

### Modules pour ICP-X7000

| Référence | Nom fonctionnel | Type | Notes |
|---|---|---|---|
| **MKS-X7017** | Cross-Point Module (36 boutons) | Module XPT/AUX | Utilisable en Cross-Point Control Block ou AUX Bus Control Block. |
| **MKS-X7018** | Cross-Point Module (28 boutons) | Module XPT/AUX | Même usage que MKS-X7017. |
| **MKS-X7019** | Cross-Point Module (20 boutons) | Module XPT/AUX | Même usage que MKS-X7017. |
| **MKS-X7020** | Transition Control Block Module | Module transition | Actif uniquement en rangée M/E bank. |
| **MKS-X7021** | Transition Control Block Module (Simple Type) | Module transition | Version simplifiée. Gère uniquement les transitions background. |
| **MKS-X7023** | Independent Key Transition Control Block Module | Module key transition | Actif uniquement en rangée M/E bank. |
| **MKS-X7024** | Flexi Pad Control Block Module | Module flexi pad | Pavé de raccourcis assignables. Actif uniquement en rangée M/E bank. |
| **MKS-X7026** | Numeric Keypad Control Block Module | Module clavier numérique | Maximum 1 par panel. |
| **MKS-X7031TB** | Device Control Block Module | Module device | Contrôle des équipements externes (VTR, disk recorder, etc.). Maximum 1 par panel. |
| **MKS-X7032** | Key Fader Control Block Module | Module key fader | Jusqu'à 4 modules par panel. |
| **MKS-X7033** | Utility/Shotbox Control Block Module | Module utility/shotbox | Jusqu'à 2 modules par panel. |
| **MKS-X7035** | Key Control Block Module | Module key | Jusqu'à 4 modules par panel. |
| **MKS-X7040** | Module (non précisé) | Module ICP-X7000 | Référencé en couverture. |
| **MKS-X7041** | Module (non précisé) | Module ICP-X7000 | Référencé en couverture. |
| **MKS-X7042** | Module (non précisé) | Module ICP-X7000 | Référencé en couverture. |

---

## Panels de contrôle — ICP-X1000 (panels compacts)

| Référence | Description | Notes |
|---|---|---|
| **ICP-X1224** | Panel compact 24 faders, 2 rangées XPT | Connexion réseau LAN A1/A2/B (RJ-45, 1000BASE-T). |
| **ICP-X1216** | Panel compact 16 faders, 2 rangées XPT | |
| **ICP-X1124** | Panel compact 24 faders, 1 rangée XPT | |
| **ICP-X1116** | Panel compact 16 faders, 1 rangée XPT | |

---

## Liens

- [[MLS-X1 - Ressources par configuration (4K vs HD)]]
- [[MLS-X1 - Notes importantes et restrictions]]
- [[MOC - Sony MLS-X1]]
