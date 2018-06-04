function main()
{

    var volume = new KVS.LobsterData();

    var width = innerWidth*0.8;

    var height = innerHeight;

    var scene = new THREE.Scene();

    var clock = new THREE.Clock();


    var max_range = volume.max_coord.clone().sub( volume.min_coord ).max();
    var center = volume.objectCenter();
    var fov = 45;
    var aspect = width / height;
    var near = 0.1;
    var far = max_range*100;

    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set(center.x+200, center.y, 70);
    camera.up.set( 0, 0, 1 );
    scene.add( camera );

    var light = new THREE.DirectionalLight( 0xffff55 );
    light.position.set(center.x, center.y, max_range * 2);
    scene.add( light );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    var trackball = new THREE.TrackballControls( camera, renderer.domElement );
    trackball.staticMoving = true;
    trackball.rotateSpeed = 3;
    trackball.radius = Math.min( width, height );
    trackball.target = center;
    trackball.noRotate = false;
    trackball.update();

   
    var bounds = Bounds( volume );
    scene.add( bounds );

   
    var isovalue = 128;
    var surfaces = Isosurfaces( volume, isovalue );
    
    scene.add( surfaces );
    var original_position_z = surfaces.position.z;

    
    var sphere = new THREE.Mesh(
        new THREE.SphereGeometry(5), 
        new THREE.MeshLambertMaterial( { color: 0xbdb76b } )
    );
    sphere.position.x += volume.resolution.x - 30;
    sphere.position.y += volume.resolution.y/2 + 30;
    sphere.position.z += volume.resolution.z/2;
    scene.add( sphere );
    sphere.visible = false;

    document.addEventListener( 'mousemove', function() {
        light.position.copy( camera.position );
    });


 

    var loader = new THREE.TextureLoader();
    waterNormals = loader.load("waternormal.jpg");
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 

 
    water = new THREE.Water( renderer, camera, scene, {
      textureWidth: 216,
      textureHeight: 216,
      waterNormals: waterNormals,
      distortionScale: 20,
      noiseScale: .5,
      alpha: .8,
      sunDirection: light.position.clone().normalize(),
      sunColor: 0xffffff,
      waterColor: 0x00bfff,
      side: THREE.DoubleSide,
    } );

    waterSurface = new THREE.Mesh(new THREE.PlaneGeometry( volume.resolution.x, volume.resolution.y, 70, 70 ),water.material);
    waterSurface.add(water);
    waterSurface.position.x = surfaces.position.x + volume.resolution.x/2;
    waterSurface.position.y = surfaces.position.y + volume.resolution.y/2;
    waterSurface.position.z = surfaces.position.z + volume.resolution.z-8;
    scene.add(waterSurface);

    

    //user interface


    var elem = document.querySelector('input[type="range"]');
    var rangeValue = function(){
        waterSurface.position.z = elem.value;
    }
    elem.addEventListener("input", rangeValue);

   
   

    var sphereInButton = document.querySelector('button[id="sphere_in_button"]');
    var sphereInButtonPush = function(){
        if(sphere.visible == false){
            sphere.visible = true;
        }
    }   
    sphereInButton.addEventListener("click", sphereInButtonPush);

    var sphereOutButton = document.querySelector('button[id="sphere_out_button"]');
    var sphereOutButtonPush = function(){
        if(sphere.visible == true){
            sphere.visible = false;
        }
    }   
    sphereOutButton.addEventListener("click", sphereOutButtonPush);

    loop();


   
    function loop()
    {
        var elapsed = clock.getElapsedTime()
        requestAnimationFrame( loop );
        trackball.handleResize();
        water.render();
        renderer.render( scene, camera );
        trackball.update();
        water.material.uniforms.time.value = elapsed;   
    }
}
