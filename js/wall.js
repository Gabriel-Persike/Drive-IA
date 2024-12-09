class Wall{
    constructor(startX, startY, endX, endY){
        this.start = {
            x:startX,
            y:startY
        };
        this.end = {
            x:endX,
            y:endY
        };
    }

    show(ctx){
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
    }
}