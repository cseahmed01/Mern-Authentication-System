# MERN Authentication System

A full-stack authentication application built with the MERN stack (MongoDB, Express.js, React, Node.js) that provides user registration, login, and protected dashboard functionality.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Responsive UI with Bootstrap
- Cookie-based session management

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Bootstrap** - CSS framework
- **React Testing Library** - Testing utilities

## Project Structure

```
Mern-Auth/
├── Backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   ├── Navbar.js
│   │   │   ├── Register.js
│   │   │   └── TestComponent.jsx
│   │   ├── api.js
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
├── README.md
└── .git/
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Backend directory with the following variables:
   ```
   MONGO_URI=mongodb://localhost:27017/mern-auth
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

## Usage

1. Ensure MongoDB is running on your system or update the `MONGO_URI` in the `.env` file to point to your MongoDB instance.

2. Start the backend server:
   ```bash
   cd Backend && npm run dev
   ```

3. In a new terminal, start the frontend:
   ```bash
   cd frontend && npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

5. Register a new account or login with existing credentials.

6. Access the protected dashboard after successful authentication.

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify user authentication (protected)

## Environment Variables

Create a `.env` file in the Backend directory with:

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `PORT`: Port for the backend server (default: 5000)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
