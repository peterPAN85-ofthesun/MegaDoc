---
type: permanent
created: 2026-09-26 11:20
tags:
  - permanent
  - mathematiques
  - quaternions
  - optimisation
---

# MATH - quaternion vs matrice de rotation (coûts)

> [!abstract] Concept
> Le quaternion gagne nettement en mémoire ($4$ contre $9$) et en composition de rotations ($28$ contre $45$ opérations), mais perd pour faire tourner des vecteurs — d'où la stratégie hybride : composer en quaternions, convertir en matrice, appliquer la matrice.

## Explication

Les deux représentations ne se valent pas sur les mêmes terrains, et le choix se tranche par un décompte d'opérations plutôt que par principe.

**Espace mémoire**

| Méthode | Mémoire |
|---|---|
| Matrice de rotation | $9$ |
| Quaternion | $4$ |
| Axe et angle | $4^{*}$ |

> [!note]
> La représentation axe-angle peut tenir dans $3$ emplacements en multipliant l'axe unitaire par l'angle ; mais avant de l'utiliser il faut récupérer le vecteur unitaire et l'angle en renormalisant, ce qui coûte des opérations supplémentaires.

**Composer une rotation avec une autre**

| Méthode | Multiplications | Additions et soustractions | Total |
|---|---|---|---|
| Matrice de rotation | $27$ | $18$ | $45$ |
| Quaternion | $16$ | $12$ | $28$ |

**Faire tourner un seul vecteur**

| Méthode | | Mult. | Add./Sous. | $\sin$ et $\cos$ | Total |
|---|---|---|---|---|---|
| Matrice de rotation | | $9$ | $6$ | $0$ | $15$ |
| Quaternion | sans matrice intermédiaire | $15$ | $15$ | $0$ | $30$ |
| Quaternion | avec matrice intermédiaire | $21$ | $18$ | $0$ | $39$ |
| Axe et angle | sans matrice intermédiaire | $18$ | $13$ | $2$ | $30 + 3$ |
| Axe et angle | avec matrice intermédiaire | $21$ | $16$ | $2$ | $37 + 2$ |

**Faire tourner $n$ vecteurs**

| Méthode | | Mult. | Add./Sous. | $\sin$ et $\cos$ | Total |
|---|---|---|---|---|---|
| Matrice de rotation | | $9n$ | $6n$ | $0$ | $15n$ |
| Quaternion | sans matrice intermédiaire | $15n$ | $15n$ | $0$ | $30n$ |
| Quaternion | avec matrice intermédiaire | $9n + 12$ | $6n + 12$ | $0$ | $15n + 24$ |
| Axe et angle | sans matrice intermédiaire | $18n$ | $12n + 1$ | $2$ | $30n + 3$ |
| Axe et angle | avec matrice intermédiaire | $9n + 12$ | $16n + 10$ | $2$ | $15n + 24$ |

La lecture de la dernière table donne la règle de conception. Dès que $n$ devient grand, le coût fixe de $24$ opérations de conversion s'amortit et les deux méthodes convergent vers $15n$ : **sur une grande quantité de vecteurs à orienter, elles sont significativement identiques**. Le quaternion ne gagne donc pas sur l'application, il gagne sur le **stockage** et sur la **composition** — exactement les deux opérations qu'un moteur effectue en permanence sur les orientations.

> [!note]
> Passer par une matrice orthogonale obtenue par l'action de conjugaison est plus efficace que d'appliquer directement le quaternion aux coordonnées de chaque vecteur.

Le choix ne se résume d'ailleurs pas au coût : le quaternion évite le blocage de cardan, s'interpole proprement (slerp) et se renormalise en une division, là où une matrice demande une réorthonormalisation complète.

## Exemples

### Exemple 1 — la stratégie hybride
Un moteur 3D stocke l'orientation de chaque objet en quaternion ($4$ flottants), accumule les rotations par produits de Hamilton ($28$ opérations), puis convertit **une seule fois par image** en matrice $3 \times 3$ pour transformer les milliers de sommets du maillage.

### Exemple 2 — le point d'équilibre
Pour $n = 1$ vecteur : matrice $15$, quaternion $30$ — la matrice gagne. Pour $n = 100$ : $1500$ contre $1524$ — l'écart devient négligeable.

## Cas d'usage

- **Animation et interpolation** : stocker et mélanger des orientations en quaternions.
- **Transformation de maillages** : convertir en matrice avant de traiter les sommets.
- **Systèmes embarqués** : privilégier les $4$ flottants du quaternion quand la mémoire est comptée.

## Connexions

### Notes liées
- [[MATH - rotation par conjugaison de quaternion]] - l'opération dont le coût est mesuré ici
- [[MATH - matrices de rotation autour des axes]] - la représentation concurrente
- [[MATH - produit de Hamilton]] - les $28$ opérations de la composition
- [[MATH - matrice orthogonale (inverse par transposition)]] - la matrice intermédiaire produite par conversion

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine
- [[PS2 - EE Emotion Engine et coprocesseurs vectoriels]] - matériel où ce décompte d'opérations est décisif

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#quaternions` `#optimisation`
