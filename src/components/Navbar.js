import React, { Component } from 'react';
import { render } from 'react-dom';
import "firebase/auth";
import { auth } from "./firebase";
import { FaTimes, FaBars } from 'react-icons/fa';

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            message: '',
            signed: false,
        }

        this.showUser = this.showUser.bind(this);
    }

    signingOut() {
        auth.signOut()
            .then(() => {
                this.setState({
                    username: '',
                    email: '',
                    message: 'Please Login First',
                    signed: false
                })
            });
    }

    inAndOut() {
        if (this.state.signed) {
            return (
                <a class="nav-link active" aria-current="page" href='/' onClick={() => { this.signingOut() }}>Log out</a>
            )
        } else {
            return (
                <a class="nav-link active" aria-current="page" href="/login">Login/Sign Up</a>
            )
        }
    }

    showUser() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    username: user.displayName,
                    signed: true
                });
                console.log(user);
                // User is signed in.
            } else {
                // No user is signed in.
                this.setState({
                    message: 'Please Login First',
                    signed: false
                })
            }
        });
    }

    componentDidMount() { // same as useEffect
        this.showUser();
    }

    handleClick() {
        this.setState({
            click: !(this.state.click)
        })
    }

    handleActive() {
        if(this.state.click){
            return " active";
        } else{
            return "";
        }
    }


    render() {
        var authentication_button = this.inAndOut();
        return (
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">WeWatch</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        {this.state.signed ? <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/add-post">Add Post</a>
                        </li>: void(0)}
                        {this.state.signed ? <li class="nav-item">
                            <a class="nav-link active" href={this.state.signed ? ('/profile/' + this.state.username) : '/' }>Profile</a>
                        </li> : void(0)}
                        <li class="nav-item">
                            <a class="nav-link active" href='/advanced-search'>Search</a>
                        </li>
                        {this.state.signed ? <li class="nav-item">
                            <a class="nav-link active" href='/friends'>Friends</a>
                        </li> : void(0)}
                        <li className="nav-item-right">
                            {authentication_button}
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>
        )
    }
}