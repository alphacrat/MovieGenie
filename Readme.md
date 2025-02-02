# MovieGenie

MovieGenie is a web application that allows users to search for movies, view details, and manage their favorite lists.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js, Redux
- **Database**: PostgreSQL (hosted on Aiven)
- **Others**: Docker, Nginx

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Docker
- PostgreSQL

## Getting Started

### Backend

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/MovieGenie.git
   cd MovieGenie/backend
   ```

2. Install dependencies:

   ```bash
   npm install && npm run build
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory and add the following:

   ```env
   PORT=8000
   DATABASE_URL="postgres://avnadmin:*password*@movie-genie-v1-cmh-entry-exit.f.aivencloud.com:23427/defaultdb?sslmode=require"

   ```

4. Start the backend server:
   ```bash
   npm start
   ```

The backend server will be running at `http://localhost:8000`.

### Frontend

1. Navigate to the frontend directory:

   ```bash
   cd ../movie Recommender
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `movie Recommender` (frontend) directory and add the following:

   ```env
   VITE_TMDB_API_KEY
   VITE_GEMINI_API_KEY
   VITE_BACKEND_URL = https://moviegenie-backend-alphacrat.onrender.com
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The frontend application will be running at `http://localhost:5432`.

## Running with Docker

1. Build and run the Docker containers:
   ```bash
   docker-compose up --build
   ```

This will start both the backend and frontend services.

## Additional Information

- Ensure PostgreSQL is running and accessible from your local machine.
- Update the `DATABASE_URL` in the `.env` file with your actual Aiven PostgreSQL URL.
