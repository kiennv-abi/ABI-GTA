import mapData from "../../../assets/jsons/mapData.json";
export class DataManager{
  static init() {
    this.mapData = mapData.mapData;
    this.mapUnit = mapData.unit;
  }
  static getMapData() { 
    return this.mapData;
  }

  static setMapData(data) { 
    this.mapData = data;
  }

  static saveMapData() { 

  }

  static applyMapData(newData, value) { 
    newData.forEach((data) => {
      this.mapData[data.row][data.col] = value;
    });
  }

  static findMapItemByStartAndEnd(rowStart, rowEnd, colStart, colEnd) { 
    let result = [];
    for (let i = rowStart; i <= rowEnd; i++) {
      let row = this.mapData[i];
      for (let j = colStart; j <= colEnd; j++) {
        let tile = row[j];
        if (tile === 0) {
          result.push({ row: i, col: j });
        }
      }
    }
    return result;
  }
}