---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - kernel
  - interruptions
---

# PS2SDK - convention de préfixe i et underscore

> [!abstract] Concept
> Dans `libkernel`, le préfixe `i` désigne la variante d'une fonction appelable **depuis un contexte d'interruption**, et le préfixe `_` une variante interne bas niveau ; utiliser la mauvaise depuis un handler se paie par un blocage ou une corruption d'état.

## Explication

43 fonctions de `libkernel` existent en doublon préfixé `i`, dont 42 ont leur jumelle sans préfixe. La différence n'est pas cosmétique : la version `i` ne reprogramme pas l'ordonnanceur et ne peut pas se mettre en attente, ce qui la rend sûre à l'intérieur d'un gestionnaire d'interruption. La version sans préfixe, elle, suppose un contexte de thread normal.

Le préfixe `_` marque une autre distinction, orthogonale : 37 fonctions (`_EnableDmac`, `_DisableIntc`, `_ExecPS2`, `_InitSys`…) sont des variantes internes situées **en dessous** de la couche publique. Les deux conventions se combinent, d'où des noms comme `_iEnableDmac`.

C'est le point le plus utile à retenir de `libkernel` en pratique : dès qu'on écrit un handler (`AddIntcHandler`, `AddDmacHandler`, un handler vsync), la question « quelle variante appeler ? » se pose systématiquement, et la réponse est presque toujours la version `i`.

## Exemples

### Les paires les plus courantes

```
WakeupThread   ↔  iWakeupThread
SignalSema     ↔  iSignalSema
EnableIntc     ↔  iEnableIntc
FlushCache     ↔  iFlushCache
```

### Réveiller un thread depuis un handler d'interruption

```c
int mon_handler(int cause)
{
    iWakeupThread(main_thread_id);   // et surtout pas WakeupThread
    return 0;
}
```

## Cas d'usage

- **Handler d'interruption DMA ou INTC** : signaler un sémaphore avec `iSignalSema`.
- **Handler de vsync** : réveiller le thread de rendu avec `iWakeupThread`.
- **Lecture de code SDK** : reconnaître au premier coup d'œil dans quel contexte s'exécute une fonction.

## Avantages et inconvénients

✅ **Avantages** :
- Convention lisible : le contexte d'appel se lit dans le nom.
- Évite d'avoir à documenter chaque fonction séparément.

❌ **Inconvénients** / Limites :
- Aucune vérification à la compilation : l'erreur ne se voit qu'à l'exécution, sous forme de blocage.
- Le préfixe `_` n'est presque pas documenté.

## Connexions

### Notes liées
- [[PS2SDK - répartition des bibliothèques EE]] - Le contexte de `libkernel`
- [[PS2 - gestionnaire d'exceptions Level 1 et Level 2]] - L'autre mécanisme de contexte contraint
- [[PS2 - synchronisation CPU et DMA]] - Où les interruptions interviennent
- [[PS2 - EE Emotion Engine et coprocesseurs vectoriels]] - Le processeur concerné

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 2, « La convention de préfixe i et _ »)

---
**Tags thématiques** : #ps2sdk #libkernel #interruptions #convention
