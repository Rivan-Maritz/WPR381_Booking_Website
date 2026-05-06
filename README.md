# 🎟️ Smart Event Management & Ticketing Platform

A full-stack web application built for **Advanced Events (Pty) Ltd** to manage events, ticket bookings, and customer enquiries. The system replaces manual spreadsheets and disconnected tools with a secure, scalable, and role-aware platform.

---

## 📋 Project Overview

The Smart Event Management and Ticketing Platform allows administrators to manage events and view analytics, while standard users can browse events, book tickets, and submit enquiries. The system enforces role-based access control, automated capacity validation, and secure authentication throughout.

---

## 🛠️ Technologies Used

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Templating | EJS (Embedded JavaScript Templates) |
| Database | MongoDB + Mongoose ODM |
| Authentication | express-session / JSON Web Tokens (JWT) |
| Password Hashing | bcrypt |
| Styling | Bootstrap / CSS3 |
| Environment Config | dotenv |
| Dev Tool | nodemon |
| Version Control | Git & GitHub |

---

## 👥 Team Members & Roles

| Name | Role | Responsibilities |
|---|---|---|
| [Name 1] | Team Lead / Full-Stack Contributor | GitHub setup, MVC scaffold, Express entry point, route wiring, search & filtering logic |
| [Name 2] | Backend Developer | Event CRUD controllers, booking logic, capacity validation middleware, Express routes |
| [Name 3] | Frontend Developer | EJS templates and partials, CSS/Bootstrap styling, responsive layout |
| [Name 4] | Database Engineer | Mongoose schemas, validation rules, seed data, admin analytics queries |
| [Name 5] | Security / DevOps Engineer | bcrypt hashing, session/JWT auth, RBAC middleware, error handling, contact enquiry controller |

---

## 📁 Project Structure

```
smart-event-platform/
├── controllers/
│   ├── authController.js
│   ├── eventController.js
│   ├── bookingController.js
│   ├── contactController.js
│   └── dashboardController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── User.js
│   ├── Event.js
│   ├── Booking.js
│   └── Enquiry.js
├── routes/
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   ├── bookingRoutes.js
│   └── contactRoutes.js
├── views/
│   ├── partials/
│   │   ├── navbar.ejs
│   │   └── footer.ejs
│   ├── home.ejs
│   ├── auth.ejs
│   ├── events.ejs
│   ├── dashboard.ejs
│   └── contact.ejs
├── public/
│   ├── css/
│   └── js/
├── .env.example
├── .gitignore
├── app.js
├── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local) or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-event-platform.git
cd smart-event-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Then fill in your values:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/smart-events
SESSION_SECRET=your_secret_key_here
JWT_SECRET=your_jwt_secret_here
```

### 4. (Optional) Seed the Database

```bash
npm run seed
```

### 5. Start the Development Server

```bash
npm run dev
```

The app will be running at **http://localhost:3000**

---

## 🔐 Default Admin Account

After seeding, you can log in with the default admin credentials:

```
Email:    admin@advancedevents.co.za
Password: Admin@1234
```

> ⚠️ Change these credentials immediately in a production environment.

---

## 🌐 Portal Pages

| Page | Route | Access |
|---|---|---|
| Home / Event Listing | `/` | Public |
| Register / Login | `/auth/register` `/auth/login` | Public |
| Event Management | `/admin/events` | Admin only |
| Booking & Dashboard | `/dashboard` | Authenticated users |
| Contact / Enquiries | `/contact` | Public (view: Admin only) |

---

## ✅ Functional Features

- User registration and login with hashed passwords
- Role-based access control (Admin vs Standard User)
- Event creation, editing, and deletion (Admin only)
- Ticket booking with automated capacity validation
- User booking history dashboard
- Admin analytics (total bookings, popular events, capacity usage)
- Event search and filtering by date, category, and availability
- Contact/enquiry form with admin management view

---

## 🏗️ Architecture

The system follows the **MVC (Model-View-Controller)** pattern:

- **Models** — Mongoose schemas defining data structure and validation
- **Views** — EJS templates for server-side rendered HTML
- **Controllers** — Business logic handling requests and responses
- **Middleware** — Authentication, authorisation, and error handling layers

---

## 📸 Screenshots

> *(Add screenshots of your running application here)*

---

## 💭 Reflection

> *(Optional — briefly describe challenges faced, lessons learned, and what your team would do differently)*

---

## 📄 License

This project was developed as an academic submission for **Belgium Campus iTversity** and is intended for educational purposes only.
