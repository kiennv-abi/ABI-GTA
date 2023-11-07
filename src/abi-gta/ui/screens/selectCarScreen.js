import { Color, ELEMENTTYPE_GROUP, ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Entity, Texture, Vec2, Vec3, Vec4, log, app, type, TextHandler } from "playcanvas";
import { UIScreen } from "../../../template/ui/uiScreen";
import { GameConstant } from "../../../gameConstant";
import { AssetLoader } from "../../../assetLoader/assetLoader";


export const SelectCarScreenEvent = Object.freeze({
  ButtonCarClicked: "clicked",
  ButtonColorClicked: "buttonColor:clicked",
  ButtonPlayClicked: "buttonPlay:clicked",
});

export class SelectCarScreen extends UIScreen{
  constructor() {
    super(GameConstant.SCREEN_SELECT_CAR);
    this._initButtonSelectColor();
    this._initButtonSelectCar();
    this._createBackGroundInforCar();
    this._createSelectCar()
    this._initInfor();
    
  }

  _initButtonSelectColor() {
    this.btnBlue = this._createButtonSelectColor("butonBlue", [0.55, 0.1, 0.55, 0.1], "blue")
    this.btnYellow = this._createButtonSelectColor("butonYellow", [0.48, 0.15, 0.48, 0.15], "orange");
    this.btnRed = this._createButtonSelectColor("butonRed", [0.4, 0.1, 0.4, 0.1], "red");
    this.btnWhite = this._createButtonSelectColor("butonWhite", [0.48, 0.05, 0.48, 0.05],"white");
  }

  _initButtonSelectCar() {
    this.butonSelectCarPolice = this._createButtonSelectCar("carPolice", [0.9, 0.65, 0.9, 0.65], "CarPolice");
    this.butonSelectCarMuscle = this._createButtonSelectCar("carMuscar", [0.9, 0.5, 0.9, 0.5], "CarMuscle");
  }
  
  changeInfor(speed, handle) {
    this.speed.element.text = `Speed : ${speed}`;
    this.handle.element.text = `Handle : ${handle}`;
  }

  _initInfor() {
    this.speed = this._createInfor("Speed : 100", new Vec4(0.1, 0.85, 0.1, 0.85));
    this.handle = this._createInfor("Handle : 50", new Vec4(0.1, 0.75, 0.1, 0.75));
  }

  _createInfor(text, anchor) {
    let font = AssetLoader.getAssetByKey("CanvasFont");
    let infor = new Entity();
    infor.addComponent("element", {
      pivot: new Vec2(0.5, 0.5),
      anchor: anchor,
      fontAsset: font,
      text: text,
      fontSize: 20,
      type: ELEMENTTYPE_TEXT,
      alignment : new Vec2(0.5, 0.5),
      color: new Color( 0, 0, 0),
      enabled: true
    })
    this.addChild(infor);
    return infor;
  }

  _createBackGroundInforCar(){
    this.bgInforcar = new Entity();
    this.bgInforcar.addComponent("element", {
      anchor: [0.092, 0.867, 0.092, 0.867],
      pivot: [0.5, 0.5],
      type: ELEMENTTYPE_IMAGE,
      width: 200,
      height: 200,
      spriteAsset: app.assets.find("backGroundInforCar")
    })
    this.addChild(this.bgInforcar);

    this.textInforCar = new Entity();
    let font = AssetLoader.getAssetByKey("CanvasFont")
    this.textInforCar.addComponent("element", {
      anchor: new Vec4(0.08, 0.95, 0.08, 0.95),
      pivot: new Vec2(0.5, 0.5),
      fontAsset: font,
      text: "INFOR CAR",
      type: ELEMENTTYPE_TEXT,
      fontSize: 25,
      color: new Color(0, 0, 0)
    }) 
    this.addChild(this.textInforCar)

    this.sprSpeed = new Entity();
    this.sprSpeed.addComponent("element", {
      anchor: [0.03, 0.867, 0.03, 0.867],
      pivot: [0.5, 0.5],
      type: ELEMENTTYPE_IMAGE,
      spriteAsset: app.assets.find("spr_speed"),
      width: 35,
      height: 35
    })
    this.addChild(this.sprSpeed);

    this.sprHandle = new Entity();
    this.sprHandle.addComponent("element", {
      anchor: [0.03, 0.769, 0.03, 0.769],
      pivot: [0.5, 0.5],
      type: ELEMENTTYPE_IMAGE,
      spriteAsset: app.assets.find("spr_handle"),
      width: 35,
      height: 35
    })
    this.addChild(this.sprHandle);
   }
 
  _createButtonSelectColor(spriteAsset, anchor, type) {
    let butonSelectColor = new Entity();
    butonSelectColor.type = type;
    butonSelectColor.addComponent("element", {
        anchor: anchor,
        height: 55,
        pivot: [0.5, 0.5],
        type: ELEMENTTYPE_IMAGE,
        width: 55,
        useInput: true,
        spriteAsset : app.assets.find(spriteAsset)
    });
    this.addChild(butonSelectColor);
    butonSelectColor.element.on("click", () => {
      this.fire(SelectCarScreenEvent.ButtonColorClicked, type);
    });
    return butonSelectColor;
  } 
  _createButtonSelectCar(spriteAsset, anchor, type) {
    let butonSelectCar = new Entity();
    butonSelectCar.addComponent("element", {
      anchor: anchor,
      height: 100,
      pivot: [0.5, 0.5],
      type: ELEMENTTYPE_IMAGE,
      width: 200,
      useInput: true,
      spriteAsset: app.assets.find(spriteAsset)
    });
    this.addChild(butonSelectCar);
    butonSelectCar.element.on("click", () =>{
      this.fire(SelectCarScreenEvent.ButtonCarClicked, type)
    });
    return butonSelectCar;
   }

  _createSelectCar() {
    this.selectCar = new Entity();
    this.selectCar.addComponent("element", {
      anchor: [0.5, 0.93, 0.5, 0.93],
      pivot: [0.5, 0.5],
      width: 700,
      height: 100,
      type: ELEMENTTYPE_IMAGE,
      spriteAsset: app.assets.find("spr_selectCar")
    })
    this.addChild(this.selectCar)
   }
   
}