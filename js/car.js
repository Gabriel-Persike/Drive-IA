class Car {
	constructor() {
		this.x = 50;
		this.y = 22;
		this.angle = 0;
		this.speed = 2;
		this.acceleration = 0;
		this.rays = [
			new Ray(this.x, this.y, this.angle),
			new Ray(this.x, this.y, this.angle + 45),
			new Ray(this.x, this.y, this.angle - 45),
			new Ray(this.x, this.y, this.angle + 180),
			new Ray(this.x, this.y, this.angle + 225),
			new Ray(this.x, this.y, this.angle - 225),
			new Ray(this.x, this.y, this.angle - 90),
			new Ray(this.x, this.y, this.angle + 90),
		];
	}

	drawCar(ctx) {
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

		for (const ray of this.rays) {
			ray.show(ctx, this.x + 7, this.y + 7);
		}
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

	getSensorsDistance() {
		var sensors = [];

		for (const ray of this.rays) {
			sensors.push(ray.getSensorsDistance());
		}

		return sensors;
	}
}
