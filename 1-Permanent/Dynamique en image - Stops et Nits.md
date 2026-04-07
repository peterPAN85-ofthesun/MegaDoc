---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - colorimétrie
  - dynamique
---

# Dynamique en image - Stops et Nits

> [!abstract] Concept
> La dynamique d'une image est le rapport entre le signal lumineux le plus élevé et le plus bas. Elle se mesure en **stops** (doublements de la quantité de lumière) pour la capture et en **nits** (cd/m²) pour l'affichage.

## Explication

La **dynamique** (ou plage dynamique) représente l'écart entre le niveau de noir le plus sombre et le blanc le plus brillant qu'un système peut reproduire simultanément. C'est l'une des deux dimensions clés du HDR (avec l'espace colorimétrique).

**Le stop** est l'unité de mesure en photographie et en prise de vue : chaque stop correspond à un doublement (×2) ou une réduction de moitié (÷2) de la quantité de lumière. Ainsi :
- 1 stop de plus = signal ×2
- 1 stop de moins = signal ÷2
- n stops = rapport de 2ⁿ

Les capteurs modernes de cinéma atteignent ~15 stops, les capteurs broadcast pro environ 12-14 stops. L'œil humain peut percevoir ~20 stops en adaptation dynamique locale.

**Le nit** (cd/m² — candela par mètre carré) est l'unité de luminance d'un écran :
- 1 nit = luminosité produite par une bougie (approximation historique)
- Écran SDR de référence broadcast : **100 nits** (blanc à 100%)
- Écran HDR grand public : 400 à 1000 nits
- Écran HDR professionnel cinéma : jusqu'à 4000 nits
- En HDR HLG, le **blanc de référence à 203 nits (75%)** correspond au 100% SDR (100 nits)

L'échelle SDR (0-100 nits) est **relative** : le blanc est défini par l'écran. L'échelle PQ (0-10 000 nits) est **absolue** : chaque valeur correspond à une luminance précise.

## Exemples

### Exemple 1 — Comparaison dynamique SDR vs HDR
| Standard | Niveau noir | Niveau blanc | Dynamique approx. |
|----------|-------------|--------------|-------------------|
| SDR      | 0,1 nit     | 100 nits     | ~10 stops         |
| HLG HDR  | 0,005 nit   | 1000 nits    | ~14 stops         |
| PQ HDR   | 0,0001 nit  | 10 000 nits  | ~17 stops         |

### Exemple 2 — HLG et référence SDR
En diffusion HLG : le niveau 75% du signal correspond à 203 nits → c'est ce niveau qui est mappé sur le blanc SDR (100 nits). La conversion HLG→SDR applique donc une réduction de 10 dB (÷3,16 en luminance).

## Cas d'usage

- **Stops** : Mesure de la capacité d'un capteur/système de capture, communication entre chef opérateur et étalonneur
- **Nits** : Spécification des écrans, calibration des moniteurs de référence, specs de livraison
- **Rapport stops/nits** : Conversion technique lors du passage SDR↔HDR

## Avantages et inconvénients

✅ **Avantages d'une grande dynamique** :
- Détails préservés dans les ombres et les hautes lumières
- Images plus proches de la perception humaine
- Flexibilité de post-production (récupérer des détails écrêtés)

❌ **Contraintes** :
- Monitoring plus exigeant (moniteurs de référence HDR coûteux)
- Gestion complexe des conversions SDR↔HDR
- Standards non universellement adoptés par tous les diffuseurs

## Connexions

### Notes liées
- [[HDR - Définition et deux dimensions]] — la dynamique est l'une des deux dimensions du HDR
- [[HLG - Hybrid Log Gamma]] — définit une dynamique de ~14 stops avec référence à 203 nits
- [[PQ - Perceptual Quantizer]] — courbe absolue jusqu'à 10 000 nits

### Dans le contexte de
- [[Gamma vidéo - OETF et EOTF]] — les courbes de transfert encodent la dynamique
- [[MOC - UHD & HDR]] — concept fondamental pour comprendre le HDR

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]]
- Norme : ITU-R BT.2100 (dynamique HDR)

---

**Tags thématiques** : `#dynamique` `#stops` `#nits` `#uhd-hdr` `#colorimétrie`
