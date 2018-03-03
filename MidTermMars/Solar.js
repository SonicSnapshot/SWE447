/////////////////////////////////////////////////////////////////////////////
//
//  Solar.js
//
/////////////////////////////////////////////////////////////////////////////

var canvas;
var gl;

//---------------------------------------------------------------------------
//
//  Declare our array of planets (each of which is a sphere)

var Planets = {
	Mars : undefined
};

// Viewing transformation parameters
var V;  // matrix storing the viewing transformation

// Projection transformation parameters
var P;  // matrix storing the projection transformation
var near = 10;      // near clipping plane's distance
var far = 160;      // far clipping plane's distance

// Animation variables
var time = 0.0;      // time, our global time constant, which is 
                     // incremented every frame
var timeDelta = 0.5; // the amount that time is updated each fraime

//var distanceScalar = 12.0;
var orbitScalar = 50.0;

var orbitShift = 6000;	//An additional shift applied to each planets rotation at the start

var sunPos = new Float32Array([0.0, 0.0, 0.0]);
var ambient = new Float32Array([0.3, 0.3, 0.3]);

//---------------------------------------------------------------------------
//
//  init() - scene initialization function
//

function init() {
	canvas = document.getElementById("webgl-canvas");

	// Configure our WebGL environment
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL initialization failed"); }

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);


	for (var name in Planets ) {



		var planet = Planets[name] = new Sphere();


		planet.uniforms = { 
			color : gl.getUniformLocation(planet.program, "color"),
			MV : gl.getUniformLocation(planet.program, "MV"),
			P : gl.getUniformLocation(planet.program, "P"),			
		};
	}

	resize();

	window.requestAnimationFrame(render);  
}

//---------------------------------------------------------------------------
//
//  render() - render the scene
//

function render() {		

	time = performance.now() * 0.001 + orbitShift;

	var ms = new MatrixStack();

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Specify the viewing transformation, and use it to initialize the 
	// matrix stack

	//V = translate(0.0, 0.0, -0.5*(near + far));
	V = translate(0.0, 0.0, 0.0);
	ms.load(V);


	var name, planet, data;

	

	renderPlanet("Mars", ms);
	
	
		
	window.requestAnimationFrame(render);
}


//  resize() - handle resize events

function renderPlanet(planetName, ms){
	var name = planetName;
	var planet = Planets[name];
	var data = SolarSystem[name];
	
	planet.PointMode = false;
	
	ms.push();
	ms.rotate(time * orbitScalar / data.year, [0.0, 1.0, 0.0]);
	ms.translate(data.distance, 0, 0);
	ms.scale(data.radius);
	gl.useProgram(planet.program);
	gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
	gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
	gl.uniform4fv(planet.uniforms.color, flatten(data.color));
	gl.uniform3fv(planet.uniforms.lightPos, flatten(sunPos));
	gl.uniform3fv(planet.uniforms.ambientLight, flatten(ambient));
	planet.render();
	ms.pop();
}

function resize() {
	var w = canvas.clientWidth;
	var h = canvas.clientHeight;

	gl.viewport(0, 0, w, h);

	var fovy = 60; // degrees
	var aspect = w / h;

	P = perspective(fovy, aspect, near, far);
	
	//Add in a view angle for better viewing
	//P = mult(P, lookAt([0, 0.5*(near + far), 0], [0, 0, -0.5*(near + far)], [0, 1, 0]));
	P = mult(P, lookAt([0.0, 0.3*(near + far), 0.3*(near + far)], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]));
}

//  Window callbacks for processing various events

window.onload = init;
window.onresize = resize;
