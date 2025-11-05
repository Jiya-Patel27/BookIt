# 🌍 BookIt – Experiences & Slots

A full-stack web application where users can browse travel experiences, view available slots, apply promo codes, and complete bookings.  
Built as part of a **Fullstack Intern Assignment** using React, TypeScript, TailwindCSS, Node.js, and MongoDB.
The frontend design is a replica of the provided [Figma](https://www.figma.com/design/8X6E1Ev8YdtZ3erV0Iifvb/HD-booking?node-id=0-1&p=f&t=K4scwnxfIHmfbb2a-0) link.


---
## 🚀 Live Demo
> ⚠️ **Note:** The backend is hosted on **Render (Free Tier)**, which goes to sleep after 15 minutes of inactivity.  
When first accessed, it may take **2–5 minutes** to wake up — during this time, you might see *“Could not load experience.”*
After the backend loads, everything works instantly.

Backend API: [Book-It Backend](https://bookit-d8mj.onrender.com)  
Frontend: [Book-It Frontend](https://book-it-plum.vercel.app/)  
GitHub Repository: [Book-It](https://github.com/Jiya-Patel27/BookIt)

---

## 🧩 Tech Stack

### Frontend
- ⚛️ **React + TypeScript (Vite)**
- 🎨 **TailwindCSS**
- 🔄 **Axios**
- 🧭 **React Router DOM**

### Backend
- 🟢 **Node.js + Express**
- 🍃 **MongoDB (Mongoose)**
- 🔐 **CORS**
- ⚙️ **dotenv**
- ☁️ **Render**

---

## ⚙️ Local Setup

### Backend
1. cd backend  
2. cp .env.example .env  
3. npm install  
4. npm run seed  
5. npm run dev  

### Frontend
1. cd frontend  
2. cp .env.example .env  
3. npm install  
4. npm run dev  

---

## 🧭 Application Flow

1. Home Page – lists all experiences from backend
2. Details Page – displays selected experience info + available slots
3. Checkout Page – collects user info, applies promo codes
4. Result Page – confirms booking success or failure
   
   - Home → Details → Checkout → Result 

---

## 💾 Promo Codes

| Code    | Type       | Value    |
| ------- | ---------- | -------- |
| SAVE10  | Percentage | 10% off  |
| FLAT100 | Flat       | ₹100 off |

---

## 🧰 API Endpoints

| Method | Endpoint               | Description                   |
| ------ | ---------------------- | ----------------------------- |
| GET    | `/api/experiences`     | List all experiences          |
| GET    | `/api/experiences/:id` | Get single experience details |
| POST   | `/api/bookings`        | Create a booking              |
| POST   | `/api/promo/validate`  | Validate promo code           |

---
## 🧠 Features

1. Dynamic data from backend
2. Prevents double-booking
3. Form & promo code validation
4. Displays loading/success/failure states
5. Hosted backend and frontend for review

---

## 🧑‍💼 Author

**Name:** Jiya Patel  
**Email:** jiyapatel4892@gmail.com  
**GitHub:** [Jiya-Patel27](https://github.com/Jiya-Patel27)

---
