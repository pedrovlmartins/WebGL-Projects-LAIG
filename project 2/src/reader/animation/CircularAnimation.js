/**
 * Circular Animation with a center, a radius, the initial angle and the rotation angle
 * @author Pedro Martins / Carolina Azevedo
 */
class CircularAnimation extends Animation {
    /**
     * @constructor The circular animation constructor
     * @param {scene} where the animation will be applied
     * @param {id} the animation ID
     * @param {x} the x coordinate for the center
     * @param {y} the y coordinate for the center
     * @param {z} the z coordinate for the center
     * @param {radius} the radius of the the circle which will be used for this animation
     * @param {initialAngle} the angle of the object it must be facing of, in degrees
     * @param {rotationAngle} the angle the object must rotate, in degrees(can be greater than 360) 
     */
    constructor(scene, id, speed, x, y, z, radius, initialAngle, rotationAngle) {
        super(scene, id);

        this.speed = speed;
        this.center = [x, y, z];
        this.radius = radius;
        this.initialAngle = initialAngle;
        this.rotationAngle = rotationAngle;

        this.startingTime = undefined;
        this.movementTime = 0;
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

        // the current angle is given as a calculation between the speed and the movement time
        // this angle will be added to the initial angle
        var currentAngle = this.initialAngle + this.speed * this.movementTime;
        var radToDegree = 180 / Math.PI; // convert the angle to degrees

        // if the current angle (in degrees) is equal to the total angle (the initial angle value plus the rotation angle value), then the animation ends
        if (currentAngle * radToDegree < this.initialAngle + this.rotationAngle) {
            this.scene.translate(this.center[0], this.center[1], this.center[2]); // translates to the center first (the center of the object)
            this.scene.rotate(currentAngle, 0, 1, 0); // rotates to the new angle (ensures helicopter type movement)
            this.scene.translate(this.radius, 0, 0); // translates a distance equal to the radius of the circle
            this.movementTime = effectiveTime; // updates time
        } else {
            this.scene.translate(this.center[0], this.center[1], this.center[2]);
            this.scene.rotate(currentAngle, 0, 1, 0);
            this.scene.translate(this.radius, 0, 0);
            this.ended = true;
        }
    }
}