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

    this.smallerComponents = [];
    this.transformations = node.transformations;
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
                console.log("Shouldn't reach here. No object of this type exists!");
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
Component.prototype.display = function(componentMaterial, textureMaterial) {
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

    // Removes texture from parent if texture is 'clear'
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
					console.log("Shouldn't reach here. No rotation of this kind exists!");
			}

        } else {

            this.scene.scale(this.transformations[i][1], this.transformations[i][2], this.transformations[i][3]);
        }
    }

    // CHILDREN, BOTH NODEREFS AND LEAVES
    for (var i = 0; i < this.smallerComponents.length; i++) {

        this.scene.pushMatrix();

        // If the smaller component is a noderef (and not a primitive) call its normal display function, passing down the material and the texture to ensure inheritance
        if (this.smallerComponents[i] instanceof Component)
            this.smallerComponents[i].display(componentMaterial, textureMaterial);
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

        this.scene.popMatrix();
    }
}