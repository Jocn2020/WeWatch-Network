import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';
import { auth } from "./firebase";
import axios from 'axios';

export default class SignUpPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            username:"",
            email:"",
            password:"",
            passwordCheck:"",
        }

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePasswordCheck = this.onChangePasswordCheck.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });   
    }

    onChangeEmail(e){
        this.setState({
            email: e.target.value
        })
    }

    onChangePassword(e){
        this.setState({
            password: e.target.value
        })
    }

    onChangePasswordCheck(e){
        this.setState({
            passwordCheck: e.target.value
        })
    }

    onSubmit(e){
        e.preventDefault();
        if (this.state.password === '') {
            this.setState({
                error: 'Password must be at least 8 digits'
            })
            alert(this.state.error);
        }
        else if (this.state.password != this.state.passwordCheck) {
            this.setState({
                password: '',
                passwordCheck: '',
            });
            alert('Password unmatched');
        } else {
            var email = this.state.email;
            var password = this.state.password;
            var username = this.state.username;
            auth.createUserWithEmailAndPassword(email, password)
                .then(function(result) {
                    return result.user.updateProfile({
                    displayName: username
                    })
                })
                .then((userCredential) => {
                    // Signed in 
                    const new_user = {
                        username: username,
                        email: email
                    };
                    axios.post('http://localhost:5000/users/add', new_user)
                    .then((res) => {console.log(res.data)})
                    .then(()=> this.props.history.push('/'));
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    alert(errorMessage)
                    e.target.value = ''
                    // ..
                });
        }
    }

    showError() {
        if (this.state.error != '') {
            alert(this.state.error);
        }
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
            <div>
                <h3>Create New User</h3>
                <div>
                    <div class="mb-3">
                        <label class="form-label">Username</label>
    <                   input type="text" class="form-control" value={this.state.username} onChange={this.onChangeUsername}/>
                    </div>
                    <div class="mb-3">
                        <label  class="form-label">Email address</label>
                        <input type="email" class="form-control" aria-describedby="email" value={this.state.email} onChange={this.onChangeEmail}/>
                        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Password</label>
    <                   input type="password" class="form-control" id="Password" value={this.state.password} onChange={this.onChangePassword}/>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Confirm Password</label>
    <                   input type="password" class="form-control" id="confirmPassword" value={this.state.passwordCheck} onChange={this.onChangePasswordCheck}/>
                    </div>
                    <button type="submit" class="btn btn-primary" onClick={this.onSubmit}>Submit</button>
                </div>
                <label class="form-label">Already have account?</label>
                <a href="/login" class="btn btn-link" tabindex="-1" role="button" aria-disabled="true">Login Here</a>
            </div>
        )
    }
}