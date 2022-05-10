class Utils {
  constructor(timer, hpBar1, hpBar2, gameStatus, gameMenu) {
    this.hpBar1 = hpBar1;
    this.hpBar2 = hpBar2;
    this.timer = timer;
    this.gameStatus = gameStatus;
    this.gameMenu = gameMenu;
    this.timerId = null;
    this.gameTime = 60;
    this.originalTime = 60;
  }

  getGameTime () {
    return this.gameTime;
  }

  startGameTimer () {
    if (this.gameTime > 0) {
      this.timerId = setTimeout(() => { this.startGameTimer(); }, 1000);
      this.gameTime--;
      this.timer.innerText = this.gameTime;
    }
  }

  showStart() {
    this.gameStatus.style.display = 'none';
    this.gameMenu.style.display = 'flex';
  }

  initGameTimer () {
    this.gameStatus.style.display = 'none';
    this.gameMenu.style.display = 'none';
    this.gameTime = this.originalTime;
    this.startGameTimer();
  }

  determineWinner (object1, object2) {
    clearTimeout(this.timerId);
    this.gameStatus.style.display = 'flex';

    if (object1.getHealth() == object2.getHealth()) {
      this.gameStatus.innerText = 'Tie, press space to return to Main Menu';
    }

    if (object1.getHealth() > object2.getHealth() || object2.getHealth() <= 0) {
      this.gameStatus.innerText = 'Player 1 wins, press space to return to Main Menu';
    }

    if (object1.getHealth() < object2.getHealth() || object1.getHealth() <= 0) {
      this.gameStatus.innerText = 'Player 2 wins, press space to return to Main Menu';
    }
  }

  hpBar (object1, object2) {
    this.hpBar1.style.width = object1.getBarHealth() + '%';
    this.hpBar2.style.width = object2.getBarHealth() + '%';
  }

  objectHit (object1, object2) {
    return (
      object1.attackBox.position.x + object1.attackBox.attackRange >= object2.position.x &&
      object1.attackBox.position.x <= object2.position.x + object2.width &&
      object1.attackBox.position.y + object1.attackBox.height >= object2.position.y &&
      object1.attackBox.position.y <= object2.position.y + object2.height &&
      object1.isAttacking 
    );
  }

  objectFacing (object1, object2) {
    return object1.position.x < object2.position.x;
  }
}
