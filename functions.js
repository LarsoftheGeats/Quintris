function setGauge(value=10){
    const set=Math.round(value)
    const speedGauge = document.querySelector('.gauge')
    speedGauge.style.setProperty('--gauge-value', `${set}`);
    speedGauge.style.setProperty('--gauge-display-value', `${set}`);
}
function setup(){
    let height=Math.floor(.95*windowInnerHeight);
    let width=Math.floor(13*height/25);

    c.height=height;
    c.width=width

    BOX_HEIGHT=Math.floor(height/ROWS)
    BOX_WIDTH=Math.floor(width/COLUMNS)
}

function intiliaze(canvas, context){
    context.fillStyle="white"
    context.fillRect(0, 0, canvas.width, canvas.height)
}

function eraseBig(){
    intiliaze(c,ctx)
}//clear the main game window

function eraseSmall(){
    intiliaze(nextWindow,pieceCtx)
}//clear the next piece window
