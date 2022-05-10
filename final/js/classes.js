class Sprite {
  constructor({
    canvasContext,
    position,
    imageSrc,
    scale = 1,
    framesMax = 1
  }) {
    // screen
    this.canvasContext = canvasContext;

    // object position
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;

    if (!this.position.offset) {
      this.position.offset = {
        x: 0,
        y: 0
      }
    }

    // onject scale
    this.scale = scale;

    // object frames
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
  }

  draw () {
    this.canvasContext.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.position.offset.x,
      this.position.y - this.position.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames () {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update () {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    canvas,
    canvasContext,
    name,
    position,
    velocity,
    health,
    attack,
    attackRange,
    width,
    height,
    scale,
    spritesRight,
    spritesLeft
  }) {
    let imageSrc = spritesRight.idle.imageSrc;
    let framesMax = spritesRight.idle.framesMax;
    super({
      canvasContext,
      position,
      imageSrc,
      scale,
      framesMax,
    })
    // screen
    this.canvas = canvas;

    // player name
    this.name = name;

    // player position
    this.initPosition = { ...position };
    this.velocity = velocity;

    // player health
    this.initHealth = health;
    this.health = health;

    // player attack power
    this.damage = attack;

    // player state
    this.isDead = false;

    //player height / width
    this.height = height;
    this.width = width;

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
      attackRange: attackRange,
      height: this.height,
    };
    this.isAttacking = false;

    // object frames
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;

    // object sprites load
    this.loadPlayer(spritesLeft, spritesRight);
  }

  loadPlayer (spritesLeft, spritesRight) {
    // load sprites for player facing left
    this.spritesLeft = spritesLeft;
    for (const sprite in this.spritesLeft) {
      try {
        this.spritesLeft[sprite].image = new Image();
        this.spritesLeft[sprite].image.src = spritesLeft[sprite].imageSrc;
      } catch (e) {
        console.log(e);
      }
    }
    // load sprites for player facing right
    this.spritesRight = spritesRight;
    for (const sprite in this.spritesRight) {
      try {
        this.spritesRight[sprite].image = new Image();
        this.spritesRight[sprite].image.src = spritesRight[sprite].imageSrc;
      } catch (e) {
        console.log(e);
      }
    }
  }

  update (rightFacing) {
    this.rightFacing = rightFacing;

    this.draw();

    // stop animation if player is dead and 
    if (this.isDead && this.framesCurrent == this.framesMax - 1) {
      return false;
    }
    this.animateFrames();

    // atack
    if(this.rightFacing) {
      this.attackBox.position.x = this.position.x - this.width * (this.attackBox.attackRange / this.width) + this.attackBox.attackRange;
    } else {
      this.attackBox.position.x = this.position.x + this.width - this.attackBox.attackRange;
    }
    this.attackBox.position.y = this.position.y;

    // testing show hitbox
    // player
    // this.canvasContext.fillStyle = 'blue';
    // this.canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);
    // if (this.isAttacking) {
    //   // atack range
    //   this.canvasContext.fillStyle = 'red';
    //   this.canvasContext.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.attackRange, this.attackBox.height);
    // }

    // player
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // drop player 
    if (this.position.y + this.height + this.velocity.y >= this.canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330
    } else {
      // add gravity
      this.velocity.y += this.gravity;
    }

    // move player
    this.movement();
  }

  attack (pressed) {
    this.isAttacking = pressed;

    this.switchSprite('attack1');

    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  takeDamage (dmg) {
    this.health -= dmg;
    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      this.switchSprite('death');
    } else {
      this.switchSprite('takeHit');
    }
  }

  reset () {
    this.health = this.initHealth;
    this.isDead = false;
    this.position = { ... this.initPosition };
    this.switchSprite('idle');
  }

  movement () {
    if (this.position.x <= 0) {
      // out of bounds
      this.pressedLeft = false;
    }

    if (this.position.x >= this.canvas.width - this.width) {
      // out of bounds
      this.pressedRight = false;
    }

    this.velocity.x = 0;

    // move left / right / idle
    if (this.pressedLeft && this.direction === this.directionLeft) {
      this.velocity.x = -this.moveSpeed;
      this.switchSprite('run');
    } else if (this.pressedRight && this.direction === this.directionRight) {
      this.velocity.x = this.moveSpeed;
      this.switchSprite('run');
    } else if (this.health > 0) {
      this.switchSprite('idle');
    }

    // jump / fall
    if (this.velocity.y < 0) {
      this.switchSprite('jump')
    } else if (this.velocity.y > 0) {
      this.switchSprite('fall')
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

  switchSprite (sprite) {
    if (this.rightFacing) {
      // overriding all other animations with the attack animation
      if (
        this.image === this.spritesRight.attack1.image &&
        this.framesCurrent < this.spritesRight.attack1.framesMax - 1
      ) {
        return false;
      }

      // override when fighter gets hit
      if (
        this.image === this.spritesRight.takeHit.image &&
        this.framesCurrent < this.spritesRight.takeHit.framesMax - 1
      ) {
        return false;
      }

      switch (sprite) {
        case 'idle':
          if (this.image !== this.spritesRight.idle.image) {
            this.image = this.spritesRight.idle.image;
            this.framesMax = this.spritesRight.idle.framesMax;
            this.framesCurrent = 0;
          }
          break

        case 'run':
          if (this.image !== this.spritesRight.run.image) {
            this.image = this.spritesRight.run.image
            this.framesMax = this.spritesRight.run.framesMax
            this.framesCurrent = 0
          }
          break

        case 'jump':
          if (this.image !== this.spritesRight.jump.image) {
            this.image = this.spritesRight.jump.image
            this.framesMax = this.spritesRight.jump.framesMax
            this.framesCurrent = 0
          }
          break

        case 'fall':
          if (this.image !== this.spritesRight.fall.image) {
            this.image = this.spritesRight.fall.image
            this.framesMax = this.spritesRight.fall.framesMax
            this.framesCurrent = 0
          }
          break

        case 'attack1':
          if (this.image !== this.spritesRight.attack1.image) {
            this.image = this.spritesRight.attack1.image
            this.framesMax = this.spritesRight.attack1.framesMax
            this.framesCurrent = 0
          }
          break

        case 'takeHit':
          if (this.image !== this.spritesRight.takeHit.image) {
            this.image = this.spritesRight.takeHit.image;
            this.framesMax = this.spritesRight.takeHit.framesMax;
            this.framesCurrent = 0;
          }
          break;

        case 'death':
          if (this.image !== this.spritesRight.death.image) {
            this.image = this.spritesRight.death.image;
            this.framesMax = this.spritesRight.death.framesMax;
            this.framesCurrent = 0;
          }
          break;
      }
    } else {
      // overriding all other animations with the attack animation
      if (
        this.image === this.spritesLeft.attack1.image &&
        this.framesCurrent < this.spritesLeft.attack1.framesMax - 1
      ) {
        return false;
      }

      // override when fighter gets hit
      if (
        this.image === this.spritesLeft.takeHit.image &&
        this.framesCurrent < this.spritesLeft.takeHit.framesMax - 1
      ) {
        return false;
      }

      switch (sprite) {
        case 'idle':
          if (this.image !== this.spritesLeft.idle.image) {
            this.image = this.spritesLeft.idle.image;
            this.framesMax = this.spritesLeft.idle.framesMax;
            this.framesCurrent = 0;
          }
          break

        case 'run':
          if (this.image !== this.spritesLeft.run.image) {
            this.image = this.spritesLeft.run.image
            this.framesMax = this.spritesLeft.run.framesMax
            this.framesCurrent = 0
          }
          break

        case 'jump':
          if (this.image !== this.spritesLeft.jump.image) {
            this.image = this.spritesLeft.jump.image
            this.framesMax = this.spritesLeft.jump.framesMax
            this.framesCurrent = 0
          }
          break

        case 'fall':
          if (this.image !== this.spritesLeft.fall.image) {
            this.image = this.spritesLeft.fall.image
            this.framesMax = this.spritesLeft.fall.framesMax
            this.framesCurrent = 0
          }
          break

        case 'attack1':
          if (this.image !== this.spritesLeft.attack1.image) {
            this.image = this.spritesLeft.attack1.image
            this.framesMax = this.spritesLeft.attack1.framesMax
            this.framesCurrent = 0
          }
          break

        case 'takeHit':
          if (this.image !== this.spritesLeft.takeHit.image) {
            this.image = this.spritesLeft.takeHit.image;
            this.framesMax = this.spritesLeft.takeHit.framesMax;
            this.framesCurrent = 0;
          }
          break;

        case 'death':
          if (this.image !== this.spritesLeft.death.image) {
            this.image = this.spritesLeft.death.image;
            this.framesMax = this.spritesLeft.death.framesMax;
            this.framesCurrent = 0;
          }
          break;
      }
    }
  }

  getHealth () {
    return this.health;
  }

  getBarHealth () {
    let result = 100 * this.health / this.initHealth;

    return result < 0 ? 0 : result;
  }

  getDamage () {
    return this.damage;
  }

}
