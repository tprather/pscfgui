// Based originally on three.js ScatterPlot3D
function DensityPlot3D(userConfig)
{
  var chart = new DexComponent(userConfig,
  {
    // The parent container of this chart.
    'parent'           : null,
    // Set these when you need to CSS style components independently.
    'id'               : 'DensityPlot3D',
    'class'            : 'DensityPlot3D',
    // Our data...
    'csv'              :
    {
    	// Give folks without data something to look at anyhow.
    	'header'         : [ "X", "Y", "Z" ],
    	'data'           : [[0,0,0],[1,1,1],[2,4,8],[3,9,27]]
    },
    'width'            : 400,
    'height'           : 400,
    'xoffset'          : 20,
    'yoffset'          : 0
  });

  this.chart = this;

  chart.render = function() {
    this.update();
  };

  chart.update = function () {
    var chart  = this;
    var config = chart.config;
    var csv    = config.csv;

    var i, j;

    function mousewheel ( event ) {
      var fovMAX = 160;
      var fovMIN = 1;
      camera.fov -= event.wheelDeltaY*0.05;
      camera.fov = Math.max(Math.min(camera.fov,fovMAX),fovMIN);
      camera.projectionMatrix = new THREE.Matrix4().makePerspective(camera.fov,config.width/config.height,camera.near,camera.far);
      refresh();
    }

    function createTextCanvas ( text, color, font, size ) {
      size          = size||24;
      var canvas    = document.createElement('canvas');
      var ctx       = canvas.getContext('2d');
      ctx.font      = (size+'px ')+(font||'Arial');
      canvas.width  = ctx.measureText(text).width;
      canvas.height = Math.ceil(size);
      ctx.fillStyle = color||'black';
      ctx.fillText(text,0,Math.ceil(size*0.8));
      return canvas;
    }

    function createText2D ( text, color, font, size, segW, segH ) {
      var canvas       = createTextCanvas(text,color,font,size);
      var plane        = new THREE.PlaneGeometry(canvas.width,canvas.height,segW,segH);
      var tex          = new THREE.Texture(canvas);
      tex.needsUpdate  = true;
      var planeMat     = new THREE.MeshBasicMaterial({
        map         : tex,
        color       : 0xffffff,
        transparent : true,
        side        : THREE.DoubleSide
      });
      var mesh         = new THREE.Mesh(plane,planeMat);
      return mesh;
    }

    var renderer = new THREE.WebGLRenderer({
      antialias : true
    });
    var w = config.width;
    var h = config.height;
    renderer.setSize(w,h);
    
    this.renderer = renderer;

    config.parent.appendChild(renderer.domElement);

//  renderer.setClearColor(0xEEEEEE,1.0);
//  renderer.setClearColor(0xFFFDF6,1.0);
    renderer.setClearColor(0xFFFFFF,1.0);

    // Set up some handy local variables describing the data range.
    var x0   = dex.matrix.min(csv.data,0);
    var x1   = dex.matrix.max(csv.data,0);
    var y0   = dex.matrix.min(csv.data,1);
    var y1   = dex.matrix.max(csv.data,1);
    var z0   = dex.matrix.min(csv.data,2);
    var z1   = dex.matrix.max(csv.data,2);
    var v0   = dex.matrix.min(csv.data,3);
    var v1   = dex.matrix.max(csv.data,3);
    var xRng = x1-x0;
    var yRng = y1-y0;
    var zRng = z1-z0;
    var vRng = v1-v0;
    var xMid = x0+0.5*xRng;
    var yMid = y0+0.5*yRng;
    var zMid = z0+0.5*zRng;
    var vMid = v0+0.5*vRng;

    // Cube the density values for nicer separation between bands when plotting.
    function den ( v ) { return (v-v0)*(v-v0)*(v-v0); }
    var d0   = den(v0);
    var d1   = den(v1);
    var dRng = d1-d0;
    var dMid = d0+0.5*dRng;
    
    // Create a "three.js" 'Object3D' to hold the scatter plot.
    var scatterPlot = new THREE.Object3D();

    scatterPlot.rotation.y = -0.2; //Math.PI-0.2; // radians

    function v ( x, y, z ) { return new THREE.Vector3(x,y,z); }

    // Create 3 axis (x,y,z) and a black wire-frame box bounding the plot area.
    var xAxisGeo    = new THREE.Geometry();
    var yAxisGeo    = new THREE.Geometry();
    var zAxisGeo    = new THREE.Geometry();
    var boundaryGeo = new THREE.Geometry();

    xAxisGeo.vertices.push(v(x0, 0, 0),  v(x1, 0, 0));
    yAxisGeo.vertices.push(v( 0,y0, 0),  v( 0,y1, 0));
    zAxisGeo.vertices.push(v( 0, 0,z0),  v( 0, 0,z1));
    boundaryGeo.vertices.push(
      v(x0,y1,z0),  v(x1,y1,z0),
      v(x0,y0,z0),  v(x1,y0,z0),
      v(x0,y1,z1),  v(x1,y1,z1),
      v(x0,y0,z1),  v(x1,y0,z1),
      
      v(x0, 0,z1),  v(x1, 0,z1),
      v(x0, 0,z0),  v(x1, 0,z0),
      v(x0,y1, 0),  v(x1,y1, 0),
      v(x0,y0, 0),  v(x1,y0, 0),

      v(x1,y0,z0),  v(x1,y1,z0),
      v(x0,y0,z0),  v(x0,y1,z0),
      v(x1,y0,z1),  v(x1,y1,z1),
      v(x0,y0,z1),  v(x0,y1,z1),

      v( 0,y0,z1),  v( 0,y1,z1),
      v( 0,y0,z0),  v( 0,y1,z0),
      v(x1,y0, 0),  v(x1,y1, 0),
      v(x0,y0, 0),  v(x0,y1, 0),

      v(x1,y1,z0),  v(x1,y1,z1),
      v(x1,y0,z0),  v(x1,y0,z1),
      v(x0,y1,z0),  v(x0,y1,z1),
      v(x0,y0,z0),  v(x0,y0,z1),

      v(x0, 0,z0),  v(x0, 0,z1),
      v(x1, 0,z0),  v(x1, 0,z1),
      v( 0,y1,z0),  v( 0,y1,z1),
      v( 0,y0,z0),  v( 0,y0,z1)
    );

    var xAxisMat      = new THREE.LineBasicMaterial({ color : 0xff0000, lineWidth : 1 });
    var xAxis         = new THREE.Line(xAxisGeo,xAxisMat);
    xAxis.type        = THREE.Lines;
    scatterPlot.add(xAxis);

    var yAxisMat      = new THREE.LineBasicMaterial({ color : 0x0000ff, lineWidth : 1 });
    var yAxis         = new THREE.Line(yAxisGeo,yAxisMat);
    yAxis.type        = THREE.Lines;
    scatterPlot.add(yAxis);

    var zAxisMat      = new THREE.LineBasicMaterial({ color : 0x00ff00, lineWidth : 1 });
    var zAxis         = new THREE.Line(zAxisGeo,zAxisMat);
    zAxis.type        = THREE.Lines;
    scatterPlot.add(zAxis);

    var boundaryMat   = new THREE.LineBasicMaterial({ color : 0x090909, lineWidth : 1, transparent : true });
    var boundary      = new THREE.Line(boundaryGeo,boundaryMat);
    boundary.type     = THREE.Lines;
    scatterPlot.add(boundary);

    // Add titles to the 3 axis.
    var fontSize      = 24;
    var fontScale     = new THREE.Vector3(xRng/100,yRng/100,zRng/100);
    var fontOffset    = new THREE.Vector3(xRng/20 ,yRng/20 ,zRng/20 );

    var titleX        = createText2D(csv.header[0]+"0",'#FF0000','',fontSize);
    titleX.position   = new THREE.Vector3(-1.3*xRng/2,fontOffset.y,0.0);
    titleX.scale      = fontScale;
    scatterPlot.add(titleX);

    var titleX        = createText2D(csv.header[0]+"1",'#FF0000','',fontSize);
    titleX.position   = new THREE.Vector3(+1.3*xRng/2,fontOffset.y,0.0);
    titleX.scale      = fontScale;
    scatterPlot.add(titleX);

    var titleY        = createText2D(csv.header[1]+"0",'#0000FF','',fontSize);
    titleY.position   = new THREE.Vector3(fontOffset.x,-1.3*yRng/2,0.0);
    titleY.scale      = fontScale;
    scatterPlot.add(titleY);

    var titleY        = createText2D(csv.header[1]+"1",'#0000FF','',fontSize);
    titleY.position   = new THREE.Vector3(fontOffset.x,+1.3*yRng/2,0.0);
    titleY.scale      = fontScale;
    scatterPlot.add(titleY);

    var titleZ        = createText2D(csv.header[2]+"0",'#00FF00','',fontSize);
    titleZ.position   = new THREE.Vector3(0.0,fontOffset.y,-1.3*zRng/2);
    titleZ.scale      = fontScale;
    scatterPlot.add(titleZ);

    var titleZ        = createText2D(csv.header[2]+"1",'#00FF00','',fontSize);
    titleZ.position   = new THREE.Vector3(0.0,fontOffset.y,+1.3*zRng/2);
    titleZ.scale      = fontScale;
    scatterPlot.add(titleZ);

//  var colors    = ['#CCCCCC','#008C47','#0185A9','#F37D22','#663C91','#A11D20','#B33893']; // Mixed palette.
//  var colors    = ['#FFFFFF','#FEFEFE','#FFE5D9','#FCAF92','#FA6948','#DE2C26','#A60F14']; // Red/maroon palette.
    var colors    = ['#FFFFFF','#C1E1D6','#B0D8CC','#99CCBC','#7FBCA7','#5DA593','#358270']; // Teal/gree  palette.
    var valueBins = [
      { color: new THREE.Color(colors[0]), alpha: 0.00, psize: 1.0 },
      { color: new THREE.Color(colors[1]), alpha: 0.05, psize: 1.0 },
      { color: new THREE.Color(colors[2]), alpha: 0.10, psize: 1.0 },
      { color: new THREE.Color(colors[3]), alpha: 0.10, psize: 2.0 },
      { color: new THREE.Color(colors[4]), alpha: 0.20, psize: 2.0 },
      { color: new THREE.Color(colors[5]), alpha: 0.20, psize: 3.0 },
      { color: new THREE.Color(colors[6]), alpha: 0.30, psize: 4.0 }
    ];

    attributes    = {
      color   : { type: 'c', value: [] },
      alpha   : { type: 'f', value: [] },
      psize   : { type: 'f', value: [] }
    };

    var mat           = new THREE.ShaderMaterial({
      depthTest      : false,
      transparent    : true,
      blending       : THREE.CustomBlending,
      blendSrc       : THREE.SrcAlphaFactor,
      blendDst       : THREE.OneMinusSrcAlphaFactor,
      blendEquation  : THREE.AddEquation,
      attributes     : attributes,
      vertexShader   : [
         "attribute vec3      color;",
         "attribute float     alpha;",
         "attribute float     psize;",
         "varying   vec3      vColor;",
         "varying   float     vAlpha;",
         "void main() {",
         "  vColor       = color;",
         "  vAlpha       = alpha;",
         "  gl_PointSize = psize;",
         "  gl_Position  = projectionMatrix * modelViewMatrix * vec4(position,1.0);",
         "}"
      ].join("\n"),
      fragmentShader : [
         "varying   vec3      vColor;",
         "varying   float     vAlpha;",
         "void main() {",
         "  float x = 0.5-gl_PointCoord.x;",
         "  float y = 0.5-gl_PointCoord.y;",
         "  if (x*x + y*y > 0.25) {",
         "    discard;",
         "  }",
         "  gl_FragColor = vec4(vColor,vAlpha);",
         "}"
      ].join("\n")
    });
    var pointGeo      = new THREE.Geometry();
    {
        try {
            if (dRng == 0) {
                dRng = 1.;
                console.log("WARNING! dRng = 0, switching to 1");
            }
            for (i = 0; i<csv.data.length; i++) {
                var x = csv.data[i][0];
                var y = csv.data[i][1];
                var z = csv.data[i][2];
                var v = csv.data[i][3];
                var d = den(v);
                var c = Math.min(Math.floor(valueBins.length*(d-d0)/dRng),valueBins.length-1);
                pointGeo.vertices     .push(new THREE.Vector3(x,y,z));
                attributes.color.value.push(valueBins[c].color);
                attributes.alpha.value.push(valueBins[c].alpha);
                attributes.psize.value.push(valueBins[c].psize*config.height/300);
            }
        } catch (err) { 
            console.log("Error setting attributes: " + err);
            console.log(c);
            console.log(dRng);
            console.log(d0);
            console.log(d);
        }
    }

    var points        = new THREE.ParticleSystem(pointGeo,mat);
    //points.sortParticles = true;
    scatterPlot.add(points);

    // Create a three.js 'scene' and add each item to plot to it.
    var scene = new THREE.Scene();
    //scene.fog = new THREE.FogExp2( 0xFFFFFF, 0.000005 );

    /*
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(-camera.position).normalize();
    scene.add(directionalLight);
    */
    
    scene.add(scatterPlot);

    //camera.lookAt( scatterPlot );
    //camera.target.position.copy( scatterPlot );

    THREE.GeometryUtils.center(xAxisGeo   );
    THREE.GeometryUtils.center(yAxisGeo   );
    THREE.GeometryUtils.center(zAxisGeo   );
    THREE.GeometryUtils.center(boundaryGeo);
    THREE.GeometryUtils.center(pointGeo   );

    var camera = new THREE.PerspectiveCamera(25,w/h,1,100000);
    camera.position.x = xMid;
    camera.position.y = y1+0.25*yRng;
    camera.position.z = z1+3.00*zRng;

    renderer.render(scene,camera);

    function refresh () {
      renderer.clear();
      camera.lookAt(scene.position);
      renderer.render(scene,camera);
    }

    var eventTarget = chart.config.parent;

    eventTarget.addEventListener('DOMMouseScroll',mousewheel,false);
    eventTarget.addEventListener('mousewheel'    ,mousewheel,false);

    var down = false;
    var sx   = 0;
    var sy   = 0;
    eventTarget.onmousedown = function ( ev ) {
      down = true;
      sx   = ev.clientX;
      sy   = ev.clientY;
    };
    eventTarget.onmouseup = function () {
      down = false;
    };
    eventTarget.onmouseleave = function () {
      down = false;
    };
    eventTarget.onmousemove = function ( ev ) {
      if (down) {
        var dx = ev.clientX-sx;
        var dy = ev.clientY-sy;
        scatterPlot.rotation.y += 3*dx*0.01;
        scatterPlot.rotation.x += 2*dy*0.01;
//      camera.position.y      += (5*dy/(config.height))*(yRng);
        sx += dx;
        sy += dy;
        refresh();
      }
    };

    var animating = false;
    var paused    = false;
    var last      = null;
    eventTarget.ondblclick = function () {
      animating = !animating;
      if (animating) {
        last = null;
        window.requestAnimationFrame(animate,renderer.domElement);
      }
    };
    function animate ( t ) {
      if (!paused) {
        if (animating) {
          if (last == null) {
            last = t;
          }
          var delta_s = (t-last)/1000.0;
          scatterPlot.rotation.y += (delta_s/10.0)*2.0*Math.PI;
          refresh();
          last = t;
        }
      }
      if (animating) {
        window.requestAnimationFrame(animate,renderer.domElement);
      }
    };
    refresh(); //animate(new Date().getTime());
    onmessage = function ( ev ) {
      paused = (ev.data == 'pause');
    };

  };

  return chart;
}

module.exports = DensityPlot3D;
