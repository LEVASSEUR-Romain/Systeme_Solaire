# Systeme_Solaire

https://www.lesmoulinsdudev.com/canvas-html-5/
Pas compris :
Attention : les transformations du systèmes de coordonnées persistent dans le temps et se cumulent à chaque appel. Pour éviter cela, il est important de borner les transformations avec des appels aux méthodes save et restore dont les buts respectifs sont de mémoriser la configuration actuelle du contexte graphique et de la rétablir.
bug :
Animation par intervalle

Comme vu précédemment, pour animer le dessin du système solaire, il va falloir régulièrement appeler la méthode drawSolarSystem puis mettre à jour la position des planètes en appelant la méthode update.

setInterval crée un déclencheur qui exécute un traitement à intervalle régulier.

Dans le fichier draw.js, créer une méthode animate qui, toutes les 50ms, appelle la méthode drawSolarSystem suivi de la méthode update de solarSystem.sun :

bug :
Animation par requestAnimationFrame

L’animation actuelle fonctionne à partir d’un dessin réaliser à intervalle régulier. Ceci peut poser problème car nous ne savons pas combien de temps sera nécessaire à la réalisation du dit dessin. Le risque, lorsque l’on veut animer une scène avec un grand nombre d’images par seconde, est d’avoir un temps de rendu plus long que l’intervalle fixé entre deux images. Et là, c’est le drame.

Mettre animation (0)

Pas trés clair :
Voyons ce que cela donne dans notre cas :

// Prepares the drawing of the circle
context.beginPath();
context.arc(0, 0, celestialBody.radius, 0, 2 \* Math.PI);

// Creates the pattern and sets the fill style with it
const pattern = context.createPattern(celestialBody.texture, "no-repeat");
context.fillStyle = pattern;

// Computes the scale required to apply the pattern at the good dimensions
const coefEchelle = (celestialBody.radius \* 2) / celestialBody.texture.width;

// Saves the current context
context.save()

// Translates the coordinate system to the top right corner of the circle
context.translate(-celestialBody.radius, -celestialBody.radius);

// Sets the scales of the coordinate system horizontally and vertically
context.scale(coefEchelle, coefEchelle);

// Fills the previously prepared circle with the scaled pattern
context.fill();

// Restores the coordinate system to its initial state
context.restore();

    Modifiez le code de la méthode drawCelestialBody à partir des i
