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
    this._initButton();
  }

  _initButton() {
    this.btnBlue = this._createButtonSelectColor("butonBlue", [0.6, 0.32, 0.6, 0.32], "blue")
    this.btnYellow = this._createButtonSelectColor("butonYellow", [0.48, 0.32, 0.48, 0.32], "yellow");
    this.btnRed = this._createButtonSelectColor("butonRed", [0.35, 0.32, 0.35, 0.32], "red");
    
  }

  _createButtonSelectColor(spriteAsset, anchor, type) {
    let button = new Entity();
    button.type = type;
    button.addComponent("element", {
        anchor: anchor,
        height: 50,
        pivot: [0.5, 0.5],
        type: ELEMENTTYPE_IMAGE,
        width: 50,
        useInput: true,
        spriteAsset : app.assets.find(spriteAsset)
    });
    this.addChild(button);
    button.element.on("click", () => {
      this.fire(SelectCarScreenEvent.ButtonColorClicked, type);
    });
    return button;
  } 
  
}