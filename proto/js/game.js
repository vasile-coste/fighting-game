/** Timer */
const timerUI = document.getElementById('timer');
const gameStatusUI = document.getElementById('gameStatus');

/** players health bar */
const hpBar1 = document.getElementById('hpBar1');
const hpBar2 = document.getElementById('hpBar2');

/** Canvas */
const canvas = document.getElementById('game-area');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// context.fillRect(0, 0, canvas.width, canvas.height);


/** Players */
const player1 = new Fighter({
  canvas: canvas,
  canvasContext: context,
  position: {
    x: 50,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  frontFacing: true,
  color: 'green',
  health: 100,
  attack: 10
});

const player2 = new Fighter({
  canvas: canvas,
  canvasContext: context,
  position: {
    x: canvas.width - 100,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  frontFacing: false,
  color: 'blue',
  health: 100,
  attack: 10
});

const utils = new Utils(timerUI, gameStatusUI, hpBar1, hpBar2);
utils.gameTimer(player1, player2);


/** Game start */
function startGame () {
  window.requestAnimationFrame(startGame);

  // reset background
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // update players on screen
  player1.update(utils.objectFacing(player1, player2));
  player2.update(utils.objectFacing(player2, player1));

  // player 1 attacks player 2
  if (utils.objectHit(player1, player2)) {
    player1.attack(false);
    player2.takeDamage(player1.getDamage());
    console.log('player 1 hit player 2');
  }
  // player 2 attacks player 1
  if (utils.objectHit(player2, player1)) {
    player2.attack(false);
    player1.takeDamage(player2.getDamage());
    console.log('player 2 hit player 1');
  }

  // display health status
  utils.hpBar(player1, player2)

  // check if game over based on health
  if (player1.getHealth() <= 0 || player2.getHealth() <= 0) {
    utils.determineWinner(player1, player2);
  }
}

startGame();

/** Move player keys listeners*/
window.addEventListener('keydown', (e) => {
  if (!player1.isDead && !player2.isDead && utils.getGameTime() > 0) {
    switch (e.key) {
      // player 1
      case 'd':
        player1.moveRight(true);
        break;
      case 'a':
        player1.moveLeft(true);
        break;
      case 'w':
        player1.jump();
        break;
      case 'j':
        player1.attack(true);
        break;

      // player 2
      case 'ArrowRight':
        player2.moveRight(true);
        break;
      case 'ArrowLeft':
        player2.moveLeft(true);
        break;
      case 'ArrowUp':
        player2.jump();
        break;
      case '1':
        player2.attack(true);
        break;
    }

  }
});
window.addEventListener('keyup', (e) => {
  if(e.key == ' ' && (player1.isDead || player2.isDead || utils.getGameTime() == 0)){
    player1.reset();
    player2.reset();
    utils.resetTimer();
  }
  if (!player1.isDead && !player2.isDead && utils.getGameTime() > 0) {
    switch (e.key) {
      // player 1
      case 'd':
        player1.moveRight(false);
        break;
      case 'a':
        player1.moveLeft(false);
        break;

      // player 2
      case 'ArrowRight':
        player2.moveRight(false);
        break;
      case 'ArrowLeft':
        player2.moveLeft(false);
        break;
    }
  }
});
