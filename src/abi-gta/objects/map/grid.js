import { Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { DataManager } from "../../data/dataManager";
import { Brick } from "./brick";
import mapData from "/assets/jsons/mapData.json"
export class Grid extends Entity{
  constructor() {
    super("grid");
    DataManager.init();
    this.col = DataManager.mapData.length - 1;
    this.row = DataManager.mapData[0].length - 1;
    this.gridUnit = DataManager.mapUnit;
    this.bricks = [];
    this.generateGrid();
  }

  generateGrid() { 
    for(let i = 0; i < this.data.length; i++){
      let row = this.data[i];
      for(let j = 0; j < row.length; j++){
        let tile = row[j];
        if(tile === 0){
          let tileEntity = new Entity();
          tileEntity.addComponent( "model", {
            asset : AssetLoader.getAssetByKey("model_sidewalk")
          })
          tileEntity.setLocalPosition(i * mapData.unit, 0, j * mapData.unit);
          this.addChild(tileEntity);
        }
      }
    }
  }
}