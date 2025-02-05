import { createMap, map, createWallSpaceEnemis, step, createEnemies, createPacMan, Start} from "./map.js";

let score = 0;

function gameLoop() {
  createPacMan(-368, -243, 20, 20)
  createMap();
  eat()
  // collision()
}
gameLoop()

//Variables
export let stopGhosts = false;
const player = document.getElementById("player");
var transform = getComputedStyle(player).transform;
var matrix = new DOMMatrix(transform);
var top = matrix.m42;
var left = matrix.m41;
var Direction;
var startTime;
var cTime = false;
var imageIndex = 0;
export var moveBool = false;
var animId;
var collisionBool = false;
var start = false;
export var enemies = document.querySelectorAll('.enemy');
var pacmans = document.querySelectorAll(".lives img");
var newTop = 1
var newLeft = 1
var isBlue = true;
var lives = 3;
var gameStarted = false;
var ImgRed;
var ImgPink;
var ImgYellow;
var ImgBlue;
var pause = document.querySelector(".pause");
var rTime = document.querySelector(".time");
var count = 289;
var timer = 0;
var checkTime=false;
var Blue = false;

for (var i = 0; i < pacmans.length; i++) {
  pacmans[i].style.width = "25px";
  pacmans[i].style.height = "25px";
}

//GameLoop
document.getElementById('sound-icon').style.width = "30px";
document.getElementById('sound-icon').style.height = "30px";
document.getElementById('sound-icon').style.marginLeft = "25px"
document.getElementById('sound-icon').style.marginBottom = "25px"


document.addEventListener("DOMContentLoaded", function () {
  // Variables
  const welcomeText = welcome("Welcome to the Game! Press S to start...!");
  document.addEventListener("keydown", (event) => {
    Direction = event.key;
    if (event.key === "s" && collisionBool === false && !pause.classList.contains("active") && !gameStarted) {
      start = true;
      // moveBool = false;
      if (!gameStarted) {
        changeGameMusic('start')
        setTimeout(() => {
          Start();
        }, 3000);
      }
      if (!rTime.classList.contains("active")) {
        rTime.classList.toggle("active");
        startTime = 0;
        animId = requestAnimationFrame(loadPacmanImage);
      }
      gameStarted = true
    }
    if (event.key === "r" || event.key === "R") {
      location.reload()
    }

    if (event.key === " " && collisionBool === false) {
      if (!pause.classList.contains("active") && start) {
        checkTime = false;
        start = false;
        gameAudio.pause()
        pause.classList.toggle("active");
        document.querySelector(".txt").textContent =
          "Game Paused!!! Press space to continue";
        document.querySelector(".txt").style.display = "block";
        cTime = true;
        cancelAnimationFrame(animId);
        
      } else if (rTime.classList.contains("active") && collisionBool === false) {
        start = true;
        gameAudio.play()
        // moveBool = true;
        pause.classList.toggle("active");
        hideText(document.querySelector(".txt"));
        cTime = false;
        if (Blue) {
          checkTime =true;
        }else{
          checkTime = false
        }
        debouncedGhostProie();
        
      }
      // enemies =  document.querySelectorAll(".ennemy")
    }

    if (start && !collisionBool) {
      moveBool = true;
      pacmans[pacmans.length - 1].remove();
      hideText(welcomeText);
      movePacman();
      // eat();
    } else {
      moveBool = false;
    }
  });
});

function canMove(direction) {
  if (direction === "ArrowUp") {
    if (map[newTop - 1][newLeft] === 0 || map[newTop - 1][newLeft] === 5 || map[newTop - 1][newLeft] === 4 || map[newTop - 1][newLeft] === 7) {
      newTop -= 1
    } else {
      return false
    }
  } else if (direction === "ArrowDown") {
    if (map[newTop + 1][newLeft] === 0 || map[newTop + 1][newLeft] === 5 || map[newTop + 1][newLeft] === 4 || map[newTop + 1][newLeft] === 7) {
      newTop += 1
    } else {
      return false
    }
  } else if (direction === "ArrowLeft") {
    if (map[newTop][newLeft - 1] === 0 || map[newTop][newLeft - 1] === 5 || map[newTop][newLeft - 1] === 4 || map[newTop][newLeft - 1] === 7) {
      newLeft -= 1
    } else {
      return false
    }
  } else if (direction === "ArrowRight") {
    if (map[newTop][newLeft + 1] === 0 || map[newTop][newLeft + 1] === 5 || map[newTop][newLeft + 1] === 4 || map[newTop][newLeft + 1] === 7) {
      newLeft += 1
    } else {
      return false
    }
  }

  return (
    newTop >= 0 && newTop <= map.length &&
    map[newTop][newLeft] === 0 || map[newTop][newLeft] === 5 || map[newTop][newLeft] === 4 || map[newTop][newLeft] === 7
  )
}

function move() {
  if (canMove(Direction)) {
    if (Direction === "ArrowUp") {
      top -= step;
    } else if (Direction === "ArrowDown") {
      top += step;
    } else if (Direction === "ArrowLeft") {
      left -= step;
    } else if (Direction === "ArrowRight") {
      left += step;
    }
    player.style.transform = `translate(${left}px, ${top}px)`;
  }
}

function hideText(txt) {
  txt.style.display = "none";
}

function pacmanImage() {
  const pacmanImage1 = new Image();
  pacmanImage1.src = "images/pac0.png";
  pacmanImage1.style.width = "70%";
  pacmanImage1.style.height = "70%";

  const pacmanImage3 = new Image();
  pacmanImage3.src = "images/pacman2.png";
  pacmanImage3.style.width = "70%";
  pacmanImage3.style.height = "70%";

  return [
    pacmanImage1,
    pacmanImage1,
    pacmanImage1,
    pacmanImage1,
    pacmanImage1,
    pacmanImage1,
    pacmanImage1,
    pacmanImage1,
    pacmanImage3,
    pacmanImage3,
    pacmanImage3,
    pacmanImage3,
    pacmanImage3,
    pacmanImage3,
    pacmanImage3,
    pacmanImage3,
  ];
}

const pacmanImages = pacmanImage();
player.appendChild(pacmanImages[0]);

function loadPacmanImage() {
  const currentImage = document.querySelector("#player img");
  const nextImage = pacmanImages[imageIndex];

  if (lives === 1 || lives === 2 || lives === 3) {
    if (currentImage) {
      player.removeChild(currentImage);
    }

    player.appendChild(nextImage);

    if (Direction === "ArrowUp") {
      nextImage.style.transform = "rotate(-90deg)";
    } else if (Direction === "ArrowRight") {
      nextImage.style.transform = "rotate(0deg)";
    } else if (Direction === "ArrowDown") {
      nextImage.style.transform = "rotate(90deg)";
    } else if (Direction === "ArrowLeft") {
      nextImage.style.transform = "rotate(180deg)";
    }

    imageIndex++;
    if (imageIndex > 14) {
      imageIndex = 0;
    }

    requestAnimationFrame(loadPacmanImage);
  } else {
    const pacmanDied = new Image();
    pacmanDied.src = "images/died.gif";
    pacmanDied.style.width = "100%";
    pacmanDied.style.height = "100%";

    if (currentImage) {
      player.removeChild(currentImage);
    }

    player.appendChild(pacmanDied);
  }
}

var delay = 10;
function eat() {
  const playerRect = document.getElementById("player").getBoundingClientRect();
  const points = document.querySelectorAll('.point');

  points.forEach((point) => {
    const pointRect = point.getBoundingClientRect();
    if (
      playerRect.right > pointRect.left &&
      playerRect.left < pointRect.right &&
      playerRect.bottom > pointRect.top &&
      playerRect.top < pointRect.bottom
      //     start = false;
      // }
    ) {
      if (point.style.backgroundColor === "yellow") {
        changeGameMusic('eatPoint')
        score += 10;
        count--
      } else if (point.style.backgroundImage != "none") {
        changeGameMusic('eatPower')
        count--

        enemies.forEach((enemy) => {
          if (enemy.classList.contains('attack')) {
            enemy.classList.toggle("attack")
            enemy.classList.toggle("run")
          }
          enemy.style.backgroundImage = "url('images/ghostLow.png')";
          checkTime = true;
        });
        timer = 0;
        Blue = true;
        debouncedGhostProie();
        enemies.forEach(enemy => {
          enemy.style.backgroundImage = "url('images/ghostLow.png')";
        });

      }
      point.style.backgroundColor = "black";
      point.style.backgroundImage = 'none'
    }
  });
  if (count === 0) {
    rTime.classList.toggle("active");
    removeEn();
    start = false;
    const winText = 'YOU WIIIN CONGRATS 🥳🥳🥳 Press R to restart'
    document.querySelector(".txt").textContent = winText;
    document.querySelector(".txt").style.display = "block";
    changeGameMusic('end')
    cTime = true;
  }
  document.querySelector(".score").textContent = `SCORE: ${score}`;
  setTimeout(eat, 10)
}
eat()

const restoreBackgroundEnemies = () => {
  enemies.forEach((enemy) => {
    if (!start && enemy.classList.contains("run")) {
      enemy.style.backgroundImage = "url('images/ghostLow.png')";
      delay = Math.max(0, 10 - timer); 
    } else {;
    }
    if(start){
      if (enemy.classList.contains('run')) {
        enemy.classList.toggle("attack")
        enemy.classList.toggle("run")
      }
      document.getElementById('3').style.backgroundImage = ImgBlue;
      document.getElementById('1').style.backgroundImage = ImgYellow;
      document.getElementById('2').style.backgroundImage = ImgRed;
      document.getElementById('4').style.backgroundImage = ImgPink;
      timer = 0;
      delay = 10;
      Blue= false;
    }
  });
  debouncedGhostProie = debounce(restoreBackgroundEnemies, delay * 1000);
}

var countDebounce = 0;
const debounce = (calback, delay, bool) => {
  var TIMER = null;
  return function () {
    var context = this;
    var args = arguments
    countDebounce++;
    clearTimeout(TIMER)
    TIMER = setTimeout(() => {
      calback.apply(context, args);
    }, delay);
  }
}

var debouncedGhostProie = debounce(restoreBackgroundEnemies, delay*1000, true) ;
var movePacman = debounce(move, 30)

var checkTime = false;
let intervalId;
let isVisible = true;

function startTimer() {
  intervalId = setInterval(updateElapsedTime, 1000);
}

function updateElapsedTime() {
  if (isVisible) {
    if(!cTime){
      startTime ++;

      if (!isNaN(startTime)) {
        var timeElement = document.querySelector(".time");
  
        // Conversion en minutes et secondes
        const minutes = Math.floor(startTime / 60);
        const seconds = (startTime % 60);
  
        // Formatage de l'affichage
        const formattedTime = `${padLeft(minutes)}: ${padLeft(seconds)}`;
        timeElement.textContent = `TIME: ${formattedTime}`;
      }
    }
    if(checkTime){
      timer += 1;
    }
  }
}

function padLeft(value) {
  return value.toString().padStart(2, '0');
}

document.addEventListener("visibilitychange", function () {
  isVisible = !document.hidden;

  if (isVisible) {
    startTimer();
  } else {
    clearInterval(intervalId);
  }
});

setInterval(updateElapsedTime, 1000);

function welcome(txt) {
  const text = document.createElement("div");
  text.style.textAlign = "center";
  text.classList.add("txt");
  text.textContent = txt;
  text.style.fontFamily = "VT323";
  text.style.fontSize = "30px";
  text.style.textAlign = "center";
  text.style.animationName = "example";
  text.style.animationDuration = "1s";
  text.style.animationIterationCount = "infinite";
  text.style.position = "absolute";
  text.style.width = "80wh";
  text.style.height = "60wh";
  text.style.color = "#00FF00"


  text.style.top = 60 + "px";
  // text.style.left = 430 + "px";

  document.body.appendChild(text);
  return text;
}
function restartGame() {
  collisionBool = false;
}

function removeEn() {
  enemies.forEach(function (enemy) {
    enemy.remove();
  });
}

function collision() {
  const playerRect = player.getBoundingClientRect();
  enemies.forEach((enemy) => {
    const enemyRect = enemy.getBoundingClientRect();
    if (
      playerRect.right > enemyRect.left &&
      playerRect.left < enemyRect.right &&
      playerRect.bottom > enemyRect.top &&
      playerRect.top < enemyRect.bottom
    ) {
      if (!/ghostLow\.png/.test(enemy.style.backgroundImage)) {
        isBlue = false;
        collisionBool = true;
        gameStarted = false;

        if (lives > 1) {
          lives--;
          pacmans[lives - 1].remove();
          resetPlayerPosition();
          resetEnemyPositions();
      
        } else {
          gameOver();
        }
      } else {
        isBlue = true;
      }
      if (isBlue) {
        eatEnemy(enemy);
      }
    }
  });
  setTimeout(collision, 10);

}
collision()


function resetPlayerPosition() {
  restartGame()
  player.style.transform = "translate(-368px, -243px)";
  transform = getComputedStyle(player).transform;
  matrix = new DOMMatrix(transform);
  top = matrix.m42;
  left = matrix.m41;
  newTop = 1
  newLeft = 1
}

function resetEnemyPositions() {
  removeEn()
  createEnemies(20, 20, 20, 20)
  enemies = document.querySelectorAll('.enemy')

  setTimeout(() => {
    restartGame();
  }, 3000);
  isBlue = false;
}

function gameOver() {
  cTime = true
  changeGameMusic('die')
  var bcgk = document.querySelector("#player img")
  stopGhosts = true
  removeEn()
  lives--
  player.removeChild(bcgk)
  const loseText = '☠️💥💥💥 Game Over. Press R to restart the game';
  document.querySelector(".txt").textContent = loseText;
  document.querySelector(".txt").style.display = "block";

}

function eatEnemy(enemy) {
  //if (isBlue) {
  const enemyId = enemy.id;
  // enemy.style.backgroundImage = "none";
  enemy.parentElement.removeChild(enemy)
  changeGameMusic('eatedGhost')
  // enemy.style.display = "none";
  switch (enemyId) {
    case '1':
      createWallSpaceEnemis(20 * 20, 15 * 20, 20, 20, "ghost0.png", 1)
      break;
    case '2':
      createWallSpaceEnemis(18 * 20, 15 * 20, 20, 20, "ghost00.png", 2)
      break;
    case '3':
      createWallSpaceEnemis(20 * 20, 12 * 20, 20, 20, "ghost000.png", 3)
      break;
    case '4':
      createWallSpaceEnemis(22 * 20, 15 * 20, 20, 20, "ghost0000.png", 4)
      break;
  }
  enemies = document.querySelectorAll('.enemy')
  score += 200
}

const gameAudio = document.getElementById('game-audio');
let isAudioPlaying = false;

function changeGameMusic(gameEvent) {
  if (isAudioPlaying) {
    return;
  }

  if (gameEvent === 'start') {
    gameAudio.src = '/audio/opening_song.mp3';
  } else if (gameEvent === 'eatPoint') {
    gameAudio.src = '/audio/eating.mp3';
  } else if (gameEvent === 'eatPower') {
    gameAudio.src = '/audio/eatpill.mp3';
  } else if (gameEvent === 'collision') {
    gameAudio.src = '/audio/die.mp3';
  } else if (gameEvent === 'die') {
    gameAudio.src = '/audio/die.mp3';
  } else if (gameEvent === 'eatedGhost') {
    gameAudio.src = '/audio/eatghost.mp3';
  } else if (gameEvent === 'end') {
    gameAudio.src = '/audio/vcs_90.mp3';
  }

  gameAudio.load();
  gameAudio.play();
  isAudioPlaying = true;

  gameAudio.addEventListener('ended', function () {
    isAudioPlaying = false;
  });
}

ImgBlue = document.getElementById('3').style.backgroundImage;
ImgYellow = document.getElementById('1').style.backgroundImage;
ImgRed = document.getElementById('2').style.backgroundImage;
ImgPink = document.getElementById('4').style.backgroundImage;

