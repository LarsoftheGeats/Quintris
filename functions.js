function setGauge(value=10){
    const set=Math.round(value)
    const speedGauge = document.querySelector('.gauge')
    speedGauge.style.setProperty('--gauge-value', `${set}`);
    speedGauge.style.setProperty('--gauge-display-value', `${set}`);
}

function setup(){
    let canvas = document.getElementById("myCanvas");

    BOX_HEIGHT = Math.floor(canvas.height / ROWS);
    BOX_WIDTH = Math.floor(canvas.width / COLUMNS);
}//TODO: adjust this to CSS height values

function initialize(canvas, context){
    context.globalAlpha=1;
    context.fillStyle="white"
    context.fillRect(0, 0, canvas.width, canvas.height)
}

function eraseBig(){
    initialize(c,ctx)
}//clear the main game window

function write(message,context=ctx,degree=0){
    context.save()
    context.globalAlpha=1
    context.fillStyle="Black"
    context.font="48px serif"
    context.rotate((Math.PI)*degree/180)
    context.fillText(message,200,200)
    context.restore()
}

function eraseSmall(){
    initialize(nextWindow,pieceCtx)
}//clear the next piece window

function toggleSpeedButtons() {
    const speedButtons = document.querySelectorAll('.speed'); // Replace with your selector
  
    // Toggle visibility of speed buttons
    speedButtons.forEach(button => {
      button.classList.toggle('hidden');
    });
  }

function newGame(){
    if (gameOnGoingFlag===true){
        return
    }//sentry
    gameOnGoingFlag=true;
    pauseFlag=false;
    testBoard.zero()
    testBoard.pieces=0;
    testBoard.lines=0;

    setGauge(level*10)
    //clear windows
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
    toggleSpeedButtons();
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

  function pauseAction(){
    if (gameOnGoingFlag===false){return}//don't toggle the pause if the game isn't going
    let pauseButton=document.getElementById("pause")
    pauseButton.classList.toggle("dotted-border-button")
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

//
function getPieceWidth(piece){
    let min=13;//x positions are between 0 and 12, this is used for initializing
    let max=-1;
    for (let i=0; i<piece.size;i++){
        if (min>piece.position[i][1]){
            min=piece.position[i][1]
        }
        if (max<piece.position[i][1]){
            max=piece.position[i][1]
        }
    }
    return([min,max])
}

function getLowestPoint(piece,pieceShadow){
    let [left,right]=pieceShadow
    let max=Array(right-left+1).fill(-1);
    for (let i=pieceShadow[0]; i<=pieceShadow[1];i++){
        for (let j=0; j<piece.size;j++){
            if (i!==piece.position[j][1]){
                continue
            }
            if (max[i-left]<piece.position[j][0]){
                max[i-left]=piece.position[j][0]
            }

        }
    }
    return max
}

//gets rows to draw a flashy rectangle on.
function flashyLines(lines) {
    return new Promise((resolve)=> {
    let count = 0;
    let maxCount = 5;//maybe later make flash # and duration adjustable with params.  for now it's at 5
    pauseAction()

    function flashingLoop(lines) {
        count++;
        if (count >maxCount){
            pauseAction()
            resolve()
            return
        }

        if (count%2===0) {//on even numbers draw flashy box
            drawFlashBox(lines)
        }
        else{
            eraseBlink(lines)            
        }
        setTimeout(() => flashingLoop(lines), 200);
    }

    // Start the loop
    flashingLoop(lines);})
}

async function handleDelete(deleteMe){
    await flashyLines(deleteMe)
    cleanRows(deleteMe)
    eraseBig()
    score+=deleteMe.length*5*(1+level)//TODO: scale by triangular numbers * 5.  
    testBoard.zero()
    buildState(columnsBlock)
}


function drawFlashBox(lines){
    for (let i=0; i<lines.length; i++){
        y=lines[i]*BOX_HEIGHT  
        drawBox(ctx,[y,0],BOX_WIDTH*COLUMNS+4,BOX_HEIGHT,'silver','white',.5)
    }
}

function eraseBlink(lines){
    eraseBig()
    testBoard.render()
    testPiece2.render(ctx)    
}

function drawShadow(context,piece,scale=1,offset=0){
    let pieceWidth=getPieceWidth(piece)
    const low=getHighPoint(pieceWidth)
    const high=getLowestPoint(piece,pieceWidth)
    let smallestDiff=26
    dif=0;
    for (let index=0; index<high.length;index++){
        dif=low[index]-high[index]-1
        if (smallestDiff>dif){
            smallestDiff=dif
        }
    }
    let location=piece.getPosition()
    for (let i=0;i<location.length;i++){
        let [y,x]=location[i]
        y+=smallestDiff;
        drawBox(ctx,[scale*(y*BOX_HEIGHT+1+offset),scale*(BOX_WIDTH*x+1)],
            scale*(BOX_WIDTH-2),
            scale*(BOX_HEIGHT-2),
            'silver',"black",.5)

    }

}

function drawBox(context,corner,width,height,color,stroke,alpha=1){
    context.save()
    let [y,x]=corner
    context.globalAlpha=alpha
    context.beginPath();
    context.lineWidth = "2"
    context.strokeStyle=stroke;
    context.strokeRect(x,y,width,height)
    context.rect(x,y,width,height)
    context.fillStyle=color
    context.fill()
    context.restore()
}

function buildDictionary(piece=testPiece2){
    var dictionary={}
    let y,x;
    for (let i=0; i<piece.position.length;i++){
        [y,x]=piece.position[i]
        if (!(x in dictionary)){
            dictionary[x]=y
            continue
        }
        if (dictionary[x]<y){
            dictionary[x]=y
        }
    }
    return dictionary
}

function getHighPoint(widthArray,piece=testPiece2){
    let [min,max]=widthArray;
    let highestPoint=Array(max-min+1).fill(0)
    let dictionary=buildDictionary(piece)
    let end
    for (let i=0; i<=max-min;i++){
        end=columnsBlock[i+min].length-1
        if (end===-1){
            highestPoint[i]=25
            continue
        }

        highestPoint[i]=columnsBlock[i+min][end].ypos
        while (highestPoint[i]<dictionary[i+min]){//runs while high point of board is above low point of piece
            end--
            if (end===-1){
                highestPoint[i]=25
                break
            }
            highestPoint[i]=columnsBlock[i+min][end].ypos
        }
    }
    return highestPoint
}

function dropPiece(piece,context){
    let pieceShadow=getPieceWidth(piece)
    let low=getHighPoint(pieceShadow)
    let high=getLowestPoint(piece,pieceShadow)
    let smallestDiff=26;
    dif=0;
    for (let index=0; index<high.length;index++){
        dif=low[index]-high[index]-1
        if (smallestDiff>dif){
            smallestDiff=dif
        }
    }
    piece.shift([smallestDiff,0])
    attach(piece)
    piece.render(context,0,1)
}

function toggleCenter(){
    showCenterFlag=!showCenterFlag
}
function spin (blockPiece,offset){
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
    }
    return output
}