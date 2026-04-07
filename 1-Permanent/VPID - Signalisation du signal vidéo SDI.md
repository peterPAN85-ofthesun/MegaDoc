---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - broadcast
  - sdi
  - signalisation
---

# VPID - Signalisation du signal vidéo SDI

> [!abstract] Concept
> Le VPID (Video Payload Identifier), défini par SMPTE ST352 et ST425-5, est un mot de 4 bytes embarqué dans la trame SDI qui décrit le type de signal transporté : résolution, fréquence, format de couleur, type HDR — mais dont les valeurs peuvent être modifiées indépendamment du signal réel.

## Explication

Dans un signal SDI, le **VPID** est un identifiant de 4 octets (Byte 1 à 4) inclus dans les paquets ancillaires. Il est défini par les normes **SMPTE ST352** (pour les signaux HD/SD) et **SMPTE ST425-5** (pour l'UHD/12G).

**Structure des 4 bytes :**
- **Byte 1** : Format du signal (SD/HD/3G/12G, résolution, mapping)
- **Byte 2** : Type de scan (progressif/entrelacé), fréquence d'images, type de HDR (SDR/HLG/PQ/Unspecified)
- **Byte 3** : Informations d'aspect ratio, image active
- **Byte 4** : Réservé / informations complémentaires

**Limitation critique du Byte 2 pour le HDR :**
Le Byte 2 ne dispose que de **4 valeurs possibles pour le type HDR** :
- `00` = SDR
- `01` = HLG
- `10` = PQ
- `11` = Unspecified

Cela exclut certains formats courants comme le **S-Log** de Sony ou d'autres courbes log propriétaires, qui ne peuvent pas être correctement signalisés.

> [!warning]
> **Ne pas se fier systématiquement aux tags VPID !** Ces informations peuvent être modifiées par n'importe quel équipement de la chaîne, indépendamment de la nature réelle du signal. Un signal PQ peut être balisé "SDR" par erreur de configuration — toujours vérifier la nature réelle du signal à l'oscilloscope ou waveform monitor.

## Exemples

### Exemple 1 — Lecture du VPID
Sur un analyseur de signal (Prism, Tektronix) : `Byte 2 = 0x85` → décodage bit à bit pour identifier le type de scan et le format HDR déclaré.

### Exemple 2 — Erreur de signalisation
Un opérateur reçoit un signal 1080p HLG mais l'équipement upstream a envoyé VPID = SDR. Le moniteur de référence (qui se base sur le VPID) applique une EOTF SDR sur un signal HLG → l'image apparaît trop lumineuse et délavée. Solution : forcer le VPID ou ignorer le tag et configurer manuellement le monitoring.

## Cas d'usage

- **Monitoring automatique** : Certains moniteurs et convertisseurs utilisent le VPID pour s'auto-configurer (SDR/HDR)
- **Diagnostic** : Vérification de la cohérence du signal reçu
- **Documentation** : Les Bytes 1-4 constituent la "carte d'identité" du signal

## Avantages et inconvénients

✅ **Avantages** :
- Identification automatique du signal sans intervention manuelle
- Standardisé et universellement supporté en broadcast
- Permet la commutation automatique SDR/HDR sur les chaînes de diffusion

❌ **Inconvénients** :
- Seulement 4 types HDR possibles — certains formats propriétaires non couverts
- Peut être modifié par erreur ou volontairement → source de confusion
- Fiabilité dépendante de la discipline opérationnelle de toute la chaîne

## Connexions

### Notes liées
- [[SDI - Débits et interfaces 1.5G 3G 12G]] — le VPID est embarqué dans la trame SDI
- [[HLG - Hybrid Log Gamma]] — une des 4 valeurs possibles du Byte 2
- [[PQ - Perceptual Quantizer]] — une des 4 valeurs possibles du Byte 2
- [[Transport UHD multi-câbles - SQD vs 2SI]] — le VPID indique aussi le mode de transport multi-lien

### Dans le contexte de
- [[MOC - UHD & HDR]] — signalisation et identification des flux HDR en broadcast

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]]
- Normes : SMPTE ST352 (VPID HD), SMPTE ST425-5 (VPID UHD/12G)

---

**Tags thématiques** : `#sdi` `#vpid` `#broadcast` `#signalisation` `#uhd-hdr`

## Images sources

![[20260407_121800.jpg]]
