import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { gapi } from 'gapi-script';


export default class AdvancedSearch extends Component {
    constructor(props){
        super(props);
        this.state = {
            input: "",
            type: "",
            sorted: "",
            search: false,
            result: [{}],

        }

        this.handleSearch = this.handleSearch.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSorted = this.handleSorted.bind(this);
        this.handleType = this.handleType.bind(this);
    }

    handleSearch(e){
        this.setState({
            input: e.target.value
        })

    }

    handleSubmit(){
        console.log(this.state.type)
        if(this.state.type === "Post"){
            axios.get("http://localhost:5000/posts/")
            .then(res =>{
                var new_result = [];
                for(var i = 0; i<res.data.length; i++){
                    if(res.data[i].title.includes(this.state.input)){
                        new_result.push(res.data[i])
                    }
                }
                this.setState({
                    result: new_result,
                    search: true
                })
            })
        } else if (this.state.type === "Video"){
            var API_KEY = "AIzaSyDSgtZAPwHkAT2bJkpFq95fjFtZ9lT3Dwk";

            gapi.load("client", loadClient);
            function loadClient() {
                return new Promise(function(resolve,reject){
                    gapi.client.setApiKey(API_KEY);
                    gapi.client.load('youtube', 'v3', resolve);
                });
            };
            loadClient().then(() => {
                return gapi.client.youtube.search.list({
                    "part": [
                        "snippet,id"
                    ],
                    "maxResults": 10,
                    "q": this.state.input
                })
                .then((response) => {
                    this.setState({
                        result: response.result.items,
                        search: true
                    })
                })
            })
        } else if (this.state.type === "User"){
            axios.get("http://localhost:5000/users/")
            .then(res =>{
                var new_result = [];
                for(var i = 0; i<res.data.length; i++){
                    if(res.data[i].username.includes(this.state.input)){
                        new_result.push(res.data[i])
                    }
                }
                this.setState({
                    result: new_result,
                    search: true
                })
                console.log(this.state.search)
            })
        }
        this.setState({
            search: false
        })
    }

    handleType(e){
        this.setState({
            type: e.target.value,
            search: false,
        })
    }

    handleSorted(e){
        this.setState({
            sorted: e.target.value
        })
    }

    postList(type){
        return this.state.result.slice(0, 10).map(result => {
            if(type === "Post"){
                return (
                <tr>
                    <td><img src={result.thumbnail} class="img-thumbnail" alt="..."/></td>
                    <td>{result.title}</td>
                    <td><Link to={"/profile/" + result.uploader}> {result.uploader}</Link></td>
                    <td><Link to={"/post/"+result._id}>View Post</Link></td>
                </tr>
                )
            } else if (type === "Video") {
                var video = result.snippet;
                return (
                <tr  onClick={() => {window.location = "https://www.youtube.com/watch?v=" + result.id.videoId}}>
                    <td><img src={video.thumbnails.default.url} class="img-thumbnail" alt="..."/></td>
                    <td><Link>{video.title}</Link></td>
                    <td>{video.channelTitle}</td>
                </tr>
                )
            } else if (type === "User"){
                return (
                    <tr>
                        <td><Link to={"/profile/"+ result.username}>{result.username}</Link></td>
                    </tr>
                    )
            }

        })
    }
    
    render(){
        return (
            <div>
                <div id="Search">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="floatingInput" value={this.state.input} onChange={this.handleSearch}/>
                        <label for="floatingInput">Search</label>
                    </div>
                    <select class="form-select" aria-label="Default select example" onChange={this.handleType} value={this.state.type}>
                        <option selected>Type</option>
                        <option value="Post">Post</option>
                        <option value="Video">Video</option>
                        <option value="User">User</option>
                    </select>
                    <button type="submit" onClick={this.handleSubmit} value={this.state.type}>Search</button>
                </div>
                <div id="Result">
                {this.state.search ? <h3>Search Result</h3> : void(0)}
                    <table className="table table-hover">
                        <tbody>
                            {this.state.search ? this.postList(this.state.type) : void(0)}
                        </tbody>    
                    </table>
                </div>
            </div>

        )
    }
}
