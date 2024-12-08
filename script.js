var car = null;
var clockTime = 1;
var clockInterval = null;

var animationId = null;
$(document).ready(function () {
	car = new Car();
	drawCanvas();

	// generateRoad();

	// car.render();
	bindings();
});

var walls = [
	{
		startX: 40,
		endX: 160,
		startY: 80,
		endY: 80,
		width: 80,
	},
	{
		startX: 40,
		endX: 160,
		startY: 200,
		endY: 200,
		width: 80,
	},
	{
		startX: 200,
		endX: 270,
		startY: 80,
		endY: 80,
		width: 80,
	},
	{
		startX: 200,
		endX: 270,
		startY: 200,
		endY: 200,
		width: 80,
	},
];

var raycast = [
	{
		angle: 0,
	},
	{
		angle: 90,
	},
	{
		angle: 180,
	},
	{
		angle: 270,
	},
];

function generateRoad() {
	var mapStartX = $("#map").offset().left;
	var mapStartY = $("#map").offset().top;

	var streets = [
		{
			roadlength: 7,
			angle: 0,
			startX: 40,
			startY: 20,
		},
		{
			roadlength: 16,
			angle: 0,
			startX: 40,
			startY: 120,
		},
		{
			roadlength: 10,
			angle: 90,
			startX: 170,
			startY: 20,
		},
		{
			roadlength: 10,
			angle: 90,
			startX: 270,
			startY: 20,
		},
		{
			roadlength: 10,
			angle: 0,
			startX: 70,
			startY: 200,
		},
	];

	var html = "";
	for (const street of streets) {
		for (let i = 0; i < street.roadlength; i++) {
			var x = street.startX;
			var y = street.startY;

			if (street.angle == 0) {
				x = x + i * 20;
			}
			if (street.angle == 90) {
				y = y + i * 20;
			} else if (street.angle == 180) {
				x = x - i * 20;
			} else if (street.angle == 270) {
				y = y - i * 20;
			}

			y = y + mapStartY;
			x = x + mapStartX;

			var roadTile = `<div class='roadTile' style='top:${y}px; left:${x}px;'></div>`;
			html += roadTile;
		}
	}

	$("#map").html(html);
}

class Car {
	constructor() {
		this.x = 50;
		this.y = 22;
		this.angle = 0;
		this.speed = 2;
		this.acceleration = 0;
	}

	render() {
		var x = this.x + $("#map").offset().left;
		var y = this.y + $("#map").offset().top;
		var car = `<div class='car' style='top:${y}px; left:${x}px;transform: rotate(${this.angle + 90}deg);'></div>`;

		$("#map").find(".car").remove();
		$("#map").append(car);
	}

	move(direction, angle) {
		// if (!direction && !angle) {
		// 	this.angle = this.angle + angle;
		// 	var rad = (this.angle * Math.PI) / 180;
		// 	this.x = this.x + this.speed * Math.cos(rad);
		// 	this.y = this.y + this.speed * Math.sin(rad);
		// }

		if (direction == "up") {
			// this.y = this.y - this.speed;
			this.acceleration = this.acceleration + 0.1;
		}
		if (direction == "down") {
			// this.y = this.y + this.speed;
			this.acceleration = this.acceleration - 0.1;
		}
		if (direction == "left") {
			// this.x = this.x - this.speed;
			this.angle = this.angle - 3;
		}
		if (direction == "right") {
			// this.x = this.x + this.speed;
			this.angle = this.angle + 3;
		} else {
			var rad = (this.angle * Math.PI) / 180;
			this.x = this.x + this.acceleration * Math.cos(rad);
			this.y = this.y + this.acceleration * Math.sin(rad);
		}
	}
}

function clock() {
	car.move();
	drawCanvas();
	// car.render();

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

		car.render();
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

	drawBorder(ctx);
	drawWalls(ctx);
	drawCar(ctx);
	drawRayCast(ctx);
	drawIntersections(ctx);
	function drawWalls(ctx) {
		var count = 1;
		for (const road of walls) {
			ctx.lineWidth = 20;
			if (road.width) {
				ctx.lineWidth = road.width;
			}

			ctx.beginPath();
			ctx.strokeStyle = "gray";
			ctx.moveTo(road.startX, road.startY);
			ctx.lineTo(road.endX, road.endY);
			ctx.stroke();

			ctx.font = "10px Arial";
			ctx.fillStyle = "white";

			ctx.fillText(count, road.startX, road.startY);
			ctx.fillText(count, road.endX, road.endY);

			count++;
		}
	}

	function drawBorder(ctx) {
		ctx.lineWidth = 20;
		ctx.strokeStyle = "gray";
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
	}

	function drawCar(ctx) {
		var img = new Image();
		img.src = "car.png";

		var x = car.x;
		var y = car.y;
		var angle = car.angle + 90;

		var width = 15;
		var height = 15;
		ctx.save();
		ctx.translate(x + width / 2, y + height / 2); // Move to the center of the car
		ctx.rotate((angle * Math.PI) / 180); // Rotate by the car's angle in radians
		ctx.translate(-width / 2, -height / 2); // Move back to the top-left corner of the car
		ctx.drawImage(img, 0, 0, width, height); // Draw the car image
		ctx.restore();
	}

	function drawRayCast(ctx) {
		for (const ray of raycast) {
			var x = car.x + 7;
			var y = car.y + 7;
			var angle = ray.angle;

			var rad = (angle * Math.PI) / 180;
			var x2 = x + 100 * Math.cos(rad);
			var y2 = y + 100 * Math.sin(rad);

			ctx.strokeStyle = "red";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		}
	}
}

function drawIntersections(ctx) {
	for (const ray of raycast) {
		ray.startX = car.x + 7;
		ray.startY = car.y + 7;
		walls.forEach((street) => {
			const intersection = getIntersection(ray, street);
			if (intersection) {
				ctx.fillStyle = "blue";
				ctx.beginPath();
				ctx.arc(intersection.x, intersection.y, 5, 0, 2 * Math.PI);
				ctx.fill();
			}
		});
	}
}

function getIntersection(ray, line) {
    const r_px = ray.startX;
    const r_py = ray.startY;
    const r_dx = Math.cos(ray.angle * Math.PI / 180);
    const r_dy = Math.sin(ray.angle * Math.PI / 180);

    const s_px = line.startX;
    const s_py = line.startY;
    const s_dx = line.endX - line.startX;
    const s_dy = line.endY - line.startY;

    const r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
    const s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);

    if (r_dx / r_mag === s_dx / s_mag && r_dy / r_mag === s_dy / s_mag) {
        return null;
    }

    const T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
    const T1 = (s_px + s_dx * T2 - r_px) / r_dx;

    if (T1 < 0) return null;
    if (T2 < 0 || T2 > 1) return null;

    const intersectionX = r_px + r_dx * T1;
    const intersectionY = r_py + r_dy * T1;

    // Check if the intersection point is within the line width
    const lineWidth = line.width || 1;
    const lineAngle = Math.atan2(s_dy, s_dx);
    const perpendicularDistance = Math.abs((intersectionX - s_px) * Math.sin(lineAngle) - (intersectionY - s_py) * Math.cos(lineAngle));

    if (perpendicularDistance > lineWidth / 2) {
        return null;
    }

    // Check if the intersection point is within the ray length
    const rayLength = ray.length || 100; // Default ray length if not specified
    const distanceToIntersection = Math.sqrt((intersectionX - r_px) * (intersectionX - r_px) + (intersectionY - r_py) * (intersectionY - r_py));

    if (distanceToIntersection > rayLength) {
        return null;
    }

    return {
        x: intersectionX,
        y: intersectionY,
        param: T1
    };
}

function drawIntersections(ctx) {
    for (const ray of raycast) {
        ray.startX = car.x + 7;
        ray.startY = car.y + 7;
        walls.forEach(street => {
            const intersection = getIntersection(ray, street);
            if (intersection) {
                ctx.fillStyle = 'blue';
                ctx.beginPath();
                ctx.arc(intersection.x, intersection.y, 5, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
    }
}