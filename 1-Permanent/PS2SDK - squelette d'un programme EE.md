---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - ee
  - architecture
---

# PS2SDK - squelette d'un programme EE

> [!abstract] Concept
> Un programme PS2 tourne bare metal et suit toujours la même trame : `sceSifInitRpc(0)` → chargement des modules IRX → initialisation des bibliothèques → boucle principale → `SleepThread()` au lieu d'un `return`.

## Explication

Il n'y a pas d'OS derrière l'ELF. Le programme démarre directement sur l'EE, et rien n'est initialisé pour lui. Les six étapes du squelette qu'on retrouve dans presque tous les samples (`graph.c`, `pad.c`, `mc_example.c`, `filexio/main.c`) découlent de cette absence.

On commence par les includes de base : `tamtypes.h` pour les types (`u32`, `u64`, `u128`), `kernel.h`, et `sifrpc.h` dès qu'un périphérique est en jeu. Vient ensuite `sceSifInitRpc(0)`, obligatoire pour ouvrir le canal vers l'IOP, puis le chargement des modules IRX nécessaires — depuis la ROM avec `SifLoadModule("rom0:PADMAN", 0, NULL)`, ou depuis un buffer embarqué avec `SifExecModuleBuffer` pour un module hors ROM. Chaque bibliothèque cliente a alors son initialisation propre : `padInit()`, `mcInit(MC_TYPE_MC)`, `fileXioInit()`.

La fin du programme est le point le plus déroutant : on termine par **`SleepThread()`**, pas par un `return`. Personne n'est là pour récupérer la valeur de retour de `main()` puisqu'il n'y a pas d'OS ; on endort donc le thread indéfiniment au lieu de « quitter ». Un `return 0` atteint mènerait à un comportement indéfini.

<svg viewBox="0 0 450 270" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Les six étapes du squelette d'un programme EE">
<defs><marker id="sqa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text x="16" y="24" font-size="11.5" fill="currentColor">bare metal : rien n'est initialisé pour vous, d'où cette trame invariable</text>
<rect x="16" y="34" width="418" height="30" rx="4" fill="#4c9aff" fill-opacity="0.1" stroke="#4c9aff" stroke-width="1.2"/>
<text x="26" y="53" font-size="9.5" fill="#4c9aff">1 · includes — tamtypes.h (u32/u64/u128) · kernel.h · sifrpc.h si périphérique</text>
<line x1="225" y1="64" x2="225" y2="74" stroke="currentColor" stroke-width="1.3" marker-end="url(#sqa)"/>
<rect x="16" y="76" width="418" height="30" rx="4" fill="#f2994a" fill-opacity="0.12" stroke="#f2994a" stroke-width="1.3"/>
<text x="26" y="95" font-size="9.5" fill="#f2994a">2 · sceSifInitRpc(0) — ouvre le canal vers l'IOP, obligatoire</text>
<line x1="225" y1="106" x2="225" y2="116" stroke="currentColor" stroke-width="1.3" marker-end="url(#sqa)"/>
<rect x="16" y="118" width="418" height="38" rx="4" fill="#f2994a" fill-opacity="0.1" stroke="#f2994a" stroke-width="1.2"/>
<text x="26" y="135" font-size="9.5" fill="#f2994a">3 · chargement des modules IRX</text>
<text x="26" y="150" font-size="8.5" fill="#f2994a" opacity="0.9">SifLoadModule("rom0:PADMAN") · SifExecModuleBuffer pour un module hors ROM</text>
<line x1="225" y1="156" x2="225" y2="166" stroke="currentColor" stroke-width="1.3" marker-end="url(#sqa)"/>
<rect x="16" y="168" width="418" height="30" rx="4" fill="#27ae60" fill-opacity="0.1" stroke="#27ae60" stroke-width="1.2"/>
<text x="26" y="187" font-size="9.5" fill="#27ae60">4 · init des bibliothèques clientes — padInit() · mcInit(MC_TYPE_MC) · fileXioInit()</text>
<line x1="225" y1="198" x2="225" y2="208" stroke="currentColor" stroke-width="1.3" marker-end="url(#sqa)"/>
<rect x="16" y="210" width="418" height="26" rx="4" fill="#27ae60" fill-opacity="0.1" stroke="#27ae60" stroke-width="1.2"/>
<text x="26" y="227" font-size="9.5" fill="#27ae60">5 · boucle principale</text>
<line x1="225" y1="236" x2="225" y2="244" stroke="currentColor" stroke-width="1.3" marker-end="url(#sqa)"/>
<rect x="16" y="246" width="418" height="24" rx="4" fill="#e05252" fill-opacity="0.12" stroke="#e05252" stroke-width="1.4"/>
<text x="26" y="262" font-size="9.5" fill="#e05252">6 · SleepThread() — jamais return : personne ne récupère la valeur de main()</text>
</svg>

## Exemples

### La trame complète

```c
#include <tamtypes.h>
#include <kernel.h>
#include <sifrpc.h>
#include <loadfile.h>
#include <libpad.h>

int main(void)
{
    sceSifInitRpc(0);                          // 1. canal RPC vers l'IOP

    SifLoadModule("rom0:SIO2MAN", 0, NULL);    // 2. modules IOP
    SifLoadModule("rom0:PADMAN", 0, NULL);

    padInit(0);                                // 3. init de la lib applicative

    for (;;) {                                 // 4. boucle principale
        /* lecture d'entrées, logique, rendu */
    }

    SleepThread();                             // 5. jamais de return
    return 0;
}
```

### Signaler une erreur fatale

```c
if (SifLoadModule("rom0:PADMAN", 0, NULL) < 0) {
    printf("sifLoadModule pad failed\n");
    SleepThread();       // on s'endort, il n'y a nulle part où retourner
}
```

## Cas d'usage

- **Démarrer tout nouveau homebrew** : c'est le point de départ à copier.
- **Gérer une erreur fatale** : afficher puis `SleepThread()`.
- **Lire les samples du SDK** : reconnaître immédiatement la structure.

## Avantages et inconvénients

✅ **Avantages** :
- Trame courte et identique partout, facile à mémoriser.
- Contrôle total : rien ne tourne dans le dos du programme.

❌ **Inconvénients** / Limites :
- Chaque périphérique impose une séquence de modules à connaître.
- Aucun filet : un module oublié ou mal ordonné échoue silencieusement.

## Connexions

### Notes liées
- [[PS2 - SIF pont RPC entre EE et IOP]] - Ce qu'ouvre `sceSifInitRpc`
- [[PS2 - IOP et modules IRX]] - Les modules à charger à l'étape 2
- [[PS2SDK - lecture de la manette avec libpad]] - Une instanciation complète
- [[PS2 - SYSTEM.CNF et démarrage d'un ELF]] - Comment cet ELF est lancé
- [[PS2SDK - Makefile d'un projet EE]] - Comment il est construit

- [[ELF - Executable and Linkable Format]] - Le conteneur du programme, chargé sans OS

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 2, « Architecture de base d'un programme »)

---
**Tags thématiques** : #ps2sdk #ee #baremetal #sleepthread
