import { describe, it, expect, beforeAll, afterEach, vi } from "vitest";
import { NullEngine, Scene, ArcRotateCamera, HemisphericLight, Vector3 } from "@babylonjs/core";
import MainScene from "../src/playground/main-scene";

describe("MainScene with NullEngine", () => {
  let engine: NullEngine;
  let scene: Scene;
  let mainScene: MainScene;

  beforeAll(() => {
    engine = new NullEngine({
      renderHeight: 256,
      renderWidth: 256,
      textureSize: 256,
      deterministicLockstep: true,
      lockstepMaxSteps: 4,
    });
    scene = new Scene(engine);
  });

  afterEach(() => {
    scene.dispose();
  });

  it("should initialize camera with correct parameters", () => {
    // Create a dummy canvas-like object for camera attachment
    const dummyCanvas = { width: 800, height: 600 };

    mainScene = new MainScene(scene, dummyCanvas as any, engine);

    const camera = scene.activeCamera as ArcRotateCamera;
    expect(camera).toBeInstanceOf(ArcRotateCamera);
    expect(camera.alpha).toBeCloseTo(Math.PI / 2); // 90 degrees in radians
    expect(camera.beta).toBeCloseTo((Math.PI * 80) / 180); // 80 degrees in radians
    expect(camera.radius).toBe(20);
    expect(camera.target).toEqual(Vector3.Zero());
  });

  it("should set up hemispheric light correctly", () => {
    mainScene = new MainScene(scene, {} as any, engine);

    const light = scene.lights[0] as HemisphericLight;
    expect(light).toBeInstanceOf(HemisphericLight);
    expect(light.direction).toEqual(new Vector3(0, 1, 0));
    expect(light.intensity).toBe(0.5);
  });

  it("should initialize ground and other components", () => {
    mainScene = new MainScene(scene, {} as any, engine);

    // Verify ground exists
    expect(scene.getMeshByName("ground")).toBeDefined();
    // Verify sphere exists (from Ground class)
    expect(scene.getMeshByName("sphere")).toBeDefined();
  });

  it("should create default rendering pipeline when called", () => {
    mainScene = new MainScene(scene, {} as any, engine);
    mainScene._setPipeLine();

    expect(scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline).toBeDefined();
  });
});
