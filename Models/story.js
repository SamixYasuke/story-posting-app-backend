import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
    {
        storyImage : {
            type : String,
            required : true
        },

        storyAuthor : {
            type : String,
            required : true
        },

        storyTitle : {
            type : String,
            required : true
        },

        storyContent : {
            type : String,
            required : true
        },
    },
    {
        timestamps : true
    }
);

export const Story = mongoose.model("story", storySchema);