import { Color, Entity, KEY_R, LIGHTTYPE_DIRECTIONAL, Vec3 } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { Map } from "../objects/map/map";
import { Raycast, RaycastEvent } from "../scripts/raycast/raycast";
import { InputHandler, InputHandlerEvent } from "../scripts/input/inputHandler";
import { MapEditorScreen, MapEditorScreenEvent } from "../ui/screens/mapEditorScreen";
import { DataManager } from "../data/dataManager";
import { MapItemType } from "../ui/objects/mapItemUI";
import { Game } from "../../game";

export class MapEditorScene extends Scene{
  constructor(){
    super(GameConstant.SCENE_MAP_EDITOR);
  }
  
  create() {
    super.create()
    this._initialize();
  }

  _initialize() {
    this._initLight();
    this._initCamera();
    this._initMap();
  }


  _initMap() {
    this.map = new Map();
    this.addChild(this.map);
  }

  _initCamera() {
    this.mainCamera = new Entity();
    this.addChild(this.mainCamera);
    this.mainCamera.addComponent("camera", {
      clearColor: new Color(0, 0, 0),
      farClip: 1000,
      fov: 45,
      nearClip: 0.1,
    });
    this.mainCamera.addComponent("script");
    // this.mainCamera.setLocalPosition(50, 130, 50);
    // this.mainCamera.setLocalEulerAngles(-90, 0, 0);
    this.mainCamera.setLocalPosition(60, 170, 100);
    this.mainCamera.setLocalEulerAngles(-80, 0, 0);
    if (GameConstant.DEBUG_CAMERA) {
      this.mainCamera.script.create("orbitCamera", {
        attributes: {
          inertiaFactor: 0.3, // Override default of 0 (no inertia)
        },
      });

      this.mainCamera.script.create("orbitCameraInputMouse");
      this.mainCamera.script.create("orbitCameraInputTouch");
    }
  }

  _initLight() {
    this.directionalLight = new Entity("light-directional");
    this.addChild(this.directionalLight);

    this.directionalLight.addComponent("light", {
      type: LIGHTTYPE_DIRECTIONAL,
      color: new pc.Color(1, 1, 1),
      castShadows: true,
      shadowDistance: 300,
      shadowResolution: 2048,
      shadowBias: 1,
      normalOffsetBias: 1,
      intensity: 1,
    });
    this.directionalLight.setLocalPosition(0, 30, 0);
    this.directionalLight.setLocalEulerAngles(0, 0, 0);
  }
}