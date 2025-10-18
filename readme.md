# Hostel360

A full-stack **PG & Hostel Management System** that enables users to browse available hostels, book rooms, and manage hostel amenities efficiently. The platform offers secure user authentication, an intuitive dashboard, real-time booking updates, and seamless online payments through Razorpay.

---

## 🚀 Features

### ✨ Frontend

- **User Authentication**

  - Secure registration and login system.
  - Admin authentication with restricted access to manage hostels, rooms, and bookings.

- **Hostel Dashboard**

  - Displays a list of available PGs/Hostels with powerful search and filter options.
  - Detailed room view showcasing amenities, pricing, and photos.

- **Booking Management**

  - Users can select rooms and complete bookings online.
  - Integrated **Razorpay** payment gateway for secure and smooth transactions.

- **Admin Features**

  - Admins can approve/reject hostel listing requests submitted by owners.
  - View and manage all hostels, rooms, and bookings from a single dashboard.

- **Responsive Design**
  - Fully optimized for desktops, tablets, and mobile devices.

---

### ⚙️ Backend

- **Authentication API**

  - Secure token-based authentication.
  - Role-based access control for users and admins.

- **Hostel & Room Management API**

  - CRUD operations for hostels, rooms, users, and bookings.

- **Real-Time Updates**

  - WebSocket (optional) support for live booking status updates.

- **Payment Integration**
  - Razorpay checkout integrated for fast, secure online payments.

---

### 🛢️ Database

- **MongoDB Atlas** — Cloud database storage with high scalability and reliability.

---

## 🖥️ Tech Stack

| Technology         | Description                         |
| :----------------- | :---------------------------------- |
| **Frontend**       | React.js, Tailwind CSS, Axios       |
| **Backend**        | Node.js, Express.js                 |
| **Database**       | MongoDB Atlas                       |
| **Hosting**        | Vercel (Frontend), Render (Backend) |
| **Payments**       | Razorpay Integration                |
| **Authentication** | JWT (JSON Web Tokens)               |

---

## 🚀 Deployment

### 🌐 Live Application

- [Frontend (Vercel)](https://hostel360-kappa.vercel.app/)

### ☁️ Hosting

- **Frontend** — Deployed on **Vercel**.
- **Backend** — Deployed on **Render**.
- **Database** — Managed with **MongoDB Atlas** (Free Tier).

---

## 🛠️ Setup Instructions (Run Locally)

### 📋 Prerequisites

- Node.js installed
- MongoDB Atlas account (or local MongoDB)

---

### 🔥 Steps to Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Abhishek-Dhamshetty/hostel360.git
   cd hostel360
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables Setup:**

   - Create a `.env` file in the root directory.
   - Add the following environment variables:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Start the Development Server:**

   ```bash
   npm start
   ```

5. **Access the Application:**
   - Frontend: [https://hostel360-kappa.vercel.app/](https://hostel360-kappa.vercel.app/)
   - Backend: Deployed on Render.

---

### 🚀 Features

- **User Authentication:** Secure login and registration.
- **Admin Panel:** Manage hostels, rooms, and user bookings.
- **Hostel Listings:** Search, view details, and filter hostels.
- **Booking System:** Book rooms with real-time availability check.
- **Online Payment Integration:** Seamless Razorpay checkout flow.
- **Responsive Design:** Optimized for mobile, tablet, and desktop.
- **Real-time Updates:** Live booking status using WebSockets.

---

### 💳 Razorpay Payment Integration

- Users can securely make payments for hostel bookings.
- Integrated Razorpay Checkout with proper success and failure handling.
- Payments are logged and bookings are confirmed upon successful payment.

---

### 🏗 Tech Stack

- **Frontend:** React.js, Tailwind CSS, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Hosting:** Vercel (Frontend), Render (Backend)

---

### 📂 Folder Structure

```
/hostel360
  ├── /client  (Frontend Code)
  ├── /server  (Backend Code)
  ├── README.md
  └── package.json
```

---

### 🛠 Future Enhancements

- Implement Admin Dashboard for Payment Tracking.
- Add User Reviews & Ratings for Hostels.
- Multi-city Hostel Listings.
- Enhanced UI/UX with animations and transitions.

---

Built with ❤️ by Abhishek Dhamshetty

Built with ❤️ by Bhargav Dhamshetty

### 🤝 Contribution

Contributions are always welcome!  
Feel free to fork the repo, make changes, and raise a pull request.

---

### 📞 Contact

For any queries or collaboration:

- **Abhishek Dhamshetty**
- GitHub: [@Abhishek-Dhamshetty](https://github.com/Abhishek-Dhamshetty)
- Email: abhishekdhamshetty@gmail.com

---
