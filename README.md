#TalentQL - Junior NodeJS Assessment

---
###Start
run npm install to install the dependencies and then npm start to run the app

###Database
For this project, I made use of mongoDB. To create a database, you need to add a "MONGO_URI" key to a .env file. The other content of the .env file is "JWT_SECRET" which is used for authentication.

##Backend
###Project Flow
There are two (2) models in this project, Posts and Users.
A User can register with an email and password and before the user account is created, a check is done to ensure that the user does not already exist. Once the account is created, a token is generated. When a user logs in with either their usename or password, a token is also generated. The token that is generated would need to be included in the request headers for any subsequent request such as creating a post, getting a post, updating and deleting posts that he/she has available. The token would be included in a Bearer Authentication format i.e. Authorization: Bearer <token>

###Routes
The various RESTFUL api routes are available.
#####/api/users/ (POST)
This is to create a new user
#####/api/users/login (POST)
This is for logging in an existing user
#####/api/posts/ (GET)
The response is an array containing JSON objects of all the posts that the particular authorized user has.
#####/api/posts/ (POST)
This route is for adding a new post.
#####/api/posts/:id (GET)
This api route fetches details about a particular post
#####/api/posts/:id (PATCH)
This route is used to update details about a particular post
#####/api/posts/:id (DELETE)
This route is used to delete a particular user post.

###Models
There are two models. The Posts and the User.
#####Posts
The posts model has a required field (content) when creating a new post.
#####Users
The users model has required email and password fields when creating a user and also for logging the user in.

###Authentication
JsonwebToken is used to handle authentication. The user's email and password is used to create a token. And there is a middleware that helps to check if an incoming request is authenticated. If it isn't, it sends back a 401, but if it is, it passes on to the next handler with a populated req.user field. The req.user is the user that matches the email and password that is gotten from the decoded token. In signing and verifying the jwt token, the functions make use of an environment variable "JWT_SECRET"