import { Vec2, Vec4 } from "playcanvas";
import { UIScreen } from "../../../template/ui/uiScreen";
import { Button } from "../core/button";
import { GameConstant } from "../../../gameConstant";
import { CarType } from "../../objects/car/car";

export const SelectCarScreenEvent = Object.freeze({
  ButtonClicked: "clicked",
});

export class SelectCarScreen extends UIScreen{
  constructor() {
    super(GameConstant.SCREEN_SELECT_CAR);
    this.button1 = new Button({
      anchor: new Vec4(0.3, 0.2, 0.3, 0.2),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4()
    })
    this.addChild(this.button1);
    this.button1.text.element.text = "Muscle";
    this.button1.button.on("click", () => {
      this.fire(SelectCarScreenEvent.ButtonClicked, CarType.MuscleCar);
    });


    this.button2 = new Button({
      anchor: new Vec4(0.7, 0.2, 0.7, 0.2),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4()
    })
    this.addChild(this.button2);
    this.button2.text.element.text = "Police";
    this.button2.button.on("click", () => {
      this.fire(SelectCarScreenEvent.ButtonClicked, CarType.PoliceCar);
    });
  }
}