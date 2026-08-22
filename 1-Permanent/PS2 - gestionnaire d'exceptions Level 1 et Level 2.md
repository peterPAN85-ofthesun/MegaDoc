---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - debug
  - exceptions
---

# PS2 - gestionnaire d'exceptions Level 1 et Level 2

> [!abstract] Concept
> Le traitement d'une exception sur l'EE se fait en deux étages : un handler Level 1 posé au vecteur matériel, qui sauvegarde tous les registres et lit la cause, puis un handler Level 2 applicatif choisi selon cette cause et recevant l'état complet du CPU.

## Explication

Quand le R5900 rencontre une exception — breakpoint matériel, division par zéro, accès mémoire invalide, TLB miss, syscall — il saute automatiquement à une **adresse de vecteur fixe** imposée par le matériel, par exemple `0x80000080` pour les exceptions générales. Le code qui s'y trouve s'exécute dans un état très contraint : interruptions désactivées, contexte pas encore sauvegardé. Il doit donc être minimal et robuste.

C'est le rôle du **Level 1** : sauvegarder l'intégralité des registres CPU dans une structure `EE_RegFrame` (GPR, `status`, `cause`, `epc`, `badvaddr`, et les registres de breakpoint `bpc`/`iab`/`dab`/`dvb`), lire le champ ExcCode du registre CAUSE pour identifier la cause exacte, puis dispatcher. `ee_dbg_install(levels)` installe le Level 1 par défaut fourni par le PS2SDK — il n'y a pas lieu d'en écrire un soi-même en usage normal.

Le **Level 2** est le point d'entrée applicatif. Une fois le contexte sauvegardé et la cause identifiée, le Level 1 appelle la fonction Level 2 enregistrée pour cette cause précise, en lui passant le `EE_RegFrame*` complet. C'est là qu'on branche sa propre logique : afficher l'état des registres avec `scr_printf` quand un breakpoint est atteint, par exemple. Chaque type d'exception peut avoir son propre handler Level 2, alors que le Level 1 est en pratique unique et générique.

> [!Note]
> Ce « Level 1 / Level 2 » est propre au mécanisme d'exception du CPU EE — sans rapport avec les niveaux de priorité DMA ou les contextes GS 1/2.

## Exemples

### Le type de handler, commun aux deux niveaux

```c
typedef int (EE_ExceptionHandler)(struct st_EE_RegFrame *);

extern EE_ExceptionHandler *ee_dbg_set_level1_handler(int cause, EE_ExceptionHandler *handler);
extern EE_ExceptionHandler *ee_dbg_set_level2_handler(int cause, EE_ExceptionHandler *handler);
```

### Le flux complet

```
Exception matérielle
      ↓
Vecteur fixe (adresse imposée par le CPU, ex. 0x80000080)
      ↓
Handler Level 1 (sauvegarde EE_RegFrame, lit ExcCode du registre CAUSE)
      ↓
Handler Level 2 (fonction utilisateur, reçoit EE_RegFrame*, indexé par cause)
```

### Brancher sa propre logique

```c
int mon_handler(struct st_EE_RegFrame *frame)
{
    scr_printf("Exception ! epc = %08x\n", frame->epc);
    return 0;
}

ee_dbg_install(3);
ee_dbg_set_level2_handler(EXCEPTION_BREAKPOINT, mon_handler);
```

## Cas d'usage

- **Exploiter un breakpoint matériel** posé par `libeedebug`.
- **Écran de crash** : afficher les registres au moment d'une exception plutôt que de figer.
- **Diagnostiquer un accès invalide** : lire `badvaddr` dans le `EE_RegFrame`.

## Avantages et inconvénients

✅ **Avantages** :
- Séparation nette entre sauvegarde de contexte et logique applicative.
- Un handler différent par cause d'exception.

❌ **Inconvénients** / Limites :
- Le Level 1 s'exécute dans un contexte très contraint, peu tolérant à l'erreur.
- Le mécanisme est peu documenté et propre au R5900.

## Connexions

### Notes liées
- [[PS2SDK - breakpoints matériels libeedebug]] - Ce qui déclenche ces handlers
- [[PS2SDK - convention de préfixe i et underscore]] - Quelles fonctions appeler dans ce contexte
- [[PS2 - EE Emotion Engine et coprocesseurs vectoriels]] - Le CPU concerné
- [[PS2SDK - console de debug libdebug]] - Afficher l'état depuis un handler

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 3n) — `ee/include/ee_debug.h`, `common/include/ps2_debug.h`

---
**Tags thématiques** : #ps2 #exceptions #debug #r5900 #cop0
