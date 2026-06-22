import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRouter.js';
import contactRoutes from './routes/contactRoutes.js';
import userRotes from './routes/userRotes.js'
import appointmentRoutes from "./routes/appointmentRoutes.js"
import doctorRoutes from "./routes/doctorRoutes.js"
import visitorRoutes from './routes/visitorRoute.js'

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

connectDB();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://clinic-flow.yraviprakash.com",
      "https://www.yraviprakash.com",
      "https://yraviprakash.com",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send({message: 'Hello World!'});
});

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/user', userRotes)
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctor", doctorRoutes);
// visitors
app.set("trust proxy", true);
app.use("/api/visitors", visitorRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});