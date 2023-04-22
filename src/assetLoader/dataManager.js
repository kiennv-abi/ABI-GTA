import mapDataJson from "../../assets/jsons/mapData.json";
export class DataManager {
  static init(){
    this.mapData = mapDataJson;
  }

  static addData(type, pos, rot, scale){
    let data = {
      type: `${type}`,
      pos: {
        x: pos.x,
        y: pos.y,
        z: pos.z
      },
      rot: {
        x: rot.x,
        y: rot.y,
        z: rot.z
      },
      scale:{
        x: scale.x,
        y: scale.y,
        z: scale.z
      }
    }
   this.mapData.push(data)
  }
}