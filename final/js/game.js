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
const players = [
  {
    canvas: canvas,
    canvasContext: context,
    name: 'samuraiMack',
    position: {
      x: 50,
      y: 0,
      offset: {
        x: 215,
        y: 157
      }
    },
    velocity: {
      x: 0,
      y: 10,
    },
    rightFacing: true,
    health: 100,
    attack: 10,
    attackRange:250,
    width: 50,
    height: 150,
    scale: 2.5,
    spritesLeft: {
      idle: {
        imageSrc: './img/samuraiMack/face_left/Idle.png',
        framesMax: 8
      },
      run: {
        imageSrc: './img/samuraiMack/face_left/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/samuraiMack/face_left/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc: './img/samuraiMack/face_left/Fall.png',
        framesMax: 2
      },
      attack1: {
        imageSrc: './img/samuraiMack/face_left/Attack1.png',
        framesMax: 6
      },
      takeHit: {
        imageSrc: './img/samuraiMack/face_left/Take hit.png',
        framesMax: 4
      },
      death: {
        imageSrc: './img/samuraiMack/face_left/Death.png',
      }
    },
    spritesRight: {
      idle: {
        imageSrc: './img/samuraiMack/face_right/Idle.png',
        framesMax: 8
      },
      run: {
        imageSrc: './img/samuraiMack/face_right/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/samuraiMack/face_right/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc: './img/samuraiMack/face_right/Fall.png',
        framesMax: 2
      },
      attack1: {
        imageSrc: './img/samuraiMack/face_right/Attack1.png',
        framesMax: 6
      },
      takeHit: {
        imageSrc: './img/samuraiMack/face_right/Take hit.png',
        framesMax: 4
      },
      death: {
        imageSrc: './img/samuraiMack/face_right/Death.png',
        framesMax: 6
      }
    }
  },
  {
    canvas: canvas,
    canvasContext: context,
    name: 'kenji',
    position: {
      x: canvas.width - 100,
      y: 100,
      offset: {
        x: 215,
        y: 169
      }
    },
    velocity: {
      x: 0,
      y: 10,
    },
    health: 100,
    attack: 10,
    attackRange: 220,
    width: 50,
    height: 150,
    scale: 2.5,
    spritesLeft: {
      idle: {
        imageSrc: './img/kenji/face_left/Idle.png',
        framesMax: 4
      },
      run: {
        imageSrc: './img/kenji/face_left/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/kenji/face_left/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc: './img/kenji/face_left/Fall.png',
        framesMax: 2
      },
      attack1: {
        imageSrc: './img/kenji/face_left/Attack1.png',
        framesMax: 4
      },
      takeHit: {
        imageSrc: './img/kenji/face_left/Take hit.png',
        framesMax: 3
      },
      death: {
        imageSrc: './img/kenji/face_left/Death.png',
        framesMax: 7
      }
    },
    spritesRight: {
      idle: {
        imageSrc: './img/kenji/face_right/Idle.png',
        framesMax: 4
      },
      run: {
        imageSrc: './img/kenji/face_right/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/kenji/face_right/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc: './img/kenji/face_right/Fall.png',
        framesMax: 2
      },
      attack1: {
        imageSrc: './img/kenji/face_right/Attack1.png',
        framesMax: 4
      },
      takeHit: {
        imageSrc: './img/kenji/face_right/Take hit.png',
        framesMax: 3
      },
      death: {
        imageSrc: './img/kenji/face_right/Death.png',
        framesMax: 7
      }
    }
  }
];

// background elements
const background = new Sprite({
  canvasContext: context,
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background/bg1.png'
});

const shop = new Sprite({
  canvasContext: context,
  position: {
    x: 600,
    y: 128
  },
  imageSrc: './img/sprites/shop.png',
  scale: 2.75,
  framesMax: 6
});

/** Players */

const player1 = new Fighter(players[0]);
const player2 = new Fighter(players[1]);

const utils = new Utils(timerUI, gameStatusUI, hpBar1, hpBar2);
utils.gameTimer(player1, player2);


/** Game start */
function startGame () {

  // reset background
  background.update();
  shop.update();

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
  
  // update players on screen
  player1.update(utils.objectFacing(player1, player2));
  player2.update(utils.objectFacing(player2, player1));

  // request next frame
  window.requestAnimationFrame(startGame);
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
  if (e.key == ' ' && (player1.isDead || player2.isDead || utils.getGameTime() == 0)) {
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
