var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var x = 250,
  y = 250,
  // Radii of the white glow.
  innerRadius = 50,
  outerRadius = 70,
  // Radius of the entire circle.
  radius = 60;

var gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
gradient.addColorStop(0.8, "white");
gradient.addColorStop(0.9, "black");

ctx.arc(x, y, radius, 0, 2 * Math.PI);

ctx.fillStyle = gradient;
ctx.fill();
