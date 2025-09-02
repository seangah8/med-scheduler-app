# Medical Scheduling System

A full-stack medical appointment scheduling application.

**Live Demo:** https://sheba-connect.vercel.app
**Demo Video:** https://drive.google.com/file/d/1_KTW3xdvPEmAH8tpJmq_fQpFe6SxRpam/view

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run seed    # Populate with sample data
npm run dev     # Start on port 3000
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend API URL
npm run dev     # Start on port 5173
```

## Architecture Decisions

**Database:** MongoDB with Mongoose
- Chosen for flexible document structure suitable for complex scheduling data
- Optimized indexes for appointment queries and doctor searches
- Unique constraints prevent appointment conflicts

**Authentication:** Phone-based OTP with JWT
- OTP stored in MongoDB with 5-min expiry  
- Verified OTP issues JWT in HTTP-only cookie  
- OTP delivery mocked by logging to console  
- Middleware checks JWT for protected routes  

**Frontend:** React + TypeScript + Redux
- Redux stores logged-in user, synced with session storage
- Multi-step booking flow with progress saved on refresh
- Responsive UI with loading states and error handling

**API:** RESTful Express.js with middleware pipeline
- Structured validation and error handling
- Async Local Storage for request context
- Comprehensive logging with Pino

## Features Implemented

### Core Requirements
- **User Authentication:** OTP-based login with JWT 
- **Adaptive Dashboard:** 
  - New users: Welcome screen with medical services overview
  - Returning users: upcoming and past appointments with management tools 
- **Booking Flow:**
  1. Medical Field Selection (autocomplete with details)
  2. Doctor Selection (with ratings and availability indicators) 
  3. Time Slot Selection (calendar with real-time availability)
  4. Appointment Confirmation (summary with virtual/in-person option)

### Additional Features
- Switch between virtual and in-person meetings
- PDF download for completed appointments
- Smart doctor recommendations (highest rated, earliest available)

## Deployment Details

**Frontend:** Deployed on Vercel
- Automatic deployment from main branch
- Environment variables configured in dashboard
- Custom domain: sheba-connect.vercel.app

**Backend:** Deployed on Render
- Build command: `npm run build`
- Start command: `npm start`
- Requires environment variables: `MONGODB_URI`, `JWT_SECRET`, `PORT`

**Database:** Compatible with MongoDB Atlas for production