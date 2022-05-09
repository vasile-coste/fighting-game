class Utils {
  constructor(timer, gameStatus, hpBar1, hpBar2) {
    this.hpBar1 = hpBar1;
    this.hpBar2 = hpBar2;
    this.timer = timer;
    this.gameStatus = gameStatus;
    this.timerId = null;
    this.gameTime = 60;
    this.originalTime = 60;
  }

  getGameTime () {
    return this.gameTime;
  }

  gameTimer (object1, object2) {
    if (this.gameTime > 0) {
      this.timerId = setTimeout(() => { this.gameTimer(object1, object2); }, 1000);
      this.gameTime--;
      this.timer.innerText = this.gameTime;
    } else {
      this.determineWinner(object1, object2);
    }
  }

  determineWinner (object1, object2) {
    clearTimeout(this.timerId);
    this.gameStatus.style.display = 'flex';

    if (object1.getHealth() == object2.getHealth()) {
      this.gameStatus.innerText = 'Tie, press space to play again';
    }

    if (object1.getHealth() > object2.getHealth()) {
      this.gameStatus.innerText = 'Player 1 wins, press space to play again';
    }

    if (object1.getHealth() < object2.getHealth()) {
      this.gameStatus.innerText = 'Player 2 wins, press space to play again';
    }
    if (object1.getHealth() <= 0) {
      this.gameStatus.innerText = 'Player 2 wins, press space to play again';
    }

    if (object2.getHealth() <= 0) {
      this.gameStatus.innerText = 'Player 1 wins, press space to play again';
    }
  }

  hpBar (object1, object2) {
    this.hpBar1.style.width = object1.getBarHealth() + '%';
    this.hpBar2.style.width = object2.getBarHealth() + '%';
  }

  resetTimer () {
    this.gameStatus.style.display = 'none';
    this.gameTime = this.originalTime;
    this.gameTimer();
  }

  objectHit (object1, object2) {
    return object1.attackBox.position.x + object1.attackBox.width >= object2.position.x &&
      object1.attackBox.position.x <= object2.position.x + object2.width &&
      object1.attackBox.position.y + object1.attackBox.height >= object2.position.y &&
      object1.attackBox.position.y <= object2.position.y + object2.height &&
      object1.isAttacking;
  }

  objectFacing (object1, object2) {
    return object1.position.x < object2.position.x;
  }
}
