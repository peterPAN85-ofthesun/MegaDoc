---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - iop
  - modules
---

# PS2 - SIO2MAN bus partagé pad et carte mémoire

> [!abstract] Concept
> Manettes et cartes mémoire passent par le **même bus série SIO2**, arbitré par le module `SIO2MAN` ; `PADMAN` d'un côté et `MCMAN`+`MCSERV` de l'autre se construisent par-dessus, ce qui rend `SIO2MAN` obligatoire dans les deux cas.

## Explication

Physiquement, chaque port de la console regroupe un connecteur manette et un connecteur carte mémoire desservis par le même bus série. `SIO2MAN` est le pilote bas niveau de ce bus : il en arbitre l'accès entre les périphériques concurrents. C'est la raison pour laquelle il apparaît en premier dans toutes les séquences de chargement, qu'on veuille lire une manette ou une carte.

Par-dessus, la structure suit le schéma habituel. `PADMAN` implémente la logique manette et se voit exposé côté EE par `libpad`. Côté stockage, la pile compte deux étages : `MCMAN` fournit l'accès bloc brut, `MCSERV` ajoute le système de fichiers (répertoires, `icon.sys`) et le serveur RPC exposé par `libmc`.

Le module `MTAPMAN` s'insère dans ce schéma pour multiplier le nombre de périphériques : il permet quatre manettes et quatre cartes mémoire par port, ce qui explique le paramètre `slot` présent dans toutes les API `pad*` et `mc*` — toujours 0 en l'absence de multitap.

<svg viewBox="0 0 450 275" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Le bus SIO2 partagé entre manette et carte mémoire">
<defs><marker id="s2a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text x="16" y="26" font-size="12" fill="currentColor">un seul bus physique pour deux familles de périphériques</text>
<rect x="120" y="36" width="210" height="34" rx="5" fill="none" stroke="currentColor" stroke-width="1.4"/>
<text x="130" y="57" font-size="10" fill="currentColor">port console : connecteur manette + carte mémoire</text>
<line x1="225" y1="70" x2="225" y2="88" stroke="currentColor" stroke-width="2" marker-end="url(#s2a)"/>
<rect x="130" y="88" width="190" height="34" rx="5" fill="#f2994a" fill-opacity="0.16" stroke="#f2994a" stroke-width="1.7"/>
<text x="142" y="109" font-size="11" fill="#f2994a">SIO2MAN — arbitre du bus série</text>
<line x1="180" y1="122" x2="120" y2="146" stroke="currentColor" stroke-width="1.5" marker-end="url(#s2a)"/>
<line x1="270" y1="122" x2="330" y2="146" stroke="currentColor" stroke-width="1.5" marker-end="url(#s2a)"/>
<rect x="16" y="146" width="190" height="34" rx="5" fill="none" stroke="#4c9aff" stroke-width="1.4"/>
<text x="26" y="167" font-size="10" fill="#4c9aff">PADMAN — logique manette</text>
<rect x="16" y="186" width="190" height="30" rx="5" fill="#4c9aff" fill-opacity="0.14" stroke="#4c9aff" stroke-width="1.3"/>
<text x="26" y="206" font-size="10" fill="#4c9aff">libpad — côté EE</text>
<line x1="111" y1="180" x2="111" y2="184" stroke="#4c9aff" stroke-width="1.4"/>
<rect x="244" y="146" width="190" height="34" rx="5" fill="none" stroke="#27ae60" stroke-width="1.4"/>
<text x="254" y="167" font-size="10" fill="#27ae60">MCMAN — accès bloc brut</text>
<rect x="244" y="186" width="190" height="30" rx="5" fill="none" stroke="#27ae60" stroke-width="1.3"/>
<text x="254" y="206" font-size="10" fill="#27ae60">MCSERV — FS + serveur RPC</text>
<rect x="244" y="222" width="190" height="30" rx="5" fill="#27ae60" fill-opacity="0.14" stroke="#27ae60" stroke-width="1.3"/>
<text x="254" y="242" font-size="10" fill="#27ae60">libmc — côté EE</text>
<line x1="339" y1="180" x2="339" y2="184" stroke="#27ae60" stroke-width="1.4"/>
<line x1="339" y1="216" x2="339" y2="220" stroke="#27ae60" stroke-width="1.4"/>
<rect x="16" y="222" width="190" height="42" rx="5" fill="none" stroke="currentColor" stroke-width="1.1" stroke-dasharray="4 3"/>
<text x="26" y="238" font-size="9.5" fill="currentColor">MTAPMAN — multitap</text>
<text x="26" y="254" font-size="8.5" fill="currentColor" opacity="0.85">4 manettes + 4 cartes par port → paramètre slot</text>
<text x="16" y="272" font-size="9" fill="#f2994a" opacity="0.9">SIO2MAN arrive toujours en premier dans la séquence de chargement, quel que soit le besoin</text>
</svg>

## Exemples

### La pile

```
                 ┌───────────┐
   port 1/2  ──► │  SIO2MAN  │  (arbitre le bus série partagé)
                 └─────┬─────┘
              ┌────────┴────────┐
              ▼                 ▼
         ┌─────────┐      ┌──────────────────┐
         │ PADMAN  │      │  MCMAN + MCSERV   │
         │ (pad)   │      │  (carte mémoire)  │
         └─────────┘      └──────────────────┘
```

### Les deux séquences de chargement

```c
// Manette
SifLoadModule("rom0:SIO2MAN", 0, NULL);
SifLoadModule("rom0:PADMAN", 0, NULL);

// Carte mémoire
SifLoadModule("rom0:SIO2MAN", 0, NULL);
SifLoadModule("rom0:MCMAN", 0, NULL);
SifLoadModule("rom0:MCSERV", 0, NULL);
```

### Les rôles

| Module | Rôle |
|---|---|
| `SIO2MAN` | Pilote bas niveau du bus SIO2 (2 ports physiques) |
| `PADMAN` | Pilote manette, exposé par `libpad` |
| `MCMAN` | Pilote bas niveau carte mémoire, accès bloc brut |
| `MCSERV` | Système de fichiers + serveur RPC, exposé par `libmc` |
| `MTAPMAN` | Multitap : 4 manettes/cartes par port |

## Cas d'usage

- **Programme utilisant pad et carte mémoire** : charger `SIO2MAN` une seule fois.
- **Support multitap** : ajouter `MTAPMAN` et utiliser le paramètre `slot`.
- **Diagnostiquer un `padPortOpen` qui échoue** : vérifier que `SIO2MAN` est chargé.

## Avantages et inconvénients

✅ **Avantages** :
- Un seul arbitre pour deux familles de périphériques : cohérence garantie.
- Le paramètre `slot` rend le code compatible multitap sans modification.

❌ **Inconvénients** / Limites :
- Bus partagé : la bande passante est commune à la manette et à la carte.
- La dépendance à `SIO2MAN` n'est signalée par aucun message d'erreur explicite.

## Connexions

### Notes liées
- [[PS2 - hiérarchie des modules IOP]] - Le schéma général dont ceci est une instance
- [[PS2SDK - lecture de la manette avec libpad]] - Le client EE de `PADMAN`
- [[PS2SDK - carte mémoire avec libmc]] - Le client EE de `MCSERV`
- [[PS2 - variantes de modules IOP]] - `XSIO2MAN`, `XMCMAN`, `freesio2`

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 6b)

---
**Tags thématiques** : #ps2 #iop #sio2man #padman #mcman
