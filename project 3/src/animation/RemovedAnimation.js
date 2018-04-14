class RemovedAnimation extends Animation {
    /**
     * @constructor The linear animation constructor
     * @param {scene} where the animation will be applied
     * @param {id} the animation ID
	 * @param {speed} the speed of this linear animation (units per time)
     * @param {points} all the control points used for this linear animation
     */
    constructor(scene, id, speed, type, points) {
        super(scene, id);

		this.speed = speed;
        this.points = points;
        this.totalDistance = 0;
        this.distanceBetweenPoints = [];

        for (var i = 0; i < points.length - 1; i++) {
            this.totalDistance += vec3.dist(vec3.fromValues(points[i][0], points[i][1], points[i][2]), vec3.fromValues(points[i + 1][0], points[i + 1][1], points[i + 1][2]));
            this.distanceBetweenPoints.push(this.totalDistance);
        }

        this.animationDuration = this.totalDistance / this.speed;
        this.startingTime = undefined;
        this.previousAngle = 0;
		this.type = type;
    }

    /**
     * Updates the values of the object (its angle and its new coordinates)
     * {t} the time value passed from the scene, used to animate this object.
     */
    animate(t) {
        if (this.startingTime == undefined)
            this.startingTime = t;

        /*
        	Calculates the time in case this animation does not start from the creation of the scene (combo animations or more than one animationref).
        	If the starting time is the first moment (0.0), then nothing irregular happens.
        	Otherwise, if this linear animation was called sometime after the first moment, then t will be different from 0
        	In order for the rest of the class to work as expected, the time must be calculated as the moment this animation started.
        */

        var effectiveTime;

        if (this.startingTime == 0)
            effectiveTime = t;
        else
            effectiveTime = t - this.startingTime;

        if (effectiveTime > this.animationDuration) {
            effectiveTime = this.animationDuration;
            this.ended = true;
			
			if (this.type == 2)
				this.scene.board.boardPrimitive.leftoversTwo.push(1);
			else
				this.scene.board.boardPrimitive.leftoversOne.push(1);
        }

        // distance equals speed * time.
        this.currentDistance = this.speed * effectiveTime;

        // for each movement between two points, the distance between those two points must be calculated
        // we start by getting the division beween the two points the object is currently at.	
        var division = 0;
        while (this.currentDistance > this.distanceBetweenPoints[division] && division < this.distanceBetweenPoints.length)
            division++;

        // when the division is found, we can access the points consisting of this division beggining and this division end
        var p1 = this.points[division];
        var p2 = this.points[division + 1];

        // between each point, we must calculate the distance from the last division
        var distanceFromLastDivision = this.distanceBetweenPoints[division - 1];
        if (division == 0)
            distanceFromLastDivision = 0; // first case to avoid division by zero

        // calculate the small incrementable subtle differences as time passes. This differences between each consecutive call are larger or smaller, depending on the speed provided
        // we subtract the division distance from the current distance, dividing by the fixed value of the distance betweens divisions
		var currentDistanceFromLastDivision = this.currentDistance - distanceFromLastDivision;
		var currentTotalDistanceFromLastDivision = this.distanceBetweenPoints[division] - distanceFromLastDivision
        var incrementMovement = currentDistanceFromLastDivision / currentTotalDistanceFromLastDivision;

        // we know that the angle between two line segments in the xOz plan has the following true condition: tan a = x2 - x1 / z2 - z1
        // therefore, the rotation angle 'a' is the arctangent of such value

        // given the new values of coordinates and angle, move the scene along those new values
		if (p2 != undefined)
			this.scene.translate((p2[0] - p1[0]) * incrementMovement + p1[0], (p2[1] - p1[1]) * incrementMovement + p1[1], (p2[2] - p1[2]) * incrementMovement + p1[2]);
        //this.scene.rotate(rotationAngle, 0, 1, 0);
    }
}