import { Vec3 } from "playcanvas";
import { Cube } from "./cube";
import { PlayerMovement } from "../../scripts/components/playerMove";
import { GameConstant } from "../../../gameConstant";

export class Player extends Cube{
  constructor() {
    super();
    this.moved = false;
    this.startPos = new Vec3();

    this.playerMove = this.addScript(PlayerMovement, {
      speed: GameConstant.PLAYER_SPEED,
    });
  }
}