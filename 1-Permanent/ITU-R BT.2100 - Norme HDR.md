---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - hdr
  - norme
---

# ITU-R BT.2100 - Norme HDR

> [!abstract] Concept
> ITU-R BT.2100 est la norme internationale qui définit le cadre complet de la vidéo HDR haute qualité : deux courbes de transfert (HLG et PQ), primaires Rec.2020, profondeur 10/12 bits, fréquences d'images 24 à 120p et point blanc D65.

## Explication

La norme **ITU-R BT.2100** (publiée en 2016, révisions ultérieures) est le document de référence pour la production et la diffusion vidéo HDR au niveau international. Elle unifie en un seul cadre normatif l'ensemble des paramètres techniques nécessaires à un workflow HDR cohérent.

**Composantes de BT.2100 :**

| Paramètre | Valeur |
|-----------|--------|
| Fréquences d'images | 24, 25, 30, 50, 60, 100, 120p |
| Profondeur de bits | 10 bits ou 12 bits |
| Primaires couleur | Rec.2020 (BT.2020) |
| Point blanc | D65 (6500K) |
| Courbes OETF/EOTF | HLG (ARIB STD-B67) et PQ (SMPTE ST 2084) |

**Deux systèmes HDR normalisés :**
BT.2100 normalise deux approches coexistantes et complémentaires :
- **HLG** : système relatif, rétro-compatible SDR, recommandé pour le broadcast live
- **PQ** : système absolu, meilleure précision, recommandé pour la distribution premium

La norme précise les OETF (caméra vers signal), EOTF (signal vers écran), et OOTF (Opto-Optical Transfer Function — conversion directe caméra vers écran) pour chaque système.

**Relation avec BT.2020 :**
BT.2100 réutilise les primaires couleur de Rec.2020 (BT.2020) pour l'espace colorimétrique, ajoutant la couche HDR par-dessus. BT.2020 définit l'espace couleur ; BT.2100 définit comment encoder et décoder la luminance dans cet espace.

## Exemples

### Exemple 1 — Schéma BT.2100
```
ITU-R BT.2100
├── Primaires : Rec.2020
├── Point blanc : D65
├── Fréquences : 24-120p
├── Bit depth : 10-12 bits
├── EOTF Option A : HLG (ARIB STD-B67)
└── EOTF Option B : PQ (SMPTE ST 2084)
```

### Exemple 2 — Produit conforme BT.2100
Une caméra Sony annoncée "BT.2100 compatible" : elle peut enregistrer en HLG ou PQ, espace Rec.2020, 10 bits minimum, jusqu'à 120p — garantissant l'interopérabilité avec tout équipement de post-production certifié BT.2100.

## Cas d'usage

- **Référence normative** : Spec de livraison, certification équipements
- **Diffuseurs** : France 2 (PQ), EBU membres (HLG recommandé pour live)
- **Fabricants d'équipements** : Caméras, moniteurs, encodeurs conformes BT.2100

## Avantages et inconvénients

✅ **Avantages** :
- Norme internationale unificatrice — interopérabilité garantie
- Deux options adaptées à différents usages (live vs distribution)
- Compatible avec les infrastructures existantes (10 bits, Rec.2020)

❌ **Inconvénients** :
- Coexistence HLG/PQ = complexité de chaîne
- Rec.2020 pas entièrement reproductible par les écrans actuels
- Migration coûteuse pour les diffuseurs

## Connexions

### Notes liées
- [[HLG - Hybrid Log Gamma]] — première option OETF de BT.2100
- [[PQ - Perceptual Quantizer]] — deuxième option EOTF de BT.2100
- [[Rec.2020 - Espace colorimétrique UHD]] — les primaires couleur de BT.2100
- [[Gamma vidéo - OETF et EOTF]] — BT.2100 étend la notion de courbe de transfert

### Dans le contexte de
- [[HDR - Définition et deux dimensions]] — BT.2100 codifie les deux dimensions HDR
- [[MOC - UHD & HDR]] — norme de référence du domaine

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]]
- Norme : ITU-R BT.2100 (révision 2018)

---

**Tags thématiques** : `#bt2100` `#hdr` `#norme` `#uhd-hdr` `#itu`

## Images sources

![[20260407_164944.jpg]]
![[20260407_164851.jpg]]
