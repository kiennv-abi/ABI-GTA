import { Entity } from "playcanvas";
import { Spawner } from "../../scripts/spawners/spawner";
import { Cube } from "./cube";
import { Time } from "../../../template/systems/time/time";
import { Tween } from "../../../template/systems/tween/tween";
import { GameConstant } from "../../../gameConstant";

export const CubeStackManagerEvent = Object.freeze({
  CubeChange: "cubeChanged",
});
export class CubeStackManager extends Entity {

  static positionQueue = [];

  constructor(player, stackSpace = 1) {
    super("cubeStackManager");
    this.player = player;
    this.cubes = [];
    this.stackSpace = stackSpace;
    this.spawner = this.addScript(Spawner, {
      class    : Cube,
      poolSize : 10,
    });
  }

  enqueuePosition(position) {
    CubeStackManager.positionQueue.push({
      position,
      time: Time.current,
    });
  }

  spawnCubes(amount) {
    let delay = 0;
    for (let i = 0; i < amount; i++) {
      let cube = this.spawnCube();
      delay = Math.abs((cube.getPosition().z - this.player.getPosition().z) * 3 / GameConstant.PLAYER_SPEED);
      // cube.setLocalScale(0, 0, 0);
    }
  }

  spawnCube() {
    let cubeAhead;
    let isFirstCube = this.cubes.length === 0;
    if (isFirstCube) {
      cubeAhead = this.player;
    }
    else {
      cubeAhead = this.cubes[this.cubes.length - 1];
    }
    let spawnPos = cubeAhead.getPosition();
    spawnPos.z += this.stackSpace;
    let ball = this.spawner.spawnTo(spawnPos, this);
    this.cubes.push(ball);
    let delayTime = isFirstCube ? 0.2 : cubeAhead.mover.delayTime + 0.2;
    delayTime = Math.max(delayTime, 0.2);
    ball.reset(delayTime);
    return ball;
  }
}
