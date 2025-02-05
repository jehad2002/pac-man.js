export const gameContainer = document.getElementById("game-container");
gameContainer.style.position = "absolute";
//gameContainer.style.width = "800px";
//gameContainer.style.height = "600px";
gameContainer.style.display = "flex";
gameContainer.style.justifyContent = "center";
gameContainer.style.alignItems = "center";
// gameContainer.style.backgroundColor= "black"

//styles
document.body.style.margin = "0";
document.body.style.backgroundColor = "black";
document.body.style.display = "flex"
document.body.style.justifyContent = "center"
document.body.style.paddingTop = "100px"

const container = document.getElementById('container');
container.style.display = 'flex';
container.style.flexDirection = 'column';
container.style.background = 'black'
container.style.justifyContent = 'center';
container.style.alignItems = 'center';
container.style.width = '80vw';
container.style.height = '80vh';
//

const menu = document.querySelector('.menu');
menu.style.position = 'absolute';
menu.style.display = 'flex';
menu.style.flexDirection = 'row';
//menu.style.alignItems = 'center';
menu.style.top = '70%'
menu.style.width = '43vw';
menu.style.height = '20vh';
//menu.style.border = '2px solid';

const command = document.querySelector('.command');
command.style.display = 'flex';
command.style.flexDirection = 'column';
command.style.width = '30%';
command.style.height = '20%';
command.style.marginBottum = '10%';
command.style.color = 'lime';
command.style.fontFamily = 'VT323';


const score = document.querySelector('.scoreTime');
score.style.display = 'flex';
score.style.flexDirection = 'column';
//score.style.alignItems = 'start';
score.style.width = '70%';
score.style.height = '20%';
//score.style.marginTop = '5%';
score.style.color = 'lime';
score.style.fontFamily = 'VT323';

//score.style.border = '2px solid';
document.querySelector('.score').style.padding = '3%'
document.querySelector('.time').style.padding = '3%'
