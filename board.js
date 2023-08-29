class Cell{
    data;
    color
    constructor (data, color){
        this.data=data
        this.color=color
    }//constructor
}//cell class



class Board {
    state = [];
    c
    context;
    rows;
    columns;
    pieces;
    constructor(rows,columns,context,canvas,pieces=0){
        this.context=context;
        this.c=canvas
        this.rows=rows
        this.columns=columns
        this.pieces=pieces
        for (let i=0; i<rows; i++){
            let row = new Array(columns).fill(0)
            for (let j=0; j<columns; j++){
                row[j]= new Cell(0,"white")
            }//inner loop
            this.state.push(row)
        }//outer loop
    }//constructor

    set(position,state){
        if (position.length!==state.length){
            console.log("error array sizes don't match")
            console.log(position)
            console.log(state)
            return -1 
        }//error check
        let x;
        let y;
        for (let i=0; i<position.length;i++){
            [y,x]=position[i];
            this.state[y][x].data=state[i].info;
            this.state[y][x].color=state[i].color.repeat(1);//sneaky way to deep copy
        }//for loop setting the state
    }//set method

    zero(){
        for (let i=0;i<this.rows;i++){
            for (let j=0;j<this.columns;j++){
              this.state[i][j].data=0
              this.state[i][j].color="white"

            }
          } 
    }

    rowChecker(){
        let fullRows=[];
        for (let i = this.rows-1; i>=0; i--){
            let accum=1;
            for (let j=0; j<=COLUMNS-1;j++){
                accum*=this.state[i][j].data
            }
            if (accum===1){
                fullRows.push(i)
            }
        }
        return fullRows
    }

    clipCheck(position){
        let x;
        let y;
        for (let i=0; i<position.length; i++){
            [y,x]=position[i];
            if ((x<0) || (x>COLUMNS-1))//out of bounds x
            { return true}           
            if ((y>ROWS-1))//out of bounds y FIXME:potentially add (y<0)|| back to #79
            {return true}
            if (y<0){}
            else if (this.state[y][x].data===1){
                return true//clipped blocks
            }//return true if clipping pieces


        }
        return false;//did not clip blocks  
    }//clipCheck method

    render(){

    //this.context.clearRect(0,0,this.c.width, this.c.height)
       for (let i=0; i< this.rows; i++){
            for (let j=0; j<this.columns; j++){
                if (this.state[i][j].data===1){
                    this.context.beginPath();
                    this.context.lineWidth = 2;
                    this.context.strokeStyle = "black"
                    this.context.strokeRect(BOX_WIDTH*j+2, BOX_HEIGHT*i+2, BOX_WIDTH-4, BOX_HEIGHT-4)
                    this.context.rect(BOX_WIDTH*j+2, BOX_HEIGHT*i+2, BOX_WIDTH-4, BOX_HEIGHT-4)
                    this.context.fillStyle = this.state[i][j].color
                    this.context.fill()
                }
            }//loop through each cell
       }//each row   
    }//render class
}//Board class