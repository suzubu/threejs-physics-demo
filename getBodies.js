import * as THREE from "three";

const sceneMiddle = new THREE.Vector3(0, 0, 0);

function getBody(RAPIER, world) {
    // size determines the radius of the ball, randomly between 0.1 and 0.35
    const size = 0.1 + Math.random() * 0.25;
    // range defines the spatial distribution range for initial position
    const range = 6;
    // density is proportional to size to simulate realistic mass distribution
    const density = size  * 1.0;
    // random initial position within a cube of side length 'range', offset upward by 3 units in y
    let x = Math.random() * range - range * 0.5;
    let y = Math.random() * range - range * 0.5 + 3;
    let z = Math.random() * range - range * 0.5;
    // physics: create a dynamic rigid body at the randomized position
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(x, y, z);
    let rigid = world.createRigidBody(rigidBodyDesc);
    // create a spherical collider with specified size and density
    let colliderDesc = RAPIER.ColliderDesc.ball(size).setDensity(density);
    world.createCollider(colliderDesc, rigid);
  
    // create a mesh using an icosahedron geometry for visual representation
    const geometry = new THREE.IcosahedronGeometry(size, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      flatShading: true
    });
    const mesh = new THREE.Mesh(geometry, material);
  
    // add a slightly scaled wireframe mesh to enhance visual detail
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x990000,
      wireframe: true
    });
    const wireMesh = new THREE.Mesh(geometry, wireMat);
    wireMesh.scale.setScalar(1.01);
    mesh.add(wireMesh);
    
    function update () {
      // reset forces on the rigid body each frame to prevent accumulation
      rigid.resetForces(true); 
      // get current translation of the rigid body
      let { x, y, z } = rigid.translation();
      let pos = new THREE.Vector3(x, y, z);
      // compute direction vector from scene center to current position
      let dir = pos.clone().sub(sceneMiddle).normalize();
      // apply a force towards the center to create a mild attraction effect
      rigid.addForce(dir.multiplyScalar(-0.5), true);
      // update mesh position to match physics body
      mesh.position.set(x, y, z);
    }
    return { mesh, rigid, update };
  }

  function getMouseBall (RAPIER, world) {
    // mouseSize defines the radius of the mouse interaction ball
    const mouseSize = 0.25;
    // geometry with high detail for smooth appearance
    const geometry = new THREE.IcosahedronGeometry(mouseSize, 8);
    // material with emissive color to make it glow
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
    });
    // point light attached to the mouse ball to illuminate nearby objects
    const mouseLight = new THREE.PointLight(0xffffff, 0.5);
    const mouseMesh = new THREE.Mesh(geometry, material);
    mouseMesh.add(mouseLight);
    // create a kinematic rigid body that will be controlled by mouse position
    let bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 0, 0)
    let mouseRigid = world.createRigidBody(bodyDesc);
    // collider sized larger than the visual mesh for easier interaction
    let dynamicCollider = RAPIER.ColliderDesc.ball(mouseSize * 3.0);
    world.createCollider(dynamicCollider, mouseRigid);
    function update (mousePos) {
      // update the rigid body's position based on scaled mouse coordinates
      mouseRigid.setTranslation({ x: mousePos.x * 5, y: mousePos.y * 5, z: 0.2 });
      let { x, y, z } = mouseRigid.translation();
      // update the mesh position to follow the rigid body
      mouseMesh.position.set(x, y, z);
    }
    return { mesh: mouseMesh, update };
  }

  export { getBody, getMouseBall };