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

<svg viewBox="0 0 450 235" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Deux voies pour que clangd trouve les en-têtes du PS2SDK">
<defs><marker id="lsa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text x="16" y="24" font-size="11.5" fill="currentColor">le code compile, mais l'éditeur ne trouve aucun en-tête : clangd part des chemins de l'HÔTE</text>
<rect x="16" y="34" width="418" height="62" rx="5" fill="#27ae60" fill-opacity="0.08" stroke="#27ae60" stroke-width="1.4"/>
<text x="26" y="52" font-size="10" fill="#27ae60">voie recommandée — capturer le vrai build</text>
<rect x="26" y="60" width="110" height="26" rx="3" fill="#27ae60" fill-opacity="0.15" stroke="#27ae60" stroke-width="1.2"/>
<text x="40" y="77" font-size="9" fill="#27ae60">bear -- make</text>
<line x1="136" y1="73" x2="154" y2="73" stroke="currentColor" stroke-width="1.4" marker-end="url(#lsa)"/>
<rect x="156" y="60" width="140" height="26" rx="3" fill="#27ae60" fill-opacity="0.15" stroke="#27ae60" stroke-width="1.2"/>
<text x="166" y="77" font-size="9" fill="#27ae60">compile_commands.json</text>
<line x1="296" y1="73" x2="314" y2="73" stroke="currentColor" stroke-width="1.4" marker-end="url(#lsa)"/>
<rect x="316" y="60" width="110" height="26" rx="3" fill="#27ae60" fill-opacity="0.15" stroke="#27ae60" stroke-width="1.2"/>
<text x="326" y="77" font-size="9" fill="#27ae60">clangd — flags exacts</text>
<rect x="16" y="108" width="418" height="60" rx="5" fill="#e05252" fill-opacity="0.07" stroke="#e05252" stroke-width="1.4"/>
<text x="26" y="126" font-size="10" fill="#e05252">⚠ le piège des .clangd trouvés en ligne</text>
<text x="26" y="144" font-size="8.5" fill="#e05252" opacity="0.95">ils déclarent trois -isystem vers les en-têtes builtin de GCC (stddef.h, stdint.h…)</text>
<text x="26" y="160" font-size="8.5" fill="#e05252" opacity="0.95">→ ne couvrent AUCUN en-tête du SDK : draw.h, graph.h, tamtypes.h restent introuvables</text>
<rect x="16" y="180" width="418" height="46" rx="5" fill="#4c9aff" fill-opacity="0.08" stroke="#4c9aff" stroke-width="1.3"/>
<text x="26" y="198" font-size="9.5" fill="#4c9aff">filet de sécurité : le .clangd doit reprendre exactement ce qu'injecte EE_INCS</text>
<text x="26" y="216" font-size="9" fill="#4c9aff" opacity="0.95">-I$(PS2SDK)/ee/include   et   -I$(PS2SDK)/common/include</text>
</svg>

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
