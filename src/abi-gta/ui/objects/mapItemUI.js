import { BUTTON_TRANSITION_MODE_TINT, ELEMENTTYPE_IMAGE, Entity, Vec2 } from "playcanvas";
import { ListViewItem, ListViewItemEvent } from "../../scripts/ui/listViewItem";
import { Util } from "../../../helpers/util";

export const MapItemType = Object.freeze({
  ROAD: "road",
  BUILDING1: "building_1",
  BUILDING2: "building_2",
  BUILDING3: "building_3",
  Map1: "map_1",
  Map2: "map_2",
});
export const MapItemEvent = Object.freeze({
  Selected: "Selected",
  DeSelected: "DeSelected",
});
export default class MapItem extends Entity{
  constructor(data = {}) {
    super("mapItem");
    
    this.type = data.type || MapItemType.ROAD;
    this.spriteAsset = data.spriteAsset;
    this.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      width: 70,
      height: 70,
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