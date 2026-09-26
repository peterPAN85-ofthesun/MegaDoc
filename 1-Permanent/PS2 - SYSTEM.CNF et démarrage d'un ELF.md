---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - boot
  - iso
---

# PS2 - SYSTEM.CNF et démarrage d'un ELF

> [!abstract] Concept
> `SYSTEM.CNF` est le premier fichier lu à l'insertion d'un disque PS2 : c'est lui qui désigne quel binaire `.elf` exécuter, avec quelle version et quel mode vidéo.

## Explication

La console ne cherche pas un exécutable par convention de nom : elle lit `SYSTEM.CNF` à la racine du disque et suit la ligne `BOOT2`. Le chemin y est exprimé avec le device `cdrom0:` et la syntaxe ISO9660 historique, antislashs et suffixe `;1` compris — `cdrom0:\TEST.ELF;1`. C'est le même préfixe de device que celui utilisé plus tard dans le code pour ouvrir des fichiers sur le disque.

Le fichier porte deux autres informations : `VER`, la version du programme, et `VMODE`, qui déclare le standard vidéo (`NTSC` ou `PAL`). Ce dernier a un effet réel sur la fréquence de rafraîchissement et donc sur la cadence des `graph_wait_vsync()` (60 Hz en NTSC, 50 Hz en PAL).

Côté build, l'ISO se fabrique en assemblant l'ELF et ce fichier avec `mkisofs`. C'est la raison d'être de la cible `ISO_TGT` ajoutée au Makefile d'un projet : l'ELF seul ne suffit pas à produire un disque bootable.

<svg viewBox="0 0 450 240" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chaîne de démarrage d'un disque PS2 via SYSTEM.CNF">
<defs><marker id="sca" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text x="16" y="24" font-size="11.5" fill="currentColor">la console ne cherche aucun exécutable par convention de nom</text>
<rect x="16" y="34" width="100" height="40" rx="4" fill="none" stroke="currentColor" stroke-width="1.4"/>
<text x="26" y="50" font-size="9" fill="currentColor">insertion disque</text>
<text x="26" y="64" font-size="8.5" fill="currentColor" opacity="0.8">racine du volume</text>
<line x1="116" y1="54" x2="134" y2="54" stroke="currentColor" stroke-width="1.5" marker-end="url(#sca)"/>
<rect x="136" y="34" width="150" height="40" rx="4" fill="#f2994a" fill-opacity="0.16" stroke="#f2994a" stroke-width="1.5"/>
<text x="164" y="50" font-size="10" fill="#f2994a">SYSTEM.CNF</text>
<text x="146" y="65" font-size="8.5" fill="#f2994a" opacity="0.9">premier fichier lu</text>
<line x1="286" y1="54" x2="304" y2="54" stroke="currentColor" stroke-width="1.5" marker-end="url(#sca)"/>
<rect x="306" y="34" width="128" height="40" rx="4" fill="#27ae60" fill-opacity="0.14" stroke="#27ae60" stroke-width="1.4"/>
<text x="330" y="50" font-size="9.5" fill="#27ae60">TEST.ELF</text>
<text x="316" y="65" font-size="8.5" fill="#27ae60" opacity="0.9">exécution sur l'EE</text>
<rect x="16" y="92" width="418" height="78" rx="5" fill="#f2994a" fill-opacity="0.06" stroke="#f2994a" stroke-width="1.3"/>
<text x="26" y="110" font-size="10" fill="#f2994a">les trois lignes du fichier</text>
<rect x="26" y="118" width="190" height="22" rx="3" fill="#f2994a" fill-opacity="0.15" stroke="#f2994a" stroke-width="1.1"/>
<text x="32" y="133" font-size="8.5" fill="#f2994a">BOOT2 = cdrom0:\TEST.ELF;1</text>
<text x="224" y="133" font-size="8.5" fill="currentColor" opacity="0.85">device + syntaxe ISO9660 (antislash, ;1)</text>
<rect x="26" y="144" width="90" height="20" rx="3" fill="none" stroke="#f2994a" stroke-width="1"/>
<text x="32" y="158" font-size="8.5" fill="#f2994a">VER = version</text>
<rect x="124" y="144" width="92" height="20" rx="3" fill="none" stroke="#f2994a" stroke-width="1"/>
<text x="130" y="158" font-size="8.5" fill="#f2994a">VMODE = NTSC/PAL</text>
<text x="224" y="158" font-size="8.5" fill="currentColor" opacity="0.85">→ cadence de graph_wait_vsync : 60 ou 50 Hz</text>
<rect x="16" y="186" width="418" height="44" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>
<text x="26" y="204" font-size="9.5" fill="currentColor">côté build : mkisofs assemble l'ELF + SYSTEM.CNF → cible ISO_TGT du Makefile</text>
<text x="26" y="220" font-size="9" fill="currentColor" opacity="0.85">l'ELF seul ne produit pas un disque bootable</text>
</svg>

## Exemples

### Un `SYSTEM.CNF` minimal

```
BOOT2 = cdrom0:\TEST.ELF;1
VER = 0.0
VMODE = NTSC
```

### La règle de build correspondante

```makefile
ISO_TGT=test.iso

$(ISO_TGT): $(EE_BIN)
	mkisofs -l -o $(ISO_TGT) $(EE_BIN) SYSTEM.CNF
```

## Cas d'usage

- **Produire une ISO testable en émulateur** (PCSX2) ou gravable.
- **Basculer NTSC/PAL** sans recompiler le programme.
- **Renommer l'exécutable** : penser à mettre `BOOT2` à jour.

## Avantages et inconvénients

✅ **Avantages** :
- Mécanisme trivial, trois lignes de texte.
- Découple le nom du binaire du processus de boot.

❌ **Inconvénients** / Limites :
- La syntaxe ISO9660 (`\`, `;1`, majuscules) est facile à écrire de travers.
- Aucun message d'erreur exploitable si le chemin est faux : la console refuse simplement de démarrer.

## Connexions

### Notes liées
- [[PS2SDK - Makefile d'un projet EE]] - La règle `mkisofs` qui assemble l'ISO
- [[PS2SDK - squelette d'un programme EE]] - Le contenu de l'ELF ainsi démarré
- [[PS2SDK - accès disque avec fileXio]] - Le même device `cdrom0:` côté code
- [[PS2 - architecture multiprocesseur]] - Le contexte matériel du démarrage

- [[ELF - Executable and Linkable Format]] - Le format du binaire désigné par `BOOT2`

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 2)

---
**Tags thématiques** : #ps2 #boot #iso #systemcnf
