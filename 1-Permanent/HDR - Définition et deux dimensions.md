---
type: permanent
created: 2026-04-07 14:00
tags:
  - permanent
  - uhd-hdr
  - hdr
  - colorimétrie
---

# HDR - Définition et deux dimensions

> [!abstract] Concept
> Le HDR (High Dynamic Range) en vidéo désigne simultanément deux améliorations indépendantes : une dynamique étendue (plus de stops entre noir et blanc) et un espace colorimétrique élargi (Rec.2020 vs Rec.709) — les deux doivent être traités séparément dans la chaîne de production.

## Explication

Le terme **HDR** recouvre deux réalités physiques distinctes qu'il ne faut pas confondre ni supposer systématiquement liées :

**Dimension 1 — Dynamique augmentée :**
Le rapport entre la luminance maximale et minimale est étendu. En SDR, le blanc de référence est à 100 nits ; en HDR, il peut atteindre 1000 (HLG) à 10 000 nits (PQ). Cela permet de reproduire des éclats de soleil, des flammes ou des sources lumineuses avec leur brillance réelle tout en conservant le détail dans les ombres.

**Dimension 2 — Espace colorimétrique augmenté (WCG — Wide Color Gamut) :**
Le passage de Rec.709 à Rec.2020 étend la couverture du diagramme CIE xy de ~35,9% à ~75,8%. Des couleurs très saturées (verts de forêt tropicale, bleus de ciel profond, oranges de coucher de soleil) deviennent représentables. En pratique, peu d'écrans atteignent la couverture complète Rec.2020 — la cible intermédiaire DCI-P3 (~54%) est plus courante.

**Pourquoi sont-elles indépendantes ?**
Ces deux paramètres sont des caractéristiques physiques séparables du signal. Il est techniquement possible d'avoir :
- **Dynamique HDR + espace SDR (Rec.709)** : transition progressive vers le HDR où on adopte d'abord la plage dynamique étendue sans changer l'espace couleur. Cas des caméras Sony HLG "Live" alignées sur Rec.709, ou des chaînes de diffusion en phase de migration progressive.
- **Dynamique SDR + espace HDR (Rec.2020)** : production UHD avec une grande couverture chromatique mais sans augmentation de dynamique — par exemple pour des environnements de diffusion dont la chaîne de monitoring n'est pas encore HDR.

> [!warning]
> Ne pas adapter l'un sans l'autre dans la chaîne de production crée des incohérences colorimétriques. Un étalonnage HDR doit traiter les deux dimensions simultanément pour garantir une qualité optimale.

## Exemples

### Exemple 1 — Diffusion France 2 en continu
France 2 diffuse en PQ HDR : dynamique étendue jusqu'à ~1000 nits, espace Rec.2020. Les téléviseurs compatibles affichent les deux dimensions ; les écrans SDR reçoivent une version downgradée (tone mapping).

### Exemple 2 — Régie en transition
Une régie passe en HLG pour le direct mais ses moniteurs sont Rec.709 : elle bénéficie de la dynamique HLG (rétro-compatible) mais perd la dimension WCG Rec.2020 — acceptable en transition.

## Cas d'usage

- **HDR complet (WCG + plage étendue)** : Cinéma, diffusion premium (Netflix, Apple TV+), chaînes UHD
- **HDR partiel (dynamique seule, Rec.709)** : Transition progressive, régies en cours de migration
- **WCG seul (Rec.2020 SDR)** : Production future-proof sans infrastructure HDR complète

## Avantages et inconvénients

✅ **Avantages du HDR complet** :
- Image plus proche de la perception naturelle
- Restitution fidèle des éclats et des ombres
- Palette de couleurs considérablement étendue

❌ **Inconvénients** :
- Infrastructure complète à revoir (moniteurs, encodeurs, diffusion)
- Gestion des versions SDR/HDR (tone mapping, dual-delivery)
- Indépendance des deux dimensions souvent mal comprise → erreurs de production

## Connexions

### Notes liées
- [[Dynamique en image - Stops et Nits]] — mesure de la première dimension HDR
- [[Rec.2020 - Espace colorimétrique UHD]] — la deuxième dimension du HDR
- [[HLG - Hybrid Log Gamma]] — implémentation HDR rétro-compatible SDR
- [[PQ - Perceptual Quantizer]] — implémentation HDR absolue
- [[ITU-R BT.2100 - Norme HDR]] — la norme qui unifie les deux dimensions

### Dans le contexte de
- [[Transition HD vers UHD - Quatre axes d'amélioration]] — HDR s'ajoute aux 4 axes UHD
- [[MOC - UHD & HDR]] — définition centrale du domaine

## Source

- Source : [[0-Inbox/Archive/Formation UHD - HDR]]
- Norme : ITU-R BT.2100

---

**Tags thématiques** : `#hdr` `#uhd-hdr` `#dynamique` `#wcg` `#colorimétrie`
