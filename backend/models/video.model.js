const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const videoSchema = new Schema({
    thumbnail: {
        type: String,
    },
    title: {
        type: String,
        trim: true,
    },
    url: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    channel: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;