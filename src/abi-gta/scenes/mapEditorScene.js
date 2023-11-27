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
    this.ui.addScreens(
      new MapEditorScreen()
    );
    this.mapEditorScreen = this.ui.getScreen(GameConstant.SCREEN_MAP_EDITOR);
    this.mapEditorScreen.on(MapEditorScreenEvent.MapItemSelected, this.onMapItemSelected, this);
    this.mapEditorScreen.on(MapEditorScreenEvent.MapSelected, this.onMapSelected, this);
    this.mapEditorScreen.on(MapEditorScreenEvent.ButtonStartClicked, () => {
      this.fire(MapEditorScreenEvent.ButtonStartClicked)
    });
    this.ui.setScreenActive(GameConstant.SCREEN_MAP_EDITOR);
    this._initialize();
  }

  _initialize() {
    this._registerKeyboardEvent();
    this._initInputHandler();
    this._initLight();
    this._initCamera();
    this._initMap();
    this._initRaycast();
  }

  _registerKeyboardEvent() { 
    Game.app.keyboard.on(pc.EVENT_KEYDOWN, (e) => {
      if (e.key === KEY_R) {
        if (this.buildingSelected) {
          this.buildingSelected.setLocalEulerAngles(0, this.buildingSelected.getLocalEulerAngles().y + 45, 0);
        }
      }
    });
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
    this.inputHandler.on(InputHandlerEvent.PointerMove, this.raycast.onPointerMove, this.raycast);
    this.inputHandler.on(InputHandlerEvent.PointerUp, this.raycast.onPointerUp, this.raycast);
    
    
    this.raycast.on(RaycastEvent.CastDown, this.onCastDown, this);
    this.raycast.on(RaycastEvent.CastMove, this.onCastMove, this);
    this.raycast.on(RaycastEvent.CastUp, this.onCastUp, this);
  }

  onCastDown(ray) {
    if (!this.mapItemSelected) {
      return;
    }

    if (this.mapItemSelected === MapItemType.ROAD) {
      let bricks = this.map.bricks;
      for (let i = 0; i < bricks.length; i++) {
        let brick = bricks[i];
        let castBox = brick.castBox;
        console.log(castBox.checkIntersects(ray))
        if (castBox.checkIntersects(ray)) {
          this.startBrick = brick;
          break;
        }
      }
    } else {
      let buildings = this.map.buildings;
      for (let i = 0; i < buildings.length; i++) { 
        let building = buildings[i];
        let castBox = building.castBox;
        if (castBox.checkIntersects(ray)) {
          this.onBuildingPicked(building);
          break;
        }
      }
    }
  }

  onCastUp(ray) {
    if (!this.mapItemSelected) {
      return;
    }
    if (this.mapItemSelected === MapItemType.ROAD) { 
      this.buildRoad(ray);
    } else {
      this.onBuildingStopMove();
    }
  }

  onBuildingStopMove() {
    if (this.buildingSelected) {
      let tmpPos = this.buildingSelected.getLocalPosition();
      tmpPos.y = 0;
      this.buildingSelected.updateOpacity(1);
      this.buildingSelected.activeShadow(false);
      let dataFormat = this.buildingSelected.dataFormat;
      if (this.buildingSelected.isValid) {
      } else {
        let row = this.buildingSelected.row;
        let col = this.buildingSelected.col;
        let haftCol = Math.floor(dataFormat[0].length / 2);
        let haftRow = Math.floor(dataFormat.length / 2);
        this.buildingSelected.colStart = col - haftCol;
        this.buildingSelected.rowStart = row - haftRow;
        this.buildingSelected.colEnd = col + haftCol;
        this.buildingSelected.rowEnd = row + haftRow;
        tmpPos = new Vec3(this.buildingSelected.row * this.map.gridUnit, 0, this.buildingSelected.col * this.map.gridUnit);
      }
      this.buildingPlace(this.buildingSelected, dataFormat[0][0]);
      this.moveBuilding(tmpPos);
    }
    this.buildingSelected = null;
  }

  buildingPlace(building, dataValue) {
    if (building) {
      let colStart = building.colStart;
      let rowStart = building.rowStart;
      let colEnd = building.colEnd;
      let rowEnd = building.rowEnd;
      building.row = Math.floor((rowStart + rowEnd) / 2);
      building.col = Math.floor((colStart + colEnd) / 2);
      DataManager.applyMapDataByStartAndEnd(rowStart, rowEnd, colStart, colEnd, dataValue);
    }
  }

  buildRoad(ray) {
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
        this.map.addCross();
        this.mapItemSelected = null;
        this.startBrick = null;
        this.endBrick = null;
        break;
      }
    }
  }

  onCastMove(ray) {
    let bricks = this.map.bricks;
    for (let i = 0; i < bricks.length; i++) {
      let brick = bricks[i];
      let castBox = brick.castBox;
      if (castBox.checkIntersects(ray) && this.buildingSelected) {
        this.validateBuilding(brick);
        let pos = brick.getLocalPosition();
        let tmpPos = this.buildingSelected.getLocalPosition();
        this.moveBuilding(new Vec3(pos.x, tmpPos.y, pos.z));
        break;
      }
    }
  }

  moveBuilding(pos) { 
    this.buildingSelected.setLocalPosition(pos);
  }

  onBuildingPicked(building) {
    this.buildingSelected = building;
    this.buildingPlace(this.buildingSelected, 0);
    let tmpPos = this.buildingSelected.getLocalPosition();
    tmpPos.y += 1;
    this.moveBuilding(tmpPos);
    this.validateBuilding(this.buildingSelected);
    this.buildingSelected.activeShadow(true);
    this.buildingSelected.updateOpacity(0.5);
  }

  validateBuilding(brick) { 
    let formatData = this.buildingSelected.dataFormat;
    let haftCol = Math.floor(formatData[0].length / 2);
    let haftRow = Math.floor(formatData.length / 2);
    let colStart = brick.col - haftCol;
    let rowStart = brick.row - haftRow;
    let colEnd = brick.col + haftCol;
    let rowEnd = brick.row + haftRow;
    this.buildingSelected.rowStart = rowStart;
    this.buildingSelected.colStart = colStart;
    this.buildingSelected.rowEnd = rowEnd;
    this.buildingSelected.colEnd = colEnd;
    let length = formatData.length * formatData[0].length;
    let result = DataManager.checkMapDataIsValid(rowStart, rowEnd, colStart, colEnd, length);
    this.buildingSelected.updateShadow(result);
    this.buildingSelected.isValid = result;
  }
  
  onMapItemSelected(type) {
    this.mapItemSelected = type;
    if (this.mapItemSelected !== MapItemType.ROAD) {
      let data = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
      let index = DataManager.findPosition(DataManager.mapData, data);
      if (index.length > 0) {
        this.map.addBuilding(this.mapItemSelected, index[0], index[1]);
      } else {
        console.log("Map is full");
      }
    }
  }

  onMapSelected(type) {
    let data = null;
    if (type === MapItemType.Map1) {
      data = DataManager.map1;
    } else if (type === MapItemType.Map2) {
      data = DataManager.map2;
    }
    DataManager.resetMapData();
    DataManager.setMapData(JSON.parse(JSON.stringify(data)));
    this.map.generate();
  }
}