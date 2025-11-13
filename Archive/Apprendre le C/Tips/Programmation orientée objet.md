
CF : 
- https://chgi.developpez.com/c/objet/
- https://c.developpez.com/cours/introduction-programmation-orientee-objet-c/#LII-A
- https://emmanuel-delahaye.developpez.com/tutoriels/c/types-abstraits-donnees-c/

Le langage C n'est pas développé à l'origine pour de la programmation orientée objet. On peut cependant s'en rapprocher à partir d'une structure (voir [[Les Bases#13 - Définir une structure]])

Pour rappel, une classe est un *"type"* de variable dans laquelle on défini :
- des attributs (des variables associée à la classe)
- des méthodes (des fonctions associée à la classe)


# Règles 

Quelques règles à respecter :
- Les méthodes seront des **pointeurs de fonctions** définie dans la structure ciblant des fonctions publiques
-  Toutes les fonctions publiques devront faire référence à une structure du langage C = `struct`. Par convention, on nommera toujours ce pointeur :`This`
- À l'utilisation de la classe, on utilisera jamais directement les fonctions publiques
- À l'utilisation de la classe, on accédera jamais directement aux attributs. Il faudra créer alors des méthodes spécifiques à cet effet
- Pour éviter les redondances, on préfixera les fonctions publiques avec le nom de la classe pour laquelle elles ont été construites
- il faut créer une méthode *constructeur* et *destructeur* qui, respectivement, initialise et renvoie le pointeur de l'objet, puis libère la mémoire à sa destruction.


# Exemple


Nous avons un stylo défini par:
- Sa couleur (attribut)


