/* const grd = context.createRadialGradient(
  0,
  0,
  celestialBody.radius,
  0,
  0,
  celestialBody.radius * 3
);
grd.addColorStop(0.8, "black");
grd.addColorStop(1, "white");
context.fillStyle = grd;
 */

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
// chargement image
window.addEventListener("load", async () => {
  await solarSystem.sun.initTexture();
  resize();
  animate(0);
});
window.addEventListener("resize", () => {
  resize();
});

function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  drawSolarSystem(solarSystem.sun);
}
// On place au milieu de canvas le soleil
function drawSolarSystem() {
  context.save();
  context.translate(canvas.width / 2, canvas.height / 2);
  drawCelestialBody(solarSystem.sun);
  context.restore();
}

function drawCelestialBody(celestialBody) {
  // on tourne et on se place sur l'astre
  context.save();
  context.rotate(celestialBody.orbitalAngle);
  context.translate(celestialBody.distance, 0);

  if (celestialBody.hasShadow) {
    //dessine un disque noir
    context.beginPath();
    context.arc(0, 0, celestialBody.radius, 0, 2 * Math.PI);
    context.fillStyle = "#000000";
    context.fill();

    context.save();

    //le masque
    context.beginPath();
    context.arc(
      -celestialBody.radius * 2,
      0,
      celestialBody.radius * 2,
      0,
      2 * Math.PI
    );

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
  context.fillStyle = pattern; //celestialBody.color;
  context.fill();

  context.restore();
  // on enleve le save dans la condition
  if (celestialBody.hasShadow) {
    degrade(celestialBody.radius);
    context.restore();
  }

  // On dessine pour toutes les planetes
  celestialBody.satellites.forEach((satellite) => {
    drawOrbit(satellite);
    drawCelestialBody(satellite);
  });

  context.restore();
}

function degrade(celestialBody) {
  // ajouter un dégradé
  context.save();
  context.beginPath();
  context.arc(0, 0, celestialBody, 0, 2 * Math.PI);
  const gradient = context.createLinearGradient(-celestialBody / 2, 0, 0, 0);
  gradient.addColorStop(0, "transparent");
  gradient.addColorStop(1, "black");
  context.fillStyle = gradient;
  context.fill();
  context.beginPath();
  context.arc(-celestialBody * 2, 0, celestialBody * 2, 0, 2 * Math.PI);
  context.clip();
  context.restore();
}

// On trace les cercle des orbites
function drawOrbit(celestialBody) {
  context.beginPath();
  context.arc(0, 0, celestialBody.distance, 0, 2 * Math.PI);
  context.strokeStyle = "#333333";
  context.stroke();
}

// on anime les planetes sur leur orbite
function animate(lastUpdateTime) {
  // now temps écouler depuis l'ouverture de la page web
  const now = performance.now();
  const elapsedTime = lastUpdateTime === 0 ? 0 : now - lastUpdateTime;
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawSolarSystem();
  solarSystem.sun.update(elapsedTime);
  requestAnimationFrame(() => {
    animate(now);
  });
}
