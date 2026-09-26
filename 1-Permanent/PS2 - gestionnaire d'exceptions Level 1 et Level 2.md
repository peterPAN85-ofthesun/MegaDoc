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

<svg viewBox="0 0 450 265" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Traitement d'une exception EE en deux étages, Level 1 et Level 2">
<defs><marker id="exa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text x="16" y="24" font-size="11.5" fill="currentColor">le R5900 saute à une adresse fixe imposée par le matériel</text>
<rect x="16" y="34" width="120" height="44" rx="4" fill="#e05252" fill-opacity="0.12" stroke="#e05252" stroke-width="1.4"/>
<text x="24" y="50" font-size="9" fill="#e05252">exception</text>
<text x="24" y="63" font-size="8" fill="#e05252" opacity="0.9">breakpoint · div/0 · accès</text>
<text x="24" y="74" font-size="8" fill="#e05252" opacity="0.9">invalide · TLB miss · syscall</text>
<line x1="136" y1="56" x2="156" y2="56" stroke="currentColor" stroke-width="1.5" marker-end="url(#exa)"/>
<rect x="158" y="34" width="120" height="44" rx="4" fill="none" stroke="currentColor" stroke-width="1.4"/>
<text x="168" y="52" font-size="9.5" fill="currentColor">vecteur 0x80000080</text>
<text x="168" y="68" font-size="8" fill="currentColor" opacity="0.8">interruptions coupées</text>
<line x1="278" y1="56" x2="298" y2="56" stroke="currentColor" stroke-width="1.5" marker-end="url(#exa)"/>
<rect x="300" y="34" width="134" height="44" rx="4" fill="#4c9aff" fill-opacity="0.14" stroke="#4c9aff" stroke-width="1.5"/>
<text x="326" y="52" font-size="10" fill="#4c9aff">LEVEL 1</text>
<text x="308" y="68" font-size="8" fill="#4c9aff" opacity="0.9">minimal et robuste, générique</text>
<rect x="16" y="96" width="418" height="70" rx="5" fill="#4c9aff" fill-opacity="0.06" stroke="#4c9aff" stroke-width="1.3"/>
<text x="26" y="114" font-size="10" fill="#4c9aff">ce que fait le Level 1</text>
<rect x="26" y="122" width="180" height="34" rx="3" fill="none" stroke="#4c9aff" stroke-width="1.1"/>
<text x="32" y="136" font-size="8.5" fill="#4c9aff">1 · sauvegarde tout dans EE_RegFrame</text>
<text x="32" y="150" font-size="8" fill="#4c9aff" opacity="0.85">GPR, status, cause, epc, badvaddr, bpc/iab/dab/dvb</text>
<rect x="214" y="122" width="100" height="34" rx="3" fill="none" stroke="#4c9aff" stroke-width="1.1"/>
<text x="220" y="136" font-size="8.5" fill="#4c9aff">2 · lit ExcCode</text>
<text x="220" y="150" font-size="8" fill="#4c9aff" opacity="0.85">registre CAUSE</text>
<rect x="322" y="122" width="102" height="34" rx="3" fill="none" stroke="#4c9aff" stroke-width="1.1"/>
<text x="328" y="136" font-size="8.5" fill="#4c9aff">3 · dispatche</text>
<text x="328" y="150" font-size="8" fill="#4c9aff" opacity="0.85">selon la cause</text>
<line x1="225" y1="166" x2="225" y2="186" stroke="currentColor" stroke-width="1.5" marker-end="url(#exa)"/>
<rect x="16" y="192" width="418" height="60" rx="5" fill="#27ae60" fill-opacity="0.08" stroke="#27ae60" stroke-width="1.4"/>
<text x="26" y="210" font-size="10" fill="#27ae60">LEVEL 2 — point d'entrée applicatif, reçoit le EE_RegFrame* complet</text>
<text x="26" y="228" font-size="9" fill="#27ae60" opacity="0.95">un handler par type d'exception · ex. afficher les registres avec scr_printf sur breakpoint</text>
<text x="26" y="244" font-size="9" fill="#27ae60" opacity="0.8">ee_dbg_install(levels) installe le Level 1 fourni par le SDK — inutile d'en écrire un</text>
</svg>

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
