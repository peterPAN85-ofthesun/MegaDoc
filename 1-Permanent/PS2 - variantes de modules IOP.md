---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - iop
  - modules
---

# PS2 - variantes de modules IOP

> [!abstract] Concept
> Un même module IOP existe souvent en plusieurs versions distinguées par leur nom : préfixe `X` pour le protocole étendu, suffixe numérique pour une révision de BIOS, préfixe `free` pour une réimplémentation libre.

## Explication

Le préfixe **`X`** (`XSIO2MAN`, `XMCMAN`, `XMCSERV`) désigne le protocole **étendu « XMC »**, plus rapide et plus riche que le protocole MC classique hérité de la PS1. L'API côté EE reste la même — c'est toujours `libmc` — seuls les modules IOP changent, et le choix se fait par la constante passée à `mcInit` (`MC_TYPE_XMC` au lieu de `MC_TYPE_MC`).

Les **suffixes numériques** (`-1300`, `-1400`, `-2000`, `-old`) correspondent à des builds ciblant des **révisions de BIOS/ROM** de console, dont le comportement a changé d'une version à l'autre. Le fichier sans suffixe est la version générique, recommandée par défaut.

Le préfixe **`free`** (`freepad`, `freesio2`, `freemtap`) identifie des **réimplémentations libres**, écrites par la communauté homebrew et non des dumps de modules Sony. Elles sont indispensables quand `rom0:` n'est pas disponible — loaders non officiels, absence de BIOS complet — et permettent de distribuer un projet sans dépendre du contenu de la ROM.

## Exemples

### Les trois familles

| Marqueur | Signification | Exemples |
|---|---|---|
| Préfixe `X` | Protocole étendu XMC, plus rapide | `XSIO2MAN`, `XMCMAN`, `XMCSERV` |
| Suffixe numérique | Build pour une révision de BIOS | `-1300`, `-1400`, `-2000`, `-old` |
| Préfixe `free` | Réimplémentation libre homebrew | `freepad`, `freesio2`, `freemtap` |

### Choisir le protocole carte mémoire

```c
// protocole classique
SifLoadModule("rom0:MCMAN", 0, NULL);
SifLoadModule("rom0:MCSERV", 0, NULL);
mcInit(MC_TYPE_MC);

// protocole étendu — même API libmc, modules différents
mcInit(MC_TYPE_XMC);
```

### Quand choisir `free*`

Quand le programme doit tourner sans dépendre de `rom0:` — sur une console modifiée, dans un loader, ou pour une distribution autonome.

## Cas d'usage

- **Compatibilité multi-consoles** : partir de la version générique sans suffixe.
- **Performance carte mémoire** : passer au protocole XMC.
- **Homebrew autonome** : embarquer les modules `free*` plutôt que d'utiliser `rom0:`.

## Avantages et inconvénients

✅ **Avantages** :
- Un même code EE fonctionne avec plusieurs jeux de modules.
- Les variantes libres affranchissent de la ROM Sony.

❌ **Inconvénients** / Limites :
- La multiplication des noms rend le choix opaque pour un débutant.
- Les suffixes numériques ne sont presque pas documentés.

## Connexions

### Notes liées
- [[PS2 - hiérarchie des modules IOP]] - Le contexte de ces modules
- [[PS2 - SIO2MAN bus partagé pad et carte mémoire]] - Les modules concernés par les variantes X
- [[PS2SDK - carte mémoire avec libmc]] - Le choix `MC_TYPE_MC` / `MC_TYPE_XMC`
- [[PS2SDK - embarquer un module IRX avec bin2c]] - Distribuer une variante `free*`

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 6b)

---
**Tags thématiques** : #ps2 #iop #modules #variantes #homebrew
