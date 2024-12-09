class Wall{
    constructor(startX, startY, endX, endY, color){
        this.start = {
            x:startX,
            y:startY
        };
        this.end = {
            x:endX,
            y:endY
        };

        this.color = color ? color : "white";
    }

    show(ctx){
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
    }
}