---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - peripheriques
  - pad
---

# PS2SDK - lecture de la manette avec libpad

> [!abstract] Concept
> Lire une manette demande de charger `SIO2MAN` puis `PADMAN`, d'ouvrir le port avec un buffer aligné sur 64 octets, d'attendre l'état stable, et de se souvenir que **les bits des boutons sont à 1 au repos** — d'où l'inversion `0xffff ^ buttons.btns`.

## Explication

Le pad est un périphérique IOP comme un autre : rien n'est disponible avant chargement des modules. `SIO2MAN` pilote le bus série physique partagé avec la carte mémoire, `PADMAN` ajoute la logique manette par-dessus ; les deux vivent en ROM et se chargent avec `SifLoadModule("rom0:…")`.

Deux détails techniques piègent régulièrement. D'abord le buffer d'état passé à `padPortOpen` doit être **aligné sur 64 octets** (`__attribute__((aligned(64)))`), contrainte DMA. Ensuite la manette n'est pas immédiatement lisible : il faut boucler sur `padGetState` jusqu'à obtenir `PAD_STATE_STABLE` ou `PAD_STATE_FINDCTP1`, à la fois avant la première lecture et à chaque itération.

La logique de lecture repose sur une convention inversée : au repos, tous les bits de `buttons.btns` sont à 1. On obtient l'état logique par `0xffff ^ buttons.btns`, puis les **fronts montants** — les boutons pressés à cette frame seulement — par `paddata & ~old_pad`. C'est ce dernier calcul qui distingue « le bouton est enfoncé » de « le bouton vient d'être enfoncé ».

Au-delà du numérique, le pad possède des modes (digital, DualShock analogique, avec ou sans vibration) négociés par `padInfoMode`/`padSetMainMode`, et des actuateurs de vibration pilotés par `padSetActDirect`/`padSetActAlign`.

## Exemples

### Lecture complète avec détection de fronts

```c
static char padBuf[256] __attribute__((aligned(64)));   // alignement obligatoire

static void waitPadReady(int port, int slot)
{
    int state = padGetState(port, slot);
    while (state != PAD_STATE_STABLE && state != PAD_STATE_FINDCTP1)
        state = padGetState(port, slot);
}

int main(void)
{
    int port = 0;                  // 0 -> connecteur 1, 1 -> connecteur 2
    int slot = 0;                  // toujours 0 si pas de multitap
    struct padButtonStatus buttons;
    u32 paddata, old_pad = 0, new_pad;

    sceSifInitRpc(0);
    SifLoadModule("rom0:SIO2MAN", 0, NULL);
    SifLoadModule("rom0:PADMAN", 0, NULL);
    padInit(0);

    if (padPortOpen(port, slot, padBuf) == 0) {
        printf("padPortOpen failed\n");
        SleepThread();
    }
    waitPadReady(port, slot);

    for (;;) {
        waitPadReady(port, slot);

        if (padRead(port, slot, &buttons) != 0) {
            paddata = 0xffff ^ buttons.btns;   // bits à 0 quand appuyé -> on inverse
            new_pad = paddata & ~old_pad;      // fronts montants uniquement
            old_pad = paddata;

            if (new_pad & PAD_CROSS)    printf("CROSS\n");
            if (new_pad & PAD_TRIANGLE) printf("TRIANGLE\n");
            if (new_pad & PAD_START)    printf("START\n");
        }
    }
    return 0;
}
```

```makefile
EE_LIBS = -lpad -lc
```

## Cas d'usage

- **Entrées d'un jeu** : lecture par frame, dans la boucle principale.
- **Menu** : détection de fronts pour éviter la répétition automatique.
- **Retour de force** : `padSetActDirect` sur les actuateurs.

## Avantages et inconvénients

✅ **Avantages** :
- API compacte et synchrone, facile à intégrer dans une boucle de rendu.
- Multitap géré par le paramètre `slot`, sans changer le code de lecture.

❌ **Inconvénients** / Limites :
- L'attente d'état stable est une attente active.
- La convention de bits inversée surprend et produit des bugs silencieux.

## Connexions

### Notes liées
- [[PS2 - SIO2MAN bus partagé pad et carte mémoire]] - Pourquoi `SIO2MAN` d'abord
- [[PS2 - IOP et modules IRX]] - Le chargement des modules
- [[PS2SDK - squelette d'un programme EE]] - La trame dans laquelle ce code s'insère
- [[PS2SDK - carte mémoire avec libmc]] - Le même schéma pour un autre périphérique

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 4) — `samples/rpc/pad/pad.c`

---
**Tags thématiques** : #ps2sdk #libpad #manette #peripheriques
