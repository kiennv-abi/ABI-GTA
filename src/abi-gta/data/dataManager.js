import data from "../../../assets/jsons/mapData.json";
import map1 from "../../../assets/jsons/map1Data.json";
import map2 from "../../../assets/jsons/map2Data.json";
export class DataManager{
  static init() {
    this.mapData = data.mapData;
    this.mapUnit = data.unit;
    // this.map1 = map1.mapData;
    // this.map2 = map2.mapData;
    // this.mapUnit = data.unit;
    // this.formatData = data;
    // this.carSelected = CarType.MuscleCar;
    // this.carColor = CarColorCode.Color1;
  }

  static setMapData(data) {
    this.mapData = data;
  }

  static applyMapdata(newData, value) {
    newData.forEach((data) => {
      this.mapData[data.row][data.col] = value
    });
  }

  static findMapItemByStartAndEnd(rowStart, rowEnd, colStart, colEnd){
    let result = [];
    for (let i = rowStart; i <= rowEnd; i++) {
      let row = this.mapData[i];
      for (let j = colStart; j <= colEnd; j++ ){
        let tile = row[j];
        if(tile === 0){
          result.push({row: i, col: j})
        }
      }
    }
    return result;
  }


}