var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var ILLUMINATION_INDEX = 1;
var LIGHTS_INDEX = 2;
var TEXTURES_INDEX = 3;
var MATERIALS_INDEX = 4;
var ANIMATIONS_INDEX = 5;
var NODES_INDEX = 6;

/**
 * Parser class, representing the scene graph.
 * @constructor
 */
function Parser(filename, scene) {
    this.loadedOk = null;

    // Establish bidirectional references between scene and graph
    this.scene = scene;
    scene.graph = this;

    this.nodes = [];

    this.idRoot = null; // The id of the root element.

    this.axisCoords = [];
    this.axisCoords['x'] = [1, 0, 0];
    this.axisCoords['y'] = [0, 1, 0];
    this.axisCoords['z'] = [0, 0, 1];

    // File reading
    this.reader = new CGFXMLreader();

    /*
     * Read the contents of the xml file, and refer to this class for loading and error handlers.
     * After the file is read, the reader calls onXMLReady on this object.
     * If any error occurs, the reader calls onXMLError on this object, with an error message
     */

    this.reader.open('scenes/' + filename, this);
}

/*
 * Callback to be executed after successful reading
 */
Parser.prototype.onXMLReady = function() {
    console.log("XML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;

    if (error != null) {
        this.onXMLError(error);
        return;
    }

    //// OTHER PARSING ////
    var error = this.parseLSXFile(rootElement);

    if (error != null) {
        this.onXMLError(error);
        return;
    } else if (this.cyclicError != "") {
        this.onXMLError(this.cyclicError);
        return;
    } else if (this.descendantsError != "") {
        this.onXMLError(this.descendantsError);
        return;
    }


    this.loadedOk = true;

    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
};

/**
 * Parses the LSX file, processing each block.
 */
Parser.prototype.parseLSXFile = function(rootElement) {
    this.cyclicError = "";
    this.descendantsError = "";

    if (rootElement.nodeName != "SCENE")
        return "root tag <SCENE> missing";

    var nodes = rootElement.children;

    // Reads the names of the nodes to an auxiliary buffer.
    var nodeNames = [];

    for (var i = 0; i < nodes.length; i++) {
        nodeNames.push(nodes[i].nodeName);
    }

    var error;

    // Processes each node, verifying errors.

    // <INITIALS>
    var index;
    if ((index = nodeNames.indexOf("INITIALS")) == -1)
        return "tag <INITIALS> missing";
    else {
        if (index != INITIALS_INDEX)
            this.onXMLMinorError("tag <INITIALS> out of order");

        if ((error = this.parseInitials(nodes[index])) != null)
            return error;
    }

    // <ILLUMINATION>
    if ((index = nodeNames.indexOf("ILLUMINATION")) == -1)
        return "tag <ILLUMINATION> missing";
    else {
        if (index != ILLUMINATION_INDEX)
            this.onXMLMinorError("tag <ILLUMINATION> out of order");

        if ((error = this.parseIllumination(nodes[index])) != null)
            return error;
    }

    // <LIGHTS>
    if ((index = nodeNames.indexOf("LIGHTS")) == -1)
        return "tag <LIGHTS> missing";
    else {
        if (index != LIGHTS_INDEX)
            this.onXMLMinorError("tag <LIGHTS> out of order");

        if ((error = this.parseLights(nodes[index])) != null)
            return error;
    }

    // <TEXTURES>
    if ((index = nodeNames.indexOf("TEXTURES")) == -1)
        return "tag <TEXTURES> missing";
    else {
        if (index != TEXTURES_INDEX)
            this.onXMLMinorError("tag <TEXTURES> out of order");

        if ((error = this.parseTextures(nodes[index])) != null)
            return error;
    }

    // <MATERIALS>
    if ((index = nodeNames.indexOf("MATERIALS")) == -1)
        return "tag <MATERIALS> missing";
    else {
        if (index != MATERIALS_INDEX)
            this.onXMLMinorError("tag <MATERIALS> out of order");

        if ((error = this.parseMaterials(nodes[index])) != null)
            return error;
    }

    // <ANIMATIONS>
    if ((index = nodeNames.indexOf("ANIMATIONS")) == -1)
        return "tag <ANIMATIONS> missing";
    else {
        if (index != ANIMATIONS_INDEX)
            this.onXMLMinorError("tag <ANIMATIONS> out of order");

        if ((error = this.parseAnimations(nodes[index])) != null)
            return error;
    }

    // <NODES>
    if ((index = nodeNames.indexOf("NODES")) == -1)
        return "tag <NODES> missing";
    else {
        if (index != NODES_INDEX)
            this.onXMLMinorError("tag <NODES> out of order");

        if ((error = this.parseNodes(nodes[index])) != null)
            return error;
    }
}

/**
 * Parses the <INITIALS> block.
 */
Parser.prototype.parseInitials = function(initialsNode) {

    var children = initialsNode.children;

    var nodeNames = [];

    for (var i = 0; i < children.length; i++)
        nodeNames.push(children[i].nodeName);

    // Frustum planes.
    this.near = 0.1;
    this.far = 500;
    var indexFrustum = nodeNames.indexOf("frustum");
    if (indexFrustum == -1) {
        this.onXMLMinorError("frustum planes missing; assuming 'near = 0.1' and 'far = 500'");
    } else {
        this.near = this.reader.getFloat(children[indexFrustum], 'near');
        this.far = this.reader.getFloat(children[indexFrustum], 'far');

        if (this.near == null) {
            this.near = 0.1;
            this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
        } else if (this.far == null) {
            this.far = 500;
            this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
        } else if (isNaN(this.near)) {
            this.near = 0.1;
            this.onXMLMinorError("non-numeric value found for near plane; assuming 'near = 0.1'");
        } else if (isNaN(this.far)) {
            this.far = 500;
            this.onXMLMinorError("non-numeric value found for far plane; assuming 'far = 500'");
        } else if (this.near <= 0) {
            this.near = 0.1;
            this.onXMLMinorError("'near' must be positive; assuming 'near = 0.1'");
        }

        if (this.near >= this.far)
            return "'near' must be smaller than 'far'";
    }

    // Checks if at most one translation, three rotations, and one scaling are defined.
    if (initialsNode.getElementsByTagName('translation').length > 1)
        return "no more than one initial translation may be defined";

    if (initialsNode.getElementsByTagName('rotation').length > 3)
        return "no more than three initial rotations may be defined";

    if (initialsNode.getElementsByTagName('scale').length > 1)
        return "no more than one scaling may be defined";

    // Initial transforms.
    this.initialTranslate = [];
    this.initialScaling = [];
    this.initialRotations = [];

    // Gets indices of each element.
    var translationIndex = nodeNames.indexOf("translation");
    var thirdRotationIndex = nodeNames.indexOf("rotation");
    var secondRotationIndex = nodeNames.indexOf("rotation", thirdRotationIndex + 1);
    var firstRotationIndex = nodeNames.lastIndexOf("rotation");
    var scalingIndex = nodeNames.indexOf("scale");

    // Checks if the indices are valid and in the expected order.
    // Translation.
    this.initialTransforms = mat4.create();
    mat4.identity(this.initialTransforms);
    if (translationIndex == -1)
        this.onXMLMinorError("initial translation undefined; assuming T = (0, 0, 0)");
    else {
        var tx = this.reader.getFloat(children[translationIndex], 'x');
        var ty = this.reader.getFloat(children[translationIndex], 'y');
        var tz = this.reader.getFloat(children[translationIndex], 'z');

        if (tx == null) {
            tx = 0;
            this.onXMLMinorError("failed to parse x-coordinate of initial translation; assuming tx = 0");
        } else if (isNaN(tx)) {
            tx = 0;
            this.onXMLMinorError("found non-numeric value for x-coordinate of initial translation; assuming tx = 0");
        }

        if (ty == null) {
            ty = 0;
            this.onXMLMinorError("failed to parse y-coordinate of initial translation; assuming ty = 0");
        } else if (isNaN(ty)) {
            ty = 0;
            this.onXMLMinorError("found non-numeric value for y-coordinate of initial translation; assuming ty = 0");
        }

        if (tz == null) {
            tz = 0;
            this.onXMLMinorError("failed to parse z-coordinate of initial translation; assuming tz = 0");
        } else if (isNaN(tz)) {
            tz = 0;
            this.onXMLMinorError("found non-numeric value for z-coordinate of initial translation; assuming tz = 0");
        }

        if (translationIndex > thirdRotationIndex || translationIndex > scalingIndex)
            this.onXMLMinorError("initial translation out of order; result may not be as expected");

        mat4.translate(this.initialTransforms, this.initialTransforms, [tx, ty, tz]);
    }

    // Rotations.
    var initialRotations = [];
    initialRotations['x'] = 0;
    initialRotations['y'] = 0;
    initialRotations['z'] = 0;

    var rotationDefined = [];
    rotationDefined['x'] = false;
    rotationDefined['y'] = false;
    rotationDefined['z'] = false;

    var axis;
    var rotationOrder = [];

    // Third rotation (first rotation defined).
    if (thirdRotationIndex != -1) {
        axis = this.reader.getItem(children[thirdRotationIndex], 'axis', ['x', 'y', 'z']);
        if (axis != null) {
            var angle = this.reader.getFloat(children[thirdRotationIndex], 'angle');
            if (angle != null && !isNaN(angle)) {
                initialRotations[axis] += angle;
                if (!rotationDefined[axis])
                    rotationOrder.push(axis);
                rotationDefined[axis] = true;
            } else this.onXMLMinorError("failed to parse third initial rotation 'angle'");
        }
    }

    // Second rotation.
    if (secondRotationIndex != -1) {
        axis = this.reader.getItem(children[secondRotationIndex], 'axis', ['x', 'y', 'z']);
        if (axis != null) {
            var angle = this.reader.getFloat(children[secondRotationIndex], 'angle');
            if (angle != null && !isNaN(angle)) {
                initialRotations[axis] += angle;
                if (!rotationDefined[axis])
                    rotationOrder.push(axis);
                rotationDefined[axis] = true;
            } else this.onXMLMinorError("failed to parse second initial rotation 'angle'");
        }
    }

    // First rotation.
    if (firstRotationIndex != -1) {
        axis = this.reader.getItem(children[firstRotationIndex], 'axis', ['x', 'y', 'z']);
        if (axis != null) {
            var angle = this.reader.getFloat(children[firstRotationIndex], 'angle');
            if (angle != null && !isNaN(angle)) {
                initialRotations[axis] += angle;
                if (!rotationDefined[axis])
                    rotationOrder.push(axis);
                rotationDefined[axis] = true;
            } else this.onXMLMinorError("failed to parse first initial rotation 'angle'");
        }
    }

    // Checks for undefined rotations.
    if (!rotationDefined['x'])
        this.onXMLMinorError("rotation along the Ox axis undefined; assuming Rx = 0");
    else if (!rotationDefined['y'])
        this.onXMLMinorError("rotation along the Oy axis undefined; assuming Ry = 0");
    else if (!rotationDefined['z'])
        this.onXMLMinorError("rotation along the Oz axis undefined; assuming Rz = 0");

    // Updates transform matrix.
    for (var i = 0; i < rotationOrder.length; i++)
        mat4.rotate(this.initialTransforms, this.initialTransforms, DEGREE_TO_RAD * initialRotations[rotationOrder[i]], this.axisCoords[rotationOrder[i]]);

    // Scaling.
    if (scalingIndex == -1)
        this.onXMLMinorError("initial scaling undefined; assuming S = (1, 1, 1)");
    else {
        var sx = this.reader.getFloat(children[scalingIndex], 'sx');
        var sy = this.reader.getFloat(children[scalingIndex], 'sy');
        var sz = this.reader.getFloat(children[scalingIndex], 'sz');

        if (sx == null) {
            sx = 1;
            this.onXMLMinorError("failed to parse x parameter of initial scaling; assuming sx = 1");
        } else if (isNaN(sx)) {
            sx = 1;
            this.onXMLMinorError("found non-numeric value for x parameter of initial scaling; assuming sx = 1");
        }

        if (sy == null) {
            sy = 1;
            this.onXMLMinorError("failed to parse y parameter of initial scaling; assuming sy = 1");
        } else if (isNaN(sy)) {
            sy = 1;
            this.onXMLMinorError("found non-numeric value for y parameter of initial scaling; assuming sy = 1");
        }

        if (sz == null) {
            sz = 1;
            this.onXMLMinorError("failed to parse z parameter of initial scaling; assuming sz = 1");
        } else if (isNaN(sz)) {
            sz = 1;
            this.onXMLMinorError("found non-numeric value for z parameter of initial scaling; assuming sz = 1");
        }

        if (scalingIndex < firstRotationIndex)
            this.onXMLMinorError("initial scaling out of order; result may not be as expected");

        mat4.scale(this.initialTransforms, this.initialTransforms, [sx, sy, sz]);
    }

    // ----------
    // Reference length.
    this.referenceLength = 1;

    var indexReference = nodeNames.indexOf("reference");
    if (indexReference == -1)
        this.onXMLMinorError("reference length undefined; assuming 'length = 1'");
    else {
        // Reads the reference length.
        var length = this.reader.getFloat(children[indexReference], 'length');

        if (length != null) {
            if (isNaN(length))
                this.onXMLMinorError("found non-numeric value for reference length; assuming 'length = 1'");
            else if (length <= 0)
                this.onXMLMinorError("reference length must be a positive value; assuming 'length = 1'");
            else
                this.referenceLength = length;
        } else
            this.onXMLMinorError("unable to parse reference length; assuming 'length = 1'");

    }

    return null;
}

/**
 * Parses the <ILLUMINATION> block.
 */
Parser.prototype.parseIllumination = function(illuminationNode) {

    // Reads the ambient and background values.
    var children = illuminationNode.children;
    var nodeNames = [];
    for (var i = 0; i < children.length; i++)
        nodeNames.push(children[i].nodeName);

    // Retrieves the global ambient illumination.
    this.ambientIllumination = [0, 0, 0, 1];
    var ambientIndex = nodeNames.indexOf("ambient");
    if (ambientIndex != -1) {
        // R.
        var r = this.reader.getFloat(children[ambientIndex], 'r');
        if (r != null) {
            if (isNaN(r))
                return "ambient 'r' is a non numeric value on the ILLUMINATION block";
            else if (r < 0 || r > 1)
                return "ambient 'r' must be a value between 0 and 1 on the ILLUMINATION block"
            else
                this.ambientIllumination[0] = r;
        } else
            this.onXMLMinorError("unable to parse R component of the ambient illumination; assuming R = 0");

        // G.
        var g = this.reader.getFloat(children[ambientIndex], 'g');
        if (g != null) {
            if (isNaN(g))
                return "ambient 'g' is a non numeric value on the ILLUMINATION block";
            else if (g < 0 || g > 1)
                return "ambient 'g' must be a value between 0 and 1 on the ILLUMINATION block"
            else
                this.ambientIllumination[1] = g;
        } else
            this.onXMLMinorError("unable to parse G component of the ambient illumination; assuming G = 0");

        // B.
        var b = this.reader.getFloat(children[ambientIndex], 'b');
        if (b != null) {
            if (isNaN(b))
                return "ambient 'b' is a non numeric value on the ILLUMINATION block";
            else if (b < 0 || b > 1)
                return "ambient 'b' must be a value between 0 and 1 on the ILLUMINATION block"
            else
                this.ambientIllumination[2] = b;
        } else
            this.onXMLMinorError("unable to parse B component of the ambient illumination; assuming B = 0");

        // A.
        var a = this.reader.getFloat(children[ambientIndex], 'a');
        if (a != null) {
            if (isNaN(a))
                return "ambient 'a' is a non numeric value on the ILLUMINATION block";
            else if (a < 0 || a > 1)
                return "ambient 'a' must be a value between 0 and 1 on the ILLUMINATION block"
            else
                this.ambientIllumination[3] = a;
        } else
            this.onXMLMinorError("unable to parse A component of the ambient illumination; assuming A = 1");
    } else
        this.onXMLMinorError("global ambient illumination undefined; assuming Ia = (0, 0, 0, 1)");

    // Retrieves the background clear color.
    this.background = [0, 0, 0, 1];
    var backgroundIndex = nodeNames.indexOf("background");
    if (backgroundIndex != -1) {
        // R.
        var r = this.reader.getFloat(children[backgroundIndex], 'r');
        if (r != null) {
            if (isNaN(r))
                return "background 'r' is a non numeric value on the ILLUMINATION block";
            else if (r < 0 || r > 1)
                return "background 'r' must be a value between 0 and 1 on the ILLUMINATION block"
            else
                this.background[0] = r;
        } else
            this.onXMLMinorError("unable to parse R component of the background colour; assuming R = 0");

        // G.
        var g = this.reader.getFloat(children[backgroundIndex], 'g');
        if (g != null) {
            if (isNaN(g))
                return "background 'g' is a non numeric value on the ILLUMINATION block";
            else if (g < 0 || g > 1)
                return "background 'g' must be a value between 0 and 1 on the ILLUMINATION block"
            else
                this.background[1] = g;
        } else
            this.onXMLMinorError("unable to parse G component of the background colour; assuming G = 0");

        // B.
        var b = this.reader.getFloat(children[backgroundIndex], 'b');
        if (b != null) {
            if (isNaN(b))
                return "background 'b' is a non numeric value on the ILLUMINATION block";
            else if (b < 0 || b > 1)
                return "background 'b' must be a value between 0 and 1 on the ILLUMINATION block"
            else
                this.background[2] = b;
        } else
            this.onXMLMinorError("unable to parse B component of the background colour; assuming B = 0");

        // A.
        var a = this.reader.getFloat(children[backgroundIndex], 'a');
        if (a != null) {
            if (isNaN(a))
                return "background 'a' is a non numeric value on the ILLUMINATION block";
            else if (a < 0 || a > 1)
                return "background 'a' must be a value between 0 and 1 on the ILLUMINATION block"
            else
                this.background[3] = a;
        } else
            this.onXMLMinorError("unable to parse A component of the background colour; assuming A = 1");
    } else
        this.onXMLMinorError("background clear colour undefined; assuming (R, G, B, A) = (0, 0, 0, 1)");

    return null;
}

/**
 * Parses the <LIGHTS> node.
 */
Parser.prototype.parseLights = function(lightsNode) {
    var children = lightsNode.children;

    this.lights = [];
    var numLights = 0;

    var grandChildren = [];
    var nodeNames = [];

    // Any number of lights.
    for (var i = 0; i < children.length; i++) {

        if (children[i].nodeName != "LIGHT") {
            this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
            continue;
        }

        // Get id of the current light.
        var lightId = this.reader.getString(children[i], 'id');
        if (lightId == null)
            return "no ID defined for light";

        // Checks for repeated IDs.
        if (this.lights[lightId] != null)
            return "ID must be unique for each light (conflict: ID = " + lightId + ")";

        grandChildren = children[i].children;
        // Specifications for the current light.

        nodeNames = [];
        for (var j = 0; j < grandChildren.length; j++) {
            nodeNames.push(grandChildren[j].nodeName);
        }

        // Gets indices of each element.
        var enableIndex = nodeNames.indexOf("enable");
        var positionIndex = nodeNames.indexOf("position");
        var ambientIndex = nodeNames.indexOf("ambient");
        var diffuseIndex = nodeNames.indexOf("diffuse");
        var specularIndex = nodeNames.indexOf("specular");

        // Light enable/disable
        var enableLight = true;
        if (enableIndex == -1) {
            this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
        } else {
            var aux = this.reader.getFloat(grandChildren[enableIndex], 'value');
            if (aux == null) {
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
            } else if (isNaN(aux))
                return "'enable value' is a non numeric value on the LIGHTS block";
            else if (aux != 0 && aux != 1)
                return "'enable value' must be 0 or 1 on the LIGHTS block"
            else
                enableLight = aux == 0 ? false : true;
        }

        // Retrieves the light position.
        var positionLight = [];
        if (positionIndex != -1) {
            // x
            var x = this.reader.getFloat(grandChildren[positionIndex], 'x');
            if (x != null) {
                if (isNaN(x))
                    return "'x' is a non numeric value on the LIGHTS block";
                else
                    positionLight.push(x);
            } else
                return "unable to parse x-coordinate of the light position for ID = " + lightId;

            // y
            var y = this.reader.getFloat(grandChildren[positionIndex], 'y');
            if (y != null) {
                if (isNaN(y))
                    return "'y' is a non numeric value on the LIGHTS block";
                else
                    positionLight.push(y);
            } else
                return "unable to parse y-coordinate of the light position for ID = " + lightId;

            // z
            var z = this.reader.getFloat(grandChildren[positionIndex], 'z');
            if (z != null) {
                if (isNaN(z))
                    return "'z' is a non numeric value on the LIGHTS block";
                else
                    positionLight.push(z);
            } else
                return "unable to parse z-coordinate of the light position for ID = " + lightId;

            // w
            var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
            if (w != null) {
                if (isNaN(w))
                    return "'w' is a non numeric value on the LIGHTS block";
                else if (w < 0 || w > 1)
                    return "'w' must be a value between 0 and 1 on the LIGHTS block"
                else
                    positionLight.push(w);
            } else
                return "unable to parse w-coordinate of the light position for ID = " + lightId;
        } else
            return "light position undefined for ID = " + lightId;

        // Retrieves the ambient component.
        var ambientIllumination = [];
        if (ambientIndex != -1) {
            // R
            var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
            if (r != null) {
                if (isNaN(r))
                    return "ambient 'r' is a non numeric value on the LIGHTS block";
                else if (r < 0 || r > 1)
                    return "ambient 'r' must be a value between 0 and 1 on the LIGHTS block"
                else
                    ambientIllumination.push(r);
            } else
                return "unable to parse R component of the ambient illumination for ID = " + lightId;

            // G
            var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
            if (g != null) {
                if (isNaN(g))
                    return "ambient 'g' is a non numeric value on the LIGHTS block";
                else if (g < 0 || g > 1)
                    return "ambient 'g' must be a value between 0 and 1 on the LIGHTS block"
                else
                    ambientIllumination.push(g);
            } else
                return "unable to parse G component of the ambient illumination for ID = " + lightId;

            // B
            var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
            if (b != null) {
                if (isNaN(b))
                    return "ambient 'b' is a non numeric value on the LIGHTS block";
                else if (b < 0 || b > 1)
                    return "ambient 'b' must be a value between 0 and 1 on the LIGHTS block"
                else
                    ambientIllumination.push(b);
            } else
                return "unable to parse B component of the ambient illumination for ID = " + lightId;

            // A
            var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
            if (a != null) {
                if (isNaN(a))
                    return "ambient 'a' is a non numeric value on the LIGHTS block";
                else if (a < 0 || a > 1)
                    return "ambient 'a' must be a value between 0 and 1 on the LIGHTS block"
                ambientIllumination.push(a);
            } else
                return "unable to parse A component of the ambient illumination for ID = " + lightId;
        } else
            return "ambient component undefined for ID = " + lightId;

        // Retrieves the diffuse component
        var diffuseIllumination = [];
        if (diffuseIndex != -1) {
            // R
            var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
            if (r != null) {
                if (isNaN(r))
                    return "diffuse 'r' is a non numeric value on the LIGHTS block";
                else if (r < 0 || r > 1)
                    return "diffuse 'r' must be a value between 0 and 1 on the LIGHTS block"
                else
                    diffuseIllumination.push(r);
            } else
                return "unable to parse R component of the diffuse illumination for ID = " + lightId;

            // G
            var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
            if (g != null) {
                if (isNaN(g))
                    return "diffuse 'g' is a non numeric value on the LIGHTS block";
                else if (g < 0 || g > 1)
                    return "diffuse 'g' must be a value between 0 and 1 on the LIGHTS block"
                else
                    diffuseIllumination.push(g);
            } else
                return "unable to parse G component of the diffuse illumination for ID = " + lightId;

            // B
            var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
            if (b != null) {
                if (isNaN(b))
                    return "diffuse 'b' is a non numeric value on the LIGHTS block";
                else if (b < 0 || b > 1)
                    return "diffuse 'b' must be a value between 0 and 1 on the LIGHTS block"
                else
                    diffuseIllumination.push(b);
            } else
                return "unable to parse B component of the diffuse illumination for ID = " + lightId;

            // A
            var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
            if (a != null) {
                if (isNaN(a))
                    return "diffuse 'a' is a non numeric value on the LIGHTS block";
                else if (a < 0 || a > 1)
                    return "diffuse 'a' must be a value between 0 and 1 on the LIGHTS block"
                else
                    diffuseIllumination.push(a);
            } else
                return "unable to parse A component of the diffuse illumination for ID = " + lightId;
        } else
            return "diffuse component undefined for ID = " + lightId;

        // Retrieves the specular component
        var specularIllumination = [];
        if (specularIndex != -1) {
            // R
            var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
            if (r != null) {
                if (isNaN(r))
                    return "specular 'r' is a non numeric value on the LIGHTS block";
                else if (r < 0 || r > 1)
                    return "specular 'r' must be a value between 0 and 1 on the LIGHTS block"
                else
                    specularIllumination.push(r);
            } else
                return "unable to parse R component of the specular illumination for ID = " + lightId;

            // G
            var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
            if (g != null) {
                if (isNaN(g))
                    return "specular 'g' is a non numeric value on the LIGHTS block";
                else if (g < 0 || g > 1)
                    return "specular 'g' must be a value between 0 and 1 on the LIGHTS block"
                else
                    specularIllumination.push(g);
            } else
                return "unable to parse G component of the specular illumination for ID = " + lightId;

            // B
            var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
            if (b != null) {
                if (isNaN(b))
                    return "specular 'b' is a non numeric value on the LIGHTS block";
                else if (b < 0 || b > 1)
                    return "specular 'b' must be a value between 0 and 1 on the LIGHTS block"
                else
                    specularIllumination.push(b);
            } else
                return "unable to parse B component of the specular illumination for ID = " + lightId;

            // A
            var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
            if (a != null) {
                if (isNaN(a))
                    return "specular 'a' is a non numeric value on the LIGHTS block";
                else if (a < 0 || a > 1)
                    return "specular 'a' must be a value between 0 and 1 on the LIGHTS block"
                else
                    specularIllumination.push(a);
            } else
                return "unable to parse A component of the specular illumination for ID = " + lightId;
        } else
            return "specular component undefined for ID = " + lightId;

        // Light global information.

        this.lights[lightId] = [enableLight, positionLight, ambientIllumination, diffuseIllumination, specularIllumination];


        numLights++;
    }


    if (numLights == 0)
        return "at least one light must be defined";
    else if (numLights > 8)
        this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

    return null;
}

/**
 * Parses the <TEXTURES> block.
 */
Parser.prototype.parseTextures = function(texturesNode) {

    this.textures = [];

    var eachTexture = texturesNode.children;
    // Each texture.

    var oneTextureDefined = false;

    for (var i = 0; i < eachTexture.length; i++) {
        var nodeName = eachTexture[i].nodeName;
        if (nodeName == "TEXTURE") {
            // Retrieves texture ID.
            var textureID = this.reader.getString(eachTexture[i], 'id');
            if (textureID == null)
                return "failed to parse texture ID";
            // Checks if ID is valid.
            for (var j = 0; j < this.textures.length; j++)
                if (this.textures[j].textureID == textureID)
                    return "texture ID must unique (conflict with ID = " + textureID + ")";

            var texSpecs = eachTexture[i].children;
            var filepath = null;
            var amplifFactorS = null;
            var amplifFactorT = null;
            // Retrieves texture specifications.
            for (var j = 0; j < texSpecs.length; j++) {
                var name = texSpecs[j].nodeName;
                if (name == "file") {
                    if (filepath != null)
                        return "duplicate file paths in texture with ID = " + textureID;

                    filepath = 'scenes/' + this.reader.getString(texSpecs[j], 'path');
                    if (filepath == null)
                        return "unable to parse texture file path for ID = " + textureID;
                } else if (name == "amplif_factor") {
                    if (amplifFactorS != null || amplifFactorT != null)
                        return "duplicate amplification factors in texture with ID = " + textureID;

                    amplifFactorS = this.reader.getFloat(texSpecs[j], 's');
                    amplifFactorT = this.reader.getFloat(texSpecs[j], 't');

                    if (amplifFactorS == null || amplifFactorT == null)
                        return "unable to parse texture amplification factors for ID = " + textureID;
                    else if (isNaN(amplifFactorS))
                        return "'amplifFactorS' is a non numeric value";
                    else if (isNaN(amplifFactorT))
                        return "'amplifFactorT' is a non numeric value";
                    else if (amplifFactorS <= 0 || amplifFactorT <= 0)
                        return "value for amplifFactor must be positive";
                } else
                    this.onXMLMinorError("unknown tag name <" + name + ">");
            }

            if (filepath == null)
                return "file path undefined for texture with ID = " + textureID;
            else if (amplifFactorS == null)
                return "s amplification factor undefined for texture with ID = " + textureID;
            else if (amplifFactorT == null)
                return "t amplification factor undefined for texture with ID = " + textureID;

            this.textures[i] = {
                "textureID": textureID,
                "filepath": filepath,
                "amplifFactorS": amplifFactorS,
                "amplifFactorT": amplifFactorT
            };

            oneTextureDefined = true;
        } else
            this.onXMLMinorError("unknown tag name <" + nodeName + ">");
    }

    if (!oneTextureDefined)
        return "at least one texture must be defined in the TEXTURES block";
}

/**
 * Parses the <MATERIALS> node.
 */
Parser.prototype.parseMaterials = function(materialsNode) {

    var children = materialsNode.children;
    // Each material.

    this.materials = [];

    var oneMaterialDefined = false;

    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeName != "MATERIAL") {
            this.onXMLMinorError("unknown tag name <" + children[i].nodeName + ">");
            continue;
        }

        var materialID = this.reader.getString(children[i], 'id');
        if (materialID == null)
            return "no ID defined for material";

        for (var j = 0; j < this.materials.length; j++)
            if (this.materials[j].materialID == materialID)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

        var materialSpecs = children[i].children;

        var nodeNames = [];

        for (var j = 0; j < materialSpecs.length; j++)
            nodeNames.push(materialSpecs[j].nodeName);

        // Determines the values for each field.
        // Shininess.
        var shininessIndex = nodeNames.indexOf("shininess");
        if (shininessIndex == -1)
            return "no shininess value defined for material with ID = " + materialID;
        var shininess = this.reader.getFloat(materialSpecs[shininessIndex], 'value');
        if (shininess == null)
            return "unable to parse shininess value for material with ID = " + materialID;
        else if (isNaN(shininess))
            return "'shininess' is a non numeric value";
        else if (shininess <= 0)
            return "'shininess' must be positive";

        // Specular component.
        var specularIndex = nodeNames.indexOf("specular");
        if (specularIndex == -1)
            return "no specular component defined for material with ID = " + materialID;
        var specularComponent = [];
        // R.
        var r = this.reader.getFloat(materialSpecs[specularIndex], 'r');
        if (r == null)
            return "unable to parse R component of specular reflection for material with ID = " + materialID;
        else if (isNaN(r))
            return "specular 'r' is a non numeric value on the MATERIALS block";
        else if (r < 0 || r > 1)
            return "specular 'r' must be a value between 0 and 1 on the MATERIALS block"
        specularComponent.push(r);
        // G.
        var g = this.reader.getFloat(materialSpecs[specularIndex], 'g');
        if (g == null)
            return "unable to parse G component of specular reflection for material with ID = " + materialID;
        else if (isNaN(g))
            return "specular 'g' is a non numeric value on the MATERIALS block";
        else if (g < 0 || g > 1)
            return "specular 'g' must be a value between 0 and 1 on the MATERIALS block";
        specularComponent.push(g);
        // B.
        var b = this.reader.getFloat(materialSpecs[specularIndex], 'b');
        if (b == null)
            return "unable to parse B component of specular reflection for material with ID = " + materialID;
        else if (isNaN(b))
            return "specular 'b' is a non numeric value on the MATERIALS block";
        else if (b < 0 || b > 1)
            return "specular 'b' must be a value between 0 and 1 on the MATERIALS block";
        specularComponent.push(b);
        // A.
        var a = this.reader.getFloat(materialSpecs[specularIndex], 'a');
        if (a == null)
            return "unable to parse A component of specular reflection for material with ID = " + materialID;
        else if (isNaN(a))
            return "specular 'a' is a non numeric value on the MATERIALS block";
        else if (a < 0 || a > 1)
            return "specular 'a' must be a value between 0 and 1 on the MATERIALS block";
        specularComponent.push(a);

        // Diffuse component.
        var diffuseIndex = nodeNames.indexOf("diffuse");
        if (diffuseIndex == -1)
            return "no diffuse component defined for material with ID = " + materialID;
        var diffuseComponent = [];
        // R.
        r = this.reader.getFloat(materialSpecs[diffuseIndex], 'r');
        if (r == null)
            return "unable to parse R component of diffuse reflection for material with ID = " + materialID;
        else if (isNaN(r))
            return "diffuse 'r' is a non numeric value on the MATERIALS block";
        else if (r < 0 || r > 1)
            return "diffuse 'r' must be a value between 0 and 1 on the MATERIALS block";
        diffuseComponent.push(r);
        // G.
        g = this.reader.getFloat(materialSpecs[diffuseIndex], 'g');
        if (g == null)
            return "unable to parse G component of diffuse reflection for material with ID = " + materialID;
        else if (isNaN(g))
            return "diffuse 'g' is a non numeric value on the MATERIALS block";
        else if (g < 0 || g > 1)
            return "diffuse 'g' must be a value between 0 and 1 on the MATERIALS block";
        diffuseComponent.push(g);
        // B.
        b = this.reader.getFloat(materialSpecs[diffuseIndex], 'b');
        if (b == null)
            return "unable to parse B component of diffuse reflection for material with ID = " + materialID;
        else if (isNaN(b))
            return "diffuse 'b' is a non numeric value on the MATERIALS block";
        else if (b < 0 || b > 1)
            return "diffuse 'b' must be a value between 0 and 1 on the MATERIALS block";
        diffuseComponent.push(b);
        // A.
        a = this.reader.getFloat(materialSpecs[diffuseIndex], 'a');
        if (a == null)
            return "unable to parse A component of diffuse reflection for material with ID = " + materialID;
        else if (isNaN(a))
            return "diffuse 'a' is a non numeric value on the MATERIALS block";
        else if (a < 0 || a > 1)
            return "diffuse 'a' must be a value between 0 and 1 on the MATERIALS block";
        diffuseComponent.push(a);

        // Ambient component.
        var ambientIndex = nodeNames.indexOf("ambient");
        if (ambientIndex == -1)
            return "no ambient component defined for material with ID = " + materialID;
        var ambientComponent = [];
        // R.
        r = this.reader.getFloat(materialSpecs[ambientIndex], 'r');
        if (r == null)
            return "unable to parse R component of ambient reflection for material with ID = " + materialID;
        else if (isNaN(r))
            return "ambient 'r' is a non numeric value on the MATERIALS block";
        else if (r < 0 || r > 1)
            return "ambient 'r' must be a value between 0 and 1 on the MATERIALS block";
        ambientComponent.push(r);
        // G.
        g = this.reader.getFloat(materialSpecs[ambientIndex], 'g');
        if (g == null)
            return "unable to parse G component of ambient reflection for material with ID = " + materialID;
        else if (isNaN(g))
            return "ambient 'g' is a non numeric value on the MATERIALS block";
        else if (g < 0 || g > 1)
            return "ambient 'g' must be a value between 0 and 1 on the MATERIALS block";
        ambientComponent.push(g);
        // B.
        b = this.reader.getFloat(materialSpecs[ambientIndex], 'b');
        if (b == null)
            return "unable to parse B component of ambient reflection for material with ID = " + materialID;
        else if (isNaN(b))
            return "ambient 'b' is a non numeric value on the MATERIALS block";
        else if (b < 0 || b > 1)
            return "ambient 'b' must be a value between 0 and 1 on the MATERIALS block";
        ambientComponent.push(b);
        // A.
        a = this.reader.getFloat(materialSpecs[ambientIndex], 'a');
        if (a == null)
            return "unable to parse A component of ambient reflection for material with ID = " + materialID;
        else if (isNaN(a))
            return "ambient 'a' is a non numeric value on the MATERIALS block";
        else if (a < 0 || a > 1)
            return "ambient 'a' must be a value between 0 and 1 on the MATERIALS block";
        ambientComponent.push(a);

        // Emission component.
        var emissionIndex = nodeNames.indexOf("emission");
        if (emissionIndex == -1)
            return "no emission component defined for material with ID = " + materialID;
        var emissionComponent = [];
        // R.
        r = this.reader.getFloat(materialSpecs[emissionIndex], 'r');
        if (r == null)
            return "unable to parse R component of emission for material with ID = " + materialID;
        else if (isNaN(r))
            return "emisson 'r' is a non numeric value on the MATERIALS block";
        else if (r < 0 || r > 1)
            return "emisson 'r' must be a value between 0 and 1 on the MATERIALS block";
        emissionComponent.push(r);
        // G.
        g = this.reader.getFloat(materialSpecs[emissionIndex], 'g');
        if (g == null)
            return "unable to parse G component of emission for material with ID = " + materialID;
        if (isNaN(g))
            return "emisson 'g' is a non numeric value on the MATERIALS block";
        else if (g < 0 || g > 1)
            return "emisson 'g' must be a value between 0 and 1 on the MATERIALS block";
        emissionComponent.push(g);
        // B.
        b = this.reader.getFloat(materialSpecs[emissionIndex], 'b');
        if (b == null)
            return "unable to parse B component of emission for material with ID = " + materialID;
        else if (isNaN(b))
            return "emisson 'b' is a non numeric value on the MATERIALS block";
        else if (b < 0 || b > 1)
            return "emisson 'b' must be a value between 0 and 1 on the MATERIALS block";
        emissionComponent.push(b);
        // A.
        a = this.reader.getFloat(materialSpecs[emissionIndex], 'a');
        if (a == null)
            return "unable to parse A component of emission for material with ID = " + materialID;
        else if (isNaN(a))
            return "emisson 'a' is a non numeric value on the MATERIALS block";
        else if (a < 0 || a > 1)
            return "emisson 'a' must be a value between 0 and 1 on the MATERIALS block";
        emissionComponent.push(a);

        this.materials[i] = {
            "materialID": materialID,
            "shininess": shininess,
            "emission": emissionComponent,
            "ambient": ambientComponent,
            "diffuse": diffuseComponent,
            "specular": specularComponent
        };

        oneMaterialDefined = true;
    }

    if (!oneMaterialDefined)
        return "at least one material must be defined on the MATERIALS block";

    // Generates a default material.
    this.generateDefaultMaterial();
}

/**
 * Parses the <ANIMATIONS> node.
 * Each node type has a different parsing (because of different arguments).
 */
Parser.prototype.parseAnimations = function(animationsNode) {
    var children = animationsNode.children;
    // Each material.

    this.linearAnimations = [];
    this.circularAnimations = [];
    this.bezierAnimations = [];
    this.comboAnimations = [];

    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeName != "ANIMATION") {
            this.onXMLMinorError("unknown tag name <" + children[i].nodeName + ">");
            continue;
        }

        // ID parsing. All types of animations have IDs.
        var animationID = this.reader.getString(children[i], 'id');
        if (animationID == null)
            return "no ID defined for animation";

        // Type parsing. There's four different possible types.
        var animationType = this.reader.getString(children[i], 'type');
        if (animationType == null)
            return "no type defined for animation";

        for (var j = 0; j < this.linearAnimations.length; j++)
            if (this.linearAnimations[j].animationID == animationID)
                return "ID must be unique for each animation (conflict: ID = " + animationID + " similar with another linear animation ID)";
        for (var j = 0; j < this.circularAnimations.length; j++)
            if (this.circularAnimations[j].animationID == animationID)
                return "ID must be unique for each animation (conflict: ID = " + animationID + " similar with another circular animation ID)";
        for (var j = 0; j < this.bezierAnimations.length; j++)
            if (this.bezierAnimations[j].animationID == animationID)
                return "ID must be unique for each animation (conflict: ID = " + animationID + " similar with another bezier animation ID)";
        for (var j = 0; j < this.comboAnimations.length; j++)
            if (this.comboAnimations[j].animationID == animationID)
                return "ID must be unique for each animation (conflict: ID = " + animationID + " similar with another combo animation ID)";

        if (animationType == "linear") {
            var animationControlpoints = children[i].children;
            var animationSpeed = this.reader.getFloat(children[i], 'speed');
            if (animationSpeed == null)
                return "no speed defined for linear animation with ID = " + animationID;

            if (animationControlpoints.length < 2)
                return "Linear Animation with ID = " + animationID + " has " + animationControlpoints.length + " controlpoint. At least two controlpoints must be defined";

            var controlPoints = [];

            for (var j = 0; j < animationControlpoints.length; j++) {
                if (animationControlpoints[j].nodeName != "controlpoint")
                    return "Children name for Linear Animations must be \"controlpoint\" (conflict: name = " + animationControlpoints[j].nodeName + ")";

                var x = this.reader.getFloat(animationControlpoints[j], 'xx');
                if (x == null)
                    return "unable to parse 'x' component of controlpoint for animation with ID = " + animationID;
                else if (isNaN(x))
                    return "controlpoint 'x' is a non numeric value on the ANIMATIONS block";

                var y = this.reader.getFloat(animationControlpoints[j], 'yy');
                if (y == null)
                    return "unable to parse 'y' component of controlpoint for animation with ID = " + animationID;
                else if (isNaN(y))
                    return "controlpoint 'y' is a non numeric value on the ANIMATIONS block";

                var z = this.reader.getFloat(animationControlpoints[j], 'zz');
                if (z == null)
                    return "unable to parse 'z' component of controlpoint for animation with ID = " + animationID;
                else if (isNaN(z))
                    return "controlpoint 'z' is a non numeric value on the ANIMATIONS block";

                controlPoints.push([x, y, z]);
            }

            this.linearAnimations.push({
                "animationID": animationID,
                "animationSpeed": animationSpeed,
                "controlPoints": controlPoints
            });
        } else if (animationType == "circular") {
            var animationSpeed = this.reader.getFloat(children[i], 'speed');
            if (animationSpeed == null)
                return "no speed defined for circular animation with ID = " + animationID;
            else if (isNaN(animationSpeed))
                return "speed is a non numeric value on the ANIMATIONS block with ID = " + animationID;

            var animationCenterX = this.reader.getFloat(children[i], 'centerx');
            if (animationCenterX == null)
                return "no center 'x' coordinate defined for circular animation with ID = " + animationID;
            else if (isNaN(animationCenterX))
                return "center 'x' coordinate is a non numeric value on the ANIMATIONS block with ID = " + animationID;

            var animationCenterY = this.reader.getFloat(children[i], 'centery');
            if (animationCenterY == null)
                return "no center 'y' coordinate defined for circular animation with ID = " + animationID;
            else if (isNaN(animationCenterY))
                return "center 'y' coordinate is a non numeric value on the ANIMATIONS block with ID = " + animationID;

            var animationCenterZ = this.reader.getFloat(children[i], 'centerz');
            if (animationCenterZ == null)
                return "no center 'z' coordinate defined for circular animation with ID = " + animationID;
            else if (isNaN(animationCenterZ))
                return "center 'z' coordinate is a non numeric value on the ANIMATIONS block with ID = " + animationID;

            var animationRadius = this.reader.getFloat(children[i], 'radius');
            if (animationRadius == null)
                return "no radius defined for circular animation with ID = " + animationID;
            else if (isNaN(animationRadius))
                return "radius is a non numeric value on the ANIMATIONS block with ID = " + animationID;

            var animationStartang = this.reader.getFloat(children[i], 'startang');
            if (animationStartang == null)
                return "no start angle defined for circular animation with ID = " + animationID;
            else if (isNaN(animationStartang))
                return "start angle is a non numeric value on the ANIMATIONS block with ID = " + animationID;

            var animationRotang = this.reader.getFloat(children[i], 'rotang');
            if (animationRotang == null)
                return "no rotation angle defined for circular animation with ID = " + animationID;
            else if (isNaN(animationRotang))
                return "rotation angle is a non numeric value on the ANIMATIONS block with ID = " + animationID;

            this.circularAnimations.push({
                "animationID": animationID,
                "animationSpeed": animationSpeed,
                "centerX": animationCenterX,
                "centerY": animationCenterY,
                "centerZ": animationCenterZ,
                "radius": animationRadius,
                "startAngle": animationStartang,
                "rotationAngle": animationRotang
            });
        } else if (animationType == "bezier") {
            var animationControlpoints = children[i].children;
            var animationSpeed = this.reader.getFloat(children[i], 'speed');
            if (animationSpeed == null)
                return "no speed defined for bezier animation with ID = " + animationID;

            if (animationControlpoints.length != 4)
                return "Bezier Animation with ID = " + animationID + " has " + animationControlpoints.length + " controlpoints. A bezier animation needs exactly 4 controlpoints.";

            var controlPoints = [];

            for (var j = 0; j < animationControlpoints.length; j++) {
                if (animationControlpoints[j].nodeName != "controlpoint")
                    return "Children name for Bezier Animations must be 'controlpoint' (conflict: name = " + animationControlpoints[j].nodeName + ")";

                var x = this.reader.getFloat(animationControlpoints[j], 'xx');
                if (x == null)
                    return "unable to parse 'x' component of controlpoint for animation with ID = " + animationID;
                else if (isNaN(x))
                    return "controlpoint 'x' is a non numeric value on the ANIMATIONS block";

                var y = this.reader.getFloat(animationControlpoints[j], 'yy');
                if (y == null)
                    return "unable to parse 'y' component of controlpoint for animation with ID = " + animationID;
                else if (isNaN(y))
                    return "controlpoint 'y' is a non numeric value on the ANIMATIONS block";

                var z = this.reader.getFloat(animationControlpoints[j], 'zz');
                if (z == null)
                    return "unable to parse 'z' component of controlpoint for animation with ID = " + animationID;
                else if (isNaN(z))
                    return "controlpoint 'z' is a non numeric value on the ANIMATIONS block";

                controlPoints.push([x, y, z]);
            }

            this.bezierAnimations.push({
                "animationID": animationID,
                "animationSpeed": animationSpeed,
                "controlPoints": controlPoints
            });
        } else if (animationType == "combo") {
            var spanrefsNodes = children[i].children;

            var spanrefs = [];

            for (var j = 0; j < spanrefsNodes.length; j++) {
                if (spanrefsNodes[j].nodeName != "SPANREF")
                    return "Children name for Combo Animations must be 'SPANREF' (conflict: name = " + spanrefsNodes[j].nodeName + ")";

                var id = this.reader.getString(spanrefsNodes[j], 'id');
                spanrefs.push(id);
            }

            this.comboAnimations.push({
                "animationID": animationID,
                "spanrefs": spanrefs
            });
        } else
            return "the animation with ID " + animationID + " has an animation type called " + animationType + " which does not exist.";

    }

    // After reading all the nodes, check whether or not combo animations (if present) have spanrefs with non-existing IDs
    if (this.comboAnimations.length > 0) {
        for (var i = 0; i < this.comboAnimations.length; i++) {
            var spanrefs = this.comboAnimations[i].spanrefs;

            for (var j = 0; j < spanrefs.length; j++) {
                var id = this.comboAnimations[i].spanrefs[j];

                var validComboAnimation = false;

                var linearAndCircular = this.linearAnimations.concat(this.circularAnimations);
                var linearAndCircularAndBezier = linearAndCircular.concat(this.bezierAnimations);
                var allAnimations = linearAndCircularAndBezier.concat(this.comboAnimations);

                // checks if the ID exists within the bezier, linear and circular animations
                for (k = 0; k < allAnimations.length; k++) {
                    if (allAnimations[k].animationID == id) {
                        validComboAnimation = true;
                    }
                }

                if (!validComboAnimation)
                    return "Combo Animation with ID = " + this.comboAnimations[i].animationID + " has a spanref with ID " + id + " that does not exist. ";

                // check if the ID its poiting to itself
                if (id == this.comboAnimations[i].animationID)
                    return "Combo Animation with ID = " + this.comboAnimations[i].animationID + " has a spanref poiting to itself. ";

                // check if the ID does not exist within the other combo animations.
                for (k = 0; k < this.comboAnimations.length; k++) {
                    if (this.comboAnimations[k].animationID == id) {
                        return "Combo Animation with ID = " + this.comboAnimations[i].animationID + " has a spanref with ID " + id + " poiting to another Combo Animation. ";
                    }
                }
            }
        }
    }
}

/**
 * This will parse the nodes in the XML
 * @param scene the scene on which the graph is being parsed upon.
 * @param rootElement the root element of the XML.
 */
Parser.prototype.parseNodes = function(allNodes) {
    this.nodeId = 0;
    this.nodeBeingRead = 0;
    this.nodesBeingRead = [];
    this.nodes = [];
    this.selectables = {};
    this.numberOfSelectables = 1;

    if (allNodes.getElementsByTagName('ROOT').length > 1)
        return "there can only be one root node";

    var rootID = this.reader.getString(allNodes.getElementsByTagName('ROOT')[0], 'id');

    var rootNode = this.getNodeByID(rootID, allNodes);

    if (rootNode == null)
        return "failed to retrieve root node ID";

    // starts by reading the root node
    this.nodesBeingRead[this.nodeBeingRead] = rootNode;
    this.nodeBeingRead++;

    // gets the rest of the nodes, starting at the root node
    this.getNextNodes(this.nodeBeingRead - 1, allNodes);
}

/**
 * Once inside node, the parser gets all the nodes children of the node, and adds them to the structure.
 * @param scene the scene on which the graph is being parsed upon.
 * @param rootElement the root element of the XML.
 * @param allNodes is the list of all the nodes in the XML.
 * @param readId the ID being read.
 */
Parser.prototype.getNextNodes = function(readId, allNodes) {
    var name = this.reader.getString(this.nodesBeingRead[readId], 'id');
    if (name == null)
        this.onXMLError("failed to retrieve node ID");

    if (this.reader.hasAttribute(this.nodesBeingRead[readId], 'selectable'))
        if (this.reader.getBoolean(this.nodesBeingRead[readId], 'selectable')) {
            this.selectables[name] = this.numberOfSelectables;
            this.numberOfSelectables++;
        }

    // NODE - MATERIAL PARSING
    var material = this.reader.getString(this.nodesBeingRead[readId].getElementsByTagName('MATERIAL')[0], 'id');
    if (material == null)
        this.onXMLMinorError("material with node ID = " + name + " is not defined. Parsing will continue nonetheless.");
    else {
        var materialExists = 0;
        for (var i = 0; i < this.materials.length; i++)
            if (this.materials[i].materialID == material)
                materialExists = 1;

        if (material != "null" && materialExists == 0)
            this.onXMLMinorError("node with ID = " + name + " has a material with id = " + material + " which does not exist. Parsing is still possible and will continue nonetheless.");
    }

    // NODE - TEXTURE PARSING
    var texture = this.reader.getString(this.nodesBeingRead[readId].getElementsByTagName('TEXTURE')[0], 'id');
    if (texture == null)
        this.onXMLMinorError("texture with node ID = " + name + " is not defined. Parsing will continue nonetheless.");
    else {
        var textureExists = 0;
        for (var i = 0; i < this.textures.length; i++)
            if (this.textures[i].textureID == texture)
                textureExists = 1;

        if (texture != "null" && texture != "clear" && textureExists == 0)
            this.onXMLMinorError("node with ID = " + name + " has a texture with id = " + texture + " which does not exist. Parsing is still possible and will continue nonetheless.");
    }

    // NODE - DESCENDANTS PARSING
    var descendantsNode = this.nodesBeingRead[readId].getElementsByTagName('DESCENDANTS');
    if (descendantsNode.length > 1)
        this.onXMLMinorError("node with ID = " + name + " has more than one descendants node. Parsing is still possible and will continue nonetheless considering the first descendants node.");

    var noderefsToBeRead = descendantsNode[0].getElementsByTagName('NODEREF');
    var leavesToBeRead = descendantsNode[0].getElementsByTagName('LEAF');

    if (noderefsToBeRead[0] == undefined && leavesToBeRead[0] == undefined)
        this.descendantsError = "Node with id = " + name + " has no descendants. Parsing cannot go on.";

    var childNodes = this.nodesBeingRead[readId].childNodes;
    var transformations = [];

    // NODE - TRANSFORMATIONS PARSING
    // transformations can exist, on any number, mixed between them
    for (var i = 0, j = 0; j < childNodes.length; i++, j++) {
        if (childNodes[j].localName == 'TRANSLATION') {
            var x = this.reader.getFloat(childNodes[j], 'x');
            var y = this.reader.getFloat(childNodes[j], 'y');
            var z = this.reader.getFloat(childNodes[j], 'z');

            if (x == null || y == null || z == null) {
                this.onXMLMinorError("unable to parse coordinates (no x, y or z) of translation on node with ID = " + name + "; Parsing will continue nonetheless, excluding this transformation.");
                i--;
            } else if (isNaN(x) || isNaN(y) || isNaN(z)) {
                this.onXMLMinorError("non-numeric value for coordinates (x, y or z) of translation on node with ID = " + name + ". Parsing will continue nonetheless, excluding this transformation.");
                i--;
            } else {
                transformations[i] = [];
                transformations[i][0] = 'TRANSLATION';
                transformations[i][1] = x;
                transformations[i][2] = y;
                transformations[i][3] = z;
            }
        } else if (childNodes[j].localName == 'ROTATION') {
            var axis = this.reader.getString(childNodes[j], 'axis');
            var angle = this.reader.getFloat(childNodes[j], 'angle');

            if (axis == null || angle == null) {
                this.onXMLMinorError("unable to parse axis or angle of rotation on node with ID = " + name + "; Parsing will continue nonetheless, excluding this transformation.");
                i--;
            } else if (isNaN(angle)) {
                this.onXMLMinorError("non-numeric value for angle of rotation on node with ID = " + name + ". Parsing will continue nonetheless, excluding this transformation.");
                i--;
            } else if (axis != 'x' && axis != 'y' && axis != 'z') {
                this.onXMLMinorError("rotation axis in node with ID = " + name + " must be either x, y or z. Parsing will continue nonetheless, excluding this transformation.");
                i--;
            } else {
                transformations[i] = [];
                transformations[i][0] = 'ROTATION';
                transformations[i][1] = axis;
                transformations[i][2] = angle;
            }
        } else if (childNodes[j].localName == 'SCALE') {
            var sx = this.reader.getFloat(childNodes[j], 'sx');
            var sy = this.reader.getFloat(childNodes[j], 'sy');
            var sz = this.reader.getFloat(childNodes[j], 'sz');

            if (sx == null || sy == null || sz == null) {
                this.onXMLMinorError("unable to parse coordinates (no sx, sy or sz) of scale on node with ID = " + name + "; Parsing will continue nonetheless, excluding this transformation.");
                i--;
            } else if (isNaN(sx) || isNaN(sy) || isNaN(sz)) {
                this.onXMLMinorError("non-numeric value for coordinates (sx, sy or sz) of scale on node with ID = " + name + ". Parsing will continue nonetheless, excluding this transformation.");
                i--;
            } else {
                transformations[i] = [];
                transformations[i][0] = 'SCALE';
                transformations[i][1] = sx;
                transformations[i][2] = sy;
                transformations[i][3] = sz;
            }
        } else
            i--;
    }

    // NODE - ANIMATIONS PARSING
    var animations = [];

    var allAnimationrefs = this.nodesBeingRead[readId].getElementsByTagName('ANIMATIONREFS');

    if (allAnimationrefs.length > 1) // if more than one ANIMATIONREFS exists, parses the first one only (without crashing)
        this.onXMLMinorError("node with ID = " + name + " has more than one animationrefs node. Parsing is still possible and will continue nonetheless considering the first animationrefs node.");
    else if (allAnimationrefs.length > 0) {
        var animationrefsNode = allAnimationrefs[0];
        var allAnimationref = animationrefsNode.getElementsByTagName('ANIMATIONREF');

        // if there is no ANIMATIONREF inside the ANIMATIONREFS node, continue parsing, but consider no animations for this node (without crashing)
        if (allAnimationref.length == 0)
            this.onXMLMinorError("node with ID = " + name + " has animationrefs node without animations. Parsing is still possible and will continue nonetheless, without animations for this node.");

        // checks whether or not the reference to the animation is a valid one, e.g if the animation indeed exists.
        for (var i = 0; i < allAnimationref.length; i++) {
            var animationID = this.reader.getString(allAnimationref[i], 'id');

            var animationExists = 0;

            for (var j = 0; j < this.linearAnimations.length; j++)
                if (this.linearAnimations[j].animationID == animationID)
                    animationExists = 1;

            for (var j = 0; j < this.circularAnimations.length; j++)
                if (this.circularAnimations[j].animationID == animationID)
                    animationExists = 1;

            for (var j = 0; j < this.bezierAnimations.length; j++)
                if (this.bezierAnimations[j].animationID == animationID)
                    animationExists = 1;

            for (var j = 0; j < this.comboAnimations.length; j++)
                if (this.comboAnimations[j].animationID == animationID)
                    animationExists = 1;		

            // if no animation is found, a warning is issued, but the parsing continue without crashing
            if (animationExists == 0)
                this.onXMLMinorError("node with ID = " + name + " has an animation with id = " + animationID + " which does not exist. Parsing is still possible, but will exclude this animation.");
            else
                animations.push(animationID);
        }
    }

    var nextNoderefs = [];
    var nextLeaves = [];

    // read all the noderef children (<NODEREF> nodes)
    for (var i = 0; i < noderefsToBeRead.length; i++) {
        var nodeId = -1;
        nodeId = this.getIndexOfParsedNode(noderefsToBeRead[i]);

        // prevents cycling behavior within the children nodes of a node
        if (this.reader.getString(noderefsToBeRead[i], 'id') == name)
            this.cyclicError = "Node with id = " + name + " has a cyclic behavior. Parsing cannot go on.";
        else {
            if (nodeId != -1) {
                nextNoderefs[i] = nodeId;
            } else {
                var childNode = this.getNodeByID(this.reader.getString(noderefsToBeRead[i], 'id'), allNodes);

                this.nodesBeingRead[this.nodeBeingRead] = childNode;
                this.nodeBeingRead++;

                this.getNextNodes(this.nodeBeingRead - 1, allNodes);

                nextNoderefs[i] = this.nodeId;

                this.nodeId++;;
            }
        }
    }

    // read all the leaves children (<LEAF> nodes)
    for (var i = 0; i < leavesToBeRead.length; i++) {
        var type = this.reader.getString(leavesToBeRead[i], 'type');

        // patch is a different case, because its arguments must be read in another level
        if (type == "patch") {
            var args = [];

            var cutArgs = this.reader.getString(leavesToBeRead[i], 'args').split(" ");
            if (cutArgs.length > 2)
                this.onXMLMinorError("patch with more than two arguments. Parsing will continue nonetheless, but only the first two elements will be counted.");
            else if (cutArgs.length < 2)
                this.onXMLMinorError("patch with less than two arguments. Parsing will continue nonetheless, but this patch will be discarded from the scene.");

            args.push(cutArgs[0]);
            args.push(cutArgs[1]);

            var controlPoints = [];

            // first parse the cplines
            allcplines = leavesToBeRead[i].getElementsByTagName('CPLINE');

            if (allcplines.length < 2)
                this.onXMLMinorError("node with id = " + name + ": at least two CPLINE tags must be declared. Parsing will continue nonetheless, but this patch will be discarded from the scene.");
            else {
                for (var j = 0; j < allcplines.length; j++) {
                    allcpoints = allcplines[j].getElementsByTagName('CPOINT');

                    // then parse each cpoint inside each cpline
                    if (allcpoints.length < 2)
                        this.onXMLMinorError("node with id = " + name + ": at least two CPOINT tags must be declared inside each CPLINE. Parsing will continue nonetheless, but this patch will be discarded from the scene.");
                    else {
                        tmpControlPoints = [];

                        for (var k = 0; k < allcpoints.length; k++) {
                            var x = this.reader.getString(allcpoints[k], 'xx');
                            var y = this.reader.getString(allcpoints[k], 'yy');
                            var z = this.reader.getString(allcpoints[k], 'zz');
                            var w = this.reader.getString(allcpoints[k], 'ww');

                            if (x == null || y == null || z == null || w == null) {
                                this.onXMLMinorError("node with id = " + name + ": one cpoint with no value in x, y, z or w.");
                            } else if (isNaN(x) || isNaN(y) || isNaN(z) || isNaN(w)) {
                                this.onXMLMinorError("node with id = " + name + ": one cpoint with non-numeric values in w, y, z or w.");
                            } else {
                                tmpControlPoints[tmpControlPoints.length] = [parseFloat(x), parseFloat(y), parseFloat(z), parseFloat(w)];
                            }
                        }

                        controlPoints[controlPoints.length] = tmpControlPoints;
                    }
                }

                args.push(controlPoints);

                nextLeaves[nextLeaves.length] = {
                    "type": type,
                    "args": args
                };
            }

        } else {
            var originalArgs = this.reader.getString(leavesToBeRead[i], 'args');
            var correctArgs = originalArgs.match(/[^ ]+/g);

            for (var j = 0; j < correctArgs.length; j++) {
                correctArgs[j] = parseFloat(correctArgs[j]);
            }

            if (type == "rectangle" && correctArgs.length != 4)
                this.onXMLMinorError("node with id = " + name + ": rectangle with number of arguments different of 4. Parsing will continue nonetheless, but this rectangle may not appear as intended or may not appear at all.");
            else if (type == "triangle" && correctArgs.length != 9)
                this.onXMLMinorError("node with id = " + name + ": triangle with number of arguments different of 9. Parsing will continue nonetheless, but this triangle may not appear as intended or may not appear at all.");
            else if (type == "sphere" && correctArgs.length != 3)
                this.onXMLMinorError("node with id = " + name + ": sphere with number of arguments different of 3. Parsing will continue nonetheless, but this sphere may not appear as intended or may not appear at all.");
            else if (type == "cylinder" && correctArgs.length != 7)
                this.onXMLMinorError("node with id = " + name + ": cylinder with number of arguments different of 7. Parsing will continue nonetheless, but this cylinder may not appear as intended or may not appear at all.");

            nextLeaves[nextLeaves.length] = {
                "type": type,
                "args": correctArgs
            };
        }
    }

    this.nodes[this.nodeId] = {
        "id": this.nodeId,
        "name": name,
        "nextNoderefs": nextNoderefs,
        "nextLeaves": nextLeaves,
        "material": material,
        "texture": texture,
        "transformations": transformations,
        "animations": animations
    };
}

/**
 * Checks if node was already read by the parser and if so, returns the index in the array of nodes of said node
 * @param name the name of the node that one wants to find
 * @param scene is the scene where the graph is being parsed upon.
 * @param allNodes is the list of all the nodes in the XML
 * @returns the index in the nodes array of the node if it exists, -1 otherwise
 */
Parser.prototype.getNodeByID = function(name, allNodes) {
    var nodes = allNodes.getElementsByTagName('NODE');
    var nodeN = nodes.length;

    for (var i = 0; i < nodeN; i++) {
        if (this.reader.getString(nodes[i], 'id') == name) {
            return nodes[i];
        } else if (i == nodeN - 1)
            return null;
    }
}

/**
 * Checks if node was already read by the parser and if so, returns the index in the array of nodes of said node
 * @param noderef is the noderef id being read.
 * @param scene is the scene where the graph is being parsed upon.
 * @returns the index in the nodes array of the node if it exists, -1 otherwise
 */
Parser.prototype.getIndexOfParsedNode = function(noderef) {
    for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].name == this.reader.getString(noderef, 'id'))
            return i;
    }
    return -1;
}

/**
 * Everytime the XML Loading goes wrong, this function displays the message and the parsing does not finish.
 */
Parser.prototype.onXMLError = function(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
};

/**
 * Callback to be executed on any minor error, showing a warning on the console.
 */
Parser.prototype.onXMLMinorError = function(message) {
    console.warn("Warning: " + message);
}

/**
 * Alternative function for a regular message in the console.
 */
Parser.prototype.log = function(message) {
    console.log("   " + message);
}

/**
 * Generates a default material, with a random name. This material will be passed onto the root node, which
 * may override it.
 */
Parser.prototype.generateDefaultMaterial = function() {
    var materialDefault = new CGFappearance(this.scene);
    materialDefault.setShininess(1);
    materialDefault.setSpecular(0, 0, 0, 1);
    materialDefault.setDiffuse(0.5, 0.5, 0.5, 1);
    materialDefault.setAmbient(0, 0, 0, 1);
    materialDefault.setEmission(0, 0, 0, 1);

    // Generates random material ID not currently in use.
    this.defaultMaterialID = null;
    do this.defaultMaterialID = Parser.generateRandomString(5);
    while (this.materials[this.defaultMaterialID] != null);

    this.materials[this.defaultMaterialID] = materialDefault;
}

/**
 * Generates a random string of the specified length.
 * @param length the lenght necessary to generate the random string.
 */
Parser.generateRandomString = function(length) {
    // Generates an array of random integer ASCII codes of the specified length
    // and returns a string of the specified length.
    var numbers = [];
    for (var i = 0; i < length; i++)
        numbers.push(Math.floor(Math.random() * 256)); // Random ASCII code.

    return String.fromCharCode.apply(null, numbers);
}

/**
 * Displays the scene, processing each node, starting in the root node.
 */
Parser.prototype.displayScene = function(time) {
    this.scene.rootComponent.display(-1, -1, time, -1);
}