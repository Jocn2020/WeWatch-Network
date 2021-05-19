// api function to add and remove stock model
const router = require('express').Router();
const { useRouteMatch } = require('react-router-dom');
let Posting = require('../models/post.model');

router.route('/').get((req, res) => {
    Posting.find()
    .then(posts => {
        res.json(posts)
    })
    .catch(err => res.status(400).json('Error:' + err));
});

router.route('/add').post((req, res) => {
    const title = req.body.title;
    const uploader = req.body.uploader;
    const description = req.body.description;
    const vidurl = req.body.vidurl;
    const likes = [];
    const comments = [];
    const shared = [];
    const thumbnail = req.body.thumbnail;
    
    const newPosting = new Posting({title, uploader, description, vidurl, likes, comments, shared, thumbnail});

    newPosting.save()
    .then(() => res.json('New post added!'))
});

router.route('/:id').get((req, res) => {
    Posting.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route(':/id').delete((req,res) => {
    Posting.findByIdAndDelete(req.params.id)
    .then(()=> res.json('Post deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res)=> {
    Posting.findById(req.params.id)
    .then(post => {
        post.title = req.body.title,
        post.uploader = req.body.uploader,
        post.description = req.body.description,
        post.vidurl = req.body.vidurl
        
        post.save()
        .then(() => res.json('Post updated'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/posted-by/:id').get((req, res) => {
    Posting.find({'uploader': req.params.id})
    .then(post => {
        res.json(post)
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/like-comment-share/:id').post((req, res) => {
    var message = '';
    Posting.findById(req.params.id)
    .then(post => {
        if(req.body.type == 'like'){
            console.log(req.body)
            if(req.body.like){
                post.likes.push(req.body.username);
                message = "Like added";
            }
            else{
                post.likes = post.likes.filter(username => username !== req.body.username);
                message = "Like deleted";
            }
        }
        else if(req.body.type == "comment"){
            if(req.body.comment){
                var new_comment = {
                    username: req.body.username,
                    comment: req.body.message,
                    date: req.body.date,
                }
                post.comments.push(new_comment);
                message = "Comment added";
            }
            else{
                post.comments = post.comments.filter(username => username !== req.body.username);
                message = "Comment deleted";
            }
        }
        else{
            var new_share = {
                sender: req.body.sender,
                receiver: req.body.receiver,
                date: req.body.date,
            }
            posts.shared.push(new_share)
            message = "Shared successfully";
        }

        post.save()
        .then(() => res.json(message))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;