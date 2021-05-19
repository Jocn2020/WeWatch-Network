// api function to add and remove user model
const router = require('express').Router();
const { response } = require('express');
let User = require('../models/user.model');

router.route('/').get((req, res) => {
    User.find() // find user from list of user
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error:' + err));
});

router.route('/get-user/:username').get((req, res) => {
    User.find({username: req.params.username}) // find user from list of user
    .then(users => {
        res.json(users[0])
    })
    .catch(err => res.status(400).json('Error:' + err));
});

router.route('/add').post((req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const description = "";
    const likes = [];
    const posts = [];
    const comments = [];
    const friends = [];

    const newUser = new User({username, email, description, posts, likes, comments, friends});

    newUser.save()
    .then(() => res.json('New user added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update').post((req, res) => {
    User.find({user: req.body.username})
    .then(user => {
        user.description = req.body.description,
        
        user.save()
        .then(() => res.json('User updated'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/likes/:id').get((req, res) => {
    User.findById(req.params.id)
    .then(user => res.json(user.likes))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/like').post((req, res) => {
    User.find({username: req.body.username})
    .then((user) => {
        message = "";
        if(req.body.like){
            user[0].likes.push(req.body.post);
            message = "Post added to user like data";
        }
        else{
            user[0].likes = user[0].likes.filter(post => post !== req.body.post);
            message = "Post removed from user like data";
        }
        user[0].save()
        .then(() => res.json(message))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/comments/:id').get((req, res) => {
    User.findById(req.params.id)
    .then(user => res.json(user.comments))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/comment').post((req, res) => {
    User.find({username: req.body.username})
    .then((user) => {
        message = "";
        if(req.body.comment){
            user[0].comments.push({
                comment: req.body.message,
                date: req.body.date
            });
            message = "Comment added to user comment data";
        }
        user[0].save()
        .then(() => res.json(message))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/add-friend').post((req, res) => {
    User.find({username: req.body.username})
    .then((user) => {
        user[0].friends.push(req.body.friend)

        user[0].save()
        .then((user) => res.json(user.friends))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/remove-friend').post((req, res) => {
    User.find({username: req.body.username})
    .then((user) => {
        user[0].friends = user[0].friends.filter(friend => friend !== req.body.friend)

        user[0].save()
        .then((user) => res.json(user.friends))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;