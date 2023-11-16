import { Entity } from "playcanvas";
import { DataManager } from "../../data/dataManager";
import { Brick } from "./brick";
import { Road } from "./road";
import { Spawner } from "../../scripts/spawners/spawner";
import { Crossing } from "./crossing";

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
          brick.setLocalPosition(i * this.gridUnit, -0.5, j * this.gridUnit);
          this.addChild(brick);
          this.bricks.push(brick);
        }
      }
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
    console.log(DataManager.mapData);
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
  }
}