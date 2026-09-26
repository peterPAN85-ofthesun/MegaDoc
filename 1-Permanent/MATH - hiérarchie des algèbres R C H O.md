---
type: permanent
created: 2026-09-26 11:05
tags:
  - permanent
  - mathematiques
  - algebre
  - quaternions
---

# MATH - hiérarchie des algèbres R C H O

> [!abstract] Concept
> $\mathbb{R} \subset \mathbb{C} \subset \mathbb{H} \subset \mathbb{O}$ : chaque étage double le nombre de dimensions ($1 \to 2 \to 4 \to 8$) et gagne en richesse, mais perd à chaque fois une propriété — l'ordre, puis la commutativité, puis l'associativité.

## Explication

**L'emboîtement.** Chaque ensemble est entièrement contenu dans le suivant. Un réel *est* un cas particulier de complexe (partie imaginaire nulle), et un complexe *est* un cas particulier de quaternion (deux de ses trois parties imaginaires sont nulles). Concrètement, si $q = a + bi + cj + dk$ a $c = d = 0$, on retombe sur le complexe $a + bi$ ; si de plus $b = 0$, sur le réel $a$.

**Le doublement des dimensions.** C'est la logique de la construction, dite de Cayley-Dickson : $1 \to 2 \to 4 \to 8$. Un réel demande $1$ nombre, un complexe $2$, un quaternion $4$, un octonion $8$. Chaque étage se bâtit en « collant » deux copies du précédent — un quaternion est en gros une paire de complexes. On ne peut **pas** s'arrêter à la dimension $3$ : il n'existe pas d'algèbre de division de dimension $3$, et c'est précisément la raison historique pour laquelle Hamilton, cherchant à faire tourner l'espace avec des triplets, a dû passer à la dimension $4$.

**Le prix à payer.** À chaque montée, on perd une propriété qu'on tenait pour acquise :
- de $\mathbb{R}$ à $\mathbb{C}$ : on perd l'**ordre**. On ne peut plus dire qu'un complexe est « plus grand » qu'un autre.
- de $\mathbb{C}$ à $\mathbb{H}$ : on perd la **commutativité**. $ij = k$ mais $ji = -k$. L'ordre de multiplication compte — et c'est justement ce qui permet aux quaternions de représenter des rotations, dont la composition dépend elle aussi de l'ordre.
- de $\mathbb{H}$ à $\mathbb{O}$ : on perd l'**associativité**. $(ab)c \neq a(bc)$ en général.

Cette perte n'est pas un accident mais un théorème (Hurwitz, Frobenius) : ce sont les seules algèbres de division normées sur $\mathbb{R}$. La « limite » atteinte à $\mathbb{H}$ est donc la dernière où l'on peut encore calculer confortablement — ce qui explique que les quaternions, et pas les octonions, soient l'outil des rotations 3D.

<svg viewBox="0 0 430 250" width="100%" style="max-width:430px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Emboîtement des algèbres R, C, H, O et propriétés perdues">
<rect x="20" y="40" width="300" height="190" rx="10" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.9"/>
<text x="30" y="60" font-size="15" fill="currentColor">𝕆  ·  dim 8</text>
<text x="30" y="76" font-size="10" fill="#f2994a">perd l'associativité</text>
<rect x="48" y="86" width="244" height="130" rx="9" fill="#4c9aff" fill-opacity="0.06" stroke="currentColor" stroke-width="1.4"/>
<text x="58" y="106" font-size="15" fill="currentColor">ℍ  ·  dim 4</text>
<text x="58" y="122" font-size="10" fill="#f2994a">perd la commutativité</text>
<rect x="76" y="132" width="188" height="70" rx="8" fill="#4c9aff" fill-opacity="0.10" stroke="currentColor" stroke-width="1.4"/>
<text x="86" y="152" font-size="15" fill="currentColor">ℂ  ·  dim 2</text>
<text x="86" y="168" font-size="10" fill="#f2994a">perd l'ordre</text>
<rect x="104" y="174" width="132" height="22" rx="6" fill="#4c9aff" fill-opacity="0.16" stroke="currentColor" stroke-width="1.4"/>
<text x="114" y="190" font-size="13" fill="currentColor">ℝ  ·  dim 1</text>
<text x="334" y="60" font-size="11" fill="currentColor" opacity="0.85">1 → 2 → 4 → 8</text>
<text x="334" y="80" font-size="10" fill="currentColor" opacity="0.75">chaque étage</text>
<text x="334" y="94" font-size="10" fill="currentColor" opacity="0.75">colle deux copies</text>
<text x="334" y="108" font-size="10" fill="currentColor" opacity="0.75">du précédent</text>
<text x="334" y="140" font-size="10" fill="#f2994a">pas d'algèbre</text>
<text x="334" y="154" font-size="10" fill="#f2994a">de division</text>
<text x="334" y="168" font-size="10" fill="#f2994a">en dim 3</text>
<text x="16" y="26" font-size="12" fill="currentColor">ℝ ⊂ ℂ ⊂ ℍ ⊂ 𝕆 : on gagne des dimensions, on perd une propriété à chaque étage</text>
</svg>

## Exemples

### Exemple 1 — le tableau des pertes
| Ensemble | Dimension | Ordre | Commutativité | Associativité |
|---|---|---|---|---|
| $\mathbb{R}$ | $1$ | ✅ | ✅ | ✅ |
| $\mathbb{C}$ | $2$ | ❌ | ✅ | ✅ |
| $\mathbb{H}$ | $4$ | ❌ | ❌ | ✅ |
| $\mathbb{O}$ | $8$ | ❌ | ❌ | ❌ |

### Exemple 2 — la perte utile
La non-commutativité de $\mathbb{H}$ n'est pas un défaut à contourner : composer une rotation autour de $\vec{i}$ puis une autour de $\vec{k}$ ne donne pas le même résultat que l'inverse. Une algèbre commutative serait **incapable** de modéliser les rotations 3D.

## Cas d'usage

- **Comprendre pourquoi les quaternions ont 4 composantes** alors qu'une rotation 3D n'a que 3 degrés de liberté.
- **Choisir le bon outil** : complexes pour les rotations planes, quaternions pour les rotations spatiales.
- **Situer un calcul** : savoir d'avance quelles simplifications sont interdites dans l'ensemble où l'on travaille.

## Connexions

### Notes liées
- [[MATH - quaternion (définition et structure)]] - l'étage $\mathbb{H}$ détaillé
- [[MATH - produit de Hamilton]] - la multiplication non commutative en pratique
- [[MATH - rotation par conjugaison de quaternion]] - ce que la perte de commutativité rend possible
- [[MATH - produit vectoriel]] - lui aussi anticommutatif et non associatif, pour la même raison structurelle

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#algebre` `#quaternions`
