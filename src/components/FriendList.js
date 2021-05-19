import axios from 'axios';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';
import { auth } from './firebase';


export default class FriendPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            username: "",
            friends: [],
        }
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    friendList(){
        console.log(this.state.friends)
        return this.state.friends.map(curruser => {
            return (
            <tr>
                <td><Link to={"/profile/" + curruser}>{curruser}</Link></td>
            </tr>
            )
        })
    }

    componentDidMount(){
        auth.onAuthStateChanged((user) => {
            if (user) {
                axios.get(`http://localhost:5000/users/get-user/${user.displayName}`)
                .then((res) => {
                    this.setState({
                        username: user.displayName,
                        friends: res.data.friends
                    })
                })
                .catch(error=> alert(error));
            }
        })
    }

    render(){
        return (
            <div>
                <h1>Friend List</h1>
                <table className="table">
                    <tbody>
                        {this.friendList()}
                    </tbody>
                </table>
            </div>
        )
    }
}