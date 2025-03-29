//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { AxesViewer } from "@babylonjs/core/Debug/axesViewer";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";

import MainScene from "./playground/main-scene";

class App {
  public engine: Engine | WebGPUEngine;
  public scene: Scene;

  private canvas: HTMLCanvasElement;

  constructor() {
    // create the canvas html element and attach it to the webpage
    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.id = "renderCanvas";
    document.body.appendChild(this.canvas);

    //  this.init(); // Uncomment to use WebGL2 engine
    this.initWebGPU(); // Comment not to use WebGPU engine
  }

  async init(): Promise<void> {
    this.engine = new Engine(this.canvas, true, {
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false,
    });

    this.scene = new Scene(this.engine);

    // Add physics. If not needed, you can annotate it to improve loading speed and environment performance.
    await this._setPhysics();

    new MainScene(this.scene, this.canvas, this.engine);

    this._config();
    this._renderer();
  }

  async initWebGPU(): Promise<void> {
    const webgpu = (this.engine = new WebGPUEngine(this.canvas, {
      adaptToDeviceRatio: true,
      antialias: true,
    }));
    await webgpu.initAsync();
    this.engine = webgpu;
    console.log(this.engine);

    this.scene = new Scene(this.engine);
    // Add physics. If not needed, you can annotate it to improve loading speed and environment performance.
    await this._setPhysics();

    new MainScene(this.scene, this.canvas, this.engine);

    this._config();
    this._renderer();
  }

  async _setPhysics(): Promise<void> {
    const gravity = new Vector3(0, -9.81, 0);
    const hk = await HavokPhysics();
    const plugin = new HavokPlugin(true, hk);
    this.scene.enablePhysics(gravity, plugin);
  }

  _fps(): void {
    const dom = document.getElementById("display-fps");
    if (dom) {
      dom.innerHTML = `${this.engine.getFps().toFixed()} fps`;
    } else {
      const div = document.createElement("div");
      div.id = "display-fps";
      div.innerHTML = "0";
      document.body.appendChild(div);
    }
  }

  async _bindEvent(): Promise<void> {
    // Imports and hide/show the Inspector
    // Works only in DEV mode to reduce the size of the PRODUCTION build
    // Comment IF statement to work in both modes
    if (import.meta.env.DEV) {
      await Promise.all([import("@babylonjs/core/Debug/debugLayer"), import("@babylonjs/inspector")]);

      window.addEventListener("keydown", (ev) => {
        // Shift+Ctrl+Alt+I
        if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
          if (this.scene.debugLayer.isVisible()) {
            this.scene.debugLayer.hide();
          } else {
            this.scene.debugLayer.show();
          }
        }
      });
    } // End of IF statement

    // resize window
    window.addEventListener("resize", () => {
      this.engine.resize();
    });

    window.onbeforeunload = () => {
      // I have tested it myself and the system will automatically remove this junk.
      this.scene.onBeforeRenderObservable.clear();
      this.scene.onAfterRenderObservable.clear();
      this.scene.onKeyboardObservable.clear();
    };
  }

  // Auxiliary Class Configuration
  _config(): void {
    // Axes
    new AxesViewer();

    // Inspector and other stuff
    this._bindEvent();
  }

  _renderer(): void {
    this.engine.runRenderLoop(() => {
      this._fps();
      this.scene.render();
    });
  }
}

new App();
