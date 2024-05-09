import express from "express";
import Stripe from "stripe";
import Appointment from "../models/appointment.model.js";
import nodemailer from "nodemailer";

const router = express.Router();
const stripe = new Stripe(
  "sk_test_51P3MV5C4I6XcL6M5Rey0iJK44zY67cSJHX6S5HuFxhtpf8821AAW3PzBvgcArEE9XHvet3g6DcEOMMRCqQJ4LdKd00Ko9AMfYE",
  {
    apiVersion: "2020-08-27",
  }
);
const stripeWebhookSecret =
  "whsec_018bf665dc6a24d5666037fee2bc7dddb8864df1c6638cca2babb7ce94f10784";

// Nodemailer transporter setup for Google SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vehicleservicemanagementsystem@gmail.com",
    pass: "xyoy dfso gjez hlxo",
  },
});

// Webhook endpoint
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const rawBody = req.body; 
    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        stripeWebhookSecret
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const appointmentId = session.metadata.appointmentId;
        const amountPaid = session.amount_total / 100;

        try {
          const appointment = await Appointment.findById(appointmentId).populate('userId');
          if (!appointment) {
            console.error("Appointment not found");
            return res.status(404).send("Appointment not found");
          }
          appointment.amount = amountPaid;
          appointment.isPaid = true;
          const user = appointment.userId;
          const userEmail = user.email;

          await appointment.save();

          
          const mailOptions = {
            from: "vehicleservicemanagementsystem@gmail.com",
            to: userEmail, 
            subject: "Payment Confirmation",
            text: `Your payment of LKR ${amountPaid} was successfully received.`,
          };

          await transporter.sendMail(mailOptions);
        } catch (error) {
          console.error("Error updating appointment or sending email:", error);
          return res.status(500).json({ error: "Error updating appointment or sending email" });
        }

        return res.status(200).json({ received: true });
      } else {
        console.log(`Unhandled event type: ${event.type}`);
      }

      res.status(200).end();
    } catch (err) {
      console.error("Webhook error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

export default router;
