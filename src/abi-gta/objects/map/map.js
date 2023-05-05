import { Entity, Vec3 } from "playcanvas";
import { Grid } from "./grid";
import mapData from "../../../../assets/jsons/mapData.json";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { CastBox } from "../../scripts/raycast/castBox";
import { GameConstant } from "../../../gameConstant";

export class Map extends Entity{
  constructor() {
    super();
    this.grid = new Grid();
    this.addChild(this.grid);

    this.groundBox = new Entity();
    this.addChild(this.groundBox);
    this.groundBox.setLocalPosition(this.grid.row * this.grid.gridUnit / 2, 0, this.grid.col * this.grid.gridUnit / 2);
    this.groundBox.addScript(CastBox, {
      scale: new Vec3(100, 1, 100),
      render: GameConstant.DEBUG_ON,
    });
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