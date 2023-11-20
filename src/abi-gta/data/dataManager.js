import data from "../../../assets/jsons/mapData.json";
import map1 from "/assets/jsons/map1Data.json"
export class DataManager{
  static init() {
    this.mapData = map1.mapData;
    this.mapUnit = map1.unit;
    this.formatData = map1;
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
      this.applyMapData(data[0], data[1], value)
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
          result.push([i,j]);
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

  static findPosition(data1, data2) {
    // Loop through each element in data1
    console.log(DataManager.mapData);
    for (let i = 0; i < data1.length; i++) {
      for (let j = 0; j < data1[0].length; j++) {
        // Check if the current position can accommodate the size of data2
        if (i + data2.length <= data1.length && j + data2[0].length <= data1[0].length) {
          // Check if all elements within the current position are 0
          let allZeroes = true;
          for (let k = i; k < i + data2.length; k++) {
            for (let l = j; l < j + data2[0].length; l++) {
              if (data1[k][l] !== 0) {
                allZeroes = false;
                break;
              }
            }
            if (!allZeroes) {
              break;
            }
          }
          if (allZeroes) {
            let x = i + Math.floor(data2.length / 2);
            let y = j + Math.floor(data2[0].length / 2);
            return [x, y];
          }
        }
      }
    }
    return null;
  }
}