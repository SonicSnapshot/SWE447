var thisCone = null;
var gl = null;

var canvas = undefined;
//var P = undefined;  // matrix storing the projection transformation
var near = 1.0;     // near clipping plane's distance
var far = 10.0;     // far clipping plane's distance

// Viewing transformation parameters
var V = undefined;
var M = undefined;
var angle = 0.0;
var dAngle = 0.0; //Math.PI / 10.0;
var S = undefined;
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var zvalue = -0.5*(near + far);
var offset = [ 0.0,  0.0, 0.0 ];
var rotationAxis = undefined;
var xAxis = [1, 0, 0];
var yAxis = [0, 1, 0];
var speed = 1;
var stoprotating = 0;

function init() {
    var canvas = document.getElementById( "webgl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );

    if ( !gl ) {
        alert("Unable to setup WebGL");
        return;
    }
    
    document.getElementById("cBox").onclick = function() {
        if(document.getElementById("cBox").checked == true) {
            dAngle = 0.0;
            stoprotating = 1;
        } else {
            dAngle = 0.0;
            stoproatating = 0;
        }
    }
    
    document.getElementById("slider").onchange = function(event){
        speed = event.target.value / 10;
    };
    
    document.getElementById("xButton").onclick = function() {
        rotationAxis = xAxis;
    }
    
    document.getElementById("yButton").onclick = function() {
        rotationAxis = yAxis;
    }
    
    canvas.onmousedown = function handleMouseDown(event) {
        console.log("mouseDown")
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }

    document.onmouseup = function handleMouseUp(event) {
        console.log("mouseUp")
        mouseDown = false;
        if (stoprotating) dAngle = 0.0;
        return;

    }

    document.onmousemove = function handleMouseMove(event) {
    if (!mouseDown) {
      if(stoprotating) dAngle = 0.0;
      return;
    }
        
    console.log("moving")
    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    var deltaY = newY - lastMouseY;
    dAngle = degToRad(deltaX + deltaY) * Math.PI * 5;
    lastMouseX = newX;
    lastMouseY = newY;
    }
    
    document.onkeydown = function handleKeyDown(event) {
        mkey = event.which || event.keyCode;
        switch(mkey) {
            //Page Up
            case 33 : zvalue -= 0.05; break;
            //Page Down
            case 34 : zvalue += 0.05; break;
            // left cursor key
            case 37 : offset = [-3.0, 0.0, 0.0]; break;
            // right cursor key
            case 38 : offset = [0.0, 3.0, 0.0]; break;
            // up cursor key
            case 39 : offset = [0.0, -3.0, 0.0]; break;
            // down cursor key
            case 40 : offset = [0.0, 0.0, 0.0]; break;
        }
    }

    gl.clearColor( 1.0, 1.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST)
    thisCone = new Cone(gl,90);
    resize();
    window.requestAnimationFrame(render);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    V = translate(0.0, 0.0, zvalue);
    angle += dAngle ;
    //offset = [ -3.0,  3.0, 0.0 ];
    var axis = undefined; //[ 1.0, 1.0, 1.0 ];
    if (rotationAxis != undefined) axis = rotationAxis;
    else axis = [ 1.0, 1.0, 1.0 ];
  
    ms = new MatrixStack();
    ms.push();
    ms.load(V);
    ms.translate(offset);
    ms.rotate((speed * angle), axis);
    ms.scale(1.0, 1.0, 1.0);
    thisCone.MV = ms.current();
    ms.pop();

    thisCone.render();
    window.requestAnimationFrame(render);
}

function resize() {
    var width = canvas.clientWidth,
    height = canvas.clientHeight;
    gl.veiwport(0,0,width,height);
    var fovy = 120;
    aspect = widht/height;
    cone.P = perpspective(fovy,apsect,near,far);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

window.onload = init;
window.onresize = resize;
