import { Color, Entity } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { Car } from "../objects/car/car";

export class PlayScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_PLAY);
  }
  create() {
    super.create();
    console.log(1);
  }

}