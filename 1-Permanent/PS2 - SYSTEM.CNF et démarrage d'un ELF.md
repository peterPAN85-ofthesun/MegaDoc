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
