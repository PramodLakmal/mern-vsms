import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";

import AppointmentRoutes from "./routes/appointment.route.js";
import NoticeRoutes from "./routes/notice.route.js";

import serviceRoutes from "./routes/service.route.js";
import emergencyRouter from "./routes/emergency.route.js";

import employeeRoutes from "./routes/employee.route.js";
import leaveRoutes from "./routes/leave.route.js";
import salaryRoutes from "./routes/salary.route.js";
import authRoutes from "./routes/auth.route.js";
import expenserouter from "./routes/expense.route.js";
import incomerouter from "./routes/expense.route.js";
import feedbackRoutes from "./routes/feedback.route.js";
import couponRoutes from "./routes/coupon.route.js";
import cookieParser from "cookie-parser";


dotenv.config();
 // This line is important!

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());
app.use(cookieParser());


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


app.use("/api/user", userRoutes);

app.use("/api/service", serviceRoutes);
app.use('/api/emergencies', emergencyRouter);

app.use("/api/appoitment", AppointmentRoutes);
app.use("/api/notice", NoticeRoutes);

app.use("/api/employee", employeeRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/Expense", expenserouter);
app.use("/api/Income", incomerouter);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/coupon", couponRoutes)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ 
    success: false,
    statusCode,
    message
   });
  });

