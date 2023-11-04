const spinButton=document.getElementById("spinCounterClockwise");
const counterSpinButton=document.getElementById("spinClockWise");
const spinNewPieceButton=document.getElementById("spinNewPiece");
const moveNewPieceButton=document.getElementById("moveNewPiece");
const moveLeft=document.getElementById("moveLeft")
const moveRight=document.getElementById("moveRight")
const moveDown=document.getElementById("moveDown")
const clockCanvas=document.getElementById("clockCanvas");
const clockCTX=clockCanvas.getContext("2d")
const moveCanvas=document.getElementById("moveCanvas");
const moveCTX=moveCanvas.getContext("2d")


let pieceNum=Math.floor(Math.random()*14)+1
let clockWisePiece = new Piece(pieceDictionary[pieceNum],pieceColor[pieceNum],pieceCenter[pieceNum],5)

let pieces={
    'spin':pieceNum,
    'move':pieceNum
}
pieceNum=Math.floor(Math.random()*14)+1
let movePiece = new Piece(pieceDictionary[pieceNum],pieceColor[pieceNum],pieceCenter[pieceNum],5)
pieces['move']=pieceNum
console.log(pieces)

function pieceSetup(piece,context){
    for (let i=0; i<4; i++){
        piece.move("down")//initial centering of piece
    }
    piece.move("right")
    piece.move("right")
    piece.render(context,10,.75)
}

function rulesSetup(){
    for (let i=0; i<4; i++){
        clockWisePiece.move("down")//initial centering of piece
        movePiece.move('down')
    }
    clockWisePiece.move("right")
    clockWisePiece.move("right")
    movePiece.move('right')
    movePiece.move('right')
    clockWisePiece.render(clockCTX,10,.75)
    movePiece.render(moveCTX,10,.75)
}
// rulesSetup()
pieceSetup(movePiece,moveCTX)
pieceSetup(clockWisePiece,clockCTX)
function spinClick(event){
    let direction = event.target.getAttribute("id")
    let offset=1;
    if (direction==="spinClockWise"){
        offset=-1;
    }

    let newPos=spin(clockWisePiece,offset)
    clockWisePiece.setPosition(newPos)
    initialize(clockCanvas,clockCTX)
    clockWisePiece.render(clockCTX,10,.75)
}

function moveBlock(event){
    let direction = event.target.getAttribute("id")
    if (direction==="moveLeft"){
        movePiece.move("left")
    }
    if (direction==="moveRight"){
        movePiece.move("right")
    }
    if (direction==="moveDown"){
        movePiece.move("down")
    }
    initialize(moveCanvas,moveCTX)
    movePiece.render(moveCTX,10,.75)

}

function newPiece(event){
    let field=event.target.getAttribute("id").slice(0,4)
    if (field==='spin'){
        console.log(pieces[field])
        pieces[field]++
        if (+pieces[field]===15){pieces[field]=1}
        initialize(clockCanvas,clockCTX)
        clockWisePiece = new Piece(pieceDictionary[pieces[field]],pieceColor[pieces[field]],pieceCenter[pieces[field]],5)
        pieceSetup(clockWisePiece,clockCTX)
        return
    }
    if (field==='move'){
        console.log(pieces[field])
        pieces[field]++
        if (+pieces[field]===15){pieces[field]=1}
        initialize(moveCanvas,moveCTX)
        movePiece = new Piece(pieceDictionary[pieces[field]],pieceColor[pieces[field]],pieceCenter[pieces[field]],5)
        pieceSetup(movePiece,moveCTX)
        return
    }

    console.log(pieces[field])

}

document.addEventListener('keydown', (event) => {
    console.log(event.key)
    var name = event.key;
    var code = event.code;
    if (code==="ShiftLeft"){
        let newPos=spin(clockWisePiece,1)
        clockWisePiece.setPosition(newPos)
        initialize(clockCanvas,clockCTX)
        clockWisePiece.render(clockCTX,10,.75)
        return
    }
    if (code==="ShiftRight"){
        let newPos=spin(clockWisePiece,-1)
        clockWisePiece.setPosition(newPos)
        initialize(clockCanvas,clockCTX)
        clockWisePiece.render(clockCTX,10,.75)
    }
}, false)


spinNewPieceButton.addEventListener("click",newPiece)
spinButton.addEventListener("click",spinClick)
counterSpinButton.addEventListener("click",spinClick)

moveNewPieceButton.addEventListener("click",newPiece)
moveLeft.addEventListener("click",moveBlock)
moveRight.addEventListener("click",moveBlock)
moveDown.addEventListener("click",moveBlock)