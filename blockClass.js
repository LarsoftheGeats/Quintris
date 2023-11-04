class Piece {
    position =[];
    color;
    center;
    size;
    flagBottom=false;
    constructor(setup,color,center,size){
        this.size=size;
        let accum="";
        for (let i=0; i<color.length; i++)
            {
                accum+=color[i]
            }
        this.color=accum//TODO replace with a .repeat string function
        this.center=[...center]
        for (let j=0;j<size;j++){
            this.position.push([setup[j][0],setup[j][1]])
        }//deep copy
    }//end constructor

    setPosition(positionArray){
        for (let j=0;j<this.size;j++){
            this.position[j]=[positionArray[j][0],positionArray[j][1]]
        }//deep copy
    }//setPosition method

    getPosition(){
        let retArray= []
        for(let i=0; i<this.size; i++){
            let [y,x]=this.position[i]
            retArray.push([y,x])
        }
        return retArray
    }

   render(ctx,offset=0,scale=1){
       let [centery,centerx]=this.center
        for (let i=0; i<this.size;i++){
            let [y,x]=this.position[i]
            drawBox(ctx,[scale*(y*BOX_HEIGHT+2+offset),scale*(BOX_WIDTH*x+2)],scale*(BOX_WIDTH-4),
            scale*(BOX_HEIGHT-4),this.color,"black")
        }
   }

   drawCenter(ctx,offset=0,scale=1){
    let [centery,centerx]=this.center
    drawBox(ctx,[scale*(BOX_HEIGHT*centery+4+offset),scale*(BOX_WIDTH*centerx+4)],scale*(BOX_WIDTH-8),
    scale*(BOX_HEIGHT-8),"white","black")//draw center
   }

    shift(position){
        let piecePos=this.getPosition()
        for (let i=0; i<piecePos.length;i++){
            piecePos[i][0]+=position[0]
            piecePos[i][1]+=position[1]
            if (piecePos[i][0]>=ROWS){
                return false
            }//ERROR checking, pieces can start above the play field
            if (piecePos[i][1]<0||piecePos[1]>=COLUMNS){
                return false
            }//ERROR checking, 
        }

        this.setPosition(piecePos)
        this.center[0]+=position[0]
        this.center[1]+=position[1]
        return true//successfully shifted
   }

   move(direction){
    switch(direction){
        case("right"):
            this.center[1]+=1;
            for (let i=this.position.length-1; i>=0; i--){
                this.position[i][1]+=1;
            }//for loop
            break;//end case right
        case("left"):
            this.center[1]-=1
            for (let i= this.position.length-1; i>=0;i--){
                this.position[i][1]-=1;}
            break; //end left
        case("down"):
            this.center[0]+=1
            for (let i=0; i<this.position.length;i++){
                this.position[i][0]+=1;
            }
        break;
    }//end switch
   }//end move method
   
}