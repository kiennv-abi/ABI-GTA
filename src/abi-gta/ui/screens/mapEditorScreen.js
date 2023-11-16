import { type, Vec2, Vec4 } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { UIScreen } from "../../../template/ui/uiScreen";
import { ListView } from "../core/listView";
import { ScrollView } from "../core/scrollView";
import MapItem, { MapItemEvent, MapItemType } from "../objects/mapItemUI";
import { AssetLoader } from "../../../assetLoader/assetLoader";

export const MapEditorScreenEvent = Object.freeze({
  MapItemSelected: "MapItemSelected",
});
export class MapEditorScreen extends UIScreen{
  constructor() {
    super(GameConstant.SCREEN_MAP_EDITOR);

    this._initScrollList()
  }

  _initScrollList() {
    this.listMapItem = new ListView({
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(),
    });

    this.scrollView = new ScrollView(this.listMapItem, {
      anchor: new Vec4(0, 0, 1, 0.15),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(100, 0, 100, 0),
    });
    this.addChild(this.scrollView);

    this.addMapItem({
      type: MapItemType.ROAD,
      spriteAsset: AssetLoader.getAssetByKey("spr_road_item"),
    });

    this.addMapItem({
      type: MapItemType.BUILDING1,
      spriteAsset: AssetLoader.getAssetByKey("spr_building_1"),
    })

    this.addMapItem({
      type: MapItemType.BUILDING2,
      spriteAsset: AssetLoader.getAssetByKey("spr_building_2")
    })

    this.addMapItem({
      type: MapItemType.BUILDING3,
      spriteAsset: AssetLoader.getAssetByKey("spr_building_3")
    })
  }

  addMapItem(data) { 
    let item = new MapItem(data);
    this.listMapItem.addItem(item);
    item.on(MapItemEvent.Selected, (type) => { 
    this.fire(MapEditorScreenEvent.MapItemSelected, type);
    console.log(type);
    });
    return item;
  }
}