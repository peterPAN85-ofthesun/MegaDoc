
Un projection :
- décomposition d'un espace vecctoriel *E* comme somme de deux sous-espaces supplémentaires
- une application linéaire idempotente : elle vérifie *p ° p = p*

>[!Definition]
>Def : *Idempotente*
>Une opération idempotente est une opération qui donne toujours le même résultat que l'on applique une ou plusieurs fois.
>ex : la valeur absolue est une opération idempotente car ||A|| = |A|

# I - Basique

![[Pasted image 20260915201516.png]]

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

Pour décrire une rotation sur les 3 principeaux axes du repère défini O(i, j ,k):
- rotation d'angle α autour de i  :
![[Pasted image 20260915161656.png]]
- rotation d'angle β autour de j :
![[Pasted image 20260915161702.png]]
- rotation d'angle γ autour de k :
![[Pasted image 20260915161723.png]]

### c) Projections

#### Orthographique / Isométrique

Pour projeter de manière orthographique sur un plan situé à une distance *f* suivant la direction *k* (toujours dans le repère défini par O(i, j ,k))

![[Pasted image 20260915164551.png]]

Pour appliquer un changement de repère à la fois en translation et en rotation, on cumule les deux matrices de transgformations :

![[Pasted image 20260916104603.png]]

Pour inverser le processus, on peut multiplier le résulat obtenue après transformation par la matrice transposéee de R3x3 (= R3x3T)

![[Pasted image 20260916131405.png]]

>[!Def]
>**Matrice :**
>![[Pasted image 20260916131612.png]]
>**Matrice transposée :**
>![[Pasted image 20260916131622.png]]

#### Gnomonique

On se place dans le cas d'une projection sur un plan (i, j), situé à une distance *f* de l'origine suivant la direction *k* . Les points projetés sont ici sur  la droite passant par l'origine et le point à projeter. La matrice est alors exprimée sous la forme suivante :

![[Pasted image 20260916234904.png]]

# III - Rotation

## 1) Quaternion

### a - Théorie

>[!Def]
>**Produit scalaire :**
>>![[Pasted image 20260921201418.png]]
>>Modélise le travail d'une force :
>>- Si le vecteur résultatant est nul : les deux vecteurs comparés sont strictement opposés
>
>
>**Produit vectoriel :**
>>![[Pasted image 20260921201831.png]]
>>![[Pasted image 20260921202006.png]]
>>- `w` est toujours othogonal aux deux vecteurs donnés
>>- le produit deu deux vecteurs colinéaires est nul par définition
>>- deux vecteurs sont orthogonaux si et seulement si la norme de leur produit vectoriel est égale au produit de leurs normes
>>- le norme du produit vectoriel `w` est égal à l'aire du parallélogramme défini par les deux vecteurs `u` et `v`
>>![[Pasted image 20260921203235.png]]

![[Pasted image 20260922004623.png]]
>[!Note]
>**L'emboîtement.** Chaque rectangle est entièrement contenu dans le suivant. Un réel _est_ un cas particulier de complexe (sa partie imaginaire est nulle), et un complexe _est_ un cas particulier de quaternion (deux de ses trois parties imaginaires sont nulles). Donc ℝ ⊂ ℂ ⊂ ℍ ⊂ 𝕆. En notation ensembliste, un quaternion s'écrit q = a + b·i + c·j + d·k, avec a, b, c, d réels ; si c = d = 0, on retombe sur un complexe a + b·i ; si en plus b = 0, sur un réel.
>**Le doublement des dimensions.** C'est la logique de la construction : 1 → 2 → 4 → 8. Un réel demande 1 nombre, un complexe 2, un quaternion 4, un octonion 8. On construit chaque étage en « collant » deux copies du précédent (un quaternion, c'est en gros une paire de complexes). On ne peut pas s'arrêter à 3 : il n'existe pas d'algèbre de division de dimension 3, ce qui est justement la raison historique pour laquelle Hamilton a dû passer à la dimension 4.
>**Le prix à payer.** À chaque montée, on gagne en richesse mais on perd une propriété qu'on tenait pour acquise :
>- de ℝ à ℂ : on perd l'**ordre**. On ne peut plus dire qu'un complexe est « plus grand » qu'un autre.
>- de ℂ à ℍ : on perd la **commutativité**. Pour les quaternions, i·j = k mais j·i = −k. L'ordre de multiplication compte, et c'est précisément ce qui leur permet de représenter des rotations (composer deux rotations dépend de l'ordre).
>- de ℍ à 𝕆 : on perd l'**associativité**. (a·b)·c n'est plus forcément égal à a·(b·c).

Un quaternion sont un ensemble de nombres qui répondent à cette équation :
![[Pasted image 20260922003321.png]]

Tout quaternion q s'écrit de manière unique sous la forme :
![[Pasted image 20260922003427.png]]
ou `a`, `b`, `c` et `d` sont des nombres réels et `i`,`j` et `k` sont trois symboles

Les quaternions s'ajoutent et se multiplient comme d'autres nombres en prenant garde à ne pas changer l'ordre des facteurs dans la produit (la multiplication n'est pas **cummulative**), sauf pour un facteur réel.


![[Pasted image 20260922003954.png]]

![[Pasted image 20260922010427.png]]
*Diagramme du cycle des quaternions lors du produit entre imaginaires purs. i j = k , k i = j , j k = i ![{\displaystyle ij=k,ki=j,jk=i}](https://wikimedia.org/api/rest_v1/media/math/render/svg/21fad1d08bc735bc0d540df76a05e198045a5768)*

Un quaternion est composé d'une partie réelle **Re(q)** (ou *scalaire*) et d'une partie imaginaire **Im(q)** (ou *vectorielle*).

`q* = Re(q) - Im(q)` : **conjugué (quaternionique)**

ou :
`Re(q) = a`
`Im(q) = bi + cj + dk`

La **conjugaison quaternionique** ![[Pasted image 20260922005331.png]] est un *antiotomorphisme* involutif de ![[Pasted image 20260922005404.png]] : elle est ![[Pasted image 20260922005430.png]]-linéaire, involutive et renverse les produits : on a toujours ![[Pasted image 20260922005525.png]]

![[Pasted image 20260922005555.png]] = q*

>[!Def]
>**Antiautomorphisme :**
>>Application entre deux structure algébriques qui renverse l'ordre des opérations
>
>**Involution :**
>>application bijective qui est sa propre réciproque, c'est à dire par laquelle chaque éléments est l'image de son image. Exemple  : le changement de signe de l'ensemble des nombres réels.
>


La **norme** de q : ||q||
![[Pasted image 20260922010137.png]]
Les propriété des de la conjugaison quaternionique rendent cette norme multiplicative : on atoujours
![[Pasted image 20260922010317.png]]


L'inverse d'un quaternion non nulle :
![[Pasted image 20260922010651.png]]
Celà permet une division d'un quaternion q1 par un quaternion q1 non nul, mais cette division peut être affectuée à gauche ou à droite, ne produisant alors pas le même résultat.
![[Pasted image 20260922010914.png]] ou  ![[Pasted image 20260922010931.png]]

>[!Warning]
>Ne pas utiliser la notation ![[Pasted image 20260922011003.png]], qui est de fait une ambiguité

Pour multiplier deux quaternion ![[Pasted image 20260922011520.png]] et ![[Pasted image 20260922011527.png]]
sachant que :
- Notons ![[Pasted image 20260922011805.png]] de sorte à ce que ![[Pasted image 20260922011820.png]] 
	- H -> 4 dimensions 
	- R -> 1 dimension
	- Im H -> 3 dimensions
- `a` est la partie réelle
- `v` est le vecteur (b, c, d) dans l'espace euclidien de dimension 3 canoniquement isomorphe à ![[Pasted image 20260922012016.png]] en partant de  ![[Pasted image 20260922012124.png]]

On peut donc faire appel au produit de Hamilton
![[Pasted image 20260922012209.png]]
où:
![[Pasted image 20260922012228.png]]


### b - En pratique pour la rotation

#### Parallèle avec la rotation :
On peut voir dans le système à 4 unités du quaternions une analogie au problème posé par l'application d'une rotation à un objet 3D:
**Une rotation sur 3 axe, et la non commutativité des applications (A x B != B x A)**

${}q = a + bi +cj +dk{}$

Par convention, on peut dire que dans un quaternion de rotation :
- la partie réelle correspond à l'angle de rotation : ${}a{}$
- les coefs de la partie imaginaire décrivent le vecteur de rotation : ${}\vec{v}\begin{pmatrix}b\ \\  c \\  d\end{pmatrix} = \vec{v}\begin{pmatrix}x \\  y \\  z\end{pmatrix}{}$
On peut simplifier alors le quaternion de cette manière : ${}q = a + \vec{v}{}$

>[!Definition]
>Un quaternion unitaire est un quaternion dont la norme est égal à 1
 

#### **L'intérêt des quaternion pour la rotation :**

Par rapport à l'usage d'une matrice de rotation, les quaternions apportent des avantages non négligeables : 
- moins de mémoire utilisé
- le calcul de deux rotation l'une avec l'autre est moins coûteux
Sur une grande quantité de vecteur à orienter, les deux méthodes sont significativement identiques en terme de coût de calcul


**Espace mémoire nécessaire**

| Méthode             | Mémoire |
| ------------------- | ------- |
| Matrice de rotation | 9       |
| Quaternion          | 4       |
| Axe et angle        | 4*      |
>[!Note]
>la représentation sous forme d'angle et d'axe peut être stockée dans 3 emplacements seulement en multipliant l'axe de rotation par l'angle de rotation ; néanmoins, avant de l'utiliser, il faut récupérer le vecteur unitaire et l'angle en renormalisant, ce qui coûte des opérations mathématiques supplémentaires.

**Comparaison de performance de l'application d'une rotation sur une autre**

| Méthode             | Multiplications | Additions et soustractions | Nb total d'opérations |
| ------------------- | --------------- | -------------------------- | --------------------- |
| Matrice de rotation | 27              | 18                         | 45                    |
| Quaternion          | 16              | 12                         | 28                    |

**Comparaison de performances de la rotation de 1 vecteur**

| Méthode             |                           | Multiplications | Additions et soustractions | sin et cos | Nombre total d'opérations |
| ------------------- | ------------------------- | --------------- | -------------------------- | ---------- | ------------------------- |
| Matrice de rotation |                           | 9               | 6                          | 0          | 15                        |
| Quaternion          | Sans matrice intermédiare | 15              | 15                         | 0          | 30                        |
| Quaternion          | Avec matrice intermédiare | 21              | 18                         | 0          | 39                        |
| Axe et angle        | Sans matrice intermédiare | 18              | 13                         | 2          | 30 + 3                    |
| Axe et angle        | Avec matrice intermédiare | 21              | 16                         | 2          | 37 + 2                    |

**Comparaison de performances de la rotation de *n* vecteurs**

| Méthode             |                           | Multiplications | Additions et soustractions | sin et cos | Nombre total d'opérations |
| ------------------- | ------------------------- | --------------- | -------------------------- | ---------- | ------------------------- |
| Matrice de rotation |                           | 9n              | 6n                         | 0          | 15n                       |
| Quaternion          | Sans matrice intermédiare | 15n             | 15n                        | 0          | 30n                       |
| Quaternion          | Avec matrice intermédiare | 9n + 12         | 6n + 12                    | 0          | 15n + 24                  |
| Axe et angle        | Sans matrice intermédiare | 18n             | 12n + 1                    | 2          | 30n + 3                   |
| Axe et angle        | Avec matrice intermédiare | 9n + 12         | 16n + 10                   | 2          | 15n + 24                  |

>[!Note]
>L'usage d'une matrice orthogonale obtenue par action de conjugaison est donc plus efficace que si nous voulions passer directement aux coordonnées d'un vecteur après applications d'un quaternion

#### Mise en application :

>[!Rappel] : Multiplication de deux quaternions
>Mettons :
>${}q = (s + \vec{v}){}$
>${}p = (t +\vec{w}){}$
>${}q \cdot p = (s + \vec{v})(t + \vec{w}) = st + s\vec{w} + t\vec{v} +\vec{v}\vec{w}{}$
>Or la multiplication de deux vecteurs tel que ${}\vec{v}\vec{w}{}$  donne :
>${}\vec{v}\vec{w} = -\vec{v} \cdot \vec{w} + \vec{v} \wedge \vec{w}{}$
>Où :
>- ${}\vec{v} \cdot \vec{w}{}$ est un produit scalaire (un nombre)
>- ${}\vec{v} \wedge \vec{w}{}$ est un produit vectoriel (un vecteur)
>
>Alors, la multiplication de deux quaternion donne :
>${}(s + \vec{v})(t + \vec{w}) = (st - \vec{v}\cdot \vec{w}) + (s\vec{w} + \vec{t} + \vec{v} \wedge \vec{w}){}$
>----
>On peut vouloir ainsi inverser un quaternion :
>${}(s + \vec{v})^{-1} =\frac{s - \vec{v}}{s^2 + |\vec{v}|^2}{}$
>Ainsi ces deux relations sont vrais :
>- ${}q^{-1} \cdot q = 1{}$
>- ${}q \cdot q^{-1} = 1{}$


Un angle ${}\alpha{}$ est décris par la relation suivante : 
$$
q = \begin{pmatrix}
x \\
y \\
z \\
w
\end{pmatrix}
$$
$$
\alpha = 2\arccos w = 2 \arcsin \sqrt{ x^2 + y^2 + z^2 }
$$
On peut ainsi noté un quaternion de cette manière :

$$
q = w + xi + yj + zk = w + \begin{pmatrix}
x \\
y \\
z \\
\end{pmatrix}
= \cos\left( \frac{\alpha}{2} \right) + \vec{v}\left( \frac{\alpha}{2} \right)
$$
Où ${}\vec{u}\begin{pmatrix}x \\  y \\  z\end{pmatrix}{}$ est un *vecteur unitaire* (${}|\vec{u}| = 1{}$)

Pour appliquer une rotation, on dit aussi qu'on applique une **opération de conjugaison**.
Pour conjuguer un vecteur, on applique alors la relation de conjugaison :
$$
\vec{v'} = q\vec{v}q^{-1} = \left( \cos{\frac{\alpha}{2}} + \vec{u}{\sin{\frac{\alpha}{2}}} \right)\vec{v} \left( \cos{\frac{\alpha}{2}} - \vec{u}{\sin{\frac{\alpha}{2}}} \right)
$$
>[!Démonstration]
>On souhaite démontrer que ${}q^{-1} = \left(\cos{\frac{\alpha}{2} - \vec{u}\sin{\frac{\alpha}{2}}} \right){}$
>${}(s + \vec{v})^{-1} = \frac{s - \vec{v}}{(s^2 + ||\vec{v}||^2)}{}$
>${}\vec{v}=\vec{u}\sin\left( \frac{\alpha}{2} \right){}$
>${}\left( \cos{\frac{\alpha}{2}}+\vec{u}\sin\left( \frac{\alpha}{2} \right) \right)^{-1} = \frac{\left( \cos{\frac{\alpha}{2} - \vec{u}\sin{\frac{\alpha}{2}}} \right)}{\cos^2{\frac{\alpha}{2}}+||\vec{u}||^2\cdot \sin^2{\frac{\alpha}{2}}}{}$
>Or : ${}\vec{u}{}$ étant un vecteur unitaire, sa norme ${}||\vec{u}|| = 1{}$
>Il ne reste alors au dénominateur que ${}\cos^2{\frac{\alpha}{2}+\sin^2{\frac{\alpha}{2}}}{}$ qui est forcément égal à 1 (identité remarquable de trigonométrie)
>**Conclusion** : ${}q^{-1} = \frac{\left(\cos{\frac{\alpha}{2} - \vec{u}\sin{\frac{\alpha}{2}}} \right)}{1} = \left(\cos{\frac{\alpha}{2} - \vec{u}\sin{\frac{\alpha}{2}}} \right){}$

Cette **action de conjugaison** ${}\vec{v'} = q\vec{v}q^{-1}{}$ reviens à transformer le quaternion en une matrice de rotation **R** en utilisant la formule de conversion d'un quaternion en **matrice orthogonale**, puis à multiplier le résultat par la matrice-colonne représentant le vecteur.


>[!Définition]
>Une matrice A est dite **orthogonale** lorsqu'elle vérifie la relation ${}A\cdot A^t = I_{n}{}$ tel que :
>- ${}A^{t}$ est la matrice transposée de ${}A{}$
>- ${}I_{n}{}$ est la matrice unité

**Matrice orthogonale correspondant à une rotation ${}q = a + bi +cj +dk{}$ avec ${} |z| = 1{}$**

$$
\begin{pmatrix}
a^2+b^2-c^2-d^2 & 2bc-2ad & 2ac+2bd \\
2ad+2bc & a^2-b²+c²-d² & 2cd-2ab \\
2bd-2ac & 2ab+2cd & a²-b²-c²+d²
\end{pmatrix}
$$


## 2) Euler

### a) Généralité

Les trois angles d'Euler :
- précession ψ
- nutation θ
- rotation φ
 
**Exemple de la toupie :**
![[Pasted image 20260922151016.png]]

Dans l'exemple du mouvement de la toupie ci-contre, l'angle de nutation θ mesure l'obliquité de l'axe par rapport à la verticale, l'angle de précession ψ mesure la rotation de l'axe de la toupie autour de Oz, et l'angle de rotation propre φ mesure bien la rotation de la toupie sur elle-même.

### b) Changement de référentiel

Les trois rotation otenues un gardant constants deux des trois axes d'Euleur sont :
- la précession
- la nutation
- la rotation propre
On passe du référentiel fixe *Oxyz* au référentiel *Ox'y'z'* 

![[Pasted image 20260922152943.png]]

On peut décomposer la rotation en trois section :
>**1 :** ψ *précession* autour de l'axe *z*
>>x -> u
>>y ->v
>**2 :** θ *nutation* autour de l'axe *u*
>>v -> w
>>z -> z'
>**3 :** φ *rotation* autour de l'axe *z'*
>>u -> x'
>>w -> y'

>[!Remarque]
>L'axe Ou est porté par l'intersection des plans Oxy et Ox'y'.

On peut simplifier le vecteur de rotation instanté du solide par la simple somme :
![[Pasted image 20260922152804.png]]

On peut aussi  exprimer les angles d'Euler via une matrice de passage de telle manière que 
$$
{\begin{pmatrix}
x \\
y \\
z
\end{pmatrix}}
= A {\begin{pmatrix}
x' \\
y' \\
z'
\end{pmatrix}}
$$
$$
A =
\begin{pmatrix}
\cos \psi \cos \phi - \sin \psi \cos \theta \cos \phi & -\cos \psi \sin \phi - \sin \psi \cos \theta \cos \phi & \sin \psi \sin \theta \\
\cos \psi \cos \phi + \sin \psi \cos \theta \cos \phi & -\sin \psi \sin \phi + \cos \psi \cos \theta \cos \phi & -\cos \psi \sin \theta \\
\sin \theta \sin \phi & \sin \theta \cos \phi & \cos \theta

\end{pmatrix}
$$

