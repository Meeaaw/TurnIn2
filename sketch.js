//enlarge the right screen to see button

//refresh the game if want to replay, since the code is weird

//for some features like pick-up items and displayed on the bottom left is from JSLegend Dev  https://www.youtube.com/watch?v=WPT2BmkFFyo&t=44s 

//https://www.youtube.com/watch?v=wfRvhPm5qFc&t=16s

//there was a lot of bug when switching to different room, I found a website that helps integrate game logic to P5.Js and it teaches frame rate so I incorporated that into my code to fix the issue https://deepgram.com/learn/p5js-game-logic

//i also incorporated Jason Eldrich video https://www.youtube.com/watch?v=ZYE4M0lOqYw with JSLegend to help with the pick-up items features 

//music is from https://pixabay.com/music/world-flute-traditional-v1-251387/ 
//sound effects for walking and ding https://pixabay.com/sound-effects/ding-36029/ and https://pixabay.com/sound-effects/walking-in-heels-inside-268480/

//for the count down timer to create a time limit I got help from https://www.youtube.com/watch?v=iR0m6j8RwAI

//for the win and lose end game screen i got help from https://www.youtube.com/watch?v=SpfJUlSusj0

let objectPickedUp = false;
let pickedItems = [];
let inRoom1 = true;
let canTransition = true;
let doorUnlocked = false;
let dungeonGif;
let firstflr;
let secondflr;
let square;
let soul;
let missingkey;
let portalGif;
let gameStarted = false;
let startButton;
let sound;
let bg;
let lose;
let backToMenuButton;
let win = false; 
let timer = 20;  
let timerStarted = false;
let gameOver = false;
let winning;
let pickupsound;
let walking;
let pickup;
let losesound;

function preload() {
  dungeonGif = loadImage('dungeon-preview_gif-animated.gif');
  firstflr = loadImage('firstroom.gif');
  secondflr = loadImage('secondroom.gif'); 
  player = loadImage('player.gif');
  soul = loadImage('soul.gif');
  missingkey = loadImage('orb.gif');
  portalGif = loadImage('portal.gif');
  bg = loadImage('background.gif');
  flute = loadSound('flute.mp3');
  lose = loadImage('lose.gif');
  winning = loadImage('win.gif');
  walking = loadSound('walk.mp3');
  ding = loadSound('ding.mp3');
  losesound = loadSound('lose.mp3');
}

function setup() {
  createCanvas(800, 500);
  square = createVector(width / 2, height / 2);
  square.size = 50;
  object = createVector(650, 150);
  object.size = 30;
  
  //Had to ask chatgpt to help with the buttons because nothing was working
  startButton = createButton('Start');
  startButton.size(120, 40);
  startButton.position(width / 2 - startButton.width / 2, height / 2 + 100);  
  startButton.style('position', 'fixed');
  startButton.style('top', '50%');
  startButton.style('left', '50%');
  startButton.style('transform', 'translate(-50%, 200px)');
  startButton.mousePressed(startGame);  
  startButton.show();  

  backToMenuButton = createButton('Back to Menu');
  backToMenuButton.size(120, 40);
  backToMenuButton.position(width / 2 - backToMenuButton.width / 2, height / 2 + 150);  
  backToMenuButton.style('position', 'fixed');
  backToMenuButton.style('top', '50%');
  backToMenuButton.style('left', '50%');
  backToMenuButton.style('transform', 'translate(-50%, 200px)');  
  backToMenuButton.mousePressed(backToMenu);
  backToMenuButton.hide();
  
  flute.setVolume(0.3); 
  flute.loop(); 
}

function draw() {
  if (gameOver) {
    displayGameOverScreen();
    return; 
  }

  if (win) {
    displayWinScreen(); 
    return;
  }

  background(0); 
    let text1Width = textWidth("WASD to Move");
    let text2Width = textWidth("Follow Objectives");
    let boxHeight = 40;


  if (!gameStarted) {
    strokeWeight(5);
    
    fill(255, 255, 255, 200);     
    image(bg, 0, 0, width, height);
    
    textSize(50);
    textFont('Courier New');
    textAlign(CENTER, CENTER);
    rect(width / 2 - text1Width / 2 - 200, height / 2 - 90, text1Width + 390, boxHeight);
    // fill(255, 255, 255, 200);   
    fill(39, 82, 17);
    text('Welcome to the Abyss', width / 2, height / 2 - 70);
    
    textSize(30);
    textStyle(BOLD);
    
    noStroke(); 

    rect(width / 2 - text1Width / 2 - 10, height / 2 - 35, text1Width + 20, boxHeight);

    rect(width / 2 - text2Width / 2 - 10, height / 2 + 10, text2Width + 20, boxHeight);
      fill(255, 255, 255, 200);  
    text("WASD to Move", width / 2, height / 2 - 10);
    text("Follow Objectives", width / 2, height / 2 + 30);
    
  
    
  } else {
    if (inRoom1) {
      room1();
    } else {
      room2();
    }
    if (timerStarted && timer > 0) {
      timer -= deltaTime / 1000;
      if (timer <= 0) {
        timer = 0;
        gameOver = true; 
      }
    }
    displayTimer(); 
  }
}

function room1() {
  image(firstflr, 0, 0, width, height);
  moveSquare();

  let d = dist(square.x, square.y, object.x, object.y);
  if (d < (square.size / 2 + object.size / 2) && !objectPickedUp) {
    fill(0);
    textSize(16);
    textFont('Courier New');
    textStyle(BOLD);

    let textWidthValue = textWidth("F to pick up");
    let textHeight = 16;
    fill(255, 255, 255, 150);
    rect(object.x - textWidthValue / 2 - 10, object.y - object.size / 2 - 25, textWidthValue + 20, textHeight + 10, 5);

    fill(0);
    textAlign(CENTER, CENTER);  
    text("F to pick up", object.x, object.y - object.size / 2 - 10);
    
    if (keyIsDown(70)) {
      objectPickedUp = true;
      pickedItems.push("Orb");
      console.log("Orb picked up!");

      if (!ding.isPlaying()) {
        ding.setVolume(0.6);
        ding.play();
      }
    }
  }

  image(player, square.x - 100, square.y - 100, 200, 150);

  if (!objectPickedUp) {
    image(missingkey, object.x - object.size / 2, object.y - object.size / 2, 30, 30); 
  }

  fill(255);
  rect(width - 200, height - 100, 190, 90);
  fill(0);
  textSize(16);
  textAlign(LEFT, CENTER);  
  textFont('Courier New');
  textStyle(BOLD);

  text("Picked Up Items:", width - 190, height - 80);
  for (let i = 0; i < pickedItems.length; i++) {
    text(pickedItems[i], width - 190, height - 60 + (i * 20));
  }

  image(portalGif, 50, height / 2 - 50, 100, 150);
  let d2 = dist(square.x, square.y, 50 + 15, height / 2);
  if (d2 < (square.size / 2 + 50)) {
    fill(0);
    textSize(16);

    let keyText = objectPickedUp ? "Press E to enter" : "You need the orb!";
    let keyTextWidth = textWidth(keyText);
    let keyTextHeight = 16;
    fill(255, 255, 255, 150);
    rect(50 - keyTextWidth / 2 - 10, height / 2 - 60, keyTextWidth + 70, keyTextHeight + 10, 5);

    fill(0);
    textAlign(CENTER, CENTER); 
    text(keyText, 100, height / 2 - 50);

    if (objectPickedUp && keyIsDown(69) && canTransition) {
      inRoom1 = false;
      canTransition = false;
      setTimeout(() => (canTransition = true), 500);
      square.x = width - 100;
      square.y = height / 2;
    }
  }

  fill(255, 255, 255, 150);
  rect(width - 470, 20, 470, 40);
  fill(0);
  textSize(20);
  textFont('Courier New');
  textStyle(BOLD);
  textAlign(LEFT, CENTER);  
  text("Objective: Find the Orb to the Door", width - 450, 40);
}

function room2() {
  image(secondflr, 0, 0, width, height);
  moveSquare();

  image(player, square.x - 100, square.y - 100, 200, 150);

  let coins = [
    { x: 200, y: 100, size: 80 },
    { x: 400, y: 200, size: 80 },
    { x: 600, y: 150, size: 80 },
    { x: 500, y: 350, size: 80 },
    { x: 300, y: 350, size: 80 }
  ];

  for (let i = 0; i < coins.length; i++) {
    let coin = coins[i];

    if (!pickedItems.includes("Soul " + (i + 1))) {
      image(soul, coin.x - coin.size / 2, coin.y - coin.size / 2, coin.size, coin.size); 

      let d5 = dist(square.x, square.y, coin.x, coin.y);

      if (d5 < (square.size / 2 + coin.size / 2)) {
        fill(255, 255, 255, 150);
        let textWidthValue = textWidth("F to pick up Soul");
        let textHeight = 16;
        rect(coin.x - textWidthValue / 2 - 10, coin.y - coin.size / 2 - 25, textWidthValue + 20, textHeight + 10, 5);

        fill(0);
        textSize(16);
        textFont('Courier New');
        textStyle(BOLD);
        textAlign(CENTER, CENTER);  
        text("F to pick up Soul", coin.x, coin.y - coin.size / 2 - 10);

        if (keyIsDown(70)) {
          pickedItems.push("Soul " + (i + 1)); 
          console.log("Soul picked up!");

          if (!ding.isPlaying()) {
            ding.setVolume(0.6); 
            ding.play();
          }

          coins.splice(i, 1);  
          i--;  
        }
      }
    }
  }

  let coinCount = pickedItems.filter(item => item.startsWith("Soul")).length;

  fill(255, 0, 0);
  textSize(25);
  textFont('Courier New');
  textAlign(LEFT, CENTER);  
  text("Souls: " + coinCount, 10, 30);

  if (coinCount === 5) {
    win = true; 
  }

  let doorX = width - 80;

  image(portalGif, doorX - 50, height / 2 - 75, 100, 150);  
  let d3 = dist(square.x, square.y, doorX, height / 2);
  if (d3 < (square.size / 2 + 50)) {
    fill(0);
    textSize(16);

    let keyText = coinCount === 5 ? "Press E to enter" : "You need all Souls!";
    let keyTextWidth = textWidth(keyText);
    let keyTextHeight = 16;
    fill(255, 255, 255, 150);
    rect(doorX - keyTextWidth / 2 - 10, height / 2 - 60, keyTextWidth + 70, keyTextHeight + 10, 5);

    fill(0);
    textAlign(CENTER, CENTER); 
    text(keyText, doorX, height / 2 - 50);

    if (coinCount === 5 && keyIsDown(69) && canTransition) {
      inRoom1 = true;
      canTransition = false;
      setTimeout(() => (canTransition = true), 500);
      square.x = 100; 
      square.y = height / 2;
    }
  }

  fill(255, 255, 255, 150);
  rect(width - 420, 20, 420, 40);
  fill(0);
  textSize(20);
  textFont('Courier New');
  textStyle(BOLD);
  textAlign(LEFT, CENTER);  
  text("Objective: Collect all the Souls", width - 400, 40);
}
function displayTimer() {
  fill(0, 0, 0, 150);
  rect(10, height - 50, 150, 40, 5);
  fill(255);
  textSize(20);
  textFont('Courier New');
  textAlign(CENTER, CENTER);
  text("Time: " + nf(timer, 2, 1) + "s", 85, height - 30);
}

function displayGameOverScreen() {
  background(lose); 
  if (flute.isPlaying()) {
    flute.stop();
  }


  
  if (!losesound.isPlaying()) {
    losesound.play();
  }

  fill(0, 255, 0, 100);  
  let textWidthValue = textWidth("YOU LOSE");
  let textHeight = 32;
  rect(width / 2 - textWidthValue / 2 - 20, height / 2 - textHeight / 2 - 10, textWidthValue + 40, textHeight + 20, 10);  

  fill(0);  
  textSize(32);
  textFont('Courier New');
  textAlign(CENTER, CENTER);
  text("YOU LOSE", width / 2, height / 2);
  
  backToMenuButton.show();
}
function displayWinScreen() {
  image(winning, 0, 0, width, height);
  fill(0, 255, 0, 100);  
  let textWidthValue = textWidth("YOU WIN");
  let textHeight = 32;
  rect(width / 2 - textWidthValue / 2 - 20, height / 2 - textHeight / 2 - 10, textWidthValue + 40, textHeight + 20, 10);  

  fill(0); 
  textSize(32);
  textFont('Courier New');
  textAlign(CENTER, CENTER);
  text("YOU WIN", width / 2, height / 2);

  backToMenuButton.show();  
}

function startGame() {
  gameStarted = true;
  startButton.hide();
  timerStarted = true;
  backToMenuButton.hide(); 
  
}

function backToMenu() {
  gameStarted = false;
  win = false;  
  gameOver = false;
  timer = 5;
  timerStarted = false;
  pickedItems = [];
  objectPickedUp = false;
  backToMenuButton.hide();
  startButton.show();
}

function moveSquare() {
  let isMoving = false;  

  if (keyIsDown(87) && square.y - square.size / 2 > 0) {  
    square.y -= 4;
    isMoving = true;
  }
  if (keyIsDown(83) && square.y + square.size / 2 < height) {  
    square.y += 4;
    isMoving = true;
  }
  if (keyIsDown(65) && square.x - square.size / 2 > 0) { 
    square.x -= 4;
    isMoving = true;
  }
  if (keyIsDown(68) && square.x + square.size / 2 < width) {  
    square.x += 4;
    isMoving = true;
  }

  if (isMoving && !walking.isPlaying()) {
    walking.loop();  
  } else if (!isMoving && walking.isPlaying()) {
    walking.stop();  
  }
}