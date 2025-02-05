export  class Node {
    constructor(x, y, parent = null) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.g = 0; 
        this.h = 0;
        this.f = 0; 
    }
}

export  function calculateHeuristic(node, target) {
    return Math.abs(node.x - target.x) + Math.abs(node.y - target.y);
}

export  function findPath(start, target, map) {
    const openList = [];
    const closedList = [];

    openList.push(start);

    while (openList.length > 0) {
        let current = openList[0];
        for (let i = 1; i < openList.length; i++) {
            if (openList[i].f < current.f) {
                current = openList[i];
            }
        }

        openList.splice(openList.indexOf(current), 1);
        closedList.push(current);

        if (current.x === target.x && current.y === target.y) {
            const path = [];
            let node = current;
            while (node !== null) {
                path.push({ x: node.x, y: node.y });
                node = node.parent;
            }
            return path.reverse();
        }

        const neighbors = [];
        const x = current.x;
        const y = current.y;
        const adjacentNodes = [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }];

        for (const position of adjacentNodes) {
            const newNode = new Node(position.x, position.y, current);
            if (map[newNode.y][newNode.x] !== 1 && !closedList.some((node) => node.x === newNode.x && node.y === newNode.y)) {
                neighbors.push(newNode);
            }
        }

        for (const neighbor of neighbors) {
            if (!openList.some((node) => node.x === neighbor.x && node.y === neighbor.y)) {
                neighbor.g = current.g + 1;
                neighbor.h = calculateHeuristic(neighbor, target);
                neighbor.f = neighbor.g + neighbor.h;
                openList.push(neighbor);
            }
        }
    }

    return null;
}

export function findLongestPath(start, target, map) {
    const openList = [];
    const closedList = [];

    openList.push(start);

    while (openList.length > 0) {

        let current = openList[0];
        for (let i = 1; i < openList.length; i++) {
            if (openList[i].f > current.f) { 
                current = openList[i];
            }
        }

        openList.splice(openList.indexOf(current), 1);
        closedList.push(current);

        if (current.x === target.x && current.y === target.y) {
            const path = [];
            let node = current;
            while (node !== null) {
                path.push({ x: node.x, y: node.y });
                node = node.parent;
            }
            return path.reverse();
        }

        const neighbors = [];
        const x = current.x;
        const y = current.y;
        const adjacentNodes = [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }];

        for (const position of adjacentNodes) {
            const newNode = new Node(position.x, position.y, current);
            if (map[newNode.y][newNode.x] !== 1 && !closedList.some((node) => node.x === newNode.x && node.y === newNode.y)) {
                neighbors.push(newNode);
            }
        }

        for (const neighbor of neighbors) {
            if (!openList.some((node) => node.x === neighbor.x && node.y === neighbor.y)) {
                neighbor.g = current.g + 1;
                neighbor.h = calculateHeuristic(neighbor, target);
                neighbor.f = neighbor.g + neighbor.h;
                openList.push(neighbor);
            }
        }
    }

    return null;
}
export function findRandomPath(start, target, map) {

    const firstPath = findPath(start, target, map);

    if (!firstPath) {
        return null; 
    }

    const longestPath = findLongestPath(start, target, map);

    if (!longestPath) {
        return null; 
    }

    const possiblePaths = generatePossiblePaths(start, target, map);

    const secondShortestPath = possiblePaths
        .filter((path) => path.length !== firstPath.length && path.length !== longestPath.length)
        .reduce((acc, curr) => (curr.length < acc.length ? curr : acc), possiblePaths[0]);

    return secondShortestPath;
}

function generatePossiblePaths(start, target, map) {
    const openList = [];
    const closedList = [];
    const possiblePaths = [];

    openList.push(start);

    while (openList.length > 0) {
        let current = openList[0];
        for (let i = 1; i < openList.length; i++) {
            if (openList[i].f < current.f) {
                current = openList[i];
            }
        }

        openList.splice(openList.indexOf(current), 1);
        closedList.push(current);

        if (current.x === target.x && current.y === target.y) {
            const path = [];
            let node = current;
            while (node !== null) {
                path.push({ x: node.x, y: node.y });
                node = node.parent;
            }
            possiblePaths.push(path.reverse());
            continue; 
        }

        const neighbors = [];
        const x = current.x;
        const y = current.y;
        const adjacentNodes = [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }];

        for (const position of adjacentNodes) {
            const newNode = new Node(position.x, position.y, current);
            if (map[newNode.y][newNode.x] !== 1 && !closedList.some((node) => node.x === newNode.x && node.y === newNode.y)) {
                neighbors.push(newNode);
            }
        }

        for (const neighbor of neighbors) {
            if (!openList.some((node) => node.x === neighbor.x && node.y === neighbor.y)) {
                neighbor.g = current.g + 1;
                neighbor.h = calculateHeuristic(neighbor, target);
                neighbor.f = neighbor.g + neighbor.h;
                openList.push(neighbor);
            }
        }
    }

    return possiblePaths;
}

