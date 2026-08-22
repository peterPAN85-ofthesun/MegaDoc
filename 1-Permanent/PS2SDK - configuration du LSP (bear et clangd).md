---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - outils
  - lsp
---

# PS2SDK - configuration du LSP (bear et clangd)

> [!abstract] Concept
> `bear -- make` capture les vraies lignes de compilation dans un `compile_commands.json` que clangd exploite directement ; un `.clangd` écrit à la main ne sert que de filet de sécurité, et doit impérativement inclure les deux `-I` du SDK sous peine de souligner tout le fichier en rouge.

## Explication

Le problème est classique en cross-compilation : le code compile parfaitement, mais l'éditeur ne trouve aucun en-tête parce que clangd, lancé sans contexte, utilise les chemins de l'hôte. Le SDK n'apparaît nulle part.

`bear -- make` résout cela proprement en interceptant les appels au compilateur pendant un build réel et en écrivant un `compile_commands.json`. Quand ce fichier est présent et à jour, clangd s'en sert et reproduit exactement les flags du build, `EE_INCS` compris.

Le piège porte sur les `.clangd` que l'on trouve en ligne : ils déclarent trois `-isystem` pointant vers les en-têtes **builtin de GCC** (`stddef.h`, `stdint.h`…), ce qui ne couvre **aucun** en-tête du PS2SDK. `draw.h`, `graph.h`, `tamtypes.h` restent introuvables. Il manque exactement ce que `Makefile.eeglobal` injecte via `EE_INCS` : `-I$(PS2SDK)/ee/include` et `-I$(PS2SDK)/common/include`.

## Exemples

### Générer la base de compilation

```bash
bear -- make
```

### `.clangd` complet, avec les deux `-I` manquants

```yaml
CompileFlags:
  Add:
    - --target=mips64el-unknown-elf
    - -isystem/usr/local/ps2dev/ee/lib/gcc/mips64r5900el-ps2-elf/15.2.0/include
    - -isystem/usr/local/ps2dev/ee/lib/gcc/mips64r5900el-ps2-elf/15.2.0/include-fixed
    - -isystem/usr/local/ps2dev/ee/mips64r5900el-ps2-elf/include
    - -I/usr/local/ps2dev/ps2sdk/ee/include
    - -I/usr/local/ps2dev/ps2sdk/common/include
```

## Cas d'usage

- **Complétion et navigation** sur les fonctions du SDK dans l'éditeur.
- **Diagnostiquer un fichier tout rouge** alors que `make` passe.
- **Projet multi-cibles EE/IOP** : `compile_commands.json` distingue les deux automatiquement.

## Avantages et inconvénients

✅ **Avantages** :
- `bear` ne demande aucune maintenance : il suit le Makefile.
- Les erreurs affichées correspondent aux vraies erreurs de compilation.

❌ **Inconvénients** / Limites :
- `compile_commands.json` doit être régénéré après un changement de flags.
- Le `.clangd` manuel duplique une information qui vit déjà dans le Makefile.

## Connexions

### Notes liées
- [[PS2SDK - emplacement des en-têtes et bibliothèques]] - Les chemins à déclarer
- [[PS2SDK - hiérarchie des Makefile du SDK]] - `EE_INCS`, la source de vérité
- [[PS2SDK - Makefile d'un projet EE]] - Le build que `bear` observe
- [[CMAKE : [CMAKE_EXPORT_COMPILE_COMMANDS] - variable génération compile_commands.json]] - Le même fichier, généré par CMake

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 2)

---
**Tags thématiques** : #ps2sdk #clangd #lsp #bear #outils
