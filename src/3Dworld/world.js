import { createCamera } from './objects/camera.js';
import { createPoi } from './objects/poi.js';
import { createScene } from './objects/scene.js';
import { createLights } from './objects/lights.js';
import { loadPress } from './objects/loadPress.js'
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { createRaycast } from './systems/raycaster.js';
import { createControls, fitCameraToSelection  } from './systems/controls.js';
import { Vector3 } from 'three';



// These variables are module-scoped: we cannot access them
// from outside the module
let camera;
let renderer;
let scene;
let loop;
let controls;


// function getRandomNumber(min, max) {
//   const randomNumber =  Math.floor(Math.random() * (max - min)) + min;
//   return randomNumber;
// }

class World {
  constructor(container, poisData, callback) {
    // not declared as this.camera (etc) in order to avoid access to that variables from out of world module 
    this.models = {};//meshes objects will be pushed here for convenience purpose
    this.pois = {};// {id: poi3DObject}
    //const targets = new Group;
    //setOrientation([0, 0, 1]);//z up
    renderer = createRenderer();
    camera = createCamera();
    scene = createScene();
    container.append(renderer.domElement);
    loop = new Loop(camera, scene, renderer);
    controls = createControls(camera, renderer.domElement);
    controls.addEventListener('change', () => {
      this.render();
    });
    this.createPois(poisData);
    loop.updatables.push(camera);
    loop.updatables.push(controls);
    const lights = createLights()
    scene.add(...lights);
    const resizer = new Resizer(container, camera, renderer);
    //hook from Resizer trigger here, useless in loop styles
    resizer.onResize = () => {
      this.render();
    };
    createRaycast(renderer, scene.children, camera, callback);
  }

  async init(pressURL) {
    // asynchronous setup here, it loads gltf model and any other loaded stuff
    const press = await loadPress(pressURL);
    this.models['press'] = press;
    loop.updatables.push(press,);
    scene.add(press);
    fitCameraToSelection( camera, controls, this.models);//this.models.filter(model => model !== press)
    this.poiFollow();
  }

  poiFollow(){
    //make a poi following an animated child part of the press  
    let ecrou = this.models['press'].children.filter(item => 
      item.name == 'ecrou' & 
      item.type == 'Mesh' 
    ).pop();
    let ecrouPoi = this.pois[3];//defined in the API by id
    ecrouPoi.follow = ecrou;
  }



  createPois (poisData) {
    //creates pois from high level defined pois data
    //creates {id1:poi3Dobject1; id2:poi3Dobject2}  from {id1:poiData1, id2:poiData2}
    for ( const  poi of Object.values(poisData) ) {
      const threeObject = createPoi(poi.id, poi);
      this.pois[poi.id] = threeObject;
      this.models[poi.id] = threeObject;
      loop.updatables.push(threeObject);
      scene.add(threeObject);
    };
  }
  
  pausePressAnimation() {
    this.models['press'].paused = true;
  }

  resumePressAnimation() {
    this.models['press'].paused = false;
  }

  // 2. Render the scene
  render() {
    // draw a single frame, render on demand
    renderer.render(scene, camera);
  }

  start() {
    // produces a stream of frames
    loop.start();
  }
  
  stop() {
    loop.stop();
  }

  printCamPos() {
    camera.printCamPos();
  }

  resetCam() {
    //fitCameraToSelection( camera, controls, this.models);
    const decalage = new Vector3(-2,1,-2);
    controls.goTo(decalage, 6, 1500);
  }

  goTo(poiId) {
    controls.goTo(this.pois[poiId].position, 2, 900);
  }
}
  
  export default World;


