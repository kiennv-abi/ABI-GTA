import { Color, ELEMENTTYPE_GROUP, ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Entity, Texture, Vec2, Vec3, Vec4, log } from "playcanvas";
import { UIScreen } from "../../../template/ui/uiScreen";
import { Button } from "../core/button";
import { GameConstant } from "../../../gameConstant";
import { CarColorCode, CarType } from "../../objects/car/car";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { Util } from "../../../helpers/util";

export const SelectCarScreenEvent = Object.freeze({
  ButtonCarClicked: "clicked",
  ButtonColorClicked: "buttonColor:clicked",
  ButtonPlayClicked: "buttonPlay:clicked",
});

export class SelectCarScreen extends UIScreen{
  constructor() {
    super(GameConstant.SCREEN_SELECT_CAR);
    this.muscleCarBtn = new Button({
      anchor: new Vec4(0.3, 0.2, 0.3, 0.2),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4()
    })
    this.addChild(this.muscleCarBtn);
    this.muscleCarBtn.text.element.text = "Muscle";
    this.muscleCarBtn.button.on("click", () => {
      this.carSelected = CarType.MuscleCar;
      this.fire(SelectCarScreenEvent.ButtonCarClicked, CarType.MuscleCar);
    });

    this.policeCarBtn = new Button({
      anchor: new Vec4(0.7, 0.2, 0.7, 0.2),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4()
    })
    this.addChild(this.policeCarBtn);
    this.policeCarBtn.text.element.text = "Police";
    this.policeCarBtn.button.on("click", () => {
      this.carSelected = CarType.PoliceCar;
      this.fire(SelectCarScreenEvent.ButtonCarClicked, CarType.PoliceCar);
    });
    this.carSelected = CarType.MuscleCar;
    this._initPanelDetail();
    this._initColorButtons();
    this._initButtonPlay();
  }

  _initButtonPlay() {
    this.buttonPlay = new Button({
      anchor: new Vec4(1, 1, 1, 1),
      pivot: new Vec2(1, 1),
      margin: new Vec4(),
      width: 200,
      height: 100,
    });
    this.buttonPlay.text.element.text = "Play";
    this.buttonPlay.setLocalPosition(-20, -20, 0);
    this.addChild(this.buttonPlay);

    this.buttonPlay.button.on("click", () => { 
      this.fire(SelectCarScreenEvent.ButtonPlayClicked, this.carSelected, this.colorSelected ? this.colorSelected : CarColorCode.Color1);
    });
  }

  _initColorButtons() {
    this.options = [];
    this.redBtn = this._createColorButton(Util.createColor(255, 0, 0), new Vec3(30, -30, 0), CarColorCode.Color1);
    this.panelBg.addChild(this.redBtn);

    this.greenBtn = this._createColorButton(Util.createColor(0, 255, 0), new Vec3(80, -30, 0), CarColorCode.Color2);
    this.panelBg.addChild(this.greenBtn);

    this.blueBtn = this._createColorButton(Util.createColor(0, 0, 255), new Vec3(130, -30, 0), CarColorCode.Color3);
    this.panelBg.addChild(this.blueBtn);
  }
  
  updateSpecifics(data, colorCode) {
    this.titleText.element.text = data.Name;
    this.accelerationSpec.updateValue(data.Acceleration.value, data.Acceleration.maxValue, data.Acceleration.currentValue);
    this.topSpeedSpec.updateValue(data.TopSpeed.value, data.TopSpeed.maxValue, data.TopSpeed.currentValue);
    this.handlingSpec.updateValue(data.Handling.value, data.Handling.maxValue, data.Handling.currentValue);
    this.nitroSpec.updateValue(data.Nitro.value, data.Nitro.maxValue, data.Nitro.currentValue);
    this.redBtn.element.color = data.Colors.Color1;
    this.greenBtn.element.color = data.Colors.Color2;
    this.blueBtn.element.color = data.Colors.Color3;
    this.disableAllStrokeOfColor();
    this.options[colorCode - 1].stroke.enabled = true;
  }

  disableAllStrokeOfColor() {
    this.options.forEach(btn => {
      btn.stroke.enabled = false;
    });
  }

  _initPanelDetail() {
    this.panelBg = ObjectFactory.createImageElement("spr_dark", {
      height: 250,
      width: 600,
      opacity: 0.2,
      anchor: new Vec4(0, 1, 0, 1),
      pivot: new Vec2(0, 1),
    });
    this.panelBg.element.color = Util.createColor(0, 0, 0);
    this.addChild(this.panelBg);
    
    this.titleText = this._createText("Muscle", 26, new Vec3(0, 80, 0));
    this.panelBg.addChild(this.titleText);

    this.accelerationSpec = this._createRaceCarSpecs("ACCELERATION", "4.20s", 230, 190, new Vec3(0, 30, 0));
    this.panelBg.addChild(this.accelerationSpec);
    this.topSpeedSpec = this._createRaceCarSpecs("TOP SPEED", "200 km/h", 200, 180, new Vec3(0, -10, 0));
    this.panelBg.addChild(this.topSpeedSpec);
    this.handlingSpec = this._createRaceCarSpecs("HANDLING", "1.200 Gs", 220, 170, new Vec3(0, -50, 0));
    this.panelBg.addChild(this.handlingSpec);
    this.nitroSpec = this._createRaceCarSpecs("NITRO", "37 km/h", 250, 200, new Vec3(0, -90, 0));
    this.panelBg.addChild(this.nitroSpec);
  }

  _createColorButton(color, pos = new Vec3(), type) {
    let colorButton = ObjectFactory.createImageElement("spr_dark", {
      height: 30,
      width: 30,
      opacity: 1,
      anchor: new Vec4(0, 1, 0, 1),
      pivot: new Vec2(0, 1),
    });
    colorButton.element.useInput = true;
    colorButton.element.on("click", () => {
      this.fire(SelectCarScreenEvent.ButtonColorClicked, this.carSelected, type);
      this.disableAllStrokeOfColor();
      colorButton.stroke.enabled = true;
      this.colorSelected = type;
    });
    colorButton.element.color = color;
    colorButton.setLocalPosition(pos);
    let stroke = ObjectFactory.createImageElement("spr_stroke", {
      height: 30, 
      width: 30,
      pivot: new Vec2(0.5, 0.5),
    });
    stroke.enabled = false;
    colorButton.stroke = stroke;
    colorButton.addChild(stroke);
    this.options.push(colorButton);
    return colorButton;
  }

  _createText(text, fontSize = 18, pos = new Vec3()) { 
    let font = AssetLoader.getAssetByKey("CanvasFont");
    let textEntity = new Entity("text");
    textEntity.addComponent("element", {
      text: text,
      fontAsset: font,
      fontSize: fontSize,
      type: ELEMENTTYPE_TEXT,
      color: new Color(),
      pivot: new Vec2(0.5, 0.5),
      alignment: new Vec2(0.5, 0.5),
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      margin: new Vec4(),
      color : Util.createColor(255, 255, 255)
    });
    textEntity.setLocalPosition(pos);
    return textEntity;
  }

  _createRaceCarSpecs(text, value, width, widthValue, pos = new Vec3()) {
    let entity = new Entity("raceCarSpecs");
    let title = this._createText(text, 18, new Vec3(-270, 0, 0));
    entity.addChild(title);
    title.element.alignment = new Vec2(0, 0.5);
    title.element.pivot = new Vec2(0, 0.5);
    let valueTxt = this._createText(value, 18, new Vec3(170, 0, 0));
    valueTxt.element.alignment = new Vec2(0, 0.5);
    valueTxt.element.pivot = new Vec2(0, 0.5);
    entity.addChild(valueTxt);
    let maxValueImg = ObjectFactory.createImageElement("spr_dark", {
      height: 20,
      width: width,
      pivot: new Vec2(0, 0.5),
      x: -110,
    })
    maxValueImg.element.color = Util.createColor(156, 156, 156);
    entity.addChild(maxValueImg);
    let currentValueImg = ObjectFactory.createImageElement("spr_dark", {
      height: 20,
      width: widthValue,
      pivot: new Vec2(0, 0.5),
      x: -110,
    });
    currentValueImg.element.color = Util.createColor(54, 189, 239);
    entity.addChild(currentValueImg);
    entity.addComponent("element", {
      type: ELEMENTTYPE_GROUP,
      pivot: new Vec2(0.5, 0.5),
      alignment: new Vec2(0.5, 0.5),
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      margin: new Vec4(),
    });
    entity.setLocalPosition(pos);
    entity.updateValue = function (value, maxValue, currValue) {
      valueTxt.element.text = value;
      currentValueImg.element.width = currValue;
      maxValueImg.element.width = maxValue;
    }
    return entity;
  }
}