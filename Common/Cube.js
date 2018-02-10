
function Cube( vertexShaderId, fragmentShaderId ) {

    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    var vertShdr = vertexShaderId || "Cube-vertex-shader";
    var fragShdr = fragmentShaderId || "Cube-fragment-shader";

    this.program = initShaders(gl, vertShdr, fragShdr);

    if ( this.program < 0 ) {
        alert( "Error: Cube shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n" );
        return; 
    }

    this.positions = { 
        values : new Float32Array([
           // Front
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
            
            // Back
            -0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,
            
            // Top
            -0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,
            
            // Bottom
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,
            
            // Right
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,
            
            // Left
            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5
            ]),
        numComponents : 3
    };
    
    this.indices = { 
        values : new Uint16Array([
            // Add your list of triangle indices here
        ])
    };
    this.indices.count = this.indices.values.length;
    
    this.colors = {
        values : new Float32Array([
            //Front
            0.1, 0.2, 0.3,
            0.4, 0.5, 0.6,
            0.7, 0.8, 0.9,
            //Back
            0.1, 0.2, 0.3,
            0.4, 0.5, 0.8,
            0.6, 0.8, 0.3,
            //Top
            0.7, 0.2, 0.3,
            0.4, 0.6, 0.6,
            0.8, 0.8, 0.1,
            //Bottom
            0.1, 0.2, 0.5,
            0.4, 0.2, 0.6,
            0.6, 0.8, 0.4,
            //Right
            0.1, 0.1, 0.6,
            0.2, 0.5, 0.6,
            0.7, 0.9, 0.9,
            //Left
            0.4, 0.2, 0.3,
            0.4, 0.2, 0.7,
            0.4, 0.8, 0.3
        ]),
        numComponents : 3
    };
    
    this.indicies = {
        values : new  Uint16Array([
            0, 2, 1, 0, 3, 2,       //Front
            4, 6, 5, 4, 7, 6,       //Back
            8, 10, 9, 8, 11, 10,    //Top
            12, 14, 13, 12, 15, 14, //Bottom
            16, 18, 27, 16, 19, 18, //Right
            20, 22, 21, 20, 23, 22  //Left
            ])
    };
    this.indices.count = this.indicies.length;

    
    this.positions.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, this.positions.values, gl.STATIC_DRAW );
    
    this.colors.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colors.buffer );
    gl.bufferData(gl.ARRAY_BUFFER, this.colors.values, gl.STATIC_DRAW);

    this.indices.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, this.indices.values, gl.STATIC_DRAW );

    this.positions.attributeLoc = gl.getAttribLocation( this.program, "vPosition" );
    gl.enableVertexAttribArray( this.positions.attributeLoc );
    
    this.colors.attributeLoc = gl.getAttribLocation( this.program, "vColor" );
    gl.enableVertexAttribArray( this.colors.attributeLoc);

    MVLoc = gl.getUniformLocation( this.program, "MV" );

    this.MV = undefined;

    this.render = function () {
        gl.useProgram( this.program );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
        gl.vertexAttribPointer( this.positions.attributeLoc, this.positions.numComponents,
            gl.FLOAT, gl.FALSE, 0, 0 );
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colors.buffer );
        gl.vertexAttribPointer( this.colors.attributeLoc, this.colors.numComponents, gl.FLOAT, gl.FALSE, 0.0 );
 
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );

        gl.uniformMatrix4fv( MVLoc, gl.FALSE, flatten(this.MV) );

        // Draw the cube's base
        gl.drawElements( gl.TRIANGLES, this.indices.count, gl.UNSIGNED_SHORT, 0 );
    }
};
