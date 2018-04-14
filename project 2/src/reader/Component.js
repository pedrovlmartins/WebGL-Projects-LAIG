/**
 * A component of the scene, representing its construction in XML in relation with the graph.
 * @author Pedro Martins / Carolina Azevedo
 * @constructor
 * @param scene the scene on which the component will be drawn.
 * @param node the node related with the component itself.
 */
function Component(scene, node) {
    CGFobject.call(this, scene);
    this.name = node.name;
    this.shaderName = "noShader";

    this.transformations = node.transformations;
    this.smallerComponents = [];

    this.animationIDs = node.animations;
    this.componentAnimations = [];

    // Animation pre-processing. Creates the animations based on the information read from the node. Adds all of them to a componentAnimations array.
    for (var i = 0; i < this.animationIDs.length; i++) {
        var animationID = this.animationIDs[i];
        var animationFromScene = this.scene.animations[animationID];
        var animationType = animationFromScene[0];

        switch (animationType) {
            case "linear":
                this.componentAnimations.push(new LinearAnimation(scene, animationID, animationFromScene[1], animationFromScene[2]));
                break;
            case "circular":
                this.componentAnimations.push(new CircularAnimation(scene, animationID, animationFromScene[1], animationFromScene[2], animationFromScene[3], animationFromScene[4],
                    animationFromScene[5], animationFromScene[6], animationFromScene[7]));
                break;
            case "bezier":
                this.componentAnimations.push(new BezierAnimation(scene, animationID, animationFromScene[1], animationFromScene[2]));
                break;
            case "combo":
                this.componentAnimations.push(new ComboAnimation(scene, animationID, animationFromScene[1]));
                break;
            default:
                console.log("Shouldn't reach here after parsing. No animation of this type exists!");
        }
    }

    if (this.animationIDs.length > 0)
        this.currentAnimationIndex = 0;

    this.texture = node.texture;
    this.material = node.material;

    //creates the noderef objects based on the noderefs ids (if provided)
    for (var i = 0; i < node.nextNoderefs.length; i++) {
        var nodeRef;

        for (var j = 0; j < scene.graph.nodes.length; j++)
            if (scene.graph.nodes[j].id == node.nextNoderefs[i])
                nodeRef = scene.graph.nodes[j];

        this.smallerComponents[i] = new Component(scene, nodeRef);
    }

    //creates the leaves objects based on the leaves ids (if provided)
    for (var i = 0; i < node.nextLeaves.length; i++) {
        var type = node.nextLeaves[i].type;

        switch (type) {
            case "cylinder":
                var tempArgs = node.nextLeaves[i].args;
                this.smallerComponents[node.nextNoderefs.length + i] = new Cylinder(scene, tempArgs[0], tempArgs[1], tempArgs[2], tempArgs[3], tempArgs[4], tempArgs[5], tempArgs[6]);
                break;
            case "rectangle":
                var tempArgs = node.nextLeaves[i].args;
                this.smallerComponents[node.nextNoderefs.length + i] = new Rectangle(scene, tempArgs[0], tempArgs[1], tempArgs[2], tempArgs[3]);
                break;
            case "sphere":
                var tempArgs = node.nextLeaves[i].args;
                this.smallerComponents[node.nextNoderefs.length + i] = new Sphere(scene, tempArgs[0], tempArgs[1], tempArgs[2], 1);
                break;
            case "triangle":
                var tempArgs = node.nextLeaves[i].args;
                this.smallerComponents[node.nextNoderefs.length + i] = new Triangle(scene, tempArgs[0], tempArgs[1], tempArgs[2], tempArgs[3], tempArgs[4], tempArgs[5], tempArgs[6], tempArgs[7], tempArgs[8]);
                break;
            case "patch":
                var tempArgs = node.nextLeaves[i].args;
                this.smallerComponents[node.nextNoderefs.length + i] = new Patch(scene, tempArgs[0], tempArgs[1], tempArgs[2]);
                break;
            default:
                console.log("Shouldn't reach here after parsing. No object of this type exists!");
        }
    }
};

Component.prototype = Object.create(CGFobject.prototype);
Component.prototype.constructor = Component;

/**
 * Displays the component in the scene, with inheritance.
 * @param componentMaterial the material of this object to be displayed.
 * @param textureMaterial the texture of this object to be displayed.
 */
Component.prototype.display = function(componentMaterial, textureMaterial, time, animations) {
    /* INHERITANCE - HOW DOES IT WORK
		This component has children. The children will be displayed recursively with this function.
		This component has a texture and a material, which will be passed over as arguments (componentMaterial and textureMaterial)
		to the children smaller components. If they have intern texture/materials read from the graph (through this.texture and this.material), 
		the following ifs will replace the passed textures with the new ones. However, if the value in the graph is "null", then nothing happens,
		and the texture and material of the smaller component will be the same as the parent. Clear removes the inherited texture from the parent.
	*/

    // Search for material if this component material is not null, and sets the current material to the found material.
    if (this.material != 'null')
        for (var i = 0; i < this.scene.materials.length; i++)
            if (this.scene.materials[i].materialId == this.material)
                componentMaterial = i;

    // Search for texture if this component texture is not null, and sets the current texture to the found texture.
    if (this.texture != 'null')
        for (var i = 0; i < this.scene.textures.length; i++)
            if (this.scene.textures[i].id == this.texture)
                textureMaterial = i;

    // Removes texture from parent if texture is 'clear'.
    if (this.texture == 'clear')
        textureMaterial = -1;

    // APPLY TRANSFORMATIONS
    for (var i = 0; i < this.transformations.length; i++) {
        if (this.transformations[i][0] == 'TRANSLATION') {

            this.scene.translate(this.transformations[i][1], this.transformations[i][2], this.transformations[i][3]);

        } else if (this.transformations[i][0] == 'ROTATION') {

            switch (this.transformations[i][1]) {
                case "x":
                    this.scene.rotate(this.transformations[i][2] * (Math.PI / 180.0), 1, 0, 0);
                    break;
                case "y":
                    this.scene.rotate(this.transformations[i][2] * (Math.PI / 180.0), 0, 1, 0);
                    break;
                case "z":
                    this.scene.rotate(this.transformations[i][2] * (Math.PI / 180.0), 0, 0, 1);
                    break;
                default:
                    console.log("Shouldn't reach here after parsing. No rotation of this kind exists!");
            }

        } else {

            this.scene.scale(this.transformations[i][1], this.transformations[i][2], this.transformations[i][3]);
        }
    }

    /*
    	Different cases for the animation processing in case of existing more than one animation.
    	Case 1: if the current animation has not ended, then call its animate function with the time to animate.
    	Case 2: if the current animation has ended, and the following animation is still not the last one, increase the current animation counter.
    	This will process the animation in the 'case 1', described above.
    	Case 3: if the current animation has ended, and the current animation is the final animation, then continues no animate it nonetheless,
    	even without movement. This will prevent the scene from skipping the drawing of this component.
    */
    if (this.animationIDs.length > 0) {
        if (this.componentAnimations[this.currentAnimationIndex].ended == false)
            this.componentAnimations[this.currentAnimationIndex].animate(time);
        else if (this.componentAnimations[this.currentAnimationIndex].ended && this.currentAnimationIndex != this.animationIDs.length - 1)
            this.componentAnimations[++this.currentAnimationIndex].animate(time);			
        else if (this.componentAnimations[this.currentAnimationIndex].ended && this.currentAnimationIndex == this.animationIDs.length - 1)
            this.componentAnimations[this.currentAnimationIndex].animate(time);
    }

    // finds the shader name using the variable "theActiveShader", which connects with the interface and refers to the current shader selected by the user
    if (this.scene.theActiveShader != 0)
        this.setShaderName(this.scene.theActiveShader);

    // CHILDREN, BOTH NODEREFS AND LEAVES
    for (var i = 0; i < this.smallerComponents.length; i++) {

        this.scene.pushMatrix();

        // APPLYS SHADER BEFORE DRAWING ITS COMPONENTS
        if (this.scene.shadersAllowed && this.name == this.shaderName)
            this.scene.setActiveShader(this.scene.myShader);

        // If the smaller component is a noderef (and not a primitive) call its normal display function, passing down the material and the texture to ensure inheritance
        if (this.smallerComponents[i] instanceof Component)
            this.smallerComponents[i].display(componentMaterial, textureMaterial, time, animations);
        else { // if the smaller component is however a leaf, set its texture and material and display it in the scene
            var componentAppearance = new CGFappearance(this.scene);
            componentAppearance.setTexture(null);

            if (componentMaterial != -1) {
                if (textureMaterial == -1) { // if no texture (but has material), set the texture to null and apply the material
                    this.scene.materials[componentMaterial].setTexture(null);
                    this.scene.materials[componentMaterial].apply();
                } else { // if both texture and material, set all the values of the material and amplify the texture (if required), and apply

                    componentAppearance.setAmbient(this.scene.materials[componentMaterial].ambient[0], this.scene.materials[componentMaterial].ambient[1], this.scene.materials[componentMaterial].ambient[2], this.scene.materials[componentMaterial].ambient[3]);
                    componentAppearance.setDiffuse(this.scene.materials[componentMaterial].diffuse[0], this.scene.materials[componentMaterial].diffuse[1], this.scene.materials[componentMaterial].diffuse[2], this.scene.materials[componentMaterial].diffuse[3]);
                    componentAppearance.setEmission(this.scene.materials[componentMaterial].emission[0], this.scene.materials[componentMaterial].emission[1], this.scene.materials[componentMaterial].emission[2], this.scene.materials[componentMaterial].emission[3]);
                    componentAppearance.setSpecular(this.scene.materials[componentMaterial].specular[0], this.scene.materials[componentMaterial].specular[1], this.scene.materials[componentMaterial].specular[2], this.scene.materials[componentMaterial].specular[3]);
                    componentAppearance.setShininess(this.scene.materials[componentMaterial].shininess);
                    componentAppearance.setTexture(this.scene.textures[textureMaterial].texture);

                    this.smallerComponents[i].setSandT(this.scene.textures[textureMaterial].s, this.scene.textures[textureMaterial].t);

                    componentAppearance.apply();
                }
            } else if (textureMaterial != -1) { // if no material (but has texture), amplify the texture (if required)
                this.smallerComponents[i].setSandT(this.scene.textures[textureMaterial].s, this.scene.textures[textureMaterial].t);
                this.scene.textures[textureMaterial].apply();
            } else {
                componentAppearance.apply(); // if no texture and no material, applies default appearance. Shouldn't reach here because of inheritance.
            }

            this.smallerComponents[i].display();
        }

        // APPLYS DEFAULT SHADER AFTER DRAWING ALL THE COMPONENTS
        // This prevents the shader from being initialized with nodes which don't use it.
        if (this.scene.shadersAllowed && this.name == this.shaderName)
            this.scene.setActiveShader(this.scene.defaultShader);

        this.scene.popMatrix();
    }
}

/**
 * Used in the selectables map to find the key, given the value.
 * @param the value used to find the key.
 */
Component.prototype.setShaderName = function(value) {
    for (var key in this.scene.selectables) {
        if (this.scene.selectables.hasOwnProperty(key)) {
            if (this.scene.selectables[key] == value)
                this.shaderName = key;
        }
    }
}