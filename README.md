# 🚀 GigFlow – Freelance Marketplace Platform

GigFlow is a full-stack freelance marketplace application where **clients can post gigs** and **freelancers can browse gigs, submit bids, and get hired**.  
The project demonstrates **modern full-stack development**, **REST APIs**, and **React Context-based state management**.

---

## ✨ Features

### 👤 Authentication
- User registration & login
- JWT-based authentication

### 📌 Gigs
- Clients can create gigs
- Freelancers can browse all open gigs
- View gig details
- Gig status tracking (`open`, `assigned`)

### 💰 Bids
- Freelancers can submit bids
- Clients can view bids on their gigs
- Client can hire one freelancer
- Other bids are rejected automatically

### 🔔 Notifications
- Freelancer notified when hired
- Freelancer notified when rejected
- Client notified when a new bid is received

---

## 🛠 Tech Stack

### Frontend
- React + TypeScript
- Vite
- React Router
- Context API
- Tailwind CSS
- shadcn/ui
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- REST APIs

---

## 📁 Project Structure

gigflow/
├── server/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── index.js
│ └── .env
│
├── client/
│ ├── src/
│ │ ├── components/
│ │ ├── context/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── types/
│ │ └── App.tsx
│ └── vite.config.ts
│
└── README.md


---

## 🚀 How to Run the Project

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/gigflow.git
cd gigflow

2️⃣ Start Backend
cd server
npm install
npm run dev

3️⃣ Start Frontend
cd client
npm install
npm run dev

API Endpoints
Auth

POST /api/auth/register

POST /api/auth/login

Gigs

GET /api/gigs

POST /api/gigs

GET /api/gigs/:id

Bids

POST /api/bids

GET /api/bids/:gigId

POST /api/bids/:bidId/hire