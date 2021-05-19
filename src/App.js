import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import AddPost from "./components/AddPost";
import Post from "./components/Post";
import AdvancedSearch from "./components/AdvancedSearch";
import FriendPage from "./components/FriendList";

function App() {
  return (
    <Router>
      <div className="container">
      <Navbar/>
      <br/>
      <Route path="/" exact component={HomePage}/>
      <Route path="/post/:postId" component={Post}/>
      <Route path="/add-post" component={AddPost}/>
      <Route path="/profile/:id" component={Profile}/>
      <Route path="/login" component={LoginPage}/>
      <Route path="/sign_up" component={SignUpPage}/>
      <Route path="/advanced-search" component={AdvancedSearch}/>
      <Route path="/friends" component={FriendPage}/>
      </div>
    </Router>
  );
}


export default App;
