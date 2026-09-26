---
type: permanent
created: 2026-09-25 11:30
tags:
  - permanent
  - obsidian
  - latex
  - prise-de-notes
---

# OBSIDIAN - plugin LaTeX Suite (usage et raccourcis)

> [!abstract] Concept
> Plugin Obsidian qui rend la frappe de mathématiques LaTeX aussi rapide que l'écriture manuscrite, grâce à des **snippets contextuels** à expansion automatique complétés par des aides à la navigation et à la lecture des équations.

## Explication

Écrire `\frac{\partial f}{\partial x}` demande une trentaine de frappes là où la main trace six symboles : prendre des notes de maths en LaTeX est normalement plus lent qu'au stylo. LaTeX Suite supprime cet écart avec un moteur d'**expansion de texte** — on tape `par`, <kbd>Tab</kbd>, et la structure complète apparaît avec le curseur déjà dans le premier trou à remplir. Le plugin est un portage de l'approche UltiSnips popularisée par Gilles Castel, qui suivait ses cours en tapant le LaTeX en direct.

Ce qui le distingue d'un correcteur automatique, c'est le **contexte** : chaque snippet déclare où il a le droit de se déclencher (maths en ligne, bloc `$$`, texte, code). Taper `sr` dans un paragraphe n'a aucun effet ; dans une équation, cela produit `^{2}`. C'est cette conditionnalité qui rend l'expansion sans validation supportable au quotidien. Un snippet est un objet JavaScript `{trigger, replacement, options}` — les options les plus utiles étant `m` (maths), `A` (auto, sans <kbd>Tab</kbd>), `w` (frontière de mot, évite les déclenchements au milieu d'un mot) et `v` (sur une sélection). ⚠️ Ces fichiers étant du **JavaScript exécuté**, un snippet importé d'un tiers peut exécuter du code arbitraire : relire avant de coller, et sortir ses snippets d'un vault partagé.

Règle transversale à retenir : <kbd>Tab</kbd> signifie toujours « j'en ai fini ici, avance » — valider un snippet, passer au trou suivant, sortir d'une accolade, sortir de l'équation, insérer un `&` dans une matrice. C'est la clé de l'ergonomie du plugin, et sa principale source de confusion au début.

## Raccourcis essentiels

### Structures et décorations

| Trigger | Replacement |
| --- | --- |
| `mk` | `$ $` |
| `dm` | `$$` <br><br> `$$` |
| `sr` | `^{2}` |
| `cb` | `^{3}` |
| `rd` | `^{ }` |
| `_` | `_{ }` |
| `sq` | `\sqrt{ }` |
| `x/y` <kbd>Tab</kbd> | `\frac{x}{y}` |
| `//` | `\frac{ }{ }` |
| `"` | `\text{ }` |
| `text` | `\text{ }` |
| `x1` | `x_{1}` |
| `x,.` | `\mathbf{x}` |
| `x.,` | `\mathbf{x}` |
| `xdot` | `\dot{x}` |
| `xhat` | `\hat{x}` |
| `xbar` | `\bar{x}` |
| `xvec` | `\vec{x}` |
| `xtilde` | `\tilde{x}` |
| `xund` | `\underline{x}` |
| `ee` | `e^{ }` |
| `invs` | `^{-1}` |

Les décorations s'écrivent **après** le symbole (`x` puis `dot`), ce qui permet d'avancer sans jamais revenir en arrière. **Tout snippet qui place le curseur entre accolades `{}` se quitte par <kbd>Tab</kbd>.**

### Lettres grecques

| Trigger | Replacement | Trigger | Replacement |
| --- | --- | --- | --- |
| `@a` | `\alpha` | `eta` | `\eta` |
| `@b` | `\beta` | `mu` | `\mu` |
| `@g` | `\gamma` | `nu` | `\nu` |
| `@G` | `\Gamma` | `xi` | `\xi` |
| `@d` | `\delta` | `Xi` | `\Xi` |
| `@D` | `\Delta` | `pi` | `\pi` |
| `@e` | `\epsilon` | `Pi` | `\Pi` |
| `:e` | `\varepsilon` | `rho` | `\rho` |
| `@z` | `\zeta` | `tau` | `\tau` |
| `@t` | `\theta` | `phi` | `\phi` |
| `@T` | `\Theta` | `Phi` | `\Phi` |
| `@k` | `\kappa` | `chi` | `\chi` |
| `@l` | `\lambda` | `psi` | `\psi` |
| `@L` | `\Lambda` | `Psi` | `\Psi` |
| `@s` | `\sigma` | | |
| `@S` | `\Sigma` | | |
| `@o` | `\omega` | | |
| `ome` | `\omega` | | |

Deux règles suffisent : les lettres grecques à nom court (2-3 caractères) se tapent telles quelles (`pi`, `mu`, `chi`, `eta`) ; les autres prennent le préfixe `@`, et **la casse du caractère après `@` sélectionne la capitale** (`@d` → `\delta`, `@D` → `\Delta`). Les variantes ont leur propre préfixe : `:e` → `\varepsilon`.

### Sélection et navigation

| Geste | Effet |
| --- | --- |
| sélection + `U` | `\underbrace{ }` |
| sélection + `O` | `\overbrace{ }` |
| sélection + `C` | `\cancel{ }` |
| sélection + `K` | `\cancelto{ }{ }` |
| sélection + `B` | `\underset{ }{ }` |
| <kbd>Tab</kbd> en fin d'équation | sort des `$` |
| <kbd>Tab</kbd> dans `\left … \right` | saute après le `\right` et son délimiteur |
| <kbd>Tab</kbd> sinon | avance au prochain fermant `)` `]` `}` `\rangle` `\rvert` |
| <kbd>Tab</kbd> dans `matrix`/`align`/`cases` | insère `&` |
| <kbd>Entrée</kbd> dans ces environnements | insère `\\` et passe à la ligne |
| <kbd>Maj+Entrée</kbd> | fin de la ligne suivante — sert à sortir de la structure |

## Autres fonctionnalités

- **Auto-fraction** : taper `/` capture rétroactivement l'expression précédente comme numérateur, parenthèses imbriquées comprises — `(a + b(c + d))/` → `\frac{a + b(c + d)}{ }`.
- **Agrandissement automatique des délimiteurs** : un snippet qui insère `\sum`, `\int` ou `\frac` convertit les parenthèses englobantes en `\left … \right`, à la bonne hauteur.
- **Conceal** *(à activer dans les réglages)* : affiche `ẋ² + ẏ²` à la place de `\dot{x}^{2} + \dot{y}^{2}` sans modifier le fichier ; le LaTeX réapparaît au passage du curseur, avec un délai réglable. Nécessite une police monospace couvrant ces symboles — `JuliaMono` est la référence.
- **Aperçu des maths en ligne** : popup de rendu de la formule où se trouve le curseur, sans basculer en mode lecture.
- **Coloration des paires de délimiteurs** : même couleur par paire, surlignage du jumeau et du niveau englobant — de quoi repérer l'accolade manquante d'un coup d'œil.
- **Commandes de la palette** : *Box current equation* (`\boxed{ … }`) et *Select current equation*, assignables à un raccourci clavier.

## Exemples

### Exemple 1 — la séquence d'amorçage
```
dm                    →  $$  $$   (mode display, curseur au milieu)
xsr                   →  x^{2}
x/y  <Tab>            →  \frac{x}{y}
sin @t                →  \sin \theta
```

### Exemple 2 — une intégrale en quinze frappes
```
dint <Tab> 2pi <Tab> sin @t <Tab> @t <Tab>
→  \int_{0}^{2\pi} \sin \theta \, d\theta
```

### Exemple 3 — une matrice comme dans un tableur
```
1 <Tab> 2 <Entrée> 3 <Tab> 4 <Maj+Entrée>
→  1 & 2 \\
   3 & 4
```

## Cas d'usage

- **Prise de notes de cours en direct** : suivre un cours de maths en tapant le LaTeX plutôt qu'en photographiant le tableau.
- **Rédaction de démonstrations** : enchaîner les lignes d'un `align` sans jamais écrire `&` ni `\\` à la main.
- **Relecture d'un document dense** : activer le conceal pour parcourir un fichier d'équations en mode source comme s'il était rendu.

## Avantages et limites

✅ **Avantages** :
- Réduit d'un ordre de grandeur le nombre de frappes pour une expression courante
- Conventions régulières (`@` + initiale, majuscule = capitale, suffixe = décoration) qui se déduisent plutôt qu'elles ne se mémorisent
- Jeu de snippets entièrement redéfinissable ; le fichier par défaut n'est qu'un point de départ
- Corrige au passage des erreurs typographiques classiques (délimiteurs non agrandis, séparateurs de matrice oubliés)

❌ **Limites** :
- Courbe d'apprentissage réelle : le gain n'arrive que quand les déclencheurs sont devenus des réflexes moteurs
- L'expansion automatique (`A`) est peu fiable avec les claviers IME (pinyin, gboard, claviers à diacritiques)
- Les fichiers de snippets sont du JavaScript exécuté : risque d'exécution de code à l'import ou au partage du vault
- Le conceal dépend d'une police couvrant les symboles, sans quoi des glyphes manquants remplacent les formules
- Ne gère que la saisie : le rendu reste celui de MathJax dans Obsidian, pas d'une compilation LaTeX réelle

## Connexions
### Notes liées
- [[MOC - Obsidian]] - la carte du domaine, section Plugins
- [[Projecteur (Mathématiques)]] - type de note de cours que ce plugin sert à produire
- [[CLAUDE CODE - Agents Zettelkasten]] - l'autre couche d'outillage du vault, côté traitement des notes plutôt que saisie
- [[MOC - Claude Code & IA]] - outillage complémentaire autour du même vault

### Contexte
LaTeX Suite est à Obsidian ce qu'UltiSnips et LuaSnip sont à Vim/Neovim : un moteur de snippets spécialisé, préréglé pour les mathématiques. Le filtrage contextuel repose sur l'arbre syntaxique de CodeMirror, l'éditeur sous-jacent d'Obsidian.

## Ressources
- Source : [[Obsidian Latex Suite]]
- Dépôt : https://github.com/artisticat1/obsidian-latex-suite
- Snippets par défaut : `src/default_snippets.js` — regex et fonctions documentées dans `DOCS.md`
- Gilles Castel, prise de notes en LaTeX : https://castel.dev/post/lecture-notes-1/
- Police JuliaMono : https://juliamono.netlify.app/

---
**Tags thématiques** : #obsidian #latex #snippets #prise-de-notes
