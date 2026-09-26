---
type: permanent
created: 2026-09-26 10:25
tags:
  - permanent
  - mathematiques
  - geometrie-projective
  - 3d
---

# MATH - matrice de translation homogène

> [!abstract] Concept
> En coordonnées homogènes, translater d'un vecteur $\vec{t}(t_x, t_y, t_z)$ revient à multiplier par l'identité 4×4 dont la dernière colonne porte $t$ — ce qui transforme une addition en produit matriciel.

## Explication

En coordonnées cartésiennes, la translation est le mouton noir des transformations : $x \mapsto x + t$ n'est **pas linéaire** (elle ne fixe pas l'origine), donc aucune matrice 3×3 ne peut la représenter. On est contraint de la traiter à part, par une addition, ce qui casse l'uniformité du calcul. Les coordonnées homogènes résolvent exactement ce problème :

$$T = \begin{pmatrix} 1 & 0 & 0 & t_x \\ 0 & 1 & 0 & t_y \\ 0 & 0 & 1 & t_z \\ 0 & 0 & 0 & 1 \end{pmatrix}$$

Le mécanisme est limpide : la dernière colonne est multipliée par la coordonnée $w$ du point. Pour un point affine écrit avec $w = 1$, chaque ligne ajoute son $t$ à la coordonnée correspondante ; on obtient bien $(x + t_x,\ y + t_y,\ z + t_z,\ 1)$.

La conséquence la plus utile est le traitement automatique des **directions**. Un vecteur, écrit $w = 0$, annule la dernière colonne et sort **inchangé** de la multiplication — ce qui est le comportement correct : translater une scène ne doit pas modifier ses normales ni la direction d'une lumière. La même matrice applique donc la bonne règle aux points et aux vecteurs, sans test ni branchement, selon la seule valeur de $w$.

Règle de lecture générale qui en découle : dans **toute** matrice de transformation affine 4×4, la dernière colonne est la translation, quels que soient les autres coefficients. L'inverse d'une translation est immédiat — c'est la translation de $-t$.

<svg viewBox="0 0 420 215" width="100%" style="max-width:420px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Effet d'une translation sur un point (w=1) et sur une direction (w=0)">
<defs>
<marker id="trA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="trB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker>
<marker id="trC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#27ae60"/></marker>
</defs>
<text x="16" y="26" font-size="12" fill="currentColor">la même matrice T traite correctement les deux natures d'objet, selon la seule valeur de w</text>
<circle cx="70" cy="110" r="4" fill="#4c9aff"/>
<text x="46" y="104" font-size="12" fill="#4c9aff">P (w = 1)</text>
<line x1="74" y1="110" x2="166" y2="86" stroke="#f2994a" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#trB)"/>
<text x="106" y="82" font-size="13" fill="#f2994a" font-style="italic">t</text>
<circle cx="172" cy="84" r="4" fill="#4c9aff"/>
<text x="160" y="72" font-size="12" fill="#4c9aff">P + t</text>
<text x="60" y="150" font-size="11" fill="currentColor" opacity="0.8">point : déplacé</text>
<line x1="250" y1="130" x2="320" y2="104" stroke="#27ae60" stroke-width="2.2" marker-end="url(#trC)"/>
<text x="268" y="148" font-size="13" fill="#27ae60" font-style="italic">v (w = 0)</text>
<line x1="286" y1="88" x2="356" y2="62" stroke="#27ae60" stroke-width="2.2" stroke-dasharray="4 3" marker-end="url(#trC)"/>
<text x="300" y="56" font-size="11" fill="#27ae60" opacity="0.85">même vecteur, où qu'il soit</text>
<text x="246" y="176" font-size="11" fill="currentColor" opacity="0.8">direction : invariante par T</text>
</svg>

## Exemples

### Exemple 1 — application à un point
$$\begin{pmatrix} 1 & 0 & 0 & t_x \\ 0 & 1 & 0 & t_y \\ 0 & 0 & 1 & t_z \\ 0 & 0 & 0 & 1 \end{pmatrix} \begin{pmatrix} x \\ y \\ z \\ 1 \end{pmatrix} = \begin{pmatrix} x + t_x \\ y + t_y \\ z + t_z \\ 1 \end{pmatrix}$$

### Exemple 2 — application à une direction
Le même produit avec $(x, y, z, 0)$ redonne $(x, y, z, 0)$ : la direction est préservée.

## Cas d'usage

- **Positionner un objet** dans la scène sans sortir du formalisme matriciel.
- **Composer avec une rotation** : $T \cdot R$ place un objet tourné à l'endroit voulu en une seule matrice.
- **Recentrer une rotation** : $T(c) \cdot R \cdot T(-c)$ fait tourner un objet autour du point $c$ et non de l'origine.

## Avantages et limites

✅ **Avantages** :
- Rend la translation composable avec les autres transformations
- Distingue gratuitement points et vecteurs via $w$
- Inverse trivial ($-t$), sans calcul

❌ **Limites** :
- Impose de passer en dimension 4, donc 16 coefficients dont 12 sont constants
- Le produit reste non commutatif : $T \cdot R \neq R \cdot T$

## Connexions

### Notes liées
- [[MATH - coordonnées homogènes et plan à l'infini]] - pourquoi la 4ᵉ coordonnée change tout
- [[MATH - matrice de transformation affine 4x4]] - la forme générale dont ceci est un cas particulier
- [[MATH - matrices de rotation autour des axes]] - l'autre brique de base, à combiner avec celle-ci

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#geometrie-projective` `#3d`
