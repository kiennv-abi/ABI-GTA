import { Entity, Vec3 } from "playcanvas";
import { Brick } from "./brick";
import { Building } from "./building";
import { Crossing } from "./crossing";
import { Road } from "./road";
import { mapData } from "/assets/jsons/map1Data.json";

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
    this._initBrick();
    // this._initRoad();
  }

  _initBrick() {
    for(let i = 0; i < mapData.length; i++) {
      for(let j = 0; j < mapData[i].length; j++) {
        if(mapData[i][j] === 0) {
          this.brick = new Brick();
          this.addChild(this.brick)
          this.brick.setLocalPosition(i * 5, 0 ,j * 5)
        }
      }
    }
  }

  _initRoad() {
    for(let i = 0; i < mapData.length; i++) {
      for(let j = 0; j < mapData[i].length; j++) {
        if(mapData[i][j] === 1) {
          this.road = new Road();
          this.addChild(this.road)
          this.road.setLocalPosition(i * 5, 0 ,j * 5)
        }
      }
    }
  }

  _initCrossing() {
    for(let i = 0; i < mapData.length; i++) {
      for(let j = 0; j < mapData[i].length; j++) {
        if(mapData[i][j] === 2) {
          this.cross = new Crossing();
          this.addChild(this.cross)
          this.cross.setLocalPosition(i * 5, 0 ,j * 5)
        }
      }
    }
  }

  _initBuilding() {
    for(let i = 0; i < mapData.length; i++) {
      for(let j = 0; j < mapData[i].length; j++) {
        if(mapData[i][j] === 4) {
          this.building = new Building();
          this.addChild(this.building)
          this.building.setLocalPosition(i * 5, 0 ,j * 5)
        }
      }
    }
  }
}