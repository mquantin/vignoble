import {
  SphereBufferGeometry,
  Mesh,
  ShaderMaterial,
  FrontSide,
  AdditiveBlending,
} from 'three'

// ======== MOVES ===========
const sizePerSecond = 0.5;
const cycleDuration = 3; //in seconds
const cycleFrames = 60 * cycleDuration;
let isGrowing = true;
let frame = 1; //initialized
function dynascale(delta, meshObj) {
  const factor = 1 + sizePerSecond * delta;
  //isGrowing ? (currentSize = currenSize * variation) : (currentSize = currenSize / variation);
  if (frame === cycleFrames || frame === 0) {isGrowing = !isGrowing};
  if (isGrowing) {
     meshObj.scale.multiplyScalar(factor);
     frame += 1;
  } else {
    meshObj.scale.multiplyScalar(1/factor);
    frame -= 1;
  };
}




function createPoi(id, poiData) {
  const customMaterial = new ShaderMaterial( 
    {
        uniforms: 
      { 
        "c":   { type: "f", value: 1.0 },
        "p":   { type: "f", value: 1.4 },
        glowColor: { type: "c", value: '#ffff00' },
        //viewVector: { type: "v3", value: camera.position }
      },
      side: FrontSide,
      blending: AdditiveBlending,
      transparent: true
    }   );
  const geometry = new SphereBufferGeometry(0.12, 32, 32);
  const meshObj = new Mesh(geometry);
  //createMaterial(meshObj);
  meshObj.material = customMaterial;
  meshObj.position.set(...poiData.position);
  meshObj.name = poiData.name;
  meshObj.keyname = id;
  meshObj.tick = (deltaT, elapsedT) => {//delta is time elapsed since last frame in seconds
    dynascale(deltaT, meshObj);
  };
  return meshObj;
}

export {createPoi};




//===========
