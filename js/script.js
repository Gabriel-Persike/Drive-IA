var car = null;
var clockTime = 1;
var clockInterval = null;
var animationId = null;


var walls = [];


$(document).ready(function () {
	car = new Car();
	drawMap();

	drawCanvas();
	bindings();
});




function clock() {
	car.move();
	drawCanvas();

	if (animationId) {
		requestAnimationFrame(clock);
	}
}

function bindings() {
	$(document).on("keydown", function (e) {
		var tecla = e.keyCode;

		var codigosTeclas = {
			espaco: 32,
			left: 37,
			up: 38,
			right: 39,
			down: 40,
		};

		if (tecla == codigosTeclas.espaco) {
			// startStop();
		} else if (tecla == codigosTeclas.left) {
			car.move("left");
		} else if (tecla == codigosTeclas.right) {
			car.move("right");
		} else if (tecla == codigosTeclas.up) {
			car.move("up");
		} else if (tecla == codigosTeclas.down) {
			car.move("down");
		}
	});

	$("#btnStartStop").on("click", function () {
		startStop();
	});
}

function startStop() {
	if (animationId) {
		window.cancelAnimationFrame(animationId);
		animationId = null;
	} else {
		animationId = requestAnimationFrame(clock);
	}
}

function drawCanvas() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	car.drawCar(ctx);
	for (const wall of walls) {
		wall.show(ctx);
	}
	
	checkIntersection(ctx);

	console.log(
	car.rays[0].getDistance(walls[3]))
}

function checkIntersection(ctx) {
	for (const ray of car.rays){
        var closest = null;
        var min = Infinity;
        for (const wall of walls){
            var intercept = ray.cast(wall);
            if (intercept){
                var distancia = Math.sqrt(Math.pow(ray.pos.x - intercept.x, 2) + Math.pow(ray.pos.y - intercept.y, 2));
                
                if (distancia < min){
                    min = distancia;
                    closest = intercept;
                }
            }
        }
        if (closest) {
            ctx.beginPath();
                ctx.strokeStyle = "white";
                ctx.moveTo(ray.pos.x, ray.pos.y);
                ctx.lineTo(closest.x, closest.y);
                ctx.stroke();
        }
    }
}




function drawMap(){
	walls.push(new Wall(20, 20, 20, 50));



	walls.push(new Wall(20, 20, 120, 20));
	walls.push(new Wall(20, 50, 80, 50));


	walls.push(new Wall(120, 20, 120, 120));
	walls.push(new Wall(80, 50, 80, 160));
	
	
	walls.push(new Wall(120, 120, 200, 120));
	walls.push(new Wall(80, 160, 240, 160));
	

	walls.push(new Wall(200, 120, 200, 50));
	walls.push(new Wall(240, 160, 240, 50));
	
	
	walls.push(new Wall(200, 50, 240, 50));
}