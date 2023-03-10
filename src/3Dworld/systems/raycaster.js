import { Raycaster, Vector2 } from 'three';

const mouse = new Vector2();
const raycaster = new Raycaster();


function getMouseCoord( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
    //sets the mouse position with a coordinate system where the center
    //   of the screen is the origin
  event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( (event.clientY) / (window.innerHeight) ) * 2 + 1;
  // header must be "fixed" in css in order not be taken into account here in clientY
  raycaster.cast();
}

function getTouchCoord( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
    //sets the mouse position with a coordinate system where the center
    //   of the screen is the origin
  event.preventDefault();
  // for the touchscreens
  mouse.x = +(event.targetTouches[0].pageX / window.innerWidth) * 2 - 1;
  mouse.y = -( (event.targetTouches[0].pageY) / window.innerHeight) * 2 + 1;
    // header must be "fixed" in css in order not be taken into account here in pageY
  raycaster.cast();
}

function createRaycast(renderer, objects, camera, callback) {
  renderer.domElement.addEventListener( 'click', getMouseCoord, false );
  renderer.domElement.addEventListener( 'touchstart', getTouchCoord, false );
  raycaster.cast = () => {
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( objects, false);
    if (intersects[ 0 ]) {
      const clicked = intersects[ 0 ];
      callback(clicked.object.keyname);
    }

    // for ( var i = 0; i < intersects.length; i++ ) {
    //   console.log( intersects[ i ] );
    //   const poi = intersects[ i ]
    //   callback(intersects[ i ]);
    // };
  };
}

export { createRaycast};

//===
