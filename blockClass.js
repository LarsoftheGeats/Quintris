class Piece {
    position =[];
    color;
    center;
    size;
    constructor(setup,color,center,size){
        this.size=size;
        let accum="";
        for (let i=0; i<color.length; i++)
            {
                accum+=color[i]
            }
        this.color=accum
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
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = "black";
            ctx.strokeRect(scale*(BOX_WIDTH*x+2),
             scale*(BOX_HEIGHT*y+2+offset),
              scale*(BOX_WIDTH-4),
              scale*(BOX_HEIGHT-4));
            ctx.rect(scale*(BOX_WIDTH*x+2),
            scale*(BOX_HEIGHT*y+2+offset),
            scale*(BOX_WIDTH-4),
            scale*(BOX_HEIGHT-4));
            ctx.fillStyle=this.color
            ctx.fill()
        }
        ctx.beginPath();
        ctx.rect(scale*(BOX_WIDTH*centerx+4),
        scale*(BOX_HEIGHT*centery+4+offset),
        scale*(BOX_WIDTH-8),
        scale*(BOX_HEIGHT-8));
        ctx.fillStyle="white"
        ctx.fill()

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