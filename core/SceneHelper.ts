import { Vector3 } from '@babylonjs/core/Maths/math';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { Scene } from '@babylonjs/core/scene';

export default class SceneHelper {
  /**
   * Sets up the camera for scene.
   */
  public static setupCamera(scene: Scene, arcRotate: boolean): void {
    // Creates, angles, distances and targets the camera
    var camera = arcRotate
      ? new ArcRotateCamera('Camera', 0, 0, 10, Vector3.Zero(), scene)
      : new FreeCamera('camera1', new Vector3(0, 5, -10), scene);

    // This positions the camera
    if (camera instanceof ArcRotateCamera) {
      camera.setPosition(new Vector3(0, 5, -2));
    } else {
      camera.setTarget(Vector3.Zero());
    }

    // This attaches the camera to the canvas
    camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
  }

  /**
   * Sets up lighting for scene.
   */
  public static setupLight(scene: Scene): void {
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
  }
}
