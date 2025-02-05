import { gameContainer } from "./style.js";
import { Node, findPath, findLongestPath, findRandomPath } from "./A*.js"; 
import {moveBool, enemies, stopGhosts} from './script.js';

export let intervalId = null;
let useShortestPath = true;
let shortestPathCount = 0;
let lastShortestPathTime = Date.now();
export var step = 20;
export var canMove = false;

export let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 4, 1, 1, 4, 0, 1, 1, 2, 2, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 4, 4, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 2, 2, 2, 1, 1, 1, 0, 1, 2, 2, 1, 0, 1, 1, 2, 2, 1, 1, 0, 1, 1, 2, 2, 0, 1, 2, 2, 1, 0, 4, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 2, 2, 1, 1, 1, 2, 0, 1, 2, 2, 1, 0, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 0, 1, 2, 2, 1, 0, 1, 1, 1, 0, 7, 0, 1],
    [1, 0, 1, 0, 2, 1, 1, 1, 2, 2, 0, 1, 2, 2, 1, 0, 1, 1, 2, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 2, 2, 1, 0, 4, 4, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 2, 2, 2, 0, 1, 2, 2, 1, 0, 1, 1, 2, 2, 1, 1, 0, 1, 1, 2, 2, 0, 1, 2, 2, 1, 0, 4, 4, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 4, 1, 1, 4, 0, 1, 1, 2, 2, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 4, 4, 1, 0, 0, 0, 1],
    [1, 0, 1, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 4, 1, 1, 1, 1, 1, 1, 1, 4, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 4, 4, 4, 4, 1, 4, 4, 4, 4, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 4, 1, 4, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 4, 1, 4, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 4, 1, 4, 0, 1],
    [1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 3, 3, 3, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 4, 1, 4, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 4, 1, 4, 0, 1],
    [1, 0, 0, 0, 0, 0, 7, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 2, 2, 2, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

export function createWallSpace(x, y, width, height, color) {
    const wallSpace = document.createElement("div")
    wallSpace.style.width = width + "px"
    wallSpace.style.height = height + "px"
    wallSpace.style.backgroundColor = color
    wallSpace.style.position = "absolute"
    wallSpace.style.transform = `translate(${x}px, ${y}px)`
    gameContainer.appendChild(wallSpace)
}

export function createPoint(x, y) {
    const point = document.createElement("div");
    point.classList.add("point");
    point.style.width = "3px";
    point.style.height = "3px";
    point.style.backgroundColor = "yellow";
    point.style.position = "absolute";
    point.style.borderRadius = "50%";
    point.style.transform = `translate(${x}px, ${y}px)`;
    point.style.zIndex = 1;
    gameContainer.appendChild(point);
}

function createPower(x, y) {
    const point = document.createElement("div");
    point.classList.add("point");
    point.style.width = "10px";
    point.style.height = "10px";
    point.style.position = "absolute";
    point.style.borderRadius = "50%";
    point.style.transform = `translate(${x}px, ${y}px)`;
    point.style.zIndex = 1;
    point.style.backgroundImage = "url('images/power.png')";
    point.style.backgroundSize = 'cover';
    gameContainer.appendChild(point);

    point.style.animation = "disappearAppear 0.2s ease-in-out infinite";

}

function br(){
    const style = document.createElement("style");
  style.innerHTML = 
    `@keyframes disappearAppear {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
    }`
  ;
  document.head.appendChild(style);
}
br()

export function createBar(x, y, width) {
    const horizontalBar = document.createElement("div")
    horizontalBar.style.width = width + "px"
    horizontalBar.style.height = "2px"
    horizontalBar.style.backgroundColor ="red"
    horizontalBar.style.position = "absolute"
    horizontalBar.style.transform = `translate(${x - 390}px, ${y - 265}px)`;
    gameContainer.appendChild(horizontalBar)
}

export function createPacMan(x, y, width, height) {
    const pacMan = document.createElement("div")
    pacMan.classList.add("pacman")
    pacMan.style.width = 20 + "px"
    pacMan.style.height = 20 + "px"
    pacMan.id = "player"
    pacMan.style.position = "absolute"
    pacMan.style.transform = `translate(${x}px, ${y}px)`
    pacMan.style.zIndex = 2;

    gameContainer.appendChild(pacMan)
}

export function createWallSpaceEnemis(x, y, width, height, img, id) {
    const enemy = document.createElement("div");
    enemy.id = id;
    enemy.style.width = width + "px";
    enemy.classList.add("enemy");
    enemy.style.zIndex = 2
    enemy.classList.toggle("attack")
    enemy.style.height = height + "px";
    enemy.style.position = "absolute";
    enemy.style.backgroundImage = `url("images/${img}")`;
    enemy.style.backgroundSize = 'cover';
    enemy.style.transform = `translate(${x - 390}px, ${y - 265}px)`;

    gameContainer.appendChild(enemy);

}

const shortestPathDuration = 5000; 

function alternatePath(ghost, pacman, x, y) {
    const currentTime = Date.now();

    if (useShortestPath) {
        moveGhostTowardsPacman(ghost, pacman, x, y);
        shortestPathCount++;
        if (shortestPathCount >= 10 && currentTime - lastShortestPathTime >= shortestPathDuration) {
            useShortestPath = false;
        }
        if (!useShortestPath) {
            lastShortestPathTime = currentTime; 
        }
    } else {
        moveGhostTowardsPacmanLongestPath(ghost, pacman, x, y);
        if (currentTime - lastShortestPathTime >= shortestPathDuration) {
            useShortestPath = true;
            shortestPathCount = 0;
            lastShortestPathTime = currentTime; 
        }
    }
}

function moveGhostRandomly(ghost, pacman, x, y) {
    const ghostX = parseInt(ghost.style.transform.split("(")[1].split("px")[0], 10);
    const ghostY = parseInt(ghost.style.transform.split(", ")[1].split("px")[0], 10);

    const pacmanX = parseInt(pacman.style.transform.split("(")[1].split("px")[0], 10);
    const pacmanY = parseInt(pacman.style.transform.split(", ")[1].split("px")[0], 10);

    const ghostNode = new Node(Math.floor((ghostX + x) / step), Math.floor((ghostY + y) / step));
    const pacmanNode = new Node(Math.floor((pacmanX + x) / step), Math.floor((pacmanY + y) / step));

    const path = findRandomPath(ghostNode, pacmanNode, map);

    if (path) {
        if (path.length > 1) {
            const nextNode = path[1];
            ghost.style.transition = "transform 0s";
            ghost.style.transform = `translate(${nextNode.x * step - x}px, ${nextNode.y * step - y}px`;
            ghost.style.transition = "transform 0.5s ease";
        }
    }
}

function moveGhostTowardsPacman(ghost, pacman, x, y) {
    const ghostX = parseInt(ghost.style.transform.split("(")[1].split("px")[0], 10);
    const ghostY = parseInt(ghost.style.transform.split(", ")[1].split("px")[0], 10);

    const pacmanX = parseInt(pacman.style.transform.split("(")[1].split("px")[0], 10);
    const pacmanY = parseInt(pacman.style.transform.split(", ")[1].split("px")[0], 10);

    const ghostNode = new Node(Math.floor((ghostX + x) / step), Math.floor((ghostY + y) / step));
    const pacmanNode = new Node(Math.floor((pacmanX + x) / step), Math.floor((pacmanY + y) / step));

    const path = findPath(ghostNode, pacmanNode, map);

    if (path) {
        if (path.length > 1) {
            const nextNode = path[1];
            // ghost.style.transition = "transform 0.3s";
            ghost.style.transform = `translate(${nextNode.x * step - x}px, ${nextNode.y * step - y}px`;
            ghost.style.transition = "transform 0.5s ease";
            ghost.style.transition = "transform 0.5s ease";
        }
    }
}

function moveGhostTowardsPacmanLongestPath(ghost, pacman, x, y) {
    const ghostX = parseInt(ghost.style.transform.split("(")[1].split("px")[0], 10);
    const ghostY = parseInt(ghost.style.transform.split(", ")[1].split("px")[0], 10);

    const pacmanX = parseInt(pacman.style.transform.split("(")[1].split("px")[0], 10);
    const pacmanY = parseInt(pacman.style.transform.split(", ")[1].split("px")[0], 10);

    const ghostNode = new Node(Math.floor((ghostX + x) / step), Math.floor((ghostY + y) / step));
    const pacmanNode = new Node(Math.floor((pacmanX + x) / step), Math.floor((pacmanY + y) / step));

    const path = findLongestPath(ghostNode, pacmanNode, map);

    if (path) {
        if (path.length > 1) {
            const nextNode = path[1];
            // ghost.style.transition = "transform 0.3s";
            ghost.style.transform = `translate(${nextNode.x * step - x}px, ${nextNode.y * step - y}px`;
            ghost.style.transition = "transform 0.5s ease";
        }
    }
}

export function createEnemies(x, y, width, height) {
    createBar(19 * 21, 13.5 * 19, 60);
    createWallSpaceEnemis(20 * x, 12 * y, width, height, "ghost000.png", 3)
    createWallSpaceEnemis(18 * x, 15 * y, width, height, "ghost00.png", 2)
    createWallSpaceEnemis(20 * x, 15 * y, width, height, "ghost0.png", 1)
    createWallSpaceEnemis(22 * x, 15 * y, width, height, "ghost0000.png", 4)
}

export function createMap() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] === 1 && map[i][j] != 3) {
                if (i > 1 && i < 8 && j > 2 && j < 10) {
                    createWallSpace(j * 20 - 390, i * 20 - 265, 20, 20, "DeepSkyBlue")

                } else if (i > 1 && i < 8 && j > 10 && j < 15) {
                    createWallSpace(j * 20 - 390, i * 20 - 265, 20, 20, "DeepSkyBlue")

                } else if (i > 1 && i < 8 && j > 15 && j < 22) {
                    createWallSpace(j * 20 - 390, i * 20 - 265, 20, 20, "DeepSkyBlue")

                } else if (i > 1 && i < 8 && j > 22 && j < 28) {
                    createWallSpace(j * 20 - 390, i * 20 - 265, 20, 20, "DeepSkyBlue")

                } else if (i > 1 && i < 8 && j > 26 && j < 32) {
                    createWallSpace(j * 20 - 390, i * 20 - 265, 20, 20, "white")

                } else if (i > 1 && i < 8 && j > 32 && j < 36) {
                    createWallSpace(j * 20 - 390, i * 20 - 265, 20, 20, "white")

                }
                else {

                    createWallSpace(j * 20 - 390, i * 20 - 265, 20, 20, "blue")

                }

                if (j > 0 && map[i][j - 1] == 1) {
                    createWallSpace(j * 20 - 390, i * 20 - 265, 15, 15, "black")
                }

                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createWallSpace(j * 20 - 390, i * 20 - 265, 15 + 3, 15, "black")
                }

                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createWallSpace(j * 20 - 390, i * 20 - 265, 15, 15 + 3, "black")
                }

                if (i > 0 && map[i - 1][j] == 1) {
                    createWallSpace(j * 20 - 390, i * 20 - 265, 15, 15 + 3, "black")
                }
            }
            if (map[i][j] === 0) {

                createPoint(j * 20 - 390, i * 20 - 265)
            }
            if (map[i][j] === 7) {
                createPower(j * 20 - 390, i * 20 - 265)

            }

        }
    }
    createEnemies(20, 20, 20, 20)
}

let lastTimestamps = [0, 0, 0, 0]; 
const ghostIntervals = [245, 400, 250, 300]; 
const activeGhosts = [true, true, true, true]; 

export function moveGhosts(ghostId, timestamp) {
    if (stopGhosts) {
        return;
    }
    const ghostInterval = ghostIntervals[ghostId - 1];
    // const ghosts = document.querySelectorAll(".enemy");
    const pacman = document.getElementById("player");

    var x = 390;
    var y = 265;

    enemies.forEach(ghost => {
        if(moveBool){
            if(ghost.classList.contains('attack')){
                if (timestamp - lastTimestamps[ghostId - 1] >= ghostInterval) {
                    lastTimestamps[ghostId - 1] = timestamp;
                
                    const ghost = document.getElementById(ghostId);
                
                    switch (ghostId) {
                        case 1:
                            alternatePath(ghost, pacman, x, y);
                            break;
                            
                        case 2:
                            moveGhostTowardsPacmanLongestPath(ghost, pacman, x, y)
                            
                            break;
                                
                        case 3:
                            moveGhostTowardsPacman(ghost, pacman, x, y);
                            break;
                
                        case 4:
                            moveGhostRandomly(ghost, pacman, x, y);
                            break;
                
                        default:
                            break;
                        }
                }
            }else{
                if (timestamp - lastTimestamps[ghostId - 1] >= ghostInterval) {
                    lastTimestamps[ghostId - 1] = timestamp;
                    
                    const ghost = document.getElementById(ghostId);
                    moveGhostTowardsPacmanLongestPath(ghost, pacman, x, y)
                }
            }
        }
    });

    if (activeGhosts[ghostId - 1]) {
        requestAnimationFrame((timestamp) => moveGhosts(ghostId, timestamp));
    }
}

export function Start() {
        requestAnimationFrame((timestamp) => moveGhosts(1, timestamp));
        requestAnimationFrame((timestamp) => moveGhosts(2, timestamp));
        requestAnimationFrame((timestamp) => moveGhosts(3, timestamp));
        requestAnimationFrame((timestamp) => moveGhosts(4, timestamp));
};


export function Stop() {
    stopGhosts = true;
}