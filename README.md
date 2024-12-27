# Capx: Stock Portfolio Management Application

Capx is a web application designed for managing stock portfolios. It provides users with a simple interface to track and manage their stocks. The application uses **React** for the frontend and **Spring Boot** for the backend, integrating the **AlphaVantage API** for stock data.

## Features

### Main Page (Stocks List)

- Displays a list of stocks retrieved from the AlphaVantage API.
- Each stock has an **Add** button to add it to the user’s portfolio.
- At the top of the page, a **Dashboard** button navigates to the user’s portfolio dashboard.

### User Dashboard

- Displays a table of all stocks added by the user.
- Includes options to **Edit** and **Delete** stocks in the portfolio.
- Provides an overview of the user's portfolio with actionable insights.

### Additional Functionality

- The frontend is deployed on **Vercel**.
- The backend is deployed on **Railway.app**.

## Limitations

- The application uses the free AlphaVantage API, which allows only **25 requests per day**. This limitation may affect the availability of live stock data.

## Steps to Run the Project Locally

### Prerequisites

1. Install **Node.js** (for React frontend).
2. Install **Java 17** and **Maven** (for Spring Boot backend).
3. Set up a **MySQL** database.

### Frontend

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd capx-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the frontend directory and add the following:
   ```env
   REACT_APP_API_URL=<your-backend-url>
   ```
   Replace `<your-backend-url>` with the deployed backend URL or `http://localhost:8080` for local testing.
4. Run the development server:
   ```bash
   npm start
   ```
5. Access the frontend at `http://localhost:3000`.

### Backend

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd capx-backend
   ```
2. Update the `application.properties` file with your database credentials and AlphaVantage API key:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/capx
   spring.datasource.username=<your-db-username>
   spring.datasource.password=<your-db-password>
   alphavantage.api.key=<your-api-key>
   ```
3. Build and run the backend:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
4. The backend will be available at `http://localhost:8080`.

## Assumptions

- Users are expected to have a basic understanding of Node.js and Java development environments.
- The MySQL database should be pre-configured with necessary permissions.

## Links

- Frontend (Vercel): https://capx-assignment.vercel.app/
- Backend (Railway):https://capx-backend-production.up.railway.app/


---



