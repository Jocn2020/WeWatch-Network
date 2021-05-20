# WeWatch Network
WeWatch Network is a Social Media Web Application where users can shared their favourite youtube video and make a post for everyone. Users can also interact with another user and get friends to have fun.<br />
This website can be accessed in https://wewatch-network.herokuapp.com/.<br />
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).<br />

## Features
These are the following features for this App, more updates in the future:
1. Video Post<br />
   User can create a video post containing title, description and youtube video url. Moreover, User can watch another users posts on the homepage. (currently edit post hasn't implemented yet). 
2. User Authentication<br />
   User can sign up and make their account in order to fully access all features available and easier to interact. The authentication was implemented using Firebase and stored the user authentication data on Google Cloud Platform (GCP).
3. Like and Comment<br />
   On each post, if the user like the post, they can appreciate it by pressing the like button. User can also comment regarding the post to share their thought.
4. Advanced Search<br />
   There are 3 search features currently available for the user, will show first 10 results available:
   1. Post Search: Search available post which have title related to the following search (Capital Sensitive).
   2. Video Search: Search Video from youtube and showed first 10 relevant videos based on youtube recommendation (Implemented using Youtube Search API).
   3. User Search: Search available user currently registered on the website.
5. Friends Features<br />
   Friend feature is available in order to make easier user interaction. There are 4 states on friend connection:
   1. Add Friend, User can add another user to become friend. Then, wait for another user to accept friend request.
   2. Accept Request, User can either accept or reject friend request from another user.
   3. Friend Requested, User in state of waiting its request to be accepted, can cancel the request as well.
   4. Friend, User and another user have become friend.
6. User Profile<br />
   Each user will have their own profile and can see another user profile. The profile contains username, friend status and all posts from the profile's user.
   
## Tools/Framework
This website was build using the following tools/framework:
1. ReactJS, using component class to maintain almost all frontend function and backend request.
2. NodeJS, for backend and handling database model.
3. ExpressJS, handling server-side for NodeJS framework.
4. MongoDB, storing all model database in NoSQL database form.
5. Firebase, handling user authentication and session.
6. Youtube API, handling youtube request for getting video's data and perfom youtube search.
7. Bootstrap and MaterialUI, handling frontend page HTML design.
8. ReactPlay, enabling video play in webpage.


## Future Updates
In the next update, These following updates will be added for user convinience:
1. Post and Profile Edit<br />
   User will be able to edit their own post (title and description) and profile (self desciption).
2. Friends Request and Post Notification<br />
   User will be notified when there's friend request from another user
3. Save and Share Post<br />
   User will be able save their preferrenced video and share some fun posts to their friends.
4. Post Tags<br />
   User will be able to add tags which relevant to their post. Search features based on tags will also be available.
5. Chat Features<br />
   User will have chat features to send messages to their friend or anyone.
7. Improving Web Design<br />
   In current state, most of the program were just focuss on its functionality. Currently I also learn how to make responsive frontend using css/scss.
