---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - peripheriques
  - memorycard
---

# PS2SDK - carte mémoire avec libmc

> [!abstract] Concept
> Après chargement de `SIO2MAN`, `MCMAN` et `MCSERV` et un `mcInit`, la carte mémoire s'utilise soit par l'API `mc*` — asynchrone, chaque appel suivi d'un `mcSync` — soit par l'API fichier standard sur les devices `mc0:` et `mc1:`.

## Explication

Trois modules sont nécessaires et dans cet ordre : `SIO2MAN` pour le bus série physique, `MCMAN` pour l'accès bloc bas niveau, `MCSERV` pour la couche système de fichiers et le serveur RPC. `mcInit(MC_TYPE_MC)` initialise ensuite le client côté EE.

Le point structurant de `libmc` est que **la plupart des fonctions `mc*` sont asynchrones** : `mcGetInfo`, `mcGetDir` et consorts lancent l'opération et rendent la main. Le résultat s'obtient en appelant `mcSync`, qui bloque jusqu'à complétion et renseigne le code de retour. Oublier le `mcSync` donne des valeurs non initialisées, sans erreur.

Une fois `mcInit` effectué, l'API fichier standard fonctionne directement sur les devices `mc0:` (slot 0) et `mc1:` (slot 1) : `open`, `read`, `write`, `close`, `mkdir` s'utilisent normalement. C'est la voie la plus simple pour lire ou écrire un fichier de sauvegarde.

Enfin, une sauvegarde PS2 n'est pas un fichier mais un **dossier** contenant `icon.sys` — les métadonnées d'affichage dans le navigateur de la console : couleurs, éclairage 3D de l'icône, nom en SJIS — accompagné des fichiers d'icône `.icn` et des données du jeu.

## Exemples

### Lister la racine de la carte

```c
#define ARRAY_ENTRIES 64
static sceMcTblGetDir mcDir[ARRAY_ENTRIES] __attribute__((aligned(64)));

int type, free, format, ret, i;

sceSifInitRpc(0);
SifLoadModule("rom0:SIO2MAN", 0, NULL);
SifLoadModule("rom0:MCMAN", 0, NULL);
SifLoadModule("rom0:MCSERV", 0, NULL);

if (mcInit(MC_TYPE_MC) < 0) {
    printf("Failed to initialise memcard server!\n");
    SleepThread();
}

mcGetInfo(0, 0, &type, &free, &format);
mcSync(0, NULL, &ret);                      // obligatoire : l'appel est asynchrone
printf("Type: %d Free: %d Format: %d\n", type, free, format);

mcGetDir(0, 0, "/*", 0, ARRAY_ENTRIES, mcDir);
mcSync(0, NULL, &ret);

for (i = 0; i < ret; i++) {
    if (mcDir[i].AttrFile & MC_ATTR_SUBDIR)
        printf("[DIR] %s\n", mcDir[i].EntryName);
    else
        printf("%s - %d octets\n", mcDir[i].EntryName, mcDir[i].FileSizeByte);
}
```

### L'API fichier standard après `mcInit`

```c
int fd = open("mc0:PS2DEV/icon.sys", O_RDONLY);
if (fd >= 0) {
    printf("icon.sys existe deja.\n");
    close(fd);
}
```

```makefile
EE_LIBS = -lmc -lc
```

## Cas d'usage

- **Sauvegarde d'un jeu** : créer un dossier avec `icon.sys` et les données.
- **Vérifier l'espace disponible** avant écriture : `mcGetInfo`.
- **Navigateur de fichiers** : `mcGetDir` sur `"/*"`.

## Avantages et inconvénients

✅ **Avantages** :
- L'API fichier standard fonctionne dès `mcInit`, sans apprendre `libmc`.
- L'asynchronisme permet de continuer à afficher pendant un accès lent.

❌ **Inconvénients** / Limites :
- Oublier `mcSync` produit des résultats non initialisés en silence.
- Une sauvegarde conforme exige un `icon.sys` correct, format peu documenté.

## Connexions

### Notes liées
- [[PS2 - SIO2MAN bus partagé pad et carte mémoire]] - Les modules et leur empilement
- [[PS2SDK - lecture de la manette avec libpad]] - Le même bus, l'autre périphérique
- [[PS2SDK - accès disque avec fileXio]] - L'autre voie d'accès aux fichiers
- [[PS2 - IOP et modules IRX]] - Le chargement des modules

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 5) — `samples/rpc/memorycard/mc_example.c`

---
**Tags thématiques** : #ps2sdk #libmc #memorycard #peripheriques
