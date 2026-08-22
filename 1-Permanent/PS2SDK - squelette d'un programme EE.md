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
