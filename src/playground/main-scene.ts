import {
  ArcRotateCamera,
  DefaultRenderingPipeline,
  Engine,
  HemisphericLight,
  LoadAssetContainerAsync,
  Scene,
  Tools,
  Vector3,
  WebGPUEngine,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Ground } from "./ground";

export default class MainScene {
  private camera: ArcRotateCamera;

  constructor(private scene: Scene, private canvas: HTMLCanvasElement, private engine: Engine | WebGPUEngine) {
    this._setCamera(scene);
    this._setLight(scene);
    //  this._setEnvironment(scene);
    this.loadComponents();
  }

  _setCamera(scene: Scene): void {
    this.camera = new ArcRotateCamera("camera", Tools.ToRadians(90), Tools.ToRadians(80), 20, Vector3.Zero(), scene);
    this.camera.attachControl(this.canvas, true);
    this.camera.setTarget(Vector3.Zero());
  }

  _setLight(scene: Scene): void {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.5;
  }

  _setEnvironment(scene: Scene) {
    scene.createDefaultEnvironment({ createGround: false, createSkybox: false });
  }

  _setPipeLine(): void {
    const pipeline = new DefaultRenderingPipeline("default-pipeline", false, this.scene, [this.scene.activeCamera!]);
    pipeline.fxaaEnabled = true;
    pipeline.samples = 4;
  }

  async loadComponents(): Promise<void> {
    // Load your files in order
    new Ground(this.scene);
    // Just the example of model loading and animation playing
    // await this._loadModel();
  }

  async _loadModel(): Promise<void> {
    const container = await LoadAssetContainerAsync("model/Xbot.glb", this.scene);
    container.addAllToScene();
    console.log(container);
    const root = container.meshes[0];
    root.position.z = 3;
    container.animationGroups.forEach((ag) => {
      ag.stop();
    });
    container.animationGroups[4].play(true);
    setTimeout(() => {
      container.animationGroups[4].stop();
      container.animationGroups[2].play(true);
    }, 3000);
  }
}
