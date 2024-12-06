import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import { cwd } from "process";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "videos/" });

app.get("/", (_, res) => {
  res.json("Hello!");
});

// Routes
// 1. Upload video
app.post("/record", upload.single("video"), (req, res) => {
  res.json({
    message: "Video uploaded successfully!",
    fileName: req.file.filename,
  });
});

// 2. Get list of videos
app.get("/videos", (req, res) => {
  const files = fs.readdirSync("videos/").map((file) => ({
    name: file,
    url: `/video/${file}`,
  }));
  res.json(files);
});

// 3. Stream specific video
app.get("/video/:id", (req, res) => {
  const videoPath = path.join(cwd(), "videos", req.params.id);
  if (fs.existsSync(videoPath)) {
    res.sendFile(videoPath);
  } else {
    res.status(404).send("Video not found");
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
