import { AssetListLoader, Vec2, Vec4 } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { GameConstant } from "../../../gameConstant";
import { UIScreen } from "../../../template/ui/uiScreen";
import { Button } from "../core/button";
import { ListView } from "../core/listView";
import { ScrollView } from "../core/scrollView";
import MapItem from "../objects/mapItemUI";


export const MapEditorScreenEvent = Object.freeze({
  MapItemSelected: "MapItemSelected",
  MapSelected: "MapSelected",
  ButtonNewMapClicked: "btnNewMapClicked",
  ButtonNextClicked: "btnNextClicked",
});
export class MapEditorScreen extends UIScreen{
  constructor() {
    super(GameConstant.SCREEN_MAP_EDITOR);
    this._initButtonNewMap();
    this._initSelectMapItemPanel();
    this._initSelectMapPanel();
  }

  _initButtonNewMap() {
    this.btnNewMap = new Button({
      anchor: new Vec4(0, 1, 0, 1),
      pivot: new Vec2(0, 1),
      margin: new Vec4(),
      width: 100,
      height: 50,
    })
    this.addChild(this.btnNewMap);
    this.btnNewMap.text.element.text = "NewMap"
  }

  _initSelectMapPanel() {
    this.listMap = new ListView({
      anchor : new Vec4 (0.5, 0.5, 0.5, 0.5),
      pivot : new Vec2 (0.5, 0.5),
      margin: new Vec4() 
    })
    
    this.scroollMap = new ScrollView(this.listMap,{
      anchor: new Vec4(0, 0, 1, 0.15),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(50, 0, 50, 0),
    })
    this.addChild(this.scroollMap);

    this.addMap({
      spriteAsset: AssetLoader.getAssetByKey("spr_map_1")
    })

    this.addMap({
      spriteAsset: AssetLoader.getAssetByKey("spr_map_2")
    });
  }

  _initSelectMapItemPanel() {
    this.listMapItem = new ListView({
      anchor: new Vec4 (0.5, 0.5, 0.5),
      pivot: new Vec2 (0.5, 0.5),
      margin: new Vec4()
    })

    this.scrollviewMap = new ScrollView(this.listMapItem,{
      anchor: new Vec4(0, 0, 1, 0.15),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(50, 0, 50, 0),
    })

    this.addChild(this.scrollviewMap);

    this.addMapItem({
      spriteAsset: AssetLoader.getAssetByKey("spr_road_item")
    })
    this.addMapItem({
      spriteAsset: AssetLoader.getAssetByKey("spr_building_1")
    })
    this.addMapItem({
      spriteAsset: AssetLoader.getAssetByKey("spr_building_2")
    })
    this.addMapItem({
      spriteAsset: AssetLoader.getAssetByKey("spr_building_3")
    })
    this.listMapItem.enabled = false;

  }




  addMap(data) {
    let item = new MapItem(data);
    this.listMap.addItem(item);
  }

  addMapItem(data) {
    let item = new MapItem(data);
    this.listMapItem.addItem(item)
  }


}  

  