---
type: moc
created: 2026-09-26 11:45
tags:
  - moc
  - index
  - mathematiques
---

# 🗺️ MOC - Mathématiques

> [!note] Vue d'ensemble
> Carte de toutes les notions mathématiques du vault, toutes branches confondues. Le domaine le plus développé à ce jour est la géométrie de l'espace et ses applications au rendu 3D (projections, transformations, rotations) ; les autres branches s'ajouteront ici au fil des lectures.

## 🧱 Algèbre linéaire

Les briques de base : espaces, décompositions, applications qui les transforment.

- [[MATH - somme directe et sous-espaces supplémentaires]] - `E = F ⊕ G`, l'unicité de la décomposition
- [[MATH - projection (application linéaire idempotente)]] - écraser l'espace sur un sous-espace, selon une direction
- [[MATH - idempotence]] - `f ∘ f = f`, la propriété qui caractérise les projections
- [[MATH - matrice orthogonale (inverse par transposition)]] - `A · Aᵀ = Iₙ`, l'inversion gratuite

## 📐 Géométrie vectorielle

Les deux produits fondamentaux de l'espace de dimension 3.

- [[MATH - produit scalaire]] - mesure l'alignement, donne un nombre
- [[MATH - produit vectoriel]] - mesure l'orthogonalité, donne un vecteur et une aire

## 🎥 Géométrie projective et transformations

Le cadre unifié du rendu 3D : une seule algèbre matricielle pour tout déplacer.

- [[MATH - coordonnées homogènes et plan à l'infini]] - la 4ᵉ coordonnée `w` et les points à l'infini
- [[MATH - matrice de transformation affine 4x4]] - la structure en blocs `R | t` et la ligne `(0 0 0 1)`
- [[MATH - matrice de translation homogène]] - transformer une addition en produit matriciel
- [[MATH - projection orthographique]] - rayons parallèles, image mesurable
- [[MATH - projection gnomonique (perspective conique)]] - rayons concourants, effet de perspective

## 🔄 Rotations dans l'espace

Trois représentations concurrentes du même objet géométrique, chacune avec ses compromis.

- [[MATH - matrices de rotation autour des axes]] - `Rᵢ(α)`, `Rⱼ(β)`, `Rₖ(γ)` et leur non-commutativité
- [[MATH - angles d'Euler]] - précession, nutation, rotation propre — et le blocage de cardan
- [[MATH - rotation par conjugaison de quaternion]] - `v' = q v q⁻¹`, sans blocage de cardan
- [[MATH - quaternion vs matrice de rotation (coûts)]] - le décompte d'opérations qui tranche le choix

## 🧮 Algèbre des quaternions

- [[MATH - quaternion (définition et structure)]] - `i² = j² = k² = ijk = −1`, partie réelle et partie vectorielle
- [[MATH - hiérarchie des algèbres R C H O]] - ce qu'on gagne et ce qu'on perd à chaque doublement
- [[MATH - produit de Hamilton]] - produit scalaire et produit vectoriel réunis en une formule
- [[MATH - conjugué, norme et inverse d'un quaternion]] - `q*`, `‖q‖` et `q⁻¹`

## 🔢 Représentation numérique

- [[IEEE-754 - simple précision 32 bits]] - comment un réel est réellement stocké
- [[PS2 - fixed-point 12.4 des coordonnées]] - l'alternative en virgule fixe, côté matériel

## 🔗 MOCs connexes

- [[MOC - PS2 Homebrew]] - le pipeline de rendu qui consomme ces matrices
- [[MOC - Godot]] - rotations et transformations vues depuis un moteur de jeu
- [[MOC - Obsidian]] - dont [[OBSIDIAN - plugin LaTeX Suite (usage et raccourcis)]], pour saisir ces formules vite

## 📖 Ressources

- Source principale : [[Projecteur (Mathématiques)]]
- Les formules sont écrites en LaTeX (MathJax) ; les schémas sont des SVG inline, lisibles en thème clair comme sombre

## 🚧 À développer

Branches encore absentes du vault, à alimenter au fil des besoins :

- [ ] **Algèbre linéaire** : déterminant, diagonalisation, valeurs et vecteurs propres, décomposition SVD
- [ ] **Géométrie** : coniques, courbes de Bézier et splines, intersections rayon-objet (raytracing)
- [ ] **Analyse** : dérivées et gradient, intégration, développements limités, séries de Fourier
- [ ] **Probabilités et statistiques** : lois usuelles, espérance et variance, méthodes de Monte-Carlo
- [ ] **Arithmétique et logique** : modulo, nombres premiers, algèbre de Boole
- [ ] **Interpolation d'orientations** : slerp, comparaison avec l'interpolation linéaire

---

**Dernière mise à jour** : 2026-09-26
**Nombre de notes** : 21
