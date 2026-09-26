---
type: permanent
created: 2026-09-26 10:40
tags:
  - permanent
  - mathematiques
  - geometrie-projective
  - 3d
---

# MATH - projection orthographique

> [!abstract] Concept
> La projection orthographique écrase l'espace sur un plan situé à la distance $f$ suivant $\vec{k}$ en suivant des rayons **parallèles** : la profondeur est remplacée par une constante, sans aucune division.

## Explication

Dans le repère $O(\vec{i}, \vec{j}, \vec{k})$, projeter orthographiquement sur le plan situé à la distance $f$ le long de $\vec{k}$ revient à conserver $x$ et $y$ et à forcer $z$ à valoir $f$. En coordonnées homogènes :

$$P_{\text{ortho}} = \begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & f \\ 0 & 0 & 0 & 1 \end{pmatrix}, \qquad P_{\text{ortho}} \begin{pmatrix} x \\ y \\ z \\ 1 \end{pmatrix} = \begin{pmatrix} x \\ y \\ f \\ 1 \end{pmatrix}$$

Deux détails sont à lire attentivement. La troisième ligne est $(0\ 0\ 0\ f)$ : le $0$ en troisième position **annule** la profondeur d'origine, et le $f$ en dernière colonne la remplace par la distance du plan — qui est portée par la coordonnée $w$, donc constante pour tous les points. La quatrième ligne reste $(0\ 0\ 0\ 1)$ : $w$ n'est pas modifié, il n'y a **pas de division**, la transformation reste affine.

La conséquence visuelle est qu'un objet garde la même taille quelle que soit sa distance à l'observateur : pas de rétrécissement, pas de point de fuite, les droites parallèles restent parallèles. Les rayons de projection sont tous parallèles à $\vec{k}$, comme un soleil à l'infini. C'est ce qui rend cette projection **mesurable** — on peut lire une longueur directement sur l'image — au prix du réalisme.

On parle de projection **isométrique** lorsqu'on oriente d'abord le repère de sorte que les trois axes fassent des angles égaux avec la direction de vue ; c'est la même matrice, précédée d'un changement de repère. Pour composer un changement de repère à la fois en translation et en rotation, on cumule simplement les matrices ; on revient en arrière en multipliant par $R_{3\times 3}^{T}$.

<svg viewBox="0 0 430 235" width="100%" style="max-width:430px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Projection orthographique : rayons parallèles vers un plan situé à la distance f">
<defs>
<marker id="ogF" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>
<marker id="ogB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker>
</defs>
<polygon points="320,42 372,24 372,196 320,214" fill="#4c9aff" fill-opacity="0.12" stroke="#4c9aff" stroke-width="1.4"/>
<text x="332" y="20" font-size="12" fill="#4c9aff">plan image</text>
<line x1="70" y1="150" x2="392" y2="150" stroke="currentColor" stroke-width="1.3" marker-end="url(#ogF)" opacity="0.75"/>
<text x="396" y="154" font-size="13" fill="currentColor" font-style="italic">k</text>
<circle cx="70" cy="150" r="3" fill="currentColor"/>
<text x="56" y="166" font-size="13" fill="currentColor" font-style="italic">O</text>
<line x1="70" y1="224" x2="344" y2="224" stroke="currentColor" stroke-width="1" opacity="0.6"/>
<line x1="70" y1="218" x2="70" y2="230" stroke="currentColor" stroke-width="1" opacity="0.6"/>
<line x1="344" y1="218" x2="344" y2="230" stroke="currentColor" stroke-width="1" opacity="0.6"/>
<text x="198" y="220" font-size="13" fill="currentColor" font-style="italic">f</text>
<circle cx="130" cy="92" r="4" fill="#f2994a"/>
<text x="112" y="84" font-size="12" fill="#f2994a">A (proche)</text>
<circle cx="240" cy="92" r="4" fill="#f2994a"/>
<text x="222" y="84" font-size="12" fill="#f2994a">B (loin)</text>
<line x1="134" y1="92" x2="330" y2="92" stroke="#f2994a" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#ogB)"/>
<line x1="244" y1="92" x2="330" y2="92" stroke="#f2994a" stroke-width="1.5" stroke-dasharray="5 4"/>
<circle cx="340" cy="92" r="4.5" fill="#27ae60"/>
<text x="348" y="88" font-size="12" fill="#27ae60">même image</text>
<text x="16" y="26" font-size="12" fill="currentColor">rayons parallèles à k : la taille ne dépend pas de la distance, z est remplacé par f</text>
<text x="16" y="44" font-size="11" fill="currentColor" opacity="0.75">pas de division par w — la transformation reste affine</text>
</svg>

## Exemples

### Exemple 1 — deux points, une seule image
Les points $(2, 3, 10)$ et $(2, 3, 500)$ se projettent tous deux en $(2, 3, f)$ : l'éloignement ne change rien, ce qui traduit la perte d'information propre à toute projection.

### Exemple 2 — chaîner repère et projection
$$M = P_{\text{ortho}} \cdot T(\vec{t}) \cdot R$$
L'objet est d'abord orienté, puis placé, puis aplati sur le plan image — le tout en une seule matrice appliquée à chaque sommet.

## Cas d'usage

- **CAO et plans techniques** : vues de face, de dessus, de côté, où les longueurs doivent rester lisibles.
- **Jeux en vue isométrique** : le rendu « 2,5D » classique, sans déformation en perspective.
- **Ombre portée d'une lumière directionnelle** : le soleil produit une projection parallèle.

## Avantages et limites

✅ **Avantages** :
- Aucune division : calcul plus rapide et numériquement stable
- Conserve parallélisme et rapports de longueurs — l'image reste mesurable
- Transformation affine, donc composable sans précaution avec les autres matrices

❌ **Limites** :
- Aucun effet de profondeur : l'image paraît irréaliste, les distances sont illisibles à l'œil
- Aucune information de profondeur conservée dans $z$, qu'il faut préserver à part pour le tampon de profondeur

## Connexions

### Notes liées
- [[MATH - projection gnomonique (perspective conique)]] - la projection concurrente, avec division par la profondeur
- [[MATH - projection (application linéaire idempotente)]] - le cadre théorique de l'écrasement sur un plan
- [[MATH - coordonnées homogènes et plan à l'infini]] - l'écriture matricielle utilisée ici
- [[MATH - matrice de transformation affine 4x4]] - la famille à laquelle elle appartient

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine
- [[PS2SDK - pipeline de rendu bas niveau]] - l'étape où cette matrice intervient

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#geometrie-projective` `#3d`
