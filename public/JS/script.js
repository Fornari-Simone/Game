
let socket = io.connect(`https://game-forno.herokuapp.com/`)
//let socket = io.connect(`http://localhost:3000`)

let player2;
let player;
let myID;
let GoAway = false;
let canvas = document.getElementById("Sprite")
let ctx = canvas.getContext("2d")
socket.on("access", (nConn, id) => {
    //nConn = 1 => arrived 2nd player
    if(nConn === 1 && player != null){
        player2 = new Vegeth(canvas.height - 65, canvas.width - 55, 55, 65, true)
    }else if(nConn === 1 && player == null){
        myID = id
        player = new Vegeth(canvas.height - 65, canvas.width - 55, 55, 65, true)
        player2 = new Ichigo(canvas.height - 40, 0, 55, 40, false)
    }else{
        myID = id
        player = new Ichigo(canvas.height - 40, 0, 55, 40, false)
    }
})
socket.on("GoAway", data => GoAway=true)
socket.on("disconn", data => {
    player2 = null;
    if (player.constructor.name == "Ichigo") {
        player = new Ichigo(canvas.height - 40, 0, 55, 40, false)
    }else{
        player = new Vegeth(canvas.height - 65, canvas.width - 55, 55, 65, true)
    }
})
socket.on("change", data => {
    player2._top = data[0]
    player2._left = data[1]
    player2._bottom = data[2]
    player2._right = data[3]
    player2._reverse = data[4]
    player2._move = data[5]
    player2._jump = data[6]
    player2._attack = data[7]
    player2._life[0] = data[8]
    player2._spostamento = data[9]
    player2._fermo = data[10]
    player2._col = data[11]
    player2._actualSprite = data[12]
})

function loop(){
    if(GoAway){
        ctx.font = "15px Comic Sans MS";
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
        ctx.fillText(`Il canale è già occupato`, canvas.width/2, canvas.height/2);
        return;
    }else if(player == null || player2 == null) {
        window.requestAnimationFrame(loop);
    }else{
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        player.updSprite(player2)
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
            socket.emit('change', myID, player.forSending())
            window.requestAnimationFrame(loop)
        }
    }
}

let gameSetting = () => {

    window.addEventListener("keydown",() => {
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
    })
    window.addEventListener("mousedown", () => {
        if(event.button == "0"){
            player._attack = true
        }
    })
    loop()
}