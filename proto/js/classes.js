class Fighter {
  constructor({ canvas, canvasContext, position, velocity, color, health, attack }) {
    this.canvas = canvas;
    this.canvasContext = canvasContext;
    this.initPosition = { ...position };
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.initHealth = health;
    this.health = health;
    this.damage = attack;
    this.isDead = false;

    //player height / width
    this.height = 150;
    this.width = 50;

    //player control
    this.direction = null;
    this.pressedLeft = false;
    this.pressedRight = false;
    this.directionLeft = 'left';
    this.directionRight = 'right';

    // movement speed
    this.moveSpeed = 5;
    this.jumpHeight = 20
    this.gravity = 0.7;

    // attack
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      width: 100,
      height: 50,
      color: 'red'
    };
    this.isAttacking = false;
  }

  draw () {
    // player
    this.canvasContext.fillStyle = this.color;
    this.canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);

    // atack box
    if (this.isAttacking) {
      this.canvasContext.fillStyle = this.attackBox.color;
      this.canvasContext.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    }
  }

  update (frontFacing) {
    this.draw();
    // atack
    this.attackBox.position.x = this.position.x + (frontFacing ? 0 : -this.width);
    this.attackBox.position.y = this.position.y;

    // player
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // drop player 
    if (this.position.y + this.height + this.velocity.y >= this.canvas.height) {
      this.velocity.y = 0;
    } else {
      // add gravity
      this.velocity.y += this.gravity;
    }

    // move player
    this.movement();
  }

  attack (pressed) {
    this.isAttacking = pressed;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  takeDamage (dmg) {
    this.health -= dmg;
    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
    }
  }

  getHealth () {
    return this.health;
  }
  getBarHealth () {
    let result = 100 * this.health / this.initHealth;

    return result < 0 ? 0 : result;
  }

  reset () {
    this.health = this.initHealth;
    this.isDead = false;
    this.position = { ... this.initPosition };
  }

  getDamage () {
    return this.damage;
  }

  movement () {
    if(this.position.x <= 0) {
      // out of bounds
      this.pressedLeft = false;
    }
    
    if(this.position.x >= this.canvas.width - this.width) {
      // out of bounds
      this.pressedRight = false;
    }

    this.velocity.x = 0;
    if (this.pressedLeft && this.direction === this.directionLeft) {
      this.velocity.x = -this.moveSpeed;
    }
    if (this.pressedRight && this.direction === this.directionRight) {
      this.velocity.x = this.moveSpeed;
    }
  }

  jump () {
    if (this.velocity.y === 0) {
      this.velocity.y = -this.jumpHeight;
    }
  }

  moveLeft (pressed) {
    this.pressedLeft = pressed;
    this.direction = this.directionLeft;
  }
  moveRight (pressed) {
    this.pressedRight = pressed;
    this.direction = this.directionRight;
  }
}
