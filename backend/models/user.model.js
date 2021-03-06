const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
    },
    description: {
        type: String,
    },
    posts: {
        type: Array
    },
    likes: {
        type: Array
    },
    comments: {
        type: Array
    },
    friends: {
        type: Array
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;