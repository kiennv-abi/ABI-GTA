import { Vec2, Vec4 } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { UIScreen } from "../../../template/ui/uiScreen"
import { Button } from "../core/button";

export class PlayScreen extends UIScreen{
  constructor(){ 
    super(GameConstant.SCREEN_PLAY);
    this._initButtonControls();
  }

  _initButtonControls() {
    this.leftButton = new Button({
      anchor: new Vec4(0.7, 0.15, 0.7, 0.15),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(),
    });
    this.addChild(this.leftButton);
    this.leftButton.text.element.text = "Left";
    
    this.rightButton = new Button({
      anchor: new Vec4(0.9, 0.15, 0.9, 0.15),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(),
    });
    this.addChild(this.rightButton);
    this.rightButton.text.element.text = "Right";

    this.forwardButton = new Button({
      anchor: new Vec4(0.2, 0.2, 0.2, 0.2),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(),
    });
    this.addChild(this.forwardButton);
    this.forwardButton.text.element.text = "Forward";

    this.reverseButton = new Button({
      anchor: new Vec4(0.2, 0.1, 0.2, 0.1),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(),
    });
    this.addChild(this.reverseButton);
    this.reverseButton.text.element.text = "Reverse";
  }
}