import React, { Component } from 'react';
import { render } from 'react-dom';
import { auth } from './firebase';
import  axios  from 'axios';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


export default class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            profileName:"",
            date_Joined: "",
            posts: [{}],
            edit: false,
            status: "",
            anchorEl: null,
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.showUserPost = this.showUserPost.bind(this);
        this.findPosts = this.findPosts.bind(this);
        this.handleRelation = this.handleRelation.bind(this);
        this.handleButtonPress = this.handleButtonPress.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    

    findPosts(loc) { // get current profile postings
        console.log(loc)
        axios.get(`http://localhost:5000/posts/posted-by/${loc.replace('/profile/', '')}`)
        .then(res => {
            console.log(res.data)
            this.setState({
                posts: res.data
            })
        })
        .catch(err =>{
            alert(err);
        })
    }

    componentDidMount(){
        var profile_name = this.props.location.pathname.replace('/profile/', ''); // get username
        auth.onAuthStateChanged((user) => {
            if (user) {
                var relation = "";

                    axios.all([ // get both users friend info
                        axios.get(`http://localhost:5000/users/get-user/${user.displayName}`),
                        axios.get(`http://localhost:5000/users/get-user/${profile_name}`)
                    ])
                    .then(axios.spread((curruser, currprofile) => {
                        console.log(curruser.data.friends);
                        var user_friend = curruser.data.friends.includes(profile_name);
                        var profile_friend = currprofile.data.friends.includes(user.displayName)
                        if(user_friend){
                            if(profile_friend){
                                relation = 'friend';
                            } else {
                                relation = 'requested';
                            }
                        } else {
                            if(profile_friend){
                                relation = 'accept?';
                            } else {
                                relation = 'nothing';
                            }
                        }

                        if(user.displayName == profile_name){
                            relation = 'self';
                        }

                        this.setState({
                            username: user.displayName,
                            profileName: profile_name,
                            status: relation // current friend status with user in profile
                        })
                    }))
                    .then(this.findPosts(this.props.location.pathname))
                }
            else{
                this.setState({
                    profileName: profile_name,
                    status: "anonymous"
                })
                this.findPosts(this.props.location.pathname)
            }
              // User is signed in.
            })
    }

    showUserPost(){
        return this.state.posts.map(currpost => {
            console.log(currpost);
            return (
            <tr>
                <td><img src={currpost.thumbnail} class="img-thumbnail" alt="..."/></td>
                <td>{currpost.title}</td>
                <td><Link to={"/profile/" + currpost.uploader}>{currpost.uploader}</Link></td>
                <td><Link to={"/post/"+currpost._id}>View Post</Link></td>
            </tr>
            )
        })
    }


    useStyles() {
    return makeStyles((theme) => ({
        root: {
          display: 'flex',
          flexwrap: 'wrap',
          justifyContent: 'space-around',
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
        },
        gridList: {
          width: 500,
          height: 450,
        },
        icon: {
          color: 'rgba(255, 255, 255, 0.54)',
        },
      }))};

    handleButtonPress(e){
        var buttonPressed = e
        console.log(e)
        var friend = null
        if(buttonPressed === 'add'){
            friend = {
                username: this.state.username,
                friend: this.state.profileName,
            }
            axios.post('http://localhost:5000/users/add-friend', friend)
            .then(() => {
                this.setState({
                    status: 'requested'
                })
            })
            .catch(err => alert(err))
        } else if(buttonPressed === 'accept'){
            friend = {
                username: this.state.username,
                friend: this.state.profileName,
            }
            axios.post('http://localhost:5000/users/add-friend', friend)
            .then(() => {
                this.setState({
                    status: 'friend'
                })
            })
        } else if(buttonPressed === 'reject'){
            friend = {
                username: this.state.profileName,
                friend: this.state.username,
            }
            axios.post('http://localhost:5000/users/remove-friend', friend)
            .then(() => {
                this.setState({
                    status: 'nothing'
                })
            })
        } else if(buttonPressed === 'cancel'){
            friend = {
                username: this.state.username,
                friend: this.state.profileName,
            }
            axios.post('http://localhost:5000/users/remove-friend', friend)
            .then(() => {
                this.setState({
                    status: 'nothing'
                })
            })
        } else if(buttonPressed == 'unfriend'){
            console.log("say")
            var friend1 = {
                username: this.state.username,
                friend: this.state.profileName,
            }
            var friend2 = {
                username: this.state.profileName,
                friend: this.state.username
            }

            axios.all([
                axios.post('http://localhost:5000/users/remove-friend', friend1),
                axios.post('http://localhost:5000/users/remove-friend', friend2)
            ])
            .then(() => {
                this.setState({
                    status: 'nothing'
                })
            })
        }
    }


    handleClick(e){
        this.setState({
            anchorEl: e.target
        })
    }
    
    handleClose(){
        this.setState({
            anchorEl: null
        })
    }

    handleRelation() {
        var button = null;
        if(this.state.status == "nothing"){
            button = <button class="btn btn-primary" type="submit" onClick={this.handleButtonPress.bind(this, "add")}>Add Friend</button>
        } else if (this.state.status === "accept?"){
            button = 
            <div>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick} color="secondary" variant="contained">
              Friend Request
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.handleButtonPress.bind(this, "accept")}>Accept</MenuItem>
              <MenuItem onClick={this.handleButtonPress.bind(this, "reject")}>Reject</MenuItem>
            </Menu>
          </div>
        } else if (this.state.status === "requested"){
            button = 
            <div>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick} color="secondary" variant="contained">
              Friend Requested
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.handleButtonPress.bind(this, "cancel")}>Cancel Request</MenuItem>
            </Menu>
          </div>
        } else if (this.state.status === "friend"){
            button = 
            <div>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick} color="primary" variant="contained">
              Friend
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.handleButtonPress.bind(this, "unfriend")}>Unfriend</MenuItem>
            </Menu>
          </div>
        }

        return button;
    }

    handleDropDown() {
        document.getElementById("dropdown-menu").classList.toggle("show");
    }

    
    render(){
        const style = this.useStyles();
        return (
            <div >
                <h1>This is Profile Page</h1>
                <h3>Username: {this.state.profileName}</h3>
                <h4>Posting List</h4>
                {this.handleRelation()}
                <div className={style.root}>
                <GridList className={style.gridList} >
                    <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                        <ListSubheader component="div">Post List</ListSubheader>
                    </GridListTile>
                    {this.state.posts.map((currpost) => (
                    <GridListTile cols={0.5} onClick={() => window.location="/post/"+currpost._id} flexwrap="wrap">
                        <img src={currpost.thumbnail} alt='' />
                    <GridListTileBar
                        title={currpost.title}
                    />
                    </GridListTile>
                    ))}
                </GridList>
                </div>

            </div>
        )
    }
}
