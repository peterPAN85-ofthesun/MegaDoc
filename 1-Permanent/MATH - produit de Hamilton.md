---
type: permanent
created: 2026-09-26 11:10
tags:
  - permanent
  - mathematiques
  - quaternions
  - algebre
---

# MATH - produit de Hamilton

> [!abstract] Concept
> Le produit de deux quaternions écrits sous forme scalaire-vecteur combine en une seule formule un produit scalaire et un produit vectoriel : $(s + \vec{v})(t + \vec{w}) = (st - \vec{v} \cdot \vec{w}) + (s\vec{w} + t\vec{v} + \vec{v} \wedge \vec{w})$.

## Explication

Multiplier $q_1 = a_1 + \vec{v_1}$ par $q_2 = a_2 + \vec{v_2}$ en développant terme à terme donne quatre contributions : $a_1 a_2$, $a_1 \vec{v_2}$, $a_2 \vec{v_1}$ et $\vec{v_1} \vec{v_2}$. Les trois premières sont immédiates ; toute la difficulté tient dans le produit de deux parties imaginaires, qui se décompose en :

$$\vec{v} \vec{w} = -\vec{v} \cdot \vec{w} + \vec{v} \wedge \vec{w}$$

Un **scalaire** (le produit scalaire, précédé d'un signe moins hérité de $i^{2} = -1$) et un **vecteur** (le produit vectoriel). En regroupant, on obtient le produit de Hamilton :

$$q_1 q_2 = \underbrace{(a_1 a_2 - \vec{v_1} \cdot \vec{v_2})}_{\text{partie réelle}} + \underbrace{(a_1 \vec{v_2} + a_2 \vec{v_1} + \vec{v_1} \wedge \vec{v_2})}_{\text{partie imaginaire}}$$

Cette écriture explique d'un coup d'œil la **non-commutativité** : tous les termes sont symétriques en $q_1$ et $q_2$ **sauf** le produit vectoriel, qui change de signe quand on échange les facteurs. Intervertir les opérandes ne modifie donc que la composante $\vec{v_1} \wedge \vec{v_2}$, mais cela suffit : $q_1 q_2 \neq q_2 q_1$ dès que les parties vectorielles ne sont pas colinéaires. Quand l'un des facteurs est un réel pur ($\vec{v} = \vec{0}$), le produit vectoriel disparaît et la commutativité revient.

Le produit reste **associatif** — $\mathbb{H}$ ne perd cette propriété qu'à l'étage suivant, celui des octonions — ce qui autorise à enchaîner les rotations sans parenthéser. Son coût est de $16$ multiplications et $12$ additions, contre $27$ et $18$ pour le produit de deux matrices de rotation.

## Exemples

### Exemple 1 — retrouver la table des unités
Avec $q_1 = i$ ($a_1 = 0$, $\vec{v_1} = \vec{i}$) et $q_2 = j$ :
$$ij = (0 - \vec{i} \cdot \vec{j}) + (\vec{0} + \vec{0} + \vec{i} \wedge \vec{j}) = 0 + \vec{k} = k$$
et dans l'autre sens, $\vec{j} \wedge \vec{i} = -\vec{k}$, donc $ji = -k$. La relation fondatrice se déduit bien de la formule.

### Exemple 2 — composer deux rotations
Appliquer la rotation $q_1$ puis la rotation $q_2$ revient à appliquer la rotation $q_2 q_1$ : une seule multiplication de quaternions remplace un produit de matrices $3 \times 3$. L'ordre se lit de droite à gauche, comme pour les matrices.

## Cas d'usage

- **Composer des orientations** dans un moteur 3D ou une centrale inertielle, à moindre coût qu'en matrices.
- **Calculer une rotation par conjugaison** $q \vec{v} q^{-1}$, qui n'est qu'une double application de cette formule.
- **Vérifier une implémentation** : retrouver $ij = k$ et $ji = -k$ est le test unitaire minimal d'une bibliothèque de quaternions.

## Avantages et limites

✅ **Avantages** :
- Une formule unique qui encapsule produit scalaire et produit vectoriel
- Moins d'opérations qu'un produit de matrices de rotation ($28$ contre $45$)
- Associatif : les enchaînements ne demandent pas de parenthésage

❌ **Limites** :
- Non commutatif : inverser deux facteurs change le résultat
- L'écriture développée en $a, b, c, d$ est illisible et source d'erreurs de signe
- Les erreurs d'arrondi accumulées font perdre la norme unitaire, qu'il faut renormaliser

## Connexions

### Notes liées
- [[MATH - quaternion (définition et structure)]] - l'écriture $q = a + \vec{v}$ utilisée ici
- [[MATH - produit scalaire]] - fournit la partie réelle du produit
- [[MATH - produit vectoriel]] - fournit la partie imaginaire et la non-commutativité
- [[MATH - rotation par conjugaison de quaternion]] - l'application directe de ce produit
- [[MATH - quaternion vs matrice de rotation (coûts)]] - le décompte d'opérations qui en découle

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#quaternions` `#algebre`
