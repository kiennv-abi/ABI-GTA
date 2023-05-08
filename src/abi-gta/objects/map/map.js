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
});
export class Map extends Entity{
  constructor() {
    super();
    DataManager.init();
    this.col = DataManager.mapData.length - 1;
    this.row = DataManager.mapData[0].length - 1;
    this.gridUnit = DataManager.mapUnit;
    this.bricks = [];
    this.roads = [];
    this.buildings = [];
    this._initSpawners();
  }

  generate() {
    for (let i = 0; i < DataManager.mapData.length; i++) {
      let row = DataManager.mapData[i];
      for (let j = 0; j < row.length; j++) {
        let tile = row[j];
        if (tile === MapItemCode.Brick) {
          let brick = this.brickSpawner.spawn();
          brick.row = j;
          brick.col = i;
          brick.setLocalPosition(i * this.gridUnit, -0.1, j * this.gridUnit);
          this.addChild(brick);
          this.bricks.push(brick);
        }
      }
    }
  }

  addBuilding(buildingName) {
    let buildingSpawner = this.getBuildingSpawner(buildingName);
    let building = buildingSpawner.spawn();
    building.setLocalPosition(0, 0, 0);
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
      road.row = data.row;
      road.col = data.col;
      road.setLocalPosition(data.col * this.gridUnit, 0, data.row * this.gridUnit);
      this.addChild(road);
      this.roads.push(road);
      let isHorizontal = this.detectRoadHorizontal(newData);
      if (isHorizontal) { 
        road.setLocalEulerAngles(0, 0, 0);
      } else {
        road.setLocalEulerAngles(0, 90, 0);
      }
    });
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
    if(start.row === end.row) {
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
      args: ["model_building_1", new Vec3(17, 40, 17)],
    });

    let building2Entity = new Entity("brick-spawner");
    this.addChild(building2Entity);

    this.building2Spawner = building2Entity.addScript(Spawner, {
      class: Building,
      poolSize: 10,
      args: ["model_building_2", new Vec3(8, 10, 8)],
    });

    let building3Entity = new Entity("brick-spawner");
    this.addChild(building3Entity);

    this.building3Spawner = building3Entity.addScript(Spawner, {
      class: Building,
      poolSize: 10,
      args: ["model_building_3", new Vec3(17, 45, 17)],
    });
  }
}