---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - hdr
  - courbe-transfert
---

# HLG - Hybrid Log Gamma

> [!abstract] Concept
> HLG (Hybrid Log Gamma) est une courbe de transfert HDR développée par BBC et NHK qui combine une portion gamma classique pour les basses lumières et une courbe logarithmique pour les hautes lumières, garantissant une rétro-compatibilité avec les écrans SDR.

## Explication

**HLG** (ARIB STD-B67, normalisé dans ITU-R BT.2100) est la réponse des diffuseurs européens et japonais au besoin d'un HDR compatible avec les chaînes de diffusion existantes. Contrairement au PQ, il n'est pas référencé en luminance absolue mais en **échelle relative** (0 à 1), ce qui lui confère sa rétro-compatibilité.

**Fonctionnement de la courbe hybride :**
- Pour les niveaux < 0,5 (basses et moyennes lumières) : la courbe se comporte comme un **gamma classique** — compatible avec les afficheurs SDR
- Pour les niveaux > 0,5 (hautes lumières) : la courbe devient **logarithmique** — encode une grande dynamique supplémentaire que les écrans HDR peuvent exploiter

**Référence SDR/HDR :**
En HLG, le niveau **75% du signal (0,75) correspond à 203 nits** sur un écran HDR. Ce même niveau 75% est interprété comme le blanc de référence SDR (100 nits équivalent) sur un écran standard — d'où `HLG → SDR = −10 dB` en luminance.

**Variantes Sony :**
- **HLG Live** : courbe alignée sur Rec.709 (espace couleur SDR) — compatibilité maximale avec les régies existantes
- **HLG Natural** : courbe alignée sur les standards BT.2100 — qualité maximale, espace Rec.2020

**Métadonnées :**
Les signaux HLG nécessitent **peu ou pas de métadonnées statiques** — la courbe est auto-contenue. Pas de MaxCLL/MaxFALL obligatoires, simplifiant le workflow live.

**Normes associées :** ARIB STD-B67, ITU-R BT.2100, ITU-R BT.2020

## Exemples

### Exemple 1 — Compatibilité SDR d'un signal HLG
Un signal UHD 50p HLG est diffusé simultanément sur une chaîne 4K HDR et une chaîne HD SDR. Le décodeur SDR utilise les 75% inférieurs de la courbe HLG comme signal gamma standard → image correcte sans conversion. C'est la diffusion dite "simultcast".

### Exemple 2 — Conversion HLG → SDR
En régie : signal HLG entrant → conversion −10 dB appliquée sur la luminance → signal SDR à 100 nits de blanc. Sur un oscilloscope, le blanc HLG à 75% doit descendre à ~50% IRE en SDR.

## Cas d'usage

- **Diffusion broadcast live** : Sport, événements en direct sur chaînes nationales (EBU recommandé)
- **Production avec contrainte SDR** : Régies mixtes HDR/SDR, signaux envoyés à des partenaires sans infrastructure HDR
- **Transition progressive** : Premier pas vers le HDR sans remplacer toute l'infrastructure

## Avantages et inconvénients

✅ **Avantages HLG** :
- Rétro-compatibilité native avec les écrans SDR (aucune conversion obligatoire)
- Pas de métadonnées statiques requises → workflow simplifié pour le live
- Référencement relatif → robuste aux variations d'écrans

❌ **Inconvénients HLG** :
- Luminance maximale limitée (~1000 nits) vs PQ (10 000 nits)
- Moins précis pour le contenu cinéma (pas de luminance absolue)
- Encodage des noirs légèrement moins performant que PQ

## Connexions

### Notes liées
- [[PQ - Perceptual Quantizer]] — l'alternative HDR à luminance absolue, comparer les deux
- [[Gamma vidéo - OETF et EOTF]] — HLG étend la courbe gamma classique
- [[Dynamique en image - Stops et Nits]] — 203 nits comme référence HLG
- [[VPID - Signalisation du signal vidéo SDI]] — valeur `01` dans le Byte 2 VPID
- [[Métadonnées HDR - MaxCLL MaxFALL statiques et dynamiques]] — HLG en nécessite peu

### Dans le contexte de
- [[ITU-R BT.2100 - Norme HDR]] — HLG est l'une des deux OETF de BT.2100
- [[MOC - UHD & HDR]] — standard de référence broadcast européen

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]]
- Normes : ARIB STD-B67, ITU-R BT.2100

---

**Tags thématiques** : `#hlg` `#hdr` `#courbe-transfert` `#uhd-hdr` `#broadcast`

## Images sources

![[20260407_162008.jpg]]
![[20260407_161145.jpg]]