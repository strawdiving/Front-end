## Create a scene
```javascript
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;
```
- PerspectiveCamera
    - FOV(field of view): extent of the scene that is seen on the display at the given moment
    - aspect ratio, width/height
    - near, near clipping plane
    - far, far clipping plane
    objects further away from the camera than the value of far or closer than near won't be rendered
 
- Render
    - setSize
        - width
        - height
        - updateStyle(boolean)
1. create a Scene
2. Create a Camera
3. Create a Render
4. Set the size at which we want it to render our app (width and height of the area we want to fill with our app - in this case, the width and height of the browser window)
5. Add the renderer element to our HTML document. This is a <canvas> element the renderer uses to display the scene

6. Add things to Scene
    - Geometry
        - BoxGeometry( an object that contains all the points (vertices) and fill (faces) of the cube)
    - Material
      all materials take an object of properties which will be applied to them
        - MeshBasicMaterial
    - Mesh
      An object that takes a geometry, and applies a material to it, which we then can insert to our scene, and move freely around.

    scene.add() ———— default added to coordinates(0,0,0). Move the camara.

    ```javascript
      camera.position.set( 0, 0, 100 );
      camera.lookAt( 0, 0, 0 );
    ```

7. render/animation loop
```javascript
function animate() {
    requestAnimation(animate);
    renderer.render(scene, camera);
}
animate();
```
Create a loop that causes render to draw the scene every time the scene refreshed.

Anything you want to move or change while the app is running has to go through the animate loop

## Drawing Lines
1. meterial --- for lines
        - LineBasicMaterial
        - LineDashedMaterial 
2. geometry --- with some vertices
```javascript
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const points = [];
    points.push( new THREE.Vector3( - 10, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 10, 0 ) );
    points.push( new THREE.Vector3( 10, 0, 0 ) );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const line = new THREE.Line(geometry, material);
    scene.add(line);
    
```
Lines are drawn between each consecutive pair of vertices, but not between the first and last (the line is not closed.)