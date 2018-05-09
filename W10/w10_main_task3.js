function main()
{
    var volume = new KVS.LobsterData();
    var screen = new KVS.THREEScreen();

    screen.init( volume, {
        width: window.innerWidth,
        height: window.innerHeight,
        enableAutoResize: false
    });

    var bounds = Bounds( volume );
    screen.scene.add( bounds );

    var isovalue = 128;
    var surfaces = Isosurfaces( volume, isovalue );
    screen.scene.add( surfaces );

    document.addEventListener( 'mousemove', function() {
        screen.light.position.copy( screen.camera.position );
    });

    window.addEventListener( 'resize', function() {
        screen.resize( [ window.innerWidth, window.innerHeight ] );
    });

    var light = new THREE.PointLight();
    light.position.set( 5, 5, 5 );
    screen.scene.add( light );

    var geometry = new THREE.TorusKnotGeometry( 1, 0.3, 100, 20 );

    var material = new THREE.ShaderMaterial({
        vertexColors: THREE.VertexColors,
        vertexShader: document.getElementById('gouraud.vert').text,
        fragmentShader: document.getElementById('gouraud.frag').text,
        uniforms: {
            light_position: { type: 'v3', value: light.position }
        }
    });

    var torus_knot = new THREE.Mesh( geometry, material );
    screen.scene.add( torus_knot );

    screen.loop();
}
