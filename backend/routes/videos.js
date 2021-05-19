// api function to add and remove stock model
const router = require('express').Router();
let Video = require('../models/video.model');

router.route('/').get((req, res) => {
    Video.find()
    .then(videos => res.json(videos))
    .catch(err => res.status(400).json('Error:' + err));
});

router.route('/add').post((req, res) => {
    const title = req.body.title;
    const url = req.body.url;
    const thumbnail = req.body.thumbnail;
    const channel = req.body.uploader;
    console.log();

    Video.find({'url' : url})
    .then(videos => {
        if(videos.length === 0){
            const newVideo = new Video({thumbnail, title, url, channel});
            newVideo.save()
            .then(() => res.json('New Video added!'))
            .catch(err => res.status(400).json('Error: ' + err));
        }
    })
});

router.route('/:id').get((req, res) => {
    Video.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route(':/id').delete((req,res) => {
    Video.findByIdAndDelete(req.params.id)
    .then(()=> res.json('Video deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res)=> {
    Video.findById(req.params.id)
    .then(video => {
        video.title = req.body.title,
        video.url = req.body.url,
        video.thumbnail = req.body.thumbnail,
        video.channel = req.body.channel
        
        video.save()
        .then(() => res.json('Video updated'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;