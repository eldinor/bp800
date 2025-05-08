import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { Ground } from "../src/playground/ground";
import { Scene, NullEngine, Mesh, Vector3 } from "@babylonjs/core";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";

describe("Ground with Havok Physics", () => {
  let engine: NullEngine;
  let scene: Scene;
  let havokInstance: any;

  beforeAll(async () => {
    // Initialize Havok using the correct CDN URL
    havokInstance = await HavokPhysics({
      locateFile: () => "https://cdn.babylonjs.com/havok/HavokPhysics.wasm",
    });

    // Setup headless engine
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
    // Cleanup physics and scene

    scene.dispose();
  });

  it("should create ground with physics", async () => {
    // Enable physics
    const gravity = new Vector3(0, -9.81, 0);
    const plugin = new HavokPlugin(true, havokInstance);
    scene.enablePhysics(gravity, plugin);

    // Create ground
    new Ground(scene);

    // Wait for physics to initialize
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify ground mesh exists
    const groundMesh = scene.getMeshByName("ground");
    expect(groundMesh).toBeInstanceOf(Mesh);

    // Uncomment when your Ground implementation adds physics body
    expect(groundMesh?.physicsBody).toBeDefined();
  });

  it("should create sphere with physics", async () => {
    // Enable physics
    const gravity = new Vector3(0, -9.81, 0);
    const plugin = new HavokPlugin(true, havokInstance);
    scene.enablePhysics(gravity, plugin);

    // Create ground
    new Ground(scene);

    // Wait for physics to initialize
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify ground mesh exists
    const sphereMesh = scene.getMeshByName("sphere");
    expect(sphereMesh).toBeInstanceOf(Mesh);

    // Uncomment when your Ground implementation adds physics body
    expect(sphereMesh?.physicsBody).toBeDefined();
  });

  it("should have correct dimensions", () => {
    new Ground(scene);

    const groundMesh = scene.getMeshByName("ground");
    expect(groundMesh?.getBoundingInfo().boundingBox.extendSize.x).toBeCloseTo(5);

    const sphereMesh = scene.getMeshByName("sphere");
    expect(sphereMesh?.getBoundingInfo().boundingBox.extendSize.x).toBeCloseTo(1);
  });
});
