class CelestialBody {
  constructor(
    name,
    radius,
    distance,
    color,
    rotationSpeed,
    orbitalSpeed,
    hasShadow
  ) {
    this.name = name ?? "";
    this.radius = radius;
    this.distance = distance ?? 0;
    this.color = color ?? "#FFFF00";
    this.hasShadow = hasShadow ?? false;
    this.rotationSpeed = rotationSpeed ?? 0;
    this.orbitalSpeed = orbitalSpeed ?? 0;

    this.texture = null;

    this.rotationAngle = 0;
    this.orbitalAngle = 0;
    this.absoluteOrbitalAngle = 0;

    this.satellites = [];
  }

  addSatellite(star) {
    this.satellites.push(star);
  }

  update(elapsedTime) {
    this.rotationAngle += (elapsedTime * this.rotationSpeed) / 1000.0;
    this.orbitalAngle += (elapsedTime * this.orbitalSpeed) / 1000.0;

    this.satellites.forEach((satellite) => {
      satellite.update(elapsedTime);

      this.computeSatelliteAbsoluteOrbitalAngle(satellite);
    });
  }

  async initTexture() {
    return new Promise((resolve, reject) => {
      this.texture = new Image();
      this.texture.src = `img/${this.name.toLowerCase()}.png`;
      this.texture.onload = async () => {
        for (const satellite of this.satellites) await satellite.initTexture();

        resolve();
      };
    });
  }

  computeSatelliteAbsoluteOrbitalAngle(satellite) {
    const x = Math.cos(satellite.orbitalAngle) * satellite.distance;
    const y = Math.sin(satellite.orbitalAngle) * satellite.distance;

    const x2 = this.distance - x;
    const d3 = Math.sqrt(Math.pow(x2, 2) + Math.pow(y, 2));
    const angleTemp = Math.acos(this.distance / d3);

    satellite.absoluteOrbitalAngle = this.absoluteOrbitalAngle - angleTemp;
  }
}

const sun = new CelestialBody("Sun", 60, 0, "#fff68f", 0.1, 0);
const mercury = new CelestialBody(
  "Mercury",
  15,
  120,
  "#4f4160",
  0.5,
  0.5,
  true
);
const venus = new CelestialBody("Venus", 30, 215, "#d3a147", 0.2, 0.2, true);
const earth = new CelestialBody("Earth", 30, 320, "#355ca3", 0.3, 0.1, true);
const moon = new CelestialBody("Moon", 6, 50, "#888888", 0, 0.2);
const mars = new CelestialBody("Mars", 20, 470, "#a33a35", 0.4, 0.05, true);

sun.addSatellite(mercury);
sun.addSatellite(venus);
sun.addSatellite(earth);
earth.addSatellite(moon);
sun.addSatellite(mars);

const solarSystem = { sun };
