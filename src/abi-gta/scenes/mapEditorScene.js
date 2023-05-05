import { Color, Entity, LIGHTTYPE_DIRECTIONAL } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { Map } from "../objects/map/map";
import { Raycast, RaycastEvent } from "../scripts/raycast/raycast";
import { InputHandler, InputHandlerEvent } from "../scripts/input/inputHandler";
import { CastBox } from "../scripts/raycast/castBox";
import { MapEditorScreen } from "../ui/screens/mapEditorScreen";

export class MapEditorScene extends Scene{
  constructor(){
    super(GameConstant.SCENE_MAP_EDITOR);
  }
  
  create() {
    super.create()
    this.ui.addScreens(
      new MapEditorScreen()
    );
    this.mapEditorScreen = this.ui.getScreen(GameConstant.SCREEN_MAP_EDITOR);
    this.ui.setScreenActive(GameConstant.SCREEN_MAP_EDITOR);
    this._initialize();
  }

  _initialize() {
    this._initInputHandler();
    this._initLight();
    this._initCamera();
    this._initRaycast();
    this._initMap();
  }

  _initMap() {
    this.map = new Map();
    this.addChild(this.map);

    this.raycast
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
    this.mainCamera.setLocalPosition(40, 200, 40);
    this.mainCamera.setLocalEulerAngles(-90.2, 90, 0);
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
      color: new Color(1, 1, 1),
      castShadows: false,
      shadowDistance: 30,
      shadowResolution: 1024,
      shadowBias: 0.2,
      normalOffsetBias: 0.05,
      intensity: 0.85,
    });
    this.directionalLight.setLocalPosition(2, 30, -2);
    this.directionalLight.setLocalEulerAngles(45, 135, 0);
  }

  _initInputHandler() {
    let inputHandlerEntity = new Entity("input");
    this.inputHandler = inputHandlerEntity.addScript(InputHandler);
    // this.inputHandler.enabled = false;
    this.addChild(inputHandlerEntity);
  }

  _initRaycast() {
    let raycasterEntity = new Entity();
    this.addChild(raycasterEntity);

    this.raycast = raycasterEntity.addScript(Raycast, {
      camera: this.mainCamera.camera,
    });

    this.inputHandler.on(InputHandlerEvent.PointerDown, this.raycast.onPointerDown, this.raycast);
    this.raycast.on(RaycastEvent.Cast, this.onCast, this);
  }

  onCast(ray) {
    let intersect = this.map.groundBox.getScript(CastBox).checkIntersects(ray);
  }
}