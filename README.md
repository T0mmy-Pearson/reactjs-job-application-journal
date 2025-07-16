# React Job Application Journal

A modern web app to track your job applications, rejections, affirmations, and todos. Built with React, Vite, and Firebase.

## Features
- Add, edit, and delete job applications
- Track rejections and view a "rejection pile"
- Calendar integration for application deadlines
- Affirmations panel for motivation
- To-do list for job search tasks
- User authentication (Firebase Auth)
- Feedback form
- Theming and settings

## Demo
To run the app locally, follow the instructions below.

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 1. Clone the repository
```sh
git clone https://github.com/T0mmy-Pearson/reactjs-job-application-journal.git
cd reactjs-job-application-journal
```

### 2. Install dependencies
```sh
npm install
```

### 3. Set up Firebase
This project uses Firebase for authentication and data storage. The default configuration is in `src/firebase.js`. You can use your own Firebase project by replacing the config object in that file.

- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project
- Enable Authentication (Email/Password)
- Create a Firestore database
- Copy your Firebase config and replace it in `src/firebase.js`

### 4. Start the development server
```sh
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173) (or as shown in your terminal).

## Build for Production
```sh
npm run build
```
The output will be in the `dist/` folder.

## Linting
```sh
npm run lint
```

## Project Structure
```
reactjs-job-application-journal/
├── public/                # Static assets
├── src/                   # Source code
│   ├── components/        # React components
│   ├── assets/            # Images and SVGs
│   ├── App.jsx            # Main app component
│   ├── firebase.js        # Firebase config
│   └── ...
├── index.html             # HTML template
├── package.json           # Project metadata and scripts
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## Dependencies
- React
- Vite
- Firebase
- react-firebase-hooks
- react-icons
- @emailjs/browser (for feedback form)

## License
MIT

