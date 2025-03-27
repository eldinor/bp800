import {
  MeshBuilder,
  PhysicsAggregate,
  PhysicsShapeType,
  Scene,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class Ground {
  constructor(private scene: Scene) {
    this._createGround();
    this._createSphere();
  }

  _createGround(): void {
    const { scene } = this;

    const mesh = MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      scene
    );
    new PhysicsAggregate(mesh, PhysicsShapeType.BOX, { mass: 0 }, scene);
  }

  _createSphere(): void {
    const mesh = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 2, segments: 32 },
      this.scene
    );
    mesh.position.y = 4;

    new PhysicsAggregate(
      mesh,
      PhysicsShapeType.SPHERE,
      { mass: 1, restitution: 0.75 },
      this.scene
    );
  }
}
