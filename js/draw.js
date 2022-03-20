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
  animate(0);
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
  context.beginPath();
  context.arc(0, 0, celestialBody.radius, 0, 2 * Math.PI);
  // Creates the pattern and sets the fill style with it
  const pattern = context.createPattern(celestialBody.texture, "no-repeat");
  context.fillStyle = pattern;

  // Computes the scale required to apply the pattern at the good dimensions
  const coefEchelle = (celestialBody.radius * 2) / celestialBody.texture.width;

  // Saves the current context
  context.save();

  // Translates the coordinate system to the top right corner of the circle
  context.translate(-celestialBody.radius, -celestialBody.radius);

  // Sets the scales of the coordinate system horizontally and vertically
  context.scale(coefEchelle, coefEchelle);

  // Fills the previously prepared circle with the scaled pattern
  context.fill();

  // Restores the coordinate system to its initial state
  context.restore();
  /*   const pattern = context.createPattern(celestialBody.texture, "no-repeat");
  context.fillStyle = pattern;

  context.fill(); */

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
