---
type: permanent
created: 2026-04-08 11:00
tags:
  - permanent
  - uhd-hdr
  - normes
  - production
---

# ITU-R BT.2408 - Niveaux nominaux et bonnes pratiques production HDR

> [!abstract] Concept
> ITU-R BT.2408 (*Operational practices in HDR television production*) est la norme de référence pour les niveaux de signal et les pratiques de production en HDR broadcast. Elle fixe notamment le HDR Reference White à 203 nits PQ / 75% HLG.

## Explication

Là où BT.2100 définit les courbes de transfert (HLG, PQ), **BT.2408** définit comment on les utilise concrètement en production. C'est le document de référence opérationnel pour les équipes techniques broadcast.

La notion centrale est le **HDR Reference White** : le niveau de signal qui correspond au "blanc diffus" dans une scène HDR. En SDR, ce blanc était à 100% du signal. En HDR :
- En **PQ** : le HDR Reference White est à **203 nits** (code signal ~58% PQ)
- En **HLG** : le HDR Reference White est à **75% HLG**

Ce niveau laisse de la place au-dessus pour les spéculaires et les éclairages (jusqu'à 1000 cd/m²).

BT.2408 couvre également :
- Les niveaux indicatifs pour les objets courants (Grey Card 18%, niveaux de référence)
- Les **teintes de peaux** selon l'échelle Fitzpatrick
- Les pratiques de **conversion SDR↔HDR** (Display Light vs Scene Light)
- Les recommandations pour les LUTs et le **workflow de production simultanée HDR-SDR**

## Tableau des niveaux nominaux (PQ et HLG)

| Objet de référence | Luminance cd/m² (PQ 1000) | %PQ | %HLG |
|---|---|---|---|
| Grey Card 18% | ~26 | 26 | 38 |
| Greyscale Chart Max 83% | ~162 | 57–58 | 71–73 |
| HDR Reference White 100% (diffuse white) | 203 | 58 | 75 |

> Le HDR Reference White PQ (203 nits) correspond à 75% du signal HLG — c'est le point d'alignement entre les deux standards.

## Cas d'usage

- Calibration des niveaux en régie HDR (vectorscope, waveform)
- Étalonnage d'un programme HDR pour livraison broadcast
- Vérification de la conformité d'une conversion SDR→HDR
- Choix du type de LUT à appliquer selon le contexte

## Connexions

### Notes liées
- [[Conditions d'observation de référence HDR - BT.2100-3]] — environnement d'observation normalisé
- [[Niveaux nominaux HDR - Teintes de peaux et Échelle Fitzpatrick]] — niveaux spécifiques pour les teintes de peaux
- [[Conversions HDR-SDR - Tone Mapping Inverse TM Direct Mapping]] — pratiques de conversion définies par BT.2408
- [[Display Light vs Scene Light - Conversion SDR vers HDR]] — deux méthodes de conversion SDR→HDR définies dans BT.2408
- [[HLG - Hybrid Log Gamma]] — standard broadcast dont BT.2408 définit les niveaux nominaux
- [[PQ - Perceptual Quantizer]] — standard premium dont BT.2408 définit les niveaux nominaux
- [[ITU-R BT.2100 - Norme HDR]] — norme cadre pour HLG et PQ

### Contexte
Sans BT.2408, les niveaux HDR seraient interprétés différemment par chaque producteur. Cette norme assure que "blanc diffus" signifie la même chose partout, condition indispensable pour l'échange de programmes entre diffuseurs.

## Source

- ITU-R BT.2408 *Operational practices in HDR television production*
- Formation IIFA / Média 180, 2026-04-08 — [[0-Inbox/Formation UHD - HDR J2]]

---

**Tags thématiques** : `#uhd-hdr` `#normes` `#production` `#bt2408` `#reference-white`
