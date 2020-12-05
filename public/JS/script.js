
//let socket = io.connect(`https://game-forno.herokuapp.com`)
let socket = io.connect(`http://localhost:3000/`)

let player2;
let player;
let canvas = document.getElementById("Sprite")
let ctx = canvas.getContext("2d")
socket.on("access", data => {
    console.log(data)
    if(data === 1 && player != null){
        player2 = new Vegeth(canvas.height - 65, canvas.width - 55, 55, 65, true)
    }
    else if(data === 1 && player == null){
        player = new Vegeth(canvas.height - 65, canvas.width - 55, 55, 65, true)
        player2 = new Ichigo(canvas.height - 40, 0, 55, 40, false)
    }
    else{
        player = new Ichigo(canvas.height - 40, 0, 55, 40, false)
    }
})
socket.on("disconn", data => {
    if(data === 1) player2 == null;
})
socket.on("change", data => {
    player2 = player.constructor.name == "Ichigo" ? 
        new Vegeth(canvas.height - 65, canvas.width - 55, 55, 65, true) :
        new Ichigo(canvas.height - 40, 0, 55, 40, false);
    player2._top = data._top;
    player2._left = data._left;
    player2._bottom = data._bottom;
    player2._right = data._right;
    player2._reverse = data._reverse;
    player2._col = data._col;
    player2._row = data._row;
    player2._move = data._move;
    player2._jump = data._jump;
    player2._attack = data._attack;
    player2._life[0] = data._life[0];
    player2._spostamento = data._spostamento;
    player2._fermo = data._fermo;
    player2._vel.x = data._vel.x;
    player2._vel.y = data._vel.y;
    player2._actualSprite = data._actualSprite;
    console.log(player2)
})

function loop(){
    console.log(player == null || player2 == null)
    if(player == null || player2 == null) {
        //ctx.font = "30px Comic Sans MS";
        //ctx.fillStyle = "green"
        //ctx.textAlign = "center";
        //ctx.fillText(`Wait of another player`, canvas.width/2, canvas.height/2)
        window.requestAnimationFrame(loop);
        console.log("hello")
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.updSprite(player2)
    console.log(player2)
    player.jump()
    player.drawSprite(ctx) 
    player2.drawSprite(ctx)
    if(player._move) {
        player.left = player._left + (player._vel.x * player._spostamento)//spostamento
        player._fermo = 0
    }
    else player._fermo++
    if(player._life[0] <= 0) player2.drawWin(ctx, "red")
    else if(player2._life[0] <= 0) player.drawWin(ctx, "blue")
    else{
        socket.emit('change', player)
        window.requestAnimationFrame(loop)
    }
}

let gameSetting = () => {

    window.addEventListener("keydown",(event) => {
        if(event.code == "KeyD" ){
            player._move = true
            player._spostamento = 1
            player._reverse = false
        }
        if(event.code == "KeyA"){
            player._move = true
            player._spostamento = -1
            player._reverse = true
        }
        if(event.code == "KeyW"){
            player._jump = true
        }
        event.preventDefault()
    })
    window.addEventListener("keyup", () => {
        if(event.code == "KeyD"){
            player._move = false
        }
        if(event.code == "KeyA"){
            player._move = false
        }
        if(event.button == "0"){
            player._attack = true
        }
    })
    window.addEventListener("mousedown", () => {
        if(event.button == "0"){
            player._attack = true
        }
    })
    loop()
}