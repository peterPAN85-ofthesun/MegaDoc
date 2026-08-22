---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - debug
---

# PS2SDK - console de debug libdebug

> [!abstract] Concept
> `libdebug` dessine du texte directement via le GS sans dépendre d'un pipeline de rendu fonctionnel — `init_scr()` puis `scr_printf()` suffisent — et fournit en prime la macro `DEBUG_BGCOLOR` qui écrit un registre GS memory-mappé.

## Explication

C'est l'outil de debug le plus utilisé en pratique, parce qu'il court-circuite tout le reste : pas de framebuffer à allouer, pas de DMA à initialiser, pas de paquet GIF à construire. Deux lignes de code et le texte s'affiche. Un programme minimal se réduit à `sceSifInitRpc(0)`, `init_scr()` puis `scr_printf("Hello, World!\n")`, avec `-ldebug` pour seule bibliothèque.

L'API tient en une quinzaine de fonctions : affichage formaté (`scr_printf`, `scr_vprintf`, `scr_putchar`), effacement (`scr_clear`, `scr_clearline`, `scr_clearchar`), positionnement du curseur (`scr_setXY`, `scr_getX`, `scr_getY`, `scr_setCursor`) et couleurs (`scr_setfontcolor`, `scr_setbgcolor`, `scr_setcursorcolor`). `ps2GetStackTrace` complète l'ensemble en récupérant une trace d'appels.

La macro `DEBUG_BGCOLOR(col)` mérite d'être connue à part : elle écrit directement le registre GS de couleur de fond, memory-mappé à l'adresse `0x120000e0`. Elle permet de localiser un plantage ou une boucle infinie **sans même passer par `scr_printf`** — il suffit de changer la couleur d'écran à différents points du code pour voir jusqu'où l'exécution est allée, y compris quand le pipeline de rendu normal ne tourne pas encore.

`libdebug` embarque aussi `screenshot.h` (`ps2_screenshot`, `ps2_screenshot_file`), qui dumpe un buffer VRAM vers un fichier ou vers la mémoire — pratique pour inspecter un rendu en émulateur headless ou en CI. Ces fonctions prennent l'adresse VRAM et le PSM du buffer, informations déjà en main après `graph_vram_allocate`.

## Exemples

### Programme minimal complet

```c
#include <sifrpc.h>
#include <debug.h>
#include <unistd.h>

int main(int argc, char *argv[])
{
    sceSifInitRpc(0);
    init_scr();

    scr_setXY(0, 10);
    scr_printf("Hello, World!\n");

    sleep(5);
    scr_clear();

    scr_setXY(20, 20);
    scr_printf("Hello Again, World!\n");

    sleep(10);
    return 0;
}
```

```makefile
EE_LIBS = -ldebug
```

### Localiser un plantage sans affichage texte

```c
#define DEBUG_BGCOLOR(col) *((u64 *) 0x120000e0) = (u64) (col)

DEBUG_BGCOLOR(0xff0000ffUL);   // rouge : on est arrivé ici
section_suspecte();
DEBUG_BGCOLOR(0x00ff00ffUL);   // vert : on en est sorti
```

### Capturer le framebuffer

```c
ps2_screenshot_file("host:capture.tga", frame.address,
                    frame.width, frame.height, frame.psm);
```

## Cas d'usage

- **Premier programme PS2** : vérifier que la chaîne de build fonctionne.
- **Traces d'exécution** dans un programme graphique, en overlay.
- **Debug sans texte** : `DEBUG_BGCOLOR` avant même l'initialisation du GS.

## Avantages et inconvénients

✅ **Avantages** :
- Aucune dépendance : fonctionne avant tout setup graphique.
- API familière, calquée sur `printf`.

❌ **Inconvénients** / Limites :
- Console texte rudimentaire, pas de défilement sophistiqué.
- Cinq fonctions sont exportées sans être déclarées dans un en-tête, donc hors contrat.

## Connexions

### Notes liées
- [[PS2SDK - breakpoints matériels libeedebug]] - L'outil de debug de niveau inférieur
- [[PS2SDK - répartition des bibliothèques EE]] - Le contenu détaillé de `libdebug`
- [[PS2SDK - squelette d'un programme EE]] - Où `init_scr` s'insère
- [[PS2 - GS Graphics Synthesizer]] - Le registre memory-mappé de `DEBUG_BGCOLOR`

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitres 3a et 3n) — `ee/include/debug.h`, `ee/include/screenshot.h`

---
**Tags thématiques** : #ps2sdk #debug #libdebug #scrprintf
