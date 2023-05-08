import { Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";

export class Road extends Entity {
  constructor() {
    super("road");
    this.addComponent("model", { asset: AssetLoader.getAssetByKey("model_road") });
    this.setLocalScale(1, 1, 0.5);
  }
}