const { parseCSV } = require("../utils/csvUtils");
const ImageRequest = require("../models/ImageRequestModel");
const { processImages } = require("../services/imageService");
const Queue = require("bull");

// Create a new queue
const imageQueue = new Queue("image-processing");

imageQueue.process(async (job) => {
  const imageRequest = await ImageRequest.findById(job.data.requestId);
  await processImages(imageRequest);
});

const uploadCSV = async (req, res) => {
  try {
    const csvData = await parseCSV(req.file.path);
    const imageRequests = [];

    for (const row of csvData) {
      const newRequest = new ImageRequest({
        requestId: `req-${Date.now()}`,
        serialNumber: row["Serial Number"],
        productName: row["Product Name"],
        inputImageUrls: row["Input Image Urls"].split(","),
      });
      await newRequest.save();
      imageRequests.push(newRequest);

      // Add to processing queue
      imageQueue.add({ requestId: newRequest._id });
    }

    return res
      .status(200)
      .json({ message: "CSV uploaded successfully", imageRequests });
  } catch (error) {
    res.status(400).json({ error: "Failed to process CSV" });
  }
};

const getStatus = async (req, res) => {
  const { requestId } = req.params;
  const imageRequest = await ImageRequest.findOne({ requestId });

  if (!imageRequest) {
    return res.status(404).json({ error: "Request not found" });
  }

  return res.status(200).json({
    status: imageRequest.status,
    outputImageUrls: imageRequest.outputImageUrls,
  });
};

module.exports = { uploadCSV, getStatus };
