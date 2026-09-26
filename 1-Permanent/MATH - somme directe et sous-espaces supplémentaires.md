---
type: permanent
created: 2026-09-26 10:10
tags:
  - permanent
  - mathematiques
  - algebre-lineaire
---

# MATH - somme directe et sous-espaces supplémentaires

> [!abstract] Concept
> $E = F \oplus G$ signifie que tout vecteur de $E$ s'écrit de manière **unique** comme somme d'un vecteur de $F$ et d'un vecteur de $G$ ; c'est cette unicité qui permet de définir une projection.

## Explication

Deux sous-espaces $F$ et $G$ de $E$ sont **supplémentaires** quand ils vérifient simultanément deux conditions : ils engendrent tout l'espace ($F + G = E$) et ils ne se recouvrent qu'en l'origine ($F \cap G = \{ 0 \}$). La première assure l'**existence** de la décomposition $x = x' + x''$, la seconde son **unicité** — s'il existait un vecteur non nul commun aux deux, on pourrait l'ajouter à $x'$ et le retrancher à $x''$ sans changer la somme.

En dimension finie, cela impose une contrainte de comptage immédiate : $\dim F + \dim G = \dim E$. Dans $\mathbb{R}^{3}$, les seuls couples supplémentaires possibles sont donc **un plan et une droite** (2 + 1 = 3), ou l'espace entier et $\{ 0 \}$. Deux plans ne peuvent pas être supplémentaires : leur intersection est au minimum une droite, et la décomposition ne serait pas unique. Deux droites non plus : elles n'engendrent qu'un plan.

Géométriquement, l'origine $O$ est le point de référence commun aux deux sous-espaces — le seul point qu'ils partagent. C'est autour de lui que s'articule le « glissement » du point $x$ vers sa projection $x'$ : on suit la direction $G$ depuis $x$ jusqu'à rencontrer $F$, et la supplémentarité garantit qu'on la rencontre en un point et un seul.

Attention au vocabulaire : **supplémentaire** (deux sous-espaces qui se complètent dans $E$) n'est pas **complémentaire** (au sens ensembliste, qui ne donne pas un sous-espace), et un sous-espace admet en général une **infinité** de supplémentaires — un plan de $\mathbb{R}^{3}$ est supplémentaire de n'importe quelle droite qui ne lui appartient pas.

<svg viewBox="0 0 420 265" width="100%" style="max-width:420px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Somme directe d'un plan et d'une droite dans l'espace de dimension 3">
<defs>
<marker id="sdA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="sdB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker>
</defs>
<polygon points="60,200 240,200 330,150 150,150" fill="#4c9aff" fill-opacity="0.10" stroke="#4c9aff" stroke-width="1.4"/>
<text x="336" y="144" font-size="14" fill="#4c9aff" font-style="italic">F</text>
<text x="336" y="160" font-size="11" fill="#4c9aff" opacity="0.85">dim 2</text>
<line x1="195" y1="60" x2="195" y2="250" stroke="#f2994a" stroke-width="2"/>
<text x="202" y="70" font-size="14" fill="#f2994a" font-style="italic">G</text>
<text x="202" y="86" font-size="11" fill="#f2994a" opacity="0.85">dim 1</text>
<circle cx="195" cy="175" r="4.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="150" y="172" font-size="13" fill="currentColor" font-style="italic">O</text>
<text x="132" y="188" font-size="11" fill="currentColor" opacity="0.8">F ∩ G = {0}</text>
<line x1="195" y1="175" x2="296" y2="120" stroke="currentColor" stroke-width="1.8" marker-end="url(#sdA)"/>
<text x="300" y="114" font-size="13" fill="currentColor" font-style="italic">x</text>
<line x1="195" y1="175" x2="258" y2="141" stroke="#4c9aff" stroke-width="2.4" marker-end="url(#sdA)"/>
<text x="238" y="158" font-size="13" fill="#4c9aff" font-style="italic">x'</text>
<line x1="258" y1="141" x2="296" y2="120" stroke="#f2994a" stroke-width="2.4" stroke-dasharray="4 3" marker-end="url(#sdB)"/>
<text x="280" y="140" font-size="13" fill="#f2994a" font-style="italic">x''</text>
<text x="16" y="28" font-size="12" fill="currentColor">E = F ⊕ G   avec   dim F + dim G = dim E   :   2 + 1 = 3</text>
<text x="16" y="46" font-size="11" fill="currentColor" opacity="0.75">deux plans ne peuvent pas être supplémentaires : leur intersection serait une droite</text>
</svg>

## Exemples

### Exemple 1 — dans $\mathbb{R}^{3}$
$F$ = plan $(i, j)$, $G$ = droite portée par $k$. Le vecteur $(3, 5, 7)$ se décompose en $(3, 5, 0) + (0, 0, 7)$, et d'aucune autre façon. Si l'on prend pour $G$ la droite portée par $(0, 0, 1) + (1, 0, 0)$, la décomposition change, mais elle reste unique.

### Exemple 2 — un contre-exemple
$F$ et $G$ deux plans distincts de $\mathbb{R}^{3}$ : leur somme vaut bien $E$, mais leur intersection est une droite $D$. Pour $d \in D$ non nul, $x = (x' + d) + (x'' - d)$ est une autre décomposition valable : pas d'unicité, donc pas de projection bien définie.

## Cas d'usage

- **Définir une projection** : toute projection est la donnée d'une somme directe, et réciproquement.
- **Vérifier une décomposition 3D** : le test $\dim F + \dim G = \dim E$ élimine immédiatement les couples impossibles.
- **Diagonalisation** : un endomorphisme est diagonalisable si et seulement si l'espace est somme directe de ses sous-espaces propres.

## Connexions

### Notes liées
- [[MATH - projection (application linéaire idempotente)]] - la construction que cette décomposition rend possible
- [[MATH - idempotence]] - la traduction algébrique de la même situation
- [[MATH - coordonnées homogènes et plan à l'infini]] - autre découpage de l'espace, entre points affines et directions

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#algebre-lineaire`
