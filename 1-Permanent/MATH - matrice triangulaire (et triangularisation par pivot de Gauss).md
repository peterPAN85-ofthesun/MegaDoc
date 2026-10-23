---
type: permanent
created: 2026-10-23 10:35
tags:
  - permanent
  - mathematiques
  - algebre-lineaire
---

# MATH - matrice triangulaire (et triangularisation par pivot de Gauss)

> [!abstract] Concept
> Une matrice carrée est **triangulaire supérieure** quand tous ses coefficients situés sous la diagonale sont nuls (**inférieure** quand ce sont ceux au-dessus) ; toute matrice $n \times n$ peut être ramenée à une forme triangulaire supérieure par le **pivot de Gauss**, en annulant colonne par colonne les coefficients sous la diagonale.

## Explication

### Définitions

Soit $A = (a_{ij})$ une matrice carrée $n \times n$. La **diagonale principale** est formée des coefficients $a_{11}, a_{22}, \dots, a_{nn}$.

- $A$ est **triangulaire supérieure** si $a_{ij} = 0$ pour tout $i > j$ : tout ce qui est **sous** la diagonale est nul.
- $A$ est **triangulaire inférieure** si $a_{ij} = 0$ pour tout $i < j$ : tout ce qui est **au-dessus** de la diagonale est nul.
- Elle est **strictement** triangulaire si, en plus, sa diagonale est nulle.
- Une matrice à la fois triangulaire supérieure et inférieure est **diagonale**.

$$U = \begin{pmatrix} u_{11} & u_{12} & u_{13} \\ 0 & u_{22} & u_{23} \\ 0 & 0 & u_{33} \end{pmatrix} \qquad L = \begin{pmatrix} l_{11} & 0 & 0 \\ l_{21} & l_{22} & 0 \\ l_{31} & l_{32} & l_{33} \end{pmatrix}$$

On note traditionnellement $U$ (*upper*) la supérieure et $L$ (*lower*) l'inférieure. La transposée d'une triangulaire supérieure est triangulaire inférieure, et inversement.

### Pourquoi cette forme est précieuse

- **Déterminant** : c'est le **produit des coefficients diagonaux**, $\det(U) = u_{11} u_{22} \cdots u_{nn}$ (en développant selon la première colonne, il ne reste à chaque étape qu'un seul terme).
- **Inversibilité** : $U$ est inversible si et seulement si aucun coefficient diagonal n'est nul ; son inverse est encore triangulaire supérieure.
- **Stabilité** : le produit et la somme de deux triangulaires supérieures restent triangulaires supérieures.
- **Valeurs propres** : ce sont directement les coefficients diagonaux.
- **Systèmes linéaires** : $UX = B$ se résout par **remontée** — la dernière équation donne $x_n$, on la reporte dans l'avant-dernière, etc. — en $O(n^{2})$ opérations.

### Triangulariser une matrice $n \times n$ : le pivot de Gauss

On transforme $A$ en matrice triangulaire supérieure par des **opérations élémentaires sur les lignes**, colonne après colonne, de gauche à droite.

> [!info] Notation des opérations sur les lignes
> - $L_i$ désigne la **$i$-ème ligne** de la matrice ($L$ comme « ligne ») : $L_1$ la première, $L_2$ la deuxième, …, $L_n$ la dernière.
> - $L_i \leftarrow L_i - 2L_1$ se lit « **remplacer** la ligne $i$ par : ligne $i$ moins 2 fois la ligne 1 ». Le calcul se fait coefficient par coefficient. Par exemple, $(2,\ 5,\ 4) - 2 \cdot (1,\ 2,\ 1) = (0,\ 1,\ 2)$.
> - $L_i \leftrightarrow L_j$ se lit « **échanger** les lignes $i$ et $j$ ».
> - Les autres lignes restent inchangées.
>
> À ne pas confondre avec $L$ **sans indice**, qui désigne plus bas une matrice triangulaire inférieure (*lower*).

Pour chaque colonne $k = 1, \dots, n-1$ :

1. **Choisir le pivot** : le coefficient $a_{kk}$ de la diagonale. S'il est nul, **échanger** la ligne $L_k$ avec une ligne située en dessous dont le coefficient en colonne $k$ est non nul. Si toute la colonne est nulle sous la diagonale, passer à la colonne suivante (la matrice est alors singulière).
2. **Annuler sous le pivot** : pour chaque ligne $i > k$, effectuer
$$L_i \leftarrow L_i - \frac{a_{ik}}{a_{kk}} \, L_k$$
Le coefficient $\frac{a_{ik}}{a_{kk}}$ est le **multiplicateur** ; après l'opération, $a_{ik} = 0$.
3. Passer à la colonne suivante, en ne travaillant plus que sur la sous-matrice située en bas à droite du pivot.

Effet de chaque opération sur le déterminant, à suivre si on veut le calculer :

| Opération | Effet sur $\det$ |
|---|---|
| $L_i \leftarrow L_i + \lambda L_j$ ($i \neq j$) | inchangé |
| $L_i \leftrightarrow L_j$ (échange) | multiplié par $-1$ |
| $L_i \leftarrow \lambda L_i$ | multiplié par $\lambda$ |

D'où, si $s$ échanges de lignes ont été faits et qu'aucune ligne n'a été multipliée :
$$\det(A) = (-1)^{s} \, u_{11} u_{22} \cdots u_{nn}$$

Le coût est en $O(n^{3})$ (environ $\frac{2}{3}n^{3}$ opérations). En calcul numérique, on choisit comme pivot le coefficient de **plus grande valeur absolue** de la colonne (**pivot partiel**) pour limiter les erreurs d'arrondi. Les multiplicateurs, rangés sous la diagonale, forment une matrice $L$ telle que $A = LU$ (ou $PA = LU$ avec échanges) : c'est la **décomposition LU**.

<svg viewBox="0 0 440 200" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Triangularisation colonne par colonne : les zéros apparaissent sous la diagonale">
<defs>
<marker id="triF" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>
</defs>
<text x="16" y="22" font-size="12" fill="currentColor">chaque étape annule une colonne sous le pivot (cercle)</text>
<g font-size="14" fill="currentColor" text-anchor="middle">
<text x="30" y="70">∗</text><text x="55" y="70">∗</text><text x="80" y="70">∗</text>
<text x="30" y="100">∗</text><text x="55" y="100">∗</text><text x="80" y="100">∗</text>
<text x="30" y="130">∗</text><text x="55" y="130">∗</text><text x="80" y="130">∗</text>
<text x="55" y="165" font-size="12">A</text>
</g>
<circle cx="30" cy="65" r="10" fill="none" stroke="#4c9aff" stroke-width="1.6"/>
<line x1="100" y1="100" x2="135" y2="100" stroke="currentColor" stroke-width="1.4" marker-end="url(#triF)"/>
<g font-size="14" fill="currentColor" text-anchor="middle">
<text x="160" y="70">∗</text><text x="185" y="70">∗</text><text x="210" y="70">∗</text>
<text x="160" y="100" fill="#27ae60">0</text><text x="185" y="100">∗</text><text x="210" y="100">∗</text>
<text x="160" y="130" fill="#27ae60">0</text><text x="185" y="130">∗</text><text x="210" y="130">∗</text>
<text x="185" y="165" font-size="12">colonne 1</text>
</g>
<circle cx="185" cy="95" r="10" fill="none" stroke="#4c9aff" stroke-width="1.6"/>
<line x1="230" y1="100" x2="265" y2="100" stroke="currentColor" stroke-width="1.4" marker-end="url(#triF)"/>
<polygon points="282,52 352,52 352,122" fill="#f2994a" fill-opacity="0.15" stroke="#f2994a"/>
<g font-size="14" fill="currentColor" text-anchor="middle">
<text x="290" y="70">∗</text><text x="315" y="70">∗</text><text x="340" y="70">∗</text>
<text x="290" y="100" fill="#27ae60">0</text><text x="315" y="100">∗</text><text x="340" y="100">∗</text>
<text x="290" y="130" fill="#27ae60">0</text><text x="315" y="130" fill="#27ae60">0</text><text x="340" y="130">∗</text>
<text x="315" y="165" font-size="12">U (colonne 2)</text>
</g>
<text x="300" y="192" font-size="12" fill="#f2994a" text-anchor="middle">det = produit de la diagonale</text>
</svg>

## Exemples

### Exemple 1 — triangularisation sans échange, multiplicateurs détaillés
$$A = \begin{pmatrix} 1 & 2 & 1 \\ 2 & 5 & 4 \\ 3 & 8 & 9 \end{pmatrix}$$

On applique $L_i \leftarrow L_i - \dfrac{a_{ik}}{a_{kk}} L_k$, où $k$ est la colonne qu'on vide, $i$ la ligne qu'on modifie, et $a_{kk}$ le pivot (coefficient diagonal de la colonne $k$).

**Colonne $k = 1$** — pivot $a_{11} = 1$ (ligne 1, colonne 1). On annule les coefficients sous lui : $a_{21} = 2$ et $a_{31} = 3$.

- Ligne $i = 2$ :
  - multiplicateur : $\dfrac{a_{21}}{a_{11}} = \dfrac{2}{1} = 2$ — « combien de fois la ligne 1 faut-il retirer pour transformer le $2$ en $0$ ? »
  - opération : $L_2 \leftarrow L_2 - 2L_1$
  - calcul : $(2,\ 5,\ 4) - 2 \cdot (1,\ 2,\ 1) = (2 - 2,\ \ 5 - 4,\ \ 4 - 2) = (0,\ 1,\ 2)$
- Ligne $i = 3$ :
  - multiplicateur : $\dfrac{a_{31}}{a_{11}} = \dfrac{3}{1} = 3$
  - opération : $L_3 \leftarrow L_3 - 3L_1$
  - calcul : $(3,\ 8,\ 9) - 3 \cdot (1,\ 2,\ 1) = (3 - 3,\ \ 8 - 6,\ \ 9 - 3) = (0,\ 2,\ 6)$

$$\begin{pmatrix} 1 & 2 & 1 \\ 0 & 1 & 2 \\ 0 & 2 & 6 \end{pmatrix}$$

**Colonne $k = 2$** — pivot $a_{22} = 1$, **lu dans la matrice qu'on vient d'obtenir** (dans $A$ de départ, ce coefficient valait $5$). On annule le coefficient sous lui : $a_{32} = 2$ (il valait $8$ au départ).

- Ligne $i = 3$ :
  - multiplicateur : $\dfrac{a_{32}}{a_{22}} = \dfrac{2}{1} = 2$
  - opération : $L_3 \leftarrow L_3 - 2L_2$
  - calcul : $(0,\ 2,\ 6) - 2 \cdot (0,\ 1,\ 2) = (0 - 0,\ \ 2 - 2,\ \ 6 - 4) = (0,\ 0,\ 2)$

$$U = \begin{pmatrix} 1 & 2 & 1 \\ 0 & 1 & 2 \\ 0 & 0 & 2 \end{pmatrix}$$

Aucun échange, donc $\det(A) = 1 \cdot 1 \cdot 2 = 2$.

> [!tip] Pourquoi ce multiplicateur annule le coefficient
> Dans la colonne $k$, la nouvelle valeur est $a_{ik} - \dfrac{a_{ik}}{a_{kk}} \cdot a_{kk} = a_{ik} - a_{ik} = 0$. Ici pour $L_2$ : $2 - \dfrac{2}{1} \cdot 1 = 0$. Le multiplicateur est choisi **exactement** pour cela. Quand le pivot n'est pas $1$, la division apparaît vraiment : avec un pivot $4$ et un coefficient $6$ en dessous, le multiplicateur vaut $\frac{6}{4} = \frac{3}{2}$. Les colonnes situées avant $k$ sont déjà nulles dans les deux lignes et le restent.

### Exemple 2 — pivot nul, échange obligatoire
$$A = \begin{pmatrix} 0 & 2 & 1 \\ 1 & 1 & 1 \\ 2 & 4 & 5 \end{pmatrix}$$

Le pivot $a_{11} = 0$ : on échange $L_1 \leftrightarrow L_2$ (un échange, $s = 1$).
$$\begin{pmatrix} 1 & 1 & 1 \\ 0 & 2 & 1 \\ 2 & 4 & 5 \end{pmatrix} \xrightarrow{L_3 - 2L_1} \begin{pmatrix} 1 & 1 & 1 \\ 0 & 2 & 1 \\ 0 & 2 & 3 \end{pmatrix} \xrightarrow{L_3 - L_2} \begin{pmatrix} 1 & 1 & 1 \\ 0 & 2 & 1 \\ 0 & 0 & 2 \end{pmatrix}$$

$$\det(A) = (-1)^{1} \cdot 1 \cdot 2 \cdot 2 = -4$$

### Exemple 3 — résolution par remontée
Avec $U$ de l'exemple 1 et $B = (4,\ 3,\ 2)^{T}$ :
- ligne 3 : $2x_3 = 2 \Rightarrow x_3 = 1$
- ligne 2 : $x_2 + 2 \cdot 1 = 3 \Rightarrow x_2 = 1$
- ligne 1 : $x_1 + 2 \cdot 1 + 1 = 4 \Rightarrow x_1 = 1$

### Exemple 4 — l'algorithme en C (sans pivot partiel)
```c
/* Triangularise a[n][n] en place ; renvoie le déterminant. */
double triangulariser(int n, double a[n][n])
{
    double det = 1.0;
    for (int k = 0; k < n - 1; k++) {
        int p = k;
        while (p < n && a[p][k] == 0.0) p++;   /* chercher un pivot non nul */
        if (p == n) return 0.0;                /* colonne nulle : singulière */
        if (p != k) {                          /* échange de lignes */
            for (int j = 0; j < n; j++) { double t = a[k][j]; a[k][j] = a[p][j]; a[p][j] = t; }
            det = -det;
        }
        for (int i = k + 1; i < n; i++) {
            double m = a[i][k] / a[k][k];      /* multiplicateur */
            for (int j = k; j < n; j++) a[i][j] -= m * a[k][j];
        }
    }
    for (int k = 0; k < n; k++) det *= a[k][k];
    return det;
}
```

## Cas d'usage

- **Calculer un déterminant** $n \times n$ en $O(n^{3})$ au lieu de $O(n!)$ par cofacteurs.
- **Résoudre un système** $AX = B$ : triangulariser la matrice augmentée $(A \mid B)$, puis remonter.
- **Tester l'inversibilité** et trouver le **rang** : nombre de pivots non nuls.
- **Décomposition LU** : factoriser une fois $A$, puis résoudre rapidement pour de nombreux seconds membres.

## Avantages et limites

✅ **Avantages** :
- Méthode systématique, valable pour toute taille
- Coût polynomial $O(n^{3})$, base de toutes les bibliothèques d'algèbre linéaire

❌ **Limites** :
- Introduit des fractions dès que les pivots ne divisent pas les coefficients
- En virgule flottante, un petit pivot amplifie les erreurs : le pivot partiel est indispensable
- La forme triangulaire obtenue n'est pas unique (elle dépend des pivots et échanges choisis)

## Connexions

### Notes liées
- [[MATH - calcul du déterminant d'une matrice carrée]] - le déterminant d'une triangulaire est le produit de sa diagonale ; le pivot de Gauss en est la méthode efficace
- [[MATH - matrice inverse]] - une triangulaire est inversible ssi sa diagonale est sans zéro ; Gauss-Jordan prolonge la triangularisation jusqu'à $I_{n}$
- [[MATH - matrice transposée]] - transposer échange triangulaire supérieure et inférieure
- [[IEEE-754 - simple précision 32 bits]] - pourquoi le choix du pivot compte en virgule flottante

### Dans le contexte de
- [[MOC - Mathématiques]] - branche algèbre linéaire

## Ressources

- Source : notions de cours d'algèbre linéaire (note rédigée sur demande, 2026-10-23)

---

**Tags thématiques** : `#mathematiques` `#algebre-lineaire`
