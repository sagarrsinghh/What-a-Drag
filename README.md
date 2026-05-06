# Drag Clothing

A modern, full-stack e-commerce platform for an apparel brand, featuring a dynamic frontend with rich animations and a robust, scalable backend.

## 🚀 Tech Stack

### Frontend (`drag-clothing-frontend`)
*   **Framework:** React 19
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS v4
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **Routing:** React Router v7
*   **HTTP Client:** Axios

### Backend (`drag-clothing-backend`)
*   **Framework:** NestJS 11
*   **Database ORM:** TypeORM
*   **Database:** MySQL
*   **Authentication:** Passport, JWT, bcrypt
*   **Payments:** Razorpay
*   **Emails:** Nodemailer

---

## 📂 Project Structure

The project is structured as a monorepo containing two main directories:

*   **`drag-clothing-frontend/`**: Contains the React/Vite application.
*   **`drag-clothing-backend/`**: Contains the NestJS RESTful API server.

---

## 🛠️ Setup & Installation

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn
*   MySQL Server (Running locally or hosted)

### 1. Database Setup
1.  Ensure your MySQL server is running.
2.  Create a database for the application (e.g., `drag_clothing`).

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd drag-clothing-backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Environment Variables:
    Create a `.env` file in the `drag-clothing-backend` directory and configure the following required variables (adjust according to your setup):
    ```env
    # Database configuration
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=drag_clothing

    # JWT Authentication
    JWT_SECRET=your_jwt_secret

    # Razorpay Keys
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret

    # Email configuration (Nodemailer)
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_app_password
    ```
4.  Start the development server:
    ```bash
    npm run start:dev
    ```
    *The server will typically start on `http://localhost:3000`.*

### 3. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd drag-clothing-frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Environment Variables:
    Create a `.env` file in the `drag-clothing-frontend` directory if required by your API base URL configuration (e.g., `VITE_API_URL=http://localhost:3000`).
4.  Start the development server:
    ```bash
    npm run dev
    ```
    *The application will typically be available at `http://localhost:5173`.*

---

## 🔒 Security & Environment Variables
*   **Do NOT** commit `.env` files to version control. They are ignored by default in the `.gitignore` file.
*   Ensure strong secrets are used in production environments for JWT and database credentials.

---

## 🤝 Contributing
1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📝 License
This project is proprietary and confidential. Unauthorized copying or distribution of this code is strictly prohibited.
