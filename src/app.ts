import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Scene, AxesViewer, Vector3, ArcRotateCamera, HavokPlugin, WebGPUEngine } from "@babylonjs/core";
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

    //  this.init();
    this.initWebGPU();
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

  _bindEvent(): void {
    // hide/show the Inspector
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

    // inspector
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
