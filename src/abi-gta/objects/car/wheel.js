import { app, Entity } from "playcanvas";

export class Wheel extends Entity{
    constructor(type){
        super();
        this._init(type);
    }
    _init(type) {
        let assetWheel = app.assets.find(type);
        this.wheel = new Entity();
        this.wheel.addComponent("model", {
            type: "asset",
            asset: assetWheel,
        })
        this.addChild(this.wheel)
    }
}

