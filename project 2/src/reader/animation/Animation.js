/**
 * Abstract class, representing an animation in the scene
 * @author Pedro Martins / Carolina Azevedo
 */
class Animation {
    /**
     * @constructor The animation constructor class
     * @param {scene} where the animation will be applied
     * @param {id} the animation ID
     */
    constructor(scene, id) {
        this.scene = scene;
        this.id = id;
        this.ended = false; // always start an animation automatically. This value will be true when the animation ends.
    }
}