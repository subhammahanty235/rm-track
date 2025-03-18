require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Define Schema
const logSchema = new mongoose.Schema({
    ip: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now }
});

const Log = mongoose.model("Log", logSchema);

app.use(cors());

// Tracking Route
app.get("/request-image", async (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const logEntry = new Log({ ip, userAgent });
    await logEntry.save();
    const imgPath = path.join(__dirname, "tracker.png");
    res.sendFile(imgPath);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
