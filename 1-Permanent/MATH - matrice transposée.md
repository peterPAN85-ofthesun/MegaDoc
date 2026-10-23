---
type: permanent
created: 2026-10-23 10:40
tags:
  - permanent
  - mathematiques
  - algebre-lineaire
---

# MATH - matrice transposée

> [!abstract] Concept
> La transposée $A^{T}$ d'une matrice $A$ s'obtient en échangeant ses lignes et ses colonnes : le coefficient en position $(i, j)$ passe en position $(j, i)$, et une matrice $m \times n$ devient $n \times m$.

## Explication

Pour une matrice $A = (a_{ij})$ de taille $m \times n$, la transposée est la matrice $A^{T}$ de taille $n \times m$ définie par

$$(A^{T})_{ij} = a_{ji}$$

Concrètement, **la $i$-ème ligne de $A$ devient la $i$-ème colonne de $A^{T}$**. Pour une matrice carrée, cela revient à faire une **symétrie par rapport à la diagonale principale** : les coefficients diagonaux $a_{ii}$ restent en place, les autres échangent leur place avec leur « miroir ». On la note aussi ${}^{t}A$ ou $A'$ selon les ouvrages.

Contrairement au déterminant ou à l'inverse, la transposée existe pour **toute** matrice, carrée ou non, et ne demande **aucun calcul** : c'est un simple réarrangement des coefficients. Elle transforme notamment un vecteur colonne en vecteur ligne, ce qui permet d'écrire le produit scalaire comme un produit matriciel : $\vec{u} \cdot \vec{v} = \vec{u}^{T} \vec{v}$.

Propriétés à retenir :
- $(A^{T})^{T} = A$ — transposer deux fois ne change rien ;
- $(A + B)^{T} = A^{T} + B^{T}$ et $(\lambda A)^{T} = \lambda A^{T}$ — la transposition est linéaire ;
- $(AB)^{T} = B^{T} A^{T}$ — **l'ordre s'inverse**, comme pour l'inverse d'un produit ;
- $\det(A^{T}) = \det(A)$ pour une matrice carrée ;
- $(A^{T})^{-1} = (A^{-1})^{T}$ si $A$ est inversible.

La transposée sert aussi à **classer** les matrices carrées : $A$ est **symétrique** si $A^{T} = A$, **antisymétrique** si $A^{T} = -A$ (sa diagonale est alors nulle), et **orthogonale** si $A^{T} = A^{-1}$.

<svg viewBox="0 0 440 190" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Transposition : les lignes deviennent des colonnes">
<defs>
<marker id="trF" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>
</defs>
<text x="16" y="22" font-size="12" fill="currentColor">A (2×3) : chaque ligne devient une colonne de Aᵀ (3×2)</text>
<rect x="30" y="58" width="150" height="30" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff"/>
<rect x="30" y="98" width="150" height="30" fill="#f2994a" fill-opacity="0.15" stroke="#f2994a"/>
<g font-size="15" fill="currentColor" text-anchor="middle">
<text x="55" y="79">1</text><text x="105" y="79">2</text><text x="155" y="79">3</text>
<text x="55" y="119">4</text><text x="105" y="119">5</text><text x="155" y="119">6</text>
</g>
<text x="98" y="155" font-size="13" fill="currentColor" text-anchor="middle">A</text>
<line x1="200" y1="100" x2="250" y2="100" stroke="currentColor" stroke-width="1.6" marker-end="url(#trF)"/>
<rect x="280" y="45" width="40" height="110" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff"/>
<rect x="330" y="45" width="40" height="110" fill="#f2994a" fill-opacity="0.15" stroke="#f2994a"/>
<g font-size="15" fill="currentColor" text-anchor="middle">
<text x="300" y="72">1</text><text x="350" y="72">4</text>
<text x="300" y="107">2</text><text x="350" y="107">5</text>
<text x="300" y="142">3</text><text x="350" y="142">6</text>
</g>
<text x="325" y="178" font-size="13" fill="currentColor" text-anchor="middle">Aᵀ</text>
</svg>

## Exemples

### Exemple 1 — matrice rectangulaire
$$A = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix} \quad \Longrightarrow \quad A^{T} = \begin{pmatrix} 1 & 4 \\ 2 & 5 \\ 3 & 6 \end{pmatrix}$$
Une $2 \times 3$ devient une $3 \times 2$.

### Exemple 2 — matrice carrée (miroir de la diagonale)
$$\begin{pmatrix} 2 & 1 & 3 \\ 0 & -1 & 4 \\ 1 & 2 & 0 \end{pmatrix}^{T} = \begin{pmatrix} 2 & 0 & 1 \\ 1 & -1 & 2 \\ 3 & 4 & 0 \end{pmatrix}$$
La diagonale $(2, -1, 0)$ ne bouge pas.

### Exemple 3 — vecteur et produit scalaire
$$\vec{u} = \begin{pmatrix} 1 \\ 2 \\ 3 \end{pmatrix}, \quad \vec{v} = \begin{pmatrix} 4 \\ 0 \\ -1 \end{pmatrix}, \quad \vec{u}^{T}\vec{v} = \begin{pmatrix} 1 & 2 & 3 \end{pmatrix}\begin{pmatrix} 4 \\ 0 \\ -1 \end{pmatrix} = 4 + 0 - 3 = 1$$

### Exemple 4 — matrices symétrique et antisymétrique
$$S = \begin{pmatrix} 1 & 7 \\ 7 & 3 \end{pmatrix} = S^{T} \qquad K = \begin{pmatrix} 0 & -2 \\ 2 & 0 \end{pmatrix}, \; K^{T} = -K$$

## Cas d'usage

- **Inverser une rotation** sans calcul : pour une matrice orthogonale, $R^{-1} = R^{T}$.
- **Écrire le produit scalaire** sous forme matricielle : $\vec{u}^{T}\vec{v}$, et la norme : $\|\vec{u}\|^{2} = \vec{u}^{T}\vec{u}$.
- **Calcul de l'inverse par la comatrice** : $A^{-1} = \frac{1}{\det(A)} \, \text{com}(A)^{T}$.
- **Programmation** : passer d'un stockage par lignes (*row-major*, C) à un stockage par colonnes (*column-major*, OpenGL, Fortran) revient à transposer.

## Connexions

### Notes liées
- [[MATH - matrice orthogonale (inverse par transposition)]] - le cas où la transposée est l'inverse
- [[MATH - matrice inverse]] - même règle d'inversion de l'ordre pour un produit ; la comatrice transposée donne l'inverse
- [[MATH - calcul du déterminant d'une matrice carrée]] - $\det(A^{T}) = \det(A)$ : ce qui vaut pour les lignes vaut pour les colonnes
- [[MATH - matrice triangulaire (et triangularisation par pivot de Gauss)]] - la transposée d'une triangulaire supérieure est triangulaire inférieure
- [[MATH - produit scalaire]] - s'écrit $\vec{u}^{T}\vec{v}$

### Dans le contexte de
- [[MOC - Mathématiques]] - branche algèbre linéaire

## Ressources

- Source : notions de cours d'algèbre linéaire (note rédigée sur demande, 2026-10-23)

---

**Tags thématiques** : `#mathematiques` `#algebre-lineaire`
