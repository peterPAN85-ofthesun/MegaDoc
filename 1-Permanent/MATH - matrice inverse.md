---
type: permanent
created: 2026-10-23 10:14
tags:
  - permanent
  - mathematiques
  - algebre-lineaire
---

# MATH - matrice inverse

> [!abstract] Concept
> L'inverse d'une matrice carrée $A$ est l'unique matrice $A^{-1}$ telle que $A A^{-1} = A^{-1} A = I_{n}$ : elle annule l'effet de $A$, et elle n'existe que si $\det(A) \neq 0$.

## Explication

Une matrice carrée $A$ de taille $n \times n$ est dite **inversible** s'il existe une matrice $B$ de même taille telle que

$$A B = B A = I_{n}$$

où $I_{n}$ est la matrice identité (des $1$ sur la diagonale, des $0$ ailleurs). Cette matrice $B$, quand elle existe, est **unique** ; on la note $A^{-1}$. C'est l'analogue matriciel de l'inverse d'un nombre ($x \cdot \frac{1}{x} = 1$), à ceci près que le produit matriciel n'est pas commutatif — d'où l'exigence des deux égalités (en dimension finie, l'une entraîne d'ailleurs l'autre).

Géométriquement, si $A$ transforme un vecteur $\vec{x}$ en $\vec{y} = A\vec{x}$, alors $A^{-1}$ ramène $\vec{y}$ sur $\vec{x}$ : c'est la **transformation réciproque**. Elle n'existe que si $A$ ne perd aucune information, c'est-à-dire si elle n'écrase pas l'espace sur un sous-espace plus petit. Cela donne plusieurs critères équivalents :

$$A \text{ inversible} \iff \det(A) \neq 0 \iff \text{colonnes linéairement indépendantes} \iff A\vec{x} = \vec{0} \Rightarrow \vec{x} = \vec{0}$$

Une matrice non inversible est dite **singulière**. Seules les matrices **carrées** peuvent être inversibles au sens strict.

Propriétés à retenir :
- $(A^{-1})^{-1} = A$ ;
- $(AB)^{-1} = B^{-1} A^{-1}$ — **l'ordre s'inverse**, comme quand on retire ses chaussettes après ses chaussures ;
- $(A^{T})^{-1} = (A^{-1})^{T}$ ;
- $\det(A^{-1}) = \dfrac{1}{\det(A)}$ ;
- si $A$ est inversible, le système $A X = B$ a une solution unique $X = A^{-1} B$.

**Comment la calculer.** En $2 \times 2$, la formule est immédiate : on échange les termes diagonaux, on change le signe des deux autres, on divise par le déterminant.

$$\begin{pmatrix} a & b \\ c & d \end{pmatrix}^{-1} = \frac{1}{ad - bc} \begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$$

En général, $A^{-1} = \dfrac{1}{\det(A)} \, \text{com}(A)^{T}$, où la **comatrice** $\text{com}(A)$ contient les cofacteurs $C_{ij} = (-1)^{i+j} M_{ij}$ (voir [[MATH - calcul du déterminant d'une matrice carrée]]). En pratique, pour $n \geq 3$, on utilise plutôt la **méthode de Gauss-Jordan** : on écrit $(A \mid I_{n})$ et on effectue des opérations sur les lignes jusqu'à obtenir $(I_{n} \mid A^{-1})$.

<svg viewBox="0 0 440 170" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A envoie x sur y, A inverse ramène y sur x">
<defs>
<marker id="invB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="invO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker>
</defs>
<text x="16" y="22" font-size="12" fill="currentColor">A puis A⁻¹ (ou l'inverse) : on revient au point de départ, A⁻¹A = AA⁻¹ = Iₙ</text>
<ellipse cx="95" cy="95" rx="65" ry="45" fill="#27ae60" fill-opacity="0.12" stroke="#27ae60"/>
<ellipse cx="345" cy="95" rx="65" ry="45" fill="#27ae60" fill-opacity="0.12" stroke="#27ae60"/>
<circle cx="110" cy="95" r="4" fill="currentColor"/>
<circle cx="330" cy="95" r="4" fill="currentColor"/>
<text x="118" y="100" font-size="13" fill="currentColor">x</text>
<text x="300" y="100" font-size="13" fill="currentColor">y</text>
<path d="M 116 82 Q 220 30 324 82" fill="none" stroke="#4c9aff" stroke-width="2" marker-end="url(#invB)"/>
<path d="M 324 108 Q 220 160 116 108" fill="none" stroke="#f2994a" stroke-width="2" marker-end="url(#invO)"/>
<text x="190" y="48" font-size="13" fill="#4c9aff">y = A x</text>
<text x="186" y="152" font-size="13" fill="#f2994a">x = A⁻¹ y</text>
</svg>

## Exemples

### Exemple 1 — inverse d'une $2 \times 2$
$$A = \begin{pmatrix} 3 & 1 \\ 2 & 4 \end{pmatrix}, \quad \det(A) = 10, \quad A^{-1} = \frac{1}{10}\begin{pmatrix} 4 & -1 \\ -2 & 3 \end{pmatrix}$$
Vérification : $\begin{pmatrix} 3 & 1 \\ 2 & 4 \end{pmatrix}\begin{pmatrix} 4 & -1 \\ -2 & 3 \end{pmatrix} = \begin{pmatrix} 10 & 0 \\ 0 & 10 \end{pmatrix} = 10\, I_{2}$, donc $A A^{-1} = I_{2}$.

### Exemple 2 — matrice singulière
$$\begin{pmatrix} 1 & 2 \\ 2 & 4 \end{pmatrix}$$
Son déterminant est nul : la formule exigerait une division par $0$. Géométriquement, la matrice écrase le plan sur la droite $y = 2x$ ; une infinité de points ont la même image, impossible de « revenir en arrière ».

### Exemple 3 — inverse d'une $3 \times 3$ par la comatrice
$$A = \begin{pmatrix} 2 & 1 & 3 \\ 0 & -1 & 4 \\ 1 & 2 & 0 \end{pmatrix}, \quad \det(A) = -9, \quad A^{-1} = \frac{1}{9}\begin{pmatrix} 8 & -6 & -7 \\ -4 & 3 & 8 \\ -1 & 3 & 2 \end{pmatrix}$$

### Exemple 4 — cas où l'inverse est gratuit
- Matrice diagonale : on inverse chaque coefficient, $\text{diag}(2, 5)^{-1} = \text{diag}(\tfrac{1}{2}, \tfrac{1}{5})$.
- Matrice orthogonale (rotation) : $A^{-1} = A^{T}$.

## Cas d'usage

- **Résoudre un système linéaire** $A X = B$ (en théorie $X = A^{-1}B$ ; en pratique on résout directement par Gauss, plus stable et moins coûteux).
- **Défaire une transformation** : revenir du repère caméra au repère monde, annuler une rotation ou une mise à l'échelle en 3D.
- **Changer de base** : la matrice de passage inverse convertit les coordonnées dans l'autre sens.

## Avantages et limites

✅ **Avantages** :
- Donne directement la transformation réciproque, réutilisable pour de nombreux vecteurs
- Formule fermée simple en $2 \times 2$

❌ **Limites** :
- N'existe pas si $\det(A) = 0$ ; numériquement mal conditionnée si $\det(A)$ est proche de $0$
- Calcul coûteux ($O(n^{3})$) et sensible aux erreurs d'arrondi : on évite de la calculer explicitement quand on veut seulement résoudre un système

## Connexions

### Notes liées
- [[MATH - calcul du déterminant d'une matrice carrée]] - le critère d'existence et les cofacteurs de la comatrice
- [[MATH - matrice transposée]] - $(A^{T})^{-1} = (A^{-1})^{T}$, et la comatrice se transpose
- [[MATH - matrice orthogonale (inverse par transposition)]] - le cas particulier où $A^{-1} = A^{T}$
- [[MATH - matrice de transformation affine 4x4]] - son inverse se calcule par blocs : $R^{-1}$ et $-R^{-1}\vec{t}$
- [[MATH - projection (application linéaire idempotente)]] - exemple d'application non inversible (hors identité)
- [[MATH - conjugué, norme et inverse d'un quaternion]] - la même idée d'inverse transposée aux quaternions

### Dans le contexte de
- [[MOC - Mathématiques]] - branche algèbre linéaire

## Ressources

- Source : notions de cours d'algèbre linéaire (note rédigée sur demande, 2026-10-23)

---

**Tags thématiques** : `#mathematiques` `#algebre-lineaire`
