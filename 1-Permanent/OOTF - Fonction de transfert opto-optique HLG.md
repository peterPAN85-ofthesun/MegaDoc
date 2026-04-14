---
type: permanent
created: 2026-04-08 11:00
tags:
  - permanent
  - uhd-hdr
  - colorimétrie
  - gamma
---

# OOTF - Fonction de transfert opto-optique HLG

> [!abstract] Concept
> L'OOTF (Opto-Optical Transfer Function) transforme la lumière de scène (capteur) en luminance d'affichage, sans passer par le signal électrique intermédiaire. En HLG, l'OOTF est non-linéaire et dépend de la luminance de crête du moniteur, ce qui est central dans le transcoding HDR.

## Explication

L'OOTF est le troisième maillon de la chaîne de transfert HDR, à côté de l'OETF et de l'EOTF.

| Fonction | Entrée | Sortie | Appliquée par |
|---|---|---|---|
| OETF | Lumière de scène | Signal électrique (numérique) | Caméra |
| EOTF | Signal électrique (numérique) | Luminance d'affichage (cd/m²) | Moniteur |
| **OOTF** | **Lumière de scène** | **Luminance d'affichage (cd/m²)** | **Combinaison caméra + moniteur** |

L'OOTF est mathématiquement la composition de l'OETF et de l'EOTF :
```
OOTF = EOTF ∘ OETF  (la scène → le signal → l'affichage)
```

### OOTF en HLG

En HLG, l'OOTF est **non-linéaire** et dépend de la luminance de crête du display (Lw) :
- Pour un display 1000 cd/m² : **γ = 1,2**
- L'OOTF HLG introduit un "look" légèrement plus contrasté par rapport au SDR

Ce comportement est intentionnel : HLG est conçu pour que l'image paraisse correcte sur n'importe quel niveau de luminance d'écran, avec une adaptation automatique.

### Rôle dans le transcoding PQ↔HLG

Le HLG inverse EOTF (noté HLG EOTF⁻¹) n'est pas simplement l'inverse de l'EOTF HLG, mais la combinaison :
```
HLG inverse EOTF = HLG inverse OOTF + HLG OETF
```

Ceci est crucial dans le transcoding PQ→HLG :
1. On décode le PQ avec son EOTF → on obtient le **display light** (luminance linéaire en cd/m²)
2. On applique le HLG inverse OOTF pour convertir ce display light en "scène light équivalente"
3. On encode avec le HLG OETF pour obtenir le signal HLG final

## Exemples

### Chaîne complète HDR HLG

```
Scène → [OETF HLG] → Signal HLG → [EOTF HLG] → Display light
       (caméra)                    (moniteur)
       |_________________OOTF HLG_________________|
```

### Transcoding PQ → HLG

```
PQ signal → [PQ EOTF] → Display light (cd/m²) → [HLG inv. OOTF + HLG OETF] → HLG signal
```

## Connexions

### Notes liées
- [[Gamma vidéo - OETF et EOTF]] — définition de l'OETF et l'EOTF, précurseurs de l'OOTF
- [[Transcoding HDR - PQ vers HLG via Display Light]] — utilise HLG inverse OOTF dans sa chaîne
- [[HLG - Hybrid Log Gamma]] — l'OOTF HLG est caractéristique de ce standard
- [[Display Light vs Scene Light - Conversion SDR vers HDR]] — la distinction display/scene light est liée à l'OOTF

### Contexte
Comprendre l'OOTF est indispensable pour saisir pourquoi le transcoding HDR passe toujours par le "display light" comme référence intermédiaire. C'est le seul point commun et invariant entre PQ et HLG.

## Source

- ITU-R BT.2408, ITU-R BT.2100
- Formation IIFA / Média 180, 2026-04-08 — [[0-Inbox/Formation UHD - HDR J2]]

---

**Tags thématiques** : `#uhd-hdr` `#ootf` `#gamma` `#colorimétrie` `#hlg`
