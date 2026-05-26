# clinic-flow-be-v2
Clinic Flow | Patient Appointment Booking &amp; Doctor Confirmation System
# Clinic Flow

Simple MERN Stack Patient Appointment Booking & Doctor Confirmation System.

---

## 🚀 Features

* User Login & Register
* Doctor Login
* Book Appointment
* Doctor Confirm Appointment
* Complete Appointment
* Appointment Status Updates
* Email Notifications
* Protected Routes
* Prevent Past Date Booking
* Disable Sunday Appointments

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

---

## 📂 Folder Structure

```bash
clinic-flow/
│
├── client/
├── server/
└── README.md
```

---

## ⚙️ Environment Variables

Create `.env` file in server folder.

```env
PORT=5000

MONGO_URI=your_mongodb_url

JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

---

## 📦 Installation

### Clone Project

```bash
git clone https://github.com/your-username/clinic-flow.git
```

### Install Frontend

```bash
cd client
npm install
```

### Install Backend

```bash
cd server
npm install
```

---

## ▶️ Run Project

### Start Backend

```bash
npm run server
```

### Start Frontend

```bash
npm run dev
```

---

## 🌐 API Routes

```bash
POST   /api/auth/register
POST   /api/auth/login

POST   /api/appointments/create
GET    /api/appointments/doctor/:id
PUT    /api/appointments/update/:id
```

---

## 👨‍⚕️ Appointment Flow

### Patient

* Register/Login
* Book Appointment
* Select Date & Slot

### Doctor

* View Appointment Requests
* Confirm Appointment
* Complete Appointment

---

## 📧 Email Notifications

Patients receive confirmation emails after doctor approval.

---

## 🔒 Validations

* No past date booking
* No Sunday appointments
* Slot validation
* Protected APIs

---

## 📜 License

MIT License

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub.
