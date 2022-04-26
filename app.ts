import type {
  ISceneLoaderProgressEvent,
  SceneLoader,
} from '@babylonjs/core/Loading/sceneLoader';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import SceneHelper from './core/SceneHelper';
import '@babylonjs/core/Materials/standardMaterial';
import '@babylonjs/core/Meshes/Builders/sphereBuilder';
import '@babylonjs/core/Meshes/Builders/boxBuilder';
import '@babylonjs/core/Meshes/Builders/groundBuilder';

export default class App {
  /**
   * The main entry point for the 3D app.
   * @param engine - an instance of the 3D engine.
   */
  public createScene(engine: Engine): Scene {
    const scene = new Scene(engine);
    //scene.createDefaultEnvironment({});

    const arcRotate: boolean = false;
    SceneHelper.setupCamera(scene, arcRotate);
    SceneHelper.setupLight(scene);

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var sphere = Mesh.CreateSphere('sphere1', 16, 2, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = Mesh.CreateGround('ground1', 6, 6, 2, scene);

    return scene;
  }
}
