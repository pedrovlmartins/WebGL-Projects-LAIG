/**
 * Class Patch
 * 
 * Creates and draws a patch object following a NURBS design.
 * Constructor accepts the divisions along u and v, as well as all the controlpoints.
 * Based on the example "Demonstração de superfícies 3D geradas com NURBS Ficheiro".
 * @author Pedro Martins / Caroliza Azevedo
 * @version 1.0
 * @param scene
 * @param uDivs divisions across U
 * @param vDivs divisions across V
 * @param controlPoints an array of arrays that include all the controlpoints
 */
function Patch(scene, uDivs, vDivs, controlPoints) {
    var orderU = controlPoints.length - 1; // number of cplines
    var orderV = controlPoints[0].length - 1; // number of cpoints inside each cpline. The number is equal in each patch.

    var knots1 = getKnots(orderU);
    var knots2 = getKnots(orderV);

    var nurbsSurface = new CGFnurbsSurface(orderU, orderV, knots1, knots2, controlPoints);

    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

	// parseFloat converts a string to a float.
    var obj = new CGFnurbsObject(scene, getSurfacePoint, parseFloat(uDivs), parseFloat(vDivs));

    this.surface = obj;
}

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;

/**
 * Displays the surface in the scene.
 */
Patch.prototype.display = function() {
    this.surface.display();
}

/**
 * This function gets the knots based on the degree of the surface.
 * The degree is obtained by analyzing the controlPoints array that's passed onto the constructor.
 * For degrees between 1 and 3, the function will return:
 * [0, 0, 1, 1] if degree = 1;
 * [0, 0, 0, 1, 1, 1] if degree = 2;
 * [0, 0, 0, 0, 1, 1, 1, 1] if degree = 3;
 */
function getKnots(degree) {
    var v = new Array();
	
    for (var i = 0; i <= degree; i++) {
        v.push(0);
    }
    for (var i = 0; i <= degree; i++) {
        v.push(1);
    }
	
    return v;
}

/**
 * Amplify the texture of the primitive given its values.
 * Not required. Exists only to avoid inheritance error.
 * @param lenghtS the length along S 
 * @param lenghtT the length along T
 */
Patch.prototype.setSandT = function(lenghtS, lenghtT) {
}