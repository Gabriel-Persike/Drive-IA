var car = null;
$(document).ready(function () {
	generateRoad();
    
	car = new Car();
	car.render();
	bindings();
});

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
		var car = `<div class='car' style='top:${y}px; left:${x}px;'></div>`;

        $("#map").find(".car").remove();    


		$("#map").append(car);
	}

	move(direction) {
		if (direction == "up") {
			this.y = this.y - this.speed;
		}
		if (direction == "down") {
			this.y = this.y + this.speed;
		}
		if (direction == "left") {
			this.x = this.x - this.speed;
		}
		if (direction == "right") {
			this.x = this.x + this.speed;
		}
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
}
