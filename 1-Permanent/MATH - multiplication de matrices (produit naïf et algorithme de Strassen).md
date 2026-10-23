---
type: permanent
created: 2026-10-23 23:20
tags:
  - permanent
  - mathematiques
  - algebre-lineaire
  - algorithmique
---

# MATH - multiplication de matrices (produit naïf et algorithme de Strassen)

> [!abstract] Concept
> Le produit $C = AB$ s'obtient en faisant le produit scalaire de chaque ligne de $A$ par chaque colonne de $B$. Pour des matrices $n \times n$, la méthode directe coûte $n^{3}$ multiplications. L'algorithme de Strassen découpe les matrices en blocs et remplace 8 produits de blocs par 7, ce qui fait descendre le coût à $O(n^{\log_2 7}) \approx O(n^{2{,}807})$.

## Explication

### Définition : ligne × colonne

Le produit $AB$ n'existe que si le **nombre de colonnes de $A$ est égal au nombre de lignes de $B$** : une matrice $A$ de taille $m \times n$ multipliée par une matrice $B$ de taille $n \times p$ donne une matrice $C$ de taille $m \times p$. Chaque coefficient est le **produit scalaire** de la ligne $i$ de $A$ par la colonne $j$ de $B$ :

$$c_{ij} = \sum_{k=1}^{n} a_{ik} \, b_{kj}$$

<svg viewBox="0 0 440 200" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Le coefficient c_ij est le produit de la ligne i de A par la colonne j de B">
<text x="16" y="22" font-size="12" fill="currentColor">cᵢⱼ = (ligne i de A) · (colonne j de B)</text>
<rect x="20" y="90" width="90" height="30" fill="#4c9aff" fill-opacity="0.3"/>
<rect x="175" y="60" width="30" height="90" fill="#f2994a" fill-opacity="0.3"/>
<rect x="300" y="90" width="30" height="30" fill="#27ae60" fill-opacity="0.4"/>
<g fill="none" stroke="currentColor" stroke-width="1" opacity="0.6">
<rect x="20" y="60" width="90" height="90"/><line x1="50" y1="60" x2="50" y2="150"/><line x1="80" y1="60" x2="80" y2="150"/><line x1="20" y1="90" x2="110" y2="90"/><line x1="20" y1="120" x2="110" y2="120"/>
<rect x="145" y="60" width="90" height="90"/><line x1="175" y1="60" x2="175" y2="150"/><line x1="205" y1="60" x2="205" y2="150"/><line x1="145" y1="90" x2="235" y2="90"/><line x1="145" y1="120" x2="235" y2="120"/>
<rect x="270" y="60" width="90" height="90"/><line x1="300" y1="60" x2="300" y2="150"/><line x1="330" y1="60" x2="330" y2="150"/><line x1="270" y1="90" x2="360" y2="90"/><line x1="270" y1="120" x2="360" y2="120"/>
</g>
<text x="65" y="50" font-size="14" fill="currentColor" text-anchor="middle">A</text>
<text x="190" y="50" font-size="14" fill="currentColor" text-anchor="middle">B</text>
<text x="315" y="50" font-size="14" fill="currentColor" text-anchor="middle">C = AB</text>
<text x="127" y="110" font-size="16" fill="currentColor" text-anchor="middle">×</text>
<text x="252" y="110" font-size="16" fill="currentColor" text-anchor="middle">=</text>
<text x="20" y="172" font-size="12" fill="#4c9aff">ligne i</text>
<text x="160" y="172" font-size="12" fill="#f2994a">colonne j</text>
<text x="290" y="172" font-size="12" fill="#27ae60">case (i, j)</text>
<text x="20" y="192" font-size="11" fill="currentColor" opacity="0.8">n multiplications par case, n² cases → n³ multiplications</text>
</svg>

Le produit matriciel représente la **composition** de deux applications linéaires : $(AB)\,x = A\,(Bx)$, on applique d'abord $B$, puis $A$. On en déduit ses propriétés :

- il est **associatif** : $(AB)C = A(BC)$ ;
- il **n'est pas commutatif** : en général $AB \neq BA$. Tourner puis translater ne donne pas le même résultat que translater puis tourner ;
- il est **distributif** sur l'addition : $A(B + C) = AB + AC$ ;
- il **inverse l'ordre** dans la transposée et l'inverse : $(AB)^{T} = B^{T} A^{T}$ et $(AB)^{-1} = B^{-1} A^{-1}$ ;
- il est compatible avec le déterminant : $\det(AB) = \det(A)\,\det(B)$.

### Coût de la méthode naïve

Pour deux matrices $n \times n$, chacune des $n^{2}$ cases demande $n$ multiplications et $n - 1$ additions, soit **$n^{3}$ multiplications** et $n^{3} - n^{2}$ additions. Le coût est en $O(n^{3})$ : doubler la taille multiplie le travail par $8$. C'est la triple boucle classique :

```c
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++) {
        double s = 0.0;
        for (int k = 0; k < n; k++)
            s += A[i][k] * B[k][j];
        C[i][j] = s;
    }
```

### Produit par blocs

On peut couper chaque matrice en **4 blocs** de taille $\frac{n}{2} \times \frac{n}{2}$ et appliquer la règle ligne × colonne aux blocs comme s'ils étaient des nombres :

$$\begin{pmatrix} C_{11} & C_{12} \\ C_{21} & C_{22} \end{pmatrix} = \begin{pmatrix} A_{11} & A_{12} \\ A_{21} & A_{22} \end{pmatrix} \begin{pmatrix} B_{11} & B_{12} \\ B_{21} & B_{22} \end{pmatrix}
\qquad
\begin{aligned}
C_{11} &= A_{11}B_{11} + A_{12}B_{21} \\
C_{12} &= A_{11}B_{12} + A_{12}B_{22} \\
C_{21} &= A_{21}B_{11} + A_{22}B_{21} \\
C_{22} &= A_{21}B_{12} + A_{22}B_{22}
\end{aligned}$$

Cela fait **8 produits** de blocs et 4 additions de blocs. En appliquant la même découpe à chaque bloc, de façon récursive, on obtient :

$$T(n) = 8\,T\!\left(\tfrac{n}{2}\right) + O(n^{2}) \;\Rightarrow\; T(n) = O(n^{\log_2 8}) = O(n^{3})$$

Le découpage seul ne fait rien gagner. Ce qui fixe la complexité, c'est le **nombre de produits** à chaque niveau, parce que les additions ne coûtent que $O(n^{2})$.

### L'algorithme de Strassen (1969)

Volker Strassen a trouvé comment obtenir les 4 blocs de $C$ avec **7 produits** au lieu de 8, en échange de quelques additions supplémentaires. On calcule 7 produits intermédiaires :

$$\begin{aligned}
M_1 &= (A_{11} + A_{22})(B_{11} + B_{22}) \\
M_2 &= (A_{21} + A_{22})\,B_{11} \\
M_3 &= A_{11}\,(B_{12} - B_{22}) \\
M_4 &= A_{22}\,(B_{21} - B_{11}) \\
M_5 &= (A_{11} + A_{12})\,B_{22} \\
M_6 &= (A_{21} - A_{11})(B_{11} + B_{12}) \\
M_7 &= (A_{12} - A_{22})(B_{21} + B_{22})
\end{aligned}$$

puis on les recombine :

$$\begin{aligned}
C_{11} &= M_1 + M_4 - M_5 + M_7 \\
C_{12} &= M_3 + M_5 \\
C_{21} &= M_2 + M_4 \\
C_{22} &= M_1 - M_2 + M_3 + M_6
\end{aligned}$$

Au total : **7 produits et 18 additions ou soustractions** de blocs. Les formules ne permutent jamais les deux facteurs d'un produit : un $A$ reste toujours à gauche d'un $B$. Elles restent donc valables quand les coefficients sont eux-mêmes des matrices, qui ne commutent pas, et c'est ce qui permet d'appliquer l'algorithme **récursivement** sur les blocs :

$$T(n) = 7\,T\!\left(\tfrac{n}{2}\right) + O(n^{2}) \;\Rightarrow\; T(n) = O(n^{\log_2 7}) \approx O(n^{2{,}807})$$

<svg viewBox="0 0 440 190" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Arbre de récursion : 8 sous-produits pour la méthode par blocs, 7 pour Strassen">
<text x="16" y="22" font-size="12" fill="currentColor">un niveau de récursion : problème n → sous-problèmes n/2</text>
<text x="110" y="50" font-size="12" fill="#f2994a" text-anchor="middle">blocs naïfs</text>
<text x="330" y="50" font-size="12" fill="#4c9aff" text-anchor="middle">Strassen</text>
<g stroke="#f2994a" stroke-width="1.2" opacity="0.8">
<line x1="110" y1="72" x2="26" y2="128"/><line x1="110" y1="72" x2="50" y2="128"/><line x1="110" y1="72" x2="74" y2="128"/><line x1="110" y1="72" x2="98" y2="128"/><line x1="110" y1="72" x2="122" y2="128"/><line x1="110" y1="72" x2="146" y2="128"/><line x1="110" y1="72" x2="170" y2="128"/><line x1="110" y1="72" x2="194" y2="128"/>
</g>
<circle cx="110" cy="70" r="9" fill="#f2994a" fill-opacity="0.35" stroke="#f2994a"/>
<g fill="#f2994a" fill-opacity="0.35" stroke="#f2994a">
<circle cx="26" cy="132" r="6"/><circle cx="50" cy="132" r="6"/><circle cx="74" cy="132" r="6"/><circle cx="98" cy="132" r="6"/><circle cx="122" cy="132" r="6"/><circle cx="146" cy="132" r="6"/><circle cx="170" cy="132" r="6"/><circle cx="194" cy="132" r="6"/>
</g>
<g stroke="#4c9aff" stroke-width="1.2" opacity="0.8">
<line x1="330" y1="72" x2="258" y2="128"/><line x1="330" y1="72" x2="282" y2="128"/><line x1="330" y1="72" x2="306" y2="128"/><line x1="330" y1="72" x2="330" y2="128"/><line x1="330" y1="72" x2="354" y2="128"/><line x1="330" y1="72" x2="378" y2="128"/><line x1="330" y1="72" x2="402" y2="128"/>
</g>
<circle cx="330" cy="70" r="9" fill="#4c9aff" fill-opacity="0.35" stroke="#4c9aff"/>
<g fill="#4c9aff" fill-opacity="0.35" stroke="#4c9aff">
<circle cx="258" cy="132" r="6"/><circle cx="282" cy="132" r="6"/><circle cx="306" cy="132" r="6"/><circle cx="330" cy="132" r="6"/><circle cx="354" cy="132" r="6"/><circle cx="378" cy="132" r="6"/><circle cx="402" cy="132" r="6"/>
</g>
<text x="110" y="160" font-size="12" fill="currentColor" text-anchor="middle">8 produits → 8ᵏ = n³</text>
<text x="330" y="160" font-size="12" fill="currentColor" text-anchor="middle">7 produits → 7ᵏ = n^2,807</text>
<text x="220" y="182" font-size="11" fill="currentColor" opacity="0.8" text-anchor="middle">avec n = 2ᵏ : l'écart se multiplie par 8/7 à chaque niveau</text>
</svg>

#### Déroulement récursif pour $n > 2$

Avec des matrices $2 \times 2$, les blocs $A_{11}, \dots, B_{22}$ sont de simples nombres et les 7 produits $M_i$ sont des multiplications scalaires. Au-delà, pour $n = 2^{k}$, **chaque bloc est une matrice $\frac{n}{2} \times \frac{n}{2}$**, et chacun des 7 produits $M_i$ est calculé en **rappelant Strassen** sur ces blocs. On redescend ainsi jusqu'à une taille où la multiplication directe est plus rapide. Un appel se déroule en quatre étapes :

1. **Cas de base** : si $n$ est inférieur au seuil (ou si $n = 1$), on fait le produit naïf et on s'arrête.
2. **Découpage** : on coupe $A$ et $B$ en 4 blocs $\frac{n}{2} \times \frac{n}{2}$. Il n'y a aucun calcul, seulement des indices ou des copies.
3. **Sommes puis 7 appels récursifs** : on forme les **10 sommes ou différences de blocs** qui servent de facteurs (par exemple $A_{11} + A_{22}$ et $B_{11} + B_{22}$ pour $M_1$), puis on calcule $M_1, \dots, M_7$ par **7 appels récursifs** sur des matrices $\frac{n}{2} \times \frac{n}{2}$.
4. **Recombinaison** : on obtient $C_{11}, C_{12}, C_{21}, C_{22}$ par **8 additions ou soustractions** des $M_i$, puis on recolle les 4 blocs pour former $C$.

```text
strassen(A, B, n):
    si n ≤ SEUIL : retourner produit_naif(A, B)
    découper A en A11 A12 A21 A22, et B en B11 B12 B21 B22   (taille n/2)

    M1 = strassen(A11 + A22, B11 + B22, n/2)
    M2 = strassen(A21 + A22, B11,       n/2)
    M3 = strassen(A11,       B12 - B22, n/2)
    M4 = strassen(A22,       B21 - B11, n/2)
    M5 = strassen(A11 + A12, B22,       n/2)
    M6 = strassen(A21 - A11, B11 + B12, n/2)
    M7 = strassen(A12 - A22, B21 + B22, n/2)

    C11 = M1 + M4 - M5 + M7        C12 = M3 + M5
    C21 = M2 + M4                  C22 = M1 - M2 + M3 + M6
    retourner [[C11, C12], [C21, C22]]
```

À chaque niveau $\ell$ de l'arbre, on a $7^{\ell}$ sous-problèmes de taille $\frac{n}{2^{\ell}}$. Pour $n = 8$, en descendant jusqu'aux scalaires :

| Niveau $\ell$ | Sous-problèmes | Taille des matrices | Rôle |
|---|---|---|---|
| 0 | $1$ | $8 \times 8$ | appel initial |
| 1 | $7$ | $4 \times 4$ | les $M_i$ du premier niveau |
| 2 | $49$ | $2 \times 2$ | les $M_i$ de chaque $M_i$ |
| 3 | $343$ | $1 \times 1$ | multiplications scalaires (feuilles) |

L'algorithme fait donc $7^{3} = 343$ multiplications, contre $8^{3} = 512$ pour la méthode naïve. Au niveau $\ell$, les additions coûtent $18 \cdot 7^{\ell} \cdot \left(\frac{n}{2^{\ell+1}}\right)^{2}$. Ce terme est proportionnel à $\left(\frac{7}{4}\right)^{\ell}$ et grandit donc d'un niveau à l'autre : la somme est dominée par les derniers niveaux, c'est-à-dire par les $7^{\log_2 n} = n^{\log_2 7}$ feuilles. D'où le coût total $O(n^{\log_2 7})$, additions comprises.

> [!example]- Une étape de récursion sur une $4 \times 4$ : le calcul de $M_1$
> Pour une $4 \times 4$, les blocs sont des $2 \times 2$. Prenons
> $$A_{11} = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix},\ A_{22} = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix},\ B_{11} = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix},\ B_{22} = \begin{pmatrix} 2 & 0 \\ 1 & 1 \end{pmatrix}$$
> **Étape 3, les sommes** : $S = A_{11} + A_{22} = \begin{pmatrix} 2 & 2 \\ 3 & 5 \end{pmatrix}$ et $T = B_{11} + B_{22} = \begin{pmatrix} 3 & 1 \\ 1 & 2 \end{pmatrix}$.
>
> **Appel récursif** $M_1 = \text{strassen}(S, T, 2)$. Les blocs sont maintenant des nombres : $a = 2,\ b = 2,\ c = 3,\ d = 5$ et $e = 3,\ f = 1,\ g = 1,\ h = 2$.
> $$\begin{aligned}
> m_1 &= (2 + 5)(3 + 2) = 35 & m_5 &= (2 + 2) \cdot 2 = 8 \\
> m_2 &= (3 + 5) \cdot 3 = 24 & m_6 &= (3 - 2)(3 + 1) = 4 \\
> m_3 &= 2 \cdot (1 - 2) = -2 & m_7 &= (2 - 5)(1 + 2) = -9 \\
> m_4 &= 5 \cdot (1 - 3) = -10
> \end{aligned}$$
> $$M_1 = \begin{pmatrix} 35 - 10 - 8 - 9 & -2 + 8 \\ 24 - 10 & 35 - 24 - 2 + 4 \end{pmatrix} = \begin{pmatrix} 8 & 6 \\ 14 & 13 \end{pmatrix}$$
> On vérifie par la méthode directe : $ST = \begin{pmatrix} 6 + 2 & 2 + 4 \\ 9 + 5 & 3 + 10 \end{pmatrix} = \begin{pmatrix} 8 & 6 \\ 14 & 13 \end{pmatrix}$.
>
> Les six autres produits $M_2, \dots, M_7$ se calculent de la même façon, chacun par un appel récursif à 7 multiplications scalaires. Au total, la $4 \times 4$ coûte $7 \times 7 = 49$ multiplications, au lieu de $64$.

Si $n$ n'est pas une puissance de $2$, on complète les matrices avec des zéros jusqu'à la puissance de $2$ suivante. On peut aussi compléter à chaque niveau d'une seule ligne et d'une seule colonne quand la taille est impaire. Les zéros ajoutés ne changent pas le bloc utile du résultat.

### Coût comparé : méthode naïve et Strassen

Pour $n = 2^{k}$, on compte les opérations scalaires (multiplications et additions) de trois variantes :

- **Naïve** : $n^{3}$ multiplications et $n^{3} - n^{2}$ additions, soit $2n^{3} - n^{2}$ opérations.
- **Strassen pur**, avec une récursion qui descend jusqu'aux scalaires : $7^{k} = n^{\log_2 7}$ multiplications et $6\,(7^{k} - 4^{k})$ additions, soit $7^{k+1} - 6 \cdot 4^{k}$ opérations. Le nombre d'additions s'obtient en résolvant $A(n) = 7\,A\!\left(\frac{n}{2}\right) + 18\left(\frac{n}{2}\right)^{2}$ avec $A(1) = 0$.
- **Strassen hybride** : la récursion s'arrête à $n \leq 8$ et termine par la méthode naïve. Ce seuil est celui qui minimise le nombre total d'opérations.

| $n$      | Naïve : mult.          | Naïve : total           | Strassen pur : mult.   | Strassen pur : total   | Strassen pur / naïve |
| -------- | ---------------------- | ----------------------- | ---------------------- | ---------------------- | -------------------- |
| $2$      | $8$                    | $12$                    | $7$                    | $25$                   | $2{,}08$             |
| $4$      | $64$                   | $112$                   | $49$                   | $247$                  | $2{,}21$             |
| $8$      | $512$                  | $960$                   | $343$                  | $2\,017$               | $2{,}10$             |
| $16$     | $4\,096$               | $7\,936$                | $2\,401$               | $15\,271$              | $1{,}92$             |
| $64$     | $2{,}6 \times 10^{5}$  | $5{,}2 \times 10^{5}$   | $1{,}2 \times 10^{5}$  | $8{,}0 \times 10^{5}$  | $1{,}54$             |
| $256$    | $1{,}7 \times 10^{7}$  | $3{,}3 \times 10^{7}$   | $5{,}8 \times 10^{6}$  | $4{,}0 \times 10^{7}$  | $1{,}19$             |
| $1\,024$ | $1{,}07 \times 10^{9}$ | $2{,}15 \times 10^{9}$  | $2{,}8 \times 10^{8}$  | $1{,}97 \times 10^{9}$ | $0{,}92$             |
| $4\,096$ | $6{,}9 \times 10^{10}$ | $1{,}37 \times 10^{11}$ | $1{,}4 \times 10^{10}$ | $9{,}7 \times 10^{10}$ | $0{,}70$             |

Ce qu'on lit dans ce tableau :

- **Strassen pur ne devient rentable qu'à partir de $n = 1\,024$**. En dessous, les additions supplémentaires annulent le gain sur les multiplications. Pour une $4 \times 4$, il fait plus de deux fois plus d'opérations que la méthode naïve.
- **La version hybride est toujours au moins aussi bonne que la naïve**, et elle prend l'avantage dès $n = 16$. C'est pour cela que les implémentations réelles fixent un seuil de bascule.
- **L'écart se creuse avec $n$** : le rapport tend vers $0$ comme $n^{\log_2 7 - 3} = n^{-0{,}19}$, mais très lentement. Il faut multiplier $n$ par environ $36$ ($2^{5{,}2}$) pour diviser le coût relatif par deux.

Ce décompte suppose qu'une addition coûte autant qu'une multiplication, ce qui est le cas sur un processeur moderne. Il ne tient compte ni des accès mémoire, ni du cache, ni du SIMD, qui avantagent la méthode naïve. Le seuil réel est donc plus élevé que $8$ : il se situe en général entre quelques dizaines et quelques centaines.

### Limites en pratique

- **Seuil de bascule** : les 18 additions et les copies de blocs coûtent cher sur les petites matrices. Les implémentations arrêtent la récursion sous une taille de quelques dizaines à quelques centaines, et terminent avec la méthode naïve.
- **Taille impaire** : il faut compléter les matrices avec des zéros (*padding*) jusqu'à une taille paire, ou traiter à part la ligne et la colonne en trop.
- **Stabilité numérique** : en virgule flottante, les soustractions comme $B_{12} - B_{22}$ propagent davantage les erreurs d'arrondi que la méthode directe.
- **Mémoire et cache** : les matrices temporaires $M_1 \dots M_7$ occupent de la mémoire, et la méthode naïve découpée en tuiles exploite mieux le cache et les instructions SIMD. Les bibliothèques BLAS restent donc en général sur un $O(n^{3})$ très optimisé.

Strassen a ouvert la recherche sur l'**exposant $\omega$** de la multiplication matricielle, défini comme le plus petit exposant tel qu'on sache multiplier en $O(n^{\omega})$. On sait que $\omega \geq 2$, puisqu'il faut au minimum lire les $n^{2}$ coefficients. Les meilleurs résultats théoriques actuels donnent $\omega < 2{,}372$, mais avec des constantes si grandes que ces algorithmes ne servent jamais en pratique.

## Exemples

### Exemple 1 — produit $2 \times 2$ par la méthode directe

$$A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}, \quad B = \begin{pmatrix} 5 & 6 \\ 7 & 8 \end{pmatrix}$$

$$AB = \begin{pmatrix} 1 \cdot 5 + 2 \cdot 7 & 1 \cdot 6 + 2 \cdot 8 \\ 3 \cdot 5 + 4 \cdot 7 & 3 \cdot 6 + 4 \cdot 8 \end{pmatrix} = \begin{pmatrix} 19 & 22 \\ 43 & 50 \end{pmatrix}$$

Cela fait 8 multiplications. Dans l'autre sens, $BA = \begin{pmatrix} 23 & 34 \\ 31 & 46 \end{pmatrix} \neq AB$ : le produit n'est pas commutatif.

### Exemple 2 — les mêmes matrices par Strassen

Les « blocs » sont ici de simples nombres ($A_{11} = 1$, $A_{12} = 2$, etc.) :

$$\begin{aligned}
M_1 &= (1 + 4)(5 + 8) = 65 & M_5 &= (1 + 2) \cdot 8 = 24 \\
M_2 &= (3 + 4) \cdot 5 = 35 & M_6 &= (3 - 1)(5 + 6) = 22 \\
M_3 &= 1 \cdot (6 - 8) = -2 & M_7 &= (2 - 4)(7 + 8) = -30 \\
M_4 &= 4 \cdot (7 - 5) = 8
\end{aligned}$$

$$\begin{aligned}
C_{11} &= 65 + 8 - 24 - 30 = 19 & C_{12} &= -2 + 24 = 22 \\
C_{21} &= 35 + 8 = 43 & C_{22} &= 65 - 35 - 2 + 22 = 50
\end{aligned}$$

On retrouve le même résultat avec 7 multiplications au lieu de 8, mais 18 additions au lieu de 4. Sur des nombres, ce n'est pas rentable. Le gain apparaît quand chaque « multiplication » est elle-même un produit de grandes matrices.

### Exemple 3 — ordre de grandeur du gain

Pour $n = 1024 = 2^{10}$ et une récursion menée jusqu'aux scalaires :

| Méthode | Multiplications scalaires |
|---|---|
| naïve | $8^{10} = n^{3} \approx 1{,}07 \times 10^{9}$ |
| Strassen | $7^{10} \approx 2{,}82 \times 10^{8}$ |

Strassen fait environ $3{,}8$ fois moins de multiplications. En comptant aussi les additions, Strassen ne fait plus que $0{,}92$ fois le coût naïf en version pure, et $0{,}51$ fois en version hybride (voir le tableau « Coût comparé »).

## Cas d'usage

- **Rendu 3D** : composer des transformations (modèle → monde → caméra → projection) en un seul produit de matrices $4 \times 4$. À cette taille, on utilise toujours la méthode directe, souvent déroulée à la main ou vectorisée.
- **Calcul scientifique et apprentissage automatique** : multiplier de très grandes matrices. C'est là que se pose la question de l'algorithme (Strassen, découpage en tuiles, GPU).
- **Algorithmique** : Strassen est un exemple classique de **diviser pour régner**, où l'on gagne en réduisant le nombre d'appels récursifs plutôt que leur coût.

## Connexions

### Notes liées
- [[MATH - produit scalaire]] - chaque coefficient $c_{ij}$ est le produit scalaire d'une ligne par une colonne
- [[MATH - matrice transposée]] - $(AB)^{T} = B^{T} A^{T}$, l'ordre s'inverse
- [[MATH - matrice inverse]] - $(AB)^{-1} = B^{-1} A^{-1}$, et $A A^{-1} = I_n$ se définit par ce produit
- [[MATH - calcul du déterminant d'une matrice carrée]] - $\det(AB) = \det(A)\det(B)$ ; le pivot de Gauss y est aussi en $O(n^{3})$
- [[MATH - matrices de rotation autour des axes]] - exemple concret de non-commutativité : $R_x R_y \neq R_y R_x$
- [[MATH - matrice de transformation affine 4x4]] - composer des transformations revient à multiplier leurs matrices
- [[MATH - quaternion vs matrice de rotation (coûts)]] - le même raisonnement par décompte d'opérations, appliqué aux rotations

### Dans le contexte de
- [[MOC - Mathématiques]] - branche algèbre linéaire

## Ressources

- Source : notions de cours d'algèbre linéaire et d'algorithmique (note rédigée sur demande, 2026-10-23)
- V. Strassen, *Gaussian elimination is not optimal*, Numerische Mathematik 13, 1969

---

**Tags thématiques** : `#mathematiques` `#algebre-lineaire` `#algorithmique`
