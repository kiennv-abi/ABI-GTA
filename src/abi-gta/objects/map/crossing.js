import { Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";

export class Crossing extends Entity {
  constructor() {
    super("cross");
    this.addComponent("model", { asset: AssetLoader.getAssetByKey("model_crossing") });
    this.setLocalScale(1, 1, 0.5);
  }
}