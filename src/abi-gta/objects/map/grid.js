import { Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Brick } from "./brick";
import mapData from "/assets/jsons/mapData.json"
export class Grid extends Entity{
  constructor() {
    super("grid");
    this.data = mapData.mapData;
    this.col = 
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