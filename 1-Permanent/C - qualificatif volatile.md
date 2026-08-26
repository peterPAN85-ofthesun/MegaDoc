---
type: permanent
created: 2026-08-26 00:00
tags:
  - permanent
  - programmation
  - c
  - volatile
  - embarqué
---

# C - qualificatif volatile

> [!abstract] Concept
> `volatile` est un qualificatif de type qui indique au compilateur qu'une variable peut changer de valeur à tout moment, en dehors du flux normal du programme, et qu'elle ne doit donc jamais être optimisée (pas de cache en registre, pas de suppression d'accès jugés "redondants").

## Explication

Par défaut, le compilateur optimise les accès aux variables : il peut garder une valeur en registre au lieu de la relire en mémoire, réordonner des lectures/écritures, ou supprimer une boucle d'attente s'il estime que la condition ne change jamais dans le code qu'il voit.

Ces optimisations sont invalides quand la variable peut être modifiée par une source **externe au flux d'exécution normal** :
- un registre matériel (memory-mapped I/O),
- une routine d'interruption (ISR),
- un contrôleur DMA qui écrit en mémoire en tâche de fond,
- un autre thread ou cœur.

`volatile` force le compilateur à relire/réécrire la variable en mémoire à **chaque accès**, exactement comme écrit dans le code source.

**Ce que `volatile` ne fait PAS** :
- ne rend pas l'accès atomique,
- ne synchronise pas entre threads/cœurs (aucune barrière mémoire),
- ne protège pas contre les race conditions.

Pour la synchronisation entre threads, on utilise des primitives dédiées (mutex, atomics), pas `volatile` seul.

## Exemples

### Boucle d'attente sur un registre matériel

```c
volatile u32* reg = (volatile u32*)0x12000000;

while (*reg & BUSY_FLAG) {
    // sans volatile, le compilateur peut ne lire *reg qu'une fois,
    // constater que BUSY_FLAG est toujours vrai, et transformer
    // la boucle en boucle infinie (ou l'éliminer si jugée sans effet)
}
```

### Variable modifiée par une interruption

```c
volatile int irq_flag = 0;

void interrupt_handler(void) {
    irq_flag = 1;  // modifiée en dehors du flux principal
}

int main(void) {
    while (!irq_flag) {
        // attend l'interruption ; sans volatile, le compilateur
        // pourrait supposer que irq_flag ne change jamais ici
    }
    return 0;
}
```

## Cas d'usage

- **Accès aux registres matériels** : cas d'usage le plus courant, typique de la programmation embarquée et des consoles (voir exemple PS2 ci-dessous).
- **Variables partagées avec une ISR** : un flag mis à jour par un gestionnaire d'interruption et lu dans la boucle principale.
- **Buffers remplis par DMA** : la mémoire change sans que le CPU exécute d'instruction à cet endroit.
- **Variables partagées entre threads** : utile en complément de primitives de synchronisation, jamais en remplacement.

### Exemple PS2SDK

Sur PS2, les registres du GS (Graphics Synthesizer), de l'IOP ou des contrôleurs DMA sont mappés en mémoire (memory-mapped I/O). Le CPU (EE) doit les lire avec `volatile`, sinon le compilateur peut optimiser une boucle de polling de statut (par exemple attendre la fin d'un transfert DMA) en une lecture unique, ce qui bloquerait le programme indéfiniment ou lui ferait rater l'état réel du matériel. Voir [[MOC - PS2 Homebrew]] pour le contexte plus large de ces mécanismes matériels EE/IOP/GS/DMA.

## Connexions

- [[C - variables (déclaration et portée)]] - `volatile` est un autre modificateur de variable, orthogonal à `const`/`static`
- [[C - types de données primitifs]] - `volatile` qualifie un type, comme `const`
- [[C - pointeurs (concepts de base)]] - cas fréquent : pointeur vers une adresse mémoire volatile (`volatile u32*`)
- [[MOC - PS2 Homebrew]] - application concrète : accès aux registres matériels EE/IOP/GS/DMA

## Sources
- Conversation Claude Code, 2026-08-26

---
**Tags thématiques** : #c #volatile #embarqué #hardware #interruption #dma
