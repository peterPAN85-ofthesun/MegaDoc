---
type: permanent
created: 2026-10-23 10:14
tags:
  - permanent
  - mathematiques
  - algebre-lineaire
---

# MATH - calcul du déterminant d'une matrice carrée

> [!abstract] Concept
> Le déterminant $\det(A)$ d'une matrice **carrée** mesure le facteur par lequel $A$ multiplie les aires ou les volumes ; il se calcule par $ad - bc$ en $2 \times 2$, par la règle de Sarrus en $3 \times 3$, et par développement en cofacteurs ou pivot de Gauss en $n \times n$.

## Explication

### Ce que mesure le déterminant

Le déterminant n'existe que pour une matrice **carrée** $n \times n$. On le note $\det(A)$ ou $|A|$. Les colonnes de $A$ sont les images des vecteurs de base : elles forment un parallélogramme (2D) ou un parallélépipède (3D). $|\det(A)|$ est l'aire ou le volume de cette figure, donc le **facteur d'échelle** que $A$ applique à toute surface ou tout volume. Le **signe** donne l'orientation : positif si $A$ conserve le sens de la base, négatif si elle le retourne (réflexion).

Si $\det(A) = 0$, la figure est aplatie : les colonnes sont **linéairement dépendantes**, l'espace est écrasé sur un sous-espace plus petit et l'information perdue ne se récupère pas. D'où le critère central :

$$A \text{ inversible} \iff \det(A) \neq 0$$

<svg viewBox="0 0 440 230" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Le déterminant comme aire du parallélogramme formé par les colonnes">
<defs>
<marker id="detF" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>
<marker id="detB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="detO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker>
</defs>
<text x="16" y="22" font-size="12" fill="currentColor">carré unité (aire 1)  →  parallélogramme des colonnes (aire |det A|)</text>
<rect x="40" y="130" width="50" height="50" fill="#27ae60" fill-opacity="0.18" stroke="#27ae60"/>
<line x1="40" y1="180" x2="92" y2="180" stroke="currentColor" stroke-width="1.6" marker-end="url(#detF)"/>
<line x1="40" y1="180" x2="40" y2="128" stroke="currentColor" stroke-width="1.6" marker-end="url(#detF)"/>
<text x="94" y="196" font-size="11" fill="currentColor">e₁</text>
<text x="22" y="132" font-size="11" fill="currentColor">e₂</text>
<text x="105" y="150" font-size="14" fill="currentColor">A</text>
<line x1="100" y1="158" x2="135" y2="158" stroke="currentColor" stroke-width="1.4" marker-end="url(#detF)"/>
<polygon points="170,190 320,165 360,65 210,90" fill="#27ae60" fill-opacity="0.18" stroke="#27ae60"/>
<line x1="170" y1="190" x2="318" y2="165" stroke="#4c9aff" stroke-width="2" marker-end="url(#detB)"/>
<line x1="170" y1="190" x2="209" y2="92" stroke="#f2994a" stroke-width="2" marker-end="url(#detO)"/>
<text x="262" y="196" font-size="12" fill="#4c9aff">1ʳᵉ colonne (a, c)</text>
<text x="120" y="96" font-size="12" fill="#f2994a">2ᵉ colonne (b, d)</text>
<text x="238" y="132" font-size="13" fill="currentColor">aire = |ad − bc|</text>
</svg>

### Propriétés utiles au calcul

- $\det(AB) = \det(A)\,\det(B)$ et $\det(A^{T}) = \det(A)$ (ce qui vaut pour les lignes vaut pour les colonnes) ;
- $\det(\lambda A) = \lambda^{n} \det(A)$ pour une matrice $n \times n$ ;
- le déterminant d'une matrice **triangulaire** est le **produit de sa diagonale** ;
- **échanger deux lignes** change le signe ; **multiplier une ligne** par $\lambda$ multiplie $\det$ par $\lambda$ ; **ajouter à une ligne un multiple d'une autre** ne change rien ;
- deux lignes égales ou proportionnelles, ou une ligne nulle $\Rightarrow \det = 0$.

> [!info]- Démonstration — ajouter à une ligne un multiple d'une autre ne change pas le déterminant
> **Énoncé.** Si $A'$ s'obtient à partir de $A$ par $L_i \leftarrow L_i + \lambda L_j$ (avec $i \neq j$), alors $\det(A') = \det(A)$.
>
> **Vérification directe en $2 \times 2$.** Avec $L_2 \leftarrow L_2 + \lambda L_1$ :
> $$\begin{vmatrix} a & b \\ c + \lambda a & d + \lambda b \end{vmatrix} = a(d + \lambda b) - b(c + \lambda a) = ad - bc + \underbrace{\lambda ab - \lambda ab}_{= 0} = ad - bc$$
>
> **Cas général $n \times n$.** La preuve repose sur deux faits.
>
> *Fait 1 — le déterminant est linéaire par rapport à chaque ligne.* Développons selon la ligne $i$ (développement de Laplace) : $\det(A) = \sum_{k} a_{ik} C_{ik}$. Les cofacteurs $C_{ik}$ se calculent en **supprimant** la ligne $i$ : ils ne dépendent pas de ses coefficients. $\det$ est donc une combinaison linéaire des coefficients de la ligne $i$, ce qui donne, en notant les lignes de la matrice entre crochets :
> $$\det[\dots,\ \underbrace{U + \lambda V}_{\text{ligne } i},\ \dots] = \det[\dots,\ U,\ \dots] + \lambda \det[\dots,\ V,\ \dots]$$
>
> *Fait 2 — une matrice ayant deux lignes égales a un déterminant nul.* Échanger ces deux lignes change le signe du déterminant. Mais comme elles sont identiques, l'échange ne modifie pas la matrice. On a donc $\det = -\det$, soit $\det = 0$.
>
> *Conclusion.* On applique le fait 1 à la ligne $i$, qui vaut $L_i + \lambda L_j$ :
> $$\det(A') = \det[\dots,\ L_i + \lambda L_j,\ \dots,\ L_j,\ \dots] = \underbrace{\det[\dots,\ L_i,\ \dots,\ L_j,\ \dots]}_{= \det(A)} + \lambda \underbrace{\det[\dots,\ L_j,\ \dots,\ L_j,\ \dots]}_{= 0 \text{ (fait 2)}}$$
> Le second déterminant possède deux fois la ligne $L_j$ (en position $i$ et en position $j$), il est donc nul. D'où $\det(A') = \det(A)$. $\blacksquare$
>
> **Lecture géométrique.** En 2D, $L_2 \leftarrow L_2 + \lambda L_1$ fait **glisser** le parallélogramme parallèlement à l'un de ses côtés (un cisaillement). La base et la hauteur ne changent pas, l'aire non plus.

### Cas $2 \times 2$ : produit en croix

$$\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$$

Diagonale principale moins antidiagonale.

### Cas $3 \times 3$ : règle de Sarrus

On recopie les **deux premières colonnes à droite** de la matrice, puis on additionne les produits des trois diagonales descendantes et on soustrait ceux des trois diagonales montantes :

$$\begin{vmatrix} a & b & c \\ d & e & f \\ g & h & i \end{vmatrix} = (aei + bfg + cdh) - (ceg + afh + bdi)$$

<svg viewBox="0 0 440 200" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Règle de Sarrus : trois diagonales positives, trois négatives">
<text x="16" y="22" font-size="12" fill="currentColor">on recopie les colonnes 1 et 2 à droite, puis on suit les diagonales</text>
<g font-size="16" fill="currentColor" text-anchor="middle">
<text x="80" y="70">a</text><text x="130" y="70">b</text><text x="180" y="70">c</text><text x="230" y="70" opacity="0.5">a</text><text x="280" y="70" opacity="0.5">b</text>
<text x="80" y="115">d</text><text x="130" y="115">e</text><text x="180" y="115">f</text><text x="230" y="115" opacity="0.5">d</text><text x="280" y="115" opacity="0.5">e</text>
<text x="80" y="160">g</text><text x="130" y="160">h</text><text x="180" y="160">i</text><text x="230" y="160" opacity="0.5">g</text><text x="280" y="160" opacity="0.5">h</text>
</g>
<line x1="205" y1="45" x2="205" y2="172" stroke="currentColor" stroke-dasharray="4 4" opacity="0.5"/>
<g stroke="#4c9aff" stroke-width="1.6" opacity="0.85">
<line x1="68" y1="56" x2="194" y2="170"/>
<line x1="118" y1="56" x2="244" y2="170"/>
<line x1="168" y1="56" x2="294" y2="170"/>
</g>
<g stroke="#f2994a" stroke-width="1.6" opacity="0.85">
<line x1="68" y1="170" x2="194" y2="56"/>
<line x1="118" y1="170" x2="244" y2="56"/>
<line x1="168" y1="170" x2="294" y2="56"/>
</g>
<text x="310" y="80" font-size="12" fill="#4c9aff">↘ + aei + bfg + cdh</text>
<text x="310" y="150" font-size="12" fill="#f2994a">↗ − ceg − afh − bdi</text>
</svg>

> [!warning] Sarrus ne marche **qu'en** $3 \times 3$
> Un déterminant $4 \times 4$ compte $4! = 24$ termes ; « recopier trois colonnes » n'en donnerait que $8$. Au-delà de $3 \times 3$, il faut l'une des deux méthodes suivantes.

### Cas $n \times n$ : développement de Laplace (cofacteurs)

Le **mineur** $M_{ij}$ est le déterminant de la sous-matrice obtenue en **supprimant la ligne $i$ et la colonne $j$**. Le **cofacteur** est $C_{ij} = (-1)^{i+j} M_{ij}$ ; les signes $(-1)^{i+j}$ forment un **damier** qui commence par $+$ en haut à gauche. Le développement selon une ligne $i$ s'écrit :

$$\det(A) = \sum_{j=1}^{n} (-1)^{i+j} \, a_{ij} \, M_{ij}$$

(formule symétrique selon une colonne). **Toutes les lignes et colonnes donnent le même résultat** : on choisit celle qui a le plus de zéros, chaque $a_{ij} = 0$ supprimant un sous-déterminant entier. La méthode est récursive et redescend jusqu'aux cas $3 \times 3$ ou $2 \times 2$. Son coût est en $O(n!)$ ($10! \approx 3{,}6$ millions de produits pour une $10 \times 10$) : idéale à la main sur une petite matrice creuse, inutilisable numériquement sur une grande.

<svg viewBox="0 0 440 210" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Damier des signes et mineur obtenu en rayant une ligne et une colonne">
<text x="16" y="22" font-size="12" fill="currentColor">damier des signes (−1)^(i+j)</text>
<g font-size="15" text-anchor="middle">
<text x="40" y="60" fill="#27ae60">+</text><text x="75" y="60" fill="#f2994a">−</text><text x="110" y="60" fill="#27ae60">+</text><text x="145" y="60" fill="#f2994a">−</text>
<text x="40" y="95" fill="#f2994a">−</text><text x="75" y="95" fill="#27ae60">+</text><text x="110" y="95" fill="#f2994a">−</text><text x="145" y="95" fill="#27ae60">+</text>
<text x="40" y="130" fill="#27ae60">+</text><text x="75" y="130" fill="#f2994a">−</text><text x="110" y="130" fill="#27ae60">+</text><text x="145" y="130" fill="#f2994a">−</text>
<text x="40" y="165" fill="#f2994a">−</text><text x="75" y="165" fill="#27ae60">+</text><text x="110" y="165" fill="#f2994a">−</text><text x="145" y="165" fill="#27ae60">+</text>
</g>
<text x="230" y="22" font-size="12" fill="currentColor">mineur M₂₃ : on raye ligne 2, colonne 3</text>
<g font-size="14" fill="currentColor" text-anchor="middle">
<text x="250" y="60">a₁₁</text><text x="290" y="60">a₁₂</text><text x="330" y="60" opacity="0.35">a₁₃</text><text x="370" y="60">a₁₄</text>
<text x="250" y="95" opacity="0.35">a₂₁</text><text x="290" y="95" opacity="0.35">a₂₂</text><text x="330" y="95" opacity="0.35">a₂₃</text><text x="370" y="95" opacity="0.35">a₂₄</text>
<text x="250" y="130">a₃₁</text><text x="290" y="130">a₃₂</text><text x="330" y="130" opacity="0.35">a₃₃</text><text x="370" y="130">a₃₄</text>
<text x="250" y="165">a₄₁</text><text x="290" y="165">a₄₂</text><text x="330" y="165" opacity="0.35">a₄₃</text><text x="370" y="165">a₄₄</text>
</g>
<line x1="228" y1="90" x2="392" y2="90" stroke="#4c9aff" stroke-width="2"/>
<line x1="330" y1="40" x2="330" y2="178" stroke="#4c9aff" stroke-width="2"/>
<text x="230" y="200" font-size="12" fill="#4c9aff">reste une 3×3 → M₂₃ ; signe de la case (2,3) : −</text>
</svg>

### Cas $n \times n$ : pivot de Gauss (triangularisation)

On applique des opérations élémentaires sur les lignes pour rendre la matrice **triangulaire supérieure**, puis on multiplie les coefficients de la diagonale. Il suffit de tenir le compte des effets de chaque opération (voir propriétés) : $L_i \leftarrow L_i + \lambda L_j$ est neutre, chaque **échange de lignes** multiplie par $-1$. Le coût est en $O(n^{3})$ : c'est la méthode employée par les bibliothèques numériques (via la décomposition $LU$). Si un pivot nul ne peut pas être remplacé par échange, une colonne entière est nulle sous la diagonale et $\det(A) = 0$.

### Quelle méthode choisir

| Taille / situation | Méthode | Coût |
|---|---|---|
| $2 \times 2$ | $ad - bc$ | 2 produits |
| $3 \times 3$ | Sarrus (ou Laplace) | 12 produits |
| petite matrice avec beaucoup de zéros | Laplace sur la ligne/colonne la plus creuse | $O(n!)$ dans le pire cas |
| grande matrice, calcul par programme | pivot de Gauss | $O(n^{3})$ |
| matrice triangulaire ou diagonale | produit de la diagonale | $n$ produits |

## Exemples

### Exemple 1 — $2 \times 2$
$$\begin{vmatrix} 3 & 1 \\ 2 & 4 \end{vmatrix} = 3 \cdot 4 - 1 \cdot 2 = 10 \qquad \begin{vmatrix} 1 & 2 \\ 2 & 4 \end{vmatrix} = 4 - 4 = 0$$
La première multiplie les aires par $10$ ; la seconde (colonnes proportionnelles) écrase le plan sur une droite et n'est pas inversible.

### Exemple 2 — $3 \times 3$ par Sarrus
$$A = \begin{pmatrix} 2 & 1 & 3 \\ 0 & -1 & 4 \\ 1 & 2 & 0 \end{pmatrix}$$
- Descendantes : $2 \cdot (-1) \cdot 0 + 1 \cdot 4 \cdot 1 + 3 \cdot 0 \cdot 2 = 4$
- Montantes : $3 \cdot (-1) \cdot 1 + 2 \cdot 4 \cdot 2 + 1 \cdot 0 \cdot 0 = 13$

$$\det(A) = 4 - 13 = -9$$

### Exemple 3 — la même matrice par Laplace (1ʳᵉ ligne)
$$\det(A) = 2\begin{vmatrix} -1 & 4 \\ 2 & 0 \end{vmatrix} - 1\begin{vmatrix} 0 & 4 \\ 1 & 0 \end{vmatrix} + 3\begin{vmatrix} 0 & -1 \\ 1 & 2 \end{vmatrix} = 2(-8) - 1(-4) + 3(1) = -9$$

### Exemple 4 — la même matrice par pivot de Gauss
On échange $L_1$ et $L_3$ pour avoir un pivot égal à $1$ (le signe change) :
$$\begin{vmatrix} 2 & 1 & 3 \\ 0 & -1 & 4 \\ 1 & 2 & 0 \end{vmatrix} = -\begin{vmatrix} 1 & 2 & 0 \\ 0 & -1 & 4 \\ 2 & 1 & 3 \end{vmatrix} \overset{L_3 - 2L_1}{=} -\begin{vmatrix} 1 & 2 & 0 \\ 0 & -1 & 4 \\ 0 & -3 & 3 \end{vmatrix} \overset{L_3 - 3L_2}{=} -\begin{vmatrix} 1 & 2 & 0 \\ 0 & -1 & 4 \\ 0 & 0 & -9 \end{vmatrix}$$
$$\det(A) = -\big(1 \cdot (-1) \cdot (-9)\big) = -9$$

Les trois méthodes concordent. Le signe négatif indique que $A$ retourne l'orientation de l'espace.

### Exemple 5 — $4 \times 4$ creuse par Laplace
$$B = \begin{pmatrix} 1 & 0 & 2 & -1 \\ 3 & 0 & 0 & 5 \\ 2 & 1 & 4 & -3 \\ 1 & 0 & 5 & 0 \end{pmatrix}$$
La 2ᵉ colonne n'a qu'un coefficient non nul, $b_{32} = 1$, de signe $(-1)^{3+2} = -1$ :
$$\det(B) = -1 \cdot \begin{vmatrix} 1 & 2 & -1 \\ 3 & 0 & 5 \\ 1 & 5 & 0 \end{vmatrix} = -1 \cdot \big(1(0 - 25) - 2(0 - 5) + (-1)(15 - 0)\big) = -1 \cdot (-30) = 30$$

### Exemple 6 — matrice triangulaire
$$\begin{vmatrix} 2 & 7 & -3 \\ 0 & 5 & 1 \\ 0 & 0 & 4 \end{vmatrix} = 2 \cdot 5 \cdot 4 = 40$$

## Cas d'usage

- **Tester l'inversibilité** d'une matrice avant de l'inverser ou de résoudre un système $AX = B$.
- **Détecter une dépendance linéaire** : colinéarité en 2D, coplanarité de trois vecteurs en 3D.
- **Mesurer une déformation** : facteur d'aire ou de volume d'une transformation, jacobien d'un changement de variables.
- **Détecter un retournement** (signe négatif) : face 3D vue de dos, repère devenu indirect.

## Connexions

### Notes liées
- [[MATH - matrice inverse]] - n'existe que si $\det(A) \neq 0$ ; les cofacteurs forment la comatrice qui sert à la calculer
- [[MATH - matrice triangulaire (et triangularisation par pivot de Gauss)]] - la forme visée par le pivot de Gauss, avec l'algorithme détaillé
- [[MATH - matrice transposée]] - $\det(A^{T}) = \det(A)$, d'où la symétrie lignes / colonnes
- [[MATH - produit vectoriel]] - se calcule comme un déterminant $3 \times 3$ formel ; le produit mixte est un déterminant $3 \times 3$
- [[MATH - matrice orthogonale (inverse par transposition)]] - déterminant toujours égal à $\pm 1$
- [[MATH - projection (application linéaire idempotente)]] - exemple type de déterminant nul : l'espace est écrasé
- [[MATH - matrices de rotation autour des axes]] - déterminant $1$ : ni changement de volume ni retournement
- [[MATH - matrice de transformation affine 4x4]] - sa dernière ligne $(0\ 0\ 0\ 1)$ ramène le déterminant à celui du bloc $3 \times 3$

### Dans le contexte de
- [[MOC - Mathématiques]] - branche algèbre linéaire

## Ressources

- Source : notions de cours d'algèbre linéaire (note rédigée sur demande, 2026-10-23)

---

**Tags thématiques** : `#mathematiques` `#algebre-lineaire`
