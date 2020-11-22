class Player {
    constructor(top, left, width, height, staticS, movingS, jumpSpUp, jumpSpDw, attackS, reverse, spWidth, spHeight, spostamento, pathImage, pathImageReverse){
        this._top = top
        this._left = left
        this._bottom = top + height
        this._right = left + width
        this._width = width
        this._height = height
        this._reverse = reverse
        this._image = new Image()
        this._image.src = pathImage
        this._reverseImage = new Image()
        this._reverseImage.src = pathImageReverse
        this._col = 0
        this._row = 0
        this._move = false
        this._jump = false
        this._attack = false
        this._life = [100,100]
        this._first = !reverse ? true : false
        this._spWidth = spWidth
        this._spHeight = spHeight
        this._spostamento = spostamento;
        this._fermo = 0;
        this._vel = {
            x: 4,
            y: 4
        }
        this._sprite = {
            static: staticS,
            move: movingS,
            jumpUp: jumpSpUp,
            jumpDw: jumpSpDw,
            attack: attackS
        }
        this._revSprite = {
            static: this._spriteCorToRev(this._sprite.static[0], this._sprite.static[1]),
            move: this._spriteCorToRev(this._sprite.move[0], this._sprite.move[1]),
            jumpUp: this._spriteCorToRev(this._sprite.jumpUp[0], this._sprite.jumpUp[1]),
            jumpDw: this._spriteCorToRev(this._sprite.jumpDw[0], this._sprite.jumpDw[1]),
            attack: this._spriteCorToRev(this._sprite.attack[0], this._sprite.attack[1]),
        }
        this._actualSprite = this._sprite.static
    }

    set bottom(newBottom){
        this._top = newBottom - this._height
        this._bottom = newBottom
    }

    set top(newTop){
        this._bottom = newTop + this._height
        this._top = newTop
    }

    set right(newRight){
        this._left = newRight - this._width
        this._right = newRight
    }

    set left(newLeft){
        this._right = newLeft + this._width
        this._left = newLeft
    }

    _spriteCorToRev(array, row){
        let imgwidth
        if(this.constructor.name == "Ichigo") imgwidth = 1308
        else if(this.constructor.name == "Vegeth") imgwidth = 980
        let a = []
        let aInt = []
        array.forEach(element => {aInt.push(imgwidth - 80 - element)});
        a.push(aInt)
        a.push(row)
        return a
    }

    updSprite(enemy){
        if((this._left <= 0 && this._spostamento == -1) || (this._right >= canvas.width && this._spostamento == 1)) this._move = false
        if(!this._reverse){
            if(this._attack){
                this._actualSprite = this._sprite.attack
            }
            else if(this._jump && this._vel.y >= 0){
                this._actualSprite = this._sprite.jumpUp
            }
            else if(this._jump && this._vel.y < 0){
                this._actualSprite = this._sprite.jumpDw
            }
            else if(this._move){
                this._actualSprite = this._sprite.move
            }
            else{
                this._actualSprite = this._sprite.static
            }
        }
        else{
            if(this._attack){
                this._actualSprite = this._revSprite.attack
            }
            else if(this._jump && this._vel.y >= 0){
                this._actualSprite = this._revSprite.jumpUp
            }
            else if(this._jump && this._vel.y < 0){
                this._actualSprite = this._revSprite.jumpDw
            }
            else if(this._move){
                this._actualSprite = this._revSprite.move
            }
            else{
                this._actualSprite = this._revSprite.static
            }
        }
        this._col++
        this.controlDamage(enemy)
        if(this._col >= this._actualSprite[0].length){
            this._col = 0
            if(this._attack) this._attack = false
        }
    }

    _lifeBar(ctx){
        let percent = (this._life[0]*100)/this._life[1]
        if(this._first){
            ctx.fillStyle = "#000000"
            ctx.fillRect(4,4,102,12)
            ctx.fillStyle = "#FFFFFF"
            ctx.fillRect(5,5,100,10)
            ctx.fillStyle = "#00FF00"
            ctx.fillRect(5,5,percent,10)
            return
        }
        ctx.fillStyle = "#000000"
        ctx.fillRect(194, 4, 102, 12)
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(canvas.width - 105, 5, 100, 10)
        ctx.fillStyle = "#00FF00"
        ctx.fillRect(canvas.width - 105, 5, percent, 10)
    }

    jump(){
        if(this._jump){
            this._vel.x = 1.7
            this.top = this._top - this._vel.y
            this._vel.y -= 0.1 * 1 //agg vely = vely - deltavelocity * gravity
            if(this._fermo < 10) this._move = true
            if(this._left <= 0 || this._right >= canvas.width) this._move = false
            if(this._bottom > canvas.height){
                this._jump = false
                this.bottom = canvas.height - 0.1
                this._vel.x = 4
                this._vel.y = 4
                this._move = false
            }
        }
    }

    controlDamage(player){
        if (this._top <= player._bottom && 
            this._bottom >= player._top &&
            this._left <= player._right &&
            this._right >= player._left){
                if(player._attack){
                    this._life[0] -= 0.2
                }
        }
    }

    drawSprite(ctx){
        let image
        if(!this._reverse) image = this._image
        else image = this._reverseImage
        this._lifeBar(ctx)
        ctx.drawImage(image, this._actualSprite[0][this._col], this._actualSprite[1], this._spWidth, this._spHeight, this._left, this._top, this._width, this._height)
        
    }

    drawWin(ctx, color){
        ctx.font = "30px Comic Sans MS";
        ctx.fillStyle = color
        ctx.textAlign = "center";
        ctx.fillText(`${this.constructor.name} Win`, canvas.width/2, canvas.height/2)
    }
}