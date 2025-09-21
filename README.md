# RTI Auto Generator

An AI-powered platform for automating Right to Information (RTI) applications and managing government information requests.

## Features

- AI-powered RTI application drafting
- Multi-language support (Hindi, Marathi, Tamil, Bengali)
- Automated department and PIO suggestions
- Application tracking and appeal management
- Bulk filing capabilities
- Real-time status updates

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI**: GPT, BERT
- **Authentication**: JWT
- **Payment**: Razorpay/Stripe

## Project Structure

```
rti-auto-generator/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file with required environment variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Environment Variables

### Backend (.env)
- PORT: Server port number
- MONGODB_URI: MongoDB connection string
- JWT_SECRET: Secret key for JWT
- NODE_ENV: Development/Production environment

### Frontend (.env)
- REACT_APP_API_URL: Backend API URL
- REACT_APP_STRIPE_KEY: Stripe public key (if using Stripe)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 