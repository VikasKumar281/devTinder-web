# DevTinder
- Created a Vite + React application
- Remove unecessary code an create a Hello World app
- Install Tailwind CSS
- Install Daisy UI
- Add NavBar component to App.jsx
- Creata a seperate NavBar.jsx component file 
- Install react router dom
- Create BrowserRouter > Routes > Route = / Body > RouteChildren
- Create an Outlet in your Body component
- Create a Footer
- Create a Login Page
- Install Axios
- CORS - Install CORS in backend => add middleware to with configurations: origin and credentials: true
- Whenever you are making API call so pass axios => { withCredentials: true }
- Install react-redux and @reduxjs/toolkit - https://redux-toolkit.js.org/tutorials/quick-start => configureStore => Provider => createSlice => add reducer to the redux store(appStore)
- Add redux devtools in chrome
- Login and see if your data is coming properly in the store 
- NavBar should update as soon as user logs in 
- Refator our code to add constants file + create a components folder
- You should not be access other routes without login
- If token is not present , redirect user to login page
- Logout feature
- Get the feed and add the feed in the store
- build the user card on feed
- Edit Profile Feature
- Show Toast message on save of profile
- New Page - See all my connections
- New Page - See all my connections requests
- Feature - Accept/Reject Connection Requests
- Send Ignore/Interested request to the user from the feed 
- SignUp the New User
- Final testing 



# Real Time Chat using Websocket(Socket.io) =>

   - Build the UI for a chat window on /chat/:targetUserId 
   - Setup socket.io in backend
   - npm i socket.io
   - Setup Frontend socket.io-client
   - Initialise the chat
   - Create Socket Connection
   - Listen to events 