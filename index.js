var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var nextWindow=document.getElementById("nextPiece");
var pieceCtx=nextWindow.getContext("2d");
ctx.fillStyle = "#000000";
const HEIGHT =4;

//Tetris is 10x20 adjusted for scaling up 4 to 5
//TODO: adjust constants
const COLUMNS=13; 
const ROWS =25;
const BOX_WIDTH=46;
const BOX_HEIGHT=32;
ctx.clearRect(0, 0, c.width, c.height);
var pieceDictionary = {
   1:[[0,0],[1,0],[2,0],[3,0],[4,0]],
   2:[[2,1],[2,0],[3,0],[4,0],[5,0]],
   3:[[3,1],[2,0],[3,0],[4,0],[5,0]],
   4:[[4,1],[2,0],[3,0],[4,0],[5,0]], 
   5:[[5,1],[2,0],[3,0],[4,0],[5,0]],
   6:[[2,1],[2,0],[3,0],[4,0],[3,1]],
   7:[[4,1],[2,0],[3,0],[4,0],[3,1]],
   8:[[1,1],[2,0],[3,0],[4,0],[2,1]],
   9:[[3,1],[2,0],[3,0],[4,0],[3,2]],
   10:[[2,1],[2,0],[3,0],[4,0],[2,2]],
   11:[[2,1],[3,1],[3,0],[4,0],[2,2]],
   12:[[3,2],[2,1],[3,1],[4,1],[3,0]],
   13:[[2,1],[2,0],[3,0],[4,0],[4,1]]
}
var pieceCenter = {
    1:[3,0],
    2:[3,0],
    3:[3,0],
    4:[3,0],
    5:[3,0],
    6:[3,0],
    7:[3,0],
    8:[3,0],
    9:[3,0],
    10:[3,0],
    11:[3,0],
    12:[3,0],
    13:[3,0]
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
    14:"white"
}

var columnsBlock=[];
for (let i=0; i<COLUMNS;i++){
    columnsBlock.push([]);
}

let randInitialPiece=Math.floor(Math.random()*13)+1
//Set up initial state
let previousState={
    existingPiece:true,
    piecePosition:[...pieceDictionary[randInitialPiece]],
    pieceCenter:[3,0],
    pieceColor:randInitialPiece,
    nextPiece:[Math.floor(Math.random()*13)+1,
        Math.floor(Math.random()*13)+1,
        Math.floor(Math.random()*13)+1
    ]
};
let nextState=[];
let nextColor=[];
let empty
let empty2

let positionColor
class positionWrapper {
    position;
    color;
    constructor(){
        this.position=0;
        this.color=14
    }
}
for (let i =0; i<ROWS;i++){
    empty=new Array();
    empty2=new Array();
    for (let j=0; j<COLUMNS; j++){//San Test#1
        empty.push(14)
        empty2.push(0)  
    }
    nextColor.push(empty)
    nextState.push(empty2);
}


//Draw game state
function renderState (state)
{
   //TODO: square box height and width, need to adjust const values of wid and height on canvas to fix that. 
    for (let i=0; i < ROWS; i++)
        for (let j=0; j<COLUMNS; j++){
        {
            if (state[i][j]===1)
            {
                let color=nextColor[i][j]
                ctx.beginPath();
                ctx.lineWidth = "2";
                ctx.strokeStyle = "red";
                ctx.rect(BOX_WIDTH*j+2, BOX_HEIGHT*i+2, BOX_WIDTH-4, BOX_HEIGHT-4);
                ctx.fillStyle =pieceColor[color]
                ctx.fill();
            }
        }
      
        
        
    
    }
    let marginX=1*BOX_WIDTH;
    let marginY=BOX_HEIGHT;
    for (let a=0; a<3;a++){
        marginY=BOX_HEIGHT+a*2*BOX_HEIGHT
        piece=previousState.nextPiece[a]
        for (let k=0;k<5;k++){
            let x=pieceDictionary[piece][k][0]
            let y=pieceDictionary[piece][k][1]
            pieceCtx.beginPath();
            pieceCtx.lineWidth="2";
            pieceCtx.strokeStyle="red"
            pieceCtx.rect((x)*.5*BOX_WIDTH,y*.5*BOX_HEIGHT+marginY, .5*BOX_WIDTH-2, .5*BOX_HEIGHT-2)
            pieceCtx.fillStyle=pieceColor[previousState.nextPiece[a]]
            pieceCtx.fill()
        }
    }
    //TODO:Remove this test
    ctx.beginPath()
    ctx.rect(-5,-5,10,10)
    ctx.fillStyle="red"
    ctx.fill()
}

function renderPiece(){
    for (i=0; i<previousState.piecePosition.length;i++){
        let x=previousState.piecePosition[i][0];
        let y=previousState.piecePosition[i][1];
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "red";
        ctx.rect(BOX_WIDTH*x+2, BOX_HEIGHT*y+2, BOX_WIDTH-4, BOX_HEIGHT-4);
        ctx.fillStyle = pieceColor[previousState.pieceColor];
        ctx.fill();
    }
}

//update next game state
//****FUNCTION myTimerFnc triggers at 200 ms.   */
//each piece falls one space.  update location in previous state
//update next state array.  
//call render

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

function myTimerFnc(){
    //if there's no piece add a piece.  
    if (!previousState.existingPiece){
        let randPiece=Math.floor(Math.random()*13)+1;
        let nextPiece=previousState.nextPiece[0]

        previousState.existingPiece=true;
        for (let i =0; i<5;i++){
            
            previousState.piecePosition[i]=[...(pieceDictionary[nextPiece][i])]
           
           
        }//DEEP COpy, shallow copying erases dictionary
        previousState.pieceCenter=[3,0]
        previousState.pieceColor=nextPiece
        previousState.nextPiece[0]=previousState.nextPiece[1]
        previousState.nextPiece[1]=previousState.nextPiece[2]
        previousState.nextPiece[2]=randPiece
        
        return
    }
    if (checkDirection('down'))
        {movePiece('down')}
    else {
        attachPiece();
        console.log(columnsBlock)
        let deleteMe=rowChecker();
        if (deleteMe.length>0)
        {
            
            cleanRows(deleteMe)
            zeroState()
            buildState()
            pieceCtx.clearRect(0, 0, nextWindow.width, nextWindow.height);
        }

    }
    ctx.clearRect(0, 0, c.width, c.height);
    pieceCtx.clearRect(0, 0, nextWindow.width, nextWindow.height);
    renderPiece()
    renderState(nextState)
}

function printArray(array){
    let accum=""
    for (let i=0;i<array.length;i++){
        for (let j=0;j<array[i].length;j++){
            accum=`${accum} ${array[i][j]}`
        }
        console.log(accum)
    }
}

//update current game state
function attachPiece(){
    let x
    let y
    
    

    for (let i=0; i<previousState.piecePosition.length;i++){
        let pieceObj=new positionWrapper()
        x=previousState.piecePosition[i][0];
        y=previousState.piecePosition[i][1];
        nextState[y][x]=1
        nextColor[y][x]=previousState.pieceColor
        pieceObj.position=y
        pieceObj.color=previousState.pieceColor

        columnsBlock[x].push(pieceObj)
        columnsBlock[x].sort((a,b)=>{return(b.position-a.position)});
        
    }
    previousState.existingPiece=false;
    previousState.piecePosition=[]
 
}

function checkDirection(direction){
    let size =previousState.piecePosition.length;
    let x;
    let y;
    switch (direction){
        case "left":
            for (let i=0; i<size; i++){
                x=previousState.piecePosition[i][0]
                y=previousState.piecePosition[i][1]
                if (x-1<0)
                    return false
                if (nextState[y][x-1])
                    return false
            }
            return true;
            break;
        case "right":
            for (let i=0; i<size; i++){
                x=previousState.piecePosition[i][0]
                y=previousState.piecePosition[i][1]
                if (x+1>=COLUMNS)
                    return false
                if (nextState[y][x+1])
                    return false
            }
            return true;
            break;
        case "down":
            for (let i=0; i<size; i++){
                x=previousState.piecePosition[i][0]
                y=previousState.piecePosition[i][1]
                if (y+1>=ROWS)
                    return false
                if (nextState[y+1][x])
                    return false
            }
            return true;
            break;
        case "rotate":
            break;
    }
direction}

function movePiece(direction){
    let x
    let y
    
    switch (direction){
        case ("right"):
            previousState.pieceCenter[0]+=1
            for (let i=previousState.piecePosition.length-1; i>=0;i--){
            previousState.piecePosition[i][0]+=1;}
            break;
        case("left"):
            previousState.pieceCenter[0]-=1
            for (let i= previousState.piecePosition.   length-1; i>=0;i--){
            previousState.piecePosition[i][0]-=1;}
            break;
        case ("down"):
            previousState.pieceCenter[1]+=1
            for (i=0; i<previousState.piecePosition.length;i++){
                previousState.piecePosition[i][1]+=1;
            }
            break;
    }
}

function rotateClkWse(){

    let center=previousState.pieceCenter

    let offsetY =[]
    let offsetX =[]
    offsetX.push((previousState.piecePosition[0][0]-center[0]))
    offsetY.push(previousState.piecePosition[0][1]-center[1])
    for (let i=1; i<previousState.piecePosition.length;i++){
        offsetX.push(previousState.piecePosition[i][0]-center[0])
        offsetY.push(previousState.piecePosition[i][1]-center[1])
    }
    let output = [];
    let x;
    let y;
    for (let i=0; i<previousState.piecePosition.length;i++){
        x=center[0]+offsetY[i]
        y=center[1]-offsetX[i]
        output.push([x,y])
        if (nextState[y][x]===1)//clipping another piece
            {   
                return false}
        if ((x<0) || (x>COLUMNS-1))//out of bounds x
            { 
                return false}
        if ((y<0)|| (y>ROWS-1))//out of bounds y
            {return false}
    }
    previousState.piecePosition=[...output]
    
    renderPiece()
    return
}



function rotateCClkWse(){
    
    let center=previousState.pieceCenter
   
    let offsetY =[]
    let offsetX =[]
    offsetX.push((previousState.piecePosition[0][0]-center[0]))
    offsetY.push(previousState.piecePosition[0][1]-center[1])
    for (let i=1; i<previousState.piecePosition.length;i++){
        offsetX.push(previousState.piecePosition[i][0]-center[0])
        offsetY.push(previousState.piecePosition[i][1]-center[1])
    }
    let output = [];
    let x;
    let y;
    for (let i=0; i<previousState.piecePosition.length;i++){
        x=center[0]-offsetY[i]
        y=center[1]+offsetX[i]
        output.push([x,y])
        if (nextState[y][x]===1)//clipping another piece
            {   
                return false}
        if ((x<0) || (x>COLUMNS-1))//out of bounds x
            { 
                return false}
        if ((y<0)|| (y>ROWS-1))//out of bounds y
            {return false}
    }
    previousState.piecePosition=[...output]
    
    renderPiece()
    return
}

function rowChecker(){
    let fullRows=[];
    for (let i=ROWS-1;i>=0;i--){
      let accum=1;
      for (let j=0;j<=COLUMNS-1;j++){
        
        accum*=nextState[i][j]
      }
      if (accum===1){
        fullRows.push(i)
      }
    } 
    return fullRows
  }

  function cleanRows (deleteArray){
    let fallDistance = 1;
    for (let i = 0; i<columnsBlock.length;i++){
      let deleteIndex=0;
      fallDistance=0;
      
      for (let j=0; j<columnsBlock[i].length; j++){
        if (deleteArray[deleteIndex]===columnsBlock[i][j].position)
        {
          columnsBlock[i].splice(j,1)
          fallDistance++
          deleteIndex++
          j--      
        }
        else
        {
          columnsBlock[i][j].position+=fallDistance;
          
        }
      }
    }
  }

  function zeroState(){
    for (let i=0;i<ROWS;i++){
      for (let j=0;j<COLUMNS;j++){
        nextState[i][j]=0
        nextColor[i][j]=14
      }
    }
  }


  function buildState(){
    let x
    let y
    for (let i=0; i<columnsBlock.length;i++){
      for (let j=0; j<columnsBlock[i].length;j++){
        y=columnsBlock[i][j].position
        color=columnsBlock[i][j].color
        x=i
        nextState[y][x]=1
        nextColor[y][x]=color
      }
    }
  }
//keyboard listener



document.addEventListener('keydown', (event) => {
    var name = event.key;
    var code = event.code;


    if (name==='ArrowRight'){
        if (checkDirection("right")){
            movePiece("right")
        }
    }
    if (name==='ArrowLeft'){
        if (checkDirection("left")){
            movePiece("left")
        }
    }
    if (name==='ArrowDown'){
            if (checkDirection("down")){
                movePiece("down")
            }
        }
    if (code==='ShiftLeft'){
        rotateClkWse()

    }   
    if (code==='ShiftRight'){
        rotateCClkWse()
    }
         
        ctx.clearRect(0, 0, c.width, c.height);
        renderPiece()
        renderState(nextState)
    }, false);
    //Timer event listener

    //TESTING BLOCK
    let testPiece = new Block([[5,6],[5,7],[5,8],[5,9],[5,10]],"red",[5,8],5)
    console.log(testPiece)
    // for (let ti=0; ti<testPiece.size;ti++){
    //     let [tx,ty]=testPiece.position[ti]
    //     console.log(ti)
    //     ctx.beginPath();
    //     ctx.lineWidth = "2";
    //     ctx.strokeStyle = "red";
    //     ctx.rect(BOX_WIDTH*tx+2, BOX_HEIGHT*ty+2, BOX_WIDTH-4, BOX_HEIGHT-4);
    //     ctx.fillStyle=testPiece.color
    //     ctx.fill()
    // }
    testPiece.render(pieceCtx,0,.5)

    // let myTimer = setInterval(myTimerFnc, 500);