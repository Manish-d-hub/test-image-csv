const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./api/config/db");
const imageRoutes = require("./api/routes/imageRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/images", imageRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
