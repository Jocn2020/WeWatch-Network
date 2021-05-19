import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useState, useEffect } from 'react'
import firebase from "firebase/app";
import "firebase/auth";
import { auth } from "./firebase";
import { gapi } from 'gapi-script';
import axios from 'axios';

export default class Video extends Component {
    constructor(props){
        super(props);

        this.state = {
            username: "",
            title: "",
            description:"",
            video_url: "",
            searched: "",
            thumbnail: "",
        }

        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getVideo = this.getVideo.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    /*
    handleSearch(e){
        var API_KEY = "AIzaSyDSgtZAPwHkAT2bJkpFq95fjFtZ9lT3Dwk";
        gapi.load("client", loadClient);
        function loadClient() {
            gapi.client.setApiKey(`${API_KEY}`);
            return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
                .then(function() { console.log("GAPI client loaded for API"); },
                   function(err) { console.error("Error loading GAPI client for API", err); });
        }
        var searched = this.state.searched;

        function execute() {
            var arr_search = {
                "q": searched,
                "part": 'snippet',
                "type": 'video',
                "order": "viewCount",
                "maxResults": 10,
            };
          
            gapi.client.youtube.search.list(arr_search)
            .then(response => {
                console.log(response.result);
                return response.result.items;
            })
            .then(data => console.log(data));
        }
        loadClient()
        .then(execute());
    }
    handleSearchChange(e){
        this.setState({
            searched: e.target.value
        });
    }
    */

    handleUrlChange(e) {
        this.setState({
            video_url: e.target.value
        })
    }

    handleTitleChange(e) {
        this.setState({
            title: e.target.value
        })
    }

    handleDescriptionChange(e) {
        this.setState({
            description: e.target.value
        })
    }

    getVideo(){
        var API_KEY = "AIzaSyDSgtZAPwHkAT2bJkpFq95fjFtZ9lT3Dwk";
        var url = this.state.video_url.replace('https://www.youtube.com/watch?v=', '');
        gapi.load("client", loadClient);
        function loadClient() {
            return new Promise(function(resolve,reject){
                gapi.client.setApiKey(API_KEY);
                gapi.client.load('youtube', 'v3', resolve);
            });
        };
        loadClient().then(() => {
            console.log("huhu")
            return gapi.client.youtube.videos.list({
                "part": [
                    "snippet,contentDetails,statistics"
                  ],
                  "id": [ url
                  ]
            })
            .then((response) => {
                    // Handle the results here (response.result has the parsed body).
                    console.log("Response", response.result);

                    var video = response.result.items;
                    console.log(video.length)
                    if(video.length == 0){
                        alert("Invalid url");
                        this.props.history.push('/add-post');
                    }
                    else{
                        var video_data = video[0].snippet;
                        const new_video = {
                            'title': video_data.title,
                            'thumbnail': video_data.thumbnails.default.url,
                            'url': 'https://www.youtube.com/watch?v='+url,
                            'uploader': video_data.channelTitle,
                        }
                        axios.post('http://localhost:5000/videos/add', new_video)
                        .then(res => console.log(res))
                        // check if video data has been saved
                        return new_video.thumbnail;
                    }})
            .then(thumbnail => {
                        const new_post = {
                            title: this.state.title,
                            uploader: this.state.username,
                            description: this.state.description,
                            vidurl: this.state.video_url,
                            thumbnail: thumbnail
                        };
                        axios.post('http://localhost:5000/posts/add', new_post)
                        .then((res) => {console.log(res.data)})
                        .then(() => {
                            window.location = window.location.href.replace('/add-post', '')
                        })
                    })
    })}

    onSubmit(e){
        this.getVideo()
    }


    componentDidMount() { // same as useEffect
        auth.onAuthStateChanged((user) => {
            var curr_user = null;
            if (user) {
                console.log(user.displayName);
                curr_user = user;
                this.setState({
                    username: curr_user.displayName
                })
              // User is signed in.
            } else {
              // No user is signed in.
              window.location = window.location.href.replace('/add-post', '')
              alert("Please Login First");
            }
        })
    }

    render() {
        return (
            <div class="container">
                <h1>Create New Post</h1>
                <div class="mb-3">
                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" value={this.state.title} onChange={this.handleTitleChange}/>
                    </div>
                    <div class="mb-3">
                        <label  class="form-label">Description</label>
                        <textarea class="form-control" aria-describedby="email" value={this.state.description} onChange={this.handleDescriptionChange}/>
                    </div>
                    <div class="mb-3">
                        <label  class="form-label">Video Url</label>
                        <input type="text" class="form-control" onChange={this.handleUrlChange} value={this.state.video_url}/>
                        <div id="emailHelp" class="form-text">Submit a valid youtube url in form of "https://www.youtube.com/watch?v="+videoId</div>
                    </div>
                    <button type="submit" class="btn btn-primary" onClick={this.onSubmit}>Submit</button>
                </div>
            </div>
        )
    }
}