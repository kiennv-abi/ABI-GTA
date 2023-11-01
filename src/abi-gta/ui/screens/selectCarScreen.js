import { Color, ELEMENTTYPE_GROUP, ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Entity, Texture, Vec2, Vec3, Vec4, log, app } from "playcanvas";
import { UIScreen } from "../../../template/ui/uiScreen";
import { GameConstant } from "../../../gameConstant";

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

  }

  _initButtonSelectColor() {
    this.btnBlue = this._createButtonSelectColor("butonBlue", [0.6, 0.32, 0.6, 0.32], "blue")
    this.btnYellow = this._createButtonSelectColor("butonYellow", [0.48, 0.32, 0.48, 0.32], "yellow");
    this.btnRed = this._createButtonSelectColor("butonRed", [0.35, 0.32, 0.35, 0.32], "red");
  }

  _initButtonSelectCar() {
    this.butonSelectCarPolice = this._createButtonSelectCar("carPolice", [0.9, 0.65, 0.9, 0.65], "CarPolice");
    this.butonSelectCarMuscle = this._createButtonSelectCar("carMuscar", [0.9, 0.5, 0.9, 0.5], "CarMuscle");
  }

  _createButtonSelectColor(spriteAsset, anchor, type) {
    let butonSelectColor = new Entity();
    butonSelectColor.type = type;
    butonSelectColor.addComponent("element", {
        anchor: anchor,
        height: 70,
        pivot: [0.5, 0.5],
        type: ELEMENTTYPE_IMAGE,
        width: 70,
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
}