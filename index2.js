var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var nextWindow=document.getElementById("nextPiece");
var pieceCtx=nextWindow.getContext("2d");
var playerScore=document.getElementById("scoreArea")
ctx.fillStyle = "#000000";
const HEIGHT =4;
var timeSet=1000;
var level=0;
var pauseButton=document.getElementById("pause")
var newGameButton=document.getElementById("newGame")
var pauseFlag=false;
var gameOnGoingFlag=false;
const speedGauge = document.querySelector('.gauge')





var pieceDictionary = {
    1:[[-1,0],[-1,1],[-1,2],[-1,3],[-1,4]],
    2:[[0,2],[-1,2],[-1,3],[-1,4],[-1,5]],
    5:[[0,5],[-1,2],[-1,3],[-1,4],[-1,5]],
    3:[[0,3],[-1,2],[-1,3],[-1,4],[-1,5]],
    4:[[0,4],[-1,2],[-1,3],[-1,4],[-1,5]], 
    6:[[0,2],[-1,2],[-1,3],[-1,4],[0,3]],
    7:[[0,4],[-1,2],[-1,3],[-1,4],[0,3]],
    8:[[0,1],[-1,2],[-1,3],[-1,4],[0,2]],
    14:[[-1,2],[-1,3],[-1,4],[0,4],[0,5]],
    9:[[0,3],[-1,2],[-1,3],[-1,4],[1,3]],
    10:[[0,2],[-1,2],[-1,3],[-1,4],[1,2]],
    11:[[0,2],[0,3],[-1,3],[-1,4],[1,2]],
    12:[[1,3],[0,2],[0,3],[0,4],[-1,3]],
    13:[[0,2],[-1,2],[-1,3],[-1,4],[0,4]]
 }
 
 var pieceCenter = {
    1:[-1,3],
    2:[-1,3],
    3:[-1,3],
    4:[-1,3],
    5:[-1,3],
    6:[-1,3],
    7:[-1,3],
    8:[-1,3],
    9:[-1,3],
    10:[-1,3],
    11:[-1,3],
    12:[-1,3],
    13:[-1,3],
    14:[-1,3]
}
var pieceColor ={
    1:"aqua",
    2:"blue",
    3:"yellow",
    4:"green",
    5:"orange",
    6:"black",
    7:"pink",
    8:"purple",
    9:"aqua",
    10:"palegreen",
    11:"dimgray",
    12:"plum",
    13:"navy",
    14:"grey"
}
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

intiliaze(c,ctx)
intiliaze(nextWindow,pieceCtx)

nextPiece()

function attach(piece){
    
    let x
    let y
    let color
    let upload =[]
    let uploadObj=[]

    for (let i=0; i<piece.position.length; i++){
        [y,x]=piece.position[i]
        if (y<0){
            console.log("Defeat")
            endGame()
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
        cleanRows(deleteMe)
        eraseBig()
        score+=deleteMe.length*5*(1+level)//TODO: scale by triangular numbers * 5.  
        testBoard.zero()
        buildState(columnsBlock)
    }
    score+=5*(1+level);
    playerScore.value=`score: ${score}`
    testBoard.pieces++
    setGauge(level*10+(testBoard.lines%8)*1.25)
    console.log(timeSet)
    console.log(testBoard.pieces)
    console.log(columnsBlock)
    
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
    console.log(columnsBlock)
    for (let i=0; i<columnsBlock.length;i++){
      for (let j=0; j<columnsBlock[i].length;j++){
        let ypos=columnsBlock[i][j].ypos
        let info=columnsBlock[i][j].data.info
        let color=columnsBlock[i][j].data.color
        x=i
        // testBoard.set([[ypos,x]],[{info:info,color:color}])
        position.push([ypos,x])
        cellInfo.push({info:info,color:color})
      }
    //   console.log(position)
    //   console.log(cellInfo)
      testBoard.set(position,cellInfo)
      position=[]
      cellInfo=[]
    }
  }

function cleanRows (deleteArray){
    let fallDistance = 0;
    for (let i = 0; i<columnsBlock.length;i++){
      let deleteIndex=0;
      fallDistance=0;
      
      for (let j=0; j<columnsBlock[i].length; j++){
        if (deleteArray[deleteIndex]===columnsBlock[i][j].ypos)
        {
          columnsBlock[i].splice(j,1)
          fallDistance++
          deleteIndex++
          j--      
        }
        else
        {
          columnsBlock[i][j].ypos+=fallDistance;
          
        }
      }
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
            {   console.log("yclip")
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
            console.log("clipRight")
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
    console.log(` ${timeSet}`)
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
        nextState.existingPiece=true
        eraseSmall()
        nextPiece()
        return
    }//no existing piece
    let array=[...testPiece2.getPosition()];
    array.forEach((a)=> a[0]++)

    if (testBoard.clipCheck(array)===true){
        attach(testPiece2)
        eraseBig()
        testBoard.render()
        nextPiece()
    }
    else
        {testPiece2.move("down")
        eraseBig()
        testPiece2.render(ctx)
        testBoard.render()
        nextPiece()
    }
    
    // eraseBig()
    // testPiece2.render(ctx)
    // testBoard.render()
    // nextPiece()
}

function pauseAction(){
    if(pauseFlag===true){
        clearInterval(myTimer)
        myTimer = setInterval(myTimerFnc,timeSet);
        pauseFlag=false;
        return
    }
    clearInterval(myTimer)
    pauseFlag=true
    return
}


testPiece2.render(ctx,0,1)
testPiece2.render(pieceCtx,0,.5)

testBoard= new Board(ROWS, COLUMNS, ctx,c)
testBoard.render()

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
    console.log(offSetX)
    console.log(offSetY)
    console.log(center)
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
    if (pauseFlag===true){
        return
    }//don't move when paused.  
    var name = event.key;
    var code = event.code;

    var array=testPiece2.getPosition();
    console.log(`name ${name} code: ${code}`)
    if (name==='Control'){
        console.log("control")
        pieceFlip(testPiece2)
    }
    if (name==='ArrowRight'){
        array.forEach((element) => element[1]++)
        if (testBoard.clipCheck(array)===false){
            testPiece2.move("right")
            eraseBig();
            testPiece2.render(ctx)
            testBoard.render(ctx)
        }
    }
    if (name==='ArrowLeft'){
        array.forEach((element) => element[1]--)
        if (testBoard.clipCheck(array)===false){
            testPiece2.move("left")
            eraseBig();
            testPiece2.render(ctx)
            testBoard.render(ctx)
        }
    }
    if (name==='ArrowDown'){
        array.forEach((element) => element[0]++)
        if (testBoard.clipCheck(array)===false){
            testPiece2.move("down")
            eraseBig();
            testPiece2.render(ctx)
            testBoard.render(ctx)
        }
        else
        {attach(testPiece2)
        eraseBig()
        testBoard.render()
        nextPiece()
        }
    }
    if (code==='ShiftLeft'){
        rotate(testPiece2,"counter")
        eraseBig();
        testPiece2.render(ctx)
        testBoard.render(ctx)

    }   
    if (code==='ShiftRight'){
        rotate(testPiece2,"clock")
        eraseBig();
        testPiece2.render(ctx)
        testBoard.render(ctx)
    }
    }, false);

function endGame(){
    clearInterval(myTimer)
    gameOnGoingFlag=false
    timeSet=1000
}

function newGame(){
    if (gameOnGoingFlag===true){
        return
    }//sentry
    gameOnGoingFlag=true;
    testBoard.zero()
    testBoard.pieces=0;
    eraseBig()
    eraseSmall()
    clearInterval(myTimer)
    myTimer = setInterval(myTimerFnc,timeSet);
    score=0;
    nextState.nextPiece=[
        Math.floor(Math.random()*14)+1,
        Math.floor(Math.random()*14)+1,
        Math.floor(Math.random()*14)+1]
        playerScore.value=`score: ${score}`
}


let speedButton=[]
for (let i=0; i<11;i++){
    speedButton.push(document.getElementById(`speed${i}`))
    speedButton[i].addEventListener("click",(event)=>{
        if (gameOnGoingFlag===true){return}
        let speed=event.target.getAttribute("data")
        level=speed
        timeSet=speedDict[level]
    })

}
pauseButton.addEventListener('click',pauseAction)
newGameButton.addEventListener("click",newGame)
let myTimer = setInterval(myTimerFnc,timeSet);