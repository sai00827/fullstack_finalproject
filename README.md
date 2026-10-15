# FarmDirect 

FarmDirect is a full-stack agriculture marketplace built to connect farmers directly with buyers. Farmers can list their produce, while buyers can browse products and place orders.

The project explores how a direct farmer-to-buyer platform could support fair pricing and reduce reliance on middlemen.

## Features

- Add and manage produce listings
- Browse products with images, prices, and location details
- Search products by name or location
- Filter products by category
- Sort products by price
- Place orders with quantity validation
- Track available stock and mark products as sold out
- Responsive interface for mobile and desktop

## Tech Stack

| Part | Technologies |
|------|--------------|
| Frontend | React, Vite, JavaScript, HTML, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Development tools | Git, GitHub, npm |

## Project Structure

```text
fullstack_finalproject/
├── farmdirect-frontend/    # React frontend
├── farmdirect-backend/     # Express API and database models
├── .gitignore
└── README.md
```

## Getting Started

### Requirements

Install the following before running the project:

- Node.js and npm
- Git
- MongoDB locally, or access to a MongoDB Atlas database

### 1. Clone the repository

```bash
git clone [https://github.com/sai00827/fullstack_finalproject.git](https://github.com/sai00827/fullstack_finalproject.git)
cd fullstack_finalproject
```

### 2. Set up the backend

Open a terminal and run:

```bash
cd farmdirect-backend
npm install
```

Create a `.env` file inside `farmdirect-backend`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/farmdirect
CLIENT_URL=http://localhost:5173
```

For MongoDB Atlas, replace `MONGODB_URI` with your database connection string.

Start your local MongoDB service if you are using a local database, then run:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

You can check the API at:

```text
http://localhost:5000/api/health
```

### 3. Set up the frontend

Keep the backend running. Open a second terminal from the project's root folder:

```bash
cd farmdirect-frontend
npm install
```

Create a `.env` file inside `farmdirect-frontend`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the URL shown in your terminal, usually:

```text
http://localhost:5173
```

If Vite uses a different port, update `CLIENT_URL` in the backend configuration to match it.

## How It Works

```text
React frontend
      ↓
Express REST API
      ↓
MongoDB database
```

The frontend sends requests to the backend to load products, manage listings, and place orders. The backend validates the requests and reads or updates data in MongoDB.

## API Endpoints

### Products

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/products` | Get products, with supported search and filtering |
| GET | `/api/products/:id` | Get a single product |
| POST | `/api/products` | Create a product listing |
| PATCH | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

### Orders

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/orders` | Get orders |
| POST | `/api/orders` | Create an order |
| PATCH | `/api/orders/:id/status` | Update an order's status |

## Current Scope

FarmDirect is a student project, not a production marketplace.

Authentication, online payments, and real-time delivery tracking are not included in the current version. The ordering flow currently handles one selected product at a time rather than a complete multi-product checkout.

## Planned Improvements

- User registration and login
- Role-based access for farmers and buyers
- Multi-product cart and checkout
- Online payment integration
- Order tracking
- Automated testing

## What I Learned

- Building reusable React components
- Creating REST APIs with Express
- Working with MongoDB and Mongoose
- Connecting a frontend to a backend
- Handling forms, validation, and application state
- Managing a project with Git and GitHub

## Repository

https://github.com/sai00827/fullstack_finalproject

## Author

Sai Charan  
GitHub: [@sai00827](https://github.com/sai00827)
