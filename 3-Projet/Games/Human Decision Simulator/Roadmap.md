# Roadmap - Human Decision Simulator

## Analyse des besoins

### 1. Systèmes de jeu principaux

#### Phase Simulateur de vie (Early Game)
- **Système de personnage**
  - Gestion des besoins vitaux (faim, sommeil, social)
  - Système d'inventaire personnel
  - Compétences et progression
  - Relations interpersonnelles avec NPCs

- **Système d'emploi du temps**
  - Routine quotidienne avec objectifs obligatoires
  - Gestion du temps (travail/loisirs)
  - Système de pénalités si objectifs non remplis

- **Système de réputation**
  - Jauge de confiance avec différents groupes sociaux
  - Système de fidélité (NPCs fidèles au joueur)
  - Impact des actions sur la réputation

#### Phase Gestion (Mid to Late Game)
- **Système de gouvernance**
  - Modification des règles de la civilisation
  - Gestion des classes sociales
  - Système économique (impôts, redistribution)
  - Organisation du pouvoir

- **Système de conséquences**
  - Mécontentement populaire
  - Risques d'effondrement économique
  - Gestion des révolutions/révoltes
  - Relations diplomatiques (si départ avec groupe fidèle)

- **Transition progressive**
  - Déblocage graduel des outils de gestion
  - Interface évolutive selon la progression

#### Système de succession
- **Héritage**
  - Choix du successeur
  - Transmission de l'état de la civilisation
  - Continuité du gameplay avec nouveau personnage

### 2. Systèmes procéduraux et de génération

- **Génération de civilisation**
  - Paramètres configurables au début :
    - Organisation du pouvoir
    - Classes sociales et conditions de vie
    - Mobilité sociale
    - Modèle économique
    - Croyances et culture
  - Génération aléatoire possible

- **Génération de NPCs**
  - Personnalités diverses
  - Rôles sociaux
  - Relations familiales et sociales

### 3. Besoins techniques

#### Gameplay et Mécanique
- [ ] Système de mouvement 3D dans environnement
- [ ] Interaction avec objets et NPCs
- [ ] UI pour simulateur de vie (besoins, objectifs)
- [ ] UI pour gestion de civilisation
- [ ] Système de dialogue
- [ ] Tutoriel intégré (apprentissage des règles)
- [ ] Système de sauvegarde/chargement
- [ ] Gestion du cycle jour/nuit
- [ ] Système météo/saisons (optionnel)

#### Intelligence Artificielle
- [ ] IA pour NPCs (routines quotidiennes)
- [ ] IA pour simulation économique
- [ ] Système de réaction aux changements de règles
- [ ] Système de propagation du mécontentement

#### Assets 3D et Graphismes
- [ ] Modèles de personnages (différentes classes sociales)
- [ ] Animations de personnages
- [ ] Bâtiments et structures
- [ ] Intérieurs de maisons
- [ ] Props et objets interactifs
- [ ] Environnement (terrain, végétation)
- [ ] UI/UX design

#### Audio
- [ ] Musique d'ambiance
- [ ] Effets sonores
- [ ] Voix (optionnel)

---

## Phase de développement

### Phase 1 : Prototype Core (3-6 mois)
**Objectif** : Valider les mécaniques de base du simulateur de vie

- [ ] Setup projet Godot
- [ ] Création d'un personnage jouable basique
- [ ] Environnement de test (maison simple)
- [ ] Système de besoins vitaux
- [ ] Système d'emploi du temps simple
- [ ] 3-5 NPCs avec routine basique
- [ ] Système de réputation minimal
- [ ] Interface utilisateur basique

**Livrables** :
- Prototype jouable avec un cycle jour/nuit
- Pouvoir accomplir des tâches quotidiennes
- Interaction basique avec NPCs

### Phase 2 : Système Social et Réputation (2-4 mois)
**Objectif** : Enrichir les interactions sociales

- [ ] Système de dialogue étendu
- [ ] Relations interpersonnelles complexes
- [ ] Système de classes sociales
- [ ] Mobilité sociale
- [ ] Objectifs secondaires pour progression
- [ ] Expansion des NPCs (15-20)
- [ ] Environnement élargi (plusieurs bâtiments)

**Livrables** :
- Pouvoir gravir les échelons sociaux
- Relations dynamiques avec NPCs
- Première version du tutoriel intégré

### Phase 3 : Transition vers la Gestion (3-6 mois)
**Objectif** : Implémenter les mécaniques de gestion

- [ ] Interface de gestion de civilisation
- [ ] Système économique
  - Impôts
  - Redistribution
  - Ressources
- [ ] Système de modification des règles
- [ ] Système de conséquences
- [ ] Simulation de mécontentement
- [ ] Événements aléatoires
- [ ] Système de révolution

**Livrables** :
- Transition fluide du simulateur vers gestion
- Pouvoir modifier les règles et voir les conséquences
- Système économique fonctionnel

### Phase 4 : Paramétrage et Génération (2-3 mois)
**Objectif** : Variabilité et rejouabilité

- [ ] Écran de configuration initial
- [ ] Génération procédurale de civilisations
- [ ] Système de templates pour différentes civilisations
- [ ] Variabilité des croyances et cultures
- [ ] Événements culturels (fêtes, rituels)

**Livrables** :
- Possibilité de créer différentes civilisations
- Rejouabilité accrue

### Phase 5 : Système de Succession (2-3 mois)
**Objectif** : Continuité intergénérationnelle

- [ ] Système de vieillissement
- [ ] Choix du successeur
- [ ] Héritage des paramètres de civilisation
- [ ] Transition de personnage
- [ ] Sauvegarde de l'historique

**Livrables** :
- Pouvoir jouer plusieurs générations
- Continuité narrative et gameplay

### Phase 6 : Polish et Contenu (3-6 mois)
**Objectif** : Finalisation du jeu

- [ ] Assets 3D finaux (Blender)
  - Personnages détaillés
  - Environnements complets
  - Animations polies
- [ ] Audio complet
- [ ] Tutoriel finalisé
- [ ] Équilibrage gameplay
- [ ] Optimisation performance
- [ ] Tests et debug
- [ ] Localisation (optionnel)

**Livrables** :
- Jeu complet et poli
- Version alpha testable

### Phase 7 : Test et Release (2-3 mois)
- [ ] Alpha testing
- [ ] Beta testing
- [ ] Corrections bugs
- [ ] Marketing et communication
- [ ] Release

---

## Compétences requises

### Essentielles
- **Programmation Godot (GDScript/C#)**
- **Modélisation 3D (Blender)**
- **Game Design**
- **UI/UX Design**

### Souhaitables
- Design de systèmes complexes
- Économie de jeu
- Sound design
- Animation 3D
- Narrative design

---

## Technologies

- **Engine** : Godot 4.x
- **3D** : Blender 3.x+
- **Versioning** : Git
- **Assets Audio** : Audacity / DAW
- **Gestion projet** : Trello / GitHub Projects

---

## Risques et défis

1. **Complexité de la transition** : Le passage du simulateur à la gestion doit être fluide
2. **Équilibrage** : Système économique et social difficile à équilibrer
3. **Scope creep** : Risque d'ajouter trop de features
4. **Performance** : Simulation de nombreux NPCs peut être coûteuse
5. **Rejouabilité** : Assurer que chaque partie soit unique et intéressante

---

## Estimation totale

**Développement solo** : 18-30 mois
**Petit team (2-3 personnes)** : 12-18 mois

---

## Prochaines étapes immédiates

1. Apprendre/maîtriser Godot si nécessaire
2. Créer un Game Design Document détaillé
3. Prototype papier des mécaniques de base
4. Commencer Phase 1 avec assets placeholder
5. Itérer rapidement sur le prototype
