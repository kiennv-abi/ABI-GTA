import { Vec2, Vec4 } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { UIScreen } from "../../../template/ui/uiScreen";
import { ListView } from "../core/listView";
import { ScrollView } from "../core/scrollView";
import MapItem from "../objects/mapItemUI";

export class MapEditorScreen extends UIScreen{
  constructor() {
    super(GameConstant.SCREEN_MAP_EDITOR);

    this._initScrollList()
  }

  _initScrollList() {
    this.listMapItem = new ListView({
      anchor: new Vec4(0, 1, 0, 1),
      pivot: new Vec2(0, 1),
      margin: new Vec4(),
    });
    this.listMapItem.layoutgroup.spacing.set(20, 0);

    this.scrollView = new ScrollView(this.listMapItem, {
      anchor: new Vec4(0, 0, 1, 1),
      pivot: new Vec2(0.5, 1),
      margin: new Vec4(80, 70, 80, 200),
    });
    this.scrollView.bg.enabled = false;
    this.addChild(this.scrollView);

    this.addMapItem();
    this.addMapItem();
    this.addMapItem();
    this.addMapItem();
    this.addMapItem();
    this.addMapItem();
    this.addMapItem();
  }

  addMapItem() { 
    let item = new MapItem();
    this.listMapItem.addItem(item);
    return item;
  }
}