const ImageRequest = require("../models/ImageRequestModel");
const { compressImage } = require("../utils/imageUtil");

const processImages = async (imageRequest) => {
  const { inputImageUrls } = imageRequest;
  const outputUrls = [];

  for (const url of inputImageUrls) {
    const compressedImage = await compressImage(url, "./output");
    outputUrls.push(compressedImage);
  }

  imageRequest.outputImageUrls = outputUrls;
  imageRequest.status = "completed";
  await imageRequest.save();
};

module.exports = { processImages };
