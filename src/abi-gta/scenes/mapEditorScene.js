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
import { Spawner } from "../scripts/spawners/spawner";
import { Road } from "../objects/map/road";

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
    this.mapEditorScreen.on(MapEditorScreenEvent.MapItemSelected, this.onMapItemSelected, this);
    this.ui.setScreenActive(GameConstant.SCREEN_MAP_EDITOR);
    this._initialize();
  }


  _initialize() {
    this._initLight();
    this._initCamera();
    this._initMap();
    this._initInputHandler()
    this._initRaycast();
    this._initSpawners();
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

  _initInputHandler(){
    let inputHandlerEntity = new Entity("input");
    this.inputHandler = inputHandlerEntity.addScript(InputHandler);
    this.addChild(inputHandlerEntity)
  }

  _initRaycast() {
    let raycasterEntity = new Entity();
    this.addChild(raycasterEntity);

    this.raycast = raycasterEntity.addScript(Raycast, {
      camera: this.mainCamera.camera,
    });

    this.inputHandler.on(InputHandlerEvent.PointerDown, this.raycast.onPointerDown, this.raycast);
    this.inputHandler.on(InputHandlerEvent.PointerMove, this.raycast.onPointerMove, this.raycast);
    this.inputHandler.on(InputHandlerEvent.PointerUp, this.raycast.onPointerUp, this.raycast);
    
    this.raycast.on(RaycastEvent.CastDown, this.onCastDown, this);
    this.raycast.on(RaycastEvent.CastMove, this.onCastMove, this);
    this.raycast.on(RaycastEvent.CastUp, this.onCastUp, this);
  }


  onCastDow(ray) {
    let bricks = this.map.bricks;
    for (let i = 0; i < bricks.length; i++) {
      let brick = bricks[i]
      let castBox = brick.castBox;
      if(castBox.checkIntersects(ray)){
        this.startBrick = brick;
        break;
      }
    } 
  }

  onCastUp(ray) {
    if (!this.mapItemSelected) {
      return;
    }
    let bricks = this.map.bricks;
    for (let i = 0; i < bricks.length; i++) {
      let brick = bricks[i];
      let castBox = brick.castBox;
      if (castBox.checkIntersects(ray) && this.startBrick) {
        this.endBrick = brick;
        let colStart = this.startBrick.col;
        let rowStart = this.startBrick.row;
        let colEnd = this.endBrick.col;
        let rowEnd = this.endBrick.row;
        let data = DataManager.findMapItemByStartAndEnd(rowStart, rowEnd, colStart, colEnd);
        this.map.addRoad(data);
        console.log(DataManager.mapData);
        DataManager.applyMapData(data, 1);
        this.mapItemSelected = null;
        break;
      }
    }
  }


  onMapItemSelected(type) {
    this.mapItemSelected = type;
    let item = null;
    switch (type) { 
      case MapItemType.ROAD:
        item = this.roadSpawner.spawn();
    }
  }


  _initSpawners() {
    let roadSpawnerEntity = new Entity("road-spawner");
    this.addChild(roadSpawnerEntity);

    this.roadSpawner = roadSpawnerEntity.addScript(Spawner, {
      class: Road,
      poolSize: 10,
    });
  }



}