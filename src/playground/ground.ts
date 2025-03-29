import { Scene } from "@babylonjs/core/scene";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import { PhysicsShapeType } from "@babylonjs/core/Physics/";

export class Ground {
  constructor(private scene: Scene) {
    this.scene = scene;
    this._createGround();
    this._createSphere();
  }

  _createGround(): void {
    const mesh = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, this.scene);
    new PhysicsAggregate(mesh, PhysicsShapeType.BOX, { mass: 0 }, this.scene);
  }

  _createSphere(): void {
    const mesh = MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, this.scene);
    mesh.position.y = 4;

    new PhysicsAggregate(mesh, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, this.scene);
  }
}
