import { Entity } from "playcanvas";
import { MoveWithPath } from "../../scripts/components/moveWithPath";
import { GameConstant } from "../../../gameConstant";

export class Cube extends Entity{
  constructor(){
    super("cube");
    this.addComponent("model", {
      type: "box",
    });

    this.mover = this.addScript(MoveWithPath, {
      speed: GameConstant.PLAYER_SPEED,
    });
    this.activeMove(false);
    this.setLocalScale(0.5, 0.5, 0.5);
  }

  reset(delayTime) {
    this.activeMove(true);
    this.mover.reset(delayTime);
  }

  set z(z) {
    let pos = this.getPosition();
    this.setPosition(pos.x, pos.y, z);
  }

  activeMove(active) {
    this.mover.enabled = active;
  }
}