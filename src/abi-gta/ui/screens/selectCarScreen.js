import { Color, ELEMENTTYPE_GROUP, ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Entity, Texture, Vec2, Vec3, Vec4, log, app, type, TextHandler } from "playcanvas";
import { UIScreen } from "../../../template/ui/uiScreen";
import { GameConstant } from "../../../gameConstant";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { InforCar } from "../../objects/car/inforCar";

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
    this._createTextSelectCar();
    this._initInfor();
  }

  _initButtonSelectColor() {
    this.btnBlue = this._createButtonSelectColor("butonBlue", [0.55, 0.1, 0.55, 0.1], "blue")
    this.btnYellow = this._createButtonSelectColor("butonYellow", [0.48, 0.15, 0.48, 0.15], "yellow");
    this.btnRed = this._createButtonSelectColor("butonRed", [0.4, 0.1, 0.4, 0.1], "red");
    this.btnWhite = this._createButtonSelectColor("butonWhite", [0.48, 0.05, 0.48, 0.05],"white");
  }

  _initButtonSelectCar() {
    this.butonSelectCarPolice = this._createButtonSelectCar("carPolice", [0.9, 0.65, 0.9, 0.65], "CarPolice");
    this.butonSelectCarMuscle = this._createButtonSelectCar("carMuscar", [0.9, 0.5, 0.9, 0.5], "CarMuscle");
  }
  
  changeInfor(speed, handle) {
    this.speed.element.text = `Speed ${speed}`;
    this.handle.element.text = `Handle ${handle}`;
  }

  _initInfor() {
    this.speed = this._createInfor("Speed", new Vec4(0.05, 0.8, 0.05, 0.8));
    this.handle = this._createInfor("Handle", new Vec4(0.05, 0.7, 0.05, 0.7));
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
      anchor : anchor,
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

   _createTextSelectCar() {
    let textSelecCar = new Entity();
    let font = AssetLoader.getAssetByKey("CanvasFont");
    textSelecCar.addComponent("element", {
      pivot: new Vec2(0.5, 0.5),
      anchor: new Vec4(0.5, 0.9, 0.5, 0.9),
      fontAsset: font,
      text: "SelectCar",
      fontSize: 70,
      type: ELEMENTTYPE_TEXT,
      alignment : new Vec2(0.5, 0.5),
      color: new Color(0, 0, 0),
      outlineColor: new Color(1, 1, 1),
      outlineThickness: 0.75,
    })
    this.addChild(textSelecCar);
   }
   
}