---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - codec
  - production
---

# CODECs UHD-HDR 10 bits compatibles

> [!abstract] Concept
> La compatibilité UHD-HDR nécessite un codec supportant au minimum 10 bits. La plupart des formats pro 10 bits sont compatibles : Apple ProRes 422/4444, Avid DNxHR, Sony XAVC-I, Panasonic AVC-Intra et HEVC UHD.

## Explication

Le passage de 8 bits à **10 bits** est un prérequis fondamental pour le workflow UHD-HDR. En 8 bits, la plage de 256 niveaux est insuffisante pour encoder la dynamique étendue du HDR sans bandage (posterisation) dans les gradients. Les 1024 niveaux du 10 bits offrent un rendu lisse même sur la courbe PQ ou HLG.

### Tableau des CODECs compatibles UHD-HDR

| Codec | Sampling | Notes |
|-------|----------|-------|
| **Apple ProRes 422** (Proxy, LT, Std, HQ) | 4:2:2 | Famille ProRes toujours en **10 bits** |
| **Apple ProRes 4444** (et XQ) | 4:4:4 | Supporte 12 bits + canal alpha 16 bits |
| **Avid DNxHR HQX** | 4:2:2 | Suffixe "X" = version **10 bits** (ou 12 bits) |
| **Avid DNxHR 4K** | 4:4:4 | Format de masterisation 12 bits, pleine résolution couleur |
| **Sony XAVC-I (Intra)** | 4:2:2 | Version MVC haute qualité, toujours **10 bits** |
| **Sony XAVC-L (Long GOP)** | 4:2:0 | 10 bits efficace ⚠️ certains modes XAVC-L AVC/HD = 8 bits |
| **Panasonic AVC-Intra 100/200** | 4:2:2 | Toujours **10 bits** |
| **Panasonic Ultra HD / HEVC** | 4:2:2 à 4:2:0 | HEVC 4K moderne généralement **10 bits** pour profils HDR |

> [!warning]
> Certains modes XAVC-L (Long GOP) et XAVC-S peuvent être en 8 bits en mode AVC/HD. Toujours vérifier le mode d'enregistrement actif sur la caméra Sony.

### Espace colorimétrique cible
Les CODECs 10 bits sont des contenants — c'est le paramétrage de la caméra/encodeur qui détermine si le contenu est en Rec.709, Rec.2020, HLG ou PQ. Un ProRes 422 10 bits peut indifféremment transporter du SDR Rec.709 ou du HLG Rec.2020.

## Exemples

### Exemple 1 — Choix codec pour une production UHD live
Pour un direct UHD HLG : **XAVC-I 4:2:2 10 bits** (caméra Sony) → MXF XAVC dans un wrapper Op1a → livraison PAD FTV UHD 50p.

### Exemple 2 — Masterisation en post
Workflow DaVinci Resolve pour un documentaire UHD HDR10 :
- Entrée : ProRes 4444 12 bits (rushes caméra)
- Travail : RGB 32 bits flottants
- Livraison : ProRes 422 HQ 10 bits (proxy) + MXF XAVC 4K Classe 300 (master diffusion)

## Cas d'usage

- **Production live broadcast** : Sony XAVC-I, Panasonic AVC-Intra — robustesse et débit maîtrisé
- **Post-production et étalonnage** : Apple ProRes 4444 12 bits, DNxHR 4K — qualité maximale
- **Distribution compressée** : HEVC 10 bits (streaming UHD, livraison disque)
- **Livraison broadcast** : MXF Op1a XAVC selon les normes PAD FTV

## Avantages et inconvénients

✅ **Avantages des codecs 10 bits** :
- Compatibilité avec tous les workflows HDR (HLG, PQ, S-Log)
- Gradients lisses dans les aplats et les ciels
- Pérennité pour les conversions futures

❌ **Inconvénients / Vigilance** :
- Confusion 8/10 bits possible sur certains modes (XAVC-L)
- Débits plus élevés (ProRes 4444 >> ProRes 422)
- Licences propriétaires pour certains formats (XAVC, DNxHR)

## Connexions

### Notes liées
- [[Sous-échantillonnage chromatique - 4:2:2 4:4:4 4:2:0]] — chaque codec a son sampling par défaut
- [[Normes PAD FTV - Formats de livraison broadcast]] — spécifie les codecs acceptés pour la livraison FTV
- [[Transition HD vers UHD - Quatre axes d'amélioration]] — le 10 bits est l'un des 4 axes UHD

### Dans le contexte de
- [[HDR - Définition et deux dimensions]] — le 10 bits est prérequis pour encoder la dynamique HDR
- [[MOC - UHD & HDR]] — choix codec en production UHD

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]] (image 20260407_115904.jpg)
- Norme : EBU R124 (recommandations codec broadcast)

---

**Tags thématiques** : `#codec` `#uhd-hdr` `#prores` `#xavc` `#10bits`

## Images sources

![[20260407_115904.jpg]]
