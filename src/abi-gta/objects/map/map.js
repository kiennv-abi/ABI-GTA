import { Entity, Vec3 } from "playcanvas";
import { DataManager } from "../../data/dataManager";
import { Brick } from "./brick";
import { Road } from "./road";

export class Map extends Entity{
  constructor() {
    super();
    DataManager.init();
    this.col = DataManager.mapData.length - 1;
    this.row = DataManager.mapData[0].length - 1;
    this.gridUnit = DataManager.mapUnit;
    this.bricks = [];
    this.roads = [];
    this.generate();
  }

  generate() {
    for(let i = 0; i < DataManager.mapData.length; i++ ) {
      let row = DataManager.mapData[i];
      for(let j = 0; j < row.length; j++){
        let tile = row[j];
        if( tile === 0){
          let brick = new Brick()
          brick.setLocalPosition(i * this.gridUnit, 0 , j * this.gridUnit)
          this.addChild(brick);
          this.bricks.push(brick);
        }
      }
    }
  }

  addRoad(newData) {
    newData.forEach((data) => {
      let road = new Road();
      road.row = data.row;
      road.col = data.col;
      road.setLocalPosition(data.col * this.gridUnit, 0, data.row * this.gridUnit)
      this.addChild(road);
      this.roads.push(road);     
    });
  }
}