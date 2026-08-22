---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - dma
  - graphisme
---

# PS2SDK : [packet_t] - buffer DMA de construction des paquets

> [!abstract] Concept
> `packet_t` encapsule un buffer mémoire aligné sur 64 octets, prêt pour le DMA, dans lequel on construit une chaîne de quadwords (GIFtags et données de primitives) avant de l'envoyer au GIF.

## Explication

La structure tient en quatre champs : la capacité allouée en quadwords, un compteur de quadwords utilisés, un type de mémoire et le pointeur vers le buffer lui-même, déclaré avec `__attribute__((aligned(64)))`. Cet alignement n'est pas cosmétique : le contrôleur DMA transfère par quadwords de 16 octets et exige un buffer correctement aligné.

Le type détermine **où** vit le buffer. `PACKET_NORMAL` utilise la RAM EE classique, cachée. `PACKET_UCAB` utilise la RAM en mode *uncached accelerated*, ce qui accélère l'écriture DMA et dispense de gérer soi-même la cohérence de cache. `PACKET_SPR` place le buffer en scratchpad RAM (16 Ko), la mémoire la plus rapide de l'EE.

Le dimensionnement mérite attention : sous-dimensionner entraîne une **écriture hors bornes silencieuse**, la PS2 n'ayant pas de protection mémoire stricte côté EE — pas de crash garanti, seulement de la corruption potentielle. Sur-dimensionner ne coûte que quelques centaines d'octets. En pratique on prévoit large : `packet_init(50, PACKET_NORMAL)` pour un contenu réel d'une dizaine de quadwords.

## Exemples

### La structure

```c
typedef struct {
    u32 qwords;                                  // capacité allouée, en qwords
    u16 qwc;                                     // compteur de qwords utilisés
    u16 type;                                    // PACKET_NORMAL / UCAB / SPR
    qword_t *data __attribute__((aligned(64)));  // buffer aligné 64 octets
} packet_t;
```

### Les quatre fonctions de `libpacket`

| Fonction | Rôle |
|---|---|
| `packet_init(qwords, type)` | Alloue un `packet_t` de `qwords` quadwords |
| `packet_free(packet)` | Libère le buffer |
| `packet_reset(packet)` | Remet `qwc` à 0 et vide le contenu |
| `packet_increment_qwc(packet, num)` | Avance le compteur, retourne le quadword courant |

### Cycle de vie complet

```c
packet_t *packet = packet_init(50, PACKET_NORMAL);

qword_t *q = packet->data;
q = draw_setup_environment(q, 0, &frame, &z);
q = draw_finish(q);
dma_channel_send_normal(DMA_CHANNEL_GIF, packet->data, q - packet->data, 0, 0);

packet_free(packet);
```

Le nombre de quadwords envoyés se calcule par `q - packet->data`, la différence entre le pointeur courant et le début du buffer.

### Les trois types

| Constante | Valeur | Mémoire utilisée |
|---|---|---|
| `PACKET_NORMAL` | 0x00 | RAM EE classique, cachée |
| `PACKET_UCAB` | 0x01 | RAM *uncached accelerated* |
| `PACKET_SPR` | 0x02 | Scratchpad RAM (16 Ko) |

## Cas d'usage

- **Tout rendu** : c'est le conteneur de tous les paquets GIF.
- **Buffer à faible latence** : `PACKET_SPR` pour des paquets reconstruits à chaque frame.
- **Éviter la gestion de cache** : `PACKET_UCAB`.

## Avantages et inconvénients

✅ **Avantages** :
- L'alignement et l'allocation sont gérés par la bibliothèque.
- Le choix du type change l'emplacement mémoire sans toucher au reste du code.

❌ **Inconvénients** / Limites :
- Aucune vérification de dépassement : le sous-dimensionnement corrompt la mémoire en silence.
- Réécrire le buffer avant la fin du transfert DMA corrompt l'image.

## Connexions

### Notes liées
- [[PS2 - paquet GIF et GIFtag]] - Le contenu que ce buffer transporte
- [[PS2 - synchronisation CPU et DMA]] - Pourquoi ne pas réécrire le buffer trop tôt
- [[PS2SDK - pipeline de rendu bas niveau]] - Son usage dans le cycle de rendu
- [[PS2 - canaux DMA de l'EE]] - Le canal qui consomme ce buffer

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 3k) — `ee/include/packet.h`

---
**Tags thématiques** : #ps2sdk #packet #dma #buffer
