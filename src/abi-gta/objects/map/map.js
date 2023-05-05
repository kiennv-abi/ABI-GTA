import { Entity } from "playcanvas";
import { Grid } from "./grid";
import mapData from "../../../../assets/jsons/mapData.json";
import { AssetLoader } from "../../../assetLoader/assetLoader";

export class Map extends Entity{
  constructor() {
    super();
    this.grid = new Grid();
    this.addChild(this.grid);
  }

  _initOcean() {
    for (let i = 0; i < mapData.oceanData.length; i++) {
      let row = mapData.oceanData[i];
      for (let j = 0; j < row.length; j++) {
        let tile = row[j];
        if (tile === 0) {
          let tileEntity = new Entity("tile");
          tileEntity.addComponent("model", { asset: AssetLoader.getAssetByKey("model_ocean") });
          tileEntity.setLocalPosition(j * mapData.oceanUnit, -1, i * mapData.oceanUnit);
          this.addChild(tileEntity);
        }
      }
    }
  }
}