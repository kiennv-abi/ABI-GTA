import { Entity, Vec3 } from "playcanvas";
import { DataManager } from "../../data/dataManager";
import { Brick } from "./brick";
import { Road } from "./road";
import { Spawner } from "../../scripts/spawners/spawner";
import { Crossing } from "./crossing";
import { Building } from "./building";
import { MapItemType } from "../../ui/objects/mapItemUI";

export const MapItemCode = Object.freeze({
  Road: 1,
  Crossing: 2,
  Brick: 0,
  Building1: 3,
  Building2: 4,
  Building3: 5,
});
export class Map extends Entity{
  constructor() {
    super();
    this.col = DataManager.mapData.length - 1;
    this.row = DataManager.mapData[0].length - 1;
    this.gridUnit = DataManager.mapUnit;
    this.bricks = [];
    this.roads = [];
    this.buildings = [];
    this.crossings = [];
    this._initSpawners();
  }

  resetMap() {
    this.bricks = [];
    this.roads = [];
    this.crossings = [];
    this.buildings = [];
    for (let i = this.children.length - 1; i >= 0; i--) { 
      let child = this.children[i];
      if (child instanceof Brick || child instanceof Road || child instanceof Crossing || child instanceof Building) { 
        this.removeChild(child);
        child.destroy();
      }
    }
  }

  generate() {
    this.resetMap();
    for (let i = 0; i < DataManager.mapData.length; i++) {
      let row = DataManager.mapData[i];
      for (let j = 0; j < row.length; j++) {
        let obj = null;
        obj = this.brickSpawner.spawn();
        this.bricks.push(obj);
        obj.row = i;
        obj.col = j;
        obj.setLocalPosition(j * this.gridUnit, -0.1, i * this.gridUnit);
        this.addChild(obj);
      }
    }
    DataManager.replaceValue(MapItemCode.Crossing, MapItemCode.Road);
    let roadRowData = DataManager.getRowsWithTypes(DataManager.mapData, MapItemCode.Road);
    roadRowData.forEach(data => this.addRoad(data));
    let collRowData = DataManager.getColumnsWithTypes(DataManager.mapData, MapItemCode.Road);
    collRowData.forEach(data => this.addRoad(data));
    let building1Data = DataManager.findPositionArrayInArray(DataManager.mapData, DataManager.formatData.building1);
    if (building1Data.length > 0) {
      console.log(building1Data);
      building1Data.forEach(data => {
        this.addBuilding(MapItemType.BUILDING1, data[0], data[1]);
      });
    }
    let building2Data = DataManager.findPositionArrayInArray(DataManager.mapData, DataManager.formatData.building2);
    if (building2Data.length > 0) {
      console.log(building2Data);
      building2Data.forEach(data => {
        this.addBuilding(MapItemType.BUILDING2, data[0], data[1]);
      });
    }
    let building3Data = DataManager.findPositionArrayInArray(DataManager.mapData, DataManager.formatData.building3);
    if (building3Data.length > 0) {
      building3Data.forEach(data => {
        this.addBuilding(MapItemType.BUILDING3, data[0], data[1]);
      });
    }
    this.addCross();
  }

  addBuilding(buildingName, row, col) {
    let buildingSpawner = this.getBuildingSpawner(buildingName);
    let building = buildingSpawner.spawn();
    let dataFormat = building.dataFormat;
    let haftCol = Math.floor(dataFormat[0].length / 2);
    let haftRow = Math.floor(dataFormat.length / 2);
    building.rowStart = row - haftRow;
    building.colStart = col - haftCol;
    building.rowEnd = row + haftRow;
    building.colEnd = col + haftCol;
    building.col = col;
    building.row = row;
    DataManager.applyMapDataByStartAndEnd(building.rowStart, building.rowEnd, building.colStart, building.colEnd, dataFormat[0][0]);
    building.setLocalPosition(col * this.gridUnit, 0, row * this.gridUnit);
    this.buildings.push(building);
    this.addChild(building);
  }

  getBuildingSpawner(buildingName) { 
    if (buildingName === MapItemType.BUILDING1) { 
      return this.building1Spawner;
    } else if (buildingName === MapItemType.BUILDING2) { 
      return this.building2Spawner;
    } else if (buildingName === MapItemType.BUILDING3) { 
      return this.building3Spawner;
    }
  }

  addRoad(newData) {
    DataManager.applyMapDatas(newData, 1);
    newData.forEach((data) => { 
      let road = this.roadSpawner.spawn();
      road.row = data[0];
      road.col = data[1];
      road.setLocalPosition(data[1] * this.gridUnit, 0, data[0]* this.gridUnit);
      this.addChild(road);
      this.roads.push(road);
      let isHorizontal = this.detectRoadHorizontal(newData);
      if (isHorizontal) { 
        road.setLocalEulerAngles(0, 0, 0);
      } else {
        road.setLocalEulerAngles(0, 90, 0);
      }
    });
  }

  addCross() {
    let intersection = this.getIntersection(DataManager.mapData);
    this.replaceCrossRoad(intersection);
  }

  replaceCrossRoad(intersection) { 
    intersection.forEach(data => {
      let road = this.findRoadByRowAndCol(data.top.row, data.top.col);
      if (road) { 
        this.removeRoad(road);
        this.addCrossRoad(data.top, 90);
      }
      road = this.findRoadByRowAndCol(data.bottom.row, data.bottom.col);
      if (road) { 
        this.removeRoad(road);
        this.addCrossRoad(data.bottom, -90);
      }
      road = this.findRoadByRowAndCol(data.left.row, data.left.col);
      if (road) { 
        this.removeRoad(road);
        this.addCrossRoad(data.left, 0);
      }
      road = this.findRoadByRowAndCol(data.right.row, data.right.col);
      if (road) { 
        this.removeRoad(road);
        this.addCrossRoad(data.right, 0);
      }
    });
  }
  
  addCrossRoad(data, direction) { 
    let crossing = this.crossingSpawner.spawn();
    crossing.row = data.row;
    crossing.col = data.col;
    crossing.setLocalPosition(data.col * this.gridUnit, 0, data.row * this.gridUnit);
    this.addChild(crossing);
    crossing.setLocalEulerAngles(0, direction, 0);
    DataManager.applyMapData(data.row, data.col, MapItemCode.Crossing);
  }

  removeRoad(road) {
    road.destroy();
    this.roads.splice(this.roads.indexOf(road), 1);
    DataManager.applyMapData(road.row, road.col, MapItemCode.Brick);
  }

  detectRoadHorizontal(data) {
    let start = data[0];
    let end = data[data.length - 1];
    if(start[0] === end[0]) {
      return true;
    }
    return false;
  }

  getIntersection(matrix) {
    let result = [];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === MapItemCode.Road) {
          if (matrix[i][j + 1] === MapItemCode.Road && matrix[i][j - 1] === MapItemCode.Road && matrix[i + 1][j] === MapItemCode.Road && matrix[i - 1][j] === MapItemCode.Road) {
            let intersection = {};
            intersection.top = { row: i - 1, col: j };
            intersection.bottom = { row: i + 1, col: j };
            intersection.left = { row: i, col: j - 1 };
            intersection.right = { row: i, col: j + 1 };
            result.push(intersection);
          }
        }
      }
    }
    return result;
  }

  findRoadByRowAndCol(row, col) {
    for (let i = 0; i < this.roads.length; i++) {
      let road = this.roads[i];
      if (road.row === row && road.col === col) {
        return road;
      }
    }
    return null;
  }

  _initSpawners() {
    let roadSpawnerEntity = new Entity("road-spawner");
    this.addChild(roadSpawnerEntity);

    this.roadSpawner = roadSpawnerEntity.addScript(Spawner, {
      class: Road,
      poolSize: 10,
    });

    let brickSpawnerEntity = new Entity("brick-spawner");
    this.addChild(brickSpawnerEntity);

    this.brickSpawner = brickSpawnerEntity.addScript(Spawner, {
      class: Brick,
      poolSize: 10,
      callback: () => {
        this.generate();
      }
    });

    let crossingSpawnerEntity = new Entity("brick-spawner");
    this.addChild(crossingSpawnerEntity);

    this.crossingSpawner = crossingSpawnerEntity.addScript(Spawner, {
      class: Crossing,
      poolSize: 10,
    });

    let building1Entity = new Entity("brick-spawner");
    this.addChild(building1Entity);

    this.building1Spawner = building1Entity.addScript(Spawner, {
      class: Building,
      poolSize: 10,
      args: ["model_building_1", new Vec3(17, 40, 17), DataManager.formatData.building1, {
        type: "plane",
        size: new Vec3(16, 1, 16),
        pos: new Vec3(0, -0.1, 0),
      }],
    });

    let building2Entity = new Entity("brick-spawner");
    this.addChild(building2Entity);

    this.building2Spawner = building2Entity.addScript(Spawner, {
      class: Building,
      poolSize: 10,
      args: ["model_building_2", new Vec3(8, 10, 8), DataManager.formatData.building2, {
        type: "plane",
        size: new Vec3(8, 1, 8),
        pos: new Vec3(0, -0.1, 0),
      }],
    });

    let building3Entity = new Entity("brick-spawner");
    this.addChild(building3Entity);

    this.building3Spawner = building3Entity.addScript(Spawner, {
      class: Building,
      poolSize: 10,
      args: ["model_building_3", new Vec3(17, 45, 17), DataManager.formatData.building3, {
        type: "sphere",
        size: new Vec3(16, 1, 16),
        pos: new Vec3(0, -0.1, 0),
      }],
    });
  }
}