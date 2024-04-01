import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import serviceRoutes from "./routes/service.route.js";
import emergencyRouter from "./routes/emergency.route.js";

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


app.use("/api/user", userRoutes);
app.use("/api/service", serviceRoutes);
app.use('/api/emergencies', emergencyRouter);
