/** UI controls */
const timerUI = document.getElementById('timer');
const gameStatusUI = document.getElementById('gameStatus');
const gameMenuUI = document.getElementById('gameMenu');
const startGameUI = document.getElementById('startGame');

/** Players health bar */
const hpBar1 = document.getElementById('hpBar1');
const hpBar2 = document.getElementById('hpBar2');

/** Canvas */
const canvas = document.getElementById('game-area');
const context = canvas.getContext('2d');

/** Game screen size */
canvas.width = 1024;
canvas.height = 576;

/** Available players */
const players = {
  samurai: {
    canvas: canvas,
    canvasContext: context,
    name: 'samurai',
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
    health: 100,
    attack: 10,
    attackRange: 250,
    width: 50,
    height: 150,
    scale: 2.5,
    spritesLeft: {
      idle: {
        imageSrc: './img/players/samurai/face_left/Idle.png',
        framesMax: 8
      },
      run: {
        imageSrc: './img/players/samurai/face_left/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/players/samurai/face_left/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc: './img/players/samurai/face_left/Fall.png',
        framesMax: 2
      },
      attack1: {
        imageSrc: './img/players/samurai/face_left/Attack1.png',
        framesMax: 6
      },
      takeHit: {
        imageSrc: './img/players/samurai/face_left/Take hit.png',
        framesMax: 4
      },
      death: {
        imageSrc: './img/players/samurai/face_left/Death.png',
      }
    },
    spritesRight: {
      idle: {
        imageSrc: './img/players/samurai/face_right/Idle.png',
        framesMax: 8
      },
      run: {
        imageSrc: './img/players/samurai/face_right/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/players/samurai/face_right/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc: './img/players/samurai/face_right/Fall.png',
        framesMax: 2
      },
      attack1: {
        imageSrc: './img/players/samurai/face_right/Attack1.png',
        framesMax: 6
      },
      takeHit: {
        imageSrc: './img/players/samurai/face_right/Take hit.png',
        framesMax: 4
      },
      death: {
        imageSrc: './img/players/samurai/face_right/Death.png',
        framesMax: 6
      }
    }
  },
  ninja:{
    canvas: canvas,
    canvasContext: context,
    name: 'ninja',
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
        imageSrc: './img/players/ninja/face_left/Idle.png',
        framesMax: 4
      },
      run: {
        imageSrc: './img/players/ninja/face_left/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/players/ninja/face_left/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc: './img/players/ninja/face_left/Fall.png',
        framesMax: 2
      },
      attack1: {
        imageSrc: './img/players/ninja/face_left/Attack1.png',
        framesMax: 4
      },
      takeHit: {
        imageSrc: './img/players/ninja/face_left/Take hit.png',
        framesMax: 3
      },
      death: {
        imageSrc: './img/players/ninja/face_left/Death.png',
        framesMax: 7
      }
    },
    spritesRight: {
      idle: {
        imageSrc: './img/players/ninja/face_right/Idle.png',
        framesMax: 4
      },
      run: {
        imageSrc: './img/players/ninja/face_right/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/players/ninja/face_right/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc: './img/players/ninja/face_right/Fall.png',
        framesMax: 2
      },
      attack1: {
        imageSrc: './img/players/ninja/face_right/Attack1.png',
        framesMax: 4
      },
      takeHit: {
        imageSrc: './img/players/ninja/face_right/Take hit.png',
        framesMax: 3
      },
      death: {
        imageSrc: './img/players/ninja/face_right/Death.png',
        framesMax: 7
      }
    }
  }
};



const utils = new Utils(timerUI, hpBar1, hpBar2, gameStatusUI, gameMenuUI);
utils.showStart();

/** Game elements init */
let background = null;
let shop = null;
let player1 = null;
let player2 = null;

/** Start the game */
startGameUI.addEventListener('click', () => {
  const bg = document.querySelector('input[name="bg"]:checked').value;
  const pl = document.querySelectorAll('.players:checked');
  if (pl.length !== 2) {
    alert('Please select 2 players to continue!');
    return false;
  }

  /** Init game timer */
  utils.initGameTimer();

  /** Background init */
  background = new Sprite({
    canvasContext: context,
    position: {
      x: 0,
      y: 0
    },
    imageSrc: `./img/background/bg${bg}.png`
  });

  /** Init bg elements */
  shop = new Sprite({
    canvasContext: context,
    position: {
      x: 600,
      y: 128
    },
    imageSrc: './img/sprites/shop.png',
    scale: 2.75,
    framesMax: 6
  });

  /** Players init */
  player1 = new Fighter(players[pl[0].value]);
  player2 = new Fighter(players[pl[1].value]);

  // reset player state, position, health and animation | for replay
  player1.reset();
  player2.reset();

  /** Start animating the game */
  startGame();
});


/** Game start */
let animationFrame = null;
function startGame () {

  // reset background and its elements
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

  // update players on screen
  player1.update(utils.objectFacing(player1, player2));
  player2.update(utils.objectFacing(player2, player1));

  // display health status
  utils.hpBar(player1, player2)

  // check if game over based on health and tiimer
  if (player1.getHealth() <= 0 || player2.getHealth() <= 0 || utils.getGameTime() == 0) {
    utils.determineWinner(player1, player2);
    // stop animationg
    setTimeout(() => {
      window.cancelAnimationFrame(animationFrame);
    }, 1000);
  }

  // continue animating
  animationFrame = window.requestAnimationFrame(startGame);
}

/** Move player keys listeners*/
window.addEventListener('keydown', (e) => {
  // take no action if players are not init
  if (!player1 && !player2) {
    return false;
  }

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
  // take no action if players are not init
  if (!player1 && !player2) {
    return false;
  }

  if (e.key == ' ' && (player1.isDead || player2.isDead || utils.getGameTime() == 0)) {
    utils.showStart();
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
