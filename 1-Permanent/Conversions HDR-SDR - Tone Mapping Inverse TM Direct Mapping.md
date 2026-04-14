---
type: permanent
created: 2026-04-08 11:00
tags:
  - permanent
  - uhd-hdr
  - conversion
  - production
---

# Conversions HDR-SDR - Tone Mapping Inverse TM Direct Mapping

> [!abstract] Concept
> Quatre méthodes permettent de convertir entre HDR et SDR : Tone Mapping (HDR→SDR), Inverse Tone Mapping (SDR→HDR), Direct Mapping (encapsulation) et Hard Clipping (découpe brutale). Chacune a des usages et des résultats visuels différents.

## Explication

La coexistence de contenus HDR et SDR dans une chaîne de production broadcast exige des outils de conversion. Selon la direction (HDR→SDR ou SDR→HDR) et l'objectif (préserver les hautes lumières, maintenir le look, aligner les caméras...), différentes méthodes s'appliquent.

### Tone Mapping (TM) — HDR → SDR

La compression de plage dynamique. Le signal HDR (jusqu'à 1000 cd/m²) est "compressé" pour tenir dans la plage SDR (100 cd/m²). Un algorithme de tone mapping répartit les valeurs : les noirs et tons moyens sont préservés, les hautes lumières sont progressivement comprimées.

> Attention : il n'existe pas de tone mapping "parfait". Chaque algorithme produit un rendu légèrement différent, surtout dans les zones de hautes lumières.

### Inverse Tone Mapping (ITM) — SDR → HDR

L'expansion de plage dynamique. Le signal SDR est "étiré" pour exploiter la plage HDR. Une intelligence artificielle ou une courbe mathématique "invente" des informations de hautes lumières qui n'existaient pas dans la source. Résultat : l'image HDR produite est plus lumineuse et contrastée, mais les spéculaires sont synthétisés, pas réels.

### Direct Mapping — SDR "encapsulé" dans HDR

La méthode sans expansion. Le contenu SDR est placé tel quel dans un container HDR, en maintenant son apparence originale (pas d'expansion artificielle de la dynamique). En pratique :
- 100% du signal SDR → 203 nits PQ (HDR Reference White)
- 100% SDR → 75% HLG

Le contenu SDR est visible sur un écran HDR sans altération de ses niveaux. C'est la méthode utilisée pour inclure des **archives SDR dans un programme HDR**.

### Hard Clipping — HDR → SDR brutal

La découpe sans filet. Tout ce qui dépasse 203 nits (le HDR Reference White) est tronqué. Les spéculaires (éclairages, reflets métalliques) qui se trouvent dans le "headroom HDR" (entre 203 et 1000 nits) sont perdus. Le résultat peut paraître écrasé sur les hautes lumières.

## Résumé comparatif

| Méthode | Direction | Résultat | Usage typique |
|---|---|---|---|
| Tone Mapping (TM) | HDR → SDR | Hautes lumières comprimées progressivement | Livraison SDR depuis master HDR |
| Inverse Tone Mapping (ITM) | SDR → HDR | Hautes lumières inventées/estimées | Up-conversion archive SDR |
| Direct Mapping | SDR → HDR | Aucune altération, SDR dans container HDR | Inclusion archive SDR en programme HDR |
| Hard Clipping | HDR → SDR | Spéculaires perdus brusquement | À éviter sauf cas spécifiques |

## Connexions

### Notes liées
- [[Display Light vs Scene Light - Conversion SDR vers HDR]] — deux approches pour réaliser l'Inverse Tone Mapping ou le Direct Mapping
- [[ITU-R BT.2408 - Niveaux nominaux et bonnes pratiques production HDR]] — définit le HDR Reference White (203 nits) comme point de mappage
- [[Workflow production simultanée HDR-SDR]] — utilise TM et ITM dans une régie live
- [[HLG - Hybrid Log Gamma]] — courbe broadcast dont le "white" est à 75% HLG
- [[PQ - Perceptual Quantizer]] — courbe dont le Reference White est à ~58% PQ (203 nits)
- [[Gamma vidéo - OETF et EOTF]] — les fonctions EOTF/OETF sont impliquées dans chaque conversion

### Contexte
En production broadcast live, le Tone Mapping (HDR→SDR) est la conversion la plus fréquente : une seule régie HDR produit simultanément une sortie HDR et une sortie SDR. La qualité du tone mapping définit la qualité de la chaîne SDR "dérivée".

## Source

- ITU-R BT.2408
- Formation IIFA / Média 180, 2026-04-08 — [[0-Inbox/Formation UHD - HDR J2]]

---

**Tags thématiques** : `#uhd-hdr` `#conversion` `#tone-mapping` `#production`
