var car = null;
var clockTime = 1;
var clockInterval = null;
var animationId = null;
var point = 0;
var walls = [];

var checkPoints = [];
var uncheckedCheckPoints = [];

$(document).ready(function () {
	car = new Car();
	drawMap();
	drawCanvas();
	bindings();
});

function executeClock() {
	car.move();
	// var colision = checkColision();
	// if (colision) {
	// 	reset();
	// }

	var gotCheckPoint = checkColisionCheckPoint();
	if (gotCheckPoint) {
		givePoint(1);
	}

	drawCanvas();

	if (animationId) {
		requestAnimationFrame(executeClock);
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
		animationId = requestAnimationFrame(executeClock);
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

	for (const checkPoint of checkPoints) {
		checkPoint.show(ctx);
	}

	checkIntersection(ctx);

}

function checkIntersection(ctx) {
	for (const ray of car.rays) {
		var sensor = ray.getSensor();
		if (sensor) {
			ctx.beginPath();
			ctx.strokeStyle = "blue";
			ctx.moveTo(ray.pos.x, ray.pos.y);
			ctx.lineTo(sensor.x, sensor.y);
			ctx.stroke();
		}
	}
}

function checkColision() {
	var carX = car.x;
	var carY = car.y;

	for (const wall of walls) {
		var carIsInWall = pointIsInLine(carX + 7, carY + 7, wall.start.x, wall.start.y, wall.end.x, wall.end.y);
		if (carIsInWall) {
			return true;
		}
	}

	return false;
}

function drawMap() {
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

	checkPoints.push(new Wall(80, 20, 80, 50, "red"));
	checkPoints.push(new Wall(80, 50, 120, 20, "red"));
	checkPoints.push(new Wall(80, 50, 120, 50, "red"));
	checkPoints.push(new Wall(80, 80, 120, 80, "red"));
	checkPoints.push(new Wall(80, 120, 120, 120, "red"));

	uncheckedCheckPoints = checkPoints.slice();
}

function checkColisionCheckPoint() {
	var carX = car.x;
	var carY = car.y;

	for (const checkPoint of uncheckedCheckPoints) {
		var carIsInWall = pointIsInLine(carX + 7, carY + 7, checkPoint.start.x, checkPoint.start.y, checkPoint.end.x, checkPoint.end.y);
		if (carIsInWall) {
			var index = uncheckedCheckPoints.indexOf(checkPoint);
			uncheckedCheckPoints.splice(index, 1);

			var index = checkPoints.indexOf(checkPoint);
			checkPoints[index].color = "green";
			return true;
		}
	}

	return false;
}

function pointIsInLine(pointX, pointY, lineStartX, lineStartY, lineEndX, lineEndY) {
	pointX = Math.round(pointX);
	pointY = Math.round(pointY);

	var pointBetweenStartYAndEndY = pointY <= lineStartY != pointY < lineEndY;
	if (!pointBetweenStartYAndEndY) {
		// If the point is not between the start and and, it cannot be in the line
		return false;
	}

	var pointBetweenStartXAndEndX = pointX <= lineStartX != pointX < lineEndX;
	if (!pointBetweenStartXAndEndX) {
		// If the point is not between the start and and, it cannot be in the line
		return false;
	}

	var tolerance = 21;
	var pointInLine = Math.abs((lineEndX - lineStartX) * (pointY - lineStartY) - (lineEndY - lineStartY) * (pointX - lineStartX)) < tolerance;
	if (pointInLine) {
		return true;
	} else {
		return false;
	}
}

function reset() {
	car.x = 50;
	car.y = 22;
	car.angle = 0;
	car.speed = 2;
	// car.acceleration = 0;

	point = 0;
	$("#txtPoints").text(point);

	for (const checkPoint of checkPoints) {
		checkPoint.color = "red";
	}

	uncheckedCheckPoints = checkPoints.slice();
}

function givePoint(quantidade) {
	point += quantidade;
	$("#txtPoints").text(point);
}

