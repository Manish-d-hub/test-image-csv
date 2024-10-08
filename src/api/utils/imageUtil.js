const sharp = require("sharp");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const compressImage = async (imageUrl, outputDir) => {
  const outputPath = path.join(outputDir, path.basename(imageUrl));

  // Download and compress image
  const response = await axios({ url: imageUrl, responseType: "stream" });
  const imageStream = response.data.pipe(fs.createWriteStream(outputPath));

  return new Promise((resolve, reject) => {
    imageStream.on("finish", async () => {
      const compressedImagePath = `${outputPath}-compressed.jpg`;
      await sharp(outputPath).jpeg({ quality: 50 }).toFile(compressedImagePath);
      resolve(compressedImagePath);
    });
    imageStream.on("error", reject);
  });
};

module.exports = { compressImage };
