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

<svg viewBox="0 0 450 260" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Séquence de lecture d'une manette avec libpad">
<defs><marker id="lpa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text x="16" y="24" font-size="11.5" fill="currentColor">rien n'est lisible avant d'avoir tout mis en place</text>
<rect x="16" y="32" width="124" height="38" rx="4" fill="#f2994a" fill-opacity="0.13" stroke="#f2994a" stroke-width="1.3"/>
<text x="24" y="48" font-size="9" fill="#f2994a">1 · SifLoadModule</text>
<text x="24" y="62" font-size="8.5" fill="#f2994a">rom0:SIO2MAN puis PADMAN</text>
<line x1="140" y1="51" x2="156" y2="51" stroke="currentColor" stroke-width="1.4" marker-end="url(#lpa)"/>
<rect x="158" y="32" width="128" height="38" rx="4" fill="#4c9aff" fill-opacity="0.13" stroke="#4c9aff" stroke-width="1.3"/>
<text x="166" y="48" font-size="9" fill="#4c9aff">2 · padPortOpen</text>
<text x="166" y="62" font-size="8.5" fill="#4c9aff">buffer aligned(64) — DMA</text>
<line x1="286" y1="51" x2="302" y2="51" stroke="currentColor" stroke-width="1.4" marker-end="url(#lpa)"/>
<rect x="304" y="32" width="130" height="38" rx="4" fill="#27ae60" fill-opacity="0.13" stroke="#27ae60" stroke-width="1.3"/>
<text x="312" y="48" font-size="9" fill="#27ae60">3 · attendre l'état stable</text>
<text x="312" y="62" font-size="8" fill="#27ae60">PAD_STATE_STABLE / FINDCTP1</text>
<text x="304" y="84" font-size="8" fill="#27ae60" opacity="0.85">à chaque itération, pas seulement au début</text>
<rect x="16" y="96" width="418" height="76" rx="5" fill="#e05252" fill-opacity="0.07" stroke="#e05252" stroke-width="1.3"/>
<text x="26" y="114" font-size="10" fill="#e05252">⚠ convention inversée : au repos, tous les bits sont à 1</text>
<rect x="26" y="122" width="126" height="24" rx="3" fill="none" stroke="#e05252" stroke-width="1.1"/>
<text x="34" y="138" font-size="8.5" fill="#e05252">buttons.btns (brut)</text>
<line x1="152" y1="134" x2="170" y2="134" stroke="currentColor" stroke-width="1.3" marker-end="url(#lpa)"/>
<rect x="172" y="122" width="126" height="24" rx="3" fill="#27ae60" fill-opacity="0.15" stroke="#27ae60" stroke-width="1.2"/>
<text x="180" y="138" font-size="8.5" fill="#27ae60">0xffff ^ btns → état logique</text>
<line x1="298" y1="134" x2="316" y2="134" stroke="currentColor" stroke-width="1.3" marker-end="url(#lpa)"/>
<rect x="318" y="122" width="116" height="24" rx="3" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff" stroke-width="1.2"/>
<text x="324" y="138" font-size="8.5" fill="#4c9aff">paddata &amp; ~old_pad</text>
<text x="26" y="162" font-size="9" fill="currentColor" opacity="0.85">« le bouton est enfoncé » (état) ≠ « le bouton vient d'être enfoncé » (front montant)</text>
<rect x="16" y="186" width="418" height="60" rx="5" fill="none" stroke="currentColor" stroke-width="1.1" stroke-dasharray="4 3"/>
<text x="26" y="204" font-size="9.5" fill="currentColor">au-delà du numérique</text>
<text x="26" y="222" font-size="9" fill="currentColor" opacity="0.9">modes digital / DualShock analogique — padInfoMode, padSetMainMode</text>
<text x="26" y="238" font-size="9" fill="currentColor" opacity="0.9">vibration — padSetActDirect, padSetActAlign</text>
</svg>

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
