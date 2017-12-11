var mouseX = 0;
var mouseY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
})

function rotate_point(pointX, pointY, originX, originY, angle) {
  return [Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX, Math.sin(angle) *
    (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY
  ];
}
var canvas = document.getElementById("canvas");

function fast() {
  speed = 5;
}

function slow() {
  speed = 2;
}
var ctx = canvas.getContext("2d");
var speed = 2;
var colors = ["red", "orange", "gold", "green", "blue", "purple"]
var food = []
var halfSize = 5

function makeFood(x, y, size, color) {
  food.push([x, y, size, color])
}

function render() {
  for (i = 0; i < food.length; i++) {
    if ((Math.abs(food[i][0]-player.x)>canvas.width) || (Math.abs(food[i][1]-player.y)>canvas.height)) continue;
    ctx.beginPath();
    ctx.arc(food[i][0] - player.x, food[i][1] - player.y, food[i][2], 0, 2 * Math.PI, false);
    ctx.shadowColor = food[i][3];
    ctx.shadowBlur = Math.floor(Math.random() * 10) + 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = food[i][3];
    ctx.strokeStyle = food[i][3];
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fill()
    if (Math.abs(food[i][0] - player.x - canvas.width / 2) < 40 && Math.abs(food[i][1] - player.y - canvas.height /
        2) < 40) {
      console.log("Yay")
      food.splice(i, 1)
      player.size += 0.01
    }
  }
}

function fish() {
  this.x = 0;
  this.y = 0;
  this.rotation = 0;
  this.size = 1;
  this.tail = 0;
  this.render = function (x, y, rotation, rotation2, size, color1, color2) {
    var headGradient = ctx.createRadialGradient(x, y - 20 * size, 0, x, y, 75 * size);
    headGradient.addColorStop(0, color1);
    headGradient.addColorStop(1, color2);
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.translate(-x, -y);
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.moveTo(x, y - 75 * size);
    ctx.quadraticCurveTo(x - 30 * size, y - 50 * size, x - 30 * size, y - 25 * size);
    ctx.quadraticCurveTo(x, y, x + 30 * size, y - 25 * size);
    ctx.quadraticCurveTo(x + 30 * size, y - 50 * size, x, y - 75 * size);
    ctx.fill();
    ctx.beginPath();
    var point = rotate_point(x, y + 100 * size, x, y, rotation2);
    ctx.fillStyle = color2;
    ctx.moveTo(x - 30 * size, y - 25 * size);
    ctx.quadraticCurveTo(x, y, x + 30 * size, y - 25 * size);
    ctx.quadraticCurveTo(x + 30 * size, y + 40 * size, point[0], point[1]);
    ctx.quadraticCurveTo(x - 30 * size, y + 40 * size, x - 30 * size, y - 25 * size);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y - 45 * size, 7 * size, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.translate(x, y);
    ctx.rotate(rotation2);
    ctx.translate(-x, -y);
    ctx.fillStyle = color1;
    ctx.beginPath();
    ctx.moveTo(x, y + 100 * size);
    ctx.quadraticCurveTo(x - 25 * size, y + 120 * size, x - 30 * size, y + 140 * size);
    ctx.quadraticCurveTo(x, y + 130 * size, x + 30 * size, y + 140 * size);
    ctx.quadraticCurveTo(x + 25 * size, y + 120 * size, x, y + 100 * size);
    ctx.fill();
    ctx.translate(x, y);
    ctx.rotate(-rotation2);
    ctx.translate(-x, -y);
    ctx.translate(x, y);
    ctx.rotate(-rotation);
    ctx.translate(-x, -y);
  }
};
var player = new fish();
var i = 0;

function point() {
  var mouseAngle = Math.atan2(mouseY - canvas.height / 2, mouseX - canvas.width / 2) + Math.PI / 2
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var waterGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  waterGradient.addColorStop(0, "#aaeeff");
  waterGradient.addColorStop(1, "#55aadd");
  ctx.fillStyle = waterGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  while (food.length<1000) {
    makeFood(Math.floor((Math.random() - 0.5) * 10000), Math.floor((Math.random() - 0.5) * 10000), halfSize * 2, colors[Math.floor(Math.random() * colors.length)]);
  }

  render();
  if (speed === 2) {
    ctx.shadowBlur = 0
  } else {
    ctx.shadowBlur = player.size * 15
    ctx.shadowColor = colors[Math.floor(Math.random()*colors.length)]
  };
  if (player.tail - mouseAngle > Math.PI / 3) {
    if (player.tail - mouseAngle > Math.PI) {
      player.tail -= 2 * Math.PI
    } else {
      player.tail = Math.PI / 3 + mouseAngle
    }
  } else if (mouseAngle - player.tail > Math.PI / 3) {
    if (mouseAngle - player.tail > Math.PI) {
      player.tail += 2 * Math.PI
    } else {
      player.tail = mouseAngle - Math.PI / 3
    }
  };
  player.render(canvas.width / 2, canvas.height / 2, mouseAngle, player.tail - mouseAngle, player.size, "#8FD400",
    "#3AA655");
  if (player.tail < mouseAngle) {
    player.tail += 0.02
  } else if (player.tail > mouseAngle) {
    player.tail -= 0.02
  } else {
    player.tail += Math.sin(i) / 10000
  };
  /*
  ctx.font="30px Times";
  ctx.fillStyle="#000000"
  ctx.fillText("x:"+Math.round(player.x)+" y:"+Math.round(player.y)+" rotation:"+Math.round(mouseAngle/Math.PI*180)+" x value:"+Math.sin(mouseAngle), 5, 30);
  */
  player.x += Math.sin(mouseAngle) * speed;
  player.y -= Math.cos(mouseAngle) * speed;
}

var splscr_mv = setInterval(() => {
  point();
  player.x = 0;
  player.y = 0;
}, 10);

function startgame() {
  clearInterval(splscr_mv);
  let splscr = document.getElementById('splashscreen');
  splscr.className = 'fade';
  canvas.className = 'unblur';
  setTimeout(() => {splscr.style.display = 'none'}, 1000);
  setInterval(point, 10);
}

window.addEventListener('keypress', (e) => {
  if (e.keyCode === 13 || e.which === 13) {
    e.preventDefault();
    startgame();
  }
})