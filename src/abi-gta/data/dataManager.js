import data from "../../../assets/jsons/mapData.json";
export class DataManager{
  static init() {
    this.mapData = data.mapData;
    this.mapUnit = data.unit;
    this.formatData = data;
  }
  static getMapData() { 
    return this.mapData;
  }

  static setMapData(data) { 
    this.mapData = data;
  }

  static saveMapData() { 

  }

  static applyMapDatas(newData, value) { 
    newData.forEach((data) => {
      this.applyMapData(data.row, data.col, value)
    });
  }

  static applyMapData(row, col, value) { 
    this.mapData[row][col] = value;
  }

  static applyMapDataByStartAndEnd(rowStart, rowEnd, colStart, colEnd, value) { 
    for (let i = rowStart; i <= rowEnd; i++) {
      let row = this.mapData[i];
      for (let j = colStart; j <= colEnd; j++) {
        row[j] = value;
      }
    }
  }

  static findMapItemByStartAndEnd(rowStart, rowEnd, colStart, colEnd) { 
    let result = [];
    for (let i = rowStart; i <= rowEnd; i++) {
      i = i < 0 ? 0 : i;
      let row = this.mapData[i];
      for (let j = colStart; j <= colEnd; j++) {
        j = j < 0 ? 0 : j;
        let tile = row[j];
        if (tile === 0) {
          result.push({ row: i, col: j });
        }
      }
    }
    return result;
  }

  static checkMapDataIsValid(rowStart, rowEnd, colStart, colEnd, length) {
    let result = false;
    let count = 0;
    for (let i = rowStart; i <= rowEnd; i++) {
      i = i < 0 ? 0 : i;
      let row = this.mapData[i];
      for (let j = colStart; j <= colEnd; j++) {
        j = j < 0 ? 0 : j;
        let tile = row[j];
        if (tile === 0) {
          count++;
        }
      }
    }
    if(count >= length){
      result = true;
    }
   return result;
  }
}