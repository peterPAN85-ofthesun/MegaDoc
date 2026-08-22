---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - informatique
  - representation
  - flottants
---

# IEEE-754 - simple précision 32 bits

> [!abstract] Concept
> Un `float` 32 bits IEEE-754 se décompose en un bit de signe, huit bits d'exposant biaisé de +127 et vingt-trois bits de mantisse à bit implicite ; d'où `1.0f` = `0x3F800000`.

## Explication

La norme IEEE-754 fixe la représentation binaire des nombres à virgule flottante. En simple précision, la valeur se reconstruit par la formule `valeur = (-1)^signe × 1.mantisse × 2^(exposant-127)`. Le `1.` de tête n'est pas stocké — c'est le **bit implicite** — ce qui gagne un bit de précision. L'exposant est **biaisé** de 127 pour représenter les puissances négatives sans champ de signe séparé.

La conséquence pratique la plus importante concerne l'interprétation : le même motif de 32 bits vaut une chose lu comme entier et une tout autre chose lu comme flottant. Un cast C `(u32)1.0f` **convertit** la valeur et donne l'entier `1` ; réinterpréter les bits demande de passer par l'adresse (`*(u32*)&f`) ou par une union. Confondre les deux est un bug classique.

Cette distinction devient critique dès qu'on écrit à la main un champ flottant dans une structure binaire — registre matériel, format de fichier, paquet réseau. Le matériel n'effectue aucune conversion implicite : il attend le pattern binaire brut.

## Exemples

### Les trois champs

| Champ | Bits | Rôle |
|---|---|---|
| Signe | 31 | 0 = positif, 1 = négatif |
| Exposant | 23-30 (8 bits) | exposant biaisé (+127) |
| Mantisse | 0-22 (23 bits) | partie fractionnaire, bit implicite `1.` non stocké |

### Décodage de `0x3F800000`

```
0x3F800000 = 0 01111111 00000000000000000000000
             │ └──┬───┘ └───────────┬──────────┘
           signe exposant=127     mantisse=0
             =0  →127-127=0

valeur = (-1)^0 × 1.0 × 2^0 = 1.0f
```

### Convertir vs réinterpréter en C

```c
float f = 1.0f;

u32 converti     = (u32)f;        // → 1          (conversion de valeur)
u32 reinterprete = *(u32*)&f;     // → 0x3F800000 (mêmes bits)
```

## Cas d'usage

- **Écrire un champ flottant dans un registre matériel** (ex. le champ `Q` du registre RGBAQ de la PS2).
- **Sérialiser des flottants** dans un format binaire.
- **Déboguer une valeur aberrante** : décoder le pattern à la main pour distinguer un NaN d'une dénormalisée.

## Avantages et inconvénients

✅ **Avantages** :
- Format universel, identique sur toutes les architectures modernes.
- Le bit implicite offre 24 bits effectifs de précision pour 23 bits stockés.

❌ **Inconvénients** / Limites :
- Précision limitée : environ 7 chiffres décimaux significatifs.
- Confondre conversion et réinterprétation produit une erreur silencieuse.

## Connexions

### Notes liées
- [[PS2 - registre RGBAQ]] - Un cas concret de champ flottant packé à la main
- [[C - types de données primitifs]] - Les types float et double en C
- [[C - conversion de types (casting)]] - La différence entre convertir et réinterpréter
- [[C - pointeurs (concepts de base)]] - Le mécanisme du cast d'adresse

### Dans le contexte de
- [[MOC - Programmation C]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 3l, aparté IEEE-754)

---
**Tags thématiques** : #ieee754 #flottants #binaire #representation
