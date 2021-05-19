import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { auth } from './firebase'; 
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa';

export default class Post extends Component {
    constructor(props){
        super(props);

        this.state = {
            title: "",
            video_url: "",
            description: "",
            uploaded_at: Date.parse(new Date()),
            uploader: "",
            like: false,
            likes_num: 0,
            username: "",
            curr_comment: "",
            comments: [],
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleAddComment = this.handleAddComment.bind(this);
        this.handleLike = this.handleLike.bind(this);
        this.handleLikeCommentShare = this.handleLikeCommentShare.bind(this);
        this.handleCurrComment = this.handleCurrComment.bind(this);
        this.showComment = this.showComment.bind(this);
    }

    componentDidMount(){
        var loc = this.props.location.pathname;
        auth.onAuthStateChanged((user) => {
            var curr_user = "";
            var like = false;
            if (user) {
                curr_user = user.displayName;
              // get User info about username and like the post or not
            } 
            axios.get(`http://localhost:5000/posts/${loc.replace('/post/', '')}`)
                .then(res => {
                    if(res != null){
                        like = res.data.likes.includes(curr_user);
                    this.setState({
                        title: res.data.title,
                        video_url: res.data.vidurl,
                        description: res.data.description,
                        uploaded_at: res.data.createdAt,
                        uploader: res.data.uploader,
                        likes_num: res.data.likes.length,
                        comments: res.data.comments,
                        username: curr_user,
                        like: like
                    })
                    }
                })
                .catch(err =>{
                    alert(err);
                })
        })
        console.log(this.props.location.pathname.replace('/post/', ''));
    }

    handleLike(e){
        if(this.state.username == ""){
            alert("Please login first");
        }
        else{
            if(this.state.like){
                this.setState({
                    like: false,
                    likes_num: this.state.likes_num - 1,
                })
            }
            else{
                this.setState({
                    like: true,
                    likes_num: this.state.likes_num + 1,
                })
            }
            const new_like = {
                type: "like",
                like: !(this.state.like),
                username: this.state.username,
            }

            this.handleLikeCommentShare(new_like);
        }
    }

    handleAddComment(e){
        if(this.state.username == ""){
            e.target.value = "";
            alert("Please login first");
        }
        else{
            const new_comment = {
                type: "comment",
                comment: true,
                username: this.state.username,
                message: this.state.curr_comment,
                date: new Date()
            }
            this.handleLikeCommentShare(new_comment);
            var new_arr = this.state.comments;
            new_arr.push(({
                username: this.state.username,
                comment: this.state.curr_comment,
                date: (new Date().toDateString()) + ", " + (new Date().toTimeString())
            }))
            console.log(new_arr)
            this.setState({
                comments: new_arr
            })
            this.props.history.push(this.props.location.pathname);
        }
        e.target.value = "";
        this.setState({
            curr_comment: "",
        })
    }

    handleLikeCommentShare(item){
        var loc = this.props.location.pathname;
        item.post = loc.replace('/post/', '');
        axios.post(`http://localhost:5000/posts/like-comment-share/${loc.replace('/post/', '')}`, item)
        .then(res => console.log(res.data))
        .catch(err => alert(err));

        axios.post(`http://localhost:5000/users/${item.type}`, item)
        .then(res => console.log(res.data))
        .catch(err => alert(err))
    }

    handleCurrComment(e){
        this.setState({
            curr_comment: e.target.value
        });
    }

    showComment(comments){
        console.log(comments)
        return(
            comments.map(currcomment =>{
                return (
                    <tr>
                        <td>{currcomment.comment}</td>
                        <td>{currcomment.username}</td>
                        <td>{currcomment.date}</td>
                    </tr>
                )
            })
        )
    }


    render() {
        return (
            <div class="container">
                <h3>{this.state.title}</h3>
                <div className="uploader">Posted by: {this.state.uploader}</div>
                <textarea value={this.state.description}/>
                <ReactPlayer url={this.state.video_url} controls={true}/>
                <h6>Uploaded at: {this.state.uploaded_at}</h6>
                <tr>
                    <td>
                        likes: {this.state.likes_num} 
                    </td>
                    <td>
                        {this.state.like ? <FaThumbsUp onClick={this.handleLike}/> : <FaRegThumbsUp onClick={this.handleLike}/>}
                    </td>
                </tr>
                <div>
                    <input type="text" onChange={this.handleCurrComment} value={this.state.curr_comment} placeholder="Insert comment here"/>
                    <button type="submit" onClick={this.handleAddComment}>Comment</button>
                </div>
                <table className="table">
                    <tbody>
                        {this.showComment(this.state.comments)}
                    </tbody>
                </table>
            </div>
        )
    }
}
