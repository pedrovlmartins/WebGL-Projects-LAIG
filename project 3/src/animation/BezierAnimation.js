/**
 * Bezier Animation with exactly four control points (along a cubic bezier curve)
 * @author Pedro Martins / Carolina Azevedo
 */
class BezierAnimation extends Animation {
    /**
     * @constructor The bezier animation constructor
     * @param {scene} where the animation will be applied
     * @param {id} the animation ID
     * @param {speed} the x coordinate for the center
     * @param {points} the four control points used for this bezier animation
     */
    constructor(scene, id, speed, points) {
        super(scene, id);
        this.speed = speed;
        this.points = points;

        this.previousCoordinates = this.getCurrentCoordinates(-0.001);
        this.prevAngle = 0;

        this.totalDistance = 0;

        for (var i = 0; i < points.length - 1; i++)
            this.totalDistance += vec3.dist(vec3.fromValues(points[i][0], points[i][1], points[i][2]), vec3.fromValues(points[i + 1][0], points[i + 1][1], points[i + 1][2]));

        this.totalTime = this.totalDistance / this.speed;
        this.startingTime = undefined;
        this.ended = false;
    }

    /** This function is used to get the new coordinates as time passes, given by the known mathematical formula
     * @param {t} the time, used in the cubic bezier function calculation
     * @returns The array with the new coordinates calculated in favor of the time
     */
    getCurrentCoordinates(t) {
        // calls three times the same function
        var x = this.cubicBezierFunction(0, t);
        var y = this.cubicBezierFunction(1, t);
        var z = this.cubicBezierFunction(2, t);

        return [x, y, z];
    }

    /** This is a very well know mathematical formula that gives the values of the coordinates in function of the time
     * @param {coordinate} can be either 0, 1 or 2
     * @param {t} the time, passed by the scene
     * @returns The array with the new coordinates calculated in favor of the time
     */
    cubicBezierFunction(coordinate, t) {
        if (coordinate >= 0 && coordinate <= 2)
            return (1 - t) * (1 - t) * (1 - t) * this.points[0][coordinate] +
                (3 * t * (1 - t) * (1 - t)) * this.points[1][coordinate] +
                (3 * t * t * (1 - t)) * this.points[2][coordinate] +
                (t * t * t) * this.points[3][coordinate];
    }

    /**
     * Updates the values of the object (its angle and its new coordinates)
     * {t} the time value passed from the scene, used to animate this object.
     */
    animate(t) {
        /*
			Calculates the time in case this animation does not start from the creation of the scene (combo animations or more than one animationref).
        	If the starting time is the first moment (0.0), then nothing irregular happens.
        	Otherwise, if this linear animation was called sometime after the first moment, then t will be different from 0
        	In order for the rest of the class to work as expected, the time must be calculated as the moment this animation started.
        */

        if (this.startingTime == undefined)
            this.startingTime = t;

        var effectiveTime;

        if (this.startingTime == 0)
            effectiveTime = t;
        else
            effectiveTime = t - this.startingTime;

        // condition that checks whether or not the bezier animation ended
        if (effectiveTime > this.speed) {
            effectiveTime = this.speed;
            this.ended = true;
        }

        // the current coordinates are calculated using the mathematical formula for the cubic bezier animation 
        var currentCoordinates = this.getCurrentCoordinates(effectiveTime / this.speed);

        // calculate the distance between the current coordinates and the previous coordinates
        var dX = this.previousCoordinates[0] - currentCoordinates[0];
        var dZ = this.previousCoordinates[2] - currentCoordinates[2];

        // use these values to calculate the angle
        var rotationAngle;

        if (dX == 0 && dZ == 0) // case where tangent cant be calculated (tan 0/0 is undefined), and the angle is considered as the previous angle
            rotationAngle = this.prevAngle;
        else if (dZ == 0) // case where the tangent cant be calculated (tan x/0 is undefined) and the angle is considered as 90 degrees
            rotationAngle = Math.PI / 2;
        else
            rotationAngle = Math.atan(dX / dZ); // else, calculate the angle with the arctangent, knowing that tan a = x2 - x1 / z2 - z1

        // given the new values of coordinates and angle, move the scene along those new values
        this.scene.translate(currentCoordinates[0], currentCoordinates[1], currentCoordinates[2]);
        this.scene.rotate(rotationAngle, 0, 1, 0);

        if (effectiveTime < this.speed) {
            this.previousCoordinates = currentCoordinates;
            this.prevAngle = rotationAngle;
        }
    }
}