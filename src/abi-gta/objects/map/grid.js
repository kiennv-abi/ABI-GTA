import { Entity } from "playcanvas";
import mapData from "../../../../assets/jsons/mapData.json";
import { AssetLoader } from "../../../assetLoader/assetLoader";
export class Grid extends Entity{
  constructor() {
    super("grid");
    this.generateGrid();
  }

  generateGrid(data = mapData.mapData) { 
    for (let i = 0; i < data.length; i++) {
      let row = data[i];
      for (let j = 0; j < row.length; j++) {
        let tile = row[j];
        if (tile === 0) {
          let tileEntity = new Entity("tile");
          tileEntity.addComponent("model", { asset: AssetLoader.getAssetByKey("model_sidewalk") });
          tileEntity.setLocalPosition(j * mapData.unit, 0, i * mapData.unit);
          this.addChild(tileEntity);
        }
      }
    }
  }
}