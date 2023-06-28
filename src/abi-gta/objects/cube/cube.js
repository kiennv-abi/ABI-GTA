import { Entity } from "playcanvas";
import { MoveWithPath } from "../../scripts/components/moveWithPath";
import { GameConstant } from "../../../gameConstant";

export class Cube extends Entity{
  constructor(){
    super("cube");
    this.addComponent("model", {
      type: "box",
    });
  }

  reset(delayTime) {
    if (!this.mover) {
      this.mover = this.addScript(MoveWithPath, {
        speed: GameConstant.PLAYER_SPEED,
      });
    }
    this.mover.enabled = true;
    this.mover.reset(delayTime);
    this.setLocalScale(0.5, 0.5, 0.5);
  }
}