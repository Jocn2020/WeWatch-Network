const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    uploader: {
        type: String,
        required: true,
        minlength: 5,
    },
    description: {
        type: String,
    },
    vidurl: {
        type: String,
        required: true,
    },
    likes: {
        type: Array
    },
    comments: {
        type: Array,
    },
    shared: {
        type: Array,
    },
    thumbnail: {
        type: String
    }
}, {
    timestamps: true,
});

const Posting = mongoose.model('Post', postSchema);

module.exports = Posting;