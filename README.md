# Talvix

A comprehensive and modern **AI-powered Resume Builder** application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🚀 Features

### 👤 Authentication & Authorization
- **Secure Authentication**: Email/Password-based login with JWT (JSON Web Tokens) for secure session management.
- **Password Reset**: Flow for secure password recovery.
- **Role-Based Access Control**:
  - **Regular Users**: Can create and manage their resumes.
  - **Admins**: Full access to user management and system controls.

### 🏗️ Resume Building
- **Multi-Section Editor**: Create comprehensive resumes with ease.
- **Sections Include**:
  - Professional Summary
  - Skills (with custom categories)
  - Work Experience (Company, Role, Dates, Description)
  - Projects (Title, Description, Technologies, Duration, Link)
  - Education (Degree, Institution, Dates)
  - Certification (Name, Issuing Body, Date, Credentials Link)

### 🤖 AI-Powered Tailoring (`/tailor-resume`)
- **AI Assistance**: Get smart suggestions for your resume content.
- **Job Matching**: Analyze job descriptions to tailor your resume and highlight relevant skills and experiences.

### 🎨 Professional Templates & Preview
- **Multiple Templates**: Choose from a variety of professionally designed templates.
- **Real-time Preview**: See exactly how your resume looks as you edit.
- **Download & Share**: Generate professional PDF resumes for download or sharing.

## 🛠️ Tech Stack

### Frontend
- **React**: UI library for building the user interface.
- **Vite**: Fast build tool and development server.
- **React Router**: For client-side navigation.
- **HTML5 & CSS3**: For styling.

### Backend
- **Node.js**: JavaScript runtime for the server.
- **Express.js**: Web framework for building the API.
- **MongoDB**: NoSQL database for storing user data and resumes.
- **JWT (jsonwebtoken)**: For authentication.
- **Dotenv**: For managing environment variables.
- **Bcrypt.js**: For secure password hashing.
- **Cors**: For enabling Cross-Origin Resource Sharing.

## 🔌 Setup Instructions

Follow these steps to set up and run the project locally.

### Prerequisites
- Node.js (v14 or higher recommended)
- MongoDB (running locally or cloud instance like MongoDB Atlas)

### 1. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory and add your MongoDB connection string and other configurations:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_secure_jwt_secret
   # Optional: Set this email to an admin user for access
   ADMIN_EMAIL=your_email@example.com
   ```

4. Start the server:
   ```bash
   npm run server
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to `http://localhost:5173` to access the application.

## 📂 Project Structure

```
Resume-Builder/
├── client/          # React Frontend
│   ├── src/
│   │   ├── components/  # UI Components (Header, Footer, etc.)
│   │   ├── pages/       # Page components (Home, Dashboard, etc.)
│   │   ├── services/    # API service functions
│   │   └── ...
│   └── package.json
├── server/          # Node.js Backend
│   ├── config/      # Database configuration
│   ├── controllers/ # Request handlers
│   ├── models/      # Mongoose models (User, Resume)
│   ├── routes/      # API routes
│   ├── server.js    # Application entry point
│   └── package.json
├── .env             # Environment variables (created after setup)
└── README.md
```

## 📋 Usage

1. Sign up for a new account.
2. Log in to your dashboard.
3. Add your personal details and resume sections.
4. Choose a template and preview your resume.
5. Download or share your professional resume.
6. Visit `/tailor-resume` to get AI-powered suggestions for your resume!

## 📄 License

ISC
