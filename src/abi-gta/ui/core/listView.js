import { ELEMENTTYPE_GROUP, Entity, ORIENTATION_HORIZONTAL, ORIENTATION_VERTICAL, Vec2, Vec4 } from "playcanvas";
import { LayoutGroupFitter } from "../../scripts/ui/layoutGroupFitter";
import { ListViewItem, ListViewItemEvent } from "../../scripts/ui/listViewItem";
export class ListView extends Entity {
  constructor(data = {}) {
    super("list-view");
    this.items = [];
    this.selectedItem = null;

    data.type = ELEMENTTYPE_GROUP;
    data.anchor = data.anchor || new Vec4(0, 0, 1, 1);
    data.margin = data.margin || new Vec4();
    this.addComponent("element", data);

    this.addComponent("layoutgroup", {
      orientation : ORIENTATION_HORIZONTAL,
      alignment   : new Vec2(0.5, 0.5),
      spacing     : new Vec2(0, 4),
    });

    this.layoutGroupFitter = this.addScript(LayoutGroupFitter, {
      orientation: ORIENTATION_HORIZONTAL,
    });
  }

  addItem(item) {
    let listViewItem = item.getScript(ListViewItem);
    if (listViewItem) {
      this.items.push(listViewItem);
      listViewItem.on(ListViewItemEvent.Select, this.onSelectItem, this);
    }

    this.addChild(item);
    this.layoutGroupFitter.fit();
  }

  cleatList() {
    this.children.forEach((child) => {
      this.removeChild(child);
      child?.destroy();
    });
  }

  onSelectItem(listViewItem) {
    if (this.selectedItem === listViewItem) {
      return;
    }

    this.selectedItem?.deselect();
    this.selectedItem = listViewItem;
  }
}
