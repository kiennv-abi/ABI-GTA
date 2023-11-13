import { Entity, Vec3 } from "playcanvas";
import { Brick } from "./brick";
import { Building } from "./building";
import { Crossing } from "./crossing";
import { Grid } from "./grid";
import { Road } from "./road";
import { mapData } from "/assets/jsons/map1Data.json";


export class Map extends Entity{
  constructor() {
    super();
    this.grid = new Grid();
    this.addChild(this.grid);
  }

}