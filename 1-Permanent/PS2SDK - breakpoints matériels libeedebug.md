---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - debug
  - cop0
---

# PS2SDK - breakpoints matériels libeedebug

> [!abstract] Concept
> `libeedebug` donne accès aux registres de debug du coprocesseur COP0 de l'EE pour poser des breakpoints matériels sur exécution, lecture, écriture ou **valeur** de donnée, sans debugger externe ni instrumentation du code.

## Explication

Contrairement à `libdebug` qui instrumente le code par affichage, `libeedebug` s'appuie sur le matériel : le R5900 possède des registres dédiés qui déclenchent une exception quand une condition est remplie. On y accède via `ee/include/ee_debug.h`, en ajoutant `-leedebug` à `EE_LIBS` (la bibliothèque n'est pas liée par défaut).

Quatre types de breakpoints sont disponibles, chacun avec sa fonction : `ee_dbg_set_bpx` sur exécution d'une adresse, `ee_dbg_set_bpr` sur lecture, `ee_dbg_set_bpw` sur écriture, et `ee_dbg_set_bpv` sur **valeur** de donnée — ce dernier étant le plus difficile à obtenir autrement. Chacun accepte un masque, ce qui permet de surveiller une plage d'adresses plutôt qu'une adresse unique.

Les mêmes registres sont exposés à un niveau plus brut par des paires `get`/`set` : `bpc` (Breakpoint Control), `iab`/`iabm` (Instruction Address Breakpoint et son masque), `dab`/`dabm` (Data Address Breakpoint), `dvb`/`dvbm` (Data Value Breakpoint). `libdebug` expose d'ailleurs les mêmes notions via `hwbp.h` avec dix-huit fonctions (`InitBPC`, `SetBPC`, `SetInstructionBP`, `SetDataAddrBP`, `SetDataValueBP`…).

L'installation des gestionnaires se fait par `ee_dbg_install(levels)`, qui pose le handler bas niveau fourni par le SDK ; on branche ensuite sa propre logique en Level 2.

## Exemples

### Poser un breakpoint sur écriture d'une variable

```c
ee_dbg_install(3);                                  // installe les niveaux 1 et 2
ee_dbg_set_bpw((u32)&ma_variable, 0xFFFFFFFF, 0);   // arrêt sur écriture
```

### Les principales fonctions

| Fonction | Rôle |
|---|---|
| `ee_dbg_install(levels)` / `ee_dbg_remove(levels)` | Installe/retire les handlers d'exception |
| `ee_dbg_set_level1_handler(cause, h)` | Handler bas niveau, au vecteur matériel |
| `ee_dbg_set_level2_handler(cause, h)` | Handler applicatif, par cause |
| `ee_dbg_set_bpx(addr, mask, opmode)` | Breakpoint sur exécution |
| `ee_dbg_set_bpr(addr, mask, opmode)` | Breakpoint sur lecture |
| `ee_dbg_set_bpw(addr, mask, opmode)` | Breakpoint sur écriture |
| `ee_dbg_set_bpv(value, mask, opmode)` | Breakpoint sur valeur |
| `ee_dbg_clr_bps()` | Efface les breakpoints |

### Ajouter la bibliothèque

```makefile
EE_LIBS = -ldma -lgraph -ldraw -ldebug -leedebug
```

## Cas d'usage

- **Corruption mémoire** : breakpoint sur écriture pour identifier le coupable.
- **Valeur inattendue** : breakpoint sur valeur, impossible à obtenir par instrumentation.
- **Fonction jamais atteinte** : breakpoint sur exécution pour confirmer.

## Avantages et inconvénients

✅ **Avantages** :
- Aucune modification du code surveillé : pas d'effet observateur.
- Le breakpoint sur valeur n'a pas d'équivalent logiciel raisonnable.

❌ **Inconvénients** / Limites :
- Nombre de breakpoints matériels très limité.
- Nécessite d'écrire un handler Level 2 pour exploiter le résultat.

## Connexions

### Notes liées
- [[PS2 - gestionnaire d'exceptions Level 1 et Level 2]] - Le mécanisme sous-jacent
- [[PS2SDK - console de debug libdebug]] - L'approche complémentaire par affichage
- [[PS2SDK - convention de préfixe i et underscore]] - Contexte d'interruption des handlers
- [[PS2 - EE Emotion Engine et coprocesseurs vectoriels]] - Le COP0 concerné

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 3n) — `ee/include/ee_debug.h`, `ee/include/hwbp.h`

---
**Tags thématiques** : #ps2sdk #debug #breakpoints #cop0 #eedebug
