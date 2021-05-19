import axios from 'axios';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';
import { auth } from './firebase';


export default class HomePage extends Component {
    constructor(props){
        super(props);

        this.state = {
            username: "",
            posts: [],
        }
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    postList(){
        return this.state.posts.map(currpost => {
            return (
            <tr>
                <td><img src={currpost.thumbnail} class="img-thumbnail" alt="..."/></td>
                <td>{currpost.title}</td>
                <td><Link to={"/profile/" + currpost.uploader}>{currpost.uploader}</Link></td>
                <td><Link to={"/post/"+currpost._id}>View Post</Link></td>
                {this.deletePost(currpost)}
            </tr>
            )
        })
    }

    deletePost(currpost){
        if(this.state.username == currpost.uploader){
            return (
            <td><Link to={"/post/"+currpost._id}>View Edit</Link></td>
            )
        }
    }

    componentDidMount(){
        auth.onAuthStateChanged((user) => {
            var curr_user = null;
            if (user) {
                curr_user = user;
                this.setState({
                    username: curr_user.displayName
                })
            } else {
                alert('Make sure you login first in order to access all features')
            }
        })
        axios.get('http://localhost:5000/posts')
        .then((res) => {
            this.setState({
                posts: res.data
            })
        })
        .catch(error=> alert(error));
    }

    render(){
        return (
            <div>
                <h1>Posted Videos</h1>
                <table className="table">
                    <tbody>
                        {this.postList()}
                    </tbody>
                </table>
            </div>
        )
    }
}