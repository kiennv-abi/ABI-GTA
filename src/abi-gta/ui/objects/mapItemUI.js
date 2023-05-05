import { BUTTON_TRANSITION_MODE_TINT, ELEMENTTYPE_IMAGE, Entity, Vec2 } from "playcanvas";
import { ListViewItem, ListViewItemEvent } from "../../scripts/ui/listViewItem";
import { Util } from "../../../helpers/util";

export default class MapItem extends Entity{
  constructor() {
    super("mapItem");

    this.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      width: 200,
      height: 200,
      useInput: true,
      pivot: new Vec2(0.5, 1),
    });
    this.addComponent("button", {
      imageEntity: this,
      transitionMode: BUTTON_TRANSITION_MODE_TINT,
      hoverTint: Util.createColor(255, 255, 255),
      pressedTint: Util.createColor(255, 255, 255),
      inactiveTint: Util.createColor(100, 100, 100),
    });

    this.listViewItem = this.addScript(ListViewItem, {
      buttonComponent: this.button,
    });
    this.listViewItem.on(ListViewItemEvent.Select, this.onSelect, this);
    this.listViewItem.on(ListViewItemEvent.Deselect, this.onDeselect, this);
    this.listViewItem.deselect();
  }

  onSelect() {
    console.log("select");
  }

  onDeselect() { 
    console.log("deselect");
  }
}