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
// Import Appointment model
import Appointment from "./models/appointment.model.js";
import webhookRouter from "./routes/webhook.route.js";

import Stripe from "stripe";
import bodyParser from "body-parser";

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

app.use("/api/webhook", webhookRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const stripe = new Stripe(
  "sk_test_51P3MV5C4I6XcL6M5Rey0iJK44zY67cSJHX6S5HuFxhtpf8821AAW3PzBvgcArEE9XHvet3g6DcEOMMRCqQJ4LdKd00Ko9AMfYE",
  {
    apiVersion: "2020-08-27",
  }
);

const stripeWebhookSecret =
  "whsec_018bf665dc6a24d5666037fee2bc7dddb8864df1c6638cca2babb7ce94f10784";

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", userRoutes);

app.use("/api/service", serviceRoutes);
app.use("/api/emergencies", emergencyRouter);

app.use("/api/appointment", AppointmentRoutes);
app.use("/api/notice", NoticeRoutes);

app.use("/api/employee", employeeRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/Expense", expenserouter);
app.use("/api/Income", incomerouter);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/coupon", couponRoutes);
app.use(bodyParser.json());

app.post("/api/create-payment-session", async (req, res) => {
  try {
    const { appointment } = req.body;
    // Check if appointment or serviceId is undefined
    if (
      !appointment ||
      !appointment.serviceId ||
      !appointment.serviceId.price
    ) {
      throw new Error(
        "Invalid appointment data: serviceId or price is missing"
      );
    }

    if (isNaN(appointment.serviceId.price)) {
      throw new Error("Invalid price: NaN");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "lkr",
            product_data: {
              name: appointment.serviceId.name,
            },
            unit_amount: Math.round(appointment.serviceId.price * 100), // Convert price to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/payment-success?vehicleNo=${
        appointment.VehicleNo
      }&contactNo=${appointment.ContactNo}&date=${encodeURIComponent(
        appointment.Date
      )}&timeSlot=${appointment.TimeSlot}&serviceName=${encodeURIComponent(
        appointment.serviceId.name
      )}&amountPaid=${encodeURIComponent(appointment.serviceId.price)}`, // Redirect URL after successful payment
      cancel_url:
        "http://localhost:5173/dashboard?tab=myAppointments&cancelled=true", // Redirect URL if payment is canceled
      allow_promotion_codes: true,
      metadata: {
        appointmentId: appointment._id, // Assuming _id is the appointment ID
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating payment session:", error);
    res.status(500).json({ error: "Error creating payment session" });
  }
});

// app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   const rawBody = req.body;

//   try {
//     const event = stripe.webhooks.constructEvent(rawBody, sig, stripeWebhookSecret);

//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object;
//       const appointmentId = session.metadata.appointmentId;
//       const amountPaid = session.amount_total / 100;

//       try {
//         const appointment = await Appointment.findById(appointmentId);
//         if (!appointment) {
//           console.error('Appointment not found');
//           return res.status(404).send('Appointment not found');
//         }
//         appointment.amount = amountPaid;
//         appointment.isPaid = true;
//         await appointment.save();
//       } catch (error) {
//         console.error('Error updating appointment:', error);
//         return res.status(500).json({ error: 'Error updating appointment' });
//       }

//       return res.status(200).json({ received: true });
//     } else {
//       console.log(`Unhandled event type: ${event.type}`);
//     }

//     res.status(200).end();
//   } catch (err) {
//     console.error('Webhook error:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }
// });

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
