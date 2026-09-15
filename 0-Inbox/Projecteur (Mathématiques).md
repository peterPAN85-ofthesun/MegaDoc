
Un projection :
- décomposition d'un espace vecctoriel *E* comme somme de deux sous-espaces supplémentaires
- une application linéaire idempotente : elle vérifie *p ° p = p*

>[!Definition]
>Def : *Idempotente*
>Une opération idempotente est une opération qui donne toujours le même résultat que l'on applique une ou plusieurs fois.
>ex : la valeur absolue est une opération idempotente car ||A|| = |A|

# I - Basique

![{\displaystyle {\begin{matrix}p:&E=F\oplus G&\rightarrow E\\&x=x'+x''&\mapsto x'.\end{matrix}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/c680eada40f69b423b6303e4d1858e05255fd76b)

**Ligne 1 : `p : E = F ⊕ G → E`**

- `p` est le nom de l'application (la projection).
- `E = F ⊕ G` signifie que l'espace vectoriel E est la **somme directe** de deux sous-espaces F et G. Autrement dit, tout vecteur de E s'écrit de façon **unique** comme la somme d'un vecteur de F et d'un vecteur de G.
- `→ E` : l'application part de E et arrive dans E (c'est un endomorphisme).

**Ligne 2 : `x = x' + x'' ↦ x'`**

- On prend un vecteur quelconque `x` de E.
- Grâce à la somme directe, on peut l'écrire `x = x' + x''` avec `x' ∈ F` et `x'' ∈ G`, et cette écriture est unique.
- La flèche `↦` (« est envoyé sur ») décrit ce que fait `p` sur ce vecteur : elle **garde la composante x' dans F** et jette la composante x'' dans G.

![[Pasted image 20260915110405.png]]

>[!Note]
>- La somme directe `E = F ⊕ G` pour E avec 3 dimensions nécessite que la somme des dimensions de F et G fasse 3 dimensions. De fait F et G ne peuvent pas être 2 plans ou 2 droites. Le but étant : il faut qu'il existe un point d'intersection O qui serve de référence dans le glissement du point X.
>- `x = x' + x'' ↦ x'` : Si l'équation rapelle que le vecteur x est la somme des vecteurs x' et x'', la flèche répelle que le vecteur x' est la projection du vecteur x sur le plan F. Pour une projection x', il peut exister une infinité de solution possible de x'' qui suive tout le long d'une droite partant de x' et parallèle à la droite G.


# II - Coordonnées Homogènes

Les matrices de projection homogènes permettent les calculs possible dans l'espace projectif.
Dans un espace de dimension 3, on défini les coordonnées d'un point comme suit : 
`(x, y, z, w)`. Par convention le plan à l'infini, c'est à dire le plan  sur lequel se "repli" cet espace projectif se trouve pour toute coordonées avec *w=0*. Hors, de ce plan on utiliste *(x/w, y/w, z/w)* comme un sythème cartésien ordinaire. L'espace affine complémentaire au plan à l'infini est coordonné dans une forme familière avec une base correspondant à 
(1 : 0 : 0 : 1), (0 : 1 : 0 : 1), (0 : 0 : 1 : 1)

## 1) Transformations affines

les transformations affines regroupes plusieurs types de transformations:
- rotation
- inversion
- transversion
- réflexion

On peut considérer les homothéties et less changements de repère comme des transformations affines.

Les matrices de transformations sont des matrices 4x4 dont la dernière ligne est toujours (0 0 0 1).

### a) Translations

La matrice de translation d'un vecteur `t(tx, ty, tz)` se défini de la manière suivante

![[Pasted image 20260915140300.png]]

en application :

![[Pasted image 20260915140252.png]]

ce qui donne bien :

![[Pasted image 20260915140241.png]]


>[!Note]
>Dans le cas général : la dernière colonne correspond à la translation, ques qu'en soit les autres composants


### b) Rotations

![[Pasted image 20260915161345.png]]

R3x3 désigne une matrice de rotation

Pour décrire une rotation sur les 3 principeaux axes :
- rotation d'angle α autour de i  :
![[Pasted image 20260915161656.png]]
- rotation d'angle β autour de j :
![[Pasted image 20260915161702.png]]
- rotation d'angle γ autour de k :
![[Pasted image 20260915161723.png]]

