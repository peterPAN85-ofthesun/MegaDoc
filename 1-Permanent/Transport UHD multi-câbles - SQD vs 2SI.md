---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - broadcast
  - sdi
  - transport
---

# Transport UHD multi-câbles - SQD vs 2SI

> [!abstract] Concept
> Pour transporter un signal UHD sur 4 câbles 3G (ou HD), deux méthodes existent : SQD (Square Division Quad) divise l'image en 4 quadrants spatiaux, tandis que 2SI (2 Sample Interleave) entrelace les pixels entre 4 liens de manière uniforme sur toute l'image.

## Explication

L'UHD 50p nécessite un débit de ~12G, transportable sur un seul câble 12G-SDI ou sur 4 câbles 3G-SDI. Dans ce dernier cas, deux méthodes de partage du signal existent :

**SQD — Square Division (Quad Split)**
L'image est découpée en **4 quadrants spatiaux** (haut-gauche, haut-droit, bas-gauche, bas-droit), chacun transporté sur un câble dédié. C'est la méthode la plus simple à comprendre et à câbler. Inconvénient majeur : si un câble est défaillant, **un quart de l'image disparaît**. Avantage de dépannage : on peut passer en mode SQD pour visualiser les quadrants séparément et identifier un câble croisé.

**2SI — 2 Sample Interleave**
Chaque câble transporte des **pixels non contigus entrelacés** prélevés uniformément sur l'ensemble de l'image. Concrètement, les pixels pairs/impairs en x et en y sont répartis sur les 4 liens. En cas de perte d'un câble, la qualité est dégradée sur l'**intégralité de l'image** (artefacts uniformes), mais il n'y a pas de perte totale d'un quart. Cette méthode est techniquement supérieure et recommandée en production.

> [!warning]
> **Attention au câblage des 4 liens !** Il ne faut pas croiser les câbles. Méthode de diagnostic : passer temporairement en SQD pour observer comment les quadrants s'affichent, puis recâbler en conséquence. Sur les caméras Sony, un marqueur "2SI" dans le menu permet de vérifier que le câblage en 2SI est correct.

## Exemples

### Exemple 1 — Câblage régie UHD
Une caméra UHD sort 4 câbles 3G numérotés 1-2-3-4. Branché sur le router SDI :
- **En SQD** : le moniteur montre 4 quadrants — si le coin haut-gauche est en bas-droit, câbles 1 et 3 sont croisés
- **En 2SI** : l'image semble "en bruit" si les câbles sont dans le désordre → rétablir l'ordre 1-2-3-4

### Exemple 2 — Résilience
Lors d'un direct, un câble 3G se débranche accidentellement :
- **SQD** : quart de l'image noir → dégrad majeur visible immédiatement
- **2SI** : image entière dégradée (trame manquante) → dégrad visible mais moins catastrophique

## Cas d'usage

- **SQD** : Dépannage et diagnostic de câblage, environnements simples où la fiabilité physique est garantie
- **2SI** : Production live professionnelle, toutes les applications où la robustesse prime
- **12G single link** : Solution idéale quand l'infrastructure le permet — élimine la complexité du multi-câble

## Avantages et inconvénients

✅ **Avantages 2SI** :
- Pas de perte totale d'un quart d'image en cas de défaillance
- Traitement de l'image plus uniforme (meilleure continuité spatiale des filtres)
- Standard recommandé pour la production HDR

❌ **Inconvénients 2SI** :
- Câblage plus critique (ordre des liens impératif)
- Dépannage moins intuitif qu'en SQD

✅ **Avantages SQD** :
- Diagnostic simple : un quadrant = un câble
- Plus simple à implémenter

❌ **Inconvénients SQD** :
- Perte de 25% de l'image si un câble défaille
- Traitements traversant les frontières de quadrants peuvent créer des artefacts

## Connexions

### Notes liées
- [[SDI - Débits et interfaces 1.5G 3G 12G]] — le transport multi-câble est une alternative au 12G
- [[VPID - Signalisation du signal vidéo SDI]] — le VPID identifie le mode de transport (SQD ou 2SI) dans le Byte 2
- [[Transition HD vers UHD - Quatre axes d'amélioration]] — contexte du besoin de transport UHD

### Dans le contexte de
- [[MOC - UHD & HDR]] — transport physique du signal UHD

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]]
- Normes : SMPTE ST 425-5 (2SI), SMPTE ST 425-3 (SQD)

---

**Tags thématiques** : `#sdi` `#broadcast` `#transport` `#uhd-hdr` `#sqd` `#2si`
