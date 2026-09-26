---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - hardware
  - sif
  - rpc
---

# PS2 - SIF pont RPC entre EE et IOP

> [!abstract] Concept
> Le SIF (Sub-system Interface) est le bus qui relie l'EE et l'IOP ; toute utilisation d'un périphérique passe par un appel RPC sur ce bus, initialisé une fois pour toutes par `sceSifInitRpc(0)`.

## Explication

L'EE et l'IOP ne partagent pas de mémoire adressable de façon transparente. Leur communication repose sur un protocole de type **RPC** (Remote Procedure Call) : l'EE envoie une requête à un module IRX chargé côté IOP, celui-ci exécute l'opération sur le matériel et renvoie le résultat. Ce protocole est implémenté côté IOP par les modules `SIFMAN`, `SIFCMD` et `SIFINIT`, et côté EE par `libkernel` (en-têtes `sifrpc-common.h`, `sifcmd-common.h`).

Matériellement, deux canaux DMA de l'EE portent ce trafic : `DMA_CHANNEL_fromSIF0` (IOP → EE) et `DMA_CHANNEL_toSIF1` (EE → IOP), plus un canal `SIF2` bidirectionnel peu utilisé. Le programmeur ne les manipule presque jamais directement : `sceSifInitRpc`, `SifLoadModule` et les bibliothèques clientes (`libpad`, `libmc`, `fileXio`) les utilisent sous le capot.

En pratique, la règle est simple : **`sceSifInitRpc(0)` est obligatoire avant toute chose** dès qu'on touche à un périphérique — c'est la première ligne de presque tous les samples. Certains scénarios exigent en plus un redémarrage propre de l'IOP (`SifIopReset` puis `SifIopSync`) pour reprendre la main sur ses modules avant d'y charger les siens.

<svg viewBox="0 0 450 250" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Le bus SIF relie EE et IOP par deux canaux DMA et un protocole RPC">
<defs><marker id="sfa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="sfb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker></defs>
<rect x="16" y="56" width="140" height="120" rx="7" fill="#4c9aff" fill-opacity="0.07" stroke="#4c9aff" stroke-width="1.6"/>
<text x="26" y="74" font-size="11.5" fill="#4c9aff">EE</text>
<text x="26" y="92" font-size="9.5" fill="#4c9aff" opacity="0.9">libkernel</text>
<text x="26" y="108" font-size="9" fill="#4c9aff" opacity="0.8">sifrpc-common.h</text>
<text x="26" y="122" font-size="9" fill="#4c9aff" opacity="0.8">sifcmd-common.h</text>
<rect x="26" y="132" width="120" height="34" rx="4" fill="none" stroke="#4c9aff" stroke-width="1.2"/>
<text x="32" y="146" font-size="9" fill="#4c9aff">libpad · libmc · fileXio</text>
<text x="32" y="160" font-size="8.5" fill="#4c9aff" opacity="0.8">clients RPC</text>
<rect x="294" y="56" width="140" height="120" rx="7" fill="#f2994a" fill-opacity="0.07" stroke="#f2994a" stroke-width="1.6"/>
<text x="304" y="74" font-size="11.5" fill="#f2994a">IOP</text>
<rect x="304" y="84" width="120" height="20" rx="4" fill="none" stroke="#f2994a" stroke-width="1.1"/>
<text x="310" y="98" font-size="9" fill="#f2994a">SIFMAN</text>
<rect x="304" y="108" width="120" height="20" rx="4" fill="none" stroke="#f2994a" stroke-width="1.1"/>
<text x="310" y="122" font-size="9" fill="#f2994a">SIFCMD</text>
<rect x="304" y="132" width="120" height="20" rx="4" fill="none" stroke="#f2994a" stroke-width="1.1"/>
<text x="310" y="146" font-size="9" fill="#f2994a">SIFINIT</text>
<text x="304" y="168" font-size="9" fill="#f2994a" opacity="0.85">exécute sur le matériel</text>
<line x1="156" y1="88" x2="292" y2="88" stroke="#4c9aff" stroke-width="2.2" marker-end="url(#sfa)"/>
<text x="176" y="80" font-size="9.5" fill="#4c9aff">toSIF1 — requête (EE → IOP)</text>
<line x1="292" y1="128" x2="158" y2="128" stroke="#f2994a" stroke-width="2.2" marker-end="url(#sfb)"/>
<text x="176" y="146" font-size="9.5" fill="#f2994a">fromSIF0 — réponse (IOP → EE)</text>
<rect x="160" y="96" width="130" height="24" rx="4" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2"/>
<text x="176" y="112" font-size="9" fill="currentColor" opacity="0.85">SIF2 — bidirectionnel, peu utilisé</text>
<rect x="60" y="196" width="330" height="34" rx="5" fill="#27ae60" fill-opacity="0.1" stroke="#27ae60" stroke-width="1.5"/>
<text x="72" y="217" font-size="11" fill="#27ae60">sceSifInitRpc(0) — obligatoire avant tout accès périphérique</text>
<text x="16" y="28" font-size="12" fill="currentColor">pas de mémoire partagée : l'EE appelle des procédures distantes sur l'IOP</text>
<text x="16" y="44" font-size="10" fill="currentColor" opacity="0.75">SifIopReset puis SifIopSync pour reprendre la main sur les modules avant d'y charger les siens</text>
</svg>

## Exemples

### Séquence d'initialisation minimale

```c
sceSifInitRpc(0);
SifLoadModule("rom0:SIO2MAN", 0, NULL);
```

### Reset complet de l'IOP avant de charger ses propres modules

```c
sceSifInitRpc(0);
while (!SifIopReset(NULL, 0)) {};
while (!SifIopSync()) {};

sceSifInitRpc(0);           // à refaire après le reset
sbv_patch_enable_lmb();
sbv_patch_disable_prefix_check();
```

## Cas d'usage

- **Tout accès périphérique** : pad, carte mémoire, disque, réseau, son.
- **Chargement de modules** : `SifLoadModule` / `SifExecModuleBuffer` transitent par le SIF.
- **Loader homebrew** : reset IOP + patches SBV pour charger des modules non signés.

## Avantages et inconvénients

✅ **Avantages** :
- Isolation nette entre calcul (EE) et I/O (IOP).
- Les appels RPC sont asynchrones : l'EE peut continuer pendant l'opération.

❌ **Inconvénients** / Limites :
- Latence non négligeable sur chaque aller-retour.
- Oublier `sceSifInitRpc` produit des échecs difficiles à diagnostiquer.

## Connexions

### Notes liées
- [[PS2 - IOP et modules IRX]] - L'autre extrémité du pont
- [[PS2 - canaux DMA de l'EE]] - Les canaux fromSIF0 / toSIF1
- [[PS2SDK - squelette d'un programme EE]] - Où `sceSifInitRpc` se place
- [[PS2 - IOMAN IOMANX et fileXio]] - Un pont RPC concret par-dessus le SIF
- [[PS2 - architecture multiprocesseur]] - Sa place dans le système

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitres 1, 2, 5 et 6)

---
**Tags thématiques** : #ps2 #sif #rpc #iop #ee
