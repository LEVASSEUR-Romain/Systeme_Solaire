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
  context.save();

  context.rotate(celestialBody.orbitalAngle);
  context.translate(celestialBody.distance, 0);

  if (celestialBody.hasShadow) {
    context.beginPath();
    context.arc(0, 0, celestialBody.radius, 0, 2 * Math.PI);
    context.fillStyle = "#000000";
    context.fill();
    context.save();

    context.beginPath();
    context.arc(
      -celestialBody.radius * 2,
      0,
      celestialBody.radius * 2,
      0,
      2 * Math.PI
    );
    // ICI JE GALERE
    // Enregistrez le contexte actuel, préparez le dessin d’un cercle de la taille de la planète et activez le masque.
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
    context.restore();

    context.clip();
  }

  context.beginPath();

  context.arc(0, 0, celestialBody.radius, 0, 2 * Math.PI);

  const pattern = context.createPattern(celestialBody.texture, "no-repeat");
  const coef = (celestialBody.radius * 2) / celestialBody.texture.width;

  context.save();

  context.rotate(celestialBody.rotationAngle);

  context.translate(-celestialBody.radius, -celestialBody.radius);
  context.scale(coef, coef);

  context.fillStyle = pattern;
  context.fill();
  context.restore();

  if (celestialBody.hasShadow) {
    context.restore();
  }
  celestialBody.satellites.forEach((satellite) => {
    drawOrbit(satellite);
    drawCelestialBody(satellite);
  });
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
