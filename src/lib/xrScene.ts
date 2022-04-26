import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Color3, Vector3 } from '@babylonjs/core/Maths/math';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import type { Camera } from '@babylonjs/core/Cameras';
import "@babylonjs/core/Helpers/sceneHelpers";

export default class XrScene {
  readonly #engine: Engine;
  readonly #scene: Scene;
  readonly #camera: Camera;

  public constructor(app: HTMLElement) {
    const canvas = document.createElement('canvas');
    canvas.id = 'renderCanvas';
    canvas.style.width = "90vw";
    canvas.style.height = "90vh";

    this.#engine = new Engine(canvas, true);
    this.#scene = this.#createScene();
    this.#camera = this.#createCamera(canvas);
    this.#createLights();
    this.#createEnvironment();

    this.engine.runRenderLoop(() => this.#scene.render());
    app.appendChild(canvas);
  }

  #createScene(): Scene {
    const scene = new Scene(this.engine);
    scene.useRightHandedSystem = true;
    scene.fogColor.set(0.5, 0.5, 0.5);
    return scene;
  }

  #createCamera(canvas: HTMLCanvasElement): Camera {
    const camera = new ArcRotateCamera(
      'Camera',
      Math.PI / 2,
      Math.PI / 2,
      1.4,
      new Vector3(0, 1.4, 0),
      this.scene
    );
    camera.minZ = 0.1;
    camera.maxZ = 10;
    camera.setPosition(new Vector3(-0.5, 1.4, 3.1));
    camera.setTarget(new Vector3(1.1, 1.1, 0));
    camera.allowUpsideDown = false;
    camera.lowerBetaLimit = 1;
    camera.wheelDeltaPercentage = 0.01;
    camera.attachControl(canvas, true);
    return camera;
  }

  #createLights(): void {
    const hemiLight = new HemisphericLight(
      'light1',
      new Vector3(0, 1, 0),
      this.scene
    );
    hemiLight.intensity = 1;
    hemiLight.specular = Color3.Black();
  }

  #createEnvironment(): void {
    const helper = this.scene.createDefaultEnvironment({enableGroundShadow: true});
    if  (helper && helper.groundMaterial && helper.ground) {
      helper.groundMaterial.primaryColor.set(0.5, 0.5, 0.5);
      helper.ground.receiveShadows = true;
    }
  }

  public get engine(): Engine {
    return this.#engine;
  }

  public get scene(): Scene {
    return this.#scene;
  }

  public get camera(): Camera {
    return this.#camera;
  }
}
