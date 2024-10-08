const Queue = require("bull");
const imageQueue = new Queue("image-processing");

imageQueue.process(async (job) => {
  const { processImages } = require("../services/imageService");
  const ImageRequest = require("../models/ImageRequestModel");

  const imageRequest = await ImageRequest.findById(job.data.requestId);
  if (imageRequest) {
    await processImages(imageRequest);
  }
});
