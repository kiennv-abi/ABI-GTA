import { BUTTON_TRANSITION_MODE_TINT, ELEMENTTYPE_IMAGE, Entity, Vec2 } from "playcanvas";
import { ListViewItem, ListViewItemEvent } from "../../scripts/ui/listViewItem";
import { Util } from "../../../helpers/util";
export const MapItemType = Object.freeze({
  ROAD: "road",
  BUILDING: "building"
})

export const MapItemEvent = Object.freeze({
  Selected: "Selected",
  Deselected: "Deselected" 
})

export default class MapItem extends Entity{
  constructor(data = {}) {
    super("mapItem");
    this.spriteAsset = data.spriteAsset;
    
    this.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      width: 100,
      height: 100,
      useInput: true,
      pivot: new Vec2(0.5, 0.5),
      spriteAsset: this.spriteAsset,
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
    this.fire(MapItemEvent.Selected, this.type)
  }

  onDeselect() { 
    this.fire(MapItemEvent.DeSelected, this.type)
  }
}