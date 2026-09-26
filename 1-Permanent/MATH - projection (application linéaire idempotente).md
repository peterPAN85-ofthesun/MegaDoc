---
type: permanent
created: 2026-09-26 10:00
tags:
  - permanent
  - mathematiques
  - algebre-lineaire
  - 3d
---

# MATH - projection (application linéaire idempotente)

> [!abstract] Concept
> Une projection est une application linéaire $p$ d'un espace vectoriel dans lui-même qui vérifie $p \circ p = p$ ; elle équivaut toujours à la donnée d'une décomposition $E = F \oplus G$, où $F$ est le sous-espace sur lequel on projette et $G$ la direction le long de laquelle on écrase.

## Explication

Une projection admet deux définitions équivalentes, et c'est leur équivalence qui fait tout l'intérêt de la notion. **Définition géométrique** : on décompose $E$ en deux sous-espaces supplémentaires $E = F \oplus G$, ce qui garantit que tout vecteur $x$ s'écrit de façon **unique** $x = x' + x''$ avec $x' \in F$ et $x'' \in G$ ; la projection sur $F$ parallèlement à $G$ est l'application $x \mapsto x'$, qui garde la composante dans $F$ et jette celle dans $G$. **Définition algébrique** : $p$ est un endomorphisme idempotent, $p \circ p = p$. On passe de la seconde à la première en posant $F = \operatorname{Im} p$ et $G = \operatorname{Ker} p$.

$$p : E = F \oplus G \to E, \qquad x = x' + x'' \mapsto x'$$

L'idempotence traduit une évidence géométrique : une fois le vecteur aplati sur $F$, le réaplatir ne change plus rien. Elle a une conséquence forte — une projection est **non inversible** dès que $G \neq \{ 0 \}$ : l'information de la composante $x''$ est définitivement perdue. Pour une projection donnée $x'$, il existe une infinité d'antécédents possibles, tous alignés sur la droite (ou le sous-espace) passant par $x'$ et de direction $G$. C'est exactement ce qui se passe quand une scène 3D est projetée sur un écran : la profondeur disparaît.

Attention, le mot « projection » ne suffit pas à décrire l'opération : il faut préciser **sur quoi** et **selon quelle direction**. Projeter sur un même plan $F$ parallèlement à deux droites $G_{1}$ et $G_{2}$ différentes donne deux applications distinctes. Le cas particulier où $G = F^{\perp}$ porte un nom propre : la projection **orthogonale**, la seule qui minimise la distance entre $x$ et son image.

<svg viewBox="0 0 420 275" width="100%" style="max-width:420px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Projection d'un point x sur le plan F parallèlement à la direction G">
<defs>
<marker id="pjA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="pjB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker>
<marker id="pjC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#27ae60"/></marker>
</defs>
<polygon points="70,205 250,205 330,160 150,160" fill="#4c9aff" fill-opacity="0.10" stroke="currentColor" stroke-width="1.2" opacity="0.9"/>
<text x="332" y="152" font-size="14" fill="currentColor" font-style="italic">F</text>
<text x="300" y="228" font-size="11" fill="currentColor" opacity="0.75">plan de projection (dim 2)</text>
<line x1="218" y1="117" x2="178" y2="262" stroke="#f2994a" stroke-width="1.4" stroke-dasharray="5 4"/>
<text x="150" y="262" font-size="14" fill="#f2994a" font-style="italic">G</text>
<text x="96" y="262" font-size="11" fill="#f2994a" opacity="0.9">direction (dim 1)</text>
<line x1="200" y1="183" x2="279" y2="77" stroke="#4c9aff" stroke-width="2" marker-end="url(#pjA)"/>
<text x="286" y="70" font-size="14" fill="#4c9aff" font-style="italic">x</text>
<line x1="200" y1="183" x2="249" y2="183" stroke="#27ae60" stroke-width="2.4" marker-end="url(#pjC)"/>
<text x="243" y="200" font-size="14" fill="#27ae60" font-style="italic">x'</text>
<line x1="285" y1="70" x2="256" y2="178" stroke="#f2994a" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#pjB)"/>
<text x="292" y="128" font-size="14" fill="#f2994a" font-style="italic">x''</text>
<circle cx="200" cy="183" r="3" fill="currentColor"/>
<text x="186" y="199" font-size="13" fill="currentColor" font-style="italic">O</text>
<circle cx="254" cy="183" r="3" fill="#27ae60"/>
<circle cx="285" cy="70" r="3" fill="#4c9aff"/>
<text x="16" y="30" font-size="12" fill="currentColor">x = x' + x''  ↦  x'   :  on garde la composante dans F, on jette celle dans G</text>
<text x="16" y="48" font-size="11" fill="currentColor" opacity="0.75">tout point de la droite orange a la même image x' — la projection n'est pas inversible</text>
</svg>

## Exemples

### Exemple 1 — l'ombre au sol
Le soleil très haut projette un objet sur le sol : $F$ est le plan du sol, $G$ la direction des rayons. Deux points situés sur un même rayon ont la même ombre — la projection n'est pas injective. Si le soleil est à la verticale, la projection est orthogonale.

### Exemple 2 — la matrice la plus simple
Dans la base canonique de $\mathbb{R}^{3}$, la projection sur le plan $(i, j)$ parallèlement à $k$ s'écrit :

$$P = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 0 \end{pmatrix}, \qquad P^2 = P$$

Elle envoie $(x, y, z)$ sur $(x, y, 0)$. Son déterminant est nul : aucune matrice ne peut la défaire.

## Cas d'usage

- **Rendu 3D** : toute image de synthèse est une projection de l'espace sur le plan de l'écran, orthographique ou gnomonique.
- **Moindres carrés** : la meilleure approximation d'un vecteur par un sous-espace est sa projection orthogonale sur ce sous-espace.
- **Décomposition de signal** : isoler une composante (une fréquence, un mode propre) revient à projeter sur le sous-espace correspondant.

## Avantages et limites

✅ **Avantages** :
- Un seul critère algébrique ($p^{2} = p$) suffit à reconnaître une projection
- Se compose avec les autres transformations linéaires sous forme matricielle

❌ **Limites** :
- Opération destructrice : non inversible, $\det = 0$ dès que la direction n'est pas triviale
- Nécessite de fixer deux données (sous-espace **et** direction), souvent implicite dans les énoncés

## Connexions

### Notes liées
- [[MATH - idempotence]] - la propriété algébrique qui caractérise les projections
- [[MATH - somme directe et sous-espaces supplémentaires]] - la décomposition $E = F \oplus G$ qui rend l'écriture unique
- [[MATH - projection orthographique]] - le cas où la direction est perpendiculaire au plan
- [[MATH - projection gnomonique (perspective conique)]] - la projection du rendu réaliste, non linéaire en cartésien

### Dans le contexte de
- [[MATH - coordonnées homogènes et plan à l'infini]] - le cadre où ces projections deviennent des matrices
- [[MOC - Mathématiques]] - fait partie de ce domaine

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#algebre-lineaire` `#3d`
