/**
 * Combo consisting of at least one other animation (linear, bezier or cicular)
 * @author Pedro Martins / Carolina Azevedo
 */
class ComboAnimation extends Animation {
    /**
     * @constructor The combo animation constructor
     * @param {scene} where the animations will be applied
     * @param {id} the combo animation ID
     * @param {spanrefs} an array consisting of the IDs of the animations existing in this combo animation
     */
    constructor(scene, id, spanrefs) {
        super(scene, id);
        this.spanrefs = spanrefs;

        this.currentAnimationIndex = 0;
        this.animations = [];

        // cycle which will go through all the animations
        for (var i = 0; i < this.spanrefs.length; i++) {
            var animationID = this.spanrefs[i];
            var animationFromScene = this.scene.animations[animationID];
            var animationType = animationFromScene[0];

            if (animationType == "linear")
                this.animations.push(new LinearAnimation(scene, animationID, animationFromScene[1], animationFromScene[2]));
            else if (animationType == "circular")
                this.animations.push(new CircularAnimation(scene, animationID, animationFromScene[1], animationFromScene[2], animationFromScene[3], animationFromScene[4],
                    animationFromScene[5], animationFromScene[6], animationFromScene[7]));
            else if (animationType == "bezier")
                this.animations.push(new BezierAnimation(scene, animationID, animationFromScene[1], animationFromScene[2]));
        }
    }

    /**
     * Updates the values of the object (its angle and its new coordinates)
     * {t} the time value passed from the scene, used to animate this object.
     */
    animate(t) {

        /*
        	Different cases for the animation processing where more than one animation exists.
        	Case 1: if the current animation has not ended, then call its animate function with the time to animate.
        	Case 2: if the current animation has ended, and the following animation is still not the last one, increase the current animation counter.
        	This will process the animation in the 'case 1', described above.
        	Case 3: if the current animation has ended, and the current animation is the final animation, then continues no animate it nonetheless,
        	even without movement. This will prevent the scene from skipping the drawing of this component.
        */

        if (this.spanrefs.length > 0) {
            if (this.animations[this.currentAnimationIndex].ended == false)
                this.animations[this.currentAnimationIndex].animate(t);
            else if (this.animations[this.currentAnimationIndex].ended && this.currentAnimationIndex != this.spanrefs.length - 1)		
				this.animations[++this.currentAnimationIndex].animate(t);		
            else if (this.animations[this.currentAnimationIndex].ended && this.currentAnimationIndex == this.spanrefs.length - 1)
                this.animations[this.currentAnimationIndex].animate(t);
        }
    }
}