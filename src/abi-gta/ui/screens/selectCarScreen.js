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
    this._initSprInfor()
    this._initProgressBar();
    this._createSelectCar();
    this._initTextInfor();
    this._createButtonPlay();
  }

  _initButtonSelectColor() {
    this.btnBlue = this._createButtonSelectColor("butonBlue", [0.55, 0.1, 0.55, 0.1], "blue", 55, 55)
    this.btnYellow = this._createButtonSelectColor("butonYellow", [0.48, 0.15, 0.48, 0.15], "orange", 55, 55);
    this.btnRed = this._createButtonSelectColor("butonRed", [0.4, 0.1, 0.4, 0.1], "red", 55, 55);
    this.btnWhite = this._createButtonSelectColor("butonWhite", [0.48, 0.05, 0.48, 0.05],"white", 50, 50);
  }

  _initButtonSelectCar() {
    this.butonSelectCarPolice = this._createButtonSelectCar("carPolice", [0.9, 0.65, 0.9, 0.65], "CarPolice");
    this.butonSelectCarMuscle = this._createButtonSelectCar("carMuscar", [0.9, 0.5, 0.9, 0.5], "CarMuscle");
  }
  
  changeProgressBar(speed, handle) {
    this.speed.element.width = speed;
    this.handle.element.width = handle;
  }

  _initProgressBar() {
    this.speed = this._createProgressBar(120, new Vec4(0.05, 0.86, 0.05, 0.86));
    this.handle = this._createProgressBar(80, new Vec4(0.05, 0.76, 0.05, 0.76));
  }
  
  _initTextInfor() {
    this.textInfor = this._createTextInforCar("INFOR CAR", new Vec4(0.08, 0.95, 0.08, 0.95), 25);
    this.textSpeed = this._createTextInforCar("Speed", new Vec4(0.06, 0.873, 0.06, 0.873), 15);
    this.textHandle = this._createTextInforCar("Handle", new Vec4(0.06, 0.774, 0.06, 0.774), 15)
  }

  _initSprInfor() {
    this.bgInfor = this._createSprInforCar([0.092, 0.867, 0.092, 0.867],"backGroundInforCar", 200, 200);
    this.sprSpeed = this._createSprInforCar([0.03, 0.873, 0.03, 0.873],"spr_speed", 35, 35);
    this.sprHandle = this._createSprInforCar([0.03, 0.774, 0.03, 0.774],"spr_handle", 35, 35)
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

  _createProgressBar(width, anchor) {
    let progressBar = new Entity();
    progressBar.addComponent("element", {
      // pivot: [0.5, 0.5],
      anchor: anchor,
      type: ELEMENTTYPE_IMAGE,
      enabled: true,
      width: width,
      height: 20,
      spriteAsset: app.assets.find("spr_ progressBar")
    })
    this.addChild(progressBar);
    return progressBar;
  }

  _createSprInforCar(anchor, spriteAsset, width, height){
    this.sprInforcar = new Entity();
    this.sprInforcar.addComponent("element", {
      anchor: anchor,
      pivot: [0.5, 0.5],
      type: ELEMENTTYPE_IMAGE,
      width: width,
      height: height,
      spriteAsset: app.assets.find(spriteAsset)
    })
    this.addChild(this.sprInforcar);
  }

  _createTextInforCar(text, anchor, size) {
    this.textInforCar = new Entity();
    let font = AssetLoader.getAssetByKey("CanvasFont")
    this.textInforCar.addComponent("element", {
      anchor: anchor,
      pivot: new Vec2(0.5, 0.5),
      fontAsset: font,
      text: text,
      type: ELEMENTTYPE_TEXT,
      fontSize: size,
      color: new Color(0, 0, 0)
    }) 
    this.addChild(this.textInforCar)
   }
 
  _createButtonSelectColor(spriteAsset, anchor, type, width, height) {
    let butonSelectColor = new Entity();
    butonSelectColor.type = type;
    butonSelectColor.addComponent("element", {
        anchor: anchor,
        height: height,
        pivot: [0.5, 0.5],
        type: ELEMENTTYPE_IMAGE,
        width: width,
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
   _createButtonPlay() {
    let buttonPlay = new Entity();
    buttonPlay.addComponent("element", {
      anchor: [0.85, 0.1, 0.85, 0.1],
      height: 400,
      pivot: [0.5, 0.5],
      width: 400,
      type: ELEMENTTYPE_IMAGE,
      useInput: true,
      spriteAsset: app.assets.find("butonPlay")
    });
    this.addChild(buttonPlay);

    buttonPlay.element.on("click", () => {
      this.fire(SelectCarScreenEvent.ButtonPlayClicked)
    })
   }
}