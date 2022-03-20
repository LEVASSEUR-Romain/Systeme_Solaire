const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
function drawSquare() {
  context.beginPath();
  context.rect(0, 0, 100, 100);
  context.fillStyle = "#ff0000";
  context.fill();
}
window.addEventListener("load", async () => {
  await solarSystem.sun.initTexture();
  resize();
  animate(0);
});
function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  drawSolarSystem(solarSystem.sun);
}
window.addEventListener("resize", () => {
  resize();
});

function drawSolarSystem() {
  context.save();
  context.translate(canvas.width / 2, canvas.height / 2);
  drawCelestialBody(solarSystem.sun);
  context.restore();
}

function drawCelestialBody(celestialBody) {
  //Saves the context in its current state [*0]
  context.save();

  context.rotate(celestialBody.orbitalAngle);

  //Translates the coordinate system with the vector (celestialBody.distance ; 0)
  context.translate(celestialBody.distance, 0);

  if (celestialBody.hasShadow) {
    //Draws a black disque which will be the shadowed part of the planet
    context.beginPath();
    context.arc(0, 0, celestialBody.radius, 0, 2 * Math.PI);
    context.fillStyle = "#000000";
    context.fill();

    //Saves the current context [*1]
    context.save();

    //Prepares the drawing of the mask
    context.beginPath();
    context.arc(
      -celestialBody.radius * 2,
      0,
      celestialBody.radius * 2,
      0,
      2 * Math.PI
    );
    /*     // Enregistrez le contexte actuel, préparez le dessin d’un cercle de la taille de la planète et activez le masque.
    context.save();
    //  Créez un dégradé radial transparent au centre et noir sur le pourtour. Les coordonnées du dégradé devront correspondre à celles du masque qui a permis de créer la face éclairée de la planète
    const grd = context.createRadialGradient(
      0,
      0,
      1,
      celestialBody.radius,
      0,
      2 * Math.PI
    );
    grd.addColorStop(0, "white");
    grd.addColorStop(1, "black");
    context.fillStyle = grd;
    context.fill();
    context.restore(); */
    //Create a mask from the previous prepared drawing
    context.clip();
  }

  //Starts the drawing
  context.beginPath();

  //Prepare the drawing of a complete circle
  context.arc(0, 0, celestialBody.radius, 0, 2 * Math.PI);

  //Creates a pattern from the texture of the celestial body
  const pattern = context.createPattern(celestialBody.texture, "no-repeat");
  const coef = (celestialBody.radius * 2) / celestialBody.texture.width;

  //Saves the current context [*2]
  context.save();

  //Rotates the celestial body on its own axis
  context.rotate(celestialBody.rotationAngle);

  //Moves and scales the coordinate system to apply the pattern
  context.translate(-celestialBody.radius, -celestialBody.radius);
  context.scale(coef, coef);

  //Sets the filling color
  context.fillStyle = pattern; //celestialBody.color;

  //Fills the circle
  context.fill();

  //Restores the context [*2]
  context.restore();

  if (celestialBody.hasShadow) {
    //Restores the context and disable the mask [*1]
    context.restore();
  }

  //Draws each satellite of the celestial body
  celestialBody.satellites.forEach((satellite) => {
    drawOrbit(satellite);
    drawCelestialBody(satellite);
  });

  //Restores the context on its initial state [*0]
  context.restore();
}

function drawOrbit(celestialBody) {
  context.beginPath();
  context.arc(0, 0, celestialBody.distance, 0, 2 * Math.PI);
  context.strokeStyle = "#333333";
  context.stroke();
}

function animate(lastUpdateTime) {
  const now = performance.now();
  const elapsedTime = lastUpdateTime === 0 ? 0 : now - lastUpdateTime;
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawSolarSystem();
  solarSystem.sun.update(elapsedTime);
  requestAnimationFrame(() => {
    animate(now);
  });
}
