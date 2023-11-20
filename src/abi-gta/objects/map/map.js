import { Entity, math, Vec3 } from "playcanvas";
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

  addBuilding(buildingName, row, col) {
    let buildingSpawner = this.getBuildingSpawner(buildingName);
    let building = buildingSpawner.spawn();
    let dataFormat = building.dataFormat;
    let haftCol = Math.floor(dataFormat[0].length / 2);
    let haftRow = Math.floor(dataFormat.length / 2);
    building.rowStar = row - haftRow;
    building.rowEnd = row + haftRow;
    building.colStart = col - haftCol;
    building.colEnd = col + haftCol;
    building.col = col;
    building.row = row;
    DataManager.applyMapDataByStartAndEnd(building.rowStar, building.rowEnd, building.colStart, building.colEnd, dataFormat[0][0]);
    building.setLocalPosition(row * this.gridUnit, 0, col * this.gridUnit);
    this.buildings.push(building);
    this.addChild(building)
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

  findSubarrayIndexes(arr1, arr2) {
    const row1 = arr1.length;
    const col1 = arr1[0].length;
    const row2 = arr2.length;
    const col2 = arr2[0].length;
    const indexes = [];

    for (let i = 0; i <= row1 - row2; i++) {
      for (let j = 0; j <= col1 - col2; j++) {
        let found = true;
        for (let k = 0; k < row2; k++) {
          for (let l = 0; l < col2; l++) {
            if (arr2[k][l] !== arr1[i + k][j + l]) {
              found = false;
              break;
            }
          }
          if (!found) break;
        }
        if (found) {
          indexes.push([i, j]);
        }
      }
    }

    return indexes;
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
        size: new Vec3(22, 1, 22),
        pos: new Vec3(0, -0.1, 0),
      }],
    });
  }
}