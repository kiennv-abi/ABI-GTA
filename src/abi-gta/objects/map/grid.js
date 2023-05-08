import { Entity } from "playcanvas";
import { Brick } from "./brick";
import { DataManager } from "../../data/dataManager";
export class Grid extends Entity{
  constructor() {
    super("grid");
    this.col = DataManager.mapData.length - 1;
    this.row = DataManager.mapData[0].length - 1;
    this.gridUnit = DataManager.mapUnit;
    this.bricks = [];
    this.generateGrid();
  }

  generateGrid() { 
    for (let i = 0; i < DataManager.mapData.length; i++) {
      let row = DataManager.mapData[i];
      for (let j = 0; j < row.length; j++) {
        let tile = row[j];
        if (tile === 0) {
          let brick = new Brick();
          brick.row = j;
          brick.col = i;
          brick.setLocalPosition(i * this.gridUnit, 0, j * this.gridUnit);
          this.addChild(brick);
          this.bricks.push(brick);
        }
      }
    }
  }
}