# DevTinder Web

A modern React-based frontend for **DevTinder**, a developer networking
platform that helps developers discover other developers, build
meaningful connections, and collaborate.

The application provides user authentication, developer profiles,
profile discovery, connection requests, connections management, and
real-time chat. This repository contains the **frontend application**;
it communicates with a separately deployed backend API.

## Table of Contents

1.  [Project Overview](#1-project-overview)
2.  [Objectives](#2-objectives)
3.  [Key Features](#3-key-features)
4.  [Technology Stack](#4-technology-stack)
5.  [How the Application Works](#5-how-the-application-works)
6.  [Project Architecture](#6-project-architecture)
7.  [Prerequisites](#7-prerequisites)
8.  [Installation and Setup](#8-installation-and-setup)
9.  [Environment Variables](#9-environment-variables)
10. [Running the Application](#10-running-the-application)
11. [Application Routes](#11-application-routes)
12. [Backend API Integration](#12-backend-api-integration)
13. [Authentication and State
    Management](#13-authentication-and-state-management)
14. [Real-Time Chat](#14-real-time-chat)
15. [Deployment](#15-deployment)
16. [Troubleshooting](#16-troubleshooting)
17. [Possible Future Improvements](#17-possible-future-improvements)
18. [Learning Outcomes](#18-learning-outcomes)
19. [Contributing](#19-contributing)
20. [Author](#20-author)

------------------------------------------------------------------------

## 1. Project Overview

**DevTinder Web** is the frontend of a developer networking application.
It is designed around the idea that developers should be able to find
and connect with other developers based on their interests, skills, and
professional profiles.

Users can create an account, complete their profile, explore developer
profiles, send or respond to connection requests, view accepted
connections, and communicate through chat.

The frontend is built with React and Vite. It uses Redux Toolkit for
application-wide state management, Axios for HTTP communication, and
Socket.IO Client for real-time communication.

> **Repository scope:** This repository contains the frontend.
> Authentication, data persistence, business logic, and API endpoints
> are provided by the separately running/deployed backend.

## 2. Objectives

-   Build a clean and responsive interface for a developer networking
    platform.
-   Make developer discovery and connection management straightforward.
-   Provide reusable React components.
-   Manage shared application data using Redux Toolkit.
-   Communicate with backend services through REST APIs.
-   Support real-time messaging through Socket.IO.
-   Handle authenticated requests using cookie-based credentials where
    configured by the backend.

## 3. Key Features

### 3.1 User Authentication

Authentication screens allow users to sign in and create an account. The
frontend sends the relevant credentials to the backend and handles the
response.

**Authentication** is the process of verifying a user's identity before
granting access to protected application features.

### 3.2 Developer Profile

Users can view and update profile information such as their name,
professional details, skills, and profile information supported by the
backend.

A **profile** is a structured representation of a user's information
inside the application.

### 3.3 Developer Feed

The feed displays developer profiles that users can explore. It provides
the primary discovery experience.

A **feed** is a continuously presented collection of relevant records or
content.

### 3.4 Connection Requests

Users can send connection requests and respond to requests they receive.
Depending on the available actions, users can accept or reject incoming
requests.

A **connection request** is a request sent by one user to establish a
connection with another user.

### 3.5 Connections

The connections section displays users whose connection requests have
been accepted.

A **connection** represents an established relationship between two
users in the application.

### 3.6 Real-Time Chat

The chat interface uses Socket.IO Client to support real-time
communication with the backend.

**Real-time communication** means that messages can be delivered as
events without requiring the user to manually refresh the page.

### 3.7 Additional Screens

The frontend also includes screens and flows for features such as
premium plans, premium checkout/success, password reset, support, and
contact, depending on backend configuration.

## 4. Technology Stack

  -----------------------------------------------------------------------
  Technology                          Purpose
  ----------------------------------- -----------------------------------
  React                               Builds the user interface using
                                      reusable components.

  Vite                                Provides the frontend development
                                      server and production build
                                      tooling.

  JavaScript                          Implements application logic and
                                      interactions.

  Redux Toolkit                       Manages shared application state.

  React Redux                         Connects React components to the
                                      Redux store.

  React Router                        Handles navigation between
                                      application pages.

  Axios                               Sends HTTP requests to backend
                                      APIs.

  Tailwind CSS                        Provides utility-based styling.

  DaisyUI                             Provides UI component styles built
                                      around Tailwind CSS.

  Socket.IO Client                    Enables real-time, event-based
                                      communication.

  ESLint                              Helps identify code-quality and
                                      potential JavaScript issues.
  -----------------------------------------------------------------------

## 5. How the Application Works

The application follows a frontend--backend architecture.

1.  The user opens the React application in a browser.
2.  React Router determines which page or component should be displayed.
3.  The user performs an action, such as logging in, updating a profile,
    or sending a connection request.
4.  The frontend sends an HTTP request to the backend using Axios.
5.  The backend validates the request, performs the required operation,
    and returns a response.
6.  The frontend updates the interface and, where appropriate, updates
    the Redux store.
7.  For chat, Socket.IO establishes a real-time connection and exchanges
    events with the backend.

### Important terms

-   **Frontend:** The part of an application that users see and interact
    with.
-   **Backend:** The server-side application responsible for business
    logic, validation, and data operations.
-   **API:** An interface through which two software systems
    communicate.
-   **REST API:** An API style that commonly uses HTTP methods such as
    GET, POST, PATCH, and DELETE.
-   **HTTP request:** A message sent by a client to a server to request
    an operation or resource.
-   **State:** Data that an application stores and uses to determine
    what should be displayed.
-   **Component:** A reusable, self-contained part of a React user
    interface.

## 6. Project Architecture

The repository is organized as a Vite + React frontend. The following is
a conceptual view of the important areas; exact filenames may differ as
the project evolves.

``` text
devTinder-web/
├── public/
├── src/
│   ├── components/
│   │   ├── AuthLayout
│   │   ├── Body
│   │   ├── Login
│   │   ├── Feed
│   │   ├── Profile
│   │   ├── EditProfile
│   │   ├── UserCard
│   │   ├── Connections
│   │   ├── Requests
│   │   ├── Chat
│   │   ├── NavBar
│   │   └── Footer
│   ├── utils/
│   │   ├── appStore
│   │   ├── userSlice
│   │   ├── feedSlice
│   │   ├── connectionSlice
│   │   ├── requestSlice
│   │   ├── constants
│   │   └── socket
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

### Main architectural areas

-   `components/`: Contains React UI components and page-level screens.
-   `utils/`: Contains shared utilities, Redux store/slices, API
    constants, and socket configuration.
-   `App.jsx`: Commonly acts as the application-level routing and layout
    entry point.
-   `main.jsx`: Mounts the React application into the HTML document.
-   `public/`: Stores static assets served directly by the frontend
    build system.
-   `package.json`: Defines dependencies and project scripts.

## 7. Prerequisites

Install the following before starting:

1.  **Node.js:** Use a current LTS release.
2.  **npm:** Installed with Node.js.
3.  **Git:** Required to clone the repository.
4.  **Code editor:** Visual Studio Code or another editor.
5.  **Backend API:** A compatible DevTinder backend must be running or
    deployed for authentication and data-driven features to work.

Check your installed versions:

``` bash
node -v
npm -v
git --version
```

## 8. Installation and Setup

### Step 1: Clone the repository

``` bash
git clone https://github.com/VikasKumar281/devTinder-web.git
```

### Step 2: Open the project directory

``` bash
cd devTinder-web
```

### Step 3: Install dependencies

``` bash
npm install
```

This command reads `package.json` and installs the packages required by
the project.

### Step 4: Configure environment variables

Create a `.env` file in the project root and configure the backend URL
and any client-side integration values required by your setup.

Example:

``` env
VITE_API_BASE_URL=http://localhost:7777
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Use the actual backend URL and Google OAuth client ID configured for
your environment. Do not commit private secrets. Variables prefixed with
`VITE_` are exposed to frontend code at build time, so never put server
secrets, database passwords, private API keys, or signing secrets in
them.

### Step 5: Start the development server

``` bash
npm run dev
```

Vite prints the local development URL in the terminal. Open that URL in
your browser.

## 9. Environment Variables

  ---------------------------------------------------------------------------
  Variable                  Description             Example
  ------------------------- ----------------------- -------------------------
  `VITE_API_BASE_URL`       Base URL of the backend `http://localhost:7777`
                            API.                    

  `VITE_GOOGLE_CLIENT_ID`   Google OAuth client ID  `your_google_client_id`
                            used by the frontend,   
                            if enabled.             
  ---------------------------------------------------------------------------

### Why use environment variables?

Environment variables allow configuration to change between local
development, testing, and production without hardcoding
environment-specific values throughout the source code.

**Important:** A frontend environment variable is not a secure storage
location. Anything bundled into a browser application can be inspected
by users. Keep confidential values on the backend.

## 10. Running the Application

### Development

``` bash
npm run dev
```

Starts the Vite development server with fast refresh.

### Production build

``` bash
npm run build
```

Creates an optimized production build, usually in the `dist/` directory.

### Preview production build locally

``` bash
npm run preview
```

Serves the generated production build locally so that it can be checked
before deployment.

### Lint the project

``` bash
npm run lint
```

Runs the configured ESLint checks.

## 11. Application Routes

The frontend includes page flows for the following route concepts. The
exact route paths should be checked against the current router
configuration before relying on them in external documentation.

  Page / route concept             Purpose
  -------------------------------- ------------------------------------------
  Home / `/`                       Main application entry point.
  Login / `/login`                 User sign-in.
  Feed / `/feed`                   Explore developer profiles.
  Profile / `/profile`             View the current user's profile.
  Connections / `/connections`     View accepted connections.
  Requests / `/requests`           Review received connection requests.
  User profile / `/user/:userId`   View another user's profile.
  Chat / `/chat/:targetUserId`     Chat with a selected connection.
  Password reset                   Start or complete a password-reset flow.
  Premium                          View available premium plans.
  Support / Contact                Access support-related screens.

## 12. Backend API Integration

The frontend communicates with a separately maintained backend through
HTTP APIs. The following are examples of API paths referenced by the
frontend integration; confirm the backend route definitions and HTTP
methods before using them as a formal API contract.

  -------------------------------------------------------------------------------
  API path                                    Purpose
  ------------------------------------------- -----------------------------------
  `GET /profile/view`                         Retrieve the logged-in user's
                                              profile.

  `POST /signup`                              Register a new user.

  `POST /login`                               Authenticate a user.

  `POST /auth/forgot`                         Start a password recovery flow.

  `GET /user/feed`                            Retrieve developer profiles for the
                                              feed.

  `GET /user/connections`                     Retrieve accepted connections.

  `GET /user/requests/received`               Retrieve received connection
                                              requests.

  `POST /request/review/:status/:requestId`   Review a connection request.

  `GET /chat/:targetUserId`                   Retrieve chat history with a user.

  `GET /user/view/:userId`                    Retrieve a user's public profile.

  `GET /premium/plans`                        Retrieve premium plan information.

  `GET /premium/status`                       Retrieve premium membership status.

  `POST /premium/checkout`                    Start a premium checkout flow.
  -------------------------------------------------------------------------------

### HTTP methods explained

-   **GET:** Retrieves information from the server.
-   **POST:** Sends data to the server, commonly to create a resource or
    initiate an operation.
-   **PUT:** Replaces a resource.
-   **PATCH:** Updates part of a resource.
-   **DELETE:** Removes a resource.

### Credentials and CORS

The frontend may send requests with `withCredentials: true` when
cookie-based authentication is used. In that setup, the backend must be
configured with an appropriate CORS origin and credential support.
Cookie settings such as `SameSite` and `Secure` must also match the
deployment environment.

**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism
that controls whether a frontend hosted on one origin can access a
backend hosted on another origin.

## 13. Authentication and State Management

### Authentication flow

1.  The user enters login or signup information.
2.  The frontend sends the information to the backend.
3.  The backend validates the credentials.
4.  The backend returns the response and establishes the configured
    authentication session.
5.  The frontend updates the user interface and shared state.
6.  Protected screens use the application's authentication state and
    backend authorization behavior.

The backend must enforce authorization. Hiding a frontend page or button
is not a replacement for server-side access control.

### Redux Toolkit

Redux Toolkit is used to organize shared application state.

-   **Store:** The central container that holds Redux state.
-   **Slice:** A section of state together with reducers and generated
    actions.
-   **Reducer:** A function that describes how state changes in response
    to an action.
-   **Action:** A description of an event or requested state update.
-   **Dispatch:** Sends an action to the Redux store.
-   **Selector:** Reads required data from the store.

The project includes state areas for user information, feed data,
connections, and requests.

## 14. Real-Time Chat

The frontend uses Socket.IO Client to communicate with the chat backend.

A typical chat flow is:

1.  The user opens a conversation.
2.  The frontend connects to the Socket.IO server.
3.  The client joins the conversation or chat room using the
    application's configured event contract.
4.  The user sends a message.
5.  The server processes and distributes the message.
6.  The recipient's client receives the message event and updates the
    chat interface.

**WebSocket** is a communication protocol that provides a persistent,
two-way connection between a client and server. **Socket.IO** is a
library that provides event-based communication and additional
connection-management features; it can use WebSocket as a transport.

The application integration references events such as `joinChat`,
`sendMessage`, and `messageReceived`. Event names and payload shapes
must match the backend implementation.

## 15. Deployment

The frontend can be deployed to platforms that support Vite static
builds, such as Vercel or Netlify.

### General deployment steps

1.  Push the latest frontend code to GitHub.
2.  Import the repository into the hosting platform.
3.  Set the build command to `npm run build`.
4.  Set the output directory to `dist`.
5.  Add the required environment variables in the hosting dashboard.
6.  Deploy the application.
7.  Confirm that the configured backend URL is reachable from the
    deployed frontend.
8.  Test login, profile loading, feed, connection requests, and chat.

### Production checklist

-   Set `VITE_API_BASE_URL` to the production backend URL.
-   Configure backend CORS for the deployed frontend origin.
-   Verify cookie and credential settings if cookie authentication is
    used.
-   Confirm that OAuth redirect/origin settings include the production
    domain, if OAuth is enabled.
-   Test all important user flows after deployment.
-   Do not expose backend secrets in frontend environment variables.

### Live Demo

[DevTinder Web -- Live
Application](https://dev-tinder-web-gules.vercel.app/)

## 16. Troubleshooting

  -----------------------------------------------------------------------
  Problem                 Possible reason         What to check
  ----------------------- ----------------------- -----------------------
  API request fails       Backend is offline or   Check
                          base URL is incorrect.  `VITE_API_BASE_URL` and
                                                  backend availability.

  Login does not persist  Cookie or credential    Check Axios
                          configuration is        credentials, CORS, and
                          incorrect.              cookie settings.

  CORS error              Backend does not allow  Configure the exact
                          the frontend origin.    frontend origin on the
                                                  backend.

  Chat does not connect   Socket server URL or    Check socket
                          event contract is       configuration and
                          incorrect.              backend events.

  Environment variable is Variable name or `.env` Check the `VITE_`
  undefined               location is incorrect.  prefix and restart Vite
                                                  after changes.

  Production page refresh Hosting rewrite rules   Configure SPA
  returns 404             are missing for         fallback/rewrite rules
                          client-side routes.     on the hosting
                                                  platform.
  -----------------------------------------------------------------------

## 17. Possible Future Improvements

-   Add automated component and integration tests.
-   Improve accessibility, keyboard navigation, and screen-reader
    support.
-   Add pagination or infinite scrolling to developer discovery.
-   Add richer developer search and skill filters.
-   Add chat delivery/read indicators and typing status.
-   Add notification preferences.
-   Improve loading, empty, and error states.
-   Add stronger form validation and user-friendly error messages.
-   Add a documented API contract shared with the backend.
-   Add a continuous integration workflow for linting and production
    builds.

## 18. Learning Outcomes

Working with this project provides practical experience with:

1.  **React component architecture:** Breaking a user interface into
    reusable components.
2.  **Routing:** Building multi-page experiences in a single-page
    application.
3.  **State management:** Sharing data across components with Redux
    Toolkit.
4.  **API integration:** Communicating with backend services using
    Axios.
5.  **Authentication integration:** Handling authenticated frontend
    flows and credentialed requests.
6.  **Real-time systems:** Connecting a browser client to a Socket.IO
    server.
7.  **Environment configuration:** Managing local and production API
    settings.
8.  **Deployment:** Building and hosting a Vite-based frontend
    application.
9.  **Debugging:** Investigating browser, network, API, and
    state-related issues.

## 19. Contributing

Contributions and suggestions are welcome.

1.  Fork the repository.
2.  Create a feature branch.
3.  Make your changes.
4.  Run the lint command and production build.
5.  Test the affected user flows.
6.  Commit your changes with a clear message.
7.  Open a pull request describing the changes.

Example:

``` bash
git checkout -b feature/your-feature
npm install
npm run lint
npm run build
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

## 20. Author

**Vikas Kumar**

-   GitHub: [VikasKumar281](https://github.com/VikasKumar281)
-   LinkedIn: [Vikas
    Kumar](https://www.linkedin.com/in/vikaskumar-fullstack/)

------------------------------------------------------------------------

If you find this project useful, consider giving the repository a star.
