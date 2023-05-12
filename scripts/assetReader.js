const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.resolve(__dirname, "../assets/jsons/assetData.json");


// clear file output
fs.writeFileSync(OUTPUT_PATH, "");

// read and write all sprites
console.log("--------------- SPRITES ---------------");
var allSprite = read("sprites");
allSprite.forEach((sprite, index) => {
  fs.appendFileSync(OUTPUT_PATH, JSON.stringify(sprite) + ",\n");
  console.log("Writing sprites: " + sprite.key);
  if (index === allSprite.length - 1) {
    console.log("All sprites passed: " + allSprite.length);
  }
});

// read and write all textures
console.log("--------------- TEXTURES ---------------");
var allTexture = read("textures");
allTexture.forEach((texture, index) => {
  fs.appendFileSync(OUTPUT_PATH, JSON.stringify(texture) + ",\n");
  console.log("Writing texture: " + texture.key);
  if (index === allTexture.length - 1) {
    console.log("All textures passed: " + allTexture.length);
  }
});

// read and write all models
console.log("--------------- MODELS ---------------");
var allModel = read("models");
allModel.forEach((texture, index) => {
  fs.appendFileSync(OUTPUT_PATH, JSON.stringify(texture) + ",\n");
  console.log("Writing model: " + texture.key);
  if (index === allModel.length - 1) {
    console.log("All models passed: " + allModel.length);
  }
});
 
//convert output file to json array
let data = fs.readFileSync(OUTPUT_PATH, "utf8");
data = data.replace(/,\n$/, "");
data = "[" + data + "]";
fs.writeFileSync(OUTPUT_PATH, data);

function read(type) {
  const files = fs.readdirSync(path.resolve(__dirname, "../assets/" + type));
  let data = [];
  files.forEach((file) => {
    if(file === ".DS_Store") return;
    data.push({
      key: file.split(".")[0],
      url: `../../assets/${type}/${file}`,
      type: type.slice(0, -1), // remove 's' from type
    });
  });
  return data;
}