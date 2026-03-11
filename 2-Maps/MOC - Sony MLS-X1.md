---
type: moc
created: 2026-03-11
updated: 2026-03-11
tags:
  - moc
  - broadcast
  - sony
  - mls-x1
  - switcher
---

# MOC - Sony MLS-X1

Map of Content centralisée pour le Live Production Processor Sony MLS-X1/MLS-X1S.

---

## Vue d'ensemble

Le **Sony MLS-X1** est un processeur de production live IP/SDI basé sur une architecture modulaire de caissons (boxes). Le système est hautement configurable : le nombre de ressources disponibles (banques, keys, DME, I/O…) dépend directement du nombre et du type de cartes installées, de la résolution (4K ou HD) et du mode d'opération des banques switcher.

**Domaines couverts** :
- Architecture matérielle (boxes, cartes, licences, panels)
- Ressources disponibles selon configuration et résolution
- Modes d'opération des banques switcher
- Gestion des flux vidéo (M/E Normal vs M/E Split)
- Lecture de contenu (Frame Memory vs Clip Player)
- Contraintes et exclusivités mutuelles

---

## Parcours recommandé

### Étape 1 : Comprendre le matériel
1. **Commencer par** : [[MLS-X1 - Référentiel matériel (modèles, cartes, licences)]]
   → Identifie les modèles (MLS-X1 / MLS-X1S), cartes I/O, cartes M/E, GPU, licences et panels

### Étape 2 : Dimensionner les ressources
2. **Puis** : [[MLS-X1 - Ressources par configuration (4K vs HD)]]
   → Tableau complet des ressources (banques, entrées/sorties, keys, DME) selon la config et la résolution

### Étape 3 : Configurer les banques switcher
3. **Choix du mode d'opération** : [[MLS-X1 - Modes d'opération banque switcher (Standard, Multi Program, Multi Program 2)]]
   → Comparatif Standard / Multi Program / Multi Program 2 : sorties, keys, transitions, DME
4. **Optimisation hardware** : [[MLS-X1 - M-E Normal vs M-E Split]]
   → Le M/E Split double les banques logiques mais est incompatible avec MP2

### Étape 4 : Lecture de contenu
5. **Choisir le bon outil** : [[MLS-X1 - Frame Memory vs Clip Player]]
   → FM = natif, polyvalent, courtes séquences ; Clip Player = option GPU/licence, contenus longs

### Étape 5 : Vérifier les contraintes
6. **Avant tout déploiement** : [[MLS-X1 - Notes importantes et restrictions]]
   → Exclusivités mutuelles, restrictions 4K, prérequis GPU/licences

---

## Règles critiques à retenir

> [!warning] Exclusivités mutuelles fondamentales
> - **4K** : DME et SL Keys sont mutuellement exclusifs par box
> - **M/E Split** et **Multi Program 2** sont mutuellement exclusifs
> - **M/E Split actif** supprime Out5-Out8 en mode Multi Program
> - **Clip Player** et **DME** nécessitent tous deux le GPU (MKS-X1600)

> [!info] Effet de la résolution
> Les ressources sont systématiquement **divisées par ~2** en 4K par rapport au HD (entrées, banques, keys, DME…)

---

## Résumé des prérequis par fonction

| Fonction | Carte requise | Licence requise |
|---|---|---|
| Format 4K (2160P) | — | MZS-X1500 |
| DME | MKS-X1600 (sur MLS-X1S) | MZS-X1610 |
| SL Keys (keys 5-8) | MKS-X1600 (sur MLS-X1S) | MZS-X1620 |
| Clip Player | MKS-X1600 (sur MLS-X1S) | MZS-X1800 |
| Multi Viewer avancé | MKS-X1600 (audio) | MZS-X1720 |
| HDR Converter | — | MZS-X1750 |
| GPI (D-Sub 25 pin) | MKS-X1700 | — |

---

## Notes permanentes liées

- [[MLS-X1 - Référentiel matériel (modèles, cartes, licences)]]
- [[MLS-X1 - Ressources par configuration (4K vs HD)]]
- [[MLS-X1 - Modes d'opération banque switcher (Standard, Multi Program, Multi Program 2)]]
- [[MLS-X1 - M-E Normal vs M-E Split]]
- [[MLS-X1 - Frame Memory vs Clip Player]]
- [[MLS-X1 - Notes importantes et restrictions]]

---

## Notes connexes dans le vault

- [[MOC - SMPTE 2110 & Broadcast IP]]
