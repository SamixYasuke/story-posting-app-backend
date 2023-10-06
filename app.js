import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser"; // Import body-parser

import { Story } from "./Models/story.js";

const app = express();
const PORT = 5000;

app.use(cors());
// Add this middleware before your other route handlers
app.use(bodyParser.json({ limit: "10mb" })); // Set a higher limit if needed
app.use(express.json());

app.get("/stories", async (req, res) => {
  try {
    const stories = await Story.find({});
    res.status(200).json({
      numberOfStories: stories.length,
      stories: stories,
    });
  } catch (error) {
    res.status(404).json({
      message: "Couldn't Find Story",
    });
  }
});

app.post("/story", async (req, res) => {
  try {
    const storyPost = new Story({
      storyImage: req.body.storyImage,
      storyAuthor: req.body.storyAuthor,
      storyTitle: req.body.storyTitle,
      storyContent: req.body.storyContent,
    });
    await storyPost.save();
    res.status(201).send("Story Saved Saved!");
  } catch (error) {
    res.status(500).json({
      message: "Couldn't save Story",
    });
  }
});

app.get("/story/:param", async (req, res) => {
  const { param } = req.params;
  try {
    let story;
    if (mongoose.Types.ObjectId.isValid(param)) {
      story = await Story.findOne({ _id: param });
    } else {
      story = await Story.findOne({ storyTitle: param });
    }
    if (story) {
      res.status(200).json({
        story: story,
      });
    } else {
      res.status(404).json({
        message: "Story Not Found!",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // Handle the payload size error
    res.status(400).json({ error: "Payload too large" });
  } else {
    next();
  }
});

const connectServer = async () => {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/SamixxStory"
    );
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`This is active on Port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database");
  }
};

connectServer();
//mongodb+srv://samueladekolu4:aaaabbbb@cluster0.ovvpyeh.mongodb.net/AnimeBlog