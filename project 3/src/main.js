//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

serialInclude(['../lib/CGF.js', 'interface/Interface.js', 'game/Game.js', 'Primitives/Cylinder.js', 'Primitives/CylinderSide.js', 'Primitives/CylinderTop.js', 'Primitives/Sphere.js', 
			'Objs/Obj.js', 'Objs/ObjObject.js', 'animation/Animation.js', 'animation/LinearAnimation.js', 'game/Cell.js', 'game/Board.js', 'interface/Communication.js', 'Primitives/Rectangle.js',
			'primitives/BoardPrimitive.js', 'animation/CircularAnimation.js', 'animation/RemovedAnimation.js', 'Primitives/Room.js', 'Primitives/Casino.js',
			'game/Play.js', 'game/MoviePlay.js', 'Primitives/Timer.js', 'Primitives/Triangle.js', 'Primitives/Beach.js',
				

main=function()
{
    var app = new CGFapplication(document.body);
    var myInterface = new Interface();
	var hecatomb = new Game(myInterface);

	app.init();

    app.setScene(hecatomb);
    app.setInterface(myInterface);

	//myInterface.setActiveCamera(hecatomb.camera);
	myInterface.addGameOptions();
	myInterface.addVisualOptions();

	app.run();
}

]);