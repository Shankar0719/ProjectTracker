const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    status: {
        type: String,
        enum: ["active", "archived"],
        default: "active"
    }
}, {timestamps: true});

module.exports = mongoose.model("Project", ProjectSchema);
