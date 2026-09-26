---
type: permanent
created: 2026-09-26 11:00
tags:
  - permanent
  - mathematiques
  - quaternions
  - algebre
---

# MATH - quaternion (définition et structure)

> [!abstract] Concept
> Un quaternion est un nombre à quatre composantes $q = a + bi + cj + dk$ dont les trois unités imaginaires vérifient $i^{2} = j^{2} = k^{2} = ijk = -1$ ; il se lit aussi comme la somme d'un scalaire et d'un vecteur.

## Explication

L'ensemble des quaternions, noté $\mathbb{H}$ en hommage à Hamilton, se construit sur une unique relation fondatrice :

$$i^{2} = j^{2} = k^{2} = ijk = -1$$

Tout quaternion s'écrit alors de manière **unique** sous la forme $q = a + bi + cj + dk$, où $a$, $b$, $c$, $d$ sont des réels et $i$, $j$, $k$ trois symboles. De la relation fondatrice se déduit toute la table de multiplication des imaginaires purs, qui suit un cycle :

$$ij = k, \qquad jk = i, \qquad ki = j, \qquad \text{mais} \qquad ji = -k$$

C'est le même cycle que celui du produit vectoriel de la base canonique. Les quaternions s'additionnent et se multiplient comme les autres nombres, à une réserve près et elle est de taille : **la multiplication n'est pas commutative**. Il faut donc veiller à ne jamais intervertir les facteurs d'un produit — sauf lorsque l'un d'eux est un réel, qui lui commute avec tout.

On décompose usuellement $q$ en une **partie réelle** $\operatorname{Re}(q) = a$ (dite scalaire) et une **partie imaginaire** $\operatorname{Im}(q) = bi + cj + dk$ (dite vectorielle). En identifiant cette partie imaginaire au vecteur $\vec{v}(b, c, d)$ de l'espace euclidien de dimension $3$, on obtient l'écriture compacte qui rend tous les calculs lisibles :

$$q = a + \vec{v}$$

Cette lecture éclaire les dimensions en jeu : $\mathbb{H}$ est de dimension $4$, sa partie réelle $\mathbb{R}$ de dimension $1$, et $\operatorname{Im} \mathbb{H}$ de dimension $3$ — canoniquement isomorphe à l'espace 3D ordinaire. C'est ce qui permet de faire agir un quaternion sur un vecteur.

<svg viewBox="0 0 420 230" width="100%" style="max-width:420px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cycle de multiplication des imaginaires purs i, j, k">
<defs>
<marker id="qkF" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="qkB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker>
</defs>
<circle cx="200" cy="130" r="68" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 4" opacity="0.35"/>
<circle cx="200" cy="62" r="17" fill="none" stroke="currentColor" stroke-width="1.4"/>
<text x="194" y="68" font-size="15" fill="currentColor" font-style="italic">i</text>
<circle cx="259" cy="164" r="17" fill="none" stroke="currentColor" stroke-width="1.4"/>
<text x="253" y="170" font-size="15" fill="currentColor" font-style="italic">j</text>
<circle cx="141" cy="164" r="17" fill="none" stroke="currentColor" stroke-width="1.4"/>
<text x="135" y="170" font-size="15" fill="currentColor" font-style="italic">k</text>
<path d="M 222 78 A 68 68 0 0 1 252 142" fill="none" stroke="#4c9aff" stroke-width="2" marker-end="url(#qkF)"/>
<path d="M 240 176 A 68 68 0 0 1 162 176" fill="none" stroke="#4c9aff" stroke-width="2" marker-end="url(#qkF)"/>
<path d="M 148 142 A 68 68 0 0 1 178 78" fill="none" stroke="#4c9aff" stroke-width="2" marker-end="url(#qkF)"/>
<text x="286" y="104" font-size="13" fill="#4c9aff">i j = k</text>
<text x="286" y="124" font-size="13" fill="#4c9aff">j k = i</text>
<text x="286" y="144" font-size="13" fill="#4c9aff">k i = j</text>
<text x="34" y="104" font-size="13" fill="#f2994a">j i = −k</text>
<text x="34" y="124" font-size="13" fill="#f2994a">k j = −i</text>
<text x="34" y="144" font-size="13" fill="#f2994a">i k = −j</text>
<text x="16" y="26" font-size="12" fill="currentColor">dans le sens du cycle : produit positif — à contresens : produit opposé</text>
<text x="16" y="216" font-size="11" fill="currentColor" opacity="0.75">c'est exactement le cycle du produit vectoriel de la base canonique</text>
</svg>

## Exemples

### Exemple 1 — cas particuliers
| Quaternion | Forme | Nature |
|---|---|---|
| $q = 5$ | $\vec{v} = \vec{0}$ | un réel |
| $q = 2 + 3i$ | $c = d = 0$ | un complexe |
| $q = 0 + \vec{v}$ | $a = 0$ | un **imaginaire pur**, identifié à un vecteur 3D |
| $q = \cos\theta + \vec{u}\sin\theta$ | $\|q\| = 1$ | un quaternion **unitaire**, une rotation |

### Exemple 2 — la non-commutativité en acte
$$ij = k \qquad \text{et} \qquad ji = -k$$
Inverser l'ordre retourne le résultat — exactement comme composer deux rotations dans l'autre sens change l'orientation finale.

## Cas d'usage

- **Représenter une orientation 3D** en $4$ nombres, sans blocage de cardan.
- **Composer des rotations** par simple multiplication de quaternions.
- **Interpoler entre deux orientations** (slerp), impossible à faire proprement avec des angles d'Euler.

## Avantages et limites

✅ **Avantages** :
- Seulement $4$ composantes pour une orientation complète
- Structure algébrique complète : addition, multiplication, inverse, norme

❌ **Limites** :
- Multiplication non commutative, source d'erreurs d'ordre
- Peu intuitif : aucune composante ne se lit directement comme un angle
- Un quaternion unitaire et son opposé décrivent la même rotation

## Connexions

### Notes liées
- [[MATH - hiérarchie des algèbres R C H O]] - d'où vient $\mathbb{H}$ et ce qu'il coûte
- [[MATH - produit de Hamilton]] - comment se calcule concrètement le produit de deux quaternions
- [[MATH - conjugué, norme et inverse d'un quaternion]] - les opérations dérivées de cette structure
- [[MATH - rotation par conjugaison de quaternion]] - l'usage qui justifie tout le reste
- [[MATH - produit vectoriel]] - le cycle $ij = k$ est celui de $\vec{i} \wedge \vec{j} = \vec{k}$

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#quaternions` `#algebre`
