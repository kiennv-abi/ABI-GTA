import { Color, Entity, LIGHTTYPE_DIRECTIONAL } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { InputHandler, InputHandlerEvent } from "../scripts/input/inputHandler";
import { Cube } from "../objects/cube/cube";
import { Player } from "../objects/cube/player";
import { DetectPositionChanged } from "../scripts/components/detectPositionChanged";
import { CubeStackManager } from "../objects/cube/cubeStackManager";
import { Tween } from "../../template/systems/tween/tween";

export class TestScene extends Scene{
  constructor() {
    super(GameConstant.SCENE_TEST);
  }

  create() {
    super.create();
    this._initialize();
  }

  _initialize() {
    this._initInputHandler();
    this._initLight();
    this._initCamera();
    this._initMap();
    this._initPlayer();
  }

  _initInputHandler() {
    let inputHandlerEntity = new Entity("input");
    this.inputHandler = inputHandlerEntity.addScript(InputHandler);
    this.addChild(inputHandlerEntity);
    this.inputHandler.on(InputHandlerEvent.PointerDown, this._onPointerDown, this);
    this.inputHandler.on(InputHandlerEvent.PointerMove, this._onPointerMove, this);
    this.inputHandler.on(InputHandlerEvent.PointerUp, this._onPointerUp, this);
  }

  _initMap() {
    this.map = new Entity();
    this.map.addComponent("model", {
      type: "plane",
    });
    this.map.setLocalEulerAngles(0, 0, 0);
    this.map.setLocalScale(10, 10, 10);
    this.addChild(this.map);
  }

  _initPlayer() {
    this.player = new Player();
    this.addChild(this.player);
    this.player.setLocalScale(1, 1, 1);
    this.cubeStack = new CubeStackManager(this.player, 0.5);
    this.addChild(this.cubeStack);

    this.detectPositionChange = this.player.addScript(DetectPositionChanged, {
      onPositionChanged: this.cubeStack.enqueuePosition.bind(this.cubeStack),
      delta: 0.05,
    });

    Tween.createCountTween({
      duration: 2,
      loop: true,
      onRepeat: () => {
        this.cubeStack.spawnCubes(1);
      },
    }).start();
  }

  _onPointerDown(e) {
    this.player.playerMove.onPointerDown(e);
    this.cubeStack.startMove();
  }

  _onPointerMove(e){
    this.player.playerMove.onPointerMove(e);
  }

  _onPointerUp(e) {
    this.player.playerMove.onPointerUp(e);
    this.cubeStack.stopMove();
  }

  _initCamera() {
    this.mainCamera = new Entity();
    this.addChild(this.mainCamera);
    this.mainCamera.addComponent("camera", {
      clearColor: new Color(0, 0, 0),
      farClip: 1000,
      fov: 60,
      nearClip: 0.1,
    });
    // this.mainCamera.setLocalPosition(5, 10, -10);
    // this.mainCamera.setLocalEulerAngles(-30, 180, 0);
    this.mainCamera.setLocalPosition(0, 10, 10);
    this.mainCamera.setLocalEulerAngles(-40, 0, 0);
  }

  _initLight() {
    this.directionalLight = new Entity("light-directional");
    this.addChild(this.directionalLight);

    this.directionalLight.addComponent("light", {
      type: LIGHTTYPE_DIRECTIONAL,
      color: new Color(0, 0, 0),
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
}