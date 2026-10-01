# College Placement Management System

## Project Description

The College Placement Management System is a full-stack web application developed using the MERN stack. It provides a centralized platform for students and placement administrators to manage college placement activities.

## Objectives

- Provide student registration and login
- Maintain student placement profiles
- Display available placement opportunities
- Automatically check student eligibility
- Allow students to apply for eligible jobs
- Allow students to track application status
- Allow administrators to create and delete placement jobs
- Allow administrators to manage student applications

## Technologies Used

### Frontend
- React.js
- JavaScript
- HTML
- CSS
- Vite

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- Mongoose

### Security
- JWT Authentication
- bcrypt Password Hashing

### Development Tools
- Visual Studio Code
- Git
- GitHub
- MongoDB

## Main Features

### Student Module

- Student registration
- Student login
- Student profile
- View placement opportunities
- Automatic eligibility checking
- Apply for jobs
- View submitted applications
- Track application status

### Administrator Module

- Admin login
- Add placement jobs
- View placement jobs
- Delete placement jobs
- View student applications
- Update application status

## Eligibility Checking

The system checks student eligibility using:

- CGPA
- Branch

A student can apply only when the eligibility requirements of the job are satisfied.

## Application Status

The system supports the following application statuses:

- Applied
- Under Review
- Shortlisted
- Interview
- Selected
- Rejected

## System Architecture

React Frontend  
↓  
REST API / HTTP  
↓  
Node.js + Express  
↓  
MongoDB Database

## Database Collections

- Users
- Jobs
- Applications

## Project Structure

```text
college-placement-management
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── README.md
└── .gitignore
