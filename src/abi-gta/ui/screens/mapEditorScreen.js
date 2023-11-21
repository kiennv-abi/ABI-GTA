import { Vec2, Vec4 } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { UIScreen } from "../../../template/ui/uiScreen";
import { ListView } from "../core/listView";
import { ScrollView } from "../core/scrollView";
import MapItem, { MapItemEvent, MapItemType } from "../objects/mapItemUI";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Button } from "../core/button";
import { DataManager } from "../../data/dataManager";

export const MapEditorScreenEvent = Object.freeze({
  MapItemSelected: "MapItemSelected",
  MapSelected: "MapSelected",
  ButtonNewMapClicked: "btnNewMapClicked",
  ButtonNextClicked: "btnNextClicked",
});

export class MapEditorScreen extends UIScreen{
  constructor() {
    super(GameConstant.SCREEN_MAP_EDITOR);
    this._initSelectMapPanel();
    this._initSelectMapItemPanel();
    this._initButtonNewMap();
    this._initButtonCancel();

  }

  _initButtonNewMap() {
    this.buttonNewMap = new Button({
      anchor: new Vec4(0, 1, 0, 1),
      pivot: new Vec2(0, 1),
      margin: new Vec4(),
      width: 100,
      height: 50,
    });
    this.buttonNewMap.text.element.fontSize = 20;
    this.buttonNewMap.text.element.text = "New Map";
    this.addChild(this.buttonNewMap);
    this.buttonNewMap.button.on("click", () => { 
      this.fire(MapEditorScreenEvent.ButtonNewMapClicked);
      this.scrollViewMap.enabled = true;
      this.listMap.enabled = false;
      this.btnCancel.enabled = true;
    });
  }

  _initButtonCancel() {
    this.bthCancel = new Button({
      anchor: new Vec4(0.92, 0, 0.92, 0 ),
      width: 100,
      height: 50,
    })
    // this.bthCancel.enabled = false;
    this.addChild(this.bthCancel);
    this.bthCancel.text.element.text = "Cancel";
    this.bthCancel.button.on("click", () => {
     this.listMapItem.enabled = false;
     this.scrollViewMap = false;
     this.listMap.enabled = true;
    //  this.bthCancel.enabled = false;
    })
  }

  _initSelectMapPanel() {
    this.listMap = new ListView({
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(),
    });

    this.scrollViewMap = new ScrollView(this.listMap, {
      anchor: new Vec4(0, 0, 1, 0.15),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(100, 0, 100, 0),
    });
    this.addChild(this.scrollViewMap);

    this.addMap({
      type: MapItemType.Map1,
      spriteAsset: AssetLoader.getAssetByKey("spr_map_1"),
    });
    this.addMap({
      type: MapItemType.Map2,
      spriteAsset: AssetLoader.getAssetByKey("spr_map_2"),
    });
  }

  _initSelectMapItemPanel() {
    this.listMapItem = new ListView({
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(),
    });

    this.scrollViewMap = new ScrollView(this.listMapItem, {
      anchor: new Vec4(0, 0, 1, 0.15),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(100, 0, 100, 0),
    });
    this.addChild(this.scrollViewMap);
    this.scrollViewMap.enabled = false;

    this.addMapItem({
      type: MapItemType.ROAD,
      spriteAsset: AssetLoader.getAssetByKey("spr_road_item"),
    });

    this.addMapItem({
      type: MapItemType.BUILDING1,
      spriteAsset: AssetLoader.getAssetByKey("spr_building_1"),
    });

    this.addMapItem({
      type: MapItemType.BUILDING2,
      spriteAsset: AssetLoader.getAssetByKey("spr_building_2"),
    });

    this.addMapItem({
      type: MapItemType.BUILDING3,
      spriteAsset: AssetLoader.getAssetByKey("spr_building_3"),
    });
  }

  addMapItem(data) { 
    let item = new MapItem(data);
    this.listMapItem.addItem(item);
    item.on(MapItemEvent.Selected, (type) => { 
    this.fire(MapEditorScreenEvent.MapItemSelected, type);
    });
    return item;
  }

  addMap(data) {
    let item = new MapItem(data);
    this.listMap.addItem(item);
    item.on(MapItemEvent.Selected, (type) => {
      this.fire(MapEditorScreenEvent.MapSelected, type);
    });
    return item;
  }

}