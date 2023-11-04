var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var nextWindow=document.getElementById("nextPiece");
var pieceCtx=nextWindow.getContext("2d");
var playerScore=document.getElementById("scoreArea")
var checkBox=document.getElementById("showCenter")
ctx.fillStyle = "#000000";
const HEIGHT =4;
var timeSet=1000;
var level=0;
var pauseButton=document.getElementById("pause")
var newGameButton=document.getElementById("newGame")
var pauseFlag=false;
var gameOnGoingFlag=false;
const speedGauge = document.querySelector('.gauge')
var showCenterFlag=false

let speedDict={
    0:1000,
    1:800,
    2:600,
    3:400,
    4:200,
    5:180,
    6:160,
    7:140,
    8:120,
    9:100,
    10:80
    

}
let testPiece = new Piece([[5,6],[5,7],[5,8],[5,9],[5,10]],"red",[5,8],5)
let randomPiece=Math.floor(Math.random()*14)+1;
let testPiece2 = new Piece(pieceDictionary[randomPiece],pieceColor[randomPiece],pieceCenter[randomPiece],5)

let score=0;


let nextState={
    existingPiece:true,
    nextPiece:[
        Math.floor(Math.random()*14)+1,
        Math.floor(Math.random()*14)+1,
        Math.floor(Math.random()*14)+1]
}

let columnsBlock=[]
for (let i=0; i<COLUMNS;i++){
    columnsBlock.push([])
}

initialize(c,ctx)
initialize(nextWindow,pieceCtx)

// nextPiece()

async function attach(piece){
    
    let x
    let y
    let color
    let upload =[]
    let uploadObj=[]

    for (let i=0; i<piece.position.length; i++){
        [y,x]=piece.position[i]
        if (y<0){
            endGame(ctx)

            return
        }
        color=piece.color
        uploadObj.push({info:1, color:color})
        upload.push([y,x])
        columnsBlock[x].push({ypos:y, data:{info:1, color:color}})
        columnsBlock[x].sort((a,b)=>{return b.ypos-a.ypos})
    }//for loop
    testBoard.set(upload,uploadObj)
    nextState.existingPiece=false;
    testPiece2.flagBottom=true
    let deleteMe=testBoard.rowChecker()
    let newLevel
    if (newLevelCheck(testBoard.lines,deleteMe.length)){
        level++
        timeSet=speedDict[level]
        clearInterval(myTimer)
        myTimer=setInterval(myTimerFnc,timeSet)
    }
    if(deleteMe.length>0)
    {
        testBoard.lines+=deleteMe.length 
        //remove pause event handler
        pauseButton.removeEventListener("click",pauseAction)
        await handleDelete(deleteMe)
        //re-add pause event handler
        pauseButton.addEventListener("click",pauseAction)
        testBoard.render()
    }
    score+=5*(1+level);
    playerScore.value=`score: ${score}`
    testBoard.pieces++
    setGauge(level*10+(testBoard.lines%8)*1.25)   
}

function newLevelCheck(lines,deleteLines){
    let lowNum=lines%8;//
    if (lowNum+deleteLines>=8){
        return true
    }
    return false
}

function buildState(columnsBlock){
    let x
    let position=[]
    let cellInfo=[]

    for (let i=0; i<columnsBlock.length;i++){
      for (let j=0; j<columnsBlock[i].length;j++){
        let ypos=columnsBlock[i][j].ypos
        let info=columnsBlock[i][j].data.info
        let color=columnsBlock[i][j].data.color
        x=i

        position.push([ypos,x])
        cellInfo.push({info:info,color:color})
      }
      testBoard.set(position,cellInfo)
      position=[]
      cellInfo=[]
    }
  }



function rotate(blockPiece,direction){
    let kickCount=0;
    let offset=1
    if (direction==='counter')
        offset=-1;
    let center=blockPiece.center
    let offSetY=[]
    let offSetX=[]
    for (let i=0; i<blockPiece.size;i++){
        offSetX.push(blockPiece.position[i][1]-center[1])
        offSetY.push(blockPiece.position[i][0]-center[0])
    }
    let output = [];
    let x;
    let y;
    for (let i=0; i<blockPiece.size;i++){
        x=center[1]+offset*offSetY[i]
        y=center[0]-offset*offSetX[i]
        output.push([y,x])
        if ((y>ROWS-1))//out of bounds y
            {
                return false}
    }
    let centerCopy=[0,0]
    centerCopy[0]=blockPiece.center[0]
    centerCopy[1]=blockPiece.center[1]
    for (let j=0; j<5; j++){
        [y,x]=output[j]
        if (x<0){ 
            if (kickCount===1){
                return false//already kicked once
            }           
            output.forEach((a)=>a[1]++)
            centerCopy[1]++
            kickCount++
            if (output[j][1]<0)
            {return false}
        }
        if ((x>COLUMNS-1)){
            
            output.forEach((a)=>a[1]--)
            centerCopy[1]--
            kickCount++
            if (output[j][1]>COLUMNS-1)
            {return false}
        }
        if (testBoard.clipCheck(output)){
            if(kickCount===1)
                {return false}//TODO tweak
            output.forEach((a)=>a[1]++)
            centerCopy[1]++//test right direction first.
            if (testBoard.clipCheck(output))//if right fails, check left adjust x coord down by 2.  
                {output.forEach((a)=>a[1]-=2)
                centerCopy[1]-=2;
                if (testBoard.clipCheck(output))//neither left nor right worked
                    {return false}
                }
            kickCount++

        }
    }
    if (kickCount>0){
        blockPiece.center[0]=centerCopy[0]
        blockPiece.center[1]=centerCopy[1]
    }
    blockPiece.setPosition(output)
    eraseBig()
    eraseSmall()
    blockPiece.render(ctx)
    testBoard.render()
    nextPiece()

    return
}

function nextPiece(){
    let showPiece
    eraseSmall()
    for (let i=0; i<3;i++)
    {
        let nextPiece=nextState.nextPiece[i]
        showPiece=new Piece(
            pieceDictionary[nextPiece],
            pieceColor[nextPiece],
            pieceCenter[nextPiece],
            5)
        showPiece.render(pieceCtx,i*120+60,.5)
        delete Piece.showPiece
    }
}

function myTimerFnc(){

    if (gameOnGoingFlag===false)
    {return}
    if (!nextState.existingPiece){
        let newPiece=nextState.nextPiece[0]
        nextState.nextPiece[0]=nextState.nextPiece[1]
        nextState.nextPiece[1]=nextState.nextPiece[2]
        nextState.nextPiece[2]=Math.floor(Math.random()*14)+1;
        testPiece2=new Piece(
            pieceDictionary[newPiece],
            pieceColor[newPiece],
            pieceCenter[newPiece],
            5)
        let randomShift=Math.floor(Math.random()*7)//shift between 0 and 7 spaces right
        testPiece2.shift([0,randomShift])
        nextState.existingPiece=true
        eraseSmall()
        nextPiece()
        return
    }//no existing piece
    let array=[...testPiece2.getPosition()];
    array.forEach((a)=> a[0]++)

    if (testBoard.clipCheck(array)===true){
        attach(testPiece2)
        if (gameOnGoingFlag===false){return}
        eraseBig()
        testBoard.render()
        nextPiece()
    }
    else
        {testPiece2.move("down")
        eraseBig()
        testPiece2.render(ctx)
        if (showCenterFlag===true){
            testPiece2.drawCenter(ctx)
        }
        testBoard.render()
        nextPiece()
        drawShadow(ctx,testPiece2,1,0)
    }
}




// testPiece2.render(ctx,0,1)

testBoard= new Board(ROWS, COLUMNS, ctx,c)
// testBoard.render()

function pieceFlip(blockPiece){
    let offSetY=[]
    let offSetX=[]
    let center=blockPiece.center
    for (let i=0; i<blockPiece.size;i++){
        offSetX.push(blockPiece.position[i][1]-center[1])
        offSetY.push(blockPiece.position[i][0]-center[0])
    }
    let output = [];
    let x;
    let y;
    for (let i=0; i<blockPiece.size;i++){
        x=center[1]-offSetX[i]
        y=center[0]+offSetY[i]
        output.push([y,x])
    }
    for (let j=0; j<5; j++){
        [y,x]=output[j]
        if (x<0 || x>COLUMNS-1){
            return false//TODO potentially add kick
        }
    }
    if (testBoard.clipCheck(output)){
        return false
    }
    blockPiece.setPosition(output)
    eraseBig()
    eraseSmall()
    blockPiece.render(ctx)
    testBoard.render()
    nextPiece()

    return

}


document.addEventListener('keydown', (event) => {
    
    if (testPiece2.flagBottom){return}//gaurd clause.  
    if (pauseFlag===true){return}//don't move when paused.
    if (gameOnGoingFlag===false){return}  
    var name = event.key;
    var code = event.code;
    var array=testPiece2.getPosition();
    if (name==='Control'){
        pieceFlip(testPiece2)
        drawShadow(ctx,testPiece2,1,0)
    }
    if (name==='ArrowRight'){
        event.preventDefault()
        array.forEach((element) => element[1]++)
        if (testBoard.clipCheck(array)===false){
            testPiece2.move("right")
            eraseBig();
            testPiece2.render(ctx)
            if (showCenterFlag===true){
                testPiece2.drawCenter(ctx)
            }
            testBoard.render(ctx)
            drawShadow(ctx,testPiece2,1,0)
        }
    }
    if (name==='ArrowLeft'){
        event.preventDefault()
        array.forEach((element) => element[1]--)
        if (testBoard.clipCheck(array)===false){
            testPiece2.move("left")
            eraseBig();
            testPiece2.render(ctx)
            if (showCenterFlag===true){
                testPiece2.drawCenter(ctx)
            }
            testBoard.render(ctx)
            drawShadow(ctx,testPiece2,1,0)
        }
    }
    if (name==='ArrowDown'){
        event.preventDefault()
        array.forEach((element) => element[0]++)
        if (testBoard.clipCheck(array)===false){
            testPiece2.move("down")
            eraseBig();
            testPiece2.render(ctx)
            if (showCenterFlag===true){
                testPiece2.drawCenter(ctx)
            }
            testBoard.render(ctx)
            drawShadow(ctx,testPiece2,1,0)
        }
        else
        {
            attach(testPiece2)
            if (gameOnGoingFlag===false){return}
            eraseBig()
            testBoard.render()
            nextPiece()
        }
    }
    if (code==='ShiftLeft'){
        rotate(testPiece2,"counter")
        eraseBig();
        testPiece2.render(ctx)
        if (showCenterFlag===true){
            testPiece2.drawCenter(ctx)
        }
        testBoard.render(ctx)
        drawShadow(ctx,testPiece2,1,0)

    }   
    if (code==='ShiftRight'){
        rotate(testPiece2,"clock")
        eraseBig();
        testPiece2.render(ctx)
        if (showCenterFlag===true){
            testPiece2.drawCenter(ctx)
        }
        testBoard.render(ctx)
        drawShadow(ctx,testPiece2,1,0)
    }
    if (code==='Enter'){
        event.preventDefault()
        testPiece2.render(ctx)
        dropPiece(testPiece2,ctx)
        eraseBig();
        testBoard.render(ctx)
        //drawShadow(ctx,testPiece2,1,0)
    }
    }, false);

function endGame(context){
    write("GAME OVER!!!", context, 0)
    console.log("GAME OVER!!!")
    clearInterval(myTimer)
    gameOnGoingFlag=false
    pauseFlag=false
    timeSet=1000
    columnsBlock=[]//clear the column block (maybe do a delete/garbage clean up instead?)
    for (let i=0; i<COLUMNS;i++){
        columnsBlock.push([])
    }
    level=0
    toggleSpeedButtons();

}




let speedButton=[]
for (let i=0; i<11;i++){
    speedButton.push(document.getElementById(`speed${i}`))
    speedButton[i].addEventListener("click",(event)=>{
        let emptyFlag=false
        if (gameOnGoingFlag===true){return}
        let oldSpeed=document.getElementsByClassName("dotted-border-button")[0]
        if (oldSpeed===undefined){emptyFlag=true}
        event.target.classList.toggle("dotted-border-button")
        let speed=parseInt(event.target.getAttribute("data"))
        level=speed
        timeSet=speedDict[level]
        setGauge(level*10)
        console.log("pre return")
        if (emptyFlag){return}
        console.log("post return")
        console.log(oldSpeed)
        oldSpeed.classList.toggle("dotted-border-button")
    })

}

checkBox.addEventListener("click",toggleCenter)
pauseButton.addEventListener('click',pauseAction)
newGameButton.addEventListener("click",newGame)
let myTimer = setInterval(myTimerFnc,timeSet);