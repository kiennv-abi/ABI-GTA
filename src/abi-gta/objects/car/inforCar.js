import { Color, ELEMENTTYPE_TEXT, Entity, Vec2, Vec4 } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Car } from "./car";

export class InforCar extends Entity{
    constructor(anchor){
        super();
        this._initInforCar(anchor);
    }
    _initInforCar(anchor) {
        let font = AssetLoader.getAssetByKey("CanvasFont");
        this.speed = new Entity();
        this.addChild(this.speed);
        this.speed.addComponent("element", {
          pivot: new Vec2(0.5, 0.5),
          anchor: anchor,
          fontAsset: font,
          text: "text",
          fontSize: 10,
          type: ELEMENTTYPE_TEXT,
          alignment : new Vec2(0.5, 0.5),
          color: new Color( 0, 0, 0),
          enabled: true
        })
      }

    
}