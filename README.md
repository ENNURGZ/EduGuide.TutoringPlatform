# EduGuide Tutoring Platform

EduGuide is a modern web application designed to connect students with private tutors. It features a robust .NET 9 backend and a dynamic React frontend, providing a seamless experience for browsing listings, managing requests, and real-time messaging.

## Project Demo

[Watch the Project](https://www.youtube.com/watch?v=mAfYmrtGJMg)

## Tech Stack

### Backend
*   **.NET 9 Web API**: High-performance RESTful API.
*   **Entity Framework Core**: Code-First ORM for database management using SQLite.
*   **JWT Authentication**: Secure role-based access control (Admin/Tutor/Student).
*   **Swagger UI**: Integrated API documentation (available at `/swagger`).
*   **Advanced API Features**: Implements Pagination, Filtering, and Sorting logic.

### Frontend
*   **React (Vite)**: Fast and modern frontend build tool.
*   **JavaScript (JSX)**: **Note:** This project is built using standard JavaScript (ES6+)
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **Lucide React**: Beautiful & consistent icons.
*   **Axios**: For handling HTTP requests.

## Features

*   **Role-Based Access**:
    *   **Student**: Can browse listings, filter by category/price, send lesson requests, and chat with tutors.
    *   **Tutor**: Can create and manage course listings (Online/Face-to-Face), accept/reject requests, and chat with students.
    *   **Admin**: Full control over categories, listings, and users.
*   **Listing Management**: Tutors can publish listings with images, prices, and lesson modes.
*   **Request System**: Students can request lessons; proper validation prevents duplicate requests.
*   **Real-Time Messaging**: Integrated chat system becomes active once a lesson request is accepted.
*   **Protected Routes**: Frontend routing is secured using a `RequireAuth` wrapper to ensure only authorized users access specific pages.

## Authentication & Security

*   **JWT (JSON Web Tokens)**: Used for secure stateless authentication.
*   **Protected Routes**: implemented via `src/components/RequireAuth.jsx`.
*   **Passwords**: Hashed securely using BCrypt.

## Installation & Setup

### Prerequisites
*   .NET 9 SDK
*   Node.js & npm

### Backend Setup
1.  Navigate to the API folder:
    ```bash
    cd backend/EduGuide.API
    ```
2.  Restore dependencies:
    ```bash
    dotnet restore
    ```
3.  Run the application (Database will be created automatically):
    ```bash
    dotnet run
    ```
    *API will run at `http://localhost:5024`*

### Frontend Setup
1.  Navigate to the client folder:
    ```bash
    cd frontend/eduguide-client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *App will run at `http://localhost:5173`*

### Default Admin Login
*   **Email**: `admin@eduguide.com`
*   **Password**: `Admin123!`

## Project Structure

### Backend (`EduGuide.API/`)
```text
EduGuide.API/
├── Controllers/       # API Endpoints (Auth, Category, Listing, Request, User)
├── DTOs/              # Data Transfer Objects (Input/Output models)
├── Models/            # Database Entities (User, Listing, Category, Request)
├── Data/              # Database Context (EF Core)
├── Helpers/           # Utilities (JwtHelper for Token generation)
├── Properties/        # Launch settings
├── wwwroot/           # Static files (User uploads)
├── appsettings.json   # Configuration (Connection strings, JWT settings)
└── Program.cs         # App entry point & Service configuration
```

### Frontend (`eduguide-client/src/`)
```text
src/
├── api/               # API service layers
├── components/        # Shared Components
├── pages/             # Application Pages
│   ├── auth/          # Login, Register
│   ├── public/        # HomePage, Listings, ListingDetails
│   ├── student/       # Student dashboard, Messages, MyRequests
│   ├── tutor/         # CreateListing, Dashboard (Tutor), Messages
│   └── system/        # NotFound, Unauthorized
├── routes/            # Route definitions (AppRouter)
├── assets/            # Static assets
├── App.jsx            # Root Component
└── main.jsx           # Entry point
```
