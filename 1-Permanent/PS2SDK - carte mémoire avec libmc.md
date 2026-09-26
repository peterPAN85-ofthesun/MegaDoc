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

<svg viewBox="0 0 450 255" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pile de modules et modèle asynchrone de libmc">
<defs><marker id="mca" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text x="16" y="24" font-size="11.5" fill="currentColor">trois modules, dans cet ordre</text>
<rect x="16" y="32" width="126" height="30" rx="4" fill="#f2994a" fill-opacity="0.14" stroke="#f2994a" stroke-width="1.3"/>
<text x="26" y="52" font-size="9.5" fill="#f2994a">1 · SIO2MAN (bus)</text>
<line x1="142" y1="47" x2="158" y2="47" stroke="currentColor" stroke-width="1.4" marker-end="url(#mca)"/>
<rect x="160" y="32" width="126" height="30" rx="4" fill="#f2994a" fill-opacity="0.14" stroke="#f2994a" stroke-width="1.3"/>
<text x="170" y="52" font-size="9.5" fill="#f2994a">2 · MCMAN (blocs)</text>
<line x1="286" y1="47" x2="302" y2="47" stroke="currentColor" stroke-width="1.4" marker-end="url(#mca)"/>
<rect x="304" y="32" width="130" height="30" rx="4" fill="#f2994a" fill-opacity="0.14" stroke="#f2994a" stroke-width="1.3"/>
<text x="314" y="52" font-size="9.5" fill="#f2994a">3 · MCSERV (FS+RPC)</text>
<text x="16" y="82" font-size="9.5" fill="currentColor">puis mcInit(MC_TYPE_MC) côté EE</text>
<rect x="16" y="94" width="206" height="80" rx="5" fill="#e05252" fill-opacity="0.07" stroke="#e05252" stroke-width="1.3"/>
<text x="26" y="112" font-size="10" fill="#e05252">API mc* — ASYNCHRONE</text>
<rect x="26" y="120" width="186" height="20" rx="3" fill="none" stroke="#e05252" stroke-width="1"/>
<text x="32" y="134" font-size="8.5" fill="#e05252">mcGetInfo() → rend la main aussitôt</text>
<rect x="26" y="144" width="186" height="20" rx="3" fill="#27ae60" fill-opacity="0.15" stroke="#27ae60" stroke-width="1.2"/>
<text x="32" y="158" font-size="8.5" fill="#27ae60">mcSync() → bloque et renseigne le retour</text>
<text x="26" y="170" font-size="8" fill="#e05252" opacity="0.9">sans mcSync : valeurs non initialisées, sans erreur</text>
<rect x="232" y="94" width="202" height="80" rx="5" fill="#27ae60" fill-opacity="0.08" stroke="#27ae60" stroke-width="1.3"/>
<text x="242" y="112" font-size="10" fill="#27ae60">API fichier standard — la voie simple</text>
<text x="242" y="132" font-size="9" fill="#27ae60" opacity="0.95">devices mc0: (slot 0) et mc1: (slot 1)</text>
<text x="242" y="150" font-size="9" fill="#27ae60" opacity="0.95">open · read · write · close · mkdir</text>
<text x="242" y="166" font-size="8.5" fill="#27ae60" opacity="0.8">fonctionne dès mcInit effectué</text>
<rect x="16" y="188" width="418" height="58" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>
<text x="26" y="206" font-size="10" fill="currentColor">une sauvegarde PS2 n'est pas un fichier mais un DOSSIER</text>
<rect x="26" y="214" width="110" height="24" rx="3" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff" stroke-width="1.1"/>
<text x="34" y="230" font-size="8.5" fill="#4c9aff">icon.sys (métadonnées)</text>
<rect x="144" y="214" width="90" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="1"/>
<text x="154" y="230" font-size="8.5" fill="currentColor">icônes .icn</text>
<rect x="242" y="214" width="110" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="1"/>
<text x="252" y="230" font-size="8.5" fill="currentColor">données du jeu</text>
<text x="360" y="230" font-size="8" fill="currentColor" opacity="0.75">nom en SJIS</text>
</svg>

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
