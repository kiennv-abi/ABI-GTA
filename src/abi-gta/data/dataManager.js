import data from "../../../assets/jsons/mapData.json";
import map1 from "../../../assets/jsons/map1Data.json";
import map2 from "../../../assets/jsons/map2Data.json";
import { CarColorCode, CarType } from "../objects/car/car";
export class DataManager{
  static init() {
    this.mapData = data.mapData;
    this.map1 = map1.mapData;
    this.map2 = map2.mapData;
    this.mapUnit = data.unit;
    this.formatData = data;
    this.carSelected = CarType.MuscleCar;
    this.carColor = CarColorCode.Color1;
  }
  static getMapData() { 
    return this.mapData;
  }

  static setMapData(data) {
    this.mapData = data;
  }

  static resetMapData() {
    this.mapData = data.mapData;
  }

  static saveMapData() { 

  }

  static applyMapDatas(newData, value) { 
    newData.forEach((data) => {
      this.applyMapData(data[0], data[1], value);
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

  static replaceValue(from, to) {
    for (let i = 0; i < this.mapData.length; i++) {
      let row = this.mapData[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j] === from) {
          row[j] = to;
        }
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

  static getRowsWithTypes(arr, type) {
    const rowsWithOnes = [];
    for (let i = 0; i < arr.length; i++) {
      const row = arr[i];
      let startIndex = -1;
      let count = 0;
      for (let j = 0; j < row.length; j++) {
        if (row[j] === type) {
          if (startIndex === -1) {
            startIndex = j;
          }
          count += 1;
        } else {
          if (count >= 2) {
            let indexes = [];
            for (let k = startIndex; k < j; k++) { 
              indexes.push([i, k]);
            }
            rowsWithOnes.push(indexes);
          }
          startIndex = -1;
          count = 0;
        }
      }
      if (count >= 2) {
        let indexes = [];
        for (let k = startIndex; k < row.length; k++) { 
          indexes.push([i, k]);
        }
        rowsWithOnes.push(indexes);
      }
    }
    return rowsWithOnes;
  }

  static getColumnsWithTypes(arr, type) {
    const columnsWithOnes = [];
    for (let j = 0; j < arr[0].length; j++) {
      let startIndex = -1;
      let count = 0;
      for (let i = 0; i < arr.length; i++) {
        const row = arr[i];
        if (row[j] === type) {
          if (startIndex === -1) {
            startIndex = i;
          }
          count += 1;
        } else {
          if (count >= 2) {
            const column = [];
            for (let k = startIndex; k < i; k++) {
              const row = arr[k];
              column.push(row[j]);
            }
            let indexes = [];
            for (let k = startIndex; k < i; k++) {
              indexes.push([k, j]);
            }
            columnsWithOnes.push(indexes);
          }
          startIndex = -1;
          count = 0;
        }
      }
      if (count >= 2) {
        const column = [];
        for (let k = startIndex; k < arr.length; k++) {
          const row = arr[k];
          column.push(row[j]);
        }
        let indexes = [];
        for (let k = startIndex; k < j; k++) {
          indexes.push([k, j]);
        }
        columnsWithOnes.push(indexes);
      }
    }
    return columnsWithOnes;
  }

  static getAllMapItemByType(type) {
    let result = [];
    for (let i = 0; i < this.mapData.length; i++) {
      let row = this.mapData[i];
      for (let j = 0; j < row.length; j++) {
        let tile = row[j];
        if (tile === type) {
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
              console.log(data1[k][l]);
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

  static findPositionArrayInArray(arr1, arr2) {
    const rows1 = arr1.length;
    const cols1 = arr1[0].length;
    const rows2 = arr2.length;
    const cols2 = arr2[0].length;
    const positions = [];

    for (let i = 0; i <= rows1 - rows2; i++) {
      for (let j = 0; j <= cols1 - cols2; j++) {
        let found = true;
        for (let k = 0; k < rows2; k++) {
          for (let l = 0; l < cols2; l++) {
            if (arr2[k][l] !== arr1[i + k][j + l]) {
              found = false;
              break;
            }
          }
          if (!found) break;
        }
        if (found) {
          let x = i + Math.floor(arr2.length / 2);
          let y = j + Math.floor(arr2[0].length / 2);
          for (let k = i; k < i + rows2; k++) {
            for (let l = j; l < j + cols2; l++) {
              arr1[k][l] = 0;
            }
          }
          positions.push([x, y]);
        }
      }
    }

    return positions;
  }
}