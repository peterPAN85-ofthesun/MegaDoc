---
type: permanent
created: 2026-04-08 11:00
tags:
  - permanent
  - uhd-hdr
  - lut
  - broadcast
  - production
---

# LUT broadcast HDR - Types BBC et interpolation

> [!abstract] Concept
> La BBC définit trois types de LUT (I, II, III) selon la gestion des plages de signal. En broadcast HDR, le Type III est le standard recommandé : il travaille en narrow-range mais traite le signal en full-range pour préserver la marge (headroom). En régie, on utilise des LUT 3D 33×33×33 avec interpolation Tetrahedral.

## Explication

### LUT 1D vs LUT 3D

**LUT 1D** : transforme chaque canal de couleur (R, G, B) indépendamment, sans tenir compte des deux autres. Conversion simple et rapide mais limitée : elle ne peut pas modifier la saturation indépendamment du contraste.
→ Usage : affichage monitoring simple, corrections globales (gamma, brightness).

**LUT 3D** : organise les correspondances colorimétrique dans une matrice tridimensionnelle (R×G×B). Permet de faire correspondre des espaces colorimétriques complexes.

Résolutions courantes :
- **33 × 33 × 33** : résolution broadcast
- **65 × 65 × 65** : résolution post-production (plus précis, plus lourd)

Méthodes d'interpolation entre les points de la grille :
- **Trilinear** : interpolation linéaire dans les 3 dimensions — suffisant pour le monitoring
- **Tetrahedral** : découpe le cube en tétraèdres pour une interpolation plus précise — recommandé pour la production

### Les trois types de LUT BBC

| Type | Input signal range | LUT processing range | Output signal range | Headroom |
|---|---|---|---|---|
| **I** | Full ou Narrow | Nominal | Nominal | Non |
| **II** | Full | Full | Narrow avec headroom | Oui |
| **III** | Narrow avec headroom | Full | Narrow avec headroom | Oui |

**Type I** : utilisées en full- ou narrow-range, avec une mise à l'échelle ("scaling") externe. Exemple : Sony S-Log3 vers format narrow-range HLG TV.

**Type II** : permettent la conversion de contenus full-range (cinéma ITU-R BT.2100 PQ) ou gestion des zones over/under. Usage cinéma/post-production.

**Type III** : conçues pour les signaux narrow-range (TV). Elles effectuent le traitement sur la **totalité du signal en full-range**, y compris la marge (headroom). **Les plus appropriées pour le travail en télévision.**

### Configuration recommandée en régie broadcast

> En régie pour de la diffusion : LUT 3D, 33×33×33, interpolation Tetrahedral, Type III, 10 bits.

### Gestion des plages signal dans l'IMAGINE SNP

L'IMAGINE SNP (Selenio Network Processor) illustre concrètement la gestion des plages :

**Entrée (SDI IN → LUT 3D) :**

| Mode           | SDI IN | Mapping LUT                       |
| -------------- | ------ | --------------------------------- |
| Full/Wide      | 0–1023 | 0→1 (rectangle)                   |
| Narrow/Nominal | 64–940 | 0→1 (trapèze, headroom extrapolé) |

**Sortie (LUT 3D → SDI OUT) :**

| Mode           | Mapping LUT | SDI OUT |
| -------------- | ----------- | ------- |
| Full/Wide      | 0→1         | 0–1023  |
| Narrow/Nominal | 0→1         | 64–940  |

→ Combinaison recommandée broadcast : **Narrow/Nominal en entrée ET en sortie** avec LUT Type III.

## Cas d'usage

- Conversion SDR→HDR HLG en régie live (LUT 3D Type III, 33³, Tetrahedral)
- Transcoding PQ→HLG encapsulé dans une LUT hardware (Imagine SNP, Grass Valley...)
- Monitoring SDR depuis un flux HDR (LUT 1D suffisante pour vérification rapide)

## Connexions

### Notes liées
- [[Transcoding HDR - PQ vers HLG via Display Light]] — les LUTs peuvent encapsuler ce transcoding
- [[Conversions HDR-SDR - Tone Mapping Inverse TM Direct Mapping]] — les LUTs implémentent ces conversions
- [[Display Light vs Scene Light - Conversion SDR vers HDR]] — la chaîne de conversion est implémentée en LUT
- [[Narrow Range vs Full Range - Plages de codage vidéo]] — distinction full/narrow range fondamentale pour les types de LUT
- [[Workflow production simultanée HDR-SDR]] — les LUTs sont les blocs élémentaires du workflow

### Ressources
- LUTs recommandées par NBCU : [NBCUniversal UHD-HDR-SDR LUTs](https://github.com/digitaltvguy/NBCUniversal-UHD-HDR-SDR-Single-Master-Production-Workflow-Recommendation-LUTs)

### Contexte
Les LUTs sont les "briques" hardware de toute chaîne HDR broadcast. Comprendre les types BBC permet de choisir la bonne configuration selon le matériel (Imagine SNP, Grass Valley Alchemist, etc.) et d'éviter des erreurs de niveaux dans les conversions.

## Source

- Source : BBC Research & Development
- Formation IIFA / Média 180, 2026-04-08 — [[0-Inbox/Formation UHD - HDR J2]]

---

**Tags thématiques** : `#uhd-hdr` `#lut` `#broadcast` `#bbc` `#production` `#imagine-snp`
