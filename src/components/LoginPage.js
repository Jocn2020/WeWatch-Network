import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';
import firebase from "firebase/app";
import "firebase/auth";
import { auth } from "./firebase";

export default class LoginPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:"",
            password:"",
            error:""
        }

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });   
    }

    onChangePassword(e){
        this.setState({
            password: e.target.value
        })
    }

    onSubmit(e) {
        var email = this.state.email;
        var password = this.state.password;
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                console.log(user)
                return this.props.history.push('/');
                // ...
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
                // ..
            });
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                return this.props.history.push('/');
            }
        });
    }

    render(){
        return (
            <div class="container">
                <h3>User Login</h3>
                <div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Email address</label>
                        <input type="email" class="form-control" aria-describedby="email" value={this.state.email} onChange={this.onChangeEmail}/>
                        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Password</label>
    <                   input type="password" class="form-control" id="Password" value={this.state.password} onChange={this.onChangePassword}/>
                    </div>
                    <button type="submit" class="btn btn-primary" onClick={this.onSubmit}>Submit</button>
                </div>
                <label class="form-label">Don't have account?</label>
                <a href="/sign_up" class="btn btn-link" tabindex="-1" role="button" aria-disabled="true">Sign Up</a>
            </div>
        )
    }
}